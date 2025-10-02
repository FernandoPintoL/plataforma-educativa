<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RespuestaTest extends Model
{
    use HasFactory;

    protected $fillable = [
        'estudiante_id',
        'pregunta_test_id',
        'respuesta_seleccionada',
        'tiempo',
        'fecha_respuesta',
    ];

    protected $casts = [
        'fecha_respuesta' => 'datetime',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Relación con la pregunta del test
     */
    public function preguntaTest(): BelongsTo
    {
        return $this->belongsTo(PreguntaTest::class);
    }

    /**
     * Calcular puntuación de la respuesta
     */
    public function calcularPuntuacion(): float
    {
        return $this->preguntaTest->getPuntuacionPorRespuesta($this->respuesta_seleccionada);
    }

    /**
     * Obtener tiempo formateado
     */
    public function getTiempoFormateado(): string
    {
        if (!$this->tiempo) {
            return 'N/A';
        }
        
        $segundos = $this->tiempo;
        $minutos = floor($segundos / 60);
        $segundosRestantes = $segundos % 60;
        
        if ($minutos > 0) {
            return "{$minutos}m {$segundosRestantes}s";
        }
        
        return "{$segundosRestantes}s";
    }

    /**
     * Verificar si la respuesta es válida
     */
    public function esValida(): bool
    {
        return !empty($this->respuesta_seleccionada) && 
               $this->preguntaTest->getPuntuacionPorRespuesta($this->respuesta_seleccionada) >= 0;
    }

    /**
     * Obtener información de la respuesta
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'estudiante' => $this->estudiante->nombre_completo,
            'pregunta' => $this->preguntaTest->enunciado,
            'respuesta_seleccionada' => $this->respuesta_seleccionada,
            'puntuacion' => $this->calcularPuntuacion(),
            'tiempo' => $this->tiempo,
            'tiempo_formateado' => $this->getTiempoFormateado(),
            'fecha_respuesta' => $this->fecha_respuesta->format('d/m/Y H:i:s'),
            'es_valida' => $this->esValida(),
        ];
    }

    /**
     * Obtener respuestas de un estudiante
     */
    public static function getDeEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->with(['preguntaTest.categoriaTest'])
            ->orderBy('fecha_respuesta')
            ->get();
    }

    /**
     * Obtener respuestas de una pregunta
     */
    public static function getDePregunta(PreguntaTest $pregunta): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('pregunta_test_id', $pregunta->id)
            ->with('estudiante')
            ->orderBy('fecha_respuesta')
            ->get();
    }

    /**
     * Obtener estadísticas de respuestas
     */
    public static function obtenerEstadisticas(): array
    {
        $total = static::count();
        $validas = static::whereHas('preguntaTest', function ($query) {
            $query->whereNotNull('enunciado');
        })->count();
        
        return [
            'total' => $total,
            'validas' => $validas,
            'invalidas' => $total - $validas,
            'porcentaje_validez' => $total > 0 ? ($validas / $total) * 100 : 0,
        ];
    }
}
