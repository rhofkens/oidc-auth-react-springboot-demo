/**
 * ErrorBanner Component
 *
 * A fixed-position alert banner that displays error messages from the error store.
 * Uses shadcn/ui Alert component with Framer Motion animations for smooth transitions.
 *
 * @module components/ErrorBanner
 */
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { useErrorStore } from '../store/errorStore';

/**
 * Animation variants for the error banner
 */
const bannerAnimations = {
  initial: { opacity: 0, y: -50 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
};

/**
 * ErrorBanner component displays error messages in a fixed position at the top of the page
 * with smooth animations for appearing and disappearing.
 *
 * @returns {JSX.Element | null} The rendered component or null if no error is present
 */
export const ErrorBanner: React.FC = () => {
  // Use separate selectors to avoid unnecessary re-renders
  const errorMessage = useErrorStore((state) => state.errorMessage);
  const clearError = useErrorStore((state) => state.clearError);

  // Auto-dismiss error after 5 seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage, clearError]);

  return (
    <AnimatePresence>
      {errorMessage && (
        <motion.div
          className="fixed top-4 left-0 right-0 mx-auto w-full max-w-md z-50"
          initial="initial"
          animate="animate"
          exit="exit"
          variants={bannerAnimations}
          transition={{ duration: 0.3 }}
        >
          <Alert
            variant="destructive"
            className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-800 shadow-lg"
          >
            <AlertTitle className="text-red-700 dark:text-red-300 flex justify-between items-center">
              <span>Error</span>
              <button
                onClick={clearError}
                className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                aria-label="Dismiss error"
              >
                <X size={16} />
              </button>
            </AlertTitle>
            <AlertDescription className="text-red-600 dark:text-red-400">
              {errorMessage}
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ErrorBanner;
