import React from 'react';
import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { AuthProvider } from './contexts/AuthContext';
import axiosInstance from './config/axiosConfig';
import { logger } from './utils/logger';
import { wsLogger } from './utils/websocketLogger';
import './config/debugAuth';
import '../css/app.css';

// Initialize axios with CSRF tokens and credentials
// This ensures all API calls include proper authentication
console.debug('[App] Axios configured with credentials and CSRF tokens');

// Initialize logging system
logger.logSuccess('APP', 'Sistema de logging inicializado', {
  availableCommands: {
    getLogs: 'logger.getLogs()',
    export: 'logger.export()',
    download: 'logger.download()',
    printSummary: 'logger.printSummary()',
    getLogsByLevel: "logger.getLogsByLevel('ERROR')",
    getLogsByCategory: "logger.getLogsByCategory('HTTP_REQUEST')",
    clearLogs: 'logger.clear()'
  },
  wsLogger: 'Disponible también en window.wsLogger'
});

// Función global para ver logs de evaluación
(window as any).getEvaluacionLogs = () => {
  const logs = JSON.parse(localStorage.getItem('evaluacion_debug_logs') || '[]');
  console.table(logs);
  return logs;
};

(window as any).clearEvaluacionLogs = () => {
  localStorage.removeItem('evaluacion_debug_logs');
  console.log('✅ Logs de evaluación limpiados');
};

console.log('💡 TIP: Usa getEvaluacionLogs() para ver logs de evaluación o clearEvaluacionLogs() para limpiar');

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