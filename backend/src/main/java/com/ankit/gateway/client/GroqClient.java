
package com.ankit.gateway.client;

import com.fasterxml.jackson.databind.JsonNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Component
public class GroqClient {

    private static final Logger log =
            LoggerFactory.getLogger(GroqClient.class);

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public GroqClient(
            @Value("${groq.base-url:https://api.groq.com/openai/v1}")
            String baseUrl,
            @Value("${groq.api-key:}") String apiKey,
            @Value("${groq.model:openai/gpt-oss-20b}") String model) {

        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(baseUrl)
                .build();
    }

    public String generateAnswer(String prompt) {

        if (apiKey == null || apiKey.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Groq API key is not configured."
            );
        }

        Map<String, Object> request = Map.of(
                "model", model,
                "messages", List.of(
                        Map.of("role", "user", "content", prompt)
                )
        );

        JsonNode response;

        try {
            response = restClient.post()
                    .uri("/chat/completions")
                    .header("Authorization", "Bearer " + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(JsonNode.class);

        } catch (RestClientResponseException ex) {
            log.error("Groq request failed with HTTP status {}",
                    ex.getStatusCode().value());

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "The hosted AI provider is temporarily unavailable."
            );

        } catch (ResourceAccessException ex) {
            log.error("Could not connect to Groq: {}", ex.getMessage());

            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Cannot connect to the hosted AI provider."
            );
        }

        JsonNode content = response == null
                ? null
                : response.path("choices").path(0)
                .path("message").path("content");

        String answer = content == null ? "" : content.asText("");

        if (answer.isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "Groq returned no usable text answer."
            );
        }

        return answer;
    }
}
