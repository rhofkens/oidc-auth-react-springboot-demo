# Step 09 – Protected Tile B & Auth UI State

> **Objective:** make the frontend consume the secured `/private/info` endpoint when authenticated and render the response (including email) in Tile B, while keeping placeholder behaviour for guests.

---

## Scope

### Fetch Layer
* **fetchWithAuth.ts** – wrapper around native `fetch` that:
  * Reads `access_token` from `useAuth()` context.
  * Adds `Authorization: Bearer <token>` header when token present.
  * Falls back to regular fetch for guest mode.

### PrivateTile Component Enhancement
1. If `isAuthenticated` is false → show placeholder (unchanged).
2. If true:
   * Call `fetchWithAuth('/api/v1/private/info')` via `useFetch`.
   * Show loading, error, or success state displaying:
     > Private endpoint returned personal data: **{email}**
3. Optionally show spinner while loading (shadcn `Spinner` component).
4. Error path propagates to ErrorBanner via `useFetch`.

### Styling
* Use same card layout as PublicTile; emphasise email with bold text.

### Tests (Vitest)
* **Authenticated Success:** mock `useAuth` returning token; mock fetch 200 JSON; assert email rendered.
* **Authenticated 401:** mock fetch 401 → ErrorBanner appears.
* **Guest:** mock `useAuth` unauthenticated → placeholder rendered.

---

## Acceptance Criteria
1. Logging in (Step 07) then navigating to app shows Tile B with email from backend.
2. Logging out reverts Tile B to placeholder.
3. Bad token results in ErrorBanner and placeholder.
4. Frontend test coverage still ≥ 80 %.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`docs/error-handling.md`|Add 401 Unauthorized flow explanation.|
|`CHANGELOG.md`|Entry: "**Step 09** – Protected Tile B consumes private endpoint."|
|TSDoc|`fetchWithAuth` docs; update `PrivateTile` comment.|

---

Upon approval, Roo Code will break this plan into subtasks.

