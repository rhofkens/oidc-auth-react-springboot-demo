import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import useFetch from '../../hooks/useFetch';

// Mock the global fetch function
const mockFetch = vi.fn();
window.fetch = mockFetch as unknown as typeof fetch;

// Mock console.error to avoid polluting test output
console.error = vi.fn();

describe('useFetch Hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with loading state', () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    // Act
    const { result } = renderHook(() => useFetch<{ message: string }>('/api/test'));

    // Assert
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('should fetch data successfully', async () => {
    // Arrange
    const mockData = { message: 'Success' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    // Act
    const { result } = renderHook(() => useFetch<{ message: string }>('/api/test'));

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      signal: expect.any(AbortSignal)
    }));
  });

  it('should handle HTTP errors', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: async () => ({}),
    });

    // Act
    const { result } = renderHook(() => useFetch<{ message: string }>('/api/test'));

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('HTTP error! Status: 404');
    expect(console.error).toHaveBeenCalledWith('Fetch error:', 'HTTP error! Status: 404');
  });

  it('should handle network errors', async () => {
    // Arrange
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    // Act
    const { result } = renderHook(() => useFetch<{ message: string }>('/api/test'));

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
    expect(console.error).toHaveBeenCalledWith('Fetch error:', 'Network error');
  });

  it('should skip fetch when skip option is true', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    // Act
    const { result } = renderHook(() => 
      useFetch<{ message: string }>('/api/test', { skip: true })
    );

    // Assert
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('should pass additional options to fetch', async () => {
    // Arrange
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ message: 'Success' }),
    });

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    };

    // Act
    const { result } = renderHook(() => 
      useFetch<{ message: string }>('/api/test', options)
    );

    // Assert
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockFetch).toHaveBeenCalledWith('/api/test', expect.objectContaining({
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: expect.any(AbortSignal)
    }));
  });
});