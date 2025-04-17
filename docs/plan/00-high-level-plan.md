# High‑Level Implementation Plan – oidc-auth-demo-app

> **Objective** Deliver the demo in ten small, reviewable increments. Each step has a clear scope, acceptance criteria, and required documentation updates.

| Step | Title | Scope (Meaningful Increment) | Acceptance Criteria | Documentation Tasks |
|------|-------|-----------------------------|---------------------|---------------------|
|1|Repo Scaffold & Toolchain Setup|Mono‑repo skeleton (backend & frontend), CI, lint/format/test plumbing|CI green on empty skeleton; local build/tests pass|README + CHANGELOG entry|
|2|Public Health Endpoint (Backend)|`GET /api/v1/public/health` returns JSON; unit & controller tests|200 JSON response; coverage ≥ 80%; OpenAPI lists endpoint|Javadoc; README curl sample|
|3|Guest UI Skeleton (Frontend)|Header + two tiles; fetch health; placeholder Tile B|Health message shown; placeholder visible; frontend tests ≥ 80%|TSDoc; dev‑proxy note in README|
|4|Baseline Error Handling|Problem‑JSON mapper (backend); error banner (frontend)|Forced 500 shows banner; tests for mapper & banner|docs/error‑handling.md|
|5|Session Persistence (Guest Mode)|Cache public health in `sessionStorage`; “stale data” badge|Refresh with backend down shows cached value|docs/decisions/session-cache.md|
|6|OIDC Configuration Skeleton|Env var scaffolding for Zitadel; no runtime auth yet|Apps start with/without env vars; guest mode unchanged|docs/auth-config.md|
|7|Frontend Login / Logout Flow|OIDC PKCE login & logout; auth context; header shows name|Login displays name; logout reverts to guest; tokens stored|TSDoc; README auth section|
|8|Backend Private Endpoint & JWT Validation|Enable resource‑server; `/private/info` secured with scope|Valid JWT → 200 with email; no token → 401|OpenAPI security; Javadoc|
|9|Protected Tile B & Auth UI State|Tile B fetches private info when authenticated|Logged‑in sees email; guest sees placeholder; 401 shows banner|Update error doc for 401|
|10|Auth Session Persistence & Silent Refresh|Persist tokens; silent renew; auto‑refresh before expiry|Hard refresh keeps auth; token refresh observed in 30‑min test|docs/auth-session.md|

### Common Documentation Instructions (apply to every step)
1. **Code comments** — Follow Javadoc / TSDoc guidelines.  
2. **CHANGELOG** — Add an entry summarising the step.  
3. **Docs folder** — Create/extend markdown files for new patterns; kebab‑case names.  
4. **README** — Keep run/test instructions current.

---

_Please review this high‑level plan. If it looks good, let me know and I’ll generate each step as its own markdown file, pausing for confirmation after each._

