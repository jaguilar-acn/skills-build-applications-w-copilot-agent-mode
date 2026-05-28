/**
 * Centralized API client utility
 * Handles dynamic API base URL with support for GitHub Codespaces and localhost fallback
 */

/**
 * Get the API base URL
 * Prioritizes GitHub Codespaces URL if VITE_CODESPACE_NAME is set
 * Falls back to localhost:8000 for local development
 * @returns {string} The API base URL (e.g., https://codespace-name-8000.app.github.dev or http://localhost:8000)
 */
export function getApiBaseUrl() {
  const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
  
  if (codespaceName && codespaceName.trim()) {
    return `https://${codespaceName}-8000.app.github.dev`;
  }
  
  // Fallback to localhost for local development
  console.warn('VITE_CODESPACE_NAME is not set. Using localhost fallback. Set VITE_CODESPACE_NAME in .env.local for GitHub Codespaces.');
  return 'http://localhost:8000';
}

/**
 * Construct a full API endpoint URL
 * @param {string} endpoint - The endpoint path (e.g., 'users', 'teams', 'activities')
 * @returns {string} The full API URL (e.g., https://codespace-name-8000.app.github.dev/api/users)
 */
export function getApiUrl(endpoint) {
  const baseUrl = getApiBaseUrl();
  return `${baseUrl}/api/${endpoint}`;
}

/**
 * Fetch data from API endpoint with error handling
 * @param {string} endpoint - The endpoint path (e.g., 'users', 'activities')
 * @param {object} options - Additional fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} The parsed JSON response
 * @throws {Error} If the fetch fails or response is not ok
 */
export async function fetchFromApi(endpoint, options = {}) {
  const url = getApiUrl(endpoint);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `API Error: ${response.status} ${response.statusText}`
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API fetch failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Make a GET request to the API
 * @param {string} endpoint - The endpoint path
 * @returns {Promise<any>} The parsed JSON response
 */
export function apiGet(endpoint) {
  return fetchFromApi(endpoint, {
    method: 'GET',
  });
}

/**
 * Make a POST request to the API
 * @param {string} endpoint - The endpoint path
 * @param {object} data - The request body data
 * @returns {Promise<any>} The parsed JSON response
 */
export function apiPost(endpoint, data) {
  return fetchFromApi(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
