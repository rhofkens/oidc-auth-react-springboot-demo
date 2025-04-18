package ai.bluefields.oidcauthdemo.exception;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ai.bluefields.oidcauthdemo.controller.HealthController;
import ai.bluefields.oidcauthdemo.service.HealthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.test.web.servlet.MockMvc;

/** Unit tests for {@link GlobalExceptionHandler}. */
// Exclude security auto-configuration as this test focuses on exception handling, not security
// rules
@WebMvcTest(
    controllers = {
      HealthController.class,
      GlobalExceptionHandler.class
    }) // Include handler and a controller
@Import(
    GlobalExceptionHandlerTest.TestSecurityConfig
        .class) // Import test-specific security configuration
class GlobalExceptionHandlerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private HealthService healthService;

  @Test
  void shouldReturn404WithProblemJsonForNonExistentUrl() throws Exception {
    // When/Then
    mockMvc
        .perform(get("/bad")) // No longer need .with(anonymous()) due to permitAll config
        .andExpect(status().isNotFound())
        .andExpect(content().contentType("application/problem+json"))
        .andExpect(jsonPath("$.type").exists())
        .andExpect(jsonPath("$.title").value("Not Found"))
        .andExpect(jsonPath("$.status").value(404))
        .andExpect(jsonPath("$.detail").exists())
        .andExpect(jsonPath("$.timestamp").exists());
  }

  @Test
  void shouldReturn500WithProblemJsonForRuntimeException() throws Exception {
    // Given
    when(healthService.getStatus()).thenThrow(new RuntimeException("Test exception"));

    // When/Then
    mockMvc
        .perform(get("/api/v1/public/health")) // No need for .with(anonymous()) now
        .andExpect(status().isInternalServerError())
        .andExpect(content().contentType("application/problem+json"))
        .andExpect(jsonPath("$.type").value("https://api.bluefields.ai/errors/internal-error"))
        .andExpect(jsonPath("$.title").value("Internal Server Error"))
        .andExpect(jsonPath("$.status").value(500))
        .andExpect(
            jsonPath("$.detail")
                .value("An unexpected error occurred while processing your request"))
        .andExpect(jsonPath("$.timestamp").exists());
  }

  @Test
  void shouldReturn405WithProblemJsonForMethodNotAllowed() throws Exception {
    // When/Then - POST is not allowed on the health endpoint
    mockMvc
        .perform(post("/api/v1/public/health")) // No need for .with(anonymous()) now
        .andExpect(status().isMethodNotAllowed())
        .andExpect(content().contentType("application/problem+json"))
        .andExpect(jsonPath("$.type").value("https://api.bluefields.ai/errors/method-not-allowed"))
        .andExpect(jsonPath("$.title").value("Method Not Allowed"))
        .andExpect(jsonPath("$.status").value(405))
        .andExpect(
            jsonPath("$.detail").value("The HTTP method POST is not supported for this resource"))
        .andExpect(jsonPath("$.timestamp").exists());
  }

  // We'll skip the media type test for now since it requires a controller that validates content
  // type
  // which our simple HealthController doesn't do for GET requests
  /**
   * Test-specific security configuration that permits all requests to allow testing exception
   * handlers without interference from main security rules.
   */
  @TestConfiguration
  static class TestSecurityConfig {
    @Bean
    SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
      http.csrf(AbstractHttpConfigurer::disable)
          .httpBasic(AbstractHttpConfigurer::disable)
          .authorizeHttpRequests(authz -> authz.anyRequest().permitAll()); // Permit all for tests
      return http.build();
    }
  }
}
