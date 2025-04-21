package ai.bluefields.oidcauthdemo.service;

import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import java.util.Map;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

/**
 * Service layer responsible for retrieving private information based on the authenticated user's
 * JWT.
 */
@Service
public class PrivateInfoService {

  private final WebClient webClient;

  /**
   * Constructs the service with a WebClient dependency.
   *
   * @param webClient The WebClient instance for making HTTP requests.
   */
  public PrivateInfoService(WebClient webClient) {
    this.webClient = webClient;
  }

  /**
   * Retrieves private information for the authenticated user by calling the UserInfo endpoint.
   *
   * @param authentication The authentication object containing the user's JWT.
   * @return A {@link Mono} emitting the {@link PrivateInfoResponse} containing a message and the
   *     user's email fetched from the UserInfo endpoint.
   */
  public Mono<PrivateInfoResponse> getInfo(Authentication authentication) {
    if (!(authentication instanceof JwtAuthenticationToken jwtAuth)) {
      return Mono.error(
          new IllegalArgumentException("Authentication must be of type JwtAuthenticationToken"));
    }

    Jwt jwt = jwtAuth.getToken();
    String accessToken = jwt.getTokenValue();
    String issuerUri = jwt.getIssuer().toString(); // Assuming issuer is reliable
    String userInfoEndpoint = issuerUri + "/oidc/v1/userinfo"; // Standard OIDC path

    return webClient
        .get()
        .uri(userInfoEndpoint)
        .headers(headers -> headers.setBearerAuth(accessToken))
        .retrieve()
        .bodyToMono(Map.class) // Assuming response is a JSON object
        .map(
            userInfoMap -> {
              // Extract email, handle potential null or incorrect type
              Object emailObj = userInfoMap.get("email");
              String email = (emailObj instanceof String) ? (String) emailObj : "Email not found";
              return new PrivateInfoResponse("Hello AUTH (from UserInfo)", email);
            })
        .onErrorResume(
            error -> {
              // Log the error appropriately in a real application
              System.err.println("Error fetching UserInfo: " + error.getMessage());
              return Mono.just(
                  new PrivateInfoResponse("Hello AUTH (UserInfo Error)", "Error fetching email"));
            });
  }
}
