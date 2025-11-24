<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\StudentClusteringService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * ClusteringController
 *
 * API endpoints para análisis de clustering no supervisado
 */
class ClusteringController extends Controller
{
    private StudentClusteringService $clusteringService;

    public function __construct(StudentClusteringService $clusteringService)
    {
        $this->clusteringService = $clusteringService;
    }

    /**
     * POST /api/clustering/run
     * Ejecutar clustering de todos los estudiantes
     */
    public function runClustering(Request $request)
    {
        $validated = $request->validate([
            'n_clusters' => 'nullable|integer|min:2|max:10',
            'limit' => 'nullable|integer|min:1',
        ]);

        $result = $this->clusteringService->clusterStudents(
            $validated['n_clusters'] ?? 3,
            $validated['limit'] ?? null
        );

        return response()->json($result);
    }

    /**
     * GET /api/clustering/summary
     * Obtener resumen de clusters
     */
    public function getSummary()
    {
        $result = $this->clusteringService->getClustersSummary();
        return response()->json($result);
    }

    /**
     * GET /api/clustering/cluster/{clusterId}
     * Obtener análisis de un cluster específico
     */
    public function getClusterAnalysis($clusterId)
    {
        $result = $this->clusteringService->getClusterAnalysis($clusterId);
        return response()->json($result);
    }

    /**
     * GET /api/clustering/anomalous
     * Obtener estudiantes anómalos
     */
    public function getAnomalousStudents(Request $request)
    {
        $threshold = $request->query('threshold', 2.0);
        $result = $this->clusteringService->getAnomalousStudents(floatval($threshold));
        return response()->json($result);
    }

    /**
     * GET /api/clustering/similar/{studentId}
     * Obtener estudiantes similares a uno dado
     */
    public function getSimilarStudents($studentId)
    {
        $result = $this->clusteringService->getSimilarStudents($studentId, 5);
        return response()->json($result);
    }
}
