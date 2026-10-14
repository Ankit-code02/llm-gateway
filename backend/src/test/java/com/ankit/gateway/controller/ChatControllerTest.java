
package com.ankit.gateway.controller;

import com.ankit.gateway.client.OllamaClient;
import com.ankit.gateway.dto.ChatRequest;
import com.ankit.gateway.dto.ChatResponse;
import com.ankit.gateway.service.PiiRedactor;
import com.ankit.gateway.service.PromptCacheService;
import com.ankit.gateway.service.UsageEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

class ChatControllerTest {

    private OllamaClient ollamaClient;
    private PromptCacheService promptCacheService;
    private PiiRedactor piiRedactor;
    private UsageEventPublisher usageEventPublisher;
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        ollamaClient = mock(OllamaClient.class);
        promptCacheService = mock(PromptCacheService.class);
        piiRedactor = mock(PiiRedactor.class);
        usageEventPublisher = mock(UsageEventPublisher.class);

        chatController = new ChatController(
                ollamaClient,
                promptCacheService,
                piiRedactor,
                usageEventPublisher
        );
    }

    @Test
    void returnsCachedAnswerWithoutCallingOllama() {
        String apiKey = "test-api-key";
        String prompt = "Explain Java";
        String cachedAnswer = "Java is a programming language.";

        when(promptCacheService.get(apiKey, prompt))
                .thenReturn(cachedAnswer);

        ChatResponse response = chatController.chat(
                apiKey,
                new ChatRequest(prompt)
        );

        assertEquals(cachedAnswer, response.answer());
        verify(ollamaClient, never()).generateAnswer(anyString());
        verify(usageEventPublisher).publish(apiKey, prompt, true);
    }

    @Test
    void redactsPromptBeforeCallingOllamaAndPublishesUsage() {
        String apiKey = "test-api-key";
        String prompt = "Email: user@example.com";
        String safePrompt = "Email: [REDACTED]";
        String answer = "Here is the answer.";

        when(promptCacheService.get(apiKey, prompt)).thenReturn(null);
        when(piiRedactor.redact(prompt)).thenReturn(safePrompt);
        when(ollamaClient.generateAnswer(safePrompt)).thenReturn(answer);

        ChatResponse response = chatController.chat(
                apiKey,
                new ChatRequest(prompt)
        );

        assertEquals(answer, response.answer());
        verify(ollamaClient).generateAnswer(safePrompt);
        verify(promptCacheService).put(apiKey, prompt, answer);
        verify(usageEventPublisher).publish(apiKey, prompt, false);
    }
}
