package com.govt.module.request;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Data
public class VerifyEmailDTO {
    @NotBlank(message = "Email can not be empty!")
    @Email(message = "Invalid email!")
    private String email;
    @NotBlank(message = "Password field can not be empty!")
    @Size(min = 12, max = 16)
    private String password;
    @NotBlank(message = "Confirm password field can not be empty!")
    @Size(min = 12, max = 16)
    private String confirmPassword;
    @Override
    public String toString() {
        return "VerifyEmailDTO{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", confirmPassword='" + confirmPassword + '\'' +
                '}';
    }
}
