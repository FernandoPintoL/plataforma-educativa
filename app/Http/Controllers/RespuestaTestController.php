<?php

namespace App\Http\Controllers;

use App\Models\TestVocacional;
use App\Models\ResultadoTestVocacional;
use App\Models\PerfilVocacional;
use App\Models\User;
use Illuminate\Http\Request;
use Carbon\Carbon;

class RespuestaTestController extends Controller
{
    /**
     * Autorizar acceso
     */
    private function autorizar(TestVocacional $test)
    {
        $user = auth()->user();

        if (!$user->hasRole(['profesor', 'director'])) {
            abort(403, 'No tienes permiso para ver respuestas');
        }

        if ($user->hasRole('profesor') && $test->created_by !== $user->id && !$user->hasRole('director')) {
            abort(403, 'Solo puedes ver respuestas de tests que creaste');
        }
    }

    /**
     * Get all responses for a test with filters
     * GET /tests-vocacionales/{testId}/respuestas
     */
    public function index(Request $request, TestVocacional $test)
    {
        $this->autorizar($test);

        // Filtros
        $filters = $request->validate([
            'estudiante' => 'nullable|integer|exists:users,id',
            'estado' => 'nullable|in:completado,pendiente',
            'fecha_desde' => 'nullable|date',
            'fecha_hasta' => 'nullable|date',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:10|max:100',
        ]);

        $perPage = $filters['per_page'] ?? 25;

        $query = $test->resultados()
            ->with(['estudiante', 'perfilVocacional']);

        // Filter by student
        if (!empty($filters['estudiante'])) {
            $query->where('estudiante_id', $filters['estudiante']);
        }

        // Filter by status
        if (!empty($filters['estado'])) {
            if ($filters['estado'] === 'completado') {
                $query->whereNotNull('fecha_completacion');
            } else {
                $query->whereNull('fecha_completacion');
            }
        }

        // Filter by date range
        if (!empty($filters['fecha_desde'])) {
            $query->whereDate('fecha_completacion', '>=', $filters['fecha_desde']);
        }
        if (!empty($filters['fecha_hasta'])) {
            $query->whereDate('fecha_completacion', '<=', $filters['fecha_hasta']);
        }

        // Paginate
        $respuestas = $query->orderBy('fecha_completacion', 'desc')
            ->paginate($perPage);

        // Transform response
        $respuestas->getCollection()->transform(function ($resultado) {
            return [
                'id' => $resultado->id,
                'estudiante' => [
                    'id' => $resultado->estudiante->id,
                    'nombre' => $resultado->estudiante->name,
                    'email' => $resultado->estudiante->email,
                ],
                'fecha_completacion' => $resultado->fecha_completacion?->format('Y-m-d H:i:s'),
                'estado' => $resultado->fecha_completacion ? 'completado' : 'pendiente',
                'preguntas_respondidas' => count($resultado->getRespuestasArray()),
                'total_preguntas' => $resultado->test->getTotalPreguntas(),
                'tasa_completacion' => $resultado->fecha_completacion
                    ? round((count($resultado->getRespuestasArray()) / $resultado->test->getTotalPreguntas()) * 100)
                    : 0,
                'perfil_vocacional' => $resultado->perfilVocacional ? [
                    'carrera_predicha_ml' => $resultado->perfilVocacional->carrera_predicha_ml,
                    'confianza_prediccion' => $resultado->perfilVocacional->confianza_prediccion,
                    'cluster_aptitud' => $resultado->perfilVocacional->cluster_aptitud,
                ] : null,
            ];
        });

        return response()->json([
            'success' => true,
            'respuestas' => $respuestas->items(),
            'pagination' => [
                'total' => $respuestas->total(),
                'per_page' => $respuestas->perPage(),
                'current_page' => $respuestas->currentPage(),
                'last_page' => $respuestas->lastPage(),
                'from' => $respuestas->firstItem(),
                'to' => $respuestas->lastItem(),
            ],
        ]);
    }

