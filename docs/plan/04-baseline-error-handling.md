# Step 04 – Baseline Error Handling

> **Objective:** introduce a consistent error‑handling strategy across backend and frontend to surface failures gracefully while keeping diagnostics for developers.

---

## Scope

### Backend
1. **Problem JSON Model**
   * Java record `ApiError(String type, String title, int status, String detail, Instant timestamp)` following RFC 7807.
2. **Global Exception Handler**
   * `@RestControllerAdvice` class `GlobalExceptionHandler`.
   * Methods to handle `Exception` → `ApiError` with `status=500`.
3. **Error Classification Stub**
   * Map Spring‐thrown `HttpRequestMethodNotSupportedException`, etc., to relevant 4xx codes (baseline only).

### Frontend
1. **Error Store**
   * Lightweight Zustand store or React Context holding latest error message.
2. **`useFetch` Enhancement**
   * Detect non‑2xx responses, parse Problem JSON, and push error string to store.
3. **ErrorBanner Component**
   * Fixed top element (shadcn `Alert`) that fades in/out via Framer Motion when store has message.
4. **Hook Integration**
   * PublicTile now shows banner if fetch fails (no other behaviour change).

### Tests
* **Backend:** JUnit test hitting non‑existent URL `/bad` verifies 404 Problem JSON; test for forced `RuntimeException` verifies 500 mapping.
* **Frontend:** Vitest test mocking 500 response ensures banner renders with text “Service unavailable—please retry”.

---

## Acceptance Criteria
1. Stopping backend while frontend is running and refreshing page shows error banner with user‑friendly message.
2. Backend returns Problem JSON for uncaught exceptions (validated via integration test).
3. All unit and UI tests pass; coverage thresholds remain ≥ 80 %.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`docs/error-handling.md`|Create file detailing Problem JSON format, GlobalExceptionHandler, and ErrorBanner usage.|
|`CHANGELOG.md`|Entry: "**Step 04** – Baseline error handling added."|
|Code Comments|Javadoc on `GlobalExceptionHandler`; TSDoc on `useFetch` error handling and `ErrorBanner`.|

---

After approval, Roo Code will break this scope into implementation subtasks.

