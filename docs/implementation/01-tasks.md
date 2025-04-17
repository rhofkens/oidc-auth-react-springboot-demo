# Step 01: Repo Scaffold & Toolchain Setup - Detailed Tasks

This document breaks down the implementation of Step 01 into granular tasks.

## A. Repository Root Setup

1.  **Task A1:** Create the root `.gitignore` file, including common ignores for Java (Maven), Node.js (node_modules), IDEs (VSCode, IntelliJ), and OS files (.DS_Store).
2.  **Task A2:** Create the root `.editorconfig` file specifying charset (utf-8), end_of_line (lf), indent_style (space), and indent_size (2 for YAML/MD, 4 for Java).
3.  **Task A3:** Create the root `LICENSE` file with the MIT License text.
4.  **Task A4:** Create an empty `CHANGELOG.md` file.
5.  **Task A5:** Create an initial `README.md` file (will be populated later in Task E1).

## B. Backend Setup (`backend/`)

1.  **Task B1:** Create the `backend/` directory.
2.  **Task B2:** Inside `backend/`, use Spring Initializr (via `curl` or web UI) to generate a Spring Boot 3.4.4 project:
    *   Group: `ai.bluefields` (or similar)
    *   Artifact: `auth-demo`
    *   Packaging: Jar
    *   Java Version: 21
    *   Dependencies: `web`, `validation` (implied by web starter), `test` (implied).
    *   Ensure `pom.xml` sets `<maven.compiler.release>21</maven.compiler.release>`.
3.  **Task B3:** Verify the Maven wrapper (`mvnw`, `mvnw.cmd`, `.mvn/`) exists in `backend/` and commit it.
4.  **Task B4:** Add and configure `spotless-maven-plugin` in `backend/pom.xml` using `google-java-format` version `1.17`. Include an execution goal tied to the `validate` phase.
5.  **Task B5:** Add and configure `jacoco-maven-plugin` in `backend/pom.xml`. Configure the `check` goal (bound to the `verify` phase) to enforce a line coverage ratio of 0.8 (80%).
6.  **Task B6:** Create a placeholder controller `backend/src/main/java/com/example/demo/HealthController.java`. (Can be an empty class for now).
7.  **Task B7:** Create a placeholder test class `backend/src/test/java/com/example/demo/HealthControllerTest.java` using JUnit 5. (Can contain a single, simple passing test).
8.  **Task B8:** Run `./mvnw clean verify` from the `backend/` directory to confirm compilation, test execution, Spotless formatting check, and Jacoco coverage check pass.
9.  **Task B9:** Run `./mvnw spring-boot:run` from the `backend/` directory to confirm the application starts without errors (expect 404 on `/`).

## C. Frontend Setup (`frontend/`)

1.  **Task C1:** Create the `frontend/` directory.
2.  **Task C2:** Inside `frontend/`, initialize a Vite project using `pnpm create vite@latest . --template react-ts`. Select React 19 and TypeScript.
3.  **Task C3:** Install and configure Tailwind CSS 3.x:
    *   Run `pnpm install -D tailwindcss postcss autoprefixer`.
    *   Run `npx tailwindcss init -p`.
    *   Configure `tailwind.config.js` (content paths).
    *   Update `frontend/src/index.css` with Tailwind directives.
4.  **Task C4:** Initialize `shadcn/ui`:
    *   Run `pnpm dlx shadcn-ui@latest init`. Accept defaults (or configure as needed).
