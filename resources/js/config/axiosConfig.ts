/**
 * Axios Configuration for Laravel Sanctum Authentication
 *
 * Configures axios to automatically include CSRF tokens and
 * handle authentication with Laravel Sanctum
 *
 * Works with Inertia.js and Laravel Sanctum for session-based authentication
 */

import axios from 'axios';

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

// Add CSRF token and proper headers to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = getCsrfToken();

  if (token) {
    // Laravel accepts CSRF token via X-CSRF-TOKEN header
    config.headers['X-CSRF-TOKEN'] = token;
    // Some configurations also check X-XSRF-TOKEN
    config.headers['X-XSRF-TOKEN'] = token;
    console.debug('[Axios] Added CSRF tokens to request:', config.url);
  } else {
    console.warn('[Axios] No CSRF token available for request:', config.url);
  }

  // Set Referer and Origin headers for Sanctum's EnsureFrontendRequestsAreStateful
  // Sanctum checks these headers to identify requests as coming from a stateful SPA frontend
  config.headers['Referer'] = window.location.origin + '/';
  config.headers['Origin'] = window.location.origin;

  // Ensure we're sending JSON
  config.headers['Accept'] = 'application/json';

  return config;
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

export default axiosInstance;
