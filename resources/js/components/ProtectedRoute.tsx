import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  role?: string;
  roles?: string[];
  fallback?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  permission,
  role,
  roles,
  fallback = (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Acceso Denegado</h2>
        <p className="text-gray-600">No tienes permisos para acceder a esta página.</p>
      </div>
    </div>
  ),
}) => {
  const { user, hasPermission, hasRole, hasAnyRole } = useAuth();

  if (!user) {
    return fallback;
  }

  // Verificar permiso específico
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Verificar rol específico
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Verificar múltiples roles
  if (roles && !hasAnyRole(roles)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
