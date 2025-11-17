import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { AuthProvider } from './contexts/AuthContext';
import axiosInstance from './config/axiosConfig';
import '../css/app.css';

// Initialize axios with CSRF tokens and credentials
// This ensures all API calls include proper authentication
console.debug('[App] Axios configured with credentials and CSRF tokens');

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
  title: (title) => `${title} - ${appName}`,
  resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
  setup({ el, App, props }) {
    const root = createRoot(el);
    
    root.render(
      <AuthProvider initialUser={props.initialPage?.props?.auth?.user}>
        <App {...props} />
      </AuthProvider>
    );
  },
  progress: {
    color: '#4B5563',
  },
});