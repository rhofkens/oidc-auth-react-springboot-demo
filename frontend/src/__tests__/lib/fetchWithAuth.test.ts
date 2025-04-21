import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchWithAuth } from '../../lib/fetchWithAuth';
// useAuth is no longer used directly by fetchWithAuth, so remove mock setup
// import { useAuth } from '../../hooks/useAuth';
// vi.mock('../../hooks/useAuth');

// Mock the global fetch function
const mockFetch = vi.fn();
const originalFetch = global.fetch;

describe('fetchWithAuth', () => {
  beforeEach(() => {
    // Assign the mock to global fetch before each test
    global.fetch = mockFetch;
    // Reset mocks before each test
    vi.clearAllMocks();
    // Default mock implementation for fetch (can be overridden in tests)
    mockFetch.mockResolvedValue(new Response(JSON.stringify({ data: 'success' }), { status: 200 }));
  });

  afterEach(() => {
    // Restore original fetch after each test
    global.fetch = originalFetch;
  });

  it('should add Authorization header when access token is provided', async () => {
    const mockAccessToken = 'test-access-token';
    // No need to mock useAuth, just pass the token directly

    // Call fetchWithAuth with the mock token
    await fetchWithAuth('/api/test', mockAccessToken);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [url, options] = mockFetch.mock.calls[0];
    expect(url).toBe('/api/test');
    expect(options?.headers).toBeInstanceOf(Headers);
    expect((options?.headers as Headers).get('Authorization')).toBe(
      `Bearer ${mockAccessToken}`,
    );
  });

  it('should not add Authorization header when access token is null or undefined', async () => {
    // No need to mock useAuth

    // Test with null token
    await fetchWithAuth('/api/test', null);
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCallArgs1 = mockFetch.mock.calls[0];
    expect(fetchCallArgs1[0]).toBe('/api/test');
    const headers1 = fetchCallArgs1[1]?.headers;
    // Check if headers exist and if Authorization is NOT set
    expect(
      !headers1 ||
        (headers1 instanceof Headers && !headers1.has('Authorization')) ||
        (!(headers1 instanceof Headers) && headers1.Authorization === undefined)
    ).toBe(true);


    // Test with undefined token
    await fetchWithAuth('/api/test', undefined);
    expect(mockFetch).toHaveBeenCalledTimes(2); // Called again
    const fetchCallArgs2 = mockFetch.mock.calls[1]; // Use index 1 for the second call
    expect(fetchCallArgs2[0]).toBe('/api/test');
    const headers2 = fetchCallArgs2[1]?.headers;
    // Check again for the second call
     expect(
      !headers2 ||
        (headers2 instanceof Headers && !headers2.has('Authorization')) ||
        (!(headers2 instanceof Headers) && headers2.Authorization === undefined)
    ).toBe(true);
  });


  it('should merge existing headers with Authorization header when token is provided', async () => {
    const mockAccessToken = 'test-access-token-merge';
    const existingHeaders = { 'X-Custom-Header': 'value' };
    // No need to mock useAuth

    // Pass token and init object with existing headers
    await fetchWithAuth('/api/test', mockAccessToken, { headers: existingHeaders });

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const [urlMerge, optionsMerge] = mockFetch.mock.calls[0];
    expect(urlMerge).toBe('/api/test');
    expect(optionsMerge?.headers).toBeInstanceOf(Headers);
    expect((optionsMerge?.headers as Headers).get('Authorization')).toBe(
      `Bearer ${mockAccessToken}`,
    );
    expect((optionsMerge?.headers as Headers).get('X-Custom-Header')).toBe(
      existingHeaders['X-Custom-Header'],
    );
  });

  it('should pass through other fetch options like method and body when token is null', async () => {
    // No need to mock useAuth

    const options: RequestInit = {
      method: 'POST',
      body: JSON.stringify({ key: 'value' }),
      headers: { 'Content-Type': 'application/json' },
    };

    // Pass null token and the options object
    await fetchWithAuth('/api/post-test', null, options);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCallArgs = mockFetch.mock.calls[0];
    expect(fetchCallArgs[0]).toBe('/api/post-test');
    const receivedOptions = fetchCallArgs[1];
    expect(receivedOptions.method).toBe('POST');
    expect(receivedOptions.body).toBe(JSON.stringify({ key: 'value' }));
    expect(receivedOptions.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(receivedOptions.headers.Authorization).toBeUndefined();
  });

  it('should handle fetch errors when token is null', async () => {
    // No need to mock useAuth
    const fetchError = new Error('Network Error');
    mockFetch.mockRejectedValue(fetchError);

    // Pass null token
    await expect(fetchWithAuth('/api/error', null)).rejects.toThrow('Network Error');
    expect(mockFetch).toHaveBeenCalledTimes(1);
    const fetchCallArgs = mockFetch.mock.calls[0];
    expect(fetchCallArgs[0]).toBe('/api/error');
    const headers = fetchCallArgs[1]?.headers as Record<string, string> | undefined;
    expect(!headers || headers.Authorization === undefined).toBe(true);
  });
});