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
```
