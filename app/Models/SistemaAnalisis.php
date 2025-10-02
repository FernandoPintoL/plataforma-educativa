<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SistemaAnalisis extends Model
{
    use HasFactory;

    protected $table = 'sistemas_analisis';

    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo_modelo',
        'parametros',
        'precision',
        'ultimo_entrenamiento',
        'activo',
    ];

    protected $casts = [
        'parametros' => 'array',
        'ultimo_entrenamiento' => 'datetime',
        'activo' => 'boolean',
    ];

    /**
     * Relación con los resultados de análisis
     */
    public function resultadosAnalisis(): HasMany
    {
        return $this->hasMany(ResultadoAnalisis::class);
    }

    /**
     * Analizar un trabajo
     */
    public function analizarTrabajo(Trabajo $trabajo): ResultadoAnalisis
    {
        // Preparar datos para el análisis
        $datosTrabajo = $this->prepararDatosTrabajo($trabajo);

        // Aplicar el modelo de análisis
        $resultado = $this->aplicarModelo($datosTrabajo);

        // Crear resultado de análisis
        return ResultadoAnalisis::create([
            'trabajo_id' => $trabajo->id,
            'sistema_analisis_id' => $this->id,
            'areas_fortaleza' => $resultado['areas_fortaleza'],
            'areas_debilidad' => $resultado['areas_debilidad'],
            'confianza_predictiva' => $resultado['confianza_predictiva'],
            'recomendaciones' => $resultado['recomendaciones'],
            'metadatos' => $resultado['metadatos'] ?? [],
        ]);
    }

    /**
     * Preparar datos del trabajo para análisis
     */
    private function prepararDatosTrabajo(Trabajo $trabajo): array
    {
        return [
            'trabajo_id' => $trabajo->id,
            'estudiante_id' => $trabajo->estudiante_id,
            'contenido_id' => $trabajo->contenido_id,
            'tiempo_total' => $trabajo->tiempo_total,
            'intentos' => $trabajo->intentos,
            'consultas_material' => $trabajo->consultas_material,
            'respuestas' => $trabajo->respuestas,
            'fecha_entrega' => $trabajo->fecha_entrega,
            'estado' => $trabajo->estado,
        ];
    }

    /**
     * Aplicar el modelo de análisis
     */
    private function aplicarModelo(array $datos): array
    {
        // Implementar lógica del modelo de análisis
        // Por ahora, retornar un análisis básico

        $areasFortaleza = [];
        $areasDebilidad = [];
        $recomendaciones = [];

        // Análisis basado en tiempo
        if ($datos['tiempo_total'] < 30) {
            $areasFortaleza[] = 'Eficiencia en el tiempo';
        } elseif ($datos['tiempo_total'] > 120) {
            $areasDebilidad[] = 'Necesita mejorar la gestión del tiempo';
            $recomendaciones[] = 'Practicar ejercicios de resolución rápida';
        }

        // Análisis basado en intentos
        if ($datos['intentos'] == 1) {
            $areasFortaleza[] = 'Precisión en las respuestas';
        } elseif ($datos['intentos'] > 3) {
            $areasDebilidad[] = 'Dificultad en la comprensión del tema';
            $recomendaciones[] = 'Revisar material de apoyo adicional';
        }

        // Análisis basado en consultas a material
        if ($datos['consultas_material'] > 5) {
            $areasDebilidad[] = 'Dependencia excesiva del material';
            $recomendaciones[] = 'Desarrollar mayor autonomía en el aprendizaje';
        } else {
            $areasFortaleza[] = 'Independencia en el aprendizaje';
        }

        return [
            'areas_fortaleza' => $areasFortaleza,
            'areas_debilidad' => $areasDebilidad,
            'confianza_predictiva' => $this->calcularConfianza($datos),
            'recomendaciones' => $recomendaciones,
            'metadatos' => [
                'modelo_usado' => $this->tipo_modelo,
                'fecha_analisis' => now()->toISOString(),
                'version_modelo' => '1.0',
            ],
        ];
    }

    /**
     * Calcular confianza predictiva
     */
    private function calcularConfianza(array $datos): float
    {
        $confianza = 0.5; // Base

        // Ajustar confianza basado en datos disponibles
        if (! empty($datos['respuestas'])) {
            $confianza += 0.2;
        }

        if ($datos['tiempo_total'] > 0) {
            $confianza += 0.1;
        }

        if ($datos['intentos'] > 0) {
            $confianza += 0.1;
        }

        return min(1.0, $confianza);
    }

    /**
     * Generar recomendaciones para un estudiante
     */
    public function generarRecomendaciones(User $estudiante, ResultadoAnalisis $resultado): array
    {
        $recomendaciones = [];

        // Obtener materiales de apoyo relevantes
        $materiales = MaterialApoyo::where('activo', true)
            ->where('nivel_dificultad', '<=', $this->calcularNivelDificultad($estudiante))
            ->get();

        foreach ($materiales as $material) {
            $relevancia = $this->calcularRelevanciaMaterial($material, $resultado);

            if ($relevancia > 0.5) {
                $recomendaciones[] = [
                    'material' => $material,
                    'relevancia' => $relevancia,
                    'razon' => $this->generarRazonRecomendacion($material, $resultado),
                ];
            }
        }

        // Ordenar por relevancia
        usort($recomendaciones, fn ($a, $b) => $b['relevancia'] <=> $a['relevancia']);

        return array_slice($recomendaciones, 0, 5); // Top 5 recomendaciones
    }

    /**
     * Calcular nivel de dificultad del estudiante
     */
    private function calcularNivelDificultad(User $estudiante): int
    {
        $rendimiento = $estudiante->rendimientoAcademico;

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
     * Calcular relevancia de un material
     */
    private function calcularRelevanciaMaterial(MaterialApoyo $material, ResultadoAnalisis $resultado): float
    {
        $relevancia = 0.0;

        // Relevancia basada en áreas de debilidad
        foreach ($resultado->areas_debilidad as $area) {
            if (in_array($area, $material->conceptos_relacionados)) {
                $relevancia += 0.3;
            }
        }

        // Relevancia basada en nivel de dificultad
        $nivelEstudiante = $this->calcularNivelDificultad($resultado->trabajo->estudiante);
        $diferenciaNivel = abs($material->nivel_dificultad - $nivelEstudiante);
        $relevancia += max(0, 0.2 - ($diferenciaNivel * 0.05));

        return min(1.0, $relevancia);
    }

    /**
     * Generar razón para la recomendación
     */
    private function generarRazonRecomendacion(MaterialApoyo $material, ResultadoAnalisis $resultado): string
    {
        $razones = [];

        foreach ($resultado->areas_debilidad as $area) {
            if (in_array($area, $material->conceptos_relacionados)) {
                $razones[] = "Ayuda con: {$area}";
            }
        }

        if (empty($razones)) {
            return 'Material complementario para reforzar conocimientos';
        }

        return implode(', ', $razones);
    }

    /**
     * Detectar patrones de aprendizaje
     */
    public function detectarPatronesAprendizaje(User $estudiante): array
    {
        $trabajos = $estudiante->trabajos()
            ->whereHas('resultadoAnalisis')
            ->with('resultadoAnalisis')
            ->get();

        $patrones = [
            'consistencia_tiempo' => $this->analizarConsistenciaTiempo($trabajos),
            'evolucion_desempeno' => $this->analizarEvolucionDesempeno($trabajos),
            'preferencias_contenido' => $this->analizarPreferenciasContenido($trabajos),
            'patrones_errores' => $this->analizarPatronesErrores($trabajos),
        ];

        return $patrones;
    }

    /**
     * Analizar consistencia en el tiempo
     */
    private function analizarConsistenciaTiempo($trabajos): array
    {
        $tiempos = $trabajos->pluck('tiempo_total')->filter()->toArray();

        if (empty($tiempos)) {
            return ['consistencia' => 0, 'tendencia' => 'indefinida'];
        }

        $promedio = array_sum($tiempos) / count($tiempos);
        $varianza = array_sum(array_map(fn ($t) => pow($t - $promedio, 2), $tiempos)) / count($tiempos);
        $desviacion = sqrt($varianza);

        return [
            'consistencia' => max(0, 1 - ($desviacion / $promedio)),
            'tendencia' => $this->calcularTendencia($tiempos),
            'promedio_tiempo' => $promedio,
        ];
    }

    /**
     * Analizar evolución del desempeño
     */
    private function analizarEvolucionDesempeno($trabajos): array
    {
        $confianzas = $trabajos->pluck('resultadoAnalisis.confianza_predictiva')->filter()->toArray();

        if (empty($confianzas)) {
            return ['tendencia' => 'indefinida', 'mejora' => 0];
        }

        $tendencia = $this->calcularTendencia($confianzas);
        $mejora = $confianzas[count($confianzas) - 1] - $confianzas[0];

        return [
            'tendencia' => $tendencia,
            'mejora' => $mejora,
            'promedio_confianza' => array_sum($confianzas) / count($confianzas),
        ];
    }

    /**
     * Analizar preferencias de contenido
     */
    private function analizarPreferenciasContenido($trabajos): array
    {
        $tiposContenido = $trabajos->pluck('contenido.tipo')->countBy();
        $total = $trabajos->count();

        $preferencias = [];
        foreach ($tiposContenido as $tipo => $cantidad) {
            $preferencias[$tipo] = $cantidad / $total;
        }

        return $preferencias;
    }

    /**
     * Analizar patrones de errores
     */
    private function analizarPatronesErrores($trabajos): array
    {
        $areasDebilidad = $trabajos->pluck('resultadoAnalisis.areas_debilidad')
            ->flatten()
            ->countBy();

        return $areasDebilidad->toArray();
    }

    /**
     * Calcular tendencia de una serie de valores
     */
    private function calcularTendencia(array $valores): string
    {
        if (count($valores) < 2) {
            return 'indefinida';
        }

        $primero = $valores[0];
        $ultimo = $valores[count($valores) - 1];

        if ($ultimo > $primero * 1.1) {
            return 'mejorando';
        } elseif ($ultimo < $primero * 0.9) {
            return 'empeorando';
        } else {
            return 'estable';
        }
    }

    /**
     * Entrenar el modelo
     */
    public function entrenarModelo(array $datos): void
    {
        // Implementar lógica de entrenamiento del modelo
        // Por ahora, actualizar la fecha de último entrenamiento

        $this->update([
            'ultimo_entrenamiento' => now(),
            'precision' => $this->calcularPrecision($datos),
        ]);
    }

    /**
     * Calcular precisión del modelo
     */
    private function calcularPrecision(array $datos): float
    {
        // Implementar cálculo de precisión
        // Por ahora, retornar un valor aleatorio entre 0.7 y 0.95
        return 0.7 + (mt_rand(0, 25) / 100);
    }
}
