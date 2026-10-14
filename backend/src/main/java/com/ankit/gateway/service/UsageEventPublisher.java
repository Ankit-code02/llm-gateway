package com.ankit.gateway.service;

import com.ankit.gateway.dto.UsageEvent;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class UsageEventPublisher {

    private static final Logger log =
            LoggerFactory.getLogger(UsageEventPublisher.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;
    private final String topic;

    public UsageEventPublisher(
            KafkaTemplate<String, String> kafkaTemplate,
            ObjectMapper objectMapper,
            @Value("${gateway.usage.topic:usage-events}") String topic) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
        this.topic = topic;
    }

    public void publish(String apiKey, String prompt, boolean cacheHit) {
        try {
            UsageEvent event = new UsageEvent(
                    UUID.randomUUID().toString(),
                    sha256(apiKey),
                    sha256(prompt.trim().replaceAll("\\s+", " ")),
                    cacheHit,
                    Instant.now());

            String json = objectMapper.writeValueAsString(event);

            kafkaTemplate.send(topic, event.eventId(), json)
                    .whenComplete((result, exception) -> {
                        if (exception != null) {
                            log.error("Failed to publish usage event");
                        }
                    });

        } catch (JsonProcessingException exception) {
            log.error("Failed to serialize usage event");
        }
    }

    private String sha256(String value) {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8));

            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 unavailable", exception);
        }
    }
}