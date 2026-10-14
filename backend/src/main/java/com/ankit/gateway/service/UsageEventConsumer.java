
package com.ankit.gateway.service;

import com.ankit.gateway.dto.UsageEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;

@Service
public class UsageEventConsumer {

    private static final Logger log =
            LoggerFactory.getLogger(UsageEventConsumer.class);

    private final ObjectMapper objectMapper;
    private final JdbcTemplate jdbcTemplate;

    public UsageEventConsumer(
            ObjectMapper objectMapper,
            JdbcTemplate jdbcTemplate) {
        this.objectMapper = objectMapper;
        this.jdbcTemplate = jdbcTemplate;
    }

    @KafkaListener(
            topics = "${gateway.usage.topic:usage-events}",
            groupId = "${spring.kafka.consumer.group-id:llm-gateway-usage}")
    public void consume(String json) throws Exception {
        UsageEvent event = objectMapper.readValue(json, UsageEvent.class);

        Timestamp createdAt = Timestamp.from(event.createdAt());

        int inserted = jdbcTemplate.update("""
                INSERT INTO usage_events
                    (event_id, api_key_hash, prompt_hash, cache_hit, created_at)
                VALUES (?, ?, ?, ?, ?)
                ON CONFLICT (event_id) DO NOTHING
                """,
                event.eventId(),
                event.apiKeyHash(),
                event.promptHash(),
                event.cacheHit(),
                createdAt);

        if (inserted == 1) {
            log.info("Usage event stored in PostgreSQL: {}", event.eventId());
        } else {
            log.info("Usage event already exists; skipped duplicate: {}",
                    event.eventId());
        }
    }
}
