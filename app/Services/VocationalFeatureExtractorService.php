<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

/**
 * Servicio para Extracción de Features Vocacionales
 *
 * Extrae features REALES de un estudiante para hacer predicciones de carrera
 * Combina:
 * - Datos académicos (promedio, asistencia, varianza)
 * - Datos de desempeño (entrega de trabajos, consistencia)
 * - Datos de comportamiento (consultas, participación)
 * - Datos del test vocacional (intereses, aptitudes)
 *
 * @author Claude Code
 * @version 1.0
 */
class VocationalFeatureExtractorService
{
    protected MLPredictionService $mlService;

    public function __construct(MLPredictionService $mlService)
    {
        $this->mlService = $mlService;
    }

    /**
     * MÉTODO PRINCIPAL: Extraer features vocacionales de un estudiante
     *
     * Combina todos los datos y retorna un array normalizado listo para ML
     *
     * @param User $student Estudiante a analizar
     * @return array Features normalizados para predicción de carrera
     *
     * @throws \Exception Si hay error en la extracción
     */
    public function extractVocationalFeatures(User $student): array
    {
        try {
            Log::info("Extrayendo features vocacionales para estudiante {$student->id}");

            // 1. EXTRAER DATOS ACADÉMICOS
            $academicData = $this->extractAcademicData($student);

            // 2. EXTRAER DATOS DE DESEMPEÑO
            $performanceData = $this->extractPerformanceData($student);

            // 3. EXTRAER DATOS DE COMPORTAMIENTO
            $behaviorData = $this->extractBehaviorData($student);

            // 4. EXTRAER DATOS DEL TEST VOCACIONAL
            $vocationalData = $this->extractVocationalData($student);

            // 5. COMBINAR TODOS LOS DATOS
            $combinedData = array_merge(
                $academicData,
                $performanceData,
                $behaviorData,
                $vocationalData
            );

            // 6. NORMALIZAR PARA ML
            $normalized = $this->normalizeFeatures($combinedData);

            Log::info("Features vocacionales extraídos exitosamente", [
                'student_id' => $student->id,
                'feature_count' => count($normalized),
                'promedio' => $normalized['promedio'] ?? null,
                'asistencia' => $normalized['asistencia'] ?? null,
            ]);

            return $normalized;

        } catch (\Exception $e) {
            Log::error("Error extrayendo features vocacionales: {$e->getMessage()}", [
                'student_id' => $student->id,
                'trace' => $e->getTraceAsString(),
            ]);
            throw $e;
        }
    }

    /**
     * EXTRAER: Datos Académicos
     *
     * Promedio, asistencia, varianza de calificaciones
     *
     * @return array Con claves: promedio_academico, asistencia, varianza_calificaciones
     */
    private function extractAcademicData(User $student): array
    {
        // Obtener rendimiento académico actual
        $rendimiento = $student->rendimientoAcademico;
        $promedio = $rendimiento?->promedio ?? 0;

        // Obtener asistencia REAL (usar el método mejorado de MLPredictionService)
        $asistencia = $this->mlService->calculateAttendanceForStudent($student);

        // Obtener varianza de calificaciones REAL
        $varianza = $this->calculateGradeVariance($student);

        Log::debug("Academic data extracted", [
            'student_id' => $student->id,
            'promedio' => $promedio,
            'asistencia' => $asistencia,
            'varianza' => $varianza,
        ]);

        return [
            'promedio_academico' => (float) $promedio,
            'asistencia' => (float) $asistencia,
            'varianza_calificaciones' => (float) $varianza,
        ];
    }

