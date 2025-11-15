<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Permission\Models\Role;

/**
 * RoleModuloAcceso
 *
 * Modelo que controla la visibilidad de MÓDULOS en el SIDEBAR para cada ROL.
 *
 * IMPORTANTE: Esta tabla es INDEPENDIENTE de los permisos de Spatie.
 * - Spatie (role_has_permissions): ¿QUÉ PUEDE HACER? (acciones/operaciones)
 * - RoleModuloAcceso: ¿QUÉ PUEDE VER? (módulos del menú)
 *
 * Flujo:
 * 1. User inicia sesión
 * 2. Middleware obtiene su rol
 * 3. ModuloSidebar::obtenerParaSidebar() revisa RoleModuloAcceso
 * 4. Si existe entrada (visible=true) → muestra módulo en sidebar
 * 5. Si NO existe entrada → oculta módulo del menú
 * 6. En rutas: Spatie verifica permisos (segunda capa de seguridad)
 *
 * Ejemplo de datos:
 * - Role: director, Modulo: "Gestionar Estudiantes", Visible: true
 * - Role: estudiante, Modulo: "Gestionar Estudiantes", (NO EXISTE)
 * - Role: estudiante, Modulo: "Mi Perfil", Visible: true
 */
class RoleModuloAcceso extends Model
{
    protected $table = 'role_modulo_acceso';

    protected $fillable = [
        'role_id',
        'modulo_sidebar_id',
        'visible',
        'descripcion',
    ];

    protected $casts = [
        'visible' => 'boolean',
    ];

    // ==================== RELACIONES ====================

    /**
     * Obtener el rol asociado (Spatie)
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Obtener el módulo del sidebar
     */
    public function modulo(): BelongsTo
    {
        return $this->belongsTo(ModuloSidebar::class, 'modulo_sidebar_id');
    }

    // ==================== SCOPES ====================

    /**
     * Solo módulos visibles
     */
    public function scopeVisibles($query)
    {
        return $query->where('visible', true);
    }

    /**
     * Obtener accesos por rol
     */
    public function scopePorRol($query, $rolId)
    {
        return $query->where('role_id', $rolId);
    }

    /**
     * Obtener accesos por módulo
     */
    public function scopePorModulo($query, $moduloId)
    {
        return $query->where('modulo_sidebar_id', $moduloId);
    }

    // ==================== MÉTODOS ESTÁTICOS ====================

    /**
     * Verificar si un rol puede ver un módulo
     *
     * @param int $rolId ID del rol
     * @param int $moduloId ID del módulo
     * @return bool
     */
    public static function puedeVer(int $rolId, int $moduloId): bool
    {
        return self::where('role_id', $rolId)
            ->where('modulo_sidebar_id', $moduloId)
            ->where('visible', true)
            ->exists();
    }

    /**
     * Obtener módulos visibles para un rol
     *
     * @param int $rolId ID del rol
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function modulosParaRol(int $rolId)
    {
        return self::visibles()
            ->porRol($rolId)
            ->with('modulo')
            ->get()
            ->pluck('modulo');
    }

    /**
     * Obtener IDs de módulos visibles para un rol (útil para queries)
     *
     * @param int $rolId ID del rol
     * @return array
     */
    public static function idModulosParaRol(int $rolId): array
    {
        return self::visibles()
            ->porRol($rolId)
            ->pluck('modulo_sidebar_id')
            ->toArray();
    }

    /**
     * Obtener roles que pueden ver un módulo
     *
     * @param int $moduloId ID del módulo
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function rolesParaModulo(int $moduloId)
    {
        return self::visibles()
            ->porModulo($moduloId)
            ->with('role')
            ->get()
            ->pluck('role');
    }
}
