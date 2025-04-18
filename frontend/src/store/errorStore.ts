/**
 * Error Store
 *
 * A lightweight Zustand store to manage application error messages.
 * This store is used by the enhanced useFetch hook to push error messages
 * and by the ErrorBanner component to display them.
 *
 * @module store/errorStore
 */
import { create } from 'zustand';

/**
 * Interface defining the error store state and actions
 */
interface ErrorState {
  /** The current error message, or null if no error */
  errorMessage: string | null;

  /**
   * Sets the current error message
   *
   * @param message - The error message to display
   */
  setError: (message: string) => void;

  /**
   * Clears the current error message
   */
  clearError: () => void;
}

/**
 * Creates and exports the error store with Zustand
 *
 * The store provides:
 * - Current error message state
 * - Action to set an error message
 * - Action to clear the error message
 *
 * @example
 * ```tsx
 * // Setting an error
 * import { useErrorStore } from '../store/errorStore';
 *
 * const setError = useErrorStore(state => state.setError);
 * setError('Something went wrong');
 *
 * // Clearing an error
 * import { useErrorStore } from '../store/errorStore';
 *
 * const clearError = useErrorStore(state => state.clearError);
 * clearError();
 *
 * // Reading the error state
 * import { useErrorStore } from '../store/errorStore';
 *
 * const errorMessage = useErrorStore(state => state.errorMessage);
 * if (errorMessage) {
 *   // Display error
 * }
 * ```
 */
export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: null,

  setError: (message: string) => set({ errorMessage: message }),

  clearError: () => set({ errorMessage: null }),
}));

export default useErrorStore;
