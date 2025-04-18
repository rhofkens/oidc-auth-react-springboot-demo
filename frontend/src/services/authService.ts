import { UserManager, User, UserManagerSettings } from 'oidc-client-ts';
import { getOidcConfig } from '../lib/oidcConfig';

/**
 * @class AuthService
 * @description Manages OIDC authentication using oidc-client-ts.
 * Provides methods for login, logout, handling callbacks, and accessing user information.
 */
class AuthService {
  private userManager: UserManager;

  constructor(settings: UserManagerSettings) {
    this.userManager = new UserManager(settings);

    // Optional: Add event listeners for user load/unload, token expiration, etc.
    this.userManager.events.addUserLoaded((user) => {
      console.log('User loaded:', user);
    });

    this.userManager.events.addUserUnloaded(() => {
      console.log('User unloaded');
    });

    this.userManager.events.addAccessTokenExpired(() => {
      console.log('Token expired, trying silent renew...');
      this.userManager.signinSilent().catch((error) => {
        console.error('Silent renew failed:', error);
        // Optionally trigger a full redirect login if silent renew fails
        // this.login();
      });
    });

     this.userManager.events.addUserSignedOut(() => {
      console.log('User signed out');
      // Ensure local user state is cleared after signout completes
      this.userManager.removeUser();
    });
  }

  /**
   * @description Initiates the OIDC login redirect flow.
   * @returns {Promise<void>}
   */
  public login(): Promise<void> {
    return this.userManager.signinRedirect();
  }

  /**
   * @description Initiates the OIDC logout redirect flow.
   * @returns {Promise<void>}
   */
  public logout(): Promise<void> {
    // Optionally pass id_token_hint for RP-initiated logout if supported by IdP
    // const user = await this.getUser();
    // return this.userManager.signoutRedirect({ id_token_hint: user?.id_token });
    return this.userManager.signoutRedirect();
  }

  /**
   * @description Handles the OIDC callback after redirect from the identity provider.
   * @returns {Promise<User | null>} The authenticated user object or null.
   */
  public handleCallback(): Promise<User | null> {
    return this.userManager.signinRedirectCallback();
  }

  /**
   * @description Retrieves the current authenticated user from storage.
   * @returns {Promise<User | null>} The user object or null if not authenticated.
   */
  public getUser(): Promise<User | null> {
    return this.userManager.getUser();
  }

  /**
   * @description Attempts to silently renew the access token.
   * @returns {Promise<User | null>} The user object with refreshed tokens or null.
   */
   public renewToken(): Promise<User | null> {
    return this.userManager.signinSilent();
  }

  /**
   * @description Removes the user from storage (local logout).
   * @returns {Promise<void>}
   */
  public removeUser(): Promise<void> {
    return this.userManager.removeUser();
  }

  /**
   * @description Gets the underlying UserManager instance.
   * @returns {UserManager}
   */
  public getUserManager(): UserManager {
    return this.userManager;
  }
}

// Export the class for testing and the singleton instance for application use
const authServiceInstance = new AuthService(getOidcConfig());
export { AuthService }; // Named export for the class
export default authServiceInstance; // Default export for the singleton instance