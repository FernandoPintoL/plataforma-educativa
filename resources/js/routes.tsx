import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import CursosIndex from './pages/Cursos/Index';
import VocacionalIndex from './pages/Vocacional/Index';

// Re-export all route helpers from routes/index
export * from './routes/index';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/cursos',
    element: <CursosIndex />,
  },
  {
    path: '/vocacional',
    element: <VocacionalIndex />,
  },
]);
