# Step 02 – Public Health Endpoint (Backend)

> **Objective:** expose a simple unauthenticated endpoint that returns a health message, establishing patterns for service, controller, testing, and OpenAPI documentation.

---

## Scope

### Production Code
1. **Service layer**
   * `HealthService` (`@Service`)
     * Method `getStatus() : HealthResponse` returning immutable DTO `HealthResponse(String message)` (Java record).
2. **DTO**
   * `HealthResponse` record in package `com.example.demo.health`.
3. **Controller layer**
   * `HealthController` mapped to `/api/v1/public/health` (HTTP GET).
   * Produces `application/json` body `{"message":"Service up"}`.
   * Annotate with `@Operation(summary="Health check", tags={"public"})` for OpenAPI.

### Tests
* **Unit test** for `HealthService` verifying returned message.
* **Controller test** using `@WebMvcTest(HealthController.class)` and `MockMvc` asserting:
  * Status 200
  * Content‑Type `application/json`
  * JSON path `$.message == "Service up"`.
* Mock service in controller test via `@MockBean`.

### Configuration / Build
* No new dependencies beyond Spring Boot starter test.
* Update Jacoco coverage rules if needed (should remain ≥ 80 %).

---

## Acceptance Criteria
1. **Functional:** `GET http://localhost:8080/api/v1/public/health` returns 200 and JSON `{ "message": "Service up" }`.
2. **Documentation:** Endpoint appears in `/v3/api-docs` and Swagger UI (if enabled).
3. **Quality:** Jacoco coverage ≥ 80 %; tests green.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`README.md`|Add example curl command for the health endpoint.|
|`CHANGELOG.md`|Entry: "**Step 02** – Added public health endpoint."|
|Javadoc|Class‑level Javadoc on `HealthController` and `HealthService`.|

---

Once approved, Roo Code will break this scope into implementation subtasks.

