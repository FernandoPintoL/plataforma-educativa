<?php

namespace App\Models;

use App\Models\Abstracts\Usuario;
use Illuminate\Support\Facades\Auth;

class Profesor extends Usuario
{
    protected $fillable = [
        'departamento',
        'especialidad',
    ];

    public function iniciarSesion(): bool
    {
        if (! $this->estaActivo()) {
            return false;
        }

        return Auth::login($this);
    }

    public function cerrarSesion(): void
    {
        Auth::logout();
    }

    public function actualizarPerfil(): void
    {
        $this->save();
    }

    public function crearTarea(Curso $curso): Tarea
    {
        return Tarea::create([
            'curso_id' => $curso->id,
            'profesor_id' => $this->id,
        ]);
    }

    public function crearEvaluacion(Curso $curso): Evaluacion
    {
        return Evaluacion::create([
            'curso_id' => $curso->id,
            'profesor_id' => $this->id,
        ]);
    }

    public function calificarTrabajo(Trabajo $trabajo): void
    {
        // Implementar lógica de calificación
    }

    public function revisarAnalisisRendimiento(): Reporte
    {
        // Implementar lógica de análisis de rendimiento
        return new Reporte;
    }

    public function cursos()
    {
        return $this->hasMany(Curso::class, 'profesor_id');
    }
}
