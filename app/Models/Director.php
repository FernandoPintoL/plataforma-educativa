<?php

namespace App\Models;

use App\Models\Abstracts\Usuario;
use Illuminate\Support\Facades\Auth;

class Director extends Usuario
{
    protected $fillable = [
        'cargo',
    ];

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

    public function verEstadisticasGlobales(): array
    {
        // Implementar lógica de estadísticas globales
        return Reporte::estadisticasGlobales();
    }

    public function gestionarCursos(): void
    {
        // Implementar lógica de gestión de cursos
    }

    public function aprobarContenido(Contenido $contenido): void
    {
        $contenido->update(['aprobado' => true]);
    }

    public function verEstadisticasVocacionales(): array
    {
        // Implementar lógica de estadísticas vocacionales
        return [];
    }
}
