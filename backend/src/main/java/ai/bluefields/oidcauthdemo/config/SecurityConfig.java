package ai.bluefields.oidcauthdemo.config; // Correct package

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Configures Spring Security settings for the application, including JWT validation, authorization
 * rules, and CSRF protection. Enables method-level security checks using {@link
 * EnableMethodSecurity}.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity // Enables @PreAuthorize, @PostAuthorize, etc.
public class SecurityConfig {

  /**
   * Defines the main security filter chain for the application.
   *
   * <p>Configuration details:
   *
   * <ul>
   *   <li>Disables CSRF protection as the API is stateless and relies on JWTs.
   *   <li>Configures authorization rules:
   *       <ul>
   *         <li>Permits access to public API endpoints (`/api/v1/public/**`).
   *         <li>Permits access to OpenAPI/Swagger UI endpoints.
   *         <li>Requires authentication for private API endpoints (`/api/v1/private/**`).
   *         <li>Requires authentication for any other request not explicitly matched.
   *       </ul>
   *   <li>Enables OAuth 2.0 Resource Server support with JWT validation using default settings.
   *   <li>Sets session management to STATELESS, as JWTs handle session state.
   * </ul>
   *
   * @param http The {@link HttpSecurity} to configure.
   * @return The configured {@link SecurityFilterChain}.
   * @throws Exception If an error occurs during configuration.
   */
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(AbstractHttpConfigurer::disable) // Disable CSRF for stateless API
        .httpBasic(AbstractHttpConfigurer::disable) // Disable HTTP Basic Auth
        .authorizeHttpRequests(
            authz ->
                authz
                    .requestMatchers(
                        "/api/v1/public/**", // Public endpoints
                        "/v3/api-docs/**", // OpenAPI spec
                        "/swagger-ui/**", // Swagger UI webjar
                        "/swagger-ui.html", // Swagger UI entry point
                        "/error" // Permit default error handling path
                        )
                    .permitAll()
                    .requestMatchers("/api/v1/private/**")
                    .authenticated() // Require authentication for private endpoints
                    .anyRequest()
                    .authenticated() // Default deny: require auth for anything else
            )
        .oauth2ResourceServer(
            oauth2 -> oauth2.jwt(Customizer.withDefaults())) // Enable JWT resource server
        .sessionManagement(
            session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS)); // Stateless sessions

    return http.build();
  }
}
