package ai.bluefields.oidcauthdemo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Collections;
import java.util.Map;
import java.util.function.Consumer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Answers;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersSpec;
import org.springframework.web.reactive.function.client.WebClient.RequestHeadersUriSpec;
import org.springframework.web.reactive.function.client.WebClient.ResponseSpec;
import reactor.core.publisher.Mono;
import reactor.test.StepVerifier;

@ExtendWith(MockitoExtension.class)
class PrivateInfoServiceTest {

  @Mock(answer = Answers.RETURNS_DEEP_STUBS)
  private WebClient mockWebClient; // Use deep stubs for fluent API

  @Mock private Jwt mockJwt;
  @Mock private JwtAuthenticationToken mockAuth; // Mock the specific type

  private PrivateInfoService privateInfoService;

  // Mocks for WebClient fluent API
  @Mock private RequestHeadersUriSpec requestHeadersUriSpec;
  @Mock private RequestHeadersSpec requestHeadersSpec;
  @Mock private ResponseSpec responseSpec;

  @BeforeEach
  void setUp() throws MalformedURLException {
    // Instantiate service with the mock WebClient
    privateInfoService = new PrivateInfoService(mockWebClient);

    // Common JWT setup (made lenient)
    lenient().when(mockAuth.getToken()).thenReturn(mockJwt);
    lenient().when(mockJwt.getTokenValue()).thenReturn("mock-access-token");
    lenient().when(mockJwt.getIssuer()).thenReturn(new URL("http://mock-issuer.com"));

    // --- Mock WebClient Call Chain (made lenient) ---
    // Mock the initial get() call
    lenient().when(mockWebClient.get()).thenReturn(requestHeadersUriSpec);
    // Mock the uri() call
    lenient().when(requestHeadersUriSpec.uri(anyString())).thenReturn(requestHeadersSpec);
    // Mock the headers() call (capture the consumer to verify Bearer token)
    lenient().when(requestHeadersSpec.headers(any(Consumer.class))).thenReturn(requestHeadersSpec);
    // Mock the retrieve() call
    lenient().when(requestHeadersSpec.retrieve()).thenReturn(responseSpec);
  }

  @Test
  void getInfo_shouldReturnPersonalizedResponse_whenUserInfoSuccessful() {
    // Arrange
    String testEmail = "userinfo@example.com";
    String testGivenName = "John";
    String testFamilyName = "Doe";
    String expectedUserInfoUrl = "http://mock-issuer.com/oidc/v1/userinfo";
    Map<String, Object> userInfoResponseMap =
        Map.of(
            "email", testEmail,
            "given_name", testGivenName,
            "family_name", testFamilyName);

    // Mock the final bodyToMono call for success
    when(responseSpec.bodyToMono(Map.class)).thenReturn(Mono.just(userInfoResponseMap));

    // Act
    Mono<PrivateInfoResponse> resultMono = privateInfoService.getInfo(mockAuth);

    // Assert
    StepVerifier.create(resultMono)
        .assertNext(
            response -> {
              assertThat(response).isNotNull();
              assertThat(response.message())
                  .isEqualTo("Hello John Doe (from UserInfo)"); // Updated assertion
              assertThat(response.email()).isEqualTo(testEmail);
            })
        .verifyComplete();

    // Verify WebClient interactions
    verify(mockWebClient).get();
    verify(requestHeadersUriSpec).uri(expectedUserInfoUrl);
    // Verify that headers() was called, implicitly checking Bearer token setup within the service
    // method
    verify(requestHeadersSpec).headers(any(Consumer.class));
    verify(requestHeadersSpec).retrieve();
    verify(responseSpec).bodyToMono(Map.class);
  }

  @Test
  void getInfo_shouldReturnErrorResponse_whenUserInfoCallFails() {
    // Arrange
    // Mock the final bodyToMono call for error
    when(responseSpec.bodyToMono(Map.class))
        .thenReturn(Mono.error(new RuntimeException("UserInfo fetch failed")));

    // Act
    Mono<PrivateInfoResponse> resultMono = privateInfoService.getInfo(mockAuth);

    // Assert
    StepVerifier.create(resultMono)
        .assertNext(
            response -> {
              assertThat(response).isNotNull();
              assertThat(response.message())
                  .isEqualTo("Hello User (UserInfo Error)"); // Updated assertion
              assertThat(response.email())
                  .isEqualTo("Error fetching user details"); // Updated assertion
            })
        .verifyComplete(); // onErrorResume handles the error, so the Mono completes

    // Verify WebClient interactions up to the point of failure
    verify(mockWebClient).get();
    verify(requestHeadersUriSpec).uri("http://mock-issuer.com/oidc/v1/userinfo");
    verify(requestHeadersSpec).headers(any(Consumer.class));
    verify(requestHeadersSpec).retrieve();
    verify(responseSpec).bodyToMono(Map.class);
  }

  @Test
  void getInfo_shouldReturnErrorMono_whenAuthenticationIsNotJwt() {
    // Arrange
    Authentication wrongAuth = new UsernamePasswordAuthenticationToken("user", "pass");

    // Act
    Mono<PrivateInfoResponse> resultMono = privateInfoService.getInfo(wrongAuth);

    // Assert
    StepVerifier.create(resultMono)
        .expectErrorMatches(
            throwable ->
                throwable instanceof IllegalArgumentException
                    && throwable
                        .getMessage()
                        .contains("Authentication must be of type JwtAuthenticationToken"))
        .verify();

    // Verify WebClient was NOT called
    verify(mockWebClient, never()).get();
  }

  @Test
  void getInfo_shouldReturnDefaultValues_whenClaimsMissingInUserInfo() { // Renamed test
    // Arrange
    Map<String, Object> userInfoResponseMap = Collections.emptyMap(); // No email or name claims

    // Mock the final bodyToMono call for success with missing claims
    when(responseSpec.bodyToMono(Map.class)).thenReturn(Mono.just(userInfoResponseMap));

    // Act
    Mono<PrivateInfoResponse> resultMono = privateInfoService.getInfo(mockAuth);

    // Assert
    StepVerifier.create(resultMono)
        .assertNext(
            response -> {
              assertThat(response).isNotNull();
              assertThat(response.message())
                  .isEqualTo("Hello User (from UserInfo)"); // Updated assertion for default message
              assertThat(response.email()).isEqualTo("Email not found"); // Default email value
            })
        .verifyComplete();
  }
}