    /**
     * EXTRAER: Datos de Desempeño
     *
     * Entrega de trabajos, consistencia, recencia
     *
     * @return array Con claves: trabajos_entregados, tasa_entrega, dias_desde_ultima_calificacion
     */
    private function extractPerformanceData(User $student): array
    {
        // Trabajos entregados vs totales
        $trabajosTotales = $student->trabajos()->count() ?? 1;
        $trabajosEntregados = $student->trabajos()
            ->whereIn('estado', ['entregado', 'calificado'])
            ->count() ?? 0;

        $tasaEntrega = $trabajosTotales > 0 ? $trabajosEntregados / $trabajosTotales : 0;

        // Días desde última calificación
        $ultimaCalificacion = $student->calificaciones()
            ->latest('fecha_calificacion')
            ->first();

        $diasDesdeUltima = $ultimaCalificacion
            ? now()->diffInDays($ultimaCalificacion->fecha_calificacion)
            : 999;

        Log::debug("Performance data extracted", [
            'student_id' => $student->id,
            'trabajos_entregados' => $trabajosEntregados,
            'tasa_entrega' => $tasaEntrega,
            'dias_desde_ultima' => $diasDesdeUltima,
        ]);

        return [
            'trabajos_entregados' => (int) $trabajosEntregados,
            'trabajos_totales' => (int) $trabajosTotales,
            'tasa_entrega' => (float) $tasaEntrega,
            'dias_desde_ultima_calificacion' => (int) $diasDesdeUltima,
        ];
    }

    /**
     * EXTRAER: Datos de Comportamiento
     *
     * Consultas, participación, tendencia temporal
     *
     * @return array Con claves: num_consultas_materiales, tendencia_temporal
     */
    private function extractBehaviorData(User $student): array
    {
        // Consultas de materiales
        $numConsultasMateriales = $student->materialQueries()?->count() ?? 0;

        // Tendencia temporal (si existe en rendimientoAcademico)
        $tendencia = $student->rendimientoAcademico?->tendencia_temporal ?? 'estable';

        // Mapeo de tendencia a score numérico
        $mapeoTendencia = [
            'mejorando' => 1.0,
            'estable' => 0.5,
            'declinando' => 0.0,
            'fluctuando' => 0.3,
        ];

        $tendenciaScore = $mapeoTendencia[$tendencia] ?? 0.5;

        Log::debug("Behavior data extracted", [
            'student_id' => $student->id,
            'consultas' => $numConsultasMateriales,
            'tendencia' => $tendencia,
        ]);

        return [
            'num_consultas_materiales' => (int) $numConsultasMateriales,
            'tendencia_temporal' => (string) $tendencia,
            'tendencia_score' => (float) $tendenciaScore,
        ];
    }

    /**
     * EXTRAER: Datos del Test Vocacional
     *
     * Áreas de interés, aptitudes, resultados del test
     *
     * @return array Con claves: area_dominante, num_areas_fuertes, areas_score_json
     */
    private function extractVocationalData(User $student): array
    {
        // Obtener último perfil vocacional
        $perfil = $student->perfilesVocacionales()
            ->latest('fecha_creacion')
            ->first();

        // Si no hay perfil, retornar valores por defecto
        if (!$perfil) {
            Log::warning("No vocational profile found for student", [
                'student_id' => $student->id,
            ]);

            return [
                'area_dominante' => 0.0,
                'num_areas_fuertes' => 0,
                'areas_score' => json_encode([
                    'ciencias' => 0,
                    'tecnologia' => 0,
                    'humanidades' => 0,
                    'artes' => 0,
                    'negocios' => 0,
                    'salud' => 0,
                ]),
            ];
        }

        // Obtener intereses (áreas de puntuación del test)
        $intereses = is_array($perfil->intereses) ? $perfil->intereses : [];

        // Calcular área dominante
        $areaDominante = max($intereses) ?? 0;

        // Contar áreas fuertes (score > 70)
        $numAreasFuertes = count(array_filter($intereses, fn($s) => $s > 70));

        Log::debug("Vocational data extracted", [
            'student_id' => $student->id,
            'area_dominante' => $areaDominante,
            'num_areas_fuertes' => $numAreasFuertes,
        ]);

        return [
            'area_dominante' => (float) $areaDominante,
            'num_areas_fuertes' => (int) $numAreasFuertes,
            'areas_score' => json_encode($intereses),
        ];
    }

