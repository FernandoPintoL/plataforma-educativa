<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

/**
 * ARQUITECTURA DEL SISTEMA DE USUARIOS
 *
 * Este sistema utiliza una tabla única 'users' para todos los tipos de usuarios.
 * El campo 'tipo_usuario' determina el rol base: 'profesor', 'estudiante', 'director', 'padre'
 *
 * Se utiliza Spatie Permissions (https://spatie.be/docs/laravel-permission) para:
 * - Gestión avanzada de roles y permisos
 * - Control de acceso granular a recursos
 * - Asignación dinámica de permisos
 *
 * Ventajas de esta arquitectura:
 * - Simplicidad en el modelo de datos
 * - Facilidad para cambiar roles de usuarios
 * - Un usuario puede tener múltiples roles simultáneamente
 * - Gestión centralizada de autenticación
 *
 * @property string $tipo_usuario Tipo base del usuario (profesor|estudiante|director|padre)
 * @property bool $activo Estado del usuario
 * @property string $name Nombre del usuario
 * @property string $apellido Apellido del usuario
 * @property string $email Email del usuario
 */
class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'usernick',
        'email',
        'password',
        'activo',
        'apellido',
        'fecha_nacimiento',
        'telefono',
        'direccion',
        'tipo_usuario',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Verificar si el usuario es un empleado
     */
    public function esEmpleado(): bool
    {
        return $this->empleado !== null;
    }

    /**
     * Verificar si el usuario es un cliente
     */
    public function esCliente(): bool
    {
        return $this->cliente !== null;
    }

    /**
     * Verificar si el empleado puede acceder al sistema
     */
    public function puedeAccederSistema(): bool
    {
        return $this->empleado?->puedeAccederSistema() ?? true; // Si no es empleado, puede acceder por defecto
    }

    /**
     * Actualizar último acceso si es empleado
     */
    public function actualizarUltimoAccesoEmpleado(): void
    {
        if ($this->esEmpleado()) {
            $this->empleado->actualizarUltimoAcceso();
        }
    }

    // ==================== MÉTODOS PARA SISTEMA EDUCATIVO ====================

    /**
     * Verificar si el usuario es un profesor
     */
    public function esProfesor(): bool
    {
        return $this->hasRole('profesor') || $this->tipo_usuario === 'profesor';
    }

    /**
     * Verificar si el usuario es un estudiante
     */
    public function esEstudiante(): bool
    {
        return $this->hasRole('estudiante') || $this->tipo_usuario === 'estudiante';
    }

    /**
     * Verificar si el usuario es un director
     */
    public function esDirector(): bool
    {
        return $this->hasRole('director') || $this->tipo_usuario === 'director';
    }

    /**
     * Verificar si el usuario es un padre
     */
    public function esPadre(): bool
    {
        return $this->hasRole('padre') || $this->tipo_usuario === 'padre';
    }

    /**
     * Obtener el nombre completo del usuario
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim($this->name.' '.($this->apellido ?? ''));
    }

    /**
     * Relación con cursos como profesor
     */
    public function cursosComoProfesor()
    {
        return $this->hasMany(Curso::class, 'profesor_id');
    }

    /**
     * Relación con cursos como estudiante
     */
    public function cursosComoEstudiante()
    {
        return $this->belongsToMany(Curso::class, 'curso_estudiante', 'estudiante_id', 'curso_id');
    }

    /**
     * Relación con trabajos entregados
     */
    public function trabajos()
    {
        return $this->hasMany(Trabajo::class, 'estudiante_id');
    }

    /**
     * Relación con perfil vocacional
     */
    public function perfilVocacional()
    {
        return $this->hasOne(PerfilVocacional::class, 'estudiante_id');
    }

    /**
     * Relación con rendimiento académico
     */
    public function rendimientoAcademico()
    {
        return $this->hasOne(RendimientoAcademico::class, 'estudiante_id');
    }

    /**
     * Relación con hijos (para padres)
     * Retorna usuarios de tipo estudiante que tienen este usuario como padre
     */
    public function hijos()
    {
        return $this->hasMany(User::class, 'padre_id')->where('tipo_usuario', 'estudiante');
    }
}
