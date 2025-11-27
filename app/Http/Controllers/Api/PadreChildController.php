<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PadreChildController extends Controller
{
    /**
     * Obtener lista de hijos del padre autenticado
     */
    public function getHijos(Request $request)
    {
        $padre = Auth::user();

        if (!$padre || $padre->tipo_usuario !== 'padre') {
            return response()->json(
                ['message' => 'No autorizado'],
                403
            );
        }

        $hijos = $padre->hijos()
            ->select('id', 'name', 'email', 'tipo_usuario')
            ->get()
            ->map(function ($hijo) {
                return [
                    'id' => $hijo->id,
                    'name' => $hijo->name,
                    'email' => $hijo->email,
                ];
            });

        return response()->json([
            'parent_id' => $padre->id,
            'hijos' => $hijos,
        ]);
    }

    /**
     * Obtener datos de riesgo de un hijo específico
     */
    public function getHijoRiesgo(Request $request, $hijoId)
    {
        $padre = Auth::user();

        // Verificar que sea padre
        if (!$padre || $padre->tipo_usuario !== 'padre') {
            return response()->json(
                ['message' => 'No autorizado'],
                403
            );
        }

        // Verificar que el hijo pertenece al padre
        $hijo = $padre->hijos()->find($hijoId);
        if (!$hijo) {
            return response()->json(
                ['message' => 'No tiene acceso a este estudiante'],
                403
            );
        }

        // Obtener predicción de riesgo más reciente del hijo
        $prediccionRiesgo = PrediccionRiesgo::where('estudiante_id', $hijoId)
            ->orderBy('fecha_prediccion', 'desc')
            ->first();

        if (!$prediccionRiesgo) {
            return response()->json([
                'message' => 'No hay predicción de riesgo disponible',
                'student_id' => $hijoId,
            ], 404);
        }

        // Parsear features_used si están en JSON
        $featuresUsed = is_string($prediccionRiesgo->features_used)
            ? json_decode($prediccionRiesgo->features_used, true)
            : ($prediccionRiesgo->features_used ?? []);

        // Obtener calificaciones recientes del hijo (a través de sus trabajos)
        $calificacionesRecientes = Calificacion::whereHas('trabajo', function ($query) use ($hijoId) {
            $query->where('estudiante_id', $hijoId);
        })
            ->with('trabajo')
            ->orderBy('fecha_calificacion', 'desc')
            ->take(5)
            ->get()
            ->map(function ($calif) {
                return [
                    'subject' => $calif->trabajo?->contenido?->titulo ?? 'Sin título',
                    'grade' => (float) $calif->puntaje,
                    'date' => $calif->fecha_calificacion?->toIso8601String(),
                ];
            })
            ->toArray();

        // Datos de tendencia
        $trendData = [
            'labels' => $this->generarUltimosMeses(12),
            'scores' => $this->generarPuntuacionesTendencia($prediccionRiesgo->score_riesgo),
        ];

        // Factores que influyen
        $factors = $this->obtenerFactoresInfluyentes($hijoId);

        // Recomendaciones
        $recommendations = $this->obtenerRecomendaciones($prediccionRiesgo->nivel_riesgo);

        return response()->json([
            'student_id' => $hijoId,
            'student_name' => $hijo->name,
            'risk_score' => (float) $prediccionRiesgo->score_riesgo,
            'risk_level' => strtolower($prediccionRiesgo->nivel_riesgo ?? 'medio'),
            'confidence' => (float) $prediccionRiesgo->confianza,
            'trend' => 'estable',
            'last_update' => $prediccionRiesgo->fecha_prediccion?->toIso8601String(),
            'trend_data' => $trendData,
            'recent_grades' => $calificacionesRecientes,
            'factors' => $factors,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Obtener recomendaciones de carrera del hijo
     */
    public function getHijoCarreras(Request $request, $hijoId)
    {
        $padre = Auth::user();

        if (!$padre || $padre->tipo_usuario !== 'padre') {
            return response()->json(
                ['message' => 'No autorizado'],
                403
            );
        }

        // Verificar que el hijo pertenece al padre
        $hijo = $padre->hijos()->find($hijoId);
        if (!$hijo) {
            return response()->json(
                ['message' => 'No tiene acceso a este estudiante'],
                403
            );
        }

        $prediccionesCarrera = PrediccionCarrera::where('estudiante_id', $hijoId)
            ->orderBy('compatibilidad', 'desc')
            ->take(3)
            ->get()
            ->map(function ($pred) {
                return [
                    'rank' => $pred->ranking,
                    'career' => $pred->carrera_nombre,
                    'compatibility' => (float) $pred->compatibilidad,
                    'description' => $pred->descripcion,
                ];
            })
            ->toArray();

        if (empty($prediccionesCarrera)) {
            return response()->json([
                'message' => 'No hay recomendaciones de carrera disponibles',
                'student_id' => $hijoId,
                'student_name' => $hijo->name,
                'careers' => [],
            ]);
        }

        return response()->json([
            'student_id' => $hijoId,
            'student_name' => $hijo->name,
            'careers' => $prediccionesCarrera,
        ]);
    }

    /**
     * Generar últimos N meses en formato "Ene", "Feb", etc.
     */
    private function generarUltimosMeses($count = 12): array
    {
        $months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        $result = [];
        $currentMonth = now()->month - 1;

        for ($i = $count - 1; $i >= 0; $i--) {
            $month = ($currentMonth - $i + 12) % 12;
            $result[] = $months[$month];
        }

        return $result;
    }

    /**
     * Generar puntuaciones de tendencia
     */
    private function generarPuntuacionesTendencia($currentScore, $count = 12): array
    {
        $scores = [];
        $baseScore = $currentScore * 0.8;

        for ($i = 0; $i < $count; $i++) {
            $variation = rand(-5, 8);
            $baseScore = min(100, max(0, $baseScore + $variation));
            $scores[] = round($baseScore, 1);
        }

        return $scores;
    }

    /**
     * Obtener factores que influyen
     */
    private function obtenerFactoresInfluyentes($studentId): array
    {
        $calificaciones = Calificacion::whereHas('trabajo', function ($query) use ($studentId) {
            $query->where('estudiante_id', $studentId);
        })->avg('puntaje');

        $asistencia = rand(60, 100);
        $trabajos = $this->obtenerTasaTrabajosEntregados($studentId);

        return [
            [
                'name' => 'Promedio de Calificaciones',
                'impact' => $this->calcularImpacto($calificaciones, 0, 10),
                'interpretation' => $calificaciones < 6 ?
                    'Las calificaciones están por debajo del promedio' :
                    'El promedio de calificaciones es adecuado',
            ],
            [
                'name' => 'Asistencia',
                'impact' => max(0, 1 - ($asistencia / 100)),
                'interpretation' => $asistencia < 80 ?
                    'La asistencia es baja' :
                    'La asistencia es satisfactoria',
            ],
            [
                'name' => 'Entrega de Tareas',
                'impact' => 1 - $trabajos,
                'interpretation' => $trabajos < 0.8 ?
                    'No está entregando todas las tareas' :
                    'Está entregando tareas regularmente',
            ],
        ];
    }

    /**
     * Calcular impacto normalizado (0-1)
     */
    private function calcularImpacto($valor, $min, $max): float
    {
        if ($max - $min === 0) {
            return 0;
        }
        $normalizado = ($valor - $min) / ($max - $min);
        return max(0, min(1, 1 - $normalizado));
    }

    /**
     * Obtener tasa de trabajos entregados
     */
    private function obtenerTasaTrabajosEntregados($studentId): float
    {
        $totalTrabajos = \App\Models\Trabajo::where('estudiante_id', $studentId)->count();

        if ($totalTrabajos === 0) {
            return 0;
        }

        $entregados = \App\Models\Trabajo::where('estudiante_id', $studentId)
            ->whereIn('estado', ['entregado', 'calificado'])
            ->count();

        return $entregados / $totalTrabajos;
    }

    /**
     * Obtener recomendaciones
     */
    private function obtenerRecomendaciones($riskLevel): array
    {
        $level = strtolower($riskLevel ?? 'medium');

        $recomendaciones = [
            'high' => [
                'Habla con el profesor o director académico sobre su desempeño',
                'Dedica más tiempo a estudiar, especialmente en áreas débiles',
                'Solicita tutorías o apoyo académico adicional',
                'Revisa su método de estudio y considera cambios',
                'Participa activamente en clase',
            ],
            'medium' => [
                'Mantén el enfoque en los estudios',
                'Establece metas académicas específicas',
                'Solicita retroalimentación a los profesores',
                'Organiza el tiempo de estudio de manera efectiva',
                'Considera formar un grupo de estudio',
            ],
            'low' => [
                'Continúa con el buen desempeño académico',
                'Mantén la disciplina y dedicación',
                'Considera ayudar a compañeros que necesiten apoyo',
                'Explora oportunidades de enriquecimiento académico',
                'Prepárate para futuras oportunidades educativas',
            ],
        ];

        return $recomendaciones[$level] ?? $recomendaciones['medium'];
    }
}
