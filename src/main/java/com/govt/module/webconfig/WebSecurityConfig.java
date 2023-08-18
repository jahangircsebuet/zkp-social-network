package com.govt.module.webconfig;

import com.govt.module.jwt.AuthEntryPointJwt;
import com.govt.module.jwt.AuthTokenFilter;
import com.govt.module.service.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public BCryptPasswordEncoder  pwdEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }
    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(pwdEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
    @Override
    public void configure(WebSecurity web)
    {
        web.ignoring()
                .antMatchers( "/favicon.ico","/static/**","/resources/**", "/js/**", "/css/**", "/images/**");

    }
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .authorizeRequests()
            .antMatchers("/api/auth/signup").permitAll()
            .antMatchers("/api/auth/login").permitAll()
            .antMatchers("/api/auth/verify-email").permitAll()
            .antMatchers("/api/auth/logout").permitAll()
            .antMatchers("/api/passport/**").permitAll()
            .antMatchers("/api/driving-license/**").permitAll()
            .antMatchers("/api/identities/**").permitAll()
            .antMatchers("/api/challenge-question/**").permitAll()
            .antMatchers("/api/personalinformation/**").permitAll()
             .antMatchers("/api/test/**").permitAll()
             //.antMatchers("/api/test/all").permitAll()
            .antMatchers("/login").permitAll()
            .antMatchers("/registration").permitAll()

              //.antMatchers("/api/test/user").permitAll()

/*             .antMatchers("/api/test/user").hasAnyRole("USER","MODERATOR","ADMIN")
             .antMatchers("/api/test/mod").hasRole("MODERATOR")
             .antMatchers("/api/test/admin").hasRole("ADMIN")*/
               // .antMatchers("/api/test/user").hasRole("USER")
             .anyRequest().authenticated()
             .and()
             /*.formLogin()
             .loginPage("/login")
             .usernameParameter("username")
             .passwordParameter("password")
             .permitAll()
             .failureUrl("/login?error=true")
             .defaultSuccessUrl("/all")
             .and()*/
             .exceptionHandling().authenticationEntryPoint(unauthorizedHandler)
             .and()
             .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS)
             ;

        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }
}
