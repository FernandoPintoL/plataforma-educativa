<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PrediccionProgreso extends Model
{
    use HasFactory;

    protected $table = 'predicciones_progreso';

    protected $fillable = [
        'estudiante_id',
        'nota_proyectada',
        'velocidad_aprendizaje',
        'tendencia_progreso',
        'confianza_prediccion',
        'semanas_analizadas',
        'varianza_notas',
        'promedio_historico',
        'modelo_tipo',
        'modelo_version',
        'features_usado',
        'fecha_prediccion',
        'creado_por',
    ];

    protected $casts = [
        'fecha_prediccion' => 'datetime',
        'nota_proyectada' => 'float',
        'velocidad_aprendizaje' => 'float',
        'confianza_prediccion' => 'float',
        'varianza_notas' => 'float',
        'promedio_historico' => 'float',
        'features_usado' => 'array',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Obtener todas las predicciones de progreso de un estudiante
     */
    public static function getParaEstudiante(User $estudiante): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('estudiante_id', $estudiante->id)
            ->orderBy('fecha_prediccion', 'desc')
            ->get();
    }

    /**
     * Obtener predicción más reciente de un estudiante
     */
    public static function getUltimaParaEstudiante(User $estudiante): ?self
    {
        return static::where('estudiante_id', $estudiante->id)
            ->latest('fecha_prediccion')
            ->first();
    }

    /**
     * Obtener estudiantes con tendencia DECLINANDO
     */
    public static function getEstudiantesDeclinando(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('tendencia_progreso', 'declinando')
            ->where('confianza_prediccion', '>=', 0.7)
            ->with('estudiante')
            ->get();
    }

    /**
     * Obtener estudiantes con tendencia MEJORANDO
     */
    public static function getEstudiantesMejorando(): \Illuminate\Database\Eloquent\Collection
    {
        return static::where('tendencia_progreso', 'mejorando')
            ->where('confianza_prediccion', '>=', 0.7)
            ->with('estudiante')
            ->get();
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
            'nota_proyectada' => round($this->nota_proyectada, 2),
            'velocidad_aprendizaje' => round($this->velocidad_aprendizaje, 4),
            'tendencia_progreso' => $this->tendencia_progreso,
            'tendencia_icono' => $this->getIconoTendencia(),
            'confianza_prediccion' => round($this->confianza_prediccion, 4),
            'confianza_porcentaje' => round($this->confianza_prediccion * 100, 1) . '%',
            'semanas_analizadas' => $this->semanas_analizadas,
            'varianza_notas' => $this->varianza_notas ? round($this->varianza_notas, 4) : null,
            'promedio_historico' => $this->promedio_historico ? round($this->promedio_historico, 2) : null,
            'fecha_prediccion' => $this->fecha_prediccion->format('d/m/Y H:i'),
            'modelo_version' => $this->modelo_version,
            'interpretation' => $this->getInterpretacion(),
        ];
    }

    /**
     * Obtener icono según la tendencia
     */
    public function getIconoTendencia(): string
    {
        $iconos = [
            'mejorando' => '📈',
            'estable' => '➡️',
            'declinando' => '📉',
            'fluctuando' => '📊',
        ];

        return $iconos[$this->tendencia_progreso] ?? '❓';
    }

    /**
     * Obtener color según la tendencia
     */
    public function getColorTendencia(): string
    {
        $colores = [
            'mejorando' => 'green',
            'estable' => 'blue',
            'declinando' => 'red',
            'fluctuando' => 'yellow',
        ];

        return $colores[$this->tendencia_progreso] ?? 'gray';
    }

    /**
     * Obtener interpretación en lenguaje natural
     */
    public function getInterpretacion(): string
    {
        $confianza = $this->confianza_prediccion;
        $tendencia = $this->tendencia_progreso;
        $nota = $this->nota_proyectada;
        $velocidad = $this->velocidad_aprendizaje;

        $textos = [
            'mejorando' => "El estudiante está mejorando con velocidad de {$velocidad} puntos por semana. Proyectado a terminar con nota {$nota}/100.",
            'estable' => "El estudiante mantiene un nivel estable en sus calificaciones. Proyectado a terminar con nota {$nota}/100.",
            'declinando' => "El estudiante está declinando con velocidad de {$velocidad} puntos por semana. Proyectado a terminar con nota {$nota}/100.",
            'fluctuando' => "El desempeño del estudiante fluctúa sin patrón claro. Proyectado a terminar con nota {$nota}/100.",
        ];

        $base = $textos[$tendencia] ?? "Análisis de progreso: Proyectado a {$nota}/100.";

        if ($confianza < 0.6) {
            $base .= " (Baja confianza en predicción)";
        }

        return $base;
    }

    /**
     * Verificar si el estudiante está en riesgo por declive
     */
    public function estaEnRiesgo(): bool
    {
        return $this->tendencia_progreso === 'declinando'
            && $this->confianza_prediccion >= 0.7
            && $this->nota_proyectada < 60;
    }

    /**
     * Obtener resumen para dashboard
     */
    public static function obtenerResumen(): array
    {
        $total = static::count();
        $mejorando = static::where('tendencia_progreso', 'mejorando')->count();
        $estable = static::where('tendencia_progreso', 'estable')->count();
        $declinando = static::where('tendencia_progreso', 'declinando')->count();
        $fluctuando = static::where('tendencia_progreso', 'fluctuando')->count();

        return [
            'total' => $total,
            'mejorando' => $mejorando,
            'estable' => $estable,
            'declinando' => $declinando,
            'fluctuando' => $fluctuando,
            'porcentaje_mejorando' => $total > 0 ? round(($mejorando / $total) * 100, 1) : 0,
            'porcentaje_declinando' => $total > 0 ? round(($declinando / $total) * 100, 1) : 0,
            'en_riesgo' => static::where('tendencia_progreso', 'declinando')
                ->where('confianza_prediccion', '>=', 0.7)
                ->where('nota_proyectada', '<', 60)
                ->count(),
        ];
    }
}
