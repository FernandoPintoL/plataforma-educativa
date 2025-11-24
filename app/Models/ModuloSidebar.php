<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasMany as HasManyRelation;
use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Role;

class ModuloSidebar extends Model
{
    /** @use HasFactory<\Database\Factories\ModuloSidebarFactory> */
    use HasFactory;

    protected $table = 'modulos_sidebar';

    protected $fillable = [
        'titulo',
        'ruta',
        'icono',
        'descripcion',
        'orden',
        'activo',
        'es_submenu',
        'modulo_padre_id',
        'permisos',
        'color',
        'categoria',
        'visible_dashboard',
    ];

    protected function casts(): array
    {
        return [
            'activo'            => 'boolean',
            'es_submenu'        => 'boolean',
            'visible_dashboard' => 'boolean',
            'permisos'          => 'array',
            'orden'             => 'integer',
        ];
    }

    /**
     * Obtener el módulo padre
     */
    public function padre(): BelongsTo
    {
        return $this->belongsTo(ModuloSidebar::class, 'modulo_padre_id');
    }

    /**
     * Obtener los submódulos
     */
    public function submodulos(): HasMany
    {
        return $this->hasMany(ModuloSidebar::class, 'modulo_padre_id')->orderBy('orden');
    }

    /**
     * Obtener los accesos de roles para este módulo
     * Relación con la nueva tabla role_modulo_acceso
     */
    public function rolesAcceso(): HasManyRelation
    {
        return $this->hasMany(RoleModuloAcceso::class, 'modulo_sidebar_id');
    }

    /**
     * Scope para obtener solo módulos activos
     */
    public function scopeActivos($query)
    {
        return $query->where('activo', true);
    }

    /**
     * Scope para obtener solo módulos principales (no submódulos)
     */
    public function scopePrincipales($query)
    {
        return $query->where('es_submenu', false);
    }

    /**
     * Scope para obtener submódulos
     */
    public function scopeSubmodulos($query)
    {
        return $query->where('es_submenu', true);
    }

    /**
     * Scope para ordenar por orden
     */
    public function scopeOrdenados($query)
    {
        return $query->orderBy('orden')->orderBy('titulo');
    }

    /**
     * Scope para obtener módulos por categoría
     */
    public function scopePorCategoria($query, $categoria)
    {
        return $query->where('categoria', $categoria);
    }

    /**
     * Obtener módulos para el sidebar con estructura jerárquica
     *
     * ARQUITECTURA DE 3 CAPAS:
     * Capa 3 (esta): ¿Puede VER el módulo? (role_modulo_acceso)
     * Capa 2: ¿Puede HACER la acción? (Spatie role_has_permissions)
     * Capa 1: ¿Quién eres? (Laravel Auth)
     *
     * @param \App\Models\User|null $usuario Usuario para el que se obtienen los módulos
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function obtenerParaSidebar($usuario = null)
    {
        $usuario = $usuario ?? Auth::user();

        // Obtener roles del usuario - siempre retorna Collection de Eloquent
        if (!$usuario) {
            $rolesIds = [];
        } else {
            $rolesIds = $usuario->roles()->pluck('roles.id')->toArray();
        }

        // Siempre retorna Eloquent\Collection (vacía si no hay roles)
        if (empty($rolesIds)) {
            return self::activos()
                ->principales()
                ->ordenados()
                ->get();
        }

        return self::activos()
            ->principales()
            ->ordenados()
            ->with(['submodulos' => function ($query) {
                $query->activos()->ordenados();
            }])
            ->get()
            ->filter(function ($modulo) use ($rolesIds, $usuario) {
                // Filtro Capa 3: ¿Puede VER este módulo?
                // Revisa tabla role_modulo_acceso
                return $modulo->usuarioPuedeVerModulo($rolesIds);
            })
            ->map(function ($modulo) use ($rolesIds, $usuario) {
                // Filtrar submódulos que el usuario puede ver
                $modulo->submodulos = $modulo->submodulos->filter(function ($submodulo) use ($rolesIds) {
                    return $submodulo->usuarioPuedeVerModulo($rolesIds);
                });

                return $modulo;
            });
    }

    /**
     * Verificar si el usuario puede VER este módulo
     *
     * NUEVA LÓGICA (Capa 3): Revisa tabla role_modulo_acceso
     * - Si existe entrada con visible=true → Usuario puede ver
     * - Si NO existe entrada → Usuario NO puede ver
     *
     * @param array $rolesIds Array de IDs de roles del usuario
     * @return bool
     */
    public function usuarioPuedeVerModulo(array $rolesIds): bool
    {
        if (empty($rolesIds)) {
            return false;
        }

        // Verificar si alguno de los roles del usuario tiene acceso a este módulo
        return RoleModuloAcceso::visibles()
            ->whereIn('role_id', $rolesIds)
            ->where('modulo_sidebar_id', $this->id)
            ->exists();
    }

    /**
     * Verificar si el usuario tiene permisos para este módulo (LEGACY)
     *
     * DEPRECATED: Mantener para backward compatibility
     * Esta lógica será reemplazada por usuarioPuedeVerModulo()
     *
     * @deprecated Usar usuarioPuedeVerModulo() en su lugar
     */
    public function usuarioTienePermiso($usuario = null): bool
    {
        $usuario = $usuario ?? Auth::user();

        if (!$usuario) {
            return false;
        }

        // Usar la nueva lógica basada en role_modulo_acceso
        $rolesIds = $usuario->roles()->pluck('roles.id')->toArray();
        return $this->usuarioPuedeVerModulo($rolesIds);
    }

    /**
     * Convertir a formato para frontend
     */
    public function toNavItem(): array
    {
        $navItem = [
            'title' => $this->titulo,
            'href'  => $this->ruta,
            'icon'  => $this->icono,
        ];

        if ($this->submodulos && $this->submodulos->isNotEmpty()) {
            $usuario = Auth::user();
            $children = $this->submodulos
                ->map(fn($submodulo) => $submodulo->toNavItem())
                ->values()
                ->toArray();

            if (!empty($children)) {
                $navItem['children'] = $children;
            }
        }

        return $navItem;
    }
}
