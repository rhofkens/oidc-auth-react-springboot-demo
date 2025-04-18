# Step 08: Backend Private Endpoint & JWT Validation - Implementation Tasks

Based on `docs/plan/08-backend-private-endpoint-jwt-validation.md`.

## 1. Configuration Updates

*   **Task 1.1:** Verify `spring-boot-starter-oauth2-resource-server` dependency is present in `backend/pom.xml`. Add if missing.
*   **Task 1.2:** Update `backend/src/main/resources/application.yaml`:
    *   Ensure `spring.security.enabled` is effectively `true` (either set explicitly or remove the flag if `false`).
    *   Add JWT resource server configuration under `spring.security.oauth2.resourceserver.jwt`, setting `issuer-uri: ${ZITADEL_AUTHDEMO_ISSUER_URI}`.

## 2. Production Code Implementation

*   **Task 2.1:** Create `PrivateInfoResponse` record in `ai.bluefields.oidcauthdemo.privateinfo` package with fields `message` (String) and `email` (String). Add Javadoc.
*   **Task 2.2:** Create `PrivateInfoService` class in `ai.bluefields.oidcauthdemo.privateinfo` package.
    *   Implement method `getInfo(Jwt jwt)` that returns a `PrivateInfoResponse`.
    *   Extract the email from the JWT claim (e.g., `jwt.getClaimAsString("email")`).
    *   Construct the response with message "Hello AUTH" and the extracted email.
    *   Use constructor injection. Add Javadoc.
*   **Task 2.3:** Create `PrivateInfoController` class in `ai.bluefields.oidcauthdemo.privateinfo` package.
    *   Map to `GET /api/v1/private/info`.
    *   Inject `PrivateInfoService`.
    *   Annotate the endpoint method with `@PreAuthorize("hasAuthority('ROLE_AUTH_USER')")`. (We will rely on Spring Security's default claim/scope mapping or adjust with a `JwtAuthenticationConverter` in Task 2.4 if needed).
    *   Call `privateInfoService.getInfo()` passing the authenticated `Jwt` principal.
    *   Return the `PrivateInfoResponse`.
    *   Add Javadoc and ensure Springdoc OpenAPI documentation is generated.
*   **Task 2.4:** Create `SecurityConfig` class in `ai.bluefields.oidcauthdemo.config` package.
    *   Annotate with `@Configuration` and `@EnableWebSecurity`.
    *   Define a `SecurityFilterChain` bean.
    *   Configure `http.authorizeHttpRequests()`:
        *   Permit all requests to `/api/v1/public/**`, `/v3/api-docs/**`, `/swagger-ui/**`.
        *   Require authentication for `/api/v1/private/**`.
    *   Enable JWT resource server support (`http.oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()))`).
    *   *Optional:* If necessary based on Zitadel token structure, define and configure a `JwtAuthenticationConverter` bean to map claims to `ROLE_AUTH_USER`.
    *   Add Javadoc.

## 3. Testing

*   **Task 3.1:** Write unit tests for `PrivateInfoService` using JUnit 5, Mockito, and AssertJ.
    *   Mock the `Jwt` object and verify the correct `PrivateInfoResponse` is created.
*   **Task 3.2:** Write controller tests for `PrivateInfoController` using `@WebMvcTest(PrivateInfoController.class)`, `@Import(SecurityConfig.class)`, Spring Security Test support, JUnit 5, Mockito, and AssertJ.
    *   Mock the `JwtDecoder` bean.
    *   Mock the `PrivateInfoService` bean.
    *   Test Case 1 (Authenticated): Use test support (e.g., `SecurityMockMvcRequestPostProcessors.jwt()`) providing a mock JWT with the necessary authority (`ROLE_AUTH_USER`) and an email claim. Verify HTTP 200 status and correct JSON response (`{"message":"Hello AUTH", "email":"test@example.com"}`).
    *   Test Case 2 (Unauthenticated/Insufficient Permissions): Make a request without authentication or with a JWT lacking the required authority. Verify HTTP 401 Unauthorized status.
*   **Task 3.3:** Run `./mvnw test` and ensure all backend tests pass.
*   **Task 3.4:** Run `./mvnw verify` (or `./mvnw jacoco:report`) and ensure JaCoCo line coverage for the backend is ≥ 80%. Address any coverage gaps.

## 4. Documentation Updates

*   **Task 4.1:** Update `README.md`: Add an example `curl` command demonstrating how to call the `GET /api/v1/private/info` endpoint using a Bearer token. Include a note on obtaining a token.
*   **Task 4.2:** Update `CHANGELOG.md`: Add an entry for Step 08.
*   **Task 4.3:** Ensure Javadoc is added/updated for all new/modified public classes and methods (`PrivateInfoResponse`, `PrivateInfoService`, `PrivateInfoController`, `SecurityConfig`). Run `./mvnw javadoc:javadoc` to verify.
*   **Task 4.4:** Verify the new endpoint `/api/v1/private/info` appears correctly in the Springdoc OpenAPI specification (e.g., at `/v3/api-docs` or `/swagger-ui.html`) including the security requirement.

## 5. Final Verification

*   **Task 5.1:** Run `./mvnw clean verify` to ensure build, tests, coverage, and Javadoc generation succeed.
*   **Task 5.2:** Manually test the endpoint using `curl` and a valid JWT obtained from Zitadel (if possible) to confirm end-to-end functionality.