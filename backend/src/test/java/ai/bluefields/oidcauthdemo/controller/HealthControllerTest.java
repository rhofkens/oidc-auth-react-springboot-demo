package ai.bluefields.oidcauthdemo.controller;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ai.bluefields.oidcauthdemo.config.SecurityConfig;
import ai.bluefields.oidcauthdemo.dto.HealthResponse;
import ai.bluefields.oidcauthdemo.service.HealthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Tests for the HealthController class. Uses Spring's WebMvcTest to test the controller in
 * isolation.
 */
// Exclude security auto-configuration as this test doesn't need it
@WebMvcTest(controllers = HealthController.class)
@Import(SecurityConfig.class) // Import the main security configuration
class HealthControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private HealthService healthService;

  /**
   * Test that the health endpoint returns status 200, content type application/json, and the
   * expected JSON response. Also verifies that the service method is called.
   */
  @Test
  void getHealthReturnsCorrectResponse() throws Exception {
    // Arrange
    HealthResponse mockResponse = new HealthResponse("Service up");
    when(healthService.getStatus()).thenReturn(mockResponse);

    // Act & Assert
    mockMvc
        .perform(get("/api/v1/public/health")) // No need for .with(anonymous()) now
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Service up"));

    // Verify service method was called
    verify(healthService).getStatus();
  }
}
