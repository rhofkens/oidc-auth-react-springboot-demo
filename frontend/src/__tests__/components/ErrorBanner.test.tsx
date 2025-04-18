/**
 * ErrorBanner component tests
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBanner from '../../components/ErrorBanner';

// Mock the entire framer-motion module
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="motion-div" {...props}>
        {children}
      </div>
    ),
  },
}));

// Mock the useErrorStore hook
const mockClearError = vi.fn();
let mockErrorMessage: string | null = null;

vi.mock('../../store/errorStore', () => ({
  useErrorStore: vi.fn((selector) =>
    selector({
      errorMessage: mockErrorMessage,
      clearError: mockClearError,
    })
  ),
}));

describe('ErrorBanner', () => {
  beforeEach(() => {
    // Reset mocks and state before each test
    mockErrorMessage = null;
    mockClearError.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not render when there is no error message', () => {
    mockErrorMessage = null;
    render(<ErrorBanner />);

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('should render the error message when one is set', () => {
    mockErrorMessage = 'Test error message';
    render(<ErrorBanner />);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('should clear the error when the close button is clicked', () => {
    mockErrorMessage = 'Test error message';
    render(<ErrorBanner />);

    // Verify the error is displayed
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Click the close button
    const closeButton = screen.getByLabelText('Dismiss error');
    closeButton.click();

    // Verify clearError was called
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });

  it('should automatically clear the error after 5 seconds', async () => {
    mockErrorMessage = 'Test error message';
    render(<ErrorBanner />);

    // Verify the error is displayed
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Fast-forward time by 5 seconds
    vi.advanceTimersByTime(5000);

    // Verify clearError was called
    expect(mockClearError).toHaveBeenCalledTimes(1);
  });
});
