package com.govt.module.response;

import com.govt.module.model.User;
import lombok.Data;

import java.util.Map;

@Data
public class LoginResponseDTO {
    private User user;
    private String token;
    private String jwt;
    private boolean isAuthenticated;
    private boolean success;
    private Map<String, String> errors;
    private String message;

    @Override
    public String toString() {
        return "LoginResponseDTO{" +
                "user=" + user +
                ", token='" + token + '\'' +
                ", jwt=" + jwt +
                ", isAuthenticated=" + isAuthenticated +
                ", success=" + success +
                ", errors=" + errors +
                ", message='" + message + '\'' +
                '}';
    }
}
