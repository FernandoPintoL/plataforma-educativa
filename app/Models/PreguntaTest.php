<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PreguntaTest extends Model
{
    use HasFactory;

    protected $table = 'pregunta_tests';

    protected $fillable = [
        'categoria_test_id',
        'enunciado',
        'tipo',
        'opciones',
        'orden',
    ];

    protected $casts = [
        'opciones' => 'array',
    ];

    /**
     * Relación con la categoría del test
     */
    public function categoriaTest(): BelongsTo
    {
        return $this->belongsTo(CategoriaTest::class);
    }

    /**
     * Relación con las respuestas a la pregunta
     */
    public function respuestas(): HasMany
    {
        return $this->hasMany(RespuestaTest::class);
    }

    /**
     * Obtener puntuación por respuesta
     */
    public function getPuntuacionPorRespuesta(string $respuesta): float
    {
        switch ($this->tipo) {
            case 'opcion_multiple':
                return $this->calcularPuntuacionOpcionMultiple($respuesta);
            case 'escala_likert':
                return $this->calcularPuntuacionEscalaLikert($respuesta);
            case 'verdadero_falso':
                return $this->calcularPuntuacionVerdaderoFalso($respuesta);
            default:
                return 0;
        }
    }

    /**
     * Calcular puntuación para opción múltiple
     */
    private function calcularPuntuacionOpcionMultiple(string $respuesta): float
    {
        if (! $this->opciones) {
            return 0;
        }

        // Buscar la opción seleccionada
        foreach ($this->opciones as $opcion) {
            if ($opcion['valor'] === $respuesta) {
                return $opcion['puntuacion'] ?? 0;
            }
        }

        return 0;
    }

    /**
     * Calcular puntuación para escala Likert
     */
    private function calcularPuntuacionEscalaLikert(string $respuesta): float
    {
        $escala = [
            'totalmente_en_desacuerdo' => 1,
            'en_desacuerdo' => 2,
            'neutral' => 3,
            'de_acuerdo' => 4,
            'totalmente_de_acuerdo' => 5,
        ];

        return $escala[$respuesta] ?? 0;
    }

    /**
     * Calcular puntuación para verdadero/falso
     */
    private function calcularPuntuacionVerdaderoFalso(string $respuesta): float
    {
        return $respuesta === 'verdadero' ? 1 : 0;
    }

    /**
     * Obtener opciones formateadas
     */
    public function getOpcionesFormateadas(): array
    {
        if (! $this->opciones) {
            return [];
        }

        $opcionesFormateadas = [];

        switch ($this->tipo) {
            case 'opcion_multiple':
                foreach ($this->opciones as $index => $opcion) {
                    $opcionesFormateadas[] = [
                        'valor' => $opcion['valor'] ?? chr(65 + $index),
                        'texto' => $opcion['texto'] ?? $opcion,
                        'puntuacion' => $opcion['puntuacion'] ?? 0,
                    ];
                }
                break;

            case 'escala_likert':
                $opcionesFormateadas = [
                    ['valor' => 'totalmente_en_desacuerdo', 'texto' => 'Totalmente en desacuerdo', 'puntuacion' => 1],
                    ['valor' => 'en_desacuerdo', 'texto' => 'En desacuerdo', 'puntuacion' => 2],
                    ['valor' => 'neutral', 'texto' => 'Neutral', 'puntuacion' => 3],
                    ['valor' => 'de_acuerdo', 'texto' => 'De acuerdo', 'puntuacion' => 4],
                    ['valor' => 'totalmente_de_acuerdo', 'texto' => 'Totalmente de acuerdo', 'puntuacion' => 5],
                ];
                break;

            case 'verdadero_falso':
                $opcionesFormateadas = [
                    ['valor' => 'verdadero', 'texto' => 'Verdadero', 'puntuacion' => 1],
                    ['valor' => 'falso', 'texto' => 'Falso', 'puntuacion' => 0],
                ];
                break;
        }

        return $opcionesFormateadas;
    }

    /**
     * Obtener estadísticas de la pregunta
     */
    public function obtenerEstadisticas(): array
    {
        $totalRespuestas = $this->respuestas()->count();
        $respuestasPorOpcion = $this->respuestas()
            ->selectRaw('respuesta_seleccionada, COUNT(*) as count')
            ->groupBy('respuesta_seleccionada')
            ->pluck('count', 'respuesta_seleccionada')
            ->toArray();

        return [
            'total_respuestas' => $totalRespuestas,
            'respuestas_por_opcion' => $respuestasPorOpcion,
            'opcion_mas_seleccionada' => $this->obtenerOpcionMasSeleccionada($respuestasPorOpcion),
        ];
    }

    /**
     * Obtener opción más seleccionada
     */
    private function obtenerOpcionMasSeleccionada(array $respuestasPorOpcion): ?string
    {
        if (empty($respuestasPorOpcion)) {
            return null;
        }

        return array_search(max($respuestasPorOpcion), $respuestasPorOpcion);
    }

    /**
     * Verificar si la pregunta es válida
     */
    public function esValida(): bool
    {
        return ! empty($this->enunciado) &&
        ! empty($this->tipo) &&
        $this->tieneOpcionesValidas();
    }

    /**
     * Verificar si la pregunta tiene opciones válidas
     */
    private function tieneOpcionesValidas(): bool
    {
        switch ($this->tipo) {
            case 'opcion_multiple':
                return ! empty($this->opciones) && count($this->opciones) >= 2;
            case 'escala_likert':
            case 'verdadero_falso':
                return true; // Estas opciones se generan automáticamente
            default:
                return false;
        }
    }

    /**
     * Obtener información de la pregunta
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'enunciado' => $this->enunciado,
            'tipo' => $this->tipo,
            'opciones' => $this->getOpcionesFormateadas(),
            'orden' => $this->orden,
            'es_valida' => $this->esValida(),
            'estadisticas' => $this->obtenerEstadisticas(),
        ];
    }
}
