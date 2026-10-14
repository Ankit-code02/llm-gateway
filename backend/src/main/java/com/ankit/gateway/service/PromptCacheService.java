package com.ankit.gateway.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.util.HexFormat;

@Service
public class PromptCacheService {

    private final StringRedisTemplate redisTemplate;
    private final long ttlMinutes;

    public PromptCacheService(
            StringRedisTemplate redisTemplate,
            @Value("${gateway.prompt-cache.ttl-minutes:5}")
            long ttlMinutes) {

        this.redisTemplate = redisTemplate;
        this.ttlMinutes = ttlMinutes;
    }

    public String normalizePrompt(String prompt) {
        return prompt.trim().replaceAll("\\s+", " ");
    }

    public String get(String apiKey, String prompt) {
        String key = buildKey(apiKey, prompt);
        return redisTemplate.opsForValue().get(key);
    }

    public void put(String apiKey, String prompt, String answer) {
        String key = buildKey(apiKey, prompt);

        redisTemplate.opsForValue().set(
                key,
                answer,
                Duration.ofMinutes(ttlMinutes));
    }

    private String buildKey(String apiKey, String prompt) {
        return "prompt-cache:"
                + sha256(apiKey)
                + ":"
                + sha256(normalizePrompt(prompt));
    }

    private String sha256(String value) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    value.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException(
                    "SHA-256 is not available", exception);
        }
    }
}