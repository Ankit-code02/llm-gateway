package com.ankit.gateway.service;

import org.springframework.stereotype.Service;

@Service
public class PiiRedactor {

    private static final String EMAIL_PATTERN =
            "(?i)\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b";

    private static final String PHONE_PATTERN =
            "(?<!\\d)(?:\\+?91[- ]?)?[6-9]\\d{9}(?!\\d)";

    private static final String AADHAAR_PATTERN =
            "(?<!\\d)\\d{4}[ -]?\\d{4}[ -]?\\d{4}(?!\\d)";

    private static final String PAN_PATTERN =
            "(?i)\\b[A-Z]{5}\\d{4}[A-Z]\\b";

    public String redact(String text) {
        if (text == null || text.isEmpty()) {
            return text;
        }

        return text
                .replaceAll(EMAIL_PATTERN, "[REDACTED_EMAIL]")
                .replaceAll(AADHAAR_PATTERN, "[REDACTED_AADHAAR]")
                .replaceAll(PAN_PATTERN, "[REDACTED_PAN]")
                .replaceAll(PHONE_PATTERN, "[REDACTED_PHONE]");
    }
}