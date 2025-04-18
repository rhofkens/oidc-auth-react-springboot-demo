package ai.bluefields.oidcauthdemo.error;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import ai.bluefields.oidcauthdemo.HealthController;
import ai.bluefields.oidcauthdemo.health.HealthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

/** Unit tests for {@link GlobalExceptionHandler}. */
@WebMvcTest(controllers = {HealthController.class})
class GlobalExceptionHandlerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private HealthService healthService;

  @Test
  void shouldReturn404WithProblemJsonForNonExistentUrl() throws Exception {
    // When/Then
    mockMvc
        .perform(get("/bad"))
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
        .perform(get("/api/v1/public/health"))
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
        .perform(post("/api/v1/public/health"))
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
}
