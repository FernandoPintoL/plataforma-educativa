<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Middleware para verificar que el usuario tenga un rol específico
 *
 * Este middleware verifica tanto el campo 'tipo_usuario' como los roles de Spatie Permission.
 * Permite pasar múltiples roles separados por pipe (|) para validar cualquiera de ellos.
 *
 * IMPORTANTE: Los roles 'admin' y 'director' tienen acceso completo a todo el sistema,
 * independientemente de las restricciones de rol específicas.
 *
 * Uso: Route::get('/ruta', [Controller::class, 'method'])->middleware('role:profesor')
 * Uso múltiple: Route::get('/ruta', [Controller::class, 'method'])->middleware('role:profesor|estudiante')
 */
class EnsureUserHasRole
{
    /**
     * Roles con acceso completo al sistema (bypass)
     */
    protected array $superRoles = ['admin', 'director'];

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  $roles Roles permitidos separados por pipe (|)
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        // Verificar que el usuario esté autenticado
        if (!$request->user()) {
            abort(403, 'No estás autenticado.');
        }

        $user = $request->user();

        // SUPER ROLES: admin y director tienen acceso a todo sin restricciones
        foreach ($this->superRoles as $superRole) {
            if ($user->tipo_usuario === $superRole || $user->hasRole($superRole)) {
                return $next($request);
            }
        }

        // Verificar roles específicos
        $allowedRoles = explode('|', $roles);

        foreach ($allowedRoles as $role) {
            $role = trim($role);

            // Verificar por tipo_usuario
            if ($user->tipo_usuario === $role) {
                return $next($request);
            }

            // Verificar por roles de Spatie Permission
            if ($user->hasRole($role)) {
                return $next($request);
            }
        }

        // Si no tiene ninguno de los roles, denegar acceso
        abort(403, 'No tienes permiso para acceder a este recurso.');
    }
}
