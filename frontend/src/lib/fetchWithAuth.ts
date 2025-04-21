/**
 * Fetches data from a specified URL, automatically adding an Authorization header
 * with a Bearer token if the user is authenticated.
 *
 * This utility function wraps the native `fetch` API. It uses the `useAuth` hook
 * to check the user's authentication status and retrieve the access token.
 * If the user is authenticated and an access token is available, it includes
 * the token in the `Authorization` header of the request. Otherwise, it makes
 * the request without the Authorization header.
 *
 * @param input - The resource to fetch. This can be a URL object or a string containing the URL.
 * @param init - An object containing any custom settings to apply to the request (e.g., method, headers, body).
 * @returns A Promise that resolves to the Response to the request.
 */
// Remove useAuth import as it's no longer called here

/**
 * Fetches data, adding an Authorization header if an access token is provided.
 *
 * @param input The resource URL.
 * @param accessToken Optional access token. If provided, added as Bearer token.
 * @param init Optional fetch options.
 * @returns A Promise resolving to the Response.
 */
export async function fetchWithAuth(
  input: RequestInfo | URL,
  accessToken: string | null | undefined, // Accept token as argument
  init?: RequestInit,
): Promise<Response> {
  let requestInit = init;

  if (accessToken) { // Check if token was provided
    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    requestInit = {
      ...init,
      headers,
    };
  }

  return fetch(input, requestInit); // Use modified or original init
}