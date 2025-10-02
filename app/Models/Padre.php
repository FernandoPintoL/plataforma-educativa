<?php

namespace App\Models;

use App\Models\Abstracts\Usuario;
use Illuminate\Support\Facades\Auth;

class Padre extends Usuario
{
    public function hijos()
    {
        return $this->belongsToMany(Estudiante::class, 'padre_estudiante');
    }

    public function iniciarSesion(): bool
    {
        if (! $this->estaActivo()) {
            return false;
        }
        Auth::login($this);

        return Auth::check();
    }

    public function cerrarSesion(): void
    {
        Auth::logout();
    }

    public function actualizarPerfil(): void
    {
        $this->save();
    }

    public function verProgresoHijo(Estudiante $estudiante): ?Reporte
    {
        if (! $this->hijos->contains($estudiante)) {
            return null;
        }

        return Reporte::where('estudiante_id', $estudiante->id)->latest()->first();
    }

    public function comunicarseConProfesor(Profesor $profesor): void
    {
        // Implementar lógica de comunicación
    }

    public function recibirNotificaciones(): array
    {
        return Notificacion::where('padre_id', $this->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->toArray();
    }

    public function verRecomendacionesVocacionales(Estudiante $estudiante): array
    {
        if (! $this->hijos->contains($estudiante)) {
            return [];
        }

        return RecomendacionCarrera::where('estudiante_id', $estudiante->id)
            ->get()
            ->toArray();
    }
}
