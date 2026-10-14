package com.ankit.gateway.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PiiRedactorTest {

    private final PiiRedactor redactor = new PiiRedactor();

    @Test
    void redactsEmail() {
        assertEquals(
                "Contact [REDACTED_EMAIL]",
                redactor.redact("Contact ankit@example.com"));
    }

    @Test
    void redactsIndianMobileNumber() {
        assertEquals(
                "Call [REDACTED_PHONE]",
                redactor.redact("Call 9876543210"));
    }

    @Test
    void redactsAadhaarLikeNumber() {
        assertEquals(
                "ID [REDACTED_AADHAAR]",
                redactor.redact("ID 1234 5678 9012"));
    }

    @Test
    void redactsPanLikeNumber() {
        assertEquals(
                "PAN [REDACTED_PAN]",
                redactor.redact("PAN ABCDE1234F"));
    }

    @Test
    void preservesTextWithoutPii() {
        assertEquals(
                "Hello world",
                redactor.redact("Hello world"));
    }

    @Test
    void handlesNullAndEmptyInput() {
        assertNull(redactor.redact(null));
        assertEquals("", redactor.redact(""));
    }
}