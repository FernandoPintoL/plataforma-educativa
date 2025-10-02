import { useAuth } from '../contexts/AuthContext';

export const usePermissions = () => {
  const { user, hasPermission, hasRole, hasAnyRole, isProfesor, isEstudiante, isDirector, isPadre, isAdmin } = useAuth();

  const canAccess = (permission?: string, role?: string, roles?: string[]) => {
    if (!user) return false;

    if (permission && !hasPermission(permission)) return false;
    if (role && !hasRole(role)) return false;
    if (roles && !hasAnyRole(roles)) return false;

    return true;
  };

  const canManageCourses = () => {
    return canAccess('cursos.crear') || canAccess('cursos.editar');
  };

  const canManageContent = () => {
    return canAccess('contenido.crear') || canAccess('contenido.editar');
  };

  const canGrade = () => {
    return canAccess('tareas.calificar') || canAccess('evaluaciones.calificar');
  };

  const canViewReports = () => {
    return canAccess('reportes.ver');
  };

  const canManageUsers = () => {
    return canAccess('admin.usuarios');
  };

  const canTakeTests = () => {
    return canAccess('vocacional.tomar_tests');
  };

  const canViewVocationalResults = () => {
    return canAccess('vocacional.ver_resultados');
  };

  const getUserType = () => {
    if (isAdmin()) return 'admin';
    if (isDirector()) return 'director';
    if (isProfesor()) return 'profesor';
    if (isEstudiante()) return 'estudiante';
    if (isPadre()) return 'padre';
    return 'unknown';
  };

  const getMenuItems = () => {
    const items = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        permission: null,
        icon: 'home',
      },
      {
        name: 'Cursos',
        href: '/cursos',
        permission: 'cursos.ver',
        icon: 'book',
      },
      {
        name: 'Contenido',
        href: '/contenido',
        permission: 'contenido.ver',
        icon: 'document',
      },
      {
        name: 'Tareas',
        href: '/tareas',
        permission: 'tareas.ver',
        icon: 'edit',
      },
      {
        name: 'Evaluaciones',
        href: '/evaluaciones',
        permission: 'evaluaciones.ver',
        icon: 'clipboard',
      },
      {
        name: 'Trabajos',
        href: '/trabajos',
        permission: 'trabajos.ver',
        icon: 'folder',
      },
      {
        name: 'Calificaciones',
        href: '/calificaciones',
        permission: 'calificaciones.ver',
        icon: 'award',
      },
      {
        name: 'Análisis Inteligente',
        href: '/analisis',
        permission: 'analisis.ver',
        icon: 'chart',
      },
      {
        name: 'Orientación Vocacional',
        href: '/vocacional',
        permission: 'vocacional.ver_tests',
        icon: 'compass',
      },
      {
        name: 'Reportes',
        href: '/reportes',
        permission: 'reportes.ver',
        icon: 'pie-chart',
      },
      {
        name: 'Administración',
        href: '/admin',
        permission: 'admin.usuarios',
        icon: 'settings',
      },
    ];

    return items.filter(item => !item.permission || hasPermission(item.permission));
  };

  return {
    user,
    canAccess,
    canManageCourses,
    canManageContent,
    canGrade,
    canViewReports,
    canManageUsers,
    canTakeTests,
    canViewVocationalResults,
    getUserType,
    getMenuItems,
    isProfesor,
    isEstudiante,
    isDirector,
    isPadre,
    isAdmin,
  };
};
