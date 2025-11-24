<?php

namespace App\Services;

use App\Models\RealTimeMonitoring;
use App\Models\StudentAlert;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * AnomalyDetectionService
 *
 * Servicio para detección de anomalías en patrones de estudiantes.
 * Identifica comportamientos inusuales que pueden indicar problemas.
 *
 * Funcionalidades:
 * - Detección de cambios repentinos en actividad
 * - Identificación de patrones de abandono incipiente
 * - Detección de patrones de copia/fraude
 * - Alertas sobre cambios de comportamiento
 */
class AnomalyDetectionService
{
    /**
     * Tipos de anomalías detectadas
     */
    private const ANOMALY_TYPES = [
        'sudden_disengagement' => 'Desvinculación repentina',
        'unusual_activity_pattern' => 'Patrón de actividad inusual',
        'excessive_corrections' => 'Número excesivo de correcciones',
        'low_progress_high_time' => 'Bajo progreso con tiempo alto',
        'inconsistent_performance' => 'Desempeño inconsistente',
        'unusual_submission_time' => 'Tiempo de entrega inusual',
        'rapid_grade_drop' => 'Caída rápida de calificaciones',
        'copy_paste_patterns' => 'Patrones potenciales de copia',
    ];

    /**
     * Detectar todas las anomalías en la población estudiantil
     */
    public function detectAllAnomalies(?int $limit = null): array
    {
        try {
            Log::info("Iniciando detección de anomalías");

            $allAnomalies = [];

            // Ejecutar cada tipo de detección
            $allAnomalies = array_merge(
                $allAnomalies,
                $this->detectSuddenDisengagement($limit)
            );

            $allAnomalies = array_merge(
                $allAnomalies,
                $this->detectUnusualActivityPatterns($limit)
            );

            $allAnomalies = array_merge(
                $allAnomalies,
                $this->detectExcessiveCorrections($limit)
            );

            $allAnomalies = array_merge(
                $allAnomalies,
                $this->detectLowProgressHighTime($limit)
            );

            $allAnomalies = array_merge(
                $allAnomalies,
                $this->detectInconsistentPerformance($limit)
            );

            Log::info("Anomalías detectadas: " . count($allAnomalies));

            return [
                'success' => true,
                'message' => 'Anomaly detection completed',
                'total_anomalies' => count($allAnomalies),
                'anomalies' => $allAnomalies,
            ];

        } catch (Exception $e) {
            Log::error("Error en detectAllAnomalies: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Detectar desvinculación repentina (bajo tiempo, bajo progreso)
     */
    private function detectSuddenDisengagement(?int $limit = null): array
    {
        try {
            $anomalies = [];

            // Estudiantes con actividad normal hace días pero inactivos ahora
            $query = DB::table('real_time_monitoring as rtm')
                ->selectRaw('
                    rtm.estudiante_id,
                    COUNT(*) as total_events,
                    AVG(rtm.duracion_evento) as avg_duration,
                    AVG(rtm.progreso_estimado) as avg_progress,
                    MAX(rtm.timestamp) as last_activity
                ')
                ->where('rtm.timestamp', '>=', now()->subDays(30))
                ->groupBy('rtm.estudiante_id');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            $now = now();

            foreach ($students as $student) {
                $lastActivity = new \DateTime($student->last_activity);
                $daysSinceActivity = $now->diff($lastActivity)->days;

                // Si no ha habido actividad en 7+ días pero solía estar activo
                if ($daysSinceActivity >= 7 && $student->total_events > 10) {
                    $anomalies[] = [
                        'student_id' => $student->estudiante_id,
                        'type' => 'sudden_disengagement',
                        'type_name' => self::ANOMALY_TYPES['sudden_disengagement'],
                        'severity' => $daysSinceActivity > 14 ? 'critical' : 'high',
                        'days_since_activity' => $daysSinceActivity,
                        'previous_avg_duration' => round($student->avg_duration, 2),
                        'previous_avg_progress' => round($student->avg_progress, 2),
                        'details' => "No ha habido actividad en {$daysSinceActivity} días",
                    ];
                }
            }

            return $anomalies;

        } catch (Exception $e) {
            Log::error("Error en detectSuddenDisengagement: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Detectar patrones de actividad inusuales (horarios extraños, ráfagas)
     */
    private function detectUnusualActivityPatterns(?int $limit = null): array
    {
        try {
            $anomalies = [];

            // Buscar actividades en horarios inusuales (madrugadas)
            $query = DB::table('real_time_monitoring')
                ->selectRaw("
                    estudiante_id,
                    HOUR(timestamp) as activity_hour,
                    COUNT(*) as event_count,
                    DATE(timestamp) as activity_date
                ")
                ->where('timestamp', '>=', now()->subDays(7))
                ->whereIn(DB::raw('HOUR(timestamp)'), [0, 1, 2, 3, 4, 5]) // Horas madrugada
                ->groupBy('estudiante_id', 'activity_hour', 'activity_date');

            if ($limit) {
                $query->limit($limit);
            }

            $anomalousActivities = $query->get();

            foreach ($anomalousActivities as $activity) {
                $anomalies[] = [
                    'student_id' => $activity->estudiante_id,
                    'type' => 'unusual_activity_pattern',
                    'type_name' => self::ANOMALY_TYPES['unusual_activity_pattern'],
                    'severity' => $activity->event_count > 5 ? 'high' : 'medium',
                    'unusual_hour' => $activity->activity_hour,
                    'event_count' => $activity->event_count,
                    'activity_date' => $activity->activity_date,
                    'details' => "Actividad en hora inusual ({$activity->activity_hour}:00)",
                ];
            }

            return $anomalies;

        } catch (Exception $e) {
            Log::error("Error en detectUnusualActivityPatterns: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Detectar número excesivo de correcciones (puede indicar falta de comprensión)
     */
    private function detectExcessiveCorrections(?int $limit = null): array
    {
        try {
            $anomalies = [];

            $query = DB::table('real_time_monitoring')
                ->selectRaw("
                    estudiante_id,
                    COUNT(*) as total_events,
                    AVG(num_correcciones) as avg_corrections,
                    MAX(num_correcciones) as max_corrections,
                    SUM(num_correcciones) as total_corrections
                ")
                ->where('timestamp', '>=', now()->subDays(30))
                ->groupByRaw('estudiante_id')
                ->havingRaw('AVG(num_correcciones) > 3'); // Más de 3 correcciones por evento

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            foreach ($students as $student) {
                if ($student->total_corrections > 20) {
                    $anomalies[] = [
                        'student_id' => $student->estudiante_id,
                        'type' => 'excessive_corrections',
                        'type_name' => self::ANOMALY_TYPES['excessive_corrections'],
                        'severity' => $student->avg_corrections > 5 ? 'critical' : 'high',
                        'total_corrections' => $student->total_corrections,
                        'average_per_event' => round($student->avg_corrections, 2),
                        'max_in_single_event' => $student->max_corrections,
                        'details' => "Promedio de {$student->avg_corrections} correcciones por evento",
                    ];
                }
            }

            return $anomalies;

        } catch (Exception $e) {
            Log::error("Error en detectExcessiveCorrections: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Detectar bajo progreso con tiempo alto invertido
     */
    private function detectLowProgressHighTime(?int $limit = null): array
    {
        try {
            $anomalies = [];

            $query = DB::table('real_time_monitoring')
                ->selectRaw("
                    estudiante_id,
                    AVG(progreso_estimado) as avg_progress,
                    SUM(duracion_evento) as total_time_minutes,
                    COUNT(*) as event_count
                ")
                ->where('timestamp', '>=', now()->subDays(30))
                ->groupByRaw('estudiante_id')
                ->havingRaw('AVG(progreso_estimado) < 30 AND SUM(duracion_evento) > 600');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            foreach ($students as $student) {
                $anomalies[] = [
                    'student_id' => $student->estudiante_id,
                    'type' => 'low_progress_high_time',
                    'type_name' => self::ANOMALY_TYPES['low_progress_high_time'],
                    'severity' => $student->avg_progress < 15 ? 'critical' : 'high',
                    'average_progress' => round($student->avg_progress, 2),
                    'total_time_minutes' => round($student->total_time_minutes / 60, 1),
                    'event_count' => $student->event_count,
                    'details' => "Tiempo invertido alto con bajo progreso",
                ];
            }

            return $anomalies;

        } catch (Exception $e) {
            Log::error("Error en detectLowProgressHighTime: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Detectar desempeño inconsistente (grandes variaciones)
     */
    private function detectInconsistentPerformance(?int $limit = null): array
    {
        try {
            $anomalies = [];

            $query = DB::table('real_time_monitoring')
                ->selectRaw("
                    estudiante_id,
                    AVG(progreso_estimado) as avg_progress,
                    STDDEV(progreso_estimado) as progress_stddev,
                    MAX(progreso_estimado) - MIN(progreso_estimado) as progress_range
                ")
                ->where('timestamp', '>=', now()->subDays(30))
                ->groupByRaw('estudiante_id')
                ->havingRaw('STDDEV(progreso_estimado) > 25');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            foreach ($students as $student) {
                if ($student->progress_stddev && $student->progress_stddev > 25) {
                    $anomalies[] = [
                        'student_id' => $student->estudiante_id,
                        'type' => 'inconsistent_performance',
                        'type_name' => self::ANOMALY_TYPES['inconsistent_performance'],
                        'severity' => $student->progress_stddev > 40 ? 'critical' : 'high',
                        'average_progress' => round($student->avg_progress, 2),
                        'progress_variability' => round($student->progress_stddev, 2),
                        'progress_range' => round($student->progress_range, 2),
                        'details' => "Variación significativa en desempeño ({$student->progress_stddev}%)",
                    ];
                }
            }

            return $anomalies;

        } catch (Exception $e) {
            Log::error("Error en detectInconsistentPerformance: {$e->getMessage()}");
            return [];
        }
    }

    /**
     * Obtener anomalías para un estudiante específico
     */
    public function getStudentAnomalies(int $studentId): array
    {
        try {
            // Buscar en alertas generadas para este estudiante
            $alerts = StudentAlert::where('estudiante_id', $studentId)
                ->whereIn('tipo_alerta', array_keys(self::ANOMALY_TYPES))
                ->orderBy('fecha_generacion', 'desc')
                ->limit(10)
                ->get();

            // Buscar patrones recientes
            $recentMonitoring = RealTimeMonitoring::where('estudiante_id', $studentId)
                ->where('timestamp', '>=', now()->subDays(7))
                ->get();

            $anomalies = [];

            // Procesar monitoreos para detectar anomalías en tiempo real
            if ($recentMonitoring->isNotEmpty()) {
                $avgProgress = $recentMonitoring->avg('progreso_estimado');
                $totalTime = $recentMonitoring->sum('duracion_evento');
                $totalCorrections = $recentMonitoring->sum('num_correcciones');

                if ($avgProgress < 30 && $totalTime > 600) {
                    $anomalies[] = [
                        'type' => 'low_progress_high_time',
                        'severity' => 'high',
                        'description' => 'Bajo progreso con tiempo alto invertido',
                    ];
                }

                if ($totalCorrections > 15) {
                    $anomalies[] = [
                        'type' => 'excessive_corrections',
                        'severity' => 'high',
                        'description' => 'Número alto de correcciones detectado',
                    ];
                }
            }

            return [
                'success' => true,
                'student_id' => $studentId,
                'recent_anomalies' => $alerts->count(),
                'detected_patterns' => count($anomalies),
                'anomalies' => $anomalies,
                'alerts' => $alerts->map(fn($a) => [
                    'type' => $a->tipo_alerta,
                    'severity' => $a->severidad,
                    'generated_at' => $a->fecha_generacion,
                ])->toArray(),
            ];

        } catch (Exception $e) {
            Log::error("Error en getStudentAnomalies: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtener resumen de anomalías por tipo
     */
    public function getAnomalySummary(): array
    {
        try {
            $summary = [];

            foreach (self::ANOMALY_TYPES as $type => $name) {
                $count = StudentAlert::where('tipo_alerta', $type)->count();

                if ($count > 0) {
                    $summary[] = [
                        'type' => $type,
                        'name' => $name,
                        'count' => $count,
                        'percentage' => round(($count / StudentAlert::count()) * 100, 2),
                    ];
                }
            }

            usort($summary, fn($a, $b) => $b['count'] <=> $a['count']);

            return [
                'success' => true,
                'total_anomalies' => StudentAlert::count(),
                'types_detected' => count($summary),
                'summary' => $summary,
            ];

        } catch (Exception $e) {
            Log::error("Error en getAnomalySummary: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }
}