    /**
     * NORMALIZAR: Escalar features para ML
     *
     * Convierte todos los valores a rangos esperados por los modelos
     *
     * @param array $rawFeatures Features sin normalizar
     * @return array Features normalizados [0-1] o [0-100] según corresponda
     */
    private function normalizeFeatures(array $rawFeatures): array
    {
        return [
            // ACADÉMICOS (0-100)
            'promedio' => max(0, min(100, $rawFeatures['promedio_academico'] ?? 50)),
            'asistencia' => max(0, min(100, $rawFeatures['asistencia'] ?? 50)),

            // DESEMPEÑO (0-1)
            'tasa_entrega' => max(0, min(1, $rawFeatures['tasa_entrega'] ?? 0)),

            // COMPORTAMIENTO (0-1)
            'tendencia_score' => max(0, min(1, $rawFeatures['tendencia_score'] ?? 0.5)),
            'recencia_score' => $this->calculateRecencyScore($rawFeatures['dias_desde_ultima_calificacion'] ?? 999),

            // VOCACIONAL (0-100 y 0-1)
            'area_dominante' => max(0, min(100, $rawFeatures['area_dominante'] ?? 0)),
            'num_areas_fuertes' => (int) ($rawFeatures['num_areas_fuertes'] ?? 0),

            // METADATOS
            'areas_score_json' => $rawFeatures['areas_score'] ?? '{}',
            'feature_extraction_date' => now()->toDateTimeString(),
        ];
    }

    /**
     * Calcular score de recencia de calificaciones
     *
     * Más reciente = score más alto (1.0 = hoy, 0.0 = 365+ días)
     *
     * @param int $daysSince Días desde última calificación
     * @return float Score entre 0 y 1
     */
    private function calculateRecencyScore(int $daysSince): float
    {
        if ($daysSince === 0) return 1.0;
        if ($daysSince >= 365) return 0.0;

        return 1.0 - ($daysSince / 365);
    }

    /**
     * Calcular varianza REAL de calificaciones
     *
     * Mide la dispersión de las calificaciones del estudiante
     * Mayor varianza = inconsistencia en el desempeño
     *
     * @param User $student
     * @return float Varianza (desviación estándar)
     */
    private function calculateGradeVariance(User $student): float
    {
        $grades = $student->calificaciones()
            ->pluck('puntaje')
            ->toArray();

        // Si tiene menos de 2 calificaciones, no hay varianza
        if (count($grades) < 2) {
            return 0.0;
        }

        // Calcular media
        $mean = array_sum($grades) / count($grades);

        // Calcular varianza
        $deviations = array_map(fn($g) => pow($g - $mean, 2), $grades);
        $variance = array_sum($deviations) / count($deviations);

        // Retornar desviación estándar
        return sqrt($variance);
    }

    /**
     * Validar que todos los features requeridos estén presentes
     *
     * @param array $features Features a validar
     * @return array ['valid' => bool, 'missing' => array]
     */
    public function validateFeatures(array $features): array
    {
        $required = [
            'promedio',
            'asistencia',
            'tasa_entrega',
            'tendencia_score',
            'recencia_score',
            'area_dominante',
        ];

        $missing = array_diff($required, array_keys($features));

        return [
            'valid' => empty($missing),
            'missing' => $missing,
            'total_features' => count($features),
        ];
    }

    /**
     * Generar reporte completo de features extraídos
     *
     * @param User $student
     * @return array Reporte detallado con todos los features y validación
     */
    public function generateFeatureReport(User $student): array
    {
        try {
            $features = $this->extractVocationalFeatures($student);
            $validation = $this->validateFeatures($features);

            return [
                'student_id' => $student->id,
                'student_name' => $student->nombre_completo ?? $student->name,
                'features' => $features,
                'validation' => $validation,
                'ready_for_prediction' => $validation['valid'],
                'timestamp' => now(),
            ];
        } catch (\Exception $e) {
            Log::error("Error generating feature report: {$e->getMessage()}");

            return [
                'student_id' => $student->id,
                'error' => $e->getMessage(),
                'timestamp' => now(),
            ];
        }
    }
}
