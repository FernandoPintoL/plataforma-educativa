<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * RespuestaEvaluacion - Registra cada respuesta detallada a una pregunta en una evaluación
 */
class RespuestaEvaluacion extends Model
{
    use HasFactory;

    protected $table = 'respuestas_evaluacion';

    protected $fillable = [
        'intento_evaluacion_id',
        'pregunta_id',
        'respuesta_texto',
        'respuesta_datos',
        'explicacion',
        'es_correcta',
        'puntos_obtenidos',
        'puntos_totales',
        'tiempo_respuesta',
        'numero_cambios',
        'fecha_respuesta',
        'confianza_respuesta',
        'patrones',
        'recomendacion',
        'respuesta_anomala',
    ];

    protected $casts = [
        'respuesta_datos' => 'array',
        'patrones' => 'array',
        'es_correcta' => 'boolean',
        'respuesta_anomala' => 'boolean',
        'fecha_respuesta' => 'datetime',
        'confianza_respuesta' => 'float',
        'puntos_obtenidos' => 'float',
        'puntos_totales' => 'float',
    ];

    /**
     * Relación con el intento de evaluación
     */
    public function intento(): BelongsTo
    {
        return $this->belongsTo(IntentosEvaluacion::class, 'intento_evaluacion_id');
    }

    /**
     * Relación con la pregunta
     */
    public function pregunta(): BelongsTo
    {
        return $this->belongsTo(Pregunta::class);
    }

    /**
     * Verificar si la respuesta es correcta
     */
    public function esCorrecta(): bool
    {
        return $this->es_correcta === true;
    }

    /**
     * Verificar si es anómala
     */
    public function esAnomala(): bool
    {
        return $this->respuesta_anomala === true;
    }

    /**
     * Incrementar cambios de respuesta
     */
    public function incrementarCambios(): void
    {
        $this->increment('numero_cambios');
    }

    /**
     * Registrar tiempo de respuesta
     */
    public function registrarTiempoRespuesta(int $segundos): void
    {
        $this->update([
            'tiempo_respuesta' => $segundos,
            'fecha_respuesta' => now(),
        ]);
    }

    /**
     * Obtener respuesta formateada según el tipo de pregunta
     */
    public function getRespuestaFormateada(): string
    {
        if (!$this->pregunta) {
            return $this->respuesta_texto ?? '';
        }

        $tipo = $this->pregunta->tipo;

        return match ($tipo) {
            'multiple' => $this->formatearMultiple(),
            'verdadero_falso' => $this->formatearVerdaderoFalso(),
            'respuesta_corta' => $this->respuesta_texto ?? '',
            'ensayo' => $this->respuesta_texto ?? '',
            default => $this->respuesta_texto ?? '',
        };
    }

    /**
     * Formatear respuesta múltiple
     */
    private function formatearMultiple(): string
    {
        $opciones = $this->respuesta_datos ?? [];

        if (is_array($opciones) && !empty($opciones)) {
            return implode(', ', array_map(fn($op) => (string)$op, $opciones));
        }

        return '';
    }

    /**
     * Formatear respuesta verdadero/falso
     */
    private function formatearVerdaderoFalso(): string
    {
        $respuesta = $this->respuesta_datos['respuesta'] ?? $this->respuesta_texto;
        return $respuesta === true || $respuesta === 'verdadero' ? 'Verdadero' : 'Falso';
    }

