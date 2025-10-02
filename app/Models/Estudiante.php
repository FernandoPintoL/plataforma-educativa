<?php

namespace App\Models;

use App\Models\Abstracts\Usuario;
use Illuminate\Support\Facades\Auth;

class Estudiante extends Usuario
{
    protected $fillable = [
        'matricula',
        'nivel',
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

    public function realizarTarea(Tarea $tarea): Trabajo
    {
        return Trabajo::create([
            'tarea_id' => $tarea->id,
            'estudiante_id' => $this->id,
            'estado' => 'en_progreso',
        ]);
    }

    public function realizarEvaluacion(Evaluacion $evaluacion): Trabajo
    {
        return Trabajo::create([
            'evaluacion_id' => $evaluacion->id,
            'estudiante_id' => $this->id,
            'estado' => 'en_progreso',
        ]);
    }

    public function verRecomendaciones(): array
    {
        return MaterialApoyo::where('estudiante_id', $this->id)->get()->toArray();
    }

    public function verCalificaciones(): array
    {
        return Calificacion::whereHas('trabajo', function ($query) {
            $query->where('estudiante_id', $this->id);
        })->get()->toArray();
    }

    public function verPerfilVocacional(): ?PerfilVocacional
    {
        return $this->perfilVocacional;
    }

    public function cursos()
    {
        return $this->belongsToMany(Curso::class, 'curso_estudiante');
    }

    public function perfilVocacional()
    {
        return $this->hasOne(PerfilVocacional::class);
    }
}
