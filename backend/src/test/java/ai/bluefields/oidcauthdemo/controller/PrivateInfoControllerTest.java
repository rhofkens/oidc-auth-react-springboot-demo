package ai.bluefields.oidcauthdemo.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.*;
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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import reactor.core.publisher.Mono;

@WebMvcTest(PrivateInfoController.class)
@Import(SecurityConfig.class)
class PrivateInfoControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockBean private PrivateInfoService privateInfoService;

  @MockBean private JwtDecoder jwtDecoder;

  @Test
  void getPrivateInfo_whenAuthenticatedWithAdminRole_shouldReturnOkAndData() throws Exception {
    // Arrange
    String expectedEmail = "userinfo@example.com";
    String expectedMessage = "Hello AUTH (from UserInfo)"; // Match service response
    PrivateInfoResponse expectedServiceResponse =
        new PrivateInfoResponse(expectedMessage, expectedEmail);

    // Mock the service to return a Mono containing the response
    when(privateInfoService.getInfo(any(Authentication.class)))
        .thenReturn(Mono.just(expectedServiceResponse));
    // Act & Assert
    MvcResult result =
        mockMvc
            .perform(
                get("/api/v1/private/info")
                    .accept(MediaType.APPLICATION_JSON) // Add Accept header
                    .with(
                        jwt()
                            .authorities(
                                new SimpleGrantedAuthority("ROLE_ADMIN")))) // Use ROLE_ADMIN
            .andExpect(status().isOk())
            .andExpect(request().asyncStarted()) // Expect async processing
            .andReturn();

    // Perform async dispatch and assert on the final response
    mockMvc
        .perform(asyncDispatch(result))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Assert final content type
        .andExpect(jsonPath("$.message").value(expectedMessage))
        .andExpect(jsonPath("$.email").value(expectedEmail));

    // Verify service method was called
    verify(privateInfoService).getInfo(any(Authentication.class));
  }

  @Test
  void getPrivateInfo_whenUnauthenticated_shouldReturnUnauthorized() throws Exception {
    // Act & Assert
    mockMvc.perform(get("/api/v1/private/info")).andExpect(status().isUnauthorized());
  }

  @Test
  void getPrivateInfo_whenAuthenticatedWithInsufficientRole_shouldReturnForbidden()
      throws Exception {
    // Arrange: No need to mock service, as security should block before controller method is called

    // Act & Assert
    mockMvc
        .perform(
            get("/api/v1/private/info")
                .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_USER")))) // Non-admin role
        .andExpect(status().isForbidden());

    // Verify service method was NOT called
    verify(privateInfoService, never()).getInfo(any(Authentication.class));
  }

  @Test
  void getPrivateInfo_whenAuthenticatedWithNoRole_shouldReturnForbidden() throws Exception {
    // Arrange: No need to mock service

    // Act & Assert
    mockMvc
        .perform(get("/api/v1/private/info").with(jwt())) // No authorities specified
        .andExpect(status().isForbidden());

    // Verify service method was NOT called
    verify(privateInfoService, never()).getInfo(any(Authentication.class));
  }

  @Test
  void getPrivateInfo_whenServiceReturnsErrorMono_shouldStillReturnOkWithErrorData()
      throws Exception {
    // Arrange
    // Simulate the service's onErrorResume behavior
    PrivateInfoResponse errorResponse =
        new PrivateInfoResponse("Hello AUTH (UserInfo Error)", "Error fetching email");
    when(privateInfoService.getInfo(any(Authentication.class)))
        .thenReturn(Mono.just(errorResponse)); // Service handles internal error and returns this

    // Act & Assert
    MvcResult result =
        mockMvc
            .perform(
                get("/api/v1/private/info")
                    .accept(MediaType.APPLICATION_JSON) // Add Accept header
                    .with(jwt().authorities(new SimpleGrantedAuthority("ROLE_ADMIN"))))
            .andExpect(status().isOk()) // Controller still returns 200 OK
            .andExpect(request().asyncStarted()) // Expect async processing
            .andReturn();

    // Perform async dispatch and assert on the final response
    mockMvc
        .perform(asyncDispatch(result))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON)) // Assert final content type
        .andExpect(jsonPath("$.message").value("Hello AUTH (UserInfo Error)"))
        .andExpect(jsonPath("$.email").value("Error fetching email"));

    // Verify service method was called
    verify(privateInfoService).getInfo(any(Authentication.class));
  }
}
