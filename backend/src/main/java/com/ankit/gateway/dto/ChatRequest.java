
package com.ankit.gateway.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ChatRequest(
        @NotBlank(message = "Prompt must not be empty")
        @Size(max = 10000, message = "Prompt must not exceed 10000 characters")
        String prompt
) {
}
