package ai.bluefields.oidcauthdemo.controller;

import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import ai.bluefields.oidcauthdemo.service.PrivateInfoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType; // Import MediaType
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reactor.core.publisher.Mono;

/**
 * Controller handling requests for private information, requiring authentication and authorization.
 */
@RestController
@RequestMapping("/api/v1/private")
@Tag(name = "Private Info API", description = "Endpoints requiring authentication")
@SecurityRequirement(name = "bearerAuth") // Link to security scheme defined in OpenAPI config
public class PrivateInfoController {

  // Logger instance
  private static final Logger log = LoggerFactory.getLogger(PrivateInfoController.class);

  private final PrivateInfoService privateInfoService;

  /**
   * Constructs the controller with the necessary service dependency.
   *
   * @param privateInfoService The service used to retrieve private information.
   */
  public PrivateInfoController(PrivateInfoService privateInfoService) {
    this.privateInfoService = privateInfoService;
  }

  /**
   * Retrieves private information for the authenticated user. Requires the user to have the
   * 'ROLE_AUTH_USER' authority.
   *
   * @param jwt The JWT representing the authenticated user, injected by Spring Security.
   * @param authentication The full Authentication object containing authorities.
   * @param authentication The full Authentication object containing authorities.
   * @return A {@link PrivateInfoResponse} containing a message and the user's email.
   */
  @GetMapping(value = "/info", produces = MediaType.APPLICATION_JSON_VALUE) // Add produces
  @PreAuthorize("hasAuthority('ROLE_ADMIN')") // Match authority generated from "admin" role
  @Operation(
      summary = "Get Private Information",
      description =
          "Returns a simple message and the authenticated user's email. Requires ROLE_ADMIN.", // Update description
      responses = {
        @ApiResponse(responseCode = "200", description = "Successfully retrieved private info"),
        @ApiResponse(
            responseCode = "401",
            description = "Unauthorized - JWT token missing or invalid"),
        @ApiResponse(
            responseCode = "403",
            description = "Forbidden - User lacks ROLE_ADMIN authority") // Update description
      })
  public Mono<PrivateInfoResponse> getPrivateInfo(
      Authentication authentication) { // Remove @AuthenticationPrincipal Jwt jwt

    // Debug logging removed

    return privateInfoService.getInfo(authentication); // Pass Authentication object
  }
}
