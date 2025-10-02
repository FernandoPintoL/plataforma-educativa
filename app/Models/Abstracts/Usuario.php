<?php

namespace App\Models\Abstracts;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

abstract class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, HasRoles, Notifiable;

    protected $fillable = [
        'nombre',
        'apellido',
        'email',
        'contraseña',
        'telefono',
        'direccion',
        'fecha_nacimiento',
        'tipo_usuario',
        'activo',
    ];

    protected $hidden = [
        'contraseña',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'contraseña' => 'hashed',
        'fecha_nacimiento' => 'date',
        'activo' => 'boolean',
    ];

    /**
     * Obtener el nombre completo del usuario
     */
    public function getNombreCompletoAttribute(): string
    {
        return trim($this->nombre.' '.$this->apellido);
    }

    /**
     * Iniciar sesión del usuario
     */
    abstract public function iniciarSesion(): bool;

    /**
     * Cerrar sesión del usuario
     */
    abstract public function cerrarSesion(): void;

    /**
     * Actualizar perfil del usuario
     */
    abstract public function actualizarPerfil(): void;

    /**
     * Verificar si el usuario está activo
     */
    public function estaActivo(): bool
    {
        return $this->activo;
    }

    /**
     * Verificar el tipo de usuario
     */
    public function esTipoUsuario(string $tipo): bool
    {
        return $this->tipo_usuario === $tipo;
    }
}
