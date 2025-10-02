<?php
namespace App\Helpers;

use Illuminate\Support\Facades\Auth;

class PermissionHelper
{
    /**
     * Verificar si el usuario actual tiene un permiso específico
     */
    public static function can(string $permission): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->can($permission);
    }

    /**
     * Verificar si el usuario actual tiene un rol específico
     */
    public static function hasRole(string $role): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->hasRole($role);
    }

    /**
     * Verificar si el usuario actual tiene alguno de los roles especificados
     */
    public static function hasAnyRole(array $roles): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->hasAnyRole($roles);
    }

    /**
     * Verificar si el usuario actual tiene todos los roles especificados
     */
    public static function hasAllRoles(array $roles): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->hasAllRoles($roles);
    }

    /**
     * Verificar si el usuario es profesor
     */
    public static function isProfesor(): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->esProfesor();
    }

    /**
     * Verificar si el usuario es estudiante
     */
    public static function isEstudiante(): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->esEstudiante();
    }

    /**
     * Verificar si el usuario es director
     */
    public static function isDirector(): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->esDirector();
    }

    /**
     * Verificar si el usuario es padre
     */
    public static function isPadre(): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->esPadre();
    }

    /**
     * Verificar si el usuario es administrador
     */
    public static function isAdmin(): bool
    {
        if (! Auth::check()) {
            return false;
        }

        return Auth::user()->hasRole('admin');
    }

    /**
     * Obtener el tipo de usuario actual
     */
    public static function getCurrentUserType(): ?string
    {
        if (! Auth::check()) {
            return null;
        }

        return Auth::user()->tipo_usuario;
    }

    /**
     * Obtener todos los roles del usuario actual
     */
    public static function getCurrentUserRoles(): array
    {
        if (! Auth::check()) {
            return [];
        }

        return Auth::user()->getRoleNames()->toArray();
    }

    /**
     * Obtener todos los permisos del usuario actual
     */
    public static function getCurrentUserPermissions(): array
    {
        if (! Auth::check()) {
            return [];
        }

        return Auth::user()->getAllPermissions()->pluck('name')->toArray();
    }

    /**
     * Verificar si el usuario puede acceder a una ruta específica
     */
    public static function canAccessRoute(string $route): bool
    {
        if (! Auth::check()) {
            return false;
        }

        $user = Auth::user();

        // Mapeo de rutas a permisos
        $routePermissions = [
            'cursos.index'          => 'cursos.ver',
            'cursos.create'         => 'cursos.create',
            'cursos.edit'           => 'cursos.edit',
            'cursos.destroy'        => 'cursos.delete',
            'tareas.index'          => 'tareas.ver',
            'tareas.create'         => 'tareas.create',
            'tareas.edit'           => 'tareas.edit',
            'tareas.destroy'        => 'tareas.delete',
            'evaluaciones.index'    => 'evaluaciones.ver',
            'evaluaciones.create'   => 'evaluaciones.create',
            'evaluaciones.edit'     => 'evaluaciones.edit',
            'evaluaciones.destroy'  => 'evaluaciones.delete',
            'trabajos.index'        => 'trabajos.ver',
            'trabajos.entregar'     => 'trabajos.entregar',
            'calificaciones.index'  => 'calificaciones.ver',
            'calificaciones.create' => 'calificaciones.create',
            'analisis.index'        => 'analisis.ver',
            'vocacional.index'      => 'vocacional.ver_tests',
            'vocacional.tests'      => 'vocacional.tomar_tests',
            'vocacional.resultados' => 'vocacional.ver_resultados',
            'reportes.index'        => 'reportes.ver',
            'reportes.create'       => 'reportes.create',
        ];

        $permission = $routePermissions[$route] ?? null;

        if (! $permission) {
            return true; // Si no hay mapeo, permitir acceso
        }

        return $user->can($permission);
    }

    /**
     * Obtener menú de navegación basado en permisos
     */
    public static function getNavigationMenu(): array
    {
        if (! Auth::check()) {
            return [];
        }

        $user = Auth::user();
        $menu = [];

        // Dashboard - todos los usuarios
        $menu[] = [
            'name'       => 'Dashboard',
            'route'      => 'dashboard',
            'icon'       => 'home',
            'permission' => null,
        ];

        // Cursos - profesores, directores, estudiantes
        if ($user->can('cursos.ver')) {
            $menu[] = [
                'name'       => 'Cursos',
                'route'      => 'cursos.index',
                'icon'       => 'book',
                'permission' => 'cursos.ver',
            ];
        }

        // Contenido - profesores, directores
        if ($user->can('contenido.ver')) {
            $menu[] = [
                'name'       => 'Contenido',
                'route'      => 'contenido.index',
                'icon'       => 'file-text',
                'permission' => 'contenido.ver',
            ];
        }

        // Tareas - profesores, directores, estudiantes
        if ($user->can('tareas.ver')) {
            $menu[] = [
                'name'       => 'Tareas',
                'route'      => 'tareas.index',
                'icon'       => 'edit',
                'permission' => 'tareas.ver',
            ];
        }

        // Evaluaciones - profesores, directores, estudiantes
        if ($user->can('evaluaciones.ver')) {
            $menu[] = [
                'name'       => 'Evaluaciones',
                'route'      => 'evaluaciones.index',
                'icon'       => 'clipboard',
                'permission' => 'evaluaciones.ver',
            ];
        }

        // Trabajos - profesores, directores, estudiantes
        if ($user->can('trabajos.ver')) {
            $menu[] = [
                'name'       => 'Trabajos',
                'route'      => 'trabajos.index',
                'icon'       => 'folder',
                'permission' => 'trabajos.ver',
            ];
        }

        // Calificaciones - profesores, directores, estudiantes, padres
        if ($user->can('calificaciones.ver')) {
            $menu[] = [
                'name'       => 'Calificaciones',
                'route'      => 'calificaciones.index',
                'icon'       => 'award',
                'permission' => 'calificaciones.ver',
            ];
        }

        // Análisis Inteligente - profesores, directores, estudiantes
        if ($user->can('analisis.ver')) {
            $menu[] = [
                'name'       => 'Análisis Inteligente',
                'route'      => 'analisis.index',
                'icon'       => 'bar-chart',
                'permission' => 'analisis.ver',
            ];
        }

        // Orientación Vocacional - todos los usuarios
        if ($user->can('vocacional.ver_tests')) {
            $menu[] = [
                'name'       => 'Orientación Vocacional',
                'route'      => 'vocacional.index',
                'icon'       => 'compass',
                'permission' => 'vocacional.ver_tests',
            ];
        }

        // Reportes - profesores, directores
        if ($user->can('reportes.ver')) {
            $menu[] = [
                'name'       => 'Reportes',
                'route'      => 'reportes.index',
                'icon'       => 'pie-chart',
                'permission' => 'reportes.ver',
            ];
        }

        // Administración - administradores, directores
        if ($user->can('admin.usuarios')) {
            $menu[] = [
                'name'       => 'Administración',
                'route'      => 'admin.index',
                'icon'       => 'settings',
                'permission' => 'admin.usuarios',
            ];
        }

        return $menu;
    }
}
