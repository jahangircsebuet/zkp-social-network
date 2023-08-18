package com.govt.module.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VerifyEmailResponseDTO {
    private boolean success;
    private Map<String, String> errors;
    private String message;
    @Override
    public String toString() {
        return "VerifyEmailResponseDTO{" +
                "success=" + success +
                ", errors=" + errors +
                ", message='" + message + '\'' +
                '}';
    }
}
