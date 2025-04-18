package ai.bluefields.oidcauthdemo.service;

import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

/**
 * Service layer responsible for retrieving private information based on the authenticated user's
 * JWT.
 */
@Service
public class PrivateInfoService {

  /**
   * Constructs the service. Constructor injection is used following best practices, although this
   * simple service currently has no dependencies.
   */
  public PrivateInfoService() {
    // No dependencies to inject currently
  }

  /**
   * Retrieves private information for the authenticated user.
   *
   * @param jwt The JWT token of the authenticated user, containing claims like email.
   * @return A {@link PrivateInfoResponse} containing a message and the user's email.
   */
  public PrivateInfoResponse getInfo(Jwt jwt) {
    String email = jwt.getClaimAsString("email");
    // Consider adding null/empty check for email if the claim might be missing
    return new PrivateInfoResponse("Hello AUTH", email);
  }
}