5.  **Task C5:** Install testing libraries: `pnpm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitejs/plugin-react`.
6.  **Task C6:** Configure Vitest in `frontend/vite.config.ts` (add `test` block with `globals: true`, `environment: 'jsdom'`, `setupFiles`). Create the setup file if needed.
7.  **Task C7:** Create a sample test file `frontend/src/App.test.tsx` that renders the default `App` component and performs a basic assertion using `@testing-library/react`.
8.  **Task C8:** Install and configure ESLint and Prettier:
    *   Run `pnpm install -D eslint prettier eslint-config-airbnb-typescript @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks eslint-config-prettier eslint-plugin-prettier`.
    *   Create `.eslintrc.cjs` extending recommended configs (`airbnb-typescript`, `plugin:prettier/recommended`). Configure parser options for TS project.
    *   Create `.prettierrc.json` with desired settings (e.g., `semi: true`, `singleQuote: true`).
    *   Create `.eslintignore` and `.prettierignore`.
9.  **Task C9:** Add `lint` and `format` scripts to `frontend/package.json` (e.g., `eslint . --ext .ts,.tsx`, `prettier --write .`).
10. **Task C10:** Install and configure Husky and lint-staged:
    *   Run `pnpm install -D husky lint-staged`.
    *   Run `npx husky init`.
    *   Configure `lint-staged` in `package.json` or `.lintstagedrc.json` to run format/lint scripts on staged `.ts`/`.tsx` files.
    *   Modify the `.husky/pre-commit` hook to run `npx lint-staged`.
11. **Task C11:** Run `pnpm install` from the `frontend/` directory to ensure dependencies are installed correctly.
12. **Task C12:** Run `pnpm test` from the `frontend/` directory to ensure the sample test passes.
13. **Task C13:** Run `pnpm dev` from the `frontend/` directory to ensure the default Vite app runs.
14. **Task C14:** Test the pre-commit hook: stage a file with a deliberate lint error and attempt to commit; verify the commit is blocked. Fix the error and verify the commit succeeds.

## D. CI Setup (`.github/workflows/`)

1.  **Task D1:** Create the `.github/workflows/` directory structure.
2.  **Task D2:** Create the `ci.yml` file within `.github/workflows/`. Define the workflow trigger (e.g., `on: [push, pull_request]`).
3.  **Task D3:** Define the `backend-test` job in `ci.yml`:
    *   Runs on `ubuntu-latest`.
    *   Uses `actions/checkout@v4`.
    *   Sets up JDK 21 using `actions/setup-java@v4`.
    *   Runs `./mvnw -B verify` (using `-B` for non-interactive batch mode) from the `backend/` directory.
    *   (Optional but recommended) Uploads the Jacoco report (`backend/target/site/jacoco/`) using `actions/upload-artifact@v4`.
4.  **Task D4:** Define the `frontend-test` job in `ci.yml`:
    *   Runs on `ubuntu-latest`.
    *   Uses `actions/checkout@v4`.
    *   Sets up Node.js 20 using `actions/setup-node@v4`, enabling pnpm caching.
    *   Runs `pnpm install` from the `frontend/` directory.
    *   Runs `pnpm test -- --coverage` from the `frontend/` directory.
    *   (Optional but recommended) Uploads the coverage report (`frontend/coverage/`) using `actions/upload-artifact@v4`.

## E. Documentation Updates

1.  **Task E1:** Update the root `README.md`:
    *   Add "Prerequisites" section (JDK 21, Node 20, pnpm).
    *   Add "Getting Started" section with commands to run backend (`./mvnw spring-boot:run` in `backend/`) and frontend (`pnpm dev` in `frontend/`).
    *   Add "Testing" section with commands (`./mvnw verify` in `backend/`, `pnpm test` in `frontend/`).
    *   Add a placeholder for the CI status badge (link to the workflow).
2.  **Task E2:** Add the first entry to `CHANGELOG.md`: `## [Unreleased] - YYYY-MM-DD\n### Added\n- **Step 01:** Initial repository scaffold, backend (Spring Boot) and frontend (React/Vite) skeletons, basic toolchain (Maven, pnpm, Vite, ESLint, Prettier, Spotless, Jacoco, Vitest), Husky pre-commit hooks, and GitHub Actions CI pipeline.`

---
*End of Tasks for Step 01*