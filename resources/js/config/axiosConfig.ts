/**
 * Axios Configuration for Laravel Sanctum Authentication
 *
 * Configures axios to automatically include CSRF tokens and
 * handle authentication with Laravel Sanctum
 */

import axios from 'axios';

// Get CSRF token from meta tag or cookie
function getCsrfToken(): string {
  // Try to get from meta tag first
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  if (metaTag) {
    return metaTag.getAttribute('content') || '';
  }

  // Fallback to reading from cookie
  const name = 'XSRF-TOKEN';
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || '';
  }

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

// Add CSRF token to all requests
axiosInstance.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }

  // Add XSRF token from cookie if available
  const xsrfToken = getCookie('XSRF-TOKEN');
  if (xsrfToken) {
    config.headers['X-XSRF-TOKEN'] = xsrfToken;
  }

  return config;
});

// Handle response errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Could redirect to login here if needed
      console.error('Unauthorized: Token may have expired');
    }

    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      console.error('Forbidden: You do not have permission to access this resource');
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
