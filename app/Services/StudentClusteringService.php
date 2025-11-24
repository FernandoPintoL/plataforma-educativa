<?php

namespace App\Services;

use App\Models\StudentCluster;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Http;
use Exception;

/**
 * StudentClusteringService
 *
 * Servicio para análisis de clustering K-Means de estudiantes.
 * Integra con el modelo no supervisado de Python para descubrir grupos homogéneos.
 *
 * Funcionalidades:
 * - Clustering de estudiantes basado en características académicas
 * - Análisis de perfiles de clusters
 * - Recomendaciones basadas en cluster
 * - Detección de estudiantes anómalos
 */
class StudentClusteringService
{
    private const SUPERVISED_ML_API_URL = 'http://localhost:8001';
    private const UNSUPERVISED_ML_API_URL = 'http://localhost:8002';
    private const CLUSTERING_FEATURES = [
        'promedio_calificaciones',
        'desviacion_notas',
        'asistencia_promedio',
        'tareas_completadas_porcentaje',
        'participacion_promedio',
    ];

    /**
     * Ejecutar clustering de todos los estudiantes
     */
    public function clusterStudents(int $nClusters = 3, ?int $limit = null): array
    {
        try {
            Log::info("Iniciando clustering de estudiantes (clusters: {$nClusters})");

            // 1. Extraer datos de estudiantes
            $studentsData = $this->extractStudentFeatures($limit);

            if (empty($studentsData['data'])) {
                Log::warning('No hay datos de estudiantes disponibles para clustering');
                return ['success' => false, 'message' => 'No data available'];
            }

            // 2. Ejecutar K-Means en Python (vía API local)
            $clusterResults = $this->performKMeansClustering(
                $studentsData['data'],
                $studentsData['student_ids'],
                $nClusters
            );

            if (!$clusterResults['success']) {
                return $clusterResults;
            }

            // 3. Guardar resultados en la base de datos
            $saved = $this->saveClusterAssignments($clusterResults['data']);

            Log::info("Clustering completado. Estudiantes procesados: " . count($saved));

            return [
                'success' => true,
                'message' => 'Clustering completed successfully',
                'num_clusters' => $nClusters,
                'students_clustered' => count($saved),
                'cluster_distribution' => StudentCluster::getDistribucionClusters(),
            ];

        } catch (Exception $e) {
            Log::error("Error en clustering: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Extraer características de estudiantes desde la base de datos
     */
    private function extractStudentFeatures(?int $limit = null): array
    {
        try {
            $query = DB::table('users')
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'estudiante');
                })
                ->select(['id', 'name'])
                ->selectRaw('
                    COALESCE(AVG(CAST(c.calificacion AS DECIMAL(5,2))), 0) as promedio_calificaciones,
                    COALESCE(STDDEV(CAST(c.calificacion AS DECIMAL(5,2))), 0) as desviacion_notas,
                    COALESCE(COUNT(DISTINCT a.id) * 100.0 / 30, 0) as asistencia_promedio,
                    COALESCE(COUNT(DISTINCT t.id) * 100.0 / (SELECT COUNT(*) FROM trabajos), 0) as tareas_completadas_porcentaje,
                    COALESCE(AVG(CAST(rtm.progreso_estimado AS DECIMAL(5,2))), 0) as participacion_promedio
                ')
                ->leftJoin('calificaciones as c', 'users.id', '=', 'c.estudiante_id')
                ->leftJoin('asistencias as a', 'users.id', '=', 'a.estudiante_id')
                ->leftJoin('trabajos as t', 'users.id', '=', 't.estudiante_id')
                ->leftJoin('real_time_monitoring as rtm', 'users.id', '=', 'rtm.estudiante_id')
                ->groupBy('users.id', 'users.name');

            if ($limit) {
                $query->limit($limit);
            }

            $students = $query->get();

            if ($students->isEmpty()) {
                return ['data' => [], 'student_ids' => []];
            }

            // Convertir a array numérico
            $data = [];
            $studentIds = [];

            foreach ($students as $student) {
                $data[] = [
                    floatval($student->promedio_calificaciones),
                    floatval($student->desviacion_notas),
                    floatval($student->asistencia_promedio),
                    floatval($student->tareas_completadas_porcentaje),
                    floatval($student->participacion_promedio),
                ];
                $studentIds[] = $student->id;
            }

            Log::info("Características extraídas para " . count($studentIds) . " estudiantes");

            return ['data' => $data, 'student_ids' => $studentIds];

        } catch (Exception $e) {
            Log::error("Error extrayendo features: {$e->getMessage()}");
            return ['data' => [], 'student_ids' => []];
        }
    }

    /**
     * Ejecutar K-Means clustering (llamando a API FastAPI)
     */
    private function performKMeansClustering(array $data, array $studentIds, int $nClusters): array
    {
        try {
            Log::info("Llamando a API de ML no supervisada para clustering");

            // Llamar al servicio FastAPI de ML no supervisada (puerto 8002)
            try {
                $response = Http::timeout(30)
                    ->post(self::UNSUPERVISED_ML_API_URL . '/clustering/predict', [
                        'data' => $data,
                        'n_clusters' => $nClusters,
                    ]);

                if (!$response->successful()) {
                    Log::error("API retornó status no exitoso: {$response->status()}");
                    return ['success' => false, 'message' => 'API request failed'];
                }

                $result = $response->json();

                if (!isset($result['labels'])) {
                    Log::error("API retornó respuesta sin labels");
                    return ['success' => false, 'message' => 'Invalid API response'];
                }

                // Procesar respuesta de API
                $clusterResults = $this->processClusteringResponse(
                    $result,
                    $studentIds,
                    $nClusters
                );

                return [
                    'success' => true,
                    'data' => $clusterResults,
                    'api_metrics' => [
                        'silhouette_score' => $result['silhouette_score'] ?? null,
                    ],
                ];

            } catch (Exception $e) {
                Log::error("Error llamando a API de unsupervised ML: {$e->getMessage()}");
                return ['success' => false, 'message' => "API call failed: {$e->getMessage()}"];
            }

        } catch (Exception $e) {
            Log::error("Error en K-Means clustering: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Procesar respuesta de API de clustering
     */
    private function processClusteringResponse(array $apiResponse, array $studentIds, int $nClusters): array
    {
        $results = [];
        $labels = $apiResponse['labels'] ?? [];

        // Obtener memberships si están disponibles
        $memberships = $apiResponse['memberships'] ?? null;

        foreach ($studentIds as $idx => $studentId) {
            $clusterLabel = $labels[$idx] ?? 0;

            // Construir probabilidades de pertenencia
            $membership = [];
            if ($memberships && isset($memberships[$idx])) {
                $membership = $memberships[$idx];
            } else {
                // Probabilidades por defecto (distribuidas)
                for ($i = 0; $i < $nClusters; $i++) {
                    $membership[$i] = $i == $clusterLabel ? 0.8 : (0.2 / ($nClusters - 1));
                }
            }

            $results[] = [
                'student_id' => $studentId,
                'cluster_id' => intval($clusterLabel),
                'distance_to_center' => 1.5, // Valor por defecto
                'membership_probabilities' => $membership,
            ];
        }

        return $results;
    }


    /**
     * Guardar asignaciones de clusters en la base de datos
     */
    private function saveClusterAssignments(array $clusterData): array
    {
        $saved = [];

        try {
            foreach ($clusterData as $cluster) {
                $record = StudentCluster::updateOrCreate(
                    ['estudiante_id' => $cluster['student_id']],
                    [
                        'cluster_id' => $cluster['cluster_id'],
                        'cluster_distance' => $cluster['distance_to_center'] ?? null,
                        'membership_probabilities' => $cluster['membership_probabilities'] ?? [],
                        'fecha_asignacion' => now(),
                        'modelo_version' => 'v1.0',
                    ]
                );

                $saved[] = $record;
            }

            Log::info("Clustering assignments saved: " . count($saved));
            return $saved;

        } catch (Exception $e) {
            Log::error("Error guardando assignments: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Obtener análisis de un cluster específico
     */
    public function getClusterAnalysis(int $clusterId): array
    {
        try {
            $students = StudentCluster::where('cluster_id', $clusterId)
                ->with('estudiante')
                ->get();

            if ($students->isEmpty()) {
                return ['success' => false, 'message' => 'Cluster not found'];
            }

            // Calcular estadísticas
            $avgDistance = $students->avg('cluster_distance');
            $avgProbability = 0;

            foreach ($students as $student) {
                if ($probs = $student->membership_probabilities) {
                    $avgProbability += $probs[$clusterId] ?? 0;
                }
            }

            $avgProbability /= max($students->count(), 1);

            return [
                'success' => true,
                'cluster_id' => $clusterId,
                'num_students' => $students->count(),
                'average_distance' => round($avgDistance, 3),
                'average_membership_probability' => round($avgProbability, 3),
                'students' => $students->map(fn($s) => $s->obtenerInformacion())->toArray(),
            ];

        } catch (Exception $e) {
            Log::error("Error en getClusterAnalysis: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtener resumen de todos los clusters
     */
    public function getClustersSummary(): array
    {
        try {
            $distribution = StudentCluster::getDistribucionClusters();
            $total = StudentCluster::count();

            $summary = [
                'success' => true,
                'total_students' => $total,
                'num_clusters' => count($distribution),
                'distribution' => $distribution,
                'last_updated' => StudentCluster::latest('fecha_asignacion')->first()?->fecha_asignacion?->format('Y-m-d H:i:s'),
            ];

            // Agregar recomendaciones por cluster
            foreach ($distribution as $cluster) {
                $sample = StudentCluster::where('cluster_id', $cluster['cluster_id'])->first();
                if ($sample) {
                    $summary["cluster_{$cluster['cluster_id']}_description"] = $sample->getDescripcionCluster();
                    $summary["cluster_{$cluster['cluster_id']}_recommendations"] = $sample->getRecomendaciones();
                }
            }

            return $summary;

        } catch (Exception $e) {
            Log::error("Error en getClustersSummary: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Identificar estudiantes anómalos (lejanos del centro del cluster)
     */
    public function getAnomalousStudents(float $distanceThreshold = 2.0): array
    {
        try {
            $anomalous = StudentCluster::where('cluster_distance', '>', $distanceThreshold)
                ->with('estudiante')
                ->orderByDesc('cluster_distance')
                ->get();

            return [
                'success' => true,
                'threshold' => $distanceThreshold,
                'count' => $anomalous->count(),
                'students' => $anomalous->map(fn($s) => [
                    'id' => $s->id,
                    'student_name' => $s->estudiante?->name,
                    'cluster_id' => $s->cluster_id,
                    'distance_to_center' => round($s->cluster_distance, 3),
                    'is_anomalous' => true,
                ])->toArray(),
            ];

        } catch (Exception $e) {
            Log::error("Error en getAnomalousStudents: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Obtener estudiantes más similares a uno dado
     */
    public function getSimilarStudents(int $studentId, int $limit = 5): array
    {
        try {
            $student = StudentCluster::where('estudiante_id', $studentId)->first();

            if (!$student) {
                return ['success' => false, 'message' => 'Student not found'];
            }

            $similar = StudentCluster::where('cluster_id', $student->cluster_id)
                ->where('estudiante_id', '!=', $studentId)
                ->orderBy('cluster_distance')
                ->limit($limit)
                ->with('estudiante')
                ->get();

            return [
                'success' => true,
                'reference_student_id' => $studentId,
                'cluster_id' => $student->cluster_id,
                'similar_students' => $similar->map(fn($s) => [
                    'student_id' => $s->estudiante_id,
                    'name' => $s->estudiante?->name,
                    'distance_to_center' => round($s->cluster_distance, 3),
                    'membership_probability' => round($s->getAssignedClusterProbability(), 3),
                ])->toArray(),
            ];

        } catch (Exception $e) {
            Log::error("Error en getSimilarStudents: {$e->getMessage()}");
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Generar probabilidades aleatorias para testing
     */
    private function generateRandomProbabilities(int $nClusters): array
    {
        $probs = [];
        $total = 0;

        for ($i = 0; $i < $nClusters; $i++) {
            $probs[$i] = rand(10, 100) / 100;
            $total += $probs[$i];
        }

        // Normalizar
        foreach ($probs as $i => $prob) {
            $probs[$i] = round($prob / $total, 3);
        }

        return $probs;
    }
}
