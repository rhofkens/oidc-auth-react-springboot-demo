import React, {
  // createContext removed as it's no longer used here
  useState,
  useEffect,
  // useContext removed as it's no longer used here
  ReactNode,
  useCallback,
} from 'react';
import { User } from 'oidc-client-ts';
import authService from '../services/authService'; // Use the singleton instance
import { AuthContext, type AuthContextProps } from '../context/AuthContext'; // Import from new context file

// AuthContextProps interface moved to src/context/AuthContext.ts
// AuthContext definition moved to src/context/AuthContext.ts

/**
 * @interface AuthProviderProps
 * @description Props for the AuthProvider component.
 * @property {ReactNode} children - The child components to be wrapped by the provider.
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * @component AuthProvider
 * @description Provides authentication state and functions to the application using React Context.
 * Manages the user session based on the AuthService.
 *
 * @param {AuthProviderProps} props - The component props.
 * @returns {JSX.Element} The AuthContext.Provider wrapping the children.
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start loading initially

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await authService.getUser();
      // console.log('AuthProvider - User loaded:', currentUser);
      setUser(currentUser);
    } catch (error) {
      console.error('AuthProvider - Error loading user:', error);
      setUser(null); // Ensure user is null on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser(); // Load user on initial mount

    // Set up event listeners to react to changes triggered by oidc-client-ts
    const userManager = authService.getUserManager();

    const handleUserLoaded = (loadedUser: User) => {
      // console.log('AuthProvider - Event: User loaded', loadedUser);
      setUser(loadedUser);
      setIsLoading(false); // Ensure loading is false after user load event
    };

    const handleUserUnloaded = () => {
      // console.log('AuthProvider - Event: User unloaded/signed out');
      setUser(null);
       setIsLoading(false); // Ensure loading is false after user unload event
    };

     const handleSilentRenewError = (error: Error) => {
      console.error('AuthProvider - Event: Silent renew error', error);
      // Could potentially trigger full logout or show error message
      setUser(null); // Assume logout if silent renew fails critically
      setIsLoading(false);
    };

    userManager.events.addUserLoaded(handleUserLoaded);
    userManager.events.addUserUnloaded(handleUserUnloaded);
    // Also listen for signout event which might be triggered before unload
    userManager.events.addUserSignedOut(handleUserUnloaded);
    userManager.events.addSilentRenewError(handleSilentRenewError);


    // Cleanup function to remove event listeners on component unmount
    return () => {
      userManager.events.removeUserLoaded(handleUserLoaded);
      userManager.events.removeUserUnloaded(handleUserUnloaded);
      userManager.events.removeUserSignedOut(handleUserUnloaded);
      userManager.events.removeSilentRenewError(handleSilentRenewError);
    };
  }, [loadUser]); // Rerun effect if loadUser changes (though it's stable with useCallback)

  const login = useCallback(async () => {
    setIsLoading(true); // Set loading before redirect
    await authService.login();
    // No need to setIsLoading(false) here as the page will redirect
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true); // Set loading before redirect
    await authService.logout();
     // User will be set to null via event listener 'handleUserUnloaded'
    // No need to setIsLoading(false) here as the page will redirect
  }, []);

   const renewToken = useCallback(async () => {
    setIsLoading(true);
    try {
      const renewedUser = await authService.renewToken();
      setUser(renewedUser);
      return renewedUser;
    } catch (error) {
      console.error('AuthProvider - Error renewing token:', error);
      setUser(null); // Logout user if renew fails
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);


  const contextValue: AuthContextProps = {
    isAuthenticated: !!user && !user.expired, // Ensure literal && is used
    user,
    isLoading,
    login,
    logout,
    renewToken,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// useAuth hook moved to src/hooks/useAuth.ts