# Step 08 – Backend Private Endpoint & JWT Validation

> **Objective:** secure the backend by enabling Spring Security resource‑server mode, validate Zitadel JWT access tokens, and expose a private endpoint that returns the authenticated user’s email.

---

## Scope

### Configuration

1. **Enable Security**
   - In `application.yaml`, change `spring.security.enabled` → `true` (or remove flag).
2. **Resource Server Setup**
   - Add dependency `spring-boot-starter-oauth2-resource-server` (already part of starter-web in SB 3.4.4 but ensure included).
   - Configure JWT decoder:
     ```yaml
     spring:
       security:
         oauth2:
           resourceserver:
             jwt:
               issuer-uri: ${ZITADEL_ISSUER_URI}
     ```

### Production Code

1. **PrivateInfoService**
   - Method `getInfo(Jwt jwt) : PrivateInfoResponse` returning record `PrivateInfoResponse(String message, String email)`.
2. **PrivateInfoController**
   - Mapped to `GET /api/v1/private/info`.
   - Annotated with `@PreAuthorize("hasAuthority('SCOPE_private.read')")`.
   - Constructs response: `"Hello AUTH"` and email from `jwt.getClaim("email")`.
3. **SecurityConfig**
   - Define minimal `SecurityFilterChain` bean permitting `/api/v1/public/**` and securing `/api/v1/private/**`.

### Tests

1. **Unit Test** for service logic (uses mock Jwt).
2. **Controller Test** with `@WebMvcTest` + `@Import(SecurityConfig.class)`:
   - Mock `JwtDecoder` bean.
   - Provide `Jwt` with scope `private.read`.
   - Expect 200 + JSON `{message:"Hello AUTH", email:"john@example.com"}`.
   - Second test without authentication → 401.
3. Coverage remains ≥ 80 %.

---

## Acceptance Criteria

1. **Functional:**
   - `GET /api/v1/private/info` with valid Bearer JWT (scope `private.read`) returns 200 and correct JSON.
   - Same request without or with invalid JWT returns 401.
2. **OpenAPI:** Endpoint appears with security scheme using `private.read` scope.
3. **Quality:** All backend tests green; coverage threshold met.

---

## Required Documentation Updates

| File           | Update                                                                                                              |
| -------------- | ------------------------------------------------------------------------------------------------------------------- |
| `README.md`    | Add curl example with `Authorization: Bearer <token>` header (developers can copy token from Zitadel JWT debugger). |
| `CHANGELOG.md` | Entry: "**Step 08** – Added private endpoint and JWT validation."                                                   |
| Javadoc        | Controller, service, and SecurityConfig.                                                                            |

---

On approval, Roo Code will break this into implementation subtasks.

