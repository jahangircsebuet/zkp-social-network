package com.govt.module.controller;


import com.govt.module.request.*;
import com.govt.module.response.*;
import com.govt.module.jwt.JwtUtils;
import com.govt.module.model.EmailDetails;
import com.govt.module.model.Role;
import com.govt.module.model.RoleName;
import com.govt.module.model.User;
import com.govt.module.repository.RoleRepository;
import com.govt.module.repository.UserRepository;
import com.govt.module.request.LoginRequest;
import com.govt.module.response.LoginResponseDTO;
import com.govt.module.response.LogoutResponseDTO;
import com.govt.module.service.EmailService;
import com.govt.module.service.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder encoder;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    public AuthController(AuthenticationManager authenticationManager, UserRepository userRepository, RoleRepository roleRepository, BCryptPasswordEncoder passwordEncoder, JwtUtils jwtUtils, EmailService emailService) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
        this.emailService = emailService;
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestHeader Map<String,String> headers) {

        LoginResponseDTO response = new LoginResponseDTO();

        System.out.println("headers.size: " + headers.size());
        // TODO add header in apis and read auth token from header
        headers.forEach((key, value) -> {
            System.out.println("Header Name: " + key + " Header Value: " + value);
        });

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody @Valid LoginRequest loginRequest, BindingResult bindingResult) {
        System.out.println("/api/auth/login");
        LoginResponseDTO response = new LoginResponseDTO();

        if (bindingResult.hasErrors()) {
            Map<String, String> errorsMap = ControllerUtils.getErrors(bindingResult);
            response.setErrors(errorsMap);
            response.setSuccess(false);
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            try {
                System.out.println("before calling authenticationManager.authenticate");
                Authentication authentication = authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
                System.out.println("after calling authenticationManager.authenticate");

                SecurityContextHolder.getContext().setAuthentication(authentication);
                // jwt token for 24 hours
                String jwt = jwtUtils.generateJwtToken(authentication);
                System.out.println("jwt: " + jwt);

                UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
                List<String> roles = userDetails.getAuthorities().stream()
                        .map(item -> item.getAuthority())
                        .collect(Collectors.toList());

                Optional<User> user = userRepository.findByUsername(loginRequest.getUsername());
                if (user.isPresent()) {

                    User userToUpdate = user.get();
                    // store jwt token into user table
                    // TODO keep this into separate auth table later
                    userToUpdate.setJwtAuthToken(jwt);
                    userRepository.save(userToUpdate);

                    response.setUser(user.get());
                    response.setSuccess(true);
                    response.setMessage("Login successful!");
                    response.setJwt(jwt);
                } else {
                    response.setUser(null);
                    response.setSuccess(false);
                    response.setMessage("Login failed!");
                    response.setJwt(null);
                }


            } catch (Exception e) {
                System.out.println("exception occurred");
                e.printStackTrace();
                response.setSuccess(false);
                response.setMessage("Login failed!");
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/logout")
    public ResponseEntity<?> logout(@RequestParam Long userId) {
        System.out.println("api/auth/logout");
        LogoutResponseDTO response = new LogoutResponseDTO();

        // TODO read user from header
        Optional<User> user = userRepository.findById(userId);
        if (user.isPresent()) {
            try {
                // TODO clear auth token
                User userToUpdate = user.get();
                userToUpdate.setJwtAuthToken("");
                userRepository.save(userToUpdate);

                response.setSuccess(true);
                response.setMessage("Logout successful!");
            } catch (Exception e) {
                response.setSuccess(false);
                response.setMessage("Logout failed!");
            }
        } else {
            response.setSuccess(false);
            response.setMessage("User not found!");
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


/*    //role name add Example:- ROLE_ADMIN
    @PostMapping("/addRoles")
    public ResponseEntity<?> addRoles(@RequestBody Role role) {
        roleRepository.save(role);
        return ResponseEntity.ok(new MessageResponse("Role added successfully!"));
    }*/


    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody @Valid SignupRequest signUpRequest, BindingResult bindingResult) {
        SignupResponseDTO response = new SignupResponseDTO();

        System.out.println("signUpRequest.toString()");
        System.out.println(signUpRequest.toString());
        if (bindingResult.hasErrors()) {
            Map<String, String> errorsMap = ControllerUtils.getErrors(bindingResult);
            response.setErrors(errorsMap);
            response.setSuccess(false);

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            if (userRepository.existsByUsername(signUpRequest.getUsername())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Username is already taken!"));
            }

            if (userRepository.existsByEmail(signUpRequest.getEmail())) {
                return ResponseEntity
                        .badRequest()
                        .body(new MessageResponse("Error: Email is already in use!"));
            }

            // Create new user's account
            User user = new User();
            user.setEmail(signUpRequest.getEmail());
            // set email as username
            user.setUsername(signUpRequest.getEmail());
            user.setPassword(encoder.encode("dummy"));
            System.out.println("encoded password: " + encoder.encode("dummy"));

            Set<String> strRoles = signUpRequest.getRole();

            Set<Role> roles = new HashSet<>();
            if (strRoles == null) {
                Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                        .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                roles.add(userRole);
            } else {
                strRoles.forEach(role -> {
                    switch (role) {
                        case "admin":
                            Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(adminRole);

                            break;
                        case "mod":
                            Role modRole = roleRepository.findByName(RoleName.ROLE_MODERATOR)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(modRole);

                            break;
                        default:
                            Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
                            roles.add(userRole);
                    }
                });
            }

            try {
                user.setRoles(roles);
                userRepository.save(user);

                // step 2 send verification email
                EmailDetails verificationEmail = new EmailDetails();
                verificationEmail.setSubject("Govt Module (Identity Provider): Verify your email.");
                // TODO generate hash string (with expire time) user wise to uniquely identify user
                String emailBody = "Click below link to verify: \n http://localhost:3000/verify-email?email=" + user.getEmail();
                verificationEmail.setMsgBody(emailBody);
                verificationEmail.setRecipient(user.getEmail());
                emailService.sendSimpleMail(verificationEmail);

                response.setSuccess(true);
                response.setMessage("User registered successfully!");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } catch (Exception e) {
                response.setSuccess(false);
                response.setMessage("User registration failed!!");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
        }
    }
    @PostMapping("/verify-email")
    public ResponseEntity<?> verify_email(@RequestBody @Valid VerifyEmailDTO verifyEmailDTO, BindingResult bindingResult) {
        System.out.println("API /verify-email");
        VerifyEmailResponseDTO response = new VerifyEmailResponseDTO();
        if (bindingResult.hasErrors()) {
            Map<String, String> errorsMap = ControllerUtils.getErrors(bindingResult);
            response.setErrors(errorsMap);
            response.setSuccess(false);

            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } else {
            Optional<User> user = userRepository.findByEmail(verifyEmailDTO.getEmail());
            if (user.isPresent()) {
                User userToUpdate = user.get();

                if (verifyEmailDTO.getPassword().equals(verifyEmailDTO.getConfirmPassword())) {
                    try {
                        String hashed_password = encoder.encode(verifyEmailDTO.getPassword());
                        System.out.println("hash: " + hashed_password);
                        userToUpdate.setPassword(hashed_password);
                        userToUpdate.setEmailVerified(true);

                        // update user
                        userRepository.save(userToUpdate);
                        response.setSuccess(true);
                        response.setMessage("Email verified successfully!");
                    } catch (Exception e) {
                        e.printStackTrace();
                        response.setSuccess(false);
                        response.setMessage("Email verification failed!");
                    }
                } else {
                    response.setSuccess(false);
                    response.setMessage("Password does not match!");
                }
            } else {
                response.setSuccess(false);
                response.setMessage("User not found!");
            }
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/addrole")
    public StatusResponse addRolesWithId(@RequestBody AddRoleRequest addRoleRequest/*@RequestParam("userId") Long userId, @RequestParam("role") String roleName*/) {
        String status = null;
        Set<Role> roles = new HashSet<>();
        List<String> list = new ArrayList<>();
        User user = userRepository.findById(addRoleRequest.getUserId()).get();
        for (Role i : user.getRoles()) {
            list.add(i.getName().toString());
        }
        roles = user.getRoles();
        if (list.contains(addRoleRequest.getRole())) {

            status = "This role is already taken";
        } else {
            if (addRoleRequest.getRole().equals("ROLE_USER")) {
                Role UserRole = roleRepository.findByName(RoleName.ROLE_USER).get();
                roles.add(UserRole);
            } else if (addRoleRequest.getRole().equals("ROLE_ADMIN")) {
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN).get();
                roles.add(adminRole);
            } else {
                Role modRole = roleRepository.findByName(RoleName.ROLE_MODERATOR).get();
                roles.add(modRole);
            }
            user.setRoles(roles);
            userRepository.save(user);
            status = "Role registered successfully";
        }

        StatusResponse msg = new StatusResponse(status);
        return msg;
    }
}
