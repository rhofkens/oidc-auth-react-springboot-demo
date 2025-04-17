# Product Requirements Document (PRD)

**Project Name:** **Auth‑vs‑Guest Demo Web App**  
**Author:** ChatGPT for *roeland*  
**Last Updated:** 17 Apr 2025  
**Document Version:** 1.2

---

## 1  Purpose
Deliver a minimal web application that **visually demonstrates the difference between guest and authenticated access** to backend services. The app is meant for demos, workshops, and testing—not for production workloads.

---

## 2  Goals & Objectives

| Goal | Success Metric |
|------|---------------|
|Show the two access modes clearly| ≥ 90 % of demo participants can describe both modes after a 2‑min walkthrough|
|Authenticate via any standards‑compliant OIDC provider| Login success rate ≥ 95 % during testing|
|Return to guest mode cleanly (including hard‑refresh)| Session‑clearing defects = 0 in UAT|

---

## 3  Scope

### In scope
- Browser‑based SPA reached via single URL  
- OIDC login & logout flows  
- Two service tiles (public health check, private message) that switch content based on auth state  
- Persistence of auth session across page refreshes  

### Out of scope
- Choice of frontend / backend tech stack (captured in separate architecture doc)  
- UI theming, multi‑language, mobile app versions  

---

## 4  Personas

| Persona | Description | Motivation |
|---------|-------------|------------|
|**Guest Visitor**| Anyone opening the URL without logging in | Wants to explore quickly without signing in |
|**Authenticated User**| Same person after OIDC login | Wants to see protected data and demo secured calls |

---

## 5  User Stories & Acceptance Criteria

| ID | User Story | Acceptance Criteria (Given / When / Then) |
|----|------------|---------------------------------------------|
|US‑01|As a **Guest Visitor**, I want to see that I’m browsing as guest|**Given** I open the app URL and am not authenticated  
**When** the page loads  
**Then**  
• Header text: “Browsing as Guest”  
• “Login” button is visible  
• Service Tile A shows the public health‑check message from `/public/health`  
• Service Tile B shows “No access to private endpoint. Please login to get access.”|
|US‑02|As a **Guest Visitor**, I want to log in|**Given** I am in guest mode  
**When** I click “Login”  
**Then** the OIDC provider page opens; after valid credentials I am redirected back authenticated|
|US‑03|As an **Authenticated User**, I want the UI to reflect my identity|**Given** successful authentication  
**Then**  
• Header shows “Signed in as *Full Name*” (no email)  
• “Logout” button replaces “Login”  
• Tile A still shows public health‑check  
• Tile B now shows “Private endpoint returned personal data: *{email}*”, where *{email}* comes from `/private/info`|
|US‑04|As an **Authenticated User**, I want my session to survive a browser refresh|**Given** I am authenticated  
**When** I hit F5 / Cmd + R  
**Then** I remain authenticated and the UI stays as described in US‑03|
|US‑05|As an **Authenticated User**, I want to log out|**Given** I am authenticated  
**When** I click “Logout”  
**Then** session/token is cleared and the UI reverts to guest mode as in US‑01 (including after refresh)|
|US‑06|As any user, I want feedback if a backend call fails|**Given** either mode  
**When** a service call errors (e.g., 5xx, timeout)  
**Then** a non‑intrusive banner or inline message displays “Service unavailable—please retry”|

---

## 6  Functional Requirements

| # | Requirement |
|---|-------------|
|FR‑1|**Landing View**: Loads without blocking on authentication; defaults to guest state.|
|FR‑2|**Auth State Indicator**: Prominent header area reflecting “Guest” vs “Signed in as {full name}”.|
|FR‑3|**Login Control**: Single “Login” button triggers OIDC Authorization Code flow.|
|FR‑4|**Logout Control**: Visible only when authenticated; logs the user out from both app session and OIDC provider (front‑channel logout).|
|FR‑5|**Session Persistence**: Access/refresh tokens are stored (per architecture doc) so user remains authenticated after hard‑refresh; tokens cleared on logout.|
|FR‑6|**Service Tile A – Public**: Calls `/public/health`; displays plain‑text JSON field `message`. Must succeed in both modes.|
|FR‑7|**Service Tile B – Private**: Calls `/private/info`.  
• If guest → do not call endpoint; render “No access to private endpoint. Please login to get access.”  
• If authenticated → include access token; display “Private endpoint returned personal data: {email}”.|
|FR‑8|**State Switch**: UI updates instantly when auth state changes without full‑page reload.|
|FR‑9|**Error Handling**: Any non‑2xx response shows a user‑friendly message and logs details to console (for devs).|
|FR‑10|**Accessibility**: Controls reachable via keyboard; ARIA labels for buttons and dynamic regions.|
|FR‑11|**Analytics Hook** (optional): Expose callback/event bus so architects can wire telemetry outside this PRD.|

---

## 7  User Flow Diagram (Textual)
1. **Enter URL → Guest State → See Tiles**  
2. **Click Login → OIDC Provider**  
3. **Auth success → Redirect → Auth State → Tiles refresh**  
4. **Browser refresh → Auth State persists (if logged in)**  
5. **Click Logout → Guest State again**

---

## 8  Non‑Functional Requirements
*For this demo application, detailed non‑functional requirements (performance, security hardening, browser matrix, etc.) are not relevant and will be defined separately if the demo evolves into a production‑grade solution.*

---

## 9  Success Metrics
- Demo observers correctly answer “Which tile needs auth?” ≥ 95 %  
- Auth flow round‑trip (click to user data shown) ≤ 4 s  
- Zero regression defects across guest/auth switching during UAT (including refresh persistence)

---

## 10  Dependencies & Assumptions
- OIDC provider credentials and redirect URI are configured externally.  
- Public and private endpoints are reachable and return JSON `{ "message": "…", "email": "…" }` for the private call.  
- Architecture doc will specify token storage, routing, and build stack.

---

## 11  Open Questions
1. Need dark‑mode styling?

---

*End of PRD*

