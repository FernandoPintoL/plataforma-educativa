<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RiasecPsychometricAnalysisService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RiasecPsychometricAnalysisController extends Controller
{
    protected RiasecPsychometricAnalysisService $analysisService;

    public function __construct(RiasecPsychometricAnalysisService $analysisService)
    {
        $this->analysisService = $analysisService;
        $this->middleware('auth:sanctum');
        $this->middleware('can:view-psychometric-reports');
    }

    /**
     * Get Cronbach's Alpha for all dimensions in a test
     *
     * GET /api/psychometric/test/{test_id}/cronbachs-alphas
     */
    public function getCronbachsAlphas($test_id): JsonResponse
    {
        try {
            $data = $this->analysisService->calculateAllDimensionAlphas($test_id);
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get Cronbach's Alpha for a specific dimension
     *
     * GET /api/psychometric/category/{category_id}/cronbachs-alpha
     */
    public function getCronbachsAlpha($category_id): JsonResponse
    {
        try {
            $data = $this->analysisService->calculateCronbachAlpha($category_id);

            if (isset($data['error'])) {
                return response()->json([
                    'success' => false,
                    'error' => $data['error'],
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get correlation matrix for all dimensions
     *
     * GET /api/psychometric/test/{test_id}/correlation-matrix
     */
    public function getCorrelationMatrix($test_id): JsonResponse
    {
        try {
            $data = $this->analysisService->calculateCorrelationMatrix($test_id);
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get correlation between two specific dimensions
     *
     * GET /api/psychometric/correlation/{cat1_id}/{cat2_id}
     */
    public function getCorrelation($cat1_id, $cat2_id): JsonResponse
    {
        try {
            $data = $this->analysisService->calculateDimensionCorrelation($cat1_id, $cat2_id);

            if (isset($data['error'])) {
                return response()->json([
                    'success' => false,
                    'error' => $data['error'],
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get descriptive statistics for a dimension
     *
     * GET /api/psychometric/category/{category_id}/descriptives
     */
    public function getDimensionDescriptives($category_id): JsonResponse
    {
        try {
            $data = $this->analysisService->getDimensionDescriptives($category_id);

            if (isset($data['error'])) {
                return response()->json([
                    'success' => false,
                    'error' => $data['error'],
                ], 400);
            }

            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Get full psychometric report for a test
     *
     * GET /api/psychometric/test/{test_id}/full-report
     */
    public function getFullReport($test_id): JsonResponse
    {
        try {
            $data = $this->analysisService->getFullPsychometricReport($test_id);
            return response()->json([
                'success' => true,
                'data' => $data,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => $e->getMessage(),
            ], 400);
        }
    }
}
