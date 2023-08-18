package com.govt.module.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EmailResponseDTO {
    private boolean success;
    private Map<String, String> errors;
    private String message;
    @Override
    public String toString() {
        return "EmailResponseDTO{" +
                "success=" + success +
                ", errors=" + errors +
                ", message='" + message + '\'' +
                '}';
    }
}
