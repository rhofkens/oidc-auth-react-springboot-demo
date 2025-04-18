# Step 05: Session Persistence (Guest Mode) - Subtasks

This plan outlines the subtasks required to implement session persistence for the public health check in guest mode, as defined in `docs/plan/05-session-persistence-guest-mode.md`.

## Subtasks

1.  **Modify `useFetch` Hook:**
    *   **File:** `frontend/src/hooks/useFetch.ts`
    *   **Action:** Enhance the hook to accept an optional `cacheKey: string` in its options.
    *   **Action:** Modify the return type to include an optional `isStale: boolean` flag.
    *   **Action:** Implement caching logic:
        *   On successful fetch (2xx), store the JSON response in `sessionStorage` using the `cacheKey`. Set `isStale` to `false`.
        *   On fetch error (network error or non-2xx response):
            *   Attempt to retrieve data from `sessionStorage` using `cacheKey`.
            *   If cached data exists, return `{ data: cachedData, error: null, isLoading: false, isStale: true }`.
            *   If no cached data exists, return the original error `{ data: null, error: originalError, isLoading: false, isStale: false }`.
    *   **Action:** Add TSDoc comments for the new options parameter (`cacheKey`) and the new return value (`isStale`).
    *   **Reference:** Coding Guidelines §2.3 (Hooks), §2.7 (TSDoc). Architecture Guidelines §3 (Frontend Stack).

2.  **Implement Stale Badge Component:**
    *   **File:** `frontend/src/components/ui/badge.tsx` (Verify if shadcn component exists and meets style requirements, otherwise adapt/create).
    *   **Action:** Ensure a `Badge` component is available that renders with the specified style: `bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full`.
    *   **Action:** This badge will be used to display the text "stale data".
    *   **Reference:** Step Plan § Scope/Visual Tweaks. Coding Guidelines §2.4 (Styling, shadcn/ui).

3.  **Integrate Caching in `PublicTile`:**
    *   **File:** `frontend/src/components/PublicTile.tsx`
    *   **Action:** Update the `useFetch` call for `/api/v1/public/health` to include the option `{ cacheKey: 'health-cache' }`.
    *   **Action:** Conditionally render the "stale data" `Badge` component within the tile when the `isStale` flag returned by `useFetch` is `true`.
    *   **Action:** Add an inline comment explaining *why* the badge is rendered.
    *   **Reference:** Step Plan § Scope/PublicTile Integration. Coding Guidelines §2.3 (Components), §2.7 (Comments).

4.  **Update `useFetch` Tests:**
    *   **File:** `frontend/src/__tests__/hooks/useFetch.test.ts`
    *   **Action:** Add tests to cover the new caching functionality:
        *   Scenario: Successful fetch with `cacheKey` stores data in `sessionStorage`, `isStale` is `false`.
        *   Scenario: Failed fetch with `cacheKey` and *existing* cached data returns cached data, `isStale` is `true`.
        *   Scenario: Failed fetch with `cacheKey` and *no* cached data returns an error, `isStale` is `false`.
    *   **Action:** Implement mocking for `sessionStorage` (`getItem`, `setItem`, `removeItem`).
    *   **Reference:** Step Plan § Scope/Tests. Coding Guidelines §2.6 (Testing), §1.9 (Coverage). Architecture Guidelines §6.1 (Vitest).

5.  **Update `PublicTile` Tests:**
    *   **File:** `frontend/src/__tests__/components/PublicTile.test.tsx`
    *   **Action:** Add/modify tests to verify the `PublicTile` component's rendering based on `useFetch`'s state:
        *   Scenario: Renders correctly with live data (no badge).
        *   Scenario: Renders correctly with stale data (shows cached message and the "stale data" badge).
        *   Scenario: Renders correctly during error state when no cache is available (error handled by hook/banner).
    *   **Reference:** Step Plan § Scope/Tests. Coding Guidelines §2.6 (Testing).

6.  **Create Cache Decision Document:**
    *   **File:** `docs/decisions/session-cache.md` (New file)
    *   **Action:** Create the file and write a summary explaining the rationale for using `sessionStorage` for guest mode caching, its limitations (e.g., tab-specific, cleared on browser close), and why it was chosen over alternatives (like `localStorage` or more complex state management).
    *   **Reference:** Step Plan § Required Documentation Updates.

7.  **Update README:**
    *   **File:** `README.md`
    *   **Action:** Add a section or note explaining the guest mode caching feature, how it uses `sessionStorage`, and how developers can manually clear `sessionStorage` if needed during development or testing.
    *   **Reference:** Step Plan § Required Documentation Updates.

8.  **Update CHANGELOG:**
    *   **File:** `CHANGELOG.md`
    *   **Action:** Add a new entry under the relevant version/date: "**Step 05** – Implement client-side caching for public health endpoint using `sessionStorage` to display stale data when the backend is unavailable. Added a 'stale data' badge to the UI."
    *   **Reference:** Step Plan § Required Documentation Updates.