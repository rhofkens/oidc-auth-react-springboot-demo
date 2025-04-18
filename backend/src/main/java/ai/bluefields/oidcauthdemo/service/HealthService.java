package ai.bluefields.oidcauthdemo.service;

import ai.bluefields.oidcauthdemo.dto.HealthResponse; // Import the DTO
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
   * @return A HealthResponse DTO containing a status message
   */
  public HealthResponse getStatus() { // Return type is now the DTO
    return new HealthResponse("Service up"); // Return the DTO
  }
}
