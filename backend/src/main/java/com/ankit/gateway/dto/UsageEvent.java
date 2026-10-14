package com.ankit.gateway.dto;

import java.time.Instant;

public record UsageEvent(
        String eventId,
        String apiKeyHash,
        String promptHash,
        boolean cacheHit,
        Instant createdAt) {
}
