
package com.ankit.gateway.service;

import com.ankit.gateway.entity.ApiKey;
import com.ankit.gateway.entity.Team;
import com.ankit.gateway.repository.ApiKeyRepository;
import com.ankit.gateway.repository.TeamRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class ApiKeyService {

    private final TeamRepository teamRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    public ApiKeyService(
            TeamRepository teamRepository,
            ApiKeyRepository apiKeyRepository) {
        this.teamRepository = teamRepository;
        this.apiKeyRepository = apiKeyRepository;
    }

    @Transactional
    public String createTeamAndApiKey(String teamName, String keyName) {
        if (teamName == null || teamName.isBlank()
                || teamName.length() > 100) {
            throw new IllegalArgumentException(
                    "Team name must contain 1 to 100 characters.");
        }

        if (keyName == null || keyName.isBlank()
                || keyName.length() > 100) {
            throw new IllegalArgumentException(
                    "API key name must contain 1 to 100 characters.");
        }

        if (teamRepository.findByName(teamName.trim()).isPresent()) {
            throw new IllegalArgumentException(
                    "A team with this name already exists.");
        }

        Team team = teamRepository.save(new Team(teamName.trim()));

        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);

        String rawKey = "lgw_" +
                Base64.getUrlEncoder()
                        .withoutPadding()
                        .encodeToString(randomBytes);

        ApiKey apiKey = new ApiKey(
                team,
                sha256(rawKey),
                keyName.trim());

        apiKeyRepository.save(apiKey);

        // Return the original key only once to the caller.
        return rawKey;
    }

    public boolean isValidApiKey(String rawKey) {
        if (rawKey == null || rawKey.isBlank()) {
            return false;
        }

        return apiKeyRepository
                .findByKeyHashAndActiveTrue(sha256(rawKey))
                .isPresent();
    }

    private String sha256(String value) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(java.nio.charset.StandardCharsets.UTF_8));

            StringBuilder result = new StringBuilder();

            for (byte b : hash) {
                result.append(String.format("%02x", b & 0xff));
            }

            return result.toString();
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException(
                    "SHA-256 is not available.", ex);
        }
    }
}
