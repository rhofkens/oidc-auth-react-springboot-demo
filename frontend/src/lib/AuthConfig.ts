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