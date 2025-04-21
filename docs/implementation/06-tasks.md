# Step 06: OIDC Configuration Skeleton - Implementation Tasks

Based on `docs/plan/06-oidc-configuration-skeleton.md`, `docs/guidelines/architecture.md`, and `docs/guidelines/coding-guidelines.md`.

**Note:** Removed `private.read` scope due to current Zitadel limitations. Authorization strategy for Step 8 will need to rely on standard claims/roles. Subsequent plan files (Steps 7, 8) will be updated accordingly in this step.

## Subtasks

1.  **Task 6.1: Root Environment Configuration**
    *   Create the file `.env.example` in the repository root (`/`).
    *   Add the following content (scope `private.read` removed):
        ```dotenv
        # Zitadel OIDC settings
        ZITADEL_AUTHDEMO_ISSUER_URI=https://issuer.zitadel.ch/oauth/v2
        ZITADEL_AUTHDEMO_CLIENT_ID=demo-frontend
        ZITADEL_AUTHDEMO_BACKEND_CLIENT_ID=demo-backend
        ZITADEL_AUTHDEMO_CLIENT_SECRET=change-me
        # Standard OIDC scopes
        ZITADEL_AUTHDEMO_SCOPES=openid profile email
        ```

2.  **Task 6.2: Update Root Gitignore**
    *   Read the content of the root `.gitignore` file.
    *   Append the line `.env` to the root `.gitignore` file, ensuring it's on a new line if the file is not empty and doesn't already contain it.

3.  **Task 6.3: Backend Configuration**
    *   Create/Update the file `backend/src/main/resources/application.yaml`.
    *   Add the following content (or merge if the file exists):
        ```yaml
        spring:
          security:
            # NOTE: Security is currently disabled. It will be enabled in Step 08.
            enabled: false
            oauth2:
              resourceserver:
                jwt:
                  # Use environment variable ZITADEL_AUTHDEMO_ISSUER_URI, default to empty string if not set
                  issuer-uri: ${ZITADEL_AUTHDEMO_ISSUER_URI:}
        zitadel:
          # Use environment variable ZITADEL_AUTHDEMO_BACKEND_CLIENT_ID, default to empty string if not set
          client-id: ${ZITADEL_AUTHDEMO_BACKEND_CLIENT_ID:}
          # Use environment variable ZITADEL_AUTHDEMO_CLIENT_SECRET, default to empty string if not set
          client-secret: ${ZITADEL_AUTHDEMO_CLIENT_SECRET:}

        # Ensure other existing configurations (if any) are preserved.
        ```
    *   *(Self-correction: The plan mentioned a Javadoc comment, but since no Java config file is modified here, a YAML comment is added above instead for clarity).*

