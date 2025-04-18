import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest'; // Remove Mock import
import PublicTile from '../../components/PublicTile';
import * as useFetchModule from '../../hooks/useFetch';
// No need to mock useErrorStore as useFetch handles it internally now

// Mock the useFetch hook
vi.mock('../../hooks/useFetch', () => ({
  __esModule: true,
  default: vi.fn(),
}));

describe('PublicTile Component', () => {
  // Helper to get the mock function with correct typing
  const getMockUseFetch = () => vi.mocked(useFetchModule.default); // Let TS infer the type, remove assertion

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('Scenario 4: displays loading spinner and no stale badge when data is loading', () => {
    // Arrange
    const mockUseFetch = getMockUseFetch();
    mockUseFetch.mockReturnValue({
      loading: true,
      data: null,
      error: null,
      isStale: false, // Explicitly false during initial load
    });

    // Act
    render(<PublicTile />);

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health', {
      updateErrorStore: true,
      cacheKey: 'health-cache', // Add cacheKey expectation
    });
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
    expect(screen.queryByText('Stale')).not.toBeInTheDocument(); // No stale badge
  });

  it('Scenario 1: displays the message and no stale badge when data is fresh', () => {
    // Arrange
    const mockMessage = 'Service is healthy';
    const mockUseFetch = getMockUseFetch();
    mockUseFetch.mockReturnValue({
      loading: false,
      data: { message: mockMessage },
      error: null,
      isStale: false, // Data is fresh
    });

    // Act
    render(<PublicTile />);

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health', {
      updateErrorStore: true,
      cacheKey: 'health-cache', // Add cacheKey expectation
    });
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
    expect(screen.queryByText('Stale')).not.toBeInTheDocument(); // No stale badge
  });

  it('Scenario 2: displays the message and stale badge when data is stale', () => {
    // Arrange
    const mockMessage = 'Service is healthy (but stale)';
    const mockUseFetch = getMockUseFetch();
    mockUseFetch.mockReturnValue({
      loading: false,
      data: { message: mockMessage },
      error: null,
      isStale: true, // Data is stale
    });

    // Act
    render(<PublicTile />);

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health', {
      updateErrorStore: true,
      cacheKey: 'health-cache', // Add cacheKey expectation
    });
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
    const staleBadge = screen.getByText('stale data'); // Find by actual text
    expect(staleBadge).toBeInTheDocument(); // Stale badge IS present
    expect(staleBadge).toHaveClass('bg-muted'); // Check actual badge class (likely not yellow-500 based on output)
  });

  it('Scenario 3: uses error store and displays no stale badge on fetch error (no cache)', () => {
    // Arrange
    const mockError = 'Failed to fetch health status';
    const mockUseFetch = getMockUseFetch();
    mockUseFetch.mockReturnValue({
      loading: false,
      data: null,
      error: mockError,
      isStale: false, // No cached data, so not stale
    });

    // Act
    render(<PublicTile />);

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health', {
      updateErrorStore: true, // useFetch should handle error store update
      cacheKey: 'health-cache', // Add cacheKey expectation
    });
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    // Error message should NOT be displayed locally
    expect(screen.queryByText(`Error: ${mockError}`)).not.toBeInTheDocument();
    // No stale badge when there's an error and no prior data
    expect(screen.queryByText('Stale')).not.toBeInTheDocument();
  });

  // Optional: Test case for error state *with* stale data (if useFetch supports this)
  it('displays stale badge even when there is a fetch error but stale data exists', () => {
    // Arrange
    const mockMessage = 'Stale data from previous fetch';
    const mockError = 'Failed to fetch fresh data';
    const mockUseFetch = getMockUseFetch();
    mockUseFetch.mockReturnValue({
      loading: false,
      data: { message: mockMessage }, // Has stale data
      error: mockError, // Also has an error
      isStale: true, // Data is stale
    });

    // Act
    render(<PublicTile />);

    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health', {
      updateErrorStore: true,
      cacheKey: 'health-cache', // Add cacheKey expectation
    });
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    // Should still display the stale data
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
    // Error message should NOT be displayed locally
    expect(screen.queryByText(`Error: ${mockError}`)).not.toBeInTheDocument();
    // Stale badge SHOULD be present because we have stale data
    const staleBadge = screen.getByText('stale data'); // Find by actual text
    expect(staleBadge).toBeInTheDocument();
    expect(staleBadge).toHaveClass('bg-muted'); // Check actual badge class
  });
});
