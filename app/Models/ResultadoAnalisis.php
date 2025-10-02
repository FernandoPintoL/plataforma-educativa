<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ResultadoAnalisis extends Model
{
    use HasFactory;

    protected $table = 'resultados_analisis';

    protected $fillable = [
        'trabajo_id',
        'sistema_analisis_id',
        'areas_fortaleza',
        'areas_debilidad',
        'confianza_predictiva',
        'recomendaciones',
        'metadatos',
    ];

    protected $casts = [
        'areas_fortaleza' => 'array',
        'areas_debilidad' => 'array',
        'recomendaciones' => 'array',
        'metadatos' => 'array',
    ];

    /**
     * Relación con el trabajo
     */
    public function trabajo(): BelongsTo
    {
        return $this->belongsTo(Trabajo::class);
    }

    /**
     * Relación con el sistema de análisis
     */
    public function sistemaAnalisis(): BelongsTo
    {
        return $this->belongsTo(SistemaAnalisis::class);
    }

    /**
     * Relación con las recomendaciones de material
     */
    public function recomendacionesMaterial(): HasMany
    {
        return $this->hasMany(RecomendacionMaterial::class);
    }

    /**
     * Obtener feedback automático
     */
    public function obtenerFeedbackAutomatico(): string
    {
        $feedback = [];

        // Feedback sobre fortalezas
        if (! empty($this->areas_fortaleza)) {
            $feedback[] = '¡Excelente trabajo en: '.implode(', ', $this->areas_fortaleza).'!';
        }

        // Feedback sobre debilidades
        if (! empty($this->areas_debilidad)) {
            $feedback[] = 'Áreas para mejorar: '.implode(', ', $this->areas_debilidad).'.';
        }

        // Feedback sobre confianza
        if ($this->confianza_predictiva >= 0.8) {
            $feedback[] = 'El análisis muestra alta confianza en los resultados.';
        } elseif ($this->confianza_predictiva >= 0.6) {
            $feedback[] = 'El análisis muestra confianza moderada en los resultados.';
        } else {
            $feedback[] = 'El análisis muestra baja confianza. Se recomienda revisar el trabajo.';
        }

        return implode(' ', $feedback);
    }

    /**
     * Sugerir materiales de apoyo
     */
    public function sugerirMaterialesApoyo(): array
    {
        $materiales = [];

        // Buscar materiales relacionados con las áreas de debilidad
        foreach ($this->areas_debilidad as $area) {
            $materialesRelacionados = MaterialApoyo::where('activo', true)
                ->whereJsonContains('conceptos_relacionados', $area)
                ->get();

            foreach ($materialesRelacionados as $material) {
                $materiales[] = [
                    'material' => $material,
                    'relevancia' => $this->calcularRelevanciaMaterial($material),
                    'razon' => "Ayuda con: {$area}",
                ];
            }
        }

        // Ordenar por relevancia y eliminar duplicados
        $materiales = collect($materiales)
            ->unique('material.id')
            ->sortByDesc('relevancia')
            ->take(5)
            ->values()
            ->toArray();

        return $materiales;
    }

    /**
     * Calcular relevancia de un material
     */
    private function calcularRelevanciaMaterial(MaterialApoyo $material): float
    {
        $relevancia = 0.0;

        // Relevancia basada en áreas de debilidad
        foreach ($this->areas_debilidad as $area) {
            if (in_array($area, $material->conceptos_relacionados)) {
                $relevancia += 0.4;
            }
        }

        // Relevancia basada en nivel de dificultad
        $nivelEstudiante = $this->calcularNivelEstudiante();
        $diferenciaNivel = abs($material->nivel_dificultad - $nivelEstudiante);
        $relevancia += max(0, 0.3 - ($diferenciaNivel * 0.1));

        // Relevancia basada en tipo de material
        $relevancia += $this->calcularRelevanciaPorTipo($material);

        return min(1.0, $relevancia);
    }

    /**
     * Calcular nivel del estudiante
     */
    private function calcularNivelEstudiante(): int
    {
        $rendimiento = $this->trabajo->estudiante->rendimientoAcademico;

        if (! $rendimiento) {
            return 3; // Nivel medio por defecto
        }

        $promedio = $rendimiento->promedio;

        if ($promedio >= 90) {
            return 5;
        }

        if ($promedio >= 80) {
            return 4;
        }

        if ($promedio >= 70) {
            return 3;
        }

        if ($promedio >= 60) {
            return 2;
        }

        return 1;
    }

    /**
     * Calcular relevancia por tipo de material
     */
    private function calcularRelevanciaPorTipo(MaterialApoyo $material): float
    {
        $tipoRelevancia = [
            'video' => 0.2,
            'documento' => 0.15,
            'ejercicio' => 0.25,
            'simulacion' => 0.3,
            'enlace' => 0.1,
        ];

        return $tipoRelevancia[$material->tipo] ?? 0.1;
    }

    /**
     * Obtener resumen del análisis
     */
    public function obtenerResumen(): array
    {
        return [
            'trabajo_id' => $this->trabajo_id,
            'estudiante' => $this->trabajo->estudiante->nombre_completo,
            'contenido' => $this->trabajo->contenido->titulo,
            'areas_fortaleza' => $this->areas_fortaleza,
            'areas_debilidad' => $this->areas_debilidad,
            'confianza' => $this->confianza_predictiva,
            'recomendaciones' => $this->recomendaciones,
            'feedback' => $this->obtenerFeedbackAutomatico(),
            'materiales_sugeridos' => $this->sugerirMaterialesApoyo(),
            'fecha_analisis' => $this->created_at->format('d/m/Y H:i'),
        ];
    }

    /**
     * Obtener nivel de confianza en texto
     */
    public function getNivelConfianzaTexto(): string
    {
        if ($this->confianza_predictiva >= 0.8) {
            return 'Alta';
        } elseif ($this->confianza_predictiva >= 0.6) {
            return 'Media';
        } else {
            return 'Baja';
        }
    }

    /**
     * Obtener color de confianza
     */
    public function getColorConfianza(): string
    {
        if ($this->confianza_predictiva >= 0.8) {
            return 'green';
        } elseif ($this->confianza_predictiva >= 0.6) {
            return 'yellow';
        } else {
            return 'red';
        }
    }

    /**
     * Verificar si el análisis es confiable
     */
    public function esConfiable(): bool
    {
        return $this->confianza_predictiva >= 0.6;
    }

    /**
     * Obtener recomendaciones prioritarias
     */
    public function getRecomendacionesPrioritarias(): array
    {
        $prioridades = [
            'alta' => [],
            'media' => [],
            'baja' => [],
        ];

        foreach ($this->recomendaciones as $recomendacion) {
            if (str_contains(strtolower($recomendacion), 'urgente') ||
                str_contains(strtolower($recomendacion), 'importante')) {
                $prioridades['alta'][] = $recomendacion;
            } elseif (str_contains(strtolower($recomendacion), 'recomendable') ||
                str_contains(strtolower($recomendacion), 'sugerido')) {
                $prioridades['media'][] = $recomendacion;
            } else {
                $prioridades['baja'][] = $recomendacion;
            }
        }

        return $prioridades;
    }

    /**
     * Obtener estadísticas del análisis
     */
    public function obtenerEstadisticas(): array
    {
        return [
            'total_areas_fortaleza' => count($this->areas_fortaleza),
            'total_areas_debilidad' => count($this->areas_debilidad),
            'total_recomendaciones' => count($this->recomendaciones),
            'nivel_confianza' => $this->getNivelConfianzaTexto(),
            'es_confiable' => $this->esConfiable(),
            'fecha_analisis' => $this->created_at,
            'sistema_usado' => $this->sistemaAnalisis->nombre ?? 'Desconocido',
        ];
    }
}
