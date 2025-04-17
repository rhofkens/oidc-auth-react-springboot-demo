# Architecture Guidelines – **oidc-auth-demo-app**

> **Purpose** – This document instructs Roo Code (AI coding agent) how to scaffold and wire the application.  _It deliberately omits day‑to‑day coding conventions, which will be specified in a separate Coding‑Guidelines document._  
> **Status:** Draft v0.2 – 17 Apr 2025

---

## 1  High‑Level Setup
* **Two independent runtimes**  
  * **Backend** – Java process (Spring Boot).  
  * **Frontend** – Node process (React/Vite).  
* HTTP traffic flows:  
  1. Browser ⇄ Frontend (static assets + XHR)  
  2. Frontend ⇄ Backend (REST over **HTTP** — no TLS in demo)  
  3. Frontend ⇄ Zitadel OIDC endpoints (HTTPS)  
  4. Backend ⇄ Zitadel OIDC endpoints (HTTPS)
* Both runtimes live in **one mono‑repo** but are deployed separately (local ports, no containerization in this phase).

---

## 2  Backend Stack (Mandatory Versions)
| Layer | Technology | Version | Notes |
|-------|------------|---------|-------|
|Language|Java|**21**|LTS release; use ZGC by default|
|Framework|Spring Boot|**3.4.4**|Generated via `spring-boot-starter-parent` 3.4.4|
|Build|Maven|3.9 or newer|`mvnw` wrapper committed|
|HTTP|Spring MVC|—|Annotation‑driven controllers|
|Security|Spring Security 6 (bundled)|—|Configured as resource‑server & client|
|Testing|JUnit 5|—|See § 6|

*Expose RESTful endpoints only.*

---

## 3  Frontend Stack (Mandatory Versions)
| Area | Technology | Version | Notes |
|------|------------|---------|-------|
|Framework|React|**19.x**|Functional components + hooks|
|Build tool|Vite|**latest stable**|ESM build|
|Styling|Tailwind CSS|**3.x**|Tailwind 4 **not** permitted|
|UI Kit|shadcn/ui|current|Import on demand|
|Language|TypeScript|latest 4.x|`tsx` components|
|Testing|Vitest|latest stable|See § 6|

---

## 4  Repository Layout
```text
/ (repo root)
├─ backend/               # Spring Boot application
│  ├─ pom.xml             # Maven build file
│  └─ src/
│     └─ main/java/...    # Java source
│     └─ test/java/...    # Unit + controller tests
├─ frontend/              # React application
│  ├─ package.json
│  ├─ vite.config.ts
│  └─ src/
│     ├─ components/
│     ├─ pages/
│     ├─ hooks/
│     └─ __tests__/       # Vitest component specs
├─ docs/                  # Project docs (incl. this file)
└─ scripts/               # Utility shell or Node scripts
```
Each sub‑project owns its own lock‑file (`pom.xml`, `package-lock.json` or `pnpm-lock.yaml`).

---

## 5  Authentication (OIDC + PKCE via Zitadel)
1. **Identity Provider** – Zitadel Cloud tenant (parameters via env vars).  
2. **Flow**  
   * **Frontend** – Authorization Code + PKCE ; handled with a lightweight React OIDC helper.  
   * **Backend** – Acts as a resource server; validates JWT access tokens.
3. **Token handling & forwarding**  
   * Frontend stores tokens in memory (and may persist to `sessionStorage` for refresh persistence).  
   * All API requests include `Authorization: Bearer {access_token}` header.  
   * Backend validates the Bearer JWT via Spring Security resource‑server filters.  
4. **Required scopes**  
   * `openid profile email`  
   * Custom scope `private.read` (example) to access `/private/info`.

---

## 6  Testing Strategy
### 6.1  Frontend (React)
* **Vitest** for unit & component tests.  
* Use `jsdom` environment.  
* Minimum coverage threshold: **80 % lines**.  
* Snapshot tests allowed for simple components; prefer explicit assertions.

### 6.2  Backend (Spring Boot)
| Level | Frameworks / Tools | Notes |
|-------|--------------------|-------|
|Unit|JUnit 5 + Mockito|Pure logic classes|
|Controller|`@WebMvcTest` + Spring Security Test|Use `@WithMockUser` + real `SecurityFilterChain`|
|  |  |Token validation mocked via `JwtDecoder` stub|

> **No E2E/system tests** for either tier at this stage.

---

## 7  Build & CI (GitHub Actions)
* **Job matrix** – `frontend-test`, `backend-test`  
* Artifacts: coverage reports uploaded as build artifacts.  
* Fail build on < 80 % test coverage.

---

## 8  Runtime Configuration
| Variable | Description | Example |
|----------|-------------|---------|
|`ZITADEL_ISSUER_URI`|OIDC issuer URI|`https://issuer.zitadel.ch/oauth/v2`|
|`ZITADEL_CLIENT_ID`|Frontend public client ID|`demo-frontend`|
|`ZITADEL_BACKEND_CLIENT_ID`|Backend confidential client ID|`demo-backend`|
|`ZITADEL_CLIENT_SECRET`|Backend client secret|`******`|
|`SPRING_PROFILES_ACTIVE`|Spring profile|`local` / `prod`|

---

## 9  Open Items for Roo Code
1. Decide precise storage strategy for refresh tokens on the frontend (sessionStorage vs silent‑refresh).  
2. Integrate local HTTPS dev proxy later if security demo is needed.

---

*End of document*

