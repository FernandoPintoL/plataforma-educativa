<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\Calificacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MiPerfilController extends Controller
{
    /**
     * Obtener datos de riesgo personal del estudiante autenticado
     */
    public function getRiesgo(Request $request)
    {
        $user = Auth::user();

        // Verificar que sea estudiante
        if (!$user || $user->tipo_usuario !== 'estudiante') {
            return response()->json(
                ['message' => 'No autorizado'],
                403
            );
        }

        // Obtener predicción de riesgo más reciente
        $prediccionRiesgo = PrediccionRiesgo::where('estudiante_id', $user->id)
            ->orderBy('fecha_prediccion', 'desc')
            ->first();

        if (!$prediccionRiesgo) {
            return response()->json([
                'message' => 'No hay predicción de riesgo disponible',
                'student_id' => $user->id,
            ], 404);
        }

        // Parsear features_used si están en JSON
        $featuresUsed = is_string($prediccionRiesgo->features_used)
            ? json_decode($prediccionRiesgo->features_used, true)
            : ($prediccionRiesgo->features_used ?? []);

        // Obtener calificaciones recientes (a través de los trabajos del estudiante)
        $calificacionesRecientes = Calificacion::whereHas('trabajo', function ($query) use ($user) {
            $query->where('estudiante_id', $user->id);
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

        // Datos de tendencia simulados
        $trendData = [
            'labels' => $this->generarUltimosMeses(12),
            'scores' => $this->generarPuntuacionesTendencia($prediccionRiesgo->score_riesgo),
        ];

        // Factores que influyen (simulados basados en datos disponibles)
        $factors = $this->obtenerFactoresInfluyentes($user->id);

        // Recomendaciones personalizadas
        $recommendations = $this->obtenerRecomendaciones($prediccionRiesgo->risk_level);

        // Mapear nivel de riesgo
        $riskLevelMap = [
            'ALTO' => 'alto',
            'MEDIO' => 'medio',
            'BAJO' => 'bajo',
        ];

        return response()->json([
            'student_id' => $user->id,
            'risk_score' => (float) $prediccionRiesgo->risk_score,
            'risk_level' => strtolower($prediccionRiesgo->risk_level ?? 'medio'),
            'confidence' => (float) $prediccionRiesgo->confidence_score,
            'trend' => 'estable',
            'last_update' => $prediccionRiesgo->fecha_prediccion?->toIso8601String(),
            'trend_data' => $trendData,
            'recent_grades' => $calificacionesRecientes,
            'factors' => $factors,
            'recommendations' => $recommendations,
        ]);
    }

    /**
     * Obtener datos de carrera recomendada para el estudiante
     */
    public function getCarreras(Request $request)
    {
        $user = Auth::user();

        if (!$user || $user->tipo_usuario !== 'estudiante') {
            return response()->json(
                ['message' => 'No autorizado'],
                403
            );
        }

        $prediccionesCarrera = PrediccionCarrera::where('estudiante_id', $user->id)
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
                'student_id' => $user->id,
                'careers' => [],
            ]);
        }

        return response()->json([
            'student_id' => $user->id,
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
     * Generar puntuaciones de tendencia basadas en score actual
     */
    private function generarPuntuacionesTendencia($currentScore, $count = 12): array
    {
        $scores = [];
        $baseScore = $currentScore * 0.8; // Comenzar más bajo

        for ($i = 0; $i < $count; $i++) {
            $variation = rand(-5, 8); // Tendencia generalmente creciente
            $baseScore = min(100, max(0, $baseScore + $variation));
            $scores[] = round($baseScore, 1);
        }

        return $scores;
    }

    /**
     * Obtener factores que influyen en el riesgo
     */
    private function obtenerFactoresInfluyentes($studentId): array
    {
        // Obtener datos académicos del estudiante
        $calificaciones = Calificacion::whereHas('trabajo', function ($query) use ($studentId) {
            $query->where('estudiante_id', $studentId);
        })->avg('puntaje');

        $asistencia = $this->obtenerAsistencia($studentId); // Simulado

        $trabajos = $this->obtenerTasaTrabajosEntregados($studentId);

        $factors = [
            [
                'name' => 'Promedio de Calificaciones',
                'impact' => $this->calcularImpacto($calificaciones, 0, 10),
                'interpretation' => $calificaciones < 6 ?
                    'Tus calificaciones están por debajo del promedio. Enfócate en mejorar tu desempeño.' :
                    'Tu promedio de calificaciones es adecuado.',
            ],
            [
                'name' => 'Asistencia',
                'impact' => max(0, 1 - ($asistencia / 100)),
                'interpretation' => $asistencia < 80 ?
                    'Tu asistencia es baja. Intenta asistir más regularmente a clases.' :
                    'Tu asistencia es satisfactoria.',
            ],
            [
                'name' => 'Entrega de Tareas',
                'impact' => 1 - $trabajos,
                'interpretation' => $trabajos < 0.8 ?
                    'No estás entregando todas las tareas. Mejora tu organización y responsabilidad.' :
                    'Estás entregando tus tareas regularmente.',
            ],
        ];

        return $factors;
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
        return max(0, min(1, 1 - $normalizado)); // Invertir: calificación alta = bajo riesgo
    }

    /**
     * Obtener asistencia simulada (en implementación real, vendría de BD)
     */
    private function obtenerAsistencia($studentId): float
    {
        // Simulación: retornar valor aleatorio entre 60-100
        return rand(60, 100);
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
     * Obtener recomendaciones personalizadas basadas en el nivel de riesgo
     */
    private function obtenerRecomendaciones($riskLevel): array
    {
        $level = strtolower($riskLevel ?? 'medium');

        $recomendaciones = [
            'high' => [
                'Habla con tu profesor o director académico sobre tu desempeño',
                'Dedica más tiempo a estudiar, especialmente en las áreas débiles',
                'Solicita tutorías o apoyo académico adicional',
                'Revisa tu método de estudio y considera cambios en tu rutina',
                'Participa activamente en clase y haz preguntas cuando no entiendas',
            ],
            'medium' => [
                'Mantén el enfoque en tus estudios e identifica áreas para mejorar',
                'Establece metas académicas específicas y realistas',
                'Solicita retroalimentación a tus profesores sobre tu desempeño',
                'Organiza tu tiempo de estudio de manera más efectiva',
                'Considera formar un grupo de estudio con compañeros',
            ],
            'low' => [
                'Continúa con tu buen desempeño académico',
                'Mantén tu disciplina y dedicación a los estudios',
                'Considera ayudar a compañeros que necesiten apoyo',
                'Explora oportunidades de enriquecimiento académico',
                'Prepárate para futuras oportunidades educativas',
            ],
        ];

        return $recomendaciones[$level] ?? $recomendaciones['medium'];
    }
}
