package com.ankit.gateway.controller;

import com.ankit.gateway.service.UsageAnalyticsService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Map;

@RestController
@RequestMapping("/internal/analytics")
public class AdminAnalyticsController {

    private static final Logger log =
            LoggerFactory.getLogger(AdminAnalyticsController.class);

    @PostConstruct
    public void checkAdminTokenConfiguration() {
        log.info("Admin token configured: {}",
                adminToken != null && !adminToken.isBlank());
    }

    private final UsageAnalyticsService usageAnalyticsService;

    @Value("${gateway.admin.token:}")
    private String adminToken;

    public AdminAnalyticsController(
            UsageAnalyticsService usageAnalyticsService) {
        this.usageAnalyticsService = usageAnalyticsService;
    }

    @GetMapping("/summary")
    public Map<String, Object> getSummary(
            @RequestHeader(
                    value = "X-Admin-Token",
                    required = false)
            String suppliedToken) {

        if (adminToken == null || adminToken.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Admin access is not configured");
        }

        if (suppliedToken == null
                || !MessageDigest.isEqual(
                adminToken.getBytes(StandardCharsets.UTF_8),
                suppliedToken.getBytes(StandardCharsets.UTF_8))) {
            throw new ResponseStatusException(
                    HttpStatus.UNAUTHORIZED,
                    "Missing or invalid admin token");
        }

        return usageAnalyticsService.getSummary();
    }
}