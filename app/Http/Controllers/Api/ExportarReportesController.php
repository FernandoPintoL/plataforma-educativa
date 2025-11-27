<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\PrediccionTendencia;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ExportarReportesController extends Controller
{
    /**
     * Exportar datos de análisis de riesgo como JSON (para PDF/Excel)
     */
    public function exportarRiesgo(Request $request): JsonResponse
    {
        $tipoExporte = $request->input('tipo', 'json'); // json, csv
        $filtroNivel = $request->input('nivel'); // alto, medio, bajo

        $query = PrediccionRiesgo::with('estudiante');

        if ($filtroNivel) {
            $query->where('nivel_riesgo', $filtroNivel);
        }

        $predicciones = $query->get()->map(fn($p) => [
            'id' => $p->id,
            'estudiante' => $p->estudiante?->name ?? 'N/A',
            'email' => $p->estudiante?->email ?? 'N/A',
            'score_riesgo' => round($p->score_riesgo, 4),
            'nivel_riesgo' => $p->nivel_riesgo,
            'confianza' => round($p->confianza, 4),
            'fecha_prediccion' => $p->fecha_prediccion?->format('Y-m-d H:i:s'),
            'modelo_version' => $p->modelo_version,
        ]);

        if ($tipoExporte === 'csv') {
            return $this->generarCSV($predicciones, 'riesgo');
        }

        return response()->json([
            'data' => $predicciones,
            'total' => $predicciones->count(),
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
            'tipo' => 'Análisis de Riesgo',
        ]);
    }

    /**
     * Exportar datos de desempeño por estudiante
     */
    public function exportarDesempeno(Request $request): JsonResponse
    {
        $tipoExporte = $request->input('tipo', 'json');

        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->with(['rendimientoAcademico', 'cursosComoEstudiante', 'trabajos.calificacion'])
            ->get()
            ->map(function ($estudiante) {
                $rendimiento = $estudiante->rendimientoAcademico;
                $trabajos = $estudiante->trabajos;
                $trabajosCalificados = $trabajos->filter(fn($t) => $t->calificacion !== null);
                $tasa_entrega = $trabajos->count() > 0
                    ? round(($trabajosCalificados->count() / $trabajos->count()) * 100, 2)
                    : 0;

                return [
                    'id' => $estudiante->id,
                    'nombre' => $estudiante->nombre_completo,
                    'email' => $estudiante->email,
                    'promedio' => $rendimiento?->promedio ?? 0,
                    'cursos_inscritos' => $estudiante->cursosComoEstudiante->count(),
                    'total_trabajos' => $trabajos->count(),
                    'trabajos_calificados' => $trabajosCalificados->count(),
                    'tasa_entrega' => $tasa_entrega,
                ];
            });

        if ($tipoExporte === 'csv') {
            return $this->generarCSV($estudiantes, 'desempeno');
        }

        return response()->json([
            'data' => $estudiantes,
            'total' => $estudiantes->count(),
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
            'tipo' => 'Desempeño Académico',
        ]);
    }

    /**
     * Exportar datos de carreras recomendadas
     */
    public function exportarCarreras(Request $request): JsonResponse
    {
        $tipoExporte = $request->input('tipo', 'json');

        $carreras = PrediccionCarrera::with('estudiante')
            ->orderByDesc('compatibilidad')
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'estudiante' => $c->estudiante?->name ?? 'N/A',
                'carrera_nombre' => $c->carrera_nombre,
                'compatibilidad' => round($c->compatibilidad, 4),
                'ranking' => $c->ranking,
                'descripcion' => $c->descripcion,
                'fecha_prediccion' => $c->fecha_prediccion?->format('Y-m-d H:i:s'),
            ]);

        if ($tipoExporte === 'csv') {
            return $this->generarCSV($carreras, 'carreras');
        }

        return response()->json([
            'data' => $carreras,
            'total' => $carreras->count(),
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
            'tipo' => 'Recomendaciones de Carrera',
        ]);
    }

    /**
     * Exportar datos de tendencias
     */
    public function exportarTendencias(Request $request): JsonResponse
    {
        $tipoExporte = $request->input('tipo', 'json');

        $tendencias = PrediccionTendencia::with(['estudiante', 'curso'])
            ->orderByDesc('fecha_prediccion')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'estudiante' => $t->estudiante?->name ?? 'N/A',
                'curso' => $t->curso?->nombre ?? 'N/A',
                'tendencia' => $t->tendencia,
                'confianza' => round($t->confianza, 4),
                'fecha_prediccion' => $t->fecha_prediccion?->format('Y-m-d H:i:s'),
            ]);

        if ($tipoExporte === 'csv') {
            return $this->generarCSV($tendencias, 'tendencias');
        }

        return response()->json([
            'data' => $tendencias,
            'total' => $tendencias->count(),
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
            'tipo' => 'Tendencias de Desempeño',
        ]);
    }

    /**
     * Generar CSV a partir de datos
     */
    private function generarCSV($datos, $tipo)
    {
        if ($datos->isEmpty()) {
            return response()->json([
                'message' => 'No hay datos para exportar',
                'error' => true,
            ], 404);
        }

        $headers = array_keys($datos->first());
        $csv = implode(',', $headers) . "\n";

        foreach ($datos as $fila) {
            $csv .= implode(',', array_map(function ($valor) {
                return is_string($valor) ? '"' . str_replace('"', '""', $valor) . '"' : $valor;
            }, $fila)) . "\n";
        }

        return response()->streamDownload(
            function () use ($csv) {
                echo $csv;
            },
            "reporte-{$tipo}-" . now()->format('Y-m-d-His') . '.csv',
            ['Content-Type' => 'text/csv']
        );
    }

    /**
     * Generar resumen general de reportes
     */
    public function resumenGeneral(Request $request): JsonResponse
    {
        $totalPredicciones = PrediccionRiesgo::count();
        $riesgoAlto = PrediccionRiesgo::where('nivel_riesgo', 'alto')->count();
        $riesgoMedio = PrediccionRiesgo::where('nivel_riesgo', 'medio')->count();
        $riesgoBajo = PrediccionRiesgo::where('nivel_riesgo', 'bajo')->count();

        $totalCarreras = PrediccionCarrera::count();
        $carrerasUnicas = PrediccionCarrera::distinct('carrera_nombre')->count('carrera_nombre');

        $totalTendencias = PrediccionTendencia::count();
        $tendenciasDistribucion = PrediccionTendencia::selectRaw('tendencia, COUNT(*) as cantidad')
            ->groupBy('tendencia')
            ->get()
            ->mapWithKeys(fn($item) => [$item->tendencia => $item->cantidad]);

        return response()->json([
            'resumen' => [
                'predicciones_riesgo' => [
                    'total' => $totalPredicciones,
                    'alto' => $riesgoAlto,
                    'medio' => $riesgoMedio,
                    'bajo' => $riesgoBajo,
                    'porcentaje_alto' => $totalPredicciones > 0 ? round(($riesgoAlto / $totalPredicciones) * 100, 2) : 0,
                ],
                'recomendaciones_carrera' => [
                    'total' => $totalCarreras,
                    'unicas' => $carrerasUnicas,
                ],
                'tendencias' => [
                    'total' => $totalTendencias,
                    'distribucion' => [
                        'mejorando' => $tendenciasDistribucion->get('mejorando', 0),
                        'estable' => $tendenciasDistribucion->get('estable', 0),
                        'declinando' => $tendenciasDistribucion->get('declinando', 0),
                        'fluctuando' => $tendenciasDistribucion->get('fluctuando', 0),
                    ],
                ],
            ],
            'fecha_generacion' => now()->format('Y-m-d H:i:s'),
        ]);
    }
}
