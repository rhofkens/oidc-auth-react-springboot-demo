package ai.bluefields.oidcauthdemo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import ai.bluefields.oidcauthdemo.config.SecurityConfig;
import ai.bluefields.oidcauthdemo.dto.PrivateInfoResponse;
import ai.bluefields.oidcauthdemo.service.PrivateInfoService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(PrivateInfoController.class)
@Import(SecurityConfig.class) // Import security config to apply rules
class PrivateInfoControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private PrivateInfoService privateInfoService;

  @MockBean private JwtDecoder jwtDecoder; // Mock JwtDecoder to prevent it from trying to decode

  @Test
  void getPrivateInfo_whenAuthenticatedWithCorrectRole_shouldReturnOkAndData() throws Exception {
    // Arrange
    PrivateInfoResponse expectedResponse =
        new PrivateInfoResponse("Hello AUTH", "test@example.com");
    when(privateInfoService.getInfo(any(Jwt.class))).thenReturn(expectedResponse);

    // Act & Assert
    mockMvc
        .perform(
            get("/api/v1/private/info")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_AUTH_USER"))))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.message").value("Hello AUTH"))
        .andExpect(jsonPath("$.email").value("test@example.com"));
  }

  @Test
  void getPrivateInfo_whenUnauthenticated_shouldReturnUnauthorized() throws Exception {
    // Act & Assert
    mockMvc.perform(get("/api/v1/private/info")).andExpect(status().isUnauthorized());
  }

  @Test
  void getPrivateInfo_whenAuthenticatedWithInsufficientRole_shouldReturnForbidden()
      throws Exception {
    // Act & Assert
    mockMvc
        .perform(
            get("/api/v1/private/info")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_SOME_OTHER_ROLE"))))
        .andExpect(status().isForbidden());
  }

  @Test
  void getPrivateInfo_whenAuthenticatedWithNoRole_shouldReturnForbidden() throws Exception {
    // Act & Assert
    mockMvc
        .perform(get("/api/v1/private/info").with(jwt())) // No authorities specified
        .andExpect(status().isForbidden());
  }
}
