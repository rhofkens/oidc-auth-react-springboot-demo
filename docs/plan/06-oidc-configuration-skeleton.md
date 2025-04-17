# Step 06 – OIDC Configuration Skeleton

> **Objective:** introduce configuration scaffolding for Zitadel OIDC integration while keeping application behaviour unchanged (still guest‑only). Sets the foundation for authentication implementation in later steps.

---

## Scope

### Repository‑Level
* **`.env.example`** at repo root containing placeholders:
  ```dotenv
  # Zitadel OIDC settings
  ZITADEL_ISSUER_URI=https://issuer.zitadel.ch/oauth/v2
  ZITADEL_CLIENT_ID=demo-frontend
  ZITADEL_BACKEND_CLIENT_ID=demo-backend
  ZITADEL_CLIENT_SECRET=change-me
  # Optional scopes
  ZITADEL_SCOPES=openid profile email private.read
  ```

### Backend (`/backend`)
* Create `src/main/resources/application.yaml` (or extend if exists):
  ```yaml
  spring:
    security:
      enabled: false          # keep disabled for now
      oauth2:
        resourceserver:
          jwt:
            issuer-uri: ${ZITADEL_ISSUER_URI:}
  zitadel:
    client-id: ${ZITADEL_BACKEND_CLIENT_ID:}
    client-secret: ${ZITADEL_CLIENT_SECRET:}
  ```
* Add Javadoc comment noting that `spring.security.enabled` flag will flip in Step 08.

### Frontend (`/frontend`)
* Update `vite.config.ts` to expose variables:
  ```ts
  define: {
    'import.meta.env.VITE_ZITADEL_ISSUER_URI': JSON.stringify(process.env.ZITADEL_ISSUER_URI),
    'import.meta.env.VITE_ZITADEL_CLIENT_ID': JSON.stringify(process.env.ZITADEL_CLIENT_ID),
    'import.meta.env.VITE_ZITADEL_SCOPES': JSON.stringify(process.env.ZITADEL_SCOPES),
  }
  ```
* Create `frontend/.env.example` mirroring root vars but with `VITE_` prefix.
* Add `AuthConfig.ts` exporting these env values (no runtime use yet).

### CI Adjustments
* Update GitHub Actions secrets sample documentation; no runtime secrets required before Step 07.

---

## Acceptance Criteria
1. **Local dev:** Both backend and frontend start with or without actual `.env` values (fallback defaults to empty strings).
2. **Runtime behaviour:** Guest‑mode functionality from previous steps remains unchanged.
3. **Docs:** Team members can copy `.env.example` to `.env` and fill in real Zitadel values without additional guidance.

---

## Required Documentation Updates
| File | Update |
|------|--------|
|`docs/auth-config.md`|New file explaining each OIDC env variable, where to obtain them in Zitadel, and which steps will use them.|
|`README.md`|Add section “Environment Variables” with instructions to copy `.env.example`.|
|`CHANGELOG.md`|Entry: "**Step 06** – Added OIDC configuration skeleton."|

---

When approved, Roo Code will translate this plan into implementation subtasks.

