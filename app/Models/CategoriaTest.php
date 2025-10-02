<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoriaTest extends Model
{
    use HasFactory;

    protected $table = 'categoria_tests';

    protected $fillable = [
        'test_vocacional_id',
        'nombre',
        'descripcion',
        'orden',
    ];

    /**
     * Relación con el test vocacional
     */
    public function test_vocacional(): BelongsTo
    {
        return $this->belongsTo(TestVocacional::class);
    }

    /**
     * Relación con las preguntas de la categoría
     */
    public function preguntas(): HasMany
    {
        return $this->hasMany(PreguntaTest::class);
    }

    /**
     * Calcular puntaje de la categoría
     */
    public function calcularPuntaje(array $respuestas): float
    {
        $puntajeTotal = 0;
        $preguntasRespondidas = 0;

        foreach ($respuestas as $respuesta) {
            $pregunta = $this->preguntas()->find($respuesta['pregunta_id']);
            if ($pregunta) {
                $puntajeTotal += $pregunta->getPuntuacionPorRespuesta($respuesta['respuesta']);
                $preguntasRespondidas++;
            }
        }

        if ($preguntasRespondidas == 0) {
            return 0;
        }

        return $puntajeTotal / $preguntasRespondidas;
    }

    /**
     * Obtener estadísticas de la categoría
     */
    public function obtenerEstadisticas(): array
    {
        $totalPreguntas = $this->preguntas()->count();
        $totalRespuestas = $this->preguntas()
            ->withCount('respuestas')
            ->get()
            ->sum('respuestas_count');

        return [
            'total_preguntas' => $totalPreguntas,
            'total_respuestas' => $totalRespuestas,
            'promedio_respuestas_por_pregunta' => $totalPreguntas > 0 ? $totalRespuestas / $totalPreguntas : 0,
        ];
    }

    /**
     * Obtener preguntas ordenadas
     */
    public function getPreguntasOrdenadas(): \Illuminate\Database\Eloquent\Collection
    {
        return $this->preguntas()->orderBy('orden')->get();
    }

    /**
     * Verificar si la categoría tiene preguntas
     */
    public function tienePreguntas(): bool
    {
        return $this->preguntas()->count() > 0;
    }

    /**
     * Obtener información de la categoría
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'orden' => $this->orden,
            'total_preguntas' => $this->preguntas()->count(),
            'tiene_preguntas' => $this->tienePreguntas(),
            'estadisticas' => $this->obtenerEstadisticas(),
        ];
    }
}
