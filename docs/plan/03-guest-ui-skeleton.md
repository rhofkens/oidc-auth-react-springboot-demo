# Step 03 – Guest UI Skeleton (Frontend)

> **Objective:** render the initial guest interface, fetch the public health message, and lay out both service tiles. No authentication logic yet.

---

## Scope

### Components & Hooks

1. **Header** – Displays “Browsing as Guest” plus disabled Login button.
2. **Tiles Grid** – Simple responsive grid (Tailwind) holding two child components.
3. **PublicTile**
   - Uses reusable `useFetch` hook to call `/api/v1/public/health`.
   - Shows loading spinner, error state, or the `message` value.
4. **PrivateTile** – Static placeholder text:
   > No access to private endpoint. Please login to get access.
5. ``** Hook**
   - Generic wrapper around `fetch` with typed response & error handling.
   - Emits errors to console for now (will integrate banner in Step 04).

### Styling

- Tailwind CSS 3.x utilities for layout (`grid`, `gap`, `p-4`, `rounded-lg`, `shadow`).
- shadcn/ui card component may wrap each tile for consistent styling.

### Testing (Vitest + React Testing Library)

- **PublicTile:** mock successful fetch → message rendered.
- **PublicTile:** mock failed fetch → fallback “Error loading data”.
- **PrivateTile:** renders placeholder.
- Coverage goal ≥ 80 % lines (frontend).

### Dev Proxy

- Add `vite.config.ts` devServer proxy:
  ```ts
  server: {
    proxy: {
      '/api': 'http://localhost:8080'
    }
  }
  ```

---

## Acceptance Criteria

1. Running backend (Step 02) and `pnpm dev` shows:
   - Header “Browsing as Guest”
   - PublicTile with live message "Service up"
   - PrivateTile with placeholder text.
2. Stopping backend results in PublicTile error state (banner added next step).
3. `pnpm test` passes with ≥ 80 % coverage.

---

## Required Documentation Updates

| File           | Update                                                                           |
| -------------- | -------------------------------------------------------------------------------- |
| `README.md`    | Add instructions to start frontend dev server and note `/api` proxy requirement. |
| `CHANGELOG.md` | Entry: "**Step 03** – Guest UI skeleton with health fetch."                      |
| TSDoc          | Add comments for `useFetch`, `PublicTile`, `PrivateTile`.                        |

---

Once approved, Roo Code will decompose this scope into subtasks.

