# Auth‑vs‑Guest Demo Web App

A minimal web application that visually demonstrates the difference between guest and authenticated access to backend services.

[![CI](https://github.com/[your-username]/oidc-auth-react-springboot-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/[your-username]/oidc-auth-react-springboot-demo/actions/workflows/ci.yml)

## Prerequisites

- JDK 21
- Node.js 20
- pnpm (latest version)

## Project Structure

This is a monorepo containing:

- `backend/`: Spring Boot 3.4.4 application (Java 21)
- `frontend/`: React 19 application with TypeScript, Vite, and Tailwind CSS

## Getting Started

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

The backend will start on http://localhost:8080.

### Frontend

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend development server will start on http://localhost:5173.

> **Note:** The frontend dev server includes a proxy configuration that forwards all `/api` requests to the backend server running on port 8080. Make sure the backend server is running when developing the frontend.

### Guest Mode Caching

The frontend implements a caching mechanism for the public health check endpoint in guest mode.

- The response from `/api/v1/public/health` is stored in the browser's `sessionStorage`.
- If the backend is unavailable when the page loads, the UI will display the last known status from the cache ("stale data") instead of showing an error immediately.
- During development, if you need to clear this cache to fetch fresh data, you can do so via your browser's developer tools (usually under the "Application" or "Storage" tab, look for `sessionStorage`).

## Environment Variables

This project uses environment variables for configuration, particularly for OIDC authentication details needed from Step 7 onwards. Template files are provided:

- `.env.example` (at the project root, for backend configuration)
- `frontend/.env.example` (in the frontend directory, for frontend configuration)

These files list the required variables but contain placeholder values.

**To configure your local environment:**

1.  **Copy the templates:**
    ```bash
    cp .env.example .env
    cp frontend/.env.example frontend/.env
    ```
2.  **Edit the `.env` files:** Open the newly created `.env` files (in the root directory and the `frontend/` directory) and replace the placeholder values with your actual Zitadel application details (Issuer URI, Client IDs, Client Secret). Refer to `docs/auth-config.md` for details on each variable.

**Important:** The `.env` files contain sensitive information and are listed in `.gitignore`. **Never commit `.env` files to the Git repository.**


## Running with OIDC

The frontend application uses the OpenID Connect (OIDC) Authorization Code flow with Proof Key for Code Exchange (PKCE) for user authentication. This is implemented using the `oidc-client-ts` library.

To run the application with OIDC authentication enabled, you need to configure the following environment variables in the `frontend/.env` file (refer to `frontend/.env.example` for the format):

- `VITE_ZITADEL_ISSUER_URI`: The URI of your Zitadel instance.
- `VITE_ZITADEL_CLIENT_ID`: The Client ID of your Zitadel application.
- `VITE_ZITADEL_SCOPES`: The OIDC scopes required by the application (e.g., `openid profile email`).

Additionally, ensure your Zitadel client application is configured with the following settings:

- **Application Type:** `User Agent`
- **Authentication Method:** `None` (PKCE is used)
- **Redirect URIs:** `http://localhost:5173/auth/callback`
- **Post Logout URIs:** `http://localhost:5173/`

## Testing

### Backend

Run the tests:

```bash
cd backend
./mvnw test
```

Run tests with coverage report:

```bash
cd backend
./mvnw verify
```

This will run the tests and generate a coverage report in `backend/target/site/jacoco/`. You can open `backend/target/site/jacoco/index.html` in a browser to view the detailed coverage report.

To check if coverage meets the required threshold (80%):

```bash
cd backend
./mvnw verify -Pcoverage-check
```

### Frontend

Run the tests:

```bash
cd frontend
pnpm test
```

Run tests in watch mode during development:

```bash
cd frontend
pnpm test:watch
```

Run tests with coverage report:

```bash
cd frontend
pnpm test:coverage
```

This will run the tests and generate a coverage report in `frontend/coverage/`. You can open `frontend/coverage/index.html` in a browser to view the detailed coverage report.

The coverage thresholds are configured to require at least 80% coverage for statements, branches, functions, and lines.

## Development

- The backend uses Spotless for code formatting. Run `./mvnw spotless:apply` to format the code.
- The frontend uses ESLint and Prettier for linting and formatting. Run `pnpm lint` and `pnpm format` to lint and format the code.
- Pre-commit hooks are set up to ensure code quality before commits.

## API Endpoints

### Health Check

```bash
curl -X GET http://localhost:8080/api/v1/public/health
```

Example response:
```json
{
  "message": "Service up"
}

### Testing Private Endpoint

To test the private endpoint, you need a valid JWT access token obtained from your OIDC provider (e.g., Zitadel). This token must contain the necessary claims or roles (like `AUTH_USER`) that the backend expects.

```bash
# Replace <your_jwt_token> with a valid access token
curl -H "Authorization: Bearer <your_jwt_token>" http://localhost:8080/api/v1/private/info
```

Example response (if authorized):
```json
{
  "info": "This is private information for authenticated users."
}
```

You can obtain a test token from the Zitadel console or by using an OIDC client tool after authenticating.