    /**
     * Get detailed response for a specific student
     * GET /tests-vocacionales/{testId}/respuestas/{resultadoId}
     */
    public function show(TestVocacional $test, ResultadoTestVocacional $resultado)
    {
        $this->autorizar($test);

        // Verify resultado belongs to this test
        if ($resultado->test_vocacional_id !== $test->id) {
            abort(404, 'Respuesta no encontrada');
        }

        $resultado->load(['estudiante', 'perfilVocacional', 'test.categorias.preguntas']);

        // Transform respuestas into detailed view
        $respuestasArray = $resultado->getRespuestasArray();
        $respuestasDetalladas = [];

        foreach ($test->categorias as $categoria) {
            $preguntasDetalle = [];

            foreach ($categoria->preguntas as $pregunta) {
                $respuestaEstudiante = $respuestasArray[$pregunta->id] ?? null;

                $preguntasDetalle[] = [
                    'id' => $pregunta->id,
                    'enunciado' => $pregunta->enunciado,
                    'tipo' => $pregunta->tipo,
                    'opciones' => json_decode($pregunta->opciones ?? '[]', true),
                    'respuesta_estudiante' => $respuestaEstudiante,
                    'respondida' => $respuestaEstudiante !== null,
                ];
            }

            if (!empty($preguntasDetalle)) {
                $respuestasDetalladas[] = [
                    'categoria_id' => $categoria->id,
                    'categoria_nombre' => $categoria->nombre,
                    'preguntas' => $preguntasDetalle,
                ];
            }
        }

        // Get puntajes por categoría
        $puntajesPorCategoria = json_decode($resultado->puntajes_por_categoria ?? '{}', true);

        return response()->json([
            'success' => true,
            'resultado' => [
                'id' => $resultado->id,
                'estudiante' => [
                    'id' => $resultado->estudiante->id,
                    'nombre' => $resultado->estudiante->name,
                    'email' => $resultado->estudiante->email,
                ],
                'test_id' => $test->id,
                'test_nombre' => $test->nombre,
                'fecha_completacion' => $resultado->fecha_completacion?->format('Y-m-d H:i:s'),
                'tiempo_total_minutos' => $resultado->tiempo_total ?? null,
                'respuestas_detalladas' => $respuestasDetalladas,
                'puntajes_por_categoria' => $puntajesPorCategoria,
                'perfil_vocacional' => $resultado->perfilVocacional ? [
                    'id' => $resultado->perfilVocacional->id,
                    'carrera_predicha_ml' => $resultado->perfilVocacional->carrera_predicha_ml,
                    'confianza_prediccion' => $resultado->perfilVocacional->confianza_prediccion,
                    'cluster_aptitud' => $resultado->perfilVocacional->cluster_aptitud,
                    'probabilidad_cluster' => $resultado->perfilVocacional->probabilidad_cluster,
                    'recomendaciones_personalizadas' => json_decode(
                        $resultado->perfilVocacional->recomendaciones_personalizadas ?? '{}',
                        true
                    ),
                ] : null,
            ],
        ]);
    }

