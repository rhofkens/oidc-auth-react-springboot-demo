package ai.bluefields.oidcauthdemo.health;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;

/** Unit tests for the HealthService class. */
class HealthServiceTest {

  /** Test that getStatus() returns a HealthResponse with the message "Service up". */
  @Test
  void getStatusReturnsServiceUpMessage() {
    // Arrange
    HealthService healthService = new HealthService();

    // Act
    HealthResponse response = healthService.getStatus();

    // Assert
    assertNotNull(response, "Response should not be null");
    assertEquals("Service up", response.message(), "Message should be 'Service up'");
  }
}
