package com.ankit.gateway;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {"ollama.base-url=http://localhost:11434", "ollama.model=qwen2.5:3b"})
class LlmGatewayApplicationTests {

	@Test
	void contextLoads() {
		// Verifies that the Spring application context starts successfully.
	}
}
