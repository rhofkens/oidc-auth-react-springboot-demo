# OIDC Environment Variable Configuration

This document explains the environment variables used for OpenID Connect (OIDC) authentication with Zitadel in this demo application. These variables are defined in `.env.example` files at the project root and within the `frontend/` directory.

## Variable Details

### `ZITADEL_AUTHDEMO_ISSUER_URI`

*   **Purpose:** Specifies the base URL of your Zitadel instance (the issuer). Spring Security and the frontend library use this to discover OIDC endpoints (authorization, token, userinfo, etc.).
*   **Example:** `https://your-instance-abcdef.zitadel.cloud`
*   **Where to find:** This is the domain of your Zitadel instance.

### `ZITADEL_AUTHDEMO_CLIENT_ID`

*   **Purpose:** The unique identifier for the **frontend** application registered in Zitadel. This is a public identifier used during the authorization code flow.
*   **Example:** `249843098048309843@oidc_auth_demo_frontend`
*   **Where to find:** In your Zitadel Console, navigate to your Project > Applications > Your Frontend App > Client ID.

### `ZITADEL_AUTHDEMO_BACKEND_CLIENT_ID`

*   **Purpose:** The unique identifier for the **backend** application (API) registered in Zitadel. Used by the backend for token introspection or validation if needed (though primarily validation will rely on the issuer's public keys).
*   **Example:** `249843098048309844@oidc_auth_demo_backend`
*   **Where to find:** In your Zitadel Console, navigate to your Project > Applications > Your Backend App (API) > Client ID.

### `ZITADEL_AUTHDEMO_CLIENT_SECRET`

*   **Purpose:** The confidential secret associated with the **backend** application (API) in Zitadel. **This is highly sensitive and must be kept secure.** It's used in backend communication flows like token exchange or introspection if configured.
*   **Example:** `A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0U`
*   **Where to find:** In your Zitadel Console, navigate to your Project > Applications > Your Backend App (API). You may need to generate a new secret if you haven't saved the original.

### `ZITADEL_AUTHDEMO_SCOPES`

*   **Purpose:** Defines the standard OIDC scopes the frontend requests during authentication. These determine the information (claims) included in the ID token and accessible via the UserInfo endpoint.
*   **Example:** `openid profile email`
*   **Note:** We are using standard OIDC scopes. Custom scopes (like a potential `private:read`) are not currently requested because Zitadel's free tier has limitations on mapping custom scopes directly to API authorizations easily without Actions. Authorization decisions for accessing protected backend resources will rely on standard claims (like roles or custom claims) configured within Zitadel and present in the access token.

## Usage in Project Steps

These environment variables will be primarily used in the following implementation steps:

*   **Step 07:** Frontend Login/Logout Flow (uses `ISSUER_URI`, `CLIENT_ID`, `SCOPES`)
*   **Step 08:** Backend Private Endpoint & JWT Validation (uses `ISSUER_URI`, potentially `BACKEND_CLIENT_ID` and `CLIENT_SECRET` depending on validation strategy)
*   **Step 09:** Protected Tile B & Auth UI State (relies on successful authentication configured in Step 7)
*   **Step 10:** Auth Session Persistence & Silent Refresh (relies on successful authentication configured in Step 7)

## Important Security Note

The `.env.example` files serve as templates. You **must** copy these files to `.env` in their respective directories (project root and `frontend/`) and populate the `.env` files with your *actual* Zitadel application details.

These `.env` files contain sensitive credentials (especially the `ZITADEL_AUTHDEMO_CLIENT_SECRET`). They are explicitly listed in the `.gitignore` file to prevent accidental commits.

**DO NOT COMMIT `.env` FILES TO THE GIT REPOSITORY.**