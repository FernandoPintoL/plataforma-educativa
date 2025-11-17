/**
 * Axios Configuration for Laravel Sanctum Token-Based Authentication
 *
 * Configures axios to use Sanctum Bearer tokens for API authentication.
 * Tokens are obtained after login and stored in sessionStorage.
 *
 * For SSE and other EventSource connections, the token is passed as a query parameter
 * since EventSource doesn't support custom headers.
 */

import axios from 'axios';

let apiToken: string | null = null;

/**
 * Create a simple axios instance without interceptors for token fetching
 * This avoids circular dependency when fetching the token itself
 */
const simpleAxios = axios.create({
  baseURL: window.location.origin,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

/**
 * Get the Sanctum API token from sessionStorage or fetch it from the server
 */
async function getApiToken(): Promise<string | null> {
  // If we already have it cached, return it
  if (apiToken) {
    return apiToken;
  }

  // Try to get from sessionStorage
  const stored = sessionStorage.getItem('sanctum_token');
  if (stored) {
    apiToken = stored;
    console.debug('[Axios] API token loaded from sessionStorage');
    return stored;
  }

  // If not in sessionStorage, fetch from the server endpoint
  // This endpoint returns the token that was generated during login
  // Use simpleAxios to avoid circular dependency with interceptors
  try {
    const response = await simpleAxios.get('/api/auth/token');

    if (response.data.success && response.data.token) {
      apiToken = response.data.token;
      sessionStorage.setItem('sanctum_token', apiToken);
      console.debug('[Axios] API token fetched from server:', apiToken.substring(0, 10) + '...');
      return apiToken;
    }
  } catch (error) {
    console.debug('[Axios] Could not fetch API token from server:', error);
  }

  return null;
}

// Get CSRF token from meta tag, cookie, or request
function getCsrfToken(): string {
  // Try to get from meta tag first (most reliable)
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    const token = metaTag.getAttribute('content') || '';
    if (token) {
      console.debug('[Axios] CSRF token from meta tag:', token.substring(0, 10) + '...');
      return token;
    }
  }

  // Fallback to reading from cookie XSRF-TOKEN
  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    console.debug('[Axios] CSRF token from cookie XSRF-TOKEN:', xsrfToken.substring(0, 10) + '...');
    return xsrfToken;
  }

  // Another fallback: X-CSRF-TOKEN header might be set
  const headers = (window as any).__CSRF_TOKEN;
  if (headers) {
    console.debug('[Axios] CSRF token from window:', headers.substring(0, 10) + '...');
    return headers;
  }

  console.warn('[Axios] No CSRF token found');
  return '';
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: window.location.origin,
  withCredentials: true, // Important for cookies (session)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add Bearer token and proper headers to all requests
axiosInstance.interceptors.request.use(async (config) => {
  // Add the Sanctum Bearer token for API authentication
  const token = await getApiToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
    console.debug('[Axios] Added Bearer token to request:', config.url);
  } else {
    console.warn('[Axios] No Bearer token available for request:', config.url);
  }

  // Still include CSRF token for form submissions if needed
  const csrfToken = getCsrfToken();
  if (csrfToken) {
    config.headers['X-CSRF-TOKEN'] = csrfToken;
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  // Ensure we're sending JSON
  config.headers['Accept'] = 'application/json';

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => {
    console.debug('[Axios] Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const headers = error.config?.headers;

    if (status === 401) {
      console.error('[Axios] 401 Unauthorized:', {
        url,
        headers: {
          'X-CSRF-TOKEN': headers?.['X-CSRF-TOKEN']?.substring?.(0, 10),
          'X-XSRF-TOKEN': headers?.['X-XSRF-TOKEN']?.substring?.(0, 10),
          'Content-Type': headers?.['Content-Type'],
        },
        message: error.response?.data?.message || 'Token may have expired',
      });
    }

    if (status === 403) {
      console.error('[Axios] 403 Forbidden:', {
        url,
        message: error.response?.data?.message || 'You do not have permission',
      });
    }

    if (!status) {
      console.error('[Axios] Network Error:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Get a cookie value by name
 */
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// Export both the axios instance and the token getter
export default axiosInstance;
export { getApiToken };
