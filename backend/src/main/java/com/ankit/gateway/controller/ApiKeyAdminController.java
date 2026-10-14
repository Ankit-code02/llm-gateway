
package com.ankit.gateway.controller;

import com.ankit.gateway.service.ApiKeyService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController
@RequestMapping("/internal/api-keys")
public class ApiKeyAdminController {

    private final ApiKeyService apiKeyService;

    public ApiKeyAdminController(ApiKeyService apiKeyService) {
        this.apiKeyService = apiKeyService;
    }

    public record CreateKeyRequest(
            @NotBlank @Size(max = 100) String teamName,
            @NotBlank @Size(max = 100) String keyName) {
    }

    @PostMapping
    public Map<String, String> createKey(
            @Valid @RequestBody CreateKeyRequest request) {

        // Only allow this setup endpoint from the local computer.
        // Do not expose it directly to the internet.
        String rawKey;

        try {
            rawKey = apiKeyService.createTeamAndApiKey(
                    request.teamName(),
                    request.keyName());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, ex.getMessage());
        }

        return Map.of(
                "teamName", request.teamName().trim(),
                "keyName", request.keyName().trim(),
                "apiKey", rawKey,
                "warning", "Save this key now. It will not be shown again."
        );
    }
}
