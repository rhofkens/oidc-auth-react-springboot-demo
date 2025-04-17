# Step 07 – Frontend Login / Logout Flow

> **Objective:** enable users to authenticate with Zitadel using the OIDC PKCE flow, manage auth state client‑side, and switch the UI header accordingly. No protected API calls yet.

---

## Scope

### Dependencies
* Add `@axa-oss/react-oidc-context` (or comparable PKCE‑capable library).
* Add `jwt-decode` for lightweight claim parsing if needed.

### Application Code
1. **AuthProvider**
   * New component wrapping `<App />`, configured with:
     * `authority` = `import.meta.env.VITE_ZITADEL_ISSUER_URI`
     * `client_id` = `import.meta.env.VITE_ZITADEL_CLIENT_ID`
     * `redirect_uri` = `${window.location.origin}/auth/callback`
     * `scope` = `import.meta.env.VITE_ZITADEL_SCOPES`
     * `response_type` = `code`
   * Persists tokens in **sessionStorage** via library settings.
2. **AuthContext Hook** (`useAuth`) — re‑export library hook for ease.
3. **Routing**
   * Add route `/auth/callback` rendering `<OidcCallback />` (library component) then redirecting to `/`.
4. **Header Component Update**
   * If `auth.user` exists ⇒ text “Signed in as {auth.user.profile.name}” and show **Logout** button.
   * Else keep “Browsing as Guest” & **Login** button.
5. **Button Handlers**
   * Login button calls `auth.signIn()` (redirect flow).
   * Logout button calls `auth.signOut()`.
6. **Token Storage Check**
   * On app boot, library auto‑rehydrates user from `sessionStorage`.

### Tests (Vitest)
* Mock OIDC context to simulate authenticated vs guest states; assert header text and visible button.
* Verify that clicking Login calls `auth.signIn` mock.

---

## Acceptance Criteria
1. **Manual Flow:** Using real Zitadel test tenant, clicking Login redirects to consent page, returns to app, and header shows name. Clicking Logout returns to guest header.
2. **Persistence:** After successful login, refresh page → remains authenticated.
3. **Tests:** New unit tests pass; frontend coverage still ≥ 80 %.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`README.md`|Add “Running with OIDC” section describing redirect URI and required Zitadel client settings.|
|`CHANGELOG.md`|Entry: "**Step 07** – Implemented frontend login/logout flow."|
|TSDoc|Document `AuthProvider` props and `useAuth` hook usage.|

---

On approval, Roo Code will decompose this plan into implementation subtasks.

