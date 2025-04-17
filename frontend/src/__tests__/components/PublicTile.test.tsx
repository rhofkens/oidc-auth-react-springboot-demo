import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PublicTile from '../../components/PublicTile';
import * as useFetchModule from '../../hooks/useFetch';

// Mock the useFetch hook
vi.mock('../../hooks/useFetch', () => ({
  __esModule: true,
  default: vi.fn()
}));

describe('PublicTile Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('displays loading spinner when data is being fetched', () => {
    // Arrange
    const mockUseFetch = vi.spyOn(useFetchModule, 'default');
    mockUseFetch.mockReturnValue({
      loading: true,
      data: null,
      error: null
    });
    
    // Act
    render(<PublicTile />);
    
    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health');
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    
    // Check for the loading spinner (div with animate-spin class)
    const loadingSpinner = document.querySelector('.animate-spin');
    expect(loadingSpinner).toBeInTheDocument();
  });

  it('displays the message when data is successfully fetched', () => {
    // Arrange
    const mockMessage = 'Service is healthy';
    const mockUseFetch = vi.spyOn(useFetchModule, 'default');
    mockUseFetch.mockReturnValue({
      loading: false,
      data: { message: mockMessage },
      error: null
    });
    
    // Act
    render(<PublicTile />);
    
    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health');
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    expect(screen.getByText(mockMessage)).toBeInTheDocument();
  });

  it('displays error message when fetch fails', () => {
    // Arrange
    const mockError = 'Failed to fetch health status';
    const mockUseFetch = vi.spyOn(useFetchModule, 'default');
    mockUseFetch.mockReturnValue({
      loading: false,
      data: null,
      error: mockError
    });
    
    // Act
    render(<PublicTile />);
    
    // Assert
    expect(mockUseFetch).toHaveBeenCalledWith('/api/v1/public/health');
    expect(screen.getByText('Public Health Status')).toBeInTheDocument();
    expect(screen.getByText(`Error: ${mockError}`)).toBeInTheDocument();
  });
});