# Decision: Caching Public Health Endpoint Response

**Date:** 2025-04-18

## Context

The frontend application displays the status of the backend health endpoint, even for unauthenticated (guest) users. During page loads or refreshes, there might be a brief moment where the backend is temporarily unavailable or slow to respond. To improve the user experience and provide a consistent status display during these moments, we decided to cache the last known health status.

## Decision: Use `sessionStorage`

We chose `sessionStorage` for caching the public health endpoint response for the following reasons:

*   **Suitability for Temporary Data:** The health status is session-specific and doesn't need to persist beyond the user's current browsing session. `sessionStorage` is designed for exactly this purpose.
*   **Automatic Cleanup:** Data stored in `sessionStorage` is automatically cleared when the browser tab or window is closed, eliminating the need for manual cleanup logic.
*   **Simplicity:** Using `sessionStorage` is straightforward and avoids introducing the complexity of `localStorage` or a dedicated state management library (like Redux or Zustand) solely for this simple caching requirement.

## Limitations

*   **Tab/Window Isolation:** Data in `sessionStorage` is scoped to the specific browser tab or window. The cached status won't be shared if the user opens the application in multiple tabs.
*   **Session Lifetime:** The cache is lost when the session ends (tab/window closed).

These limitations are acceptable for the guest-mode health check use case, as the primary goal is to handle transient backend unavailability during page loads within a single session.

## Alternatives Considered

*   **`localStorage`:** While `localStorage` offers persistence across sessions, this level of persistence was deemed unnecessary for the temporary health status cache. Using `localStorage` would require manual data invalidation logic, adding complexity.