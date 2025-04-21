# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Step 01:** Initial repository scaffold, backend (Spring Boot) and frontend (React/Vite) skeletons, basic toolchain (Maven, pnpm, Vite, ESLint, Prettier, Spotless, Jacoco, Vitest), Husky pre-commit hooks, and GitHub Actions CI pipeline.
- **Step 02:** Added public health endpoint.
- **Step 03:** Guest UI skeleton with health fetch.
- **Step 04:** Baseline error handling added.
- **Step 05** – Implement client-side caching for public health endpoint using `sessionStorage` to display stale data when the backend is unavailable. Added a 'stale data' badge to the UI.
- **Step 06** – Added OIDC configuration skeleton (using standard scopes), environment variable setup, and updated gitignore for `.env` files. Updated subsequent step plans (7, 8) to remove custom scope references.
- **Step 07** – Implemented frontend login/logout flow using oidc-client-ts for PKCE. Added tests for Header, AuthCallback, AuthProvider, and AuthService.
- **Step 08** – Added private endpoint and JWT validation.
- **Step 09** – Protected Tile B consumes private endpoint, fetching user-specific data when authenticated.

### Fixed

- Fixed GitHub Actions CI workflow to properly set up pnpm using the official pnpm action.
- Fixed frontend test coverage command in CI workflow to use the correct `test:coverage` script.
