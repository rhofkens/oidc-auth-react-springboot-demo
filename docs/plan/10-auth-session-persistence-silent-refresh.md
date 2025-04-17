# Step 10 – Auth Session Persistence & Silent Refresh

> **Objective:** ensure authenticated sessions survive hard page reloads and demonstrate automatic token renewal so the demo remains logged in for extended periods.

---

## Scope

### Frontend Enhancements
1. **Session Storage Strategy**
   * Configure React OIDC library to store `access_token`, `refresh_token`, and user profile in **sessionStorage** (already done via default settings) with custom storage key `oidc-auth-demo-app`.
2. **Silent Renew Setup**
   * Enable `automaticSilentRenew: true` in library config.
   * Provide `silent_redirect_uri` → `${origin}/auth/silent-renew`.
   * Add hidden route `/auth/silent-renew` rendering `<OidcSilentRenew />` (library component).
3. **Token Expiry Handling**
   * Listen to `userManager.events.accessTokenExpiring` and log to console.
   * Optionally show subtle toast “Refreshing session…” using shadcn `Toast`.
4. **Refresh Failure Handling**
   * On `accessTokenExpired` or `silentRenewError`, clear auth context and redirect to guest mode with banner message.

### Testing
* **Unit Tests (Vitest)**
  * Mock near‑expired token and verify silent renew handler called.
  * Mock silent renew error → auth cleared.
* **Manual QA Scenario**
  * Log in, wait token TTL (e.g., set to 2 minutes in Zitadel dev client). Observe automatic refresh network request and uninterrupted UI.

---

## Acceptance Criteria
1. **Persistence:** After successful login, perform full page reload (F5) → remains authenticated.
2. **Silent Renew:** During 30‑minute manual test window, token refreshes automatically without user interaction (verify via dev tools).
3. **Failure Path:** If silent renew fails (simulate by revoking session in Zitadel), app reverts to guest header with clear message.
4. **Tests:** New unit tests pass; overall frontend coverage ≥ 80 %.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`docs/auth-session.md`|Create file explaining storage key scheme, silent renew flow, and failure handling. |
|`README.md`|Add troubleshooting tips for silent‑renew issues (e.g., third‑party cookie blocking).|
|`CHANGELOG.md`|Entry: "**Step 10** – Auth session persistence & silent refresh implemented."|
|TSDoc|Document new event handlers and silent renew component.|

---

This completes the high‑level implementation plan. After approval, Roo Code can now iterate through each step’s subtasks.