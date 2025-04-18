import { useContext } from 'react';
// We need to export AuthContext and AuthContextProps from AuthProvider.tsx
import { AuthContext, type AuthContextProps } from '../context/AuthContext'; // Import from the new context file

/**
 * @hook useAuth
 * @description Custom hook to easily access the authentication context.
 * Must be used within an AuthProvider.
 * @throws {Error} If used outside of an AuthProvider.
 * @returns {AuthContextProps} The authentication context.
 */
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};