# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Step 01:** Initial repository scaffold, backend (Spring Boot) and frontend (React/Vite) skeletons, basic toolchain (Maven, pnpm, Vite, ESLint, Prettier, Spotless, Jacoco, Vitest), Husky pre-commit hooks, and GitHub Actions CI pipeline.
- **Step 02:** Added public health endpoint.
- **Step 03:** Guest UI skeleton with health fetch.

### Fixed

- Fixed GitHub Actions CI workflow to properly set up pnpm using the official pnpm action.
- Fixed frontend test coverage command in CI workflow to use the correct `test:coverage` script.
