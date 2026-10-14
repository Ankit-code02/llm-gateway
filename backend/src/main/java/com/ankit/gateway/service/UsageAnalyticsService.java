
package com.ankit.gateway.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UsageAnalyticsService {

    private final JdbcTemplate jdbcTemplate;

    public UsageAnalyticsService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getSummary() {
        Long totalRequests = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usage_events",
                Long.class
        );

        Long cacheHits = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usage_events WHERE cache_hit = TRUE",
                Long.class
        );

        long total = totalRequests == null ? 0 : totalRequests;
        long hits = cacheHits == null ? 0 : cacheHits;

        double hitRate = total == 0
                ? 0.0
                : Math.round((hits * 10000.0) / total) / 100.0;

        return Map.of(
                "totalRequests", total,
                "cacheHits", hits,
                "cacheMisses", total - hits,
                "cacheHitRatePercent", hitRate
        );
    }
}
