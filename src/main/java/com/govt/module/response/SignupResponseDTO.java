package com.govt.module.response;

import lombok.Data;

import java.util.Map;

@Data
public class SignupResponseDTO {
    private boolean success;
    private Map<String, String> errors;
    private String message;
    @Override
    public String toString() {
        return "SignupResponseDTO{" +
                "success=" + success +
                ", errors=" + errors +
                ", message='" + message + '\'' +
                '}';
    }
}
