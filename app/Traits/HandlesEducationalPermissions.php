<?php

namespace App\Traits;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

trait HandlesEducationalPermissions
{
    /**
     * Verificar si el usuario tiene un permiso específico
     */
    protected function hasPermission(string $permission): bool
    {
        return auth()->user()->can($permission);
    }

    /**
     * Verificar si el usuario tiene un rol específico
     */
    protected function hasRole(string $role): bool
    {
        return auth()->user()->hasRole($role);
    }

    /**
     * Verificar si el usuario es profesor
     */
    protected function isProfesor(): bool
    {
        return auth()->user()->esProfesor();
    }

    /**
     * Verificar si el usuario es estudiante
     */
    protected function isEstudiante(): bool
    {
        return auth()->user()->esEstudiante();
    }

    /**
     * Verificar si el usuario es director
     */
    protected function isDirector(): bool
    {
        return auth()->user()->esDirector();
    }

    /**
     * Verificar si el usuario es padre
     */
    protected function isPadre(): bool
    {
        return auth()->user()->esPadre();
    }

    /**
     * Verificar si el usuario es administrador
     */
    protected function isAdmin(): bool
    {
        return auth()->user()->hasRole('admin');
    }

    /**
     * Verificar si el usuario puede acceder a un curso específico
     */
    protected function canAccessCurso(int $cursoId): bool
    {
        $user = auth()->user();
        $curso = \App\Models\Curso::find($cursoId);

        if (!$curso) {
            return false;
        }

        // Los administradores y directores pueden acceder a todos los cursos
        if ($user->hasRole(['admin', 'director'])) {
            return true;
        }

        // Los profesores pueden acceder a sus propios cursos
        if ($user->esProfesor() && $curso->profesor_id === $user->id) {
            return true;
        }

        // Los estudiantes pueden acceder a cursos donde están inscritos
        if ($user->esEstudiante() && $curso->estudiantes()->where('estudiante_id', $user->id)->exists()) {
            return true;
        }

        // Los padres pueden acceder a cursos de sus hijos
        if ($user->esPadre()) {
            $hijosIds = $user->hijos()->pluck('id')->toArray();
            return $curso->estudiantes()->whereIn('estudiante_id', $hijosIds)->exists();
        }

        return false;
    }

    /**
     * Verificar si el usuario puede acceder a un contenido específico
     */
    protected function canAccessContenido(int $contenidoId): bool
    {
        $user = auth()->user();
        $contenido = \App\Models\Contenido::find($contenidoId);

        if (!$contenido) {
            return false;
        }

        // Verificar acceso al curso primero
        if (!$this->canAccessCurso($contenido->curso_id)) {
            return false;
        }

        // Verificar permisos específicos del contenido
        if ($user->esEstudiante() && !$contenido->estaPublicado()) {
            return false;
        }

        return true;
    }

    /**
     * Verificar si el usuario puede acceder a un trabajo específico
     */
    protected function canAccessTrabajo(int $trabajoId): bool
    {
        $user = auth()->user();
        $trabajo = \App\Models\Trabajo::find($trabajoId);

        if (!$trabajo) {
            return false;
        }

        // El propietario del trabajo siempre puede acceder
        if ($trabajo->estudiante_id === $user->id) {
            return true;
        }

        // Los profesores del curso pueden acceder
        if ($user->esProfesor() && $trabajo->contenido->curso->profesor_id === $user->id) {
            return true;
        }

        // Los directores y administradores pueden acceder
        if ($user->hasRole(['admin', 'director'])) {
            return true;
        }

        // Los padres pueden acceder a trabajos de sus hijos
        if ($user->esPadre() && $user->hijos()->where('id', $trabajo->estudiante_id)->exists()) {
            return true;
        }

        return false;
    }

    /**
     * Responder con error de permisos
     */
    protected function permissionDenied(string $message = 'No tienes permisos para realizar esta acción.'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => 'PERMISSION_DENIED'
        ], 403);
    }

    /**
     * Responder con error de rol
     */
    protected function roleDenied(string $message = 'No tienes el rol necesario para realizar esta acción.'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'error' => 'ROLE_DENIED'
        ], 403);
    }

    /**
     * Obtener datos del usuario actual con roles y permisos
     */
    protected function getCurrentUserData(): array
    {
        $user = auth()->user();
        
        return [
            'id' => $user->id,
            'name' => $user->name,
            'apellido' => $user->apellido,
            'email' => $user->email,
            'tipo_usuario' => $user->tipo_usuario,
            'roles' => $user->getRoleNames(),
            'permissions' => $user->getAllPermissions()->pluck('name'),
            'is_profesor' => $user->esProfesor(),
            'is_estudiante' => $user->esEstudiante(),
            'is_director' => $user->esDirector(),
            'is_padre' => $user->esPadre(),
            'is_admin' => $user->hasRole('admin'),
        ];
    }
}