    /**
     * Calcular confianza de la respuesta (0-1)
     */
    public function calcularConfianza(): float
    {
        // Si ya tiene confianza calculada, retornarla
        if ($this->confianza_respuesta !== null) {
            return $this->confianza_respuesta;
        }

        // Calcular basado en:
        // - Tiempo de respuesta (preguntas muy rápidas o muy lentas = baja confianza)
        // - Cambios en la respuesta (muchos cambios = inseguridad)
        // - Si es correcta (correctas = mayor confianza)

        $confianza = 1.0;

        // Penalizar por cambios
        if ($this->numero_cambios > 0) {
            $confianza -= ($this->numero_cambios * 0.1);
        }

        // Penalizar si no es correcta
        if (!$this->esCorrecta()) {
            $confianza *= 0.7;
        }

        // Ajustar por tiempo atípico
        if ($this->pregunta) {
            $tiempoPromedio = $this->pregunta->tiempo_promedio_respuesta ?? 60;
            $desviacion = abs($this->tiempo_respuesta - $tiempoPromedio) / max($tiempoPromedio, 1);

            if ($desviacion > 2) {
                $confianza *= 0.8;
            }
        }

        // Asegurar que está entre 0 y 1
        return max(0, min(1, round($confianza, 2)));
    }

    /**
     * Detectar si la respuesta es anómala
     */
    public function detectarAnomalias(): bool
    {
        $esAnomala = false;

        // Anomalía: respuesta correcta pero con baja confianza
        if ($this->esCorrecta() && $this->confianza_respuesta < 0.3) {
            $esAnomala = true;
        }

        // Anomalía: respuesta incorrecta pero alta confianza
        if (!$this->esCorrecta() && $this->confianza_respuesta > 0.8) {
            $esAnomala = true;
        }

        // Anomalía: demasiados cambios en la respuesta
        if ($this->numero_cambios > 5) {
            $esAnomala = true;
        }

        // Anomalía: tiempo extremadamente bajo (posible adivinanza)
        if ($this->tiempo_respuesta < 5 && $this->pregunta && $this->pregunta->dificultad === 'alta') {
            $esAnomala = true;
        }

        // Anomalía: tiempo extremadamente alto
        if ($this->tiempo_respuesta > 600) { // 10 minutos
            $esAnomala = true;
        }

        $this->update(['respuesta_anomala' => $esAnomala]);

        return $esAnomala;
    }

    /**
     * Obtener patrones identificados
     */
    public function obtenerPatrones(): array
    {
        if ($this->patrones) {
            return $this->patrones;
        }

        $patrones = [];

        // Patrón: Respuesta rápida (posible conocimiento)
        if ($this->tiempo_respuesta < 15) {
            $patrones[] = 'respuesta_rapida';
        }

        // Patrón: Respuesta reflexiva
        if ($this->tiempo_respuesta > 120) {
            $patrones[] = 'respuesta_reflexiva';
        }

        // Patrón: Múltiples intentos (inseguridad)
        if ($this->numero_cambios >= 2) {
            $patrones[] = 'multiples_intentos';
        }

        // Patrón: Consulta de material
        if ($this->intento && $this->intento->consultas_material > 0) {
            $patrones[] = 'consultó_material';
        }

        return $patrones;
    }

    /**
     * Asignar puntos obtenidos
     */
    public function asignarPuntos(float $puntos, ?string $recomendacion = null): void
    {
        $this->update([
            'puntos_obtenidos' => min($puntos, $this->puntos_totales ?? $puntos),
            'recomendacion' => $recomendacion,
        ]);
    }

    /**
     * Validar respuesta completa
     */
    public function validarCompleta(): bool
    {
        return !is_null($this->respuesta_texto) ||
               !is_null($this->respuesta_datos) ||
               !is_null($this->explicacion);
    }

    /**
     * Obtener resumen de estadísticas
     */
    public function obtenerResumen(): array
    {
        return [
            'es_correcta' => $this->esCorrecta(),
            'puntos_obtenidos' => $this->puntos_obtenidos ?? 0,
            'puntos_totales' => $this->puntos_totales ?? 0,
            'porcentaje' => $this->puntos_totales ?
                round(($this->puntos_obtenidos / $this->puntos_totales) * 100, 2) : 0,
            'tiempo_respuesta' => $this->tiempo_respuesta,
            'numero_cambios' => $this->numero_cambios,
            'confianza' => $this->confianza_respuesta,
            'es_anomala' => $this->esAnomala(),
            'patrones' => $this->patrones ?? [],
        ];
    }
}
