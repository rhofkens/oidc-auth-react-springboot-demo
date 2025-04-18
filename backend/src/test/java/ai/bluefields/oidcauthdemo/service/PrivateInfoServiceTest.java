package ai.bluefields.oidcauthdemo.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.oauth2.jwt.Jwt;

@ExtendWith(MockitoExtension.class)
class PrivateInfoServiceTest {

  @Mock private Jwt mockJwt;

  private PrivateInfoService privateInfoService;

  @BeforeEach
  void setUp() {
    privateInfoService = new PrivateInfoService();
  }

  @Test
  void getInfo_shouldReturnResponseWithEmailFromJwt() {
    // Arrange
    String testEmail = "test@example.com";
    when(mockJwt.getClaimAsString("email")).thenReturn(testEmail);

    // Act
    PrivateInfoResponse response = privateInfoService.getInfo(mockJwt);

    // Assert
    assertThat(response).isNotNull();
    assertThat(response.message()).isEqualTo("Hello AUTH");
    assertThat(response.email()).isEqualTo(testEmail);
  }
}
