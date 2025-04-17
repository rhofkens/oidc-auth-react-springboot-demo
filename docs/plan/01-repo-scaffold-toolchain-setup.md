# Step 01 – Repo Scaffold & Toolchain Setup

> **Objective:** establish an empty yet runnable mono‑repo with all essential build, test, lint, and CI plumbing. Subsequent steps will build on this foundation.

---

## Scope

### Backend (`/backend`)
* Generate Spring Boot **3.4.4** application (Maven archetype or Spring Initializr) with:
  * Dependencies: `spring-boot-starter-web`, `spring-boot-starter-test`.
  * Java **21** toolchain via `<maven.compiler.release>21</maven.compiler.release>`.
* Commit Maven wrapper (`mvnw`, `mvnw.cmd`) and `.mvn/wrapper/` scripts.
* Add **Spotless** plugin configured with `google-java-format 1.17`.
* Add **Jacoco** plugin enforcing **80 % line coverage** (will pass until real code added).
* Create placeholder class `HealthController` and empty test `HealthControllerTest` (JUnit 5) to validate Maven test execution.

### Frontend (`/frontend`)
* Initialise with **Vite** React 19 + TypeScript template (`npm create vite@latest`).
* Configure **Tailwind CSS 3.x** and **shadcn/ui** (`npx shadcn-ui@latest init`).
* Install **Vitest** + **@testing-library/react**; create sample test `App.test.tsx`.
* Set up **ESLint** (`eslint-config-airbnb-typescript`) and **Prettier**; add formatting/lint scripts to `package.json`.
* Configure **husky** + **lint‑staged** pre‑commit hook running `npm run lint` & `npm run format`.

### Continuous Integration / Repo Meta
* **GitHub Actions** workflow `.github/workflows/ci.yml` with two jobs:
  * **backend-test** – Setup Java 21, run `./mvnw test`, upload Jacoco report.
  * **frontend-test** – Setup Node 20, run `pnpm install && pnpm test -- --coverage`.
* Root `.editorconfig` (UTF‑8, LF, 2‑space indent for YAML/MD, 4 spaces for Java).
* Root `.gitignore` covering Java, Node, and IDE artefacts.
* Root `LICENSE` (MIT).

---

## Acceptance Criteria
1. **Local build:** `./mvnw test` succeeds without warnings; `pnpm install && pnpm test` passes.
2. **Local run:**
   * `./mvnw spring-boot:run` starts backend (returns 404 on `/`).
   * `pnpm dev` serves blank React page at `http://localhost:5173`.
3. **CI:** On fresh clone, GitHub Actions workflow executes and both jobs pass.
4. **Lint/format hooks:** A commit with lint errors is blocked by husky.

---

## Required Documentation Updates
| File | Change |
|------|--------|
|`README.md`|Add prerequisites (JDK 21, Node 20, pnpm) and quick‑start commands for backend and frontend; note how to run tests and CI badge URL.|
|`CHANGELOG.md`|Entry: "**Step 01** – Repo scaffold, toolchain setup, CI pipeline."|

*No additional docs required at this point.*

---

Once this file is approved, Roo Code will decompose it into implementation subtasks.

