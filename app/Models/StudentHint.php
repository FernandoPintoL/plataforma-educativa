<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentHint extends Model
{
    use HasFactory;

    protected $table = 'student_hints';

    protected $fillable = [
        'trabajo_id',
        'estudiante_id',
        'monitoring_id',
        'tipo_sugerencia',
        'contenido_sugerencia',
        'razonamiento',
        'tema_abordado',
        'contexto_problema',
        'analisis_respuesta',
        'relevancia_estimada',
        'dificultad_estimada',
        'especificidad',
        'estado',
        'fecha_presentacion',
        'fecha_uso',
        'ayudo_estudiante',
        'feedback_efectividad',
        'preguntas_guia',
        'nivel_socracion',
        'profesor_id',
        'revisado_profesor',
        'comentario_profesor',
    ];

    protected $casts = [
        'fecha_presentacion' => 'datetime',
        'fecha_uso' => 'datetime',
        'contexto_problema' => 'array',
        'analisis_respuesta' => 'array',
        'feedback_efectividad' => 'array',
        'preguntas_guia' => 'array',
    ];

    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    public function profesor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'profesor_id');
    }

    public function mostrarAlEstudiante(): void
    {
        $this->update([
            'estado' => 'mostrada',
            'fecha_presentacion' => now(),
        ]);
    }

    public function marcarComoUtilizada($efectiva = true): void
    {
        $this->update([
            'estado' => $efectiva ? 'utilizada' : 'no_efectiva',
            'fecha_uso' => now(),
            'ayudo_estudiante' => $efectiva,
        ]);
    }

    public function esSocratica(): bool
    {
        return $this->tipo_sugerencia === 'hint_socratico';
    }

    public function obtenerResumen(): array
    {
        return [
            'id' => $this->id,
            'tipo' => $this->tipo_sugerencia,
            'tema' => $this->tema_abordado,
            'relevancia' => $this->relevancia_estimada,
            'dificultad' => $this->dificultad_estimada,
            'estado' => $this->estado,
            'efectiva' => $this->ayudo_estudiante,
            'socratica' => $this->esSocratica(),
        ];
    }
}
