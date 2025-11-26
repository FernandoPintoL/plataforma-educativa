<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Services\AgentSynthesisService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * MLAnalysisController
 *
 * Controlador API para análisis de ML integrado
 *
 * Endpoints:
 * - GET  /api/student/{student_id}/analysis - Análisis completo integrado
 * - GET  /api/student/{student_id}/predictions - Solo predicciones (supervisada)
 * - GET  /api/student/{student_id}/clustering - Solo clustering (no supervisada)
 * - POST /api/ml-health - Verificar salud del agent service
 */
class MLAnalysisController extends Controller
{
    protected AgentSynthesisService $agentService;

    public function __construct(AgentSynthesisService $agentService)
    {
        $this->agentService = $agentService;
    }

    /**
     * Obtener análisis completo integrado del estudiante
     *
     * GET /api/student/{student_id}/analysis
     *
     * Retorna:
     * - ml_data: Predicciones + Clustering
     * - synthesis: Síntesis LLM
     * - intervention_strategy: Estrategia personalizada
     *
     * @param  int  $studentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getIntegratedAnalysis($studentId)
    {
        try {
            // Verificar que el estudiante existe
            $student = User::where('id', $studentId)
                ->where('tipo_usuario', 'estudiante')
                ->firstOrFail();

            Log::info("Solicitando análisis integrado para estudiante {$studentId}");

            // Obtener análisis del agente
            $analysis = $this->agentService->getIntegratedStudentAnalysis($studentId);

            return response()->json([
                'success' => true,
                'student_id' => $studentId,
                'student_name' => $student->name,
                'data' => $analysis,
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            Log::warning("Estudiante {$studentId} no encontrado");
            return response()->json([
                'success' => false,
                'message' => "Estudiante {$studentId} no encontrado",
                'error' => 'student_not_found',
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error en análisis integrado: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error procesando análisis integrado',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener solo predicciones (supervisada)
     *
     * GET /api/student/{student_id}/predictions
     *
     * @param  int  $studentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPredictions($studentId)
    {
        try {
            $student = User::where('id', $studentId)
                ->where('tipo_usuario', 'estudiante')
                ->firstOrFail();

            Log::info("Obteniendo predicciones para estudiante {$studentId}");

            // Obtener análisis completo pero retornar solo predicciones
            $analysis = $this->agentService->getIntegratedStudentAnalysis($studentId);

            return response()->json([
                'success' => true,
                'student_id' => $studentId,
                'predictions' => $analysis['ml_data']['predictions'] ?? [],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => "Estudiante {$studentId} no encontrado",
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo predicciones: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error procesando predicciones',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener solo clustering (no supervisada)
     *
     * GET /api/student/{student_id}/clustering
     *
     * @param  int  $studentId
     * @return \Illuminate\Http\JsonResponse
     */
    public function getClustering($studentId)
    {
        try {
            $student = User::where('id', $studentId)
                ->where('tipo_usuario', 'estudiante')
                ->firstOrFail();

            Log::info("Obteniendo clustering para estudiante {$studentId}");

            $analysis = $this->agentService->getIntegratedStudentAnalysis($studentId);

            return response()->json([
                'success' => true,
                'student_id' => $studentId,
                'clustering' => $analysis['ml_data']['discoveries'] ?? [],
            ], 200);

        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => "Estudiante {$studentId} no encontrado",
            ], 404);

        } catch (\Exception $e) {
            Log::error("Error obteniendo clustering: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error procesando clustering',
            ], 500);
        }
    }

    /**
     * Verificar salud del Agent Service
     *
     * POST /api/ml-health
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkMLHealth()
    {
        try {
            Log::info("Verificando salud del Agent Service");

            $health = $this->agentService->checkAgentHealth();

            return response()->json([
                'success' => $health['status'] === 'healthy',
                'agent_service' => $health,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error verificando salud: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error verificando salud del Agent Service',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Obtener información del Agent Service
     *
     * GET /api/ml-info
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMLInfo()
    {
        try {
            Log::info("Obteniendo información del Agent Service");

            $info = $this->agentService->getAgentInfo();

            return response()->json([
                'success' => true,
                'agent_info' => $info,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Exception $e) {
            Log::error("Error obteniendo info: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error obteniendo información del Agent Service',
            ], 500);
        }
    }

    /**
     * Obtener análisis para múltiples estudiantes
     *
     * POST /api/batch-analysis
     *
     * Body:
     * {
     *   "student_ids": [1, 2, 3, ...]
     * }
     *
     * @param  Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function batchAnalysis(Request $request)
    {
        try {
            $request->validate([
                'student_ids' => 'required|array|min:1|max:50',
                'student_ids.*' => 'integer|exists:users,id',
            ]);

            Log::info("Procesando análisis en lote para " . count($request->student_ids) . " estudiantes");

            $results = [];

            foreach ($request->student_ids as $studentId) {
                $analysis = $this->agentService->getIntegratedStudentAnalysis($studentId);
                $results[] = [
                    'student_id' => $studentId,
                    'analysis' => $analysis,
                ];
            }

            return response()->json([
                'success' => true,
                'total' => count($results),
                'results' => $results,
                'timestamp' => now()->toIso8601String(),
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validación fallida',
                'errors' => $e->errors(),
            ], 422);

        } catch (\Exception $e) {
            Log::error("Error en análisis en lote: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Error procesando análisis en lote',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
