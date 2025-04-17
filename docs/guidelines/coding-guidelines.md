# Coding Guidelines – **oidc-auth-demo-app**

> **Purpose** – Prescribe concrete patterns, libraries, and tooling conventions for both backend and frontend so that Roo Code can auto‑generate maintainable code that aligns with the project’s architecture (see *Architecture Guidelines v0.2*).  
> **Scope** – Guidelines apply to *all* production, test, and utility code in the mono‑repo.  General software‑engineering best practices are assumed; only project‑specific rules are listed here.  
> **Status:** Draft v0.2 – 17 Apr 2025

---

## 1  Backend (Spring Boot 3.4.4 / Java 21)

### 1.1  Language & Compiler
* **Java 21** (–source & –target).  Enable **preview features** *only* when explicitly justified (e.g., Structured Concurrency).
* Treat all compiler warnings as errors (`-Werror`).

### 1.2  Project Structure & Build
* Single Maven module under `backend/`.  
* Enforce style with **spotless‑maven‑plugin** + **google‑java‑format 1.17**.  
* Dependency management inherits from `spring-boot-starter-parent:3.4.4`.

### 1.3  Lombok Usage
| Guideline | Rationale |
|-----------|-----------|
|Use **`@Value`** for immutable DTOs where Java records are *not* viable (e.g., need inheritance).|Keeps code concise; immutability by default.|
|Use **`@Builder`** on request/response models exceeding 3 fields.|Readable instantiation, esp. in tests.|
|Avoid **`@Getter/@Setter`** on entities; prefer explicit fields or migrate to Java records.|Reduces hidden mutability.|
|Never abuse Lombok for equals/hashCode; use Java records or explicit methods.|Predictable behaviour.|

### 1.4  Modern Java 21 Features
* **Records** for simple data carriers.  Combine with Jackson `@JsonProperty` as needed.  
* **Pattern matching** for `instanceof` and `switch`—encouraged for cleaner type checks.  
* **Virtual threads (Project Loom)** – Enabled via `spring.threads.virtual.enabled=true`; use for blocking I/O (e.g., JDBC) where appropriate.  Do **not** mix virtual & platform threads in the same executor.
* **Sequenced Collections** – Prefer `SequencedCollection` API over legacy ordering hacks.

### 1.5  Spring Boot Conventions
* **Component Scan** limited to `com.example.demo` root to avoid classpath pollution.  
* **Constructor Injection** only (no field injection).  
* **Validation** – Use `jakarta.validation` annotations on request DTOs; validate at controller layer.  
* **Configuration Properties** – Bind with `@ConfigurationProperties(prefix="demo")`, record classes preferred.  
* **Security** – Use Spring Resource Server with **JWT decoder** pointing at Zitadel issuer.  No opaque‑token introspection.  Custom `JwtAuthenticationConverter` maps scopes to Role `AUTH_USER`.

### 1.6  API Design (REST)
* Endpoints reside under `/api/v1/`.  
* Use plural nouns (`/public/health`, `/private/info`).  
* Return **HTTP 200** with body for success; **HTTP 4xx/5xx** with RFC 7807 "problem+json" structure for errors.

### 1.7  Exception Handling
* Controller layer only throws domain exceptions; use `@RestControllerAdvice` for translation to problem JSON.  
* Never expose internal stack traces to client.

### 1.8  Logging
* **Logback** (Spring default) with log pattern `%d{ISO8601} %-5level [%thread] %logger – %msg%n`.  
* Use `SLF4J` API; never use `System.out` or `java.util.logging`.
* Sanitize PII (e‑mail) from logs.

### 1.9  Testing
| Level | Tooling | Min Coverage | Notes |
|-------|---------|-------------|-------|
|Unit|JUnit 5 + Mockito + AssertJ|80 % lines|Focus on pure business logic.|
|Controller|`@WebMvcTest` + Spring Security Test|—|Use `@WithMockUser` + real `SecurityFilterChain`.  Mock `JwtDecoder`.|
|Integration|**None yet**|—|E2E will be added later per architecture doc.|
*Coverage enforced by **jacoco‑maven‑plugin**.

### 1.10  Concurrency & Performance
* Prefer **virtual threads** (`Thread.ofVirtual().start(...)`) for blocking tasks.  
* Use `CompletableFuture` for async composition; avoid RxJava/Reactor for simplicity.  
* Do *not* share mutable state across threads without synchronization.

### 1.11  Documentation
* **Javadoc** for all public classes, methods, and `package-info.java` files; build fails on missing or malformed Javadoc via `maven-javadoc-plugin` during `verify` phase.  
* Document REST endpoints with **Springdoc OpenAPI 3**; minimal annotation usage on controllers; spec served at `/v3/api-docs`.

---

## 2  Frontend (React 19 / Vite)

### 2.1  Language & Tooling
* **TypeScript 4.9** with `"strict": true` in `tsconfig.json`.  
* **ESLint** with `eslint-config-airbnb-typescript` + Prettier (opinionated).  
* Lint staged files via **husky + lint‑staged**.

### 2.2  Project Structure
```text
frontend/src/
├─ components/   # Reusable UI building blocks (PascalCase files)
├─ pages/        # Route‑level components
├─ hooks/        # Custom hooks prefixed with use*
├─ lib/          # One‑off utility functions (no React)
└─ __tests__/    # Vitest specs mirroring src tree
```

### 2.3  React Patterns
* **Function components only**.  
* **useState/useReducer** for local state.  
* **React Context** limited to auth user & theme.  
* Favor **TanStack Query** for data‑fetching/cache; includes TTL and refetch on focus.  
* **Suspense** allowed for lazy‑loaded pages.

### 2.4  Styling
* **Tailwind CSS 3.x** – utility classes in JSX; no external SCSS.  
* **shadcn/ui** components imported per need; override via Tailwind `@apply` not inline style.  
* Define design tokens in `tailwind.config.js` – brand colors, spacing, typography.

### 2.5  Authentication Handling
* Use `@axa-oss/react-oidc` (or similar) for **PKCE** flow.  
* Store `access_token` in React Context + `sessionStorage`.  
* Attach `Authorization: Bearer {token}` via fetch wrapper interceptor.  
* Refresh tokens handled via silent‑renew iframe (library default).  **No cookies** transmitted for tokens.

### 2.6  Testing (Vitest)
* Jest‑compatible APIs; `jsdom` env.  
* **React Testing Library** for DOM assertions.  
* Aim for **80 % line coverage** (`vite-plugin-vitest`).  
* Snapshot tests limited to presentational components without logic.

### 2.7  Documentation
* **TSDoc** style comments for public functions, custom hooks, and utilities.  
* Generate API docs with **TypeDoc** (`npm run docs`); output stored under `docs/frontend-api`.  
* Write comments that explain *why* the code exists when intent is non‑obvious; avoid redundant remarks.

---

## 3  Shared Repo Tooling
| Area | Tool | Purpose |
|------|------|---------|
|Commit hooks|husky|Enforce lint/format before commit (frontend).|
|Formatting|Prettier, google‑java‑format|Consistent style.|
|Linting|ESLint, Spotless|Fail CI on violation.|
|CI|GitHub Actions|`frontend-test` + `backend-test` jobs; coverage gating.|

---


*End of Coding Guidelines*

