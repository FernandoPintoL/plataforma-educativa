<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AgentSynthesisService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

/**
 * AgentController - API endpoints for Agent Service
 *
 * Provides RESTful endpoints for:
 * - Synthesis of ML discoveries
 * - Reasoning explanation
 * - Intervention strategy generation
 * - Service health checks
 */
class AgentController extends Controller
{
    protected AgentSynthesisService $agentService;

    public function __construct(AgentSynthesisService $agentService)
    {
        $this->agentService = $agentService;
    }

    /**
     * Synthesize discoveries for a student
     *
     * POST /api/agent/synthesize/{studentId}
     *
     * Request body (optional):
     * {
     *   "discoveries": {...},
     *   "predictions": {...},
     *   "context": "unified_learning_pipeline"
     * }
     *
     * This endpoint uses the integrated analysis method which:
     * 1. Fetches ML predictions and discoveries
     * 2. Synthesizes with LLM (Groq)
     * 3. Generates intervention strategies
     * 4. Has fallback to local synthesis
     */
    public function synthesize(Request $request, int $studentId): JsonResponse
    {
        try {
            Log::info("Agent synthesis requested for student {$studentId}");

            // Call the new integrated analysis method
            // This handles everything: ML data fetching, LLM synthesis, and fallback
            $result = $this->agentService->getIntegratedStudentAnalysis($studentId);

            if (!($result['success'] ?? false)) {
                Log::warning("Integrated analysis failed for student {$studentId}");
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Analysis failed',
                ], 500);
            }

            // Return the synthesis in the expected format for the frontend
            // The Vue component expects: synthesis.synthesis.insights
            $synthesis = $result['synthesis'] ?? [];

            return response()->json([
                'success' => true,
                'synthesis' => [
                    'synthesis' => [
                        'insights' => $synthesis['synthesis']['insights'] ?? $synthesis['insights'] ?? [],
                        'recommendations' => $synthesis['synthesis']['recommendations'] ?? $synthesis['recommendations'] ?? [],
                        'text' => $synthesis['synthesis']['text'] ?? '',
                    ],
                    'reasoning' => $synthesis['reasoning'] ?? [],
                    'confidence' => $synthesis['confidence'] ?? 0,
                ],
                'confidence' => $synthesis['confidence'] ?? 0,
                'reasoning' => $synthesis['reasoning'] ?? [],
                'method' => $result['method'] ?? 'fallback',
            ]);

        } catch (\Exception $e) {
            Log::error("Error in synthesis: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during synthesis',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get reasoning explanation for discoveries
     *
     * GET /api/agent/reasoning/{studentId}
     *
     * Query parameters:
     * - discoveries: JSON string of discoveries
     * - predictions: JSON string of predictions
     */
    public function reasoning(Request $request, int $studentId): JsonResponse
    {
        try {
            Log::info("Agent reasoning requested for student {$studentId}");

            // Parse JSON query parameters
            $discoveries = $request->has('discoveries')
                ? json_decode($request->input('discoveries'), true) ?? []
                : [];

            $predictions = $request->has('predictions')
                ? json_decode($request->input('predictions'), true) ?? []
                : [];

            // Call agent service
            $result = $this->agentService->explainReasoning(
                $studentId,
                $discoveries,
                $predictions
            );

            if (!$result['success'] ?? false) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Reasoning failed',
                ], 500);
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error("Error in reasoning: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while explaining reasoning',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Generate intervention strategy for a student
     *
     * POST /api/agent/intervention/{studentId}
     *
     * Request body:
     * {
     *   "discoveries": {...},
     *   "predictions": {...}
     * }
     */
    public function intervention(Request $request, int $studentId): JsonResponse
    {
        try {
            Log::info("Agent intervention strategy requested for student {$studentId}");

            // Validate input
            $validator = Validator::make($request->all(), [
                'discoveries' => 'sometimes|array',
                'predictions' => 'sometimes|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Call agent service
            $result = $this->agentService->generateInterventionStrategy(
                $studentId,
                $request->input('discoveries', []),
                $request->input('predictions', [])
            );

            if (!$result['success'] ?? false) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'] ?? 'Intervention strategy generation failed',
                ], 500);
            }

            return response()->json($result);

        } catch (\Exception $e) {
            Log::error("Error in intervention generation: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'An error occurred while generating intervention strategy',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Check Agent Service health
     *
     * GET /api/agent/health
     */
    public function health(): JsonResponse
    {
        try {
            Log::info("Health check requested");

            $healthStatus = $this->agentService->checkAgentHealth();

            return response()->json($healthStatus);

        } catch (\Exception $e) {
            Log::error("Error in health check: {$e->getMessage()}");
            return response()->json([
                'status' => 'error',
                'message' => 'Health check failed',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Get Agent Service information
     *
     * GET /api/agent/info
     */
    public function info(): JsonResponse
    {
        try {
            Log::info("Service info requested");

            $agentInfo = $this->agentService->getAgentInfo();

            return response()->json($agentInfo);

        } catch (\Exception $e) {
            Log::error("Error getting agent info: {$e->getMessage()}");
            return response()->json([
                'status' => 'unavailable',
                'message' => 'Could not retrieve agent information',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Synthesize and provide complete analysis
     *
     * POST /api/agent/complete-analysis/{studentId}
     *
     * Complete endpoint that returns synthesis, reasoning, and strategy
     */
    public function completeAnalysis(Request $request, int $studentId): JsonResponse
    {
        try {
            Log::info("Complete analysis requested for student {$studentId}");

            // Validate input
            $validator = Validator::make($request->all(), [
                'discoveries' => 'sometimes|array',
                'predictions' => 'sometimes|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $discoveries = $request->input('discoveries', []);
            $predictions = $request->input('predictions', []);

            // Get synthesis
            $synthesis = $this->agentService->synthesizeDiscoveries(
                $studentId,
                $discoveries,
                $predictions
            );

            // Get reasoning
            $reasoning = $this->agentService->explainReasoning(
                $studentId,
                $discoveries,
                $predictions
            );

            // Get intervention strategy
            $intervention = $this->agentService->generateInterventionStrategy(
                $studentId,
                $discoveries,
                $predictions
            );

            // Combine results
            $analysis = [
                'success' => true,
                'student_id' => $studentId,
                'synthesis' => $synthesis,
                'reasoning' => $reasoning,
                'intervention' => $intervention,
                'timestamp' => now()->toIso8601String(),
            ];

            return response()->json($analysis);

        } catch (\Exception $e) {
            Log::error("Error in complete analysis: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during complete analysis',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Test Agent Service connectivity
     *
     * GET /api/agent/test
     */
    public function test(): JsonResponse
    {
        try {
            Log::info("Agent service test requested");

            $testData = [
                'student_id' => 1,
                'discoveries' => [
                    'cluster_analysis' => [
                        'data' => [
                            'distribution' => [
                                ['cluster_id' => 0, 'count' => 10],
                                ['cluster_id' => 1, 'count' => 15],
                            ],
                        ],
                    ],
                ],
                'predictions' => [
                    'predictions' => [],
                ],
            ];

            // Test synthesis
            $result = $this->agentService->synthesizeDiscoveries(
                $testData['student_id'],
                $testData['discoveries'],
                $testData['predictions']
            );

            return response()->json([
                'success' => true,
                'message' => 'Test completed',
                'test_result' => $result,
            ]);

        } catch (\Exception $e) {
            Log::error("Error in agent test: {$e->getMessage()}");
            return response()->json([
                'success' => false,
                'message' => 'Test failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
