<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\UnifiedLearningOrchestrator;
use App\Services\StudentClusteringService;
use App\Services\ConceptTopicModelingService;
use App\Services\AnomalyDetectionService;
use App\Services\CorrelationAnalysisService;
use Illuminate\Http\Request;

/**
 * DiscoveryOrchestrationController
 *
 * API endpoints para el pipeline unificado de aprendizaje.
 * Integra descubrimiento no supervisado, predicción supervisada, síntesis de Agent y acciones adaptativas.
 */
class DiscoveryOrchestrationController extends Controller
{
    private UnifiedLearningOrchestrator $orchestrator;
    private StudentClusteringService $clustering;
    private ConceptTopicModelingService $topicModeling;
    private AnomalyDetectionService $anomalyDetection;
    private CorrelationAnalysisService $correlation;

    public function __construct(
        UnifiedLearningOrchestrator $orchestrator,
        StudentClusteringService $clustering,
        ConceptTopicModelingService $topicModeling,
        AnomalyDetectionService $anomalyDetection,
        CorrelationAnalysisService $correlation
    ) {
        $this->orchestrator = $orchestrator;
        $this->clustering = $clustering;
        $this->topicModeling = $topicModeling;
        $this->anomalyDetection = $anomalyDetection;
        $this->correlation = $correlation;
    }

    /**
     * POST /api/discovery/unified-pipeline/{studentId}
     * Ejecutar pipeline unificado completo para un estudiante
     */
    public function runUnifiedPipeline($studentId)
    {
        $result = $this->orchestrator->runFullLearningPipeline($studentId);
        return response()->json($result);
    }

    /**
     * POST /api/discovery/clustering/run
     * Ejecutar clustering de estudiantes
     */
    public function runClustering(Request $request)
    {
        $validated = $request->validate([
            'n_clusters' => 'nullable|integer|min:2|max:10',
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->clustering->clusterStudents(
            $validated['n_clusters'] ?? 3,
            $validated['limit'] ?? null
        );

        return response()->json($result);
    }

    /**
     * GET /api/discovery/clustering/summary
     * Obtener resumen de clustering
     */
    public function getClusteringSummary()
    {
        $result = $this->clustering->getClustersSummary();
        return response()->json($result);
    }

    /**
     * POST /api/discovery/topics/analyze
     * Analizar temas conceptuales
     */
    public function analyzeTopics(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->topicModeling->analyzeConceptTopics($validated['limit'] ?? null);
        return response()->json($result);
    }

    /**
     * GET /api/discovery/topics/student/{studentId}
     * Obtener temas de un estudiante
     */
    public function getStudentTopics($studentId)
    {
        $result = $this->topicModeling->getStudentTopics($studentId);
        return response()->json($result);
    }

    /**
     * GET /api/discovery/topics/distribution
     * Obtener distribución de temas en la población
     */
    public function getTopicsDistribution()
    {
        $result = $this->topicModeling->getTopicDistribution();
        return response()->json($result);
    }

    /**
     * POST /api/discovery/anomalies/detect
     * Detectar anomalías en toda la población
     */
    public function detectAnomalies(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->anomalyDetection->detectAllAnomalies($validated['limit'] ?? null);
        return response()->json($result);
    }

    /**
     * GET /api/discovery/anomalies/student/{studentId}
     * Obtener anomalías de un estudiante
     */
    public function getStudentAnomalies($studentId)
    {
        $result = $this->anomalyDetection->getStudentAnomalies($studentId);
        return response()->json($result);
    }

    /**
     * GET /api/discovery/anomalies/summary
     * Obtener resumen de anomalías
     */
    public function getAnomaliesSummary()
    {
        $result = $this->anomalyDetection->getAnomalySummary();
        return response()->json($result);
    }

    /**
     * POST /api/discovery/correlations/analyze
     * Analizar correlaciones académicas
     */
    public function analyzeCorrelations(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->correlation->analyzeAcademicCorrelations($validated['limit'] ?? null);
        return response()->json($result);
    }

    /**
     * POST /api/discovery/correlations/activity-performance
     * Analizar relación actividad-desempeño
     */
    public function analyzeActivityPerformance(Request $request)
    {
        $validated = $request->validate([
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->correlation->analyzeActivityPerformanceRelationship($validated['limit'] ?? null);
        return response()->json($result);
    }

    /**
     * GET /api/discovery/correlations/predictive-factors
     * Obtener factores predictivos
     */
    public function getPredictiveFactors()
    {
        $result = $this->correlation->findPredictiveFactors();
        return response()->json($result);
    }

    /**
     * GET /api/discovery/health
     * Obtener estado del sistema de descubrimiento
     */
    public function getHealthStatus()
    {
        $result = $this->orchestrator->getPlatformHealthStatus();
        return response()->json($result);
    }

    /**
     * GET /api/discovery/insights/{studentId}
     * Obtener insights integrados para un estudiante
     */
    public function getIntegratedInsights($studentId)
    {
        $result = $this->orchestrator->runFullLearningPipeline($studentId);

        if ($result['success'] && isset($result['integrated_insights'])) {
            return response()->json([
                'success' => true,
                'student_id' => $studentId,
                'insights' => $result['integrated_insights'],
            ]);
        }

        return response()->json($result);
    }
}
