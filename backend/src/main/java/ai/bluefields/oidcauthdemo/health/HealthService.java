package ai.bluefields.oidcauthdemo.health;

import org.springframework.stereotype.Service;

/**
 * Service responsible for providing health status information. This service is used by the health
 * controller to check if the application is running properly.
 */
@Service
public class HealthService {

  /**
   * Retrieves the current health status of the service.
   *
   * @return A HealthResponse object containing a status message
   */
  public HealthResponse getStatus() {
    return new HealthResponse("Service up");
  }
}
