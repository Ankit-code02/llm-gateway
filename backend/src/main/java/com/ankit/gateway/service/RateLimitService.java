package com.ankit.gateway.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;

@Service
public class RateLimitService {

    private final StringRedisTemplate redisTemplate;
    private final int requestsPerMinute;

    public RateLimitService(
            StringRedisTemplate redisTemplate,
            @Value("${gateway.rate-limit.requests-per-minute:10}")
            int requestsPerMinute) {

        this.redisTemplate = redisTemplate;
        this.requestsPerMinute = requestsPerMinute;
    }

    public boolean isAllowed(String apiKey) {
        String redisKey = "rate-limit:" + apiKey;

        Long requests = redisTemplate.opsForValue().increment(redisKey);

        if (requests == null) {
            throw new IllegalStateException(
                    "Could not record request count in Redis");
        }

        if (requests == 1) {
            redisTemplate.expire(redisKey, Duration.ofMinutes(1));
        }

        return requests <= requestsPerMinute;
    }
}