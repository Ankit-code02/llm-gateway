package com.ankit.gateway.controller;

import com.ankit.gateway.client.GroqClient;
import com.ankit.gateway.client.OllamaClient;
import com.ankit.gateway.dto.ChatRequest;
import com.ankit.gateway.dto.ChatResponse;
import com.ankit.gateway.service.PiiRedactor;
import com.ankit.gateway.service.PromptCacheService;
import com.ankit.gateway.service.UsageEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class ChatControllerTest {

    private OllamaClient ollamaClient;
    private GroqClient groqClient;
    private PromptCacheService promptCacheService;
    private PiiRedactor piiRedactor;
    private UsageEventPublisher usageEventPublisher;
    private ChatController chatController;

    @BeforeEach
    void setUp() {
        ollamaClient = mock(OllamaClient.class);
        groqClient = mock(GroqClient.class);
        promptCacheService = mock(PromptCacheService.class);
        piiRedactor = mock(PiiRedactor.class);
        usageEventPublisher = mock(UsageEventPublisher.class);

        chatController = new ChatController(
                ollamaClient,
                groqClient,
                promptCacheService,
                piiRedactor,
                usageEventPublisher,
                "ollama"
        );
    }

    @Test
    void returnsCachedAnswerWithoutCallingAiProvider() {
        String apiKey = "test-api-key";
        String prompt = "Explain Java";
        String cachedAnswer = "Java is a programming language.";

        when(promptCacheService.get(apiKey, prompt)).thenReturn(cachedAnswer);

        ChatResponse response = chatController.chat(
                apiKey,
                new ChatRequest(prompt)
        );

        assertEquals(cachedAnswer, response.answer());
        verify(ollamaClient, never()).generateAnswer(anyString());
        verify(groqClient, never()).generateAnswer(anyString());
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
        verify(groqClient, never()).generateAnswer(anyString());
        verify(promptCacheService).put(apiKey, prompt, answer);
        verify(usageEventPublisher).publish(apiKey, prompt, false);
    }

    @Test
    void usesGroqWhenGroqProviderIsSelected() {
        String apiKey = "test-api-key";
        String prompt = "Explain Java";
        String safePrompt = "Explain Java";
        String answer = "Groq answer.";

        ChatController groqController = new ChatController(
                ollamaClient,
                groqClient,
                promptCacheService,
                piiRedactor,
                usageEventPublisher,
                "groq"
        );

        when(promptCacheService.get(apiKey, prompt)).thenReturn(null);
        when(piiRedactor.redact(prompt)).thenReturn(safePrompt);
        when(groqClient.generateAnswer(safePrompt)).thenReturn(answer);

        ChatResponse response = groqController.chat(
                apiKey,
                new ChatRequest(prompt)
        );

        assertEquals(answer, response.answer());
        verify(groqClient).generateAnswer(safePrompt);
        verify(ollamaClient, never()).generateAnswer(anyString());
        verify(promptCacheService).put(apiKey, prompt, answer);
        verify(usageEventPublisher).publish(apiKey, prompt, false);
    }
}
