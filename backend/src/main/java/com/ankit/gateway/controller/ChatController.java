
package com.ankit.gateway.controller;

import com.ankit.gateway.client.OllamaClient;
import com.ankit.gateway.dto.ChatRequest;
import com.ankit.gateway.dto.ChatResponse;
import com.ankit.gateway.service.PiiRedactor;
import com.ankit.gateway.service.PromptCacheService;
import com.ankit.gateway.service.UsageEventPublisher;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1")
public class ChatController {

    private final OllamaClient ollamaClient;
    private final PromptCacheService promptCacheService;
    private final PiiRedactor piiRedactor;
    private final UsageEventPublisher usageEventPublisher;

    public ChatController(
            OllamaClient ollamaClient,
            PromptCacheService promptCacheService,
            PiiRedactor piiRedactor,
            UsageEventPublisher usageEventPublisher) {

        this.ollamaClient = ollamaClient;
        this.promptCacheService = promptCacheService;
        this.piiRedactor = piiRedactor;
        this.usageEventPublisher = usageEventPublisher;
    }

    @PostMapping("/chat")
    public ChatResponse chat(
            @RequestHeader("X-API-Key") String apiKey,
            @Valid @RequestBody ChatRequest request) {

        String prompt = request.prompt();

        String cachedAnswer = promptCacheService.get(apiKey, prompt);

        if (cachedAnswer != null) {
            usageEventPublisher.publish(apiKey, prompt, true);
            return new ChatResponse(cachedAnswer);
        }

        String safePrompt = piiRedactor.redact(prompt);
        String answer = ollamaClient.generateAnswer(safePrompt);

        promptCacheService.put(apiKey, prompt, answer);
        usageEventPublisher.publish(apiKey, prompt, false);

        return new ChatResponse(answer);
    }
}
