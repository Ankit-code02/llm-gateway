package com.ankit.gateway.security;

import com.ankit.gateway.service.ApiKeyService;
import com.ankit.gateway.service.RateLimitService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class ApiKeyFilter extends OncePerRequestFilter {

    private final ApiKeyService apiKeyService;
    private final RateLimitService rateLimitService;

    @Value("${gateway.setup.enabled:false}")
    private boolean setupEnabled;

    public ApiKeyFilter(
            ApiKeyService apiKeyService,
            RateLimitService rateLimitService) {
        this.apiKeyService = apiKeyService;
        this.rateLimitService = rateLimitService;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return (setupEnabled && path.equals("/internal/api-keys"))
                || path.startsWith("/actuator")
                || path.startsWith("/internal/analytics/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        String rawKey = request.getHeader("X-API-Key");

        if (!apiKeyService.isValidApiKey(rawKey)) {
            writeError(
                    response,
                    HttpServletResponse.SC_UNAUTHORIZED,
                    "Unauthorized",
                    "Missing or invalid API key");
            return;
        }

        try {
            if (!rateLimitService.isAllowed(rawKey)) {
                response.setHeader("Retry-After", "60");
                writeError(
                        response,
                        429,
                        "Too Many Requests",
                        "Rate limit exceeded. Try again later.");
                return;
            }
        } catch (Exception exception) {
            writeError(
                    response,
                    HttpServletResponse.SC_SERVICE_UNAVAILABLE,
                    "Service Unavailable",
                    "Rate-limiting service is temporarily unavailable");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private void writeError(
            HttpServletResponse response,
            int status,
            String error,
            String message) throws IOException {

        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        response.getWriter().write(
                "{\"status\":" + status
                        + ",\"error\":\"" + error
                        + "\",\"message\":\"" + message + "\"}");
    }
}