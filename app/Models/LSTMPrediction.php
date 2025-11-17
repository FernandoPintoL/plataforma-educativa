<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Collection;

/**
 * Modelo para Predicciones LSTM
 * PASO 5: Deep Learning - Análisis Temporal con LSTM
 *
 * Almacena predicciones temporales de desempeño académico realizadas
 * por el modelo LSTM entrenado. Incluye detección de anomalías y
 * análisis de tendencias temporales.
 */
class LSTMPrediction extends Model
{
    use HasFactory;

    protected $table = 'lstm_predictions';

    protected $fillable = [
        'estudiante_id',
        'prediccion_valor',
        'prediccion_tipo',
        'confianza',
        'secuencia_analizada',
        'lookback_periods',
        'periodos_futuro',
        'es_anomalia',
        'anomaly_score',
        'anomaly_tipo',
        'promedio_secuencia',
        'desviacion_estandar',
        'minimo_secuencia',
        'maximo_secuencia',
        'velocidad_cambio',
        'modelo_tipo',
        'modelo_version',
        'hiperparametros',
        'features_usado',
        'fecha_prediccion',
        'fecha_validacion',
        'error_validacion',
        'validado',
        'notas',
        'creado_por',
    ];

    protected $casts = [
        'fecha_prediccion' => 'datetime',
        'fecha_validacion' => 'datetime',
        'prediccion_valor' => 'float',
        'confianza' => 'float',
        'secuencia_analizada' => 'array',
        'es_anomalia' => 'boolean',
        'anomaly_score' => 'float',
        'promedio_secuencia' => 'float',
        'desviacion_estandar' => 'float',
        'minimo_secuencia' => 'float',
        'maximo_secuencia' => 'float',
        'velocidad_cambio' => 'float',
        'hiperparametros' => 'array',
        'features_usado' => 'array',
        'error_validacion' => 'float',
        'validado' => 'boolean',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Obtener todas las predicciones LSTM de un estudiante
     */
    public static function getParaEstudiante(User $estudiante): Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->orderBy('fecha_prediccion', 'desc')
            ->get();
    }

    /**
     * Obtener predicción LSTM más reciente de un estudiante
     */
    public static function getUltimaParaEstudiante(User $estudiante): ?self
    {
        return static::where('estudiante_id', $estudiante->id)
            ->latest('fecha_prediccion')
            ->first();
    }

    /**
     * Detectar anomalías en las predicciones
     *
     * @return Collection
     */
    public static function detectarAnomalias(): Collection
    {
        return static::where('es_anomalia', true)
            ->where('anomaly_score', '>=', 0.7)
            ->with('estudiante')
            ->orderBy('anomaly_score', 'desc')
            ->get();
    }

    /**
     * Obtener proyecciones por tipo
     *
     * @param string $tipo 'proyeccion' | 'anomalia' | 'tendencia'
     * @return Collection
     */
    public static function obtenerProyecciones(string $tipo = 'proyeccion'): Collection
    {
        return static::where('prediccion_tipo', $tipo)
            ->where('validado', false)
            ->with('estudiante')
            ->orderBy('confianza', 'desc')
            ->get();
    }

    /**
     * Obtener predicciones con alta confianza
     */
    public static function conAltaConfianza(float $threshold = 0.8): Collection
    {
        return static::where('confianza', '>=', $threshold)
            ->where('validado', false)
            ->with('estudiante')
            ->get();
    }

    /**
     * Obtener predicciones que detectaron anomalías
     */
    public static function conAnomalias(): Collection
    {
        return static::where('es_anomalia', true)
            ->where('anomaly_tipo', '!=', null)
            ->with('estudiante')
            ->orderBy('anomaly_score', 'desc')
            ->get();
    }

    /**
     * Validar una predicción (después de que ocurra el evento real)
     *
     * @param float $valor_real
     * @param string $notas
     */
    public function validar(float $valor_real, string $notas = ''): void
    {
        $this->error_validacion = abs($this->prediccion_valor - $valor_real);
        $this->validado = true;
        $this->fecha_validacion = now();
        $this->notas = $notas;
        $this->save();
    }

    /**
     * Calcular precisión de predicción (para predicciones validadas)
     *
     * @return float|null
     */
    public function calcularPrecision(): ?float
    {
        if (!$this->validado || $this->error_validacion === null) {
            return null;
        }

        // Precisión: qué tan cercano estuvo (0-1, donde 1 es perfecto)
        $desv_max = $this->desviacion_estandar ?? 10;
        return max(0, 1 - ($this->error_validacion / $desv_max));
    }

    /**
     * Obtener información formateada de la predicción
     */
    public function obtenerInformacion(): array
    {
        return [
            'id' => $this->id,
            'estudiante_id' => $this->estudiante_id,
            'estudiante_nombre' => $this->estudiante?->name,
            'prediccion_valor' => round($this->prediccion_valor, 2),
            'prediccion_tipo' => $this->prediccion_tipo,
            'prediccion_icono' => $this->getIconoPrediccion(),
            'confianza' => round($this->confianza, 4),
            'confianza_porcentaje' => round($this->confianza * 100, 1) . '%',
            'es_anomalia' => $this->es_anomalia,
            'anomaly_tipo' => $this->anomaly_tipo,
            'anomaly_score' => $this->anomaly_score ? round($this->anomaly_score, 4) : null,
            'promedio_secuencia' => round($this->promedio_secuencia, 2),
            'desviacion_estandar' => round($this->desviacion_estandar, 4),
            'velocidad_cambio' => round($this->velocidad_cambio, 4),
            'lookback_periods' => $this->lookback_periods,
            'periodos_futuro' => $this->periodos_futuro,
            'fecha_prediccion' => $this->fecha_prediccion->format('d/m/Y H:i'),
            'validado' => $this->validado,
            'error_validacion' => $this->error_validacion ? round($this->error_validacion, 4) : null,
            'precision' => $this->validado ? round($this->calcularPrecision() * 100, 1) . '%' : null,
            'modelo_version' => $this->modelo_version,
            'interpretation' => $this->getInterpretacion(),
        ];
    }

    /**
     * Obtener icono según el tipo de predicción
     */
    public function getIconoPrediccion(): string
    {
        $iconos = [
            'proyeccion' => '🔮',
            'anomalia' => '⚠️',
            'tendencia' => '📈',
        ];

        return $iconos[$this->prediccion_tipo] ?? '❓';
    }

    /**
     * Obtener icono de anomalía
     */
    public function getIconoAnomalia(): string
    {
        if (!$this->es_anomalia) {
            return '✓';
        }

        $iconos = [
            'cambio_tendencia' => '🔄',
            'valor_extremo' => '🚨',
            'desviacion_alta' => '📊',
        ];

        return $iconos[$this->anomaly_tipo] ?? '⚠️';
    }

    /**
     * Obtener interpretación en lenguaje natural
     */
    public function getInterpretacion(): string
    {
        $valor = round($this->prediccion_valor, 2);
        $confianza = round($this->confianza * 100, 1);
        $velocidad = round($this->velocidad_cambio, 4);

        $base = "Predicción LSTM: calificación esperada de {$valor}/100 con {$confianza}% de confianza.";

        // Agregar información de anomalía
        if ($this->es_anomalia) {
            switch ($this->anomaly_tipo) {
                case 'cambio_tendencia':
                    $base .= " Se detectó un cambio significativo en la tendencia del estudiante.";
                    break;
                case 'valor_extremo':
                    $base .= " Se detectó una calificación extrema que rompe el patrón esperado.";
                    break;
                case 'desviacion_alta':
                    $base .= " Se detectó una alta desviación respecto al patrón histórico.";
                    break;
            }
        }

        // Agregar velocidad de cambio
        if ($velocidad > 0) {
            $base .= " Tendencia: mejora de {$velocidad} puntos por período.";
        } elseif ($velocidad < 0) {
            $base .= " Tendencia: declive de " . abs($velocidad) . " puntos por período.";
        }

        if ($confianza < 60) {
            $base .= " ⚠️ Baja confianza en la predicción.";
        }

        return $base;
    }

    /**
     * Verificar si hay anomalía de alto riesgo
     */
    public function esRiesgoAlto(): bool
    {
        return $this->es_anomalia
            && $this->anomaly_score >= 0.8
            && $this->prediccion_tipo === 'anomalia';
    }

    /**
     * Obtener resumen estadístico de predicciones LSTM
     */
    public static function obtenerResumen(): array
    {
        $total = static::count();
        $validadas = static::where('validado', true)->count();
        $con_anomalias = static::where('es_anomalia', true)->count();
        $proyecciones = static::where('prediccion_tipo', 'proyeccion')->count();
        $alta_confianza = static::where('confianza', '>=', 0.8)->count();

        // Precisión promedio (solo predicciones validadas)
        $predicciones_validadas = static::where('validado', true)->get();
        $precision_promedio = 0;
        if ($predicciones_validadas->count() > 0) {
            $precision_total = $predicciones_validadas->sum(function ($p) {
                return $p->calcularPrecision() ?? 0;
            });
            $precision_promedio = ($precision_total / $predicciones_validadas->count()) * 100;
        }

        return [
            'total' => $total,
            'validadas' => $validadas,
            'con_anomalias' => $con_anomalias,
            'proyecciones' => $proyecciones,
            'alta_confianza' => $alta_confianza,
            'porcentaje_anomalias' => $total > 0 ? round(($con_anomalias / $total) * 100, 1) : 0,
            'porcentaje_validadas' => $total > 0 ? round(($validadas / $total) * 100, 1) : 0,
            'precision_promedio' => round($precision_promedio, 1),
        ];
    }

    /**
     * Obtener predicciones recientes (últimas 24 horas)
     */
    public static function obtenerRecientes(int $horas = 24): Collection
    {
        return static::where('fecha_prediccion', '>=', now()->subHours($horas))
            ->with('estudiante')
            ->orderBy('fecha_prediccion', 'desc')
            ->get();
    }

    /**
     * Obtener predicciones de un tipo específico en rango de fechas
     */
    public static function getPorTipoYFecha(
        string $tipo,
        \DateTime $desde,
        \DateTime $hasta
    ): Collection {
        return static::where('prediccion_tipo', $tipo)
            ->whereBetween('fecha_prediccion', [$desde, $hasta])
            ->with('estudiante')
            ->orderBy('fecha_prediccion', 'desc')
            ->get();
    }
}