4.  **Task 6.4: Frontend Configuration & Gitignore**
    *   Create the file `frontend/.env.example`.
    *   Add the following content (scope `private.read` removed):
        ```dotenv
        # Zitadel OIDC settings (mirrored from root, prefixed with VITE_)
        VITE_ZITADEL_AUTHDEMO_ISSUER_URI=https://issuer.zitadel.ch/oauth/v2
        VITE_ZITADEL_AUTHDEMO_CLIENT_ID=demo-frontend
        # Standard OIDC scopes
        VITE_ZITADEL_AUTHDEMO_SCOPES=openid profile email
        ```
    *   Read the content of the `frontend/.gitignore` file.
    *   Append the line `.env` to the `frontend/.gitignore` file, ensuring it's on a new line if the file is not empty and doesn't already contain it.
    *   Update `frontend/vite.config.ts` to include the `define` block for exposing environment variables to the frontend code:
        ```typescript
        import { defineConfig } from 'vite'
        import react from '@vitejs/plugin-react'
        import path from "path"

        // https://vitejs.dev/config/
        export default defineConfig({
          plugins: [react()],
          resolve: {
            alias: {
              "@": path.resolve(__dirname, "./src"),
            },
          },
          // Add this define block
          define: {
            'import.meta.env.VITE_ZITADEL_AUTHDEMO_ISSUER_URI': JSON.stringify(process.env.ZITADEL_AUTHDEMO_ISSUER_URI || ''), // Provide default empty string
            'import.meta.env.VITE_ZITADEL_AUTHDEMO_CLIENT_ID': JSON.stringify(process.env.ZITADEL_AUTHDEMO_CLIENT_ID || ''), // Provide default empty string
            'import.meta.env.VITE_ZITADEL_AUTHDEMO_SCOPES': JSON.stringify(process.env.ZITADEL_AUTHDEMO_SCOPES || ''), // Provide default empty string
          },
          server: {
             // Existing server config if any...
             // Ensure proxy config for backend API calls remains if it exists
             proxy: {
               '/api': {
                 target: 'http://localhost:8080', // Assuming backend runs on 8080
                 changeOrigin: true,
               },
             },
          },
          // Add test configuration if not present, aligning with guidelines
          test: {
            globals: true,
            environment: 'jsdom',
            setupFiles: './src/setupTests.ts', // or appropriate setup file
            coverage: {
              provider: 'v8', // or 'istanbul'
              reporter: ['text', 'json', 'html'],
              thresholds: { // Enforce coverage as per guidelines
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
              }
            }
          }
        })
        ```
        *(Note: Added default empty strings `|| ''` to ensure build doesn't fail if env vars are not set, aligning with acceptance criteria. Also added proxy and test config placeholders for completeness based on guidelines).*
    *   Create the file `frontend/src/lib/AuthConfig.ts`.
    *   Add the following content (scope `private.read` removed):
        ```typescript
        // src/lib/AuthConfig.ts

        /**
         * Configuration settings related to OIDC authentication with Zitadel.
         * These values are sourced from environment variables exposed via Vite.
         *
         * Note: These are configuration placeholders for now and will be actively
         * used starting from Step 07.
         */
        export const AuthConfig = {
          /**
           * The OIDC issuer URI provided by Zitadel.
           * e.g., https://issuer.zitadel.ch/oauth/v2
           */
          issuerUri: import.meta.env.VITE_ZITADEL_AUTHDEMO_ISSUER_URI,

          /**
           * The client ID registered in Zitadel for the frontend application.
           * e.g., demo-frontend
           */
          clientId: import.meta.env.VITE_ZITADEL_AUTHDEMO_CLIENT_ID,

          /**
           * The OIDC scopes requested during authentication.
           * e.g., "openid profile email"
           */
          scopes: import.meta.env.VITE_ZITADEL_AUTHDEMO_SCOPES,

          /**
           * The redirect URI where Zitadel sends the user back after authentication.
           * This should match one of the registered redirect URIs in Zitadel.
           * Typically the root of the application for SPAs.
           * Placeholder - will be confirmed/used in Step 07.
           */
          // redirectUri: window.location.origin,

          /**
           * The post-logout redirect URI where Zitadel sends the user back after logout.
           * This should match one of the registered post-logout redirect URIs in Zitadel.
           * Placeholder - will be confirmed/used in Step 07.
           */
          // postLogoutRedirectUri: window.location.origin,
        };

        // Log configuration during development for easier debugging (optional)
        if (import.meta.env.DEV) {
          console.log('OIDC Auth Configuration:', AuthConfig);
        }

        ```
        *(Note: Added TSDoc comments as per coding guidelines and placeholders for redirect URIs which will be relevant later).*

5.  **Task 6.5: Documentation Updates (This Step)**
    *   Create the file `docs/auth-config.md`. Populate it with explanations for each OIDC environment variable (`ZITADEL_AUTHDEMO_ISSUER_URI`, `ZITADEL_AUTHDEMO_CLIENT_ID`, `ZITADEL_AUTHDEMO_BACKEND_CLIENT_ID`, `ZITADEL_AUTHDEMO_CLIENT_SECRET`, `ZITADEL_AUTHDEMO_SCOPES`), instructions on where to find these values in a Zitadel project, and mention which steps will utilize them (primarily 7-10). Remove references to the `private.read` scope and explain that authorization will rely on standard claims/roles. Also add a note emphasizing that `.env` files should *not* be committed.
    *   Update `README.md`: Add a new section titled "## Environment Variables" explaining the purpose of `.env.example` and instructing users to copy it to `.env` and populate it with their Zitadel details for local development involving authentication features (Steps 7+). Explicitly mention that `.env` is ignored by Git and should not be committed. Remove mention of the `private.read` scope if present in previous drafts.
    *   Update `CHANGELOG.md`: Add an entry under the relevant version/date: `### Added\n- **Step 06** – Added OIDC configuration skeleton (using standard scopes), environment variable setup, and updated gitignore for `.env` files. Updated subsequent step plans (7, 8) to remove custom scope references.`.

6.  **Task 6.6: Update Future Step Plans (Steps 7 & 8)**
    *   Read `docs/plan/07-frontend-login-logout-flow.md`.
    *   Search for and remove any references to the `private.read` scope within the scope definitions or acceptance criteria. Adjust descriptions related to requested scopes accordingly.
    *   Write the modified content back to `docs/plan/07-frontend-login-logout-flow.md`.
    *   Read `docs/plan/08-backend-private-endpoint-jwt-validation.md`.
    *   Search for and remove any references to the `private.read` scope.
    *   Update the authorization mechanism description: Instead of checking for `private.read` scope, specify that the backend should check for a specific standard claim or role assigned by Zitadel (e.g., check if the JWT contains a specific role like `AUTH_USER` as mentioned in coding guidelines, or a group membership claim). The exact claim/role to check might need confirmation based on Zitadel setup. Add a note indicating this change in authorization strategy.
    *   Write the modified content back to `docs/plan/08-backend-private-endpoint-jwt-validation.md`.

7.  **Task 6.7: Verification**
    *   Manually verify that the backend (`./mvnw spring-boot:run` in `backend/`) starts correctly both with and without a `.env` file present in the root. Check logs for potential warnings related to missing properties, ensuring they default gracefully (e.g., to empty strings).
    *   Manually verify that the frontend (`pnpm dev` in `frontend/`) starts correctly both with and without a `.env` file present in the `frontend/` directory (or root, depending on how Vite loads them - check Vite docs, usually root `.env` is loaded). Check the browser console for the `AuthConfig` log and ensure values are present or empty strings, and that `scopes` does not include `private.read`.
    *   Manually navigate the running application in guest mode and confirm that all functionality from Step 5 (health check display, error handling) remains unchanged.
    *   Verify that `git status` does not show `.env` files as modified or untracked after creating them locally.
    *   Briefly review the modified `docs/plan/07-*.md` and `docs/plan/08-*.md` files to confirm `private.read` references are removed and authorization notes are updated.