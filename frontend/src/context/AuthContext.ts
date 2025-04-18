import { createContext } from 'react';
import { User } from 'oidc-client-ts';

/**
 * @interface AuthContextProps
 * @description Defines the shape of the authentication context provided to consumers.
 */
export interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  renewToken: () => Promise<User | null>;
}

// Create the context with a default undefined value to ensure it's used within a provider
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);