# Step 07: Frontend Login/Logout Flow - Implementation Tasks

Based on `docs/plan/07-frontend-login-logout-flow.md` and aligned with `docs/guidelines/architecture.md` and `docs/guidelines/coding-guidelines.md`.

## 1. Dependencies

-   [ ] **Task 1.1:** Add `@axa-oss/react-oidc` library to `frontend/package.json` dependencies.
-   [ ] **Task 1.2:** Add `jwt-decode` library to `frontend/package.json` dependencies.
-   [ ] **Task 1.3:** Navigate to the `frontend` directory and run `pnpm install` to install the new dependencies.

## 2. Application Code

-   [ ] **Task 2.1:** Create the OIDC provider configuration component: `frontend/src/components/AuthProvider.tsx`.
    -   This component should wrap its children with the OIDC context provider from `@axa-oss/react-oidc`.
-   [ ] **Task 2.2:** Configure the OIDC provider in `AuthProvider.tsx`:
    -   Set `authority` from `import.meta.env.VITE_ZITADEL_ISSUER_URI`.
    -   Set `client_id` from `import.meta.env.VITE_ZITADEL_CLIENT_ID`.
    -   Set `redirect_uri` to `${window.location.origin}/auth/callback`.
    -   Set `scope` from `import.meta.env.VITE_ZITADEL_SCOPES`.
    -   Set `response_type` to `code`.
    -   Configure the library to use `sessionStorage` for token persistence.
-   [ ] **Task 2.3:** Update `frontend/src/main.tsx` to wrap the `<App />` component (or the router component) with the newly created `<AuthProvider />`.
-   [ ] **Task 2.4:** Create a custom hook `frontend/src/hooks/useAuth.ts` that re-exports the primary context hook provided by `@axa-oss/react-oidc` (e.g., `useOidc`). Add TSDoc explaining its purpose.
-   [ ] **Task 2.5:** Update routing configuration (likely in `frontend/src/App.tsx` or a dedicated router setup) to include a route for `/auth/callback`.
    -   This route should render the callback component provided by `@axa-oss/react-oidc` (e.g., `<OidcCallback />`).
    -   Configure the callback component to redirect to `/` upon successful authentication.
-   [ ] **Task 2.6:** Modify the `frontend/src/components/Header.tsx` component:
    -   Import and use the `useAuth` hook to access authentication state and functions.
-   [ ] **Task 2.7:** Implement conditional rendering in `Header.tsx` based on authentication status:
    -   If authenticated (`auth.user` exists): Display "Signed in as {auth.user.profile.name}" and a "Logout" button.
    -   If not authenticated: Display "Browsing as Guest" and a "Login" button.
-   [ ] **Task 2.8:** Implement the `onClick` handler for the "Login" button in `Header.tsx` to call the `signIn` function from the auth context (e.g., `auth.login()`).
-   [ ] **Task 2.9:** Implement the `onClick` handler for the "Logout" button in `Header.tsx` to call the `signOut` function from the auth context (e.g., `auth.logout()`).

## 3. Tests (Vitest)

-   [ ] **Task 3.1:** Create or update the test file for the Header component: `frontend/src/__tests__/components/Header.test.tsx`.
-   [ ] **Task 3.2:** Mock the `useAuth` hook or the underlying OIDC context to simulate different authentication states (authenticated user vs. guest).
-   [ ] **Task 3.3:** Write test cases to assert that the correct text ("Signed in as..." or "Browsing as Guest") is rendered in the header based on the mocked auth state.
-   [ ] **Task 3.4:** Write test cases to assert that the correct button ("Login" or "Logout") is rendered based on the mocked auth state.
-   [ ] **Task 3.5:** Write a test case to verify that clicking the "Login" button calls the mocked `signIn` function.
-   [ ] **Task 3.6:** Write a test case to verify that clicking the "Logout" button calls the mocked `signOut` function.
-   [ ] **Task 3.7:** Run `pnpm test` within the `frontend` directory. Ensure all tests pass and that the line coverage remains at or above the 80% threshold defined in the guidelines. Address any failures or coverage drops.

## 4. Documentation

-   [ ] **Task 4.1:** Update `README.md` (root level) by adding a section titled "Running with OIDC". Describe the necessary Zitadel client configuration (Redirect URI: `http://localhost:5173/auth/callback`, Post Logout URI: `http://localhost:5173/`, Application Type: `User Agent`, Auth Method: `None`). Mention the required environment variables (`VITE_ZITADEL_*`).
-   [ ] **Task 4.2:** Add an entry to `CHANGELOG.md`: "**Step 07** – Implemented frontend login/logout flow using @axa-oss/react-oidc for PKCE."
-   [ ] **Task 4.3:** Add TSDoc comments to `AuthProvider.tsx` detailing its props and purpose, and ensure `useAuth.ts` has adequate TSDoc as per Task 2.4.

## 5. Verification

-   [ ] **Task 5.1:** Manually test the login/logout flow against a configured Zitadel instance.
    -   Verify clicking "Login" redirects to Zitadel.
    -   Verify successful login redirects back to the app and updates the header.
    -   Verify clicking "Logout" clears the session and updates the header.
    -   Verify refreshing the page after login maintains the authenticated state.