package ai.bluefields.oidcauthdemo.config;

import java.util.Collection;
import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.reactive.function.client.WebClient;

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
            oauth2 ->
                oauth2.jwt(
                    jwt ->
                        jwt.jwtAuthenticationConverter(
                            jwtAuthenticationConverter()) // Use custom converter
                    ))
        .sessionManagement(
            session ->
                session.sessionCreationPolicy(
                    SessionCreationPolicy.STATELESS)); // Stateless sessions

    return http.build();
  }

  /**
   * Creates a custom {@link JwtAuthenticationConverter} to map JWT claims to Spring Security
   * authorities.
   *
   * <p>This converter extracts authorities from a custom claim (e.g., Zitadel roles) and merges
   * them with authorities derived from the standard 'scope' claim.
   *
   * @return A configured {@link JwtAuthenticationConverter}.
   */
  @Bean
  public JwtAuthenticationConverter jwtAuthenticationConverter() {
    // Default converter for extracting SCOPE_ authorities
    JwtGrantedAuthoritiesConverter scopeAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();

    // Custom logic to extract roles from the Zitadel-specific complex claim structure
    final String zitadelRolesClaim = "urn:zitadel:iam:org:project:roles";
    final String authorityPrefix = "ROLE_";

    JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
    converter.setJwtGrantedAuthoritiesConverter(
        jwt -> {
          // 1. Get standard SCOPE_ authorities
          Collection<GrantedAuthority> scopeAuthorities = scopeAuthoritiesConverter.convert(jwt);

          // 2. Extract roles from the custom Zitadel claim (which is a Map)
          Collection<GrantedAuthority> roleAuthorities =
              Optional.ofNullable(jwt.getClaimAsMap(zitadelRolesClaim)) // Get the claim as a Map
                  .map(
                      rolesMap ->
                          rolesMap.keySet().stream() // Get the keys (role names like "admin")
                              .<GrantedAuthority>map( // Explicitly type the map operation
                                  role ->
                                      new SimpleGrantedAuthority(
                                          authorityPrefix
                                              + role
                                                  .toUpperCase())) // Prefix with ROLE_ and convert
                              // role to uppercase
                              .collect(Collectors.toSet())) // Collect to Set<GrantedAuthority>
                  .orElse(
                      Collections.emptySet()); // Return empty set if claim is missing or not a map

          // 3. Combine scope and role authorities
          return Stream.concat(scopeAuthorities.stream(), roleAuthorities.stream())
              .collect(Collectors.toSet());
        });

    // Optional: If you want the user's name in the Principal to be something other than 'sub'
    // converter.setPrincipalClaimName("preferred_username"); // Example

    return converter;
  }

  /**
   * Creates a default WebClient bean for making HTTP requests.
   *
   * @return A configured {@link WebClient} instance.
   */
  @Bean
  public WebClient webClient() {
    return WebClient.builder().build();
  }
}
