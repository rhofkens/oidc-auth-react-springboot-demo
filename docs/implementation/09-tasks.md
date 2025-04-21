# Step 09 Subtasks: Protected Tile B & Auth UI State

This file outlines the subtasks required to implement Step 09, focusing on fetching protected data for authenticated users and updating the UI accordingly.

## Subtask 9.1: Create `fetchWithAuth` Utility

*   **Goal:** Implement a fetch wrapper that automatically includes the Authorization header for authenticated requests.
*   **File:** `frontend/src/lib/fetchWithAuth.ts` (Create new file)
*   **Details:**
    *   Import `useAuth` from `@/hooks/useAuth`.
    *   Define a function `fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response>`.
    *   Inside the function, get the `accessToken` and `isAuthenticated` status from `useAuth()`.
    *   If `isAuthenticated` and `accessToken` is present:
        *   Clone or create the `init` object.
        *   Add/merge the `Authorization: Bearer ${accessToken}` header.
    *   Call the native `fetch` with the potentially modified `init` object.
    *   Return the `fetch` promise.
    *   Add comprehensive TSDoc explaining its purpose, parameters, and usage.
*   **Verification:** Ensure the function correctly adds the header only when authenticated.

## Subtask 9.2: Implement Unit Tests for `fetchWithAuth`

*   **Goal:** Verify the `fetchWithAuth` utility functions correctly in different scenarios.
*   **File:** `frontend/src/__tests__/lib/fetchWithAuth.test.ts` (Create new file)
*   **Details:**
    *   Mock `useAuth` hook.
    *   Mock native `fetch`.
    *   **Test Case 1 (Authenticated):** Mock `useAuth` returning `isAuthenticated: true` and an `accessToken`. Assert that `fetch` is called with the correct `Authorization` header.
    *   **Test Case 2 (Unauthenticated):** Mock `useAuth` returning `isAuthenticated: false`. Assert that `fetch` is called *without* the `Authorization` header.
    *   **Test Case 3 (Existing Headers):** Mock `useAuth` authenticated. Call `fetchWithAuth` with existing headers in `init`. Assert that the `Authorization` header is added without removing existing headers.
*   **Verification:** All tests pass.

## Subtask 9.3: Enhance `PrivateTile` Component

*   **Goal:** Modify `PrivateTile` to fetch and display data from the protected endpoint when the user is authenticated.
*   **File:** `frontend/src/components/PrivateTile.tsx`
*   **Details:**
    *   Import `useAuth` from `@/hooks/useAuth`.
    *   Import `useFetch` from `@/hooks/useFetch`.
    *   Import `fetchWithAuth` from `@/lib/fetchWithAuth`.
    *   Import `Spinner` component (assuming it exists or needs creation based on shadcn).
    *   Get `isAuthenticated` from `useAuth()`.
    *   **Conditional Logic:**
        *   If `!isAuthenticated`, render the existing placeholder content.
        *   If `isAuthenticated`:
            *   Call `useFetch<PrivateInfoResponse>('/api/v1/private/info', { fetcher: fetchWithAuth })`. (Define `PrivateInfoResponse` type based on `backend/src/main/java/ai/bluefields/oidcauthdemo/dto/PrivateInfoResponse.java` - likely `{ email: string }`).
            *   Render loading state (e.g., show `Spinner`).
            *   Render error state (errors will be handled by `useFetch` and shown in `ErrorBanner`). If `error`, perhaps show a generic message in the tile like "Could not load private data."
            *   Render success state: Display "Private endpoint returned personal data: **{data.email}**" using the same `Card` structure as `PublicTile`.
    *   Update component TSDoc to reflect new behavior.
*   **Verification:** Component renders correctly based on authentication state and fetch results.

## Subtask 9.4: Implement Unit Tests for `PrivateTile`

*   **Goal:** Verify the `PrivateTile` component renders correctly under different authentication and data fetching scenarios.
*   **File:** `frontend/src/__tests__/components/PrivateTile.test.tsx`
*   **Details:**
    *   Mock `useAuth` hook.
    *   Mock `useFetch` hook.
    *   **Test Case 1 (Guest):** Mock `useAuth` as unauthenticated. Assert that the placeholder text is rendered.
    *   **Test Case 2 (Authenticated - Loading):** Mock `useAuth` as authenticated. Mock `useFetch` returning `{ data: null, error: null, isLoading: true }`. Assert that a loading indicator (e.g., Spinner or loading text) is rendered.
    *   **Test Case 3 (Authenticated - Success):** Mock `useAuth` as authenticated. Mock `useFetch` returning `{ data: { email: 'test@example.com' }, error: null, isLoading: false }`. Assert that the success message with the email is rendered.
    *   **Test Case 4 (Authenticated - Error):** Mock `useAuth` as authenticated. Mock `useFetch` returning `{ data: null, error: new Error('Failed to fetch'), isLoading: false }`. Assert that an appropriate message or state is shown within the tile (the global `ErrorBanner` is implicitly tested via `useFetch`'s error handling).
*   **Verification:** All tests pass. Frontend test coverage remains ≥ 80%.

## Subtask 9.5: Update Documentation

*   **Goal:** Update project documentation to reflect the changes made in this step.
*   **Files:**
    *   `docs/error-handling.md`
    *   `CHANGELOG.md`
*   **Details:**
    *   In `docs/error-handling.md`, add a section explaining how 401 Unauthorized errors from the private API are handled (caught by `useFetch`, displayed in `ErrorBanner`).
    *   In `CHANGELOG.md`, add the entry: `**Step 09** – Protected Tile B consumes private endpoint.`
*   **Verification:** Documentation accurately reflects the new functionality and error handling.