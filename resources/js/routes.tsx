import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import CursosIndex from './pages/Cursos/Index';
import VocacionalIndex from './pages/Vocacional/Index';

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
