# Step 05 – Session Persistence (Guest Mode)

> **Objective:** make the guest experience resilient by caching the last successful public health response so the UI remains informative when the backend is temporarily unreachable.

---

## Scope

### Frontend Changes
1. **Caching in `useFetch`**
   * Add optional `cacheKey` parameter. When provided:
     * On successful fetch, persist JSON response to `sessionStorage` under that key.
     * On error, return cached payload (if any) and flag as **stale**.
2. **Badge Component**
   * Small Tailwind badge (e.g., grey pill) reading “stale data” displayed when result is cached.
3. **PublicTile Integration**
   * Call `useFetch('/api/v1/public/health', { cacheKey: 'health-cache' })`.
   * Show badge when `isStale` flag true.

### Visual Tweaks
* Ensure badge uses shadcn `Badge` component style (`bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full`).

### Tests (Vitest)
* **Success path:** fetch returns 200 ➜ JSON stored in `sessionStorage`.
* **Failure path:** mock 500 + existing cache ➜ component renders cached value and badge.
* **No cache path:** mock 500 with no cache ➜ triggers ErrorBanner (from Step 04).

---

## Acceptance Criteria
1. Run app, observe live health message. Stop backend, refresh page:
   * Health message still visible.
   * “stale data” badge displayed.
2. Clearing browser `sessionStorage` and refreshing with backend down results in error banner.
3. All new tests pass; coverage still ≥ 80 %.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`docs/decisions/session-cache.md`|Create file summarising why session‑level caching is used and limits (guest only).|
|`README.md`|Add note explaining how caching works and how to clear storage during dev.|
|`CHANGELOG.md`|Entry: "**Step 05** – Guest mode response cache & stale badge."|
|Code Comments|TSDoc for new `useFetch` parameters; inline comment where badge rendered.|

---

Confirm this step and Roo Code will proceed with subtasks.

