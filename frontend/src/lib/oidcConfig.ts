import { UserManagerSettings, WebStorageStateStore } from 'oidc-client-ts';

/**
 * @description OIDC configuration settings for UserManager.
 * Uses environment variables for client ID, issuer URI, and scopes.
 * Configures session storage for storing OIDC state.
 */
export const getOidcConfig = (): UserManagerSettings => {
  return {
    authority: import.meta.env.VITE_ZITADEL_AUTHDEMO_ISSUER_URI,
    client_id: import.meta.env.VITE_ZITADEL_AUTHDEMO_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/callback`,
    scope: import.meta.env.VITE_ZITADEL_AUTHDEMO_SCOPES,
    response_type: 'code',
    post_logout_redirect_uri: `${window.location.origin}`,
    // Enable automatic silent token renewal
    automaticSilentRenew: true,
    // Attempt to load user info from the userinfo endpoint
    loadUserInfo: true,
    // Use session storage to store OIDC state and tokens
    userStore: new WebStorageStateStore({ store: sessionStorage }),
    // Monitor session potentially useful for reacting to logout from other tabs
    monitorSession: true,
  };
};