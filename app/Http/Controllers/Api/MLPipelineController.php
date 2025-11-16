<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MLPipelineService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MLPipelineController extends Controller
{
    private MLPipelineService $pipelineService;

    public function __construct(MLPipelineService $pipelineService)
    {
        $this->pipelineService = $pipelineService;
    }

    /**
     * Ejecutar pipeline ML completo
     */
    public function execute(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'limit' => 'integer|min:5|max:500|default:50',
            'force' => 'boolean|default:false',
        ]);

        $result = $this->pipelineService->executePipeline(
            $validated['limit'],
            $validated['force']
        );

        $statusCode = $result['success'] ? 200 : 422;

        return response()->json([
            'success' => $result['success'],
            'message' => $result['success']
                ? 'Pipeline ML ejecutado exitosamente'
                : 'Error en ejecución del pipeline',
            'data' => [
                'steps' => $result['steps'],
                'statistics' => $result['statistics'] ?? null,
                'errors' => $result['errors'] ?? [],
            ],
        ], $statusCode);
    }

    /**
     * Obtener estado del pipeline
     */
    public function status(): JsonResponse
    {
        $status = $this->pipelineService->getStatus();

        return response()->json([
            'success' => true,
            'data' => $status,
            'message' => 'Estado del pipeline ML obtenido exitosamente',
        ]);
    }

    /**
     * Obtener estadísticas detalladas
     */
    public function statistics(): JsonResponse
    {
        $status = $this->pipelineService->getStatus();

        return response()->json([
            'success' => true,
            'data' => [
                'predicciones_riesgo' => $status['predicciones_riesgo'],
                'recomendaciones_carrera' => $status['recomendaciones_carrera'],
                'tendencias' => $status['tendencias'],
                'timestamp' => $status['timestamp'],
            ],
        ]);
    }

    /**
     * Obtener logs del pipeline
     */
    public function logs(Request $request): JsonResponse
    {
        $lines = $request->input('lines', 100);
        $logFile = storage_path('logs/laravel.log');

        if (!file_exists($logFile)) {
            return response()->json([
                'success' => false,
                'message' => 'Archivo de logs no encontrado',
            ], 404);
        }

        $logs = array_slice(
            file($logFile),
            -$lines
        );

        // Filtrar logs de ML
        $mlLogs = array_filter($logs, function ($line) {
            return strpos($line, 'ML') !== false || strpos($line, 'Pipeline') !== false;
        });

        return response()->json([
            'success' => true,
            'data' => [
                'total_lines' => count($logs),
                'ml_logs' => array_values($mlLogs),
            ],
        ]);
    }
}