    /**
     * Get statistics for a test
     * GET /tests-vocacionales/{testId}/respuestas/estadisticas
     */
    public function estadisticas(TestVocacional $test)
    {
        $this->autorizar($test);

        $resultados = $test->resultados()
            ->with('perfilVocacional')
            ->get();

        if ($resultados->isEmpty()) {
            return response()->json([
                'success' => true,
                'estadisticas' => [
                    'total_respuestas' => 0,
                    'total_estudiantes' => 0,
                    'tasa_completacion' => 0,
                    'tiempo_promedio_minutos' => 0,
                    'carrera_mas_predicha' => null,
                    'cluster_distribution' => [],
                    'confidence_stats' => [],
                    'por_categoria' => [],
                ],
            ]);
        }

        // Calculate statistics
        $completados = $resultados->filter(fn($r) => $r->fecha_completacion !== null);
        $tasa_completacion = $completados->count() / $resultados->count() * 100;

        // Get career predictions
        $carreras = $resultados->filter(fn($r) => $r->perfilVocacional)
            ->groupBy('perfilVocacional.carrera_predicha_ml')
            ->map->count()
            ->sort()
            ->reverse();

        // Get cluster distribution
        $clusters = $resultados->filter(fn($r) => $r->perfilVocacional)
            ->groupBy('perfilVocacional.cluster_aptitud')
            ->map->count();

        // Get confidence statistics
        $confidences = $resultados->filter(fn($r) => $r->perfilVocacional)
            ->pluck('perfilVocacional.confianza_prediccion')
            ->filter()
            ->toArray();

        $confidenceStats = empty($confidences) ? [
            'promedio' => 0,
            'minimo' => 0,
            'maximo' => 0,
        ] : [
            'promedio' => round(array_sum($confidences) / count($confidences) * 100, 2),
            'minimo' => round(min($confidences) * 100, 2),
            'maximo' => round(max($confidences) * 100, 2),
        ];

        // Statistics by category
        $porCategoria = [];
        foreach ($test->categorias as $categoria) {
            $porCategoria[] = [
                'categoria_id' => $categoria->id,
                'categoria_nombre' => $categoria->nombre,
                'num_preguntas' => $categoria->preguntas->count(),
                'num_respuestas' => $resultados->count(),
            ];
        }

        return response()->json([
            'success' => true,
            'estadisticas' => [
                'total_respuestas' => $resultados->count(),
                'total_estudiantes' => $resultados->pluck('estudiante_id')->unique()->count(),
                'completadas' => $completados->count(),
                'pendientes' => $resultados->count() - $completados->count(),
                'tasa_completacion' => round($tasa_completacion, 2),
                'tiempo_promedio_minutos' => round(
                    $completados->avg('tiempo_total') ?? 0,
                    2
                ),
                'carrera_mas_predicha' => $carreras->keys()->first(),
                'carrera_predicciones' => $carreras->toArray(),
                'cluster_distribution' => [
                    'bajo_desempen' => (int)($clusters[0] ?? 0),
                    'medio_desempen' => (int)($clusters[1] ?? 0),
                    'alto_desempen' => (int)($clusters[2] ?? 0),
                ],
                'confidence_stats' => $confidenceStats,
                'por_categoria' => $porCategoria,
            ],
        ]);
    }

    /**
     * Export responses to CSV
     * GET /tests-vocacionales/{testId}/respuestas/export?format=csv
     */
    public function export(Request $request, TestVocacional $test)
    {
        $this->autorizar($test);

        $format = $request->input('format', 'csv');
        $resultados = $test->resultados()
            ->with(['estudiante', 'perfilVocacional'])
            ->orderBy('fecha_completacion', 'desc')
            ->get();

        if ($format === 'csv') {
            return $this->exportCSV($test, $resultados);
        } elseif ($format === 'json') {
            return response()->json([
                'test' => $test,
                'respuestas' => $resultados,
            ])->download("respuestas-{$test->id}-{now()->format('Y-m-d-H-i-s')}.json");
        }

        abort(400, 'Formato no soportado');
    }

    /**
     * Export to CSV
     */
    private function exportCSV(TestVocacional $test, $resultados)
    {
        $filename = "respuestas-{$test->id}-{now()->format('Y-m-d-H-i-s')}.csv";

        $headers = [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ];

        $output = fopen('php://memory', 'w');

        // Header row
        fputcsv($output, [
            'ID',
            'Estudiante',
            'Email',
            'Fecha Completación',
            'Carrera Predicha',
            'Confianza',
            'Cluster',
        ]);

        // Data rows
        foreach ($resultados as $resultado) {
            fputcsv($output, [
                $resultado->id,
                $resultado->estudiante->name,
                $resultado->estudiante->email,
                $resultado->fecha_completacion?->format('Y-m-d H:i:s') ?? 'Pendiente',
                $resultado->perfilVocacional?->carrera_predicha_ml ?? '-',
                $resultado->perfilVocacional?->confianza_prediccion
                    ? round($resultado->perfilVocacional->confianza_prediccion * 100) . '%'
                    : '-',
                match ($resultado->perfilVocacional?->cluster_aptitud) {
                    0 => 'Bajo Desempeño',
                    1 => 'Desempeño Medio',
                    2 => 'Alto Desempeño',
                    default => '-'
                },
            ]);
        }

        rewind($output);
        $csv = stream_get_contents($output);
        fclose($output);

        return response($csv, 200, $headers);
    }
}
