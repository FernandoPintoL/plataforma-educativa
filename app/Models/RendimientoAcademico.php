<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RendimientoAcademico extends Model
{
    use HasFactory;

    protected $table = 'rendimientos_academicos';

    protected $fillable = [
        'estudiante_id',
        'materias',
        'promedio',
        'fortalezas',
        'debilidades',
        'tendencia_temporal',
    ];

    protected $casts = [
        'materias' => 'array',
        'fortalezas' => 'array',
        'debilidades' => 'array',
    ];

    /**
     * Relación con el estudiante
     */
    public function estudiante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'estudiante_id');
    }

    /**
     * Calcular indicadores de desempeño
     */
    public function calcularIndicadoresDesempeño(): array
    {
        $indicadores = [
            'promedio_general' => $this->promedio,
            'total_materias' => count($this->materias ?? []),
            'materias_aprobadas' => 0,
            'materias_reprobadas' => 0,
            'materia_mejor' => null,
            'materia_peor' => null,
            'consistencia' => 0,
        ];

        if (! empty($this->materias)) {
            $puntajes = array_values($this->materias);
            $indicadores['materias_aprobadas'] = count(array_filter($puntajes, fn ($p) => $p >= 60));
            $indicadores['materias_reprobadas'] = count(array_filter($puntajes, fn ($p) => $p < 60));

            if (! empty($puntajes)) {
                $maxPuntaje = max($puntajes);
                $minPuntaje = min($puntajes);
                $indicadores['materia_mejor'] = array_search($maxPuntaje, $this->materias);
                $indicadores['materia_peor'] = array_search($minPuntaje, $this->materias);
                $indicadores['consistencia'] = $this->calcularConsistencia($puntajes);
            }
        }

        return $indicadores;
    }

    /**
     * Calcular consistencia en el rendimiento
     */
    private function calcularConsistencia(array $puntajes): float
    {
        if (count($puntajes) < 2) {
            return 0;
        }

        $promedio = array_sum($puntajes) / count($puntajes);
        $varianza = array_sum(array_map(fn ($x) => pow($x - $promedio, 2), $puntajes)) / count($puntajes);
        $desviacion = sqrt($varianza);

        // Normalizar entre 0 y 1 (1 = muy consistente, 0 = muy inconsistente)
        return max(0, 1 - ($desviacion / 50));
    }

    /**
     * Identificar patrones de aprendizaje
     */
    public function identificarPatrones(): array
    {
        $patrones = [
            'tipo_aprendizaje' => $this->identificarTipoAprendizaje(),
            'areas_fuertes' => $this->identificarAreasFuertes(),
            'areas_mejora' => $this->identificarAreasMejora(),
            'tendencia' => $this->tendencia_temporal,
            'recomendaciones' => $this->generarRecomendaciones(),
        ];

        return $patrones;
    }

    /**
     * Identificar tipo de aprendizaje
     */
    private function identificarTipoAprendizaje(): string
    {
        if (empty($this->materias)) {
            return 'indefinido';
        }

        $puntajes = array_values($this->materias);
        $promedio = array_sum($puntajes) / count($puntajes);

        if ($promedio >= 90) {
            return 'excelente';
        }

        if ($promedio >= 80) {
            return 'bueno';
        }

        if ($promedio >= 70) {
            return 'regular';
        }

        if ($promedio >= 60) {
            return 'bajo';
        }

        return 'crítico';
    }

    /**
     * Identificar áreas fuertes
     */
    private function identificarAreasFuertes(): array
    {
        if (empty($this->materias)) {
            return [];
        }

        return array_filter($this->materias, fn ($puntaje) => $puntaje >= 80);
    }

    /**
     * Identificar áreas de mejora
     */
    private function identificarAreasMejora(): array
    {
        if (empty($this->materias)) {
            return [];
        }

        return array_filter($this->materias, fn ($puntaje) => $puntaje < 70);
    }

    /**
     * Generar recomendaciones
     */
    private function generarRecomendaciones(): array
    {
        $recomendaciones = [];

        if ($this->promedio < 60) {
            $recomendaciones[] = 'Necesita apoyo académico urgente';
        } elseif ($this->promedio < 70) {
            $recomendaciones[] = 'Recomendable reforzar conocimientos básicos';
        } elseif ($this->promedio < 80) {
            $recomendaciones[] = 'Buen rendimiento, mantener el nivel';
        } else {
            $recomendaciones[] = 'Excelente rendimiento, puede asumir desafíos mayores';
        }

        if (! empty($this->debilidades)) {
            $recomendaciones[] = 'Enfocar esfuerzos en: '.implode(', ', array_keys($this->debilidades));
        }

        if ($this->tendencia_temporal === 'empeorando') {
            $recomendaciones[] = 'Identificar causas del declive académico';
        }

        return $recomendaciones;
    }

    /**
     * Contribuir al perfil vocacional
     */
    public function contribuirAlPerfilVocacional(): array
    {
        $contribucion = [
            'aptitudes_academicas' => $this->identificarAptitudesAcademicas(),
            'areas_interes' => $this->identificarAreasInteres(),
            'nivel_rendimiento' => $this->tipo_aprendizaje ?? 'indefinido',
            'consistencia' => $this->calcularConsistencia(array_values($this->materias ?? [])),
        ];

        return $contribucion;
    }

    /**
     * Identificar aptitudes académicas
     */
    private function identificarAptitudesAcademicas(): array
    {
        $aptitudes = [];

        if (! empty($this->materias)) {
            foreach ($this->materias as $materia => $puntaje) {
                if ($puntaje >= 85) {
                    $aptitudes[] = $materia;
                }
            }
        }

        return $aptitudes;
    }

    /**
     * Identificar áreas de interés
     */
    private function identificarAreasInteres(): array
    {
        $intereses = [];

        if (! empty($this->materias)) {
            foreach ($this->materias as $materia => $puntaje) {
                if ($puntaje >= 75) {
                    $intereses[] = $materia;
                }
            }
        }

        return $intereses;
    }

    /**
     * Obtener resumen del rendimiento
     */
    public function obtenerResumen(): array
    {
        return [
            'promedio' => $this->promedio,
            'tendencia' => $this->tendencia_temporal,
            'indicadores' => $this->calcularIndicadoresDesempeño(),
            'patrones' => $this->identificarPatrones(),
            'contribucion_vocacional' => $this->contribuirAlPerfilVocacional(),
        ];
    }
}
