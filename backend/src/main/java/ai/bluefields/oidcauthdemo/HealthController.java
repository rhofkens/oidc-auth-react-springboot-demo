package ai.bluefields.oidcauthdemo;

import ai.bluefields.oidcauthdemo.health.HealthResponse;
import ai.bluefields.oidcauthdemo.health.HealthService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that provides health check endpoints for the application. This controller exposes
 * a public API for monitoring the service status.
 */
@RestController
@RequestMapping("/api/v1/public/health")
public class HealthController {

  private final HealthService healthService;

  /**
   * Constructs a new HealthController with the required dependencies.
   *
   * @param healthService the service that provides health status information
   */
  public HealthController(HealthService healthService) {
    this.healthService = healthService;
  }

  /**
   * Retrieves the current health status of the application.
   *
   * @return a HealthResponse containing the current status message
   */
  @GetMapping
  @Operation(
      summary = "Health check",
      tags = {"public"})
  public HealthResponse getHealth() {
    return healthService.getStatus();
  }
}
