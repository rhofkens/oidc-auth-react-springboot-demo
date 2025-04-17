# Step 02: Public Health Endpoint (Backend) - Detailed Tasks

This document breaks down the implementation of Step 02 into granular tasks.

## A. Service Layer Implementation

**Create the service layer components:**
* Create the `HealthResponse` record in the `ai.bluefields.oidcauthdemo.health` package with a single field `message` of type `String`.
* Create the `HealthService` class in the `ai.bluefields.oidcauthdemo.health` package:
  * Annotate with `@Service`.
  * Implement the `getStatus()` method that returns a new `HealthResponse` with the message "Service up".
  * Add appropriate Javadoc comments.

## B. Controller Layer Implementation

**Update the existing `HealthController` class in the `ai.bluefields.oidcauthdemo` package:**
* Annotate with `@RestController` and `@RequestMapping("/api/v1/public/health")`.
* Inject the `HealthService` using constructor injection.
* Implement a GET endpoint method that returns the result of `healthService.getStatus()`.
* Annotate the endpoint method with `@GetMapping` and `@Operation(summary="Health check", tags={"public"})`.
* Add appropriate Javadoc comments.

## C. Test Implementation

**Implement tests for the health endpoint:**
* Create a unit test for `HealthService` in the `ai.bluefields.oidcauthdemo.health` package:
  * Create `HealthServiceTest` class with JUnit 5.
  * Test that `getStatus()` returns a `HealthResponse` with the message "Service up".
* Implement the `HealthControllerTest` class in the `ai.bluefields.oidcauthdemo` package:
  * Annotate with `@WebMvcTest(HealthController.class)`.
  * Use `MockMvc` for testing.
  * Mock the `HealthService` using `@MockBean`.
  * Test that the endpoint returns status 200, content type `application/json`, and the expected JSON response.
  * Verify that the service method is called.

## D. Configuration

**Update configuration as needed:**
* Add the OpenAPI dependency to `backend/pom.xml` if not already present:
  * Add `springdoc-openapi-starter-webmvc-ui` dependency.
* Verify Jacoco coverage rules in `backend/pom.xml`:
  * Ensure coverage remains at or above 80%.

## E. Documentation Updates

**Update project documentation:**
* Update the root `README.md`:
  * Add an example curl command for the health endpoint.
* Update `CHANGELOG.md`:
  * Add entry: "**Step 02** – Added public health endpoint."

## F. Verification

**Verify the implementation:**
* Run the backend tests with `./mvnw test` from the `backend/` directory.
* Run the backend with coverage check using `./mvnw verify` from the `backend/` directory.
* Start the backend with `./mvnw spring-boot:run` and manually test the endpoint at `http://localhost:8080/api/v1/public/health`.
* Verify OpenAPI documentation at `http://localhost:8080/swagger-ui.html` while the backend is running.
*End of Tasks for Step 02*