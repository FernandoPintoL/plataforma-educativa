<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TestVocacional;
use Illuminate\Http\JsonResponse;

class TestVocacionalApiController extends Controller
{
    /**
     * GET /api/tests-vocacionales
     * 
     * Return list of available vocational tests as JSON
     */
    public function index(): JsonResponse
    {
        try {
            $tests = TestVocacional::where('activo', true)
                ->select('id', 'nombre', 'descripcion', 'duracion_estimada', 'activo', 'created_at')
                ->get();

            return response()->json([
                'success' => true,
                'data' => $tests,
                'count' => $tests->count(),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener tests vocacionales',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
