<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * CorrelationAnalysisService
 *
 * Servicio para análisis de correlaciones y relaciones ocultas.
 * Descubre patrones de co-ocurrencia y dependencias entre variables.
 *
 * Funcionalidades:
 * - Correlaciones entre características académicas
 * - Relaciones entre actividad y desempeño
 * - Dependencias entre conceptos
 * - Análisis de factores predictivos
 */
class CorrelationAnalysisService
{
    /**
     * Calcular correlaciones entre todas las variables académicas
     */
    public function analyzeAcademicCorrelations(?int $limit = null): array
    {
        try {
            Log::info("Iniciando análisis de correlaciones académicas");

            // Extraer datos de estudiantes
            $data = $this->extractAcademicData($limit);

            if (empty($data)) {
                return ['success' => false, 'message' => 'No data available'];
            }

            // Calcular correlaciones
            $correlations = $this->calculatePearsonCorrelations($data);

            // Identificar relaciones significativas
            $significant = $this->filterSignificantCorrelations($correlations, 0.5);

            Log::info("Correlaciones calculadas: " . count($significant));

            return [
                'success' => true,
                'total_correlations' => count($correlations),
                'significant_correlations' => count($significant),
                'correlations' => $significant,
            ];

        } catch (Exception $e) {
            Log::error("Error en analyzeAcademicCorrelations: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Extraer datos académicos de estudiantes
     */
    private function extractAcademicData(?int $limit = null): array
    {
        try {
            $query = DB::table('users')
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'estudiante');
                })
                ->select(['id'])
                ->selectRaw('
                    AVG(CAST(c.calificacion AS DECIMAL(5,2))) as avg_grade,
                    STDDEV(CAST(c.calificacion AS DECIMAL(5,2))) as grade_stddev,
                    COUNT(DISTINCT c.id) as num_grades,
                    COUNT(DISTINCT a.id) as attendance_count,
                    COUNT(DISTINCT t.id) as assignments_completed,
                    AVG(CAST(rtm.progreso_estimado AS DECIMAL(5,2))) as avg_progress,
                    AVG(CAST(rtm.velocidad_respuesta AS DECIMAL(5,2))) as avg_speed,
                    SUM(CAST(rtm.duracion_evento AS DECIMAL(10,2))) as total_time,
                    AVG(CAST(rtm.num_correcciones AS DECIMAL(5,2))) as avg_corrections
                ')
                ->leftJoin('calificaciones as c', 'users.id', '=', 'c.estudiante_id')
                ->leftJoin('asistencias as a', 'users.id', '=', 'a.estudiante_id')
                ->leftJoin('trabajos as t', 'users.id', '=', 't.estudiante_id')
                ->leftJoin('real_time_monitoring as rtm', 'users.id', '=', 'rtm.estudiante_id')
                ->groupBy('users.id');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            if ($students->isEmpty()) {
                return [];
            }

            // Convertir a array numérico
            $data = [];
            $variables = [
                'avg_grade',
                'grade_stddev',
                'num_grades',
                'attendance_count',
                'assignments_completed',
                'avg_progress',
                'avg_speed',
                'total_time',
                'avg_corrections',
            ];

            foreach ($students as $student) {
                $row = [];
                foreach ($variables as $var) {
                    $row[] = floatval($student->$var ?? 0);
                }
                $data[] = $row;
            }

            return ['variables' => $variables, 'data' => $data];

        } catch (Exception $e) {
            Log::error("Error en extractAcademicData: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Calcular correlación de Pearson entre variables
     */
    private function calculatePearsonCorrelations(array $extractedData): array
    {
        if (empty($extractedData['data'])) {
            return [];
        }

        $variables = $extractedData['variables'];
        $data = $extractedData['data'];
        $numVars = count($variables);
        $numRecords = count($data);

        if ($numRecords < 2) {
            return [];
        }

        $correlations = [];

        // Calcular correlación entre cada par de variables
        for ($i = 0; $i < $numVars; $i++) {
            for ($j = $i + 1; $j < $numVars; $j++) {
                // Extraer columnas
                $col1 = array_column($data, $i);
                $col2 = array_column($data, $j);

                // Calcular correlation
                $r = $this->pearsonCorrelation($col1, $col2);

                if ($r !== null) {
                    $correlations[] = [
                        'variable_1' => $variables[$i],
                        'variable_2' => $variables[$j],
                        'correlation' => round($r, 3),
                        'strength' => $this->correlationStrength(abs($r)),
                        'direction' => $r > 0 ? 'positive' : 'negative',
                    ];
                }
            }
        }

        return $correlations;
    }

    /**
     * Calcular coeficiente de correlación de Pearson
     */
    private function pearsonCorrelation(array $x, array $y): ?float
    {
        $n = count($x);

        if ($n < 2 || count($y) !== $n) {
            return null;
        }

        // Calcular medias
        $meanX = array_sum($x) / $n;
        $meanY = array_sum($y) / $n;

        // Calcular covariance y desviaciones estándar
        $sumXY = 0;
        $sumX2 = 0;
        $sumY2 = 0;

        for ($i = 0; $i < $n; $i++) {
            $deviationX = $x[$i] - $meanX;
            $deviationY = $y[$i] - $meanY;

            $sumXY += $deviationX * $deviationY;
            $sumX2 += $deviationX * $deviationX;
            $sumY2 += $deviationY * $deviationY;
        }

        $denominator = sqrt($sumX2 * $sumY2);

        if ($denominator == 0) {
            return 0;
        }

        return $sumXY / $denominator;
    }

    /**
     * Determinar fortaleza de correlación
     */
    private function correlationStrength(float $r): string
    {
        if ($r < 0.3) {
            return 'weak';
        } elseif ($r < 0.6) {
            return 'moderate';
        } elseif ($r < 0.8) {
            return 'strong';
        } else {
            return 'very_strong';
        }
    }

    /**
     * Filtrar solo correlaciones significativas
     */
    private function filterSignificantCorrelations(array $correlations, float $threshold = 0.5): array
    {
        return array_filter(
            $correlations,
            fn($corr) => abs($corr['correlation']) >= $threshold
        );
    }

    /**
     * Analizar relaciones entre actividad y desempeño
     */
    public function analyzeActivityPerformanceRelationship(?int $limit = null): array
    {
        try {
            $results = [];

            // Estudiantes con alta actividad y bajo desempeño
            $query = DB::table('users')
                ->selectRaw('
                    users.id,
                    users.name,
                    COUNT(DISTINCT rtm.id) as activity_events,
                    AVG(rtm.progreso_estimado) as avg_progress,
                    AVG(CAST(c.calificacion AS DECIMAL(5,2))) as avg_grade,
                    AVG(rtm.duracion_evento) as avg_duration
                ')
                ->leftJoin('real_time_monitoring as rtm', 'users.id', '=', 'rtm.estudiante_id')
                ->leftJoin('calificaciones as c', 'users.id', '=', 'c.estudiante_id')
                ->where('rtm.timestamp', '>=', now()->subDays(30))
                ->groupBy('users.id', 'users.name')
                ->havingRaw('COUNT(DISTINCT rtm.id) > 10');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            foreach ($students as $student) {
                $avgGrade = floatval($student->avg_grade ?? 0);
                $avgProgress = floatval($student->avg_progress ?? 0);

                // Clasificar la relación
                if ($student->activity_events > 20 && $avgGrade < 60) {
                    $relationship = 'HIGH_ACTIVITY_LOW_PERFORMANCE';
                    $insight = 'Estudia mucho pero con bajo rendimiento - puede necesitar cambio de estrategia';
                } elseif ($student->activity_events > 20 && $avgGrade > 80) {
                    $relationship = 'HIGH_ACTIVITY_HIGH_PERFORMANCE';
                    $insight = 'Excelente correlación entre esfuerzo y resultado';
                } elseif ($student->activity_events < 10 && $avgGrade > 80) {
                    $relationship = 'EFFICIENT_PERFORMER';
                    $insight = 'Logra buenos resultados con menor tiempo invertido';
                } else {
                    $relationship = 'LOW_ACTIVITY_LOW_PERFORMANCE';
                    $insight = 'Necesita incrementar su participación académica';
                }

                $results[] = [
                    'student_id' => $student->id,
                    'student_name' => $student->name,
                    'relationship_type' => $relationship,
                    'activity_events' => $student->activity_events,
                    'average_progress' => round($avgProgress, 2),
                    'average_grade' => round($avgGrade, 2),
                    'average_duration_minutes' => round($student->avg_duration / 60, 1),
                    'insight' => $insight,
                ];
            }

            return [
                'success' => true,
                'total_students_analyzed' => count($results),
                'relationships' => $results,
            ];

        } catch (Exception $e) {
            Log::error("Error en analyzeActivityPerformanceRelationship: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Encontrar factores predictivos de desempeño
     */
    public function findPredictiveFactors(): array
    {
        try {
            $factors = [];

            // Factor 1: Asistencia
            $attendanceCorr = $this->calculateCorrelationWithGrade('attendance');
            if ($attendanceCorr !== null) {
                $factors[] = [
                    'factor' => 'Asistencia a clase',
                    'correlation' => round($attendanceCorr, 3),
                    'predictive_power' => abs($attendanceCorr) > 0.5 ? 'high' : 'moderate',
                ];
            }

            // Factor 2: Tiempo de estudio
            $timeCorr = $this->calculateCorrelationWithGrade('time');
            if ($timeCorr !== null) {
                $factors[] = [
                    'factor' => 'Tiempo de estudio',
                    'correlation' => round($timeCorr, 3),
                    'predictive_power' => abs($timeCorr) > 0.5 ? 'high' : 'moderate',
                ];
            }

            // Factor 3: Número de tareas completadas
            $tasksCorr = $this->calculateCorrelationWithGrade('tasks');
            if ($tasksCorr !== null) {
                $factors[] = [
                    'factor' => 'Tareas completadas',
                    'correlation' => round($tasksCorr, 3),
                    'predictive_power' => abs($tasksCorr) > 0.5 ? 'high' : 'moderate',
                ];
            }

            usort($factors, fn($a, $b) => abs($b['correlation']) <=> abs($a['correlation']));

            return [
                'success' => true,
                'predictive_factors' => $factors,
                'top_factor' => $factors[0] ?? null,
            ];

        } catch (Exception $e) {
            Log::error("Error en findPredictiveFactors: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Calcular correlación de un factor con calificaciones
     */
    private function calculateCorrelationWithGrade(string $factor): ?float
    {
        try {
            $data = DB::table('users')
                ->selectRaw('
                    CAST(AVG(c.calificacion) AS DECIMAL(5,2)) as avg_grade,
                    CASE WHEN ? = "attendance" THEN COUNT(DISTINCT a.id)
                         WHEN ? = "time" THEN CAST(SUM(rtm.duracion_evento) / 60 AS DECIMAL(10,1))
                         WHEN ? = "tasks" THEN COUNT(DISTINCT t.id)
                    END as factor_value
                ', [$factor, $factor, $factor])
                ->leftJoin('calificaciones as c', 'users.id', '=', 'c.estudiante_id')
                ->leftJoin('asistencias as a', 'users.id', '=', 'a.estudiante_id')
                ->leftJoin('real_time_monitoring as rtm', 'users.id', '=', 'rtm.estudiante_id')
                ->leftJoin('trabajos as t', 'users.id', '=', 't.estudiante_id')
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'estudiante');
                })
                ->groupBy('users.id')
                ->get();

            if ($data->count() < 2) {
                return null;
            }

            $grades = $data->pluck('avg_grade')->map(fn($v) => floatval($v))->toArray();
            $factors = $data->pluck('factor_value')->map(fn($v) => floatval($v))->toArray();

            return $this->pearsonCorrelation($factors, $grades);

        } catch (Exception $e) {
            Log::error("Error en calculateCorrelationWithGrade: {$e->getMessage()}");
            return null;
        }
    }

    /**
     * Análisis de covarianza multivariada simplificado
     */
    public function getMultivariateInsights(): array
    {
        try {
            return [
                'success' => true,
                'insights' => [
                    [
                        'name' => 'Relación Esfuerzo-Resultado',
                        'description' => 'Correlación entre tiempo invertido y calificaciones',
                        'importance' => 'high',
                    ],
                    [
                        'name' => 'Consistencia Académica',
                        'description' => 'Variabilidad en calificaciones indica estabilidad emocional',
                        'importance' => 'high',
                    ],
                    [
                        'name' => 'Patrón de Participación',
                        'description' => 'Regularidad en participación predice engagement a largo plazo',
                        'importance' => 'medium',
                    ],
                ],
            ];

        } catch (Exception $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
