<?php

namespace App\Services;

use App\Models\QuestionBank;
use App\Models\QuestionAnalytics;
use App\Models\RespuestaEvaluacion;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class QuestionAnalyticsService
{
    /**
     * Actualizar analytics post-evaluación
     */
    public function updateAnalytics(int $evaluacionId): void
    {
        Log::info("Actualizando analytics para evaluación: {$evaluacionId}");

        try {
            $evaluacion = \App\Models\Evaluacion::findOrFail($evaluacionId);

            // Obtener preguntas del banco utilizadas en esta evaluación
            $questionsUsed = $evaluacion->questions()
                ->whereHas('questionBank')
                ->get();

            foreach ($questionsUsed as $question) {
                // Obtener respuestas de estudiantes para esta pregunta
                $respuestas = RespuestaEvaluacion::where('evaluacion_id', $evaluacionId)
                    ->where('pregunta_id', $question->id)
                    ->get();

                if ($respuestas->isEmpty()) {
                    continue;
                }

                // Calcular métricas
                $metricas = $this->calculateQuestionMetrics($question, $respuestas);

                // Actualizar o crear registro de analytics
                $analytics = QuestionAnalytics::updateOrCreate(
                    [
                        'question_id' => $question->id,
                        'evaluacion_id' => $evaluacionId,
                    ],
                    $metricas
                );

                Log::info("Analytics actualizado para pregunta {$question->id}", $metricas);
            }
        } catch (\Exception $e) {
            Log::error("Error actualizando analytics: {$e->getMessage()}");
        }
    }

    /**
     * Calcular métricas completas de una pregunta
     */
    private function calculateQuestionMetrics(QuestionBank $question, Collection $respuestas): array
    {
        $totalRespuestas = $respuestas->count();
        $respuestasCorrectas = 0;
        $tiempos = [];
        $distribucionRespuestas = [];

        foreach ($respuestas as $respuesta) {
            // Validar respuesta
            if ($question->validarRespuesta($respuesta->respuesta)) {
                $respuestasCorrectas++;
            }

            // Recolectar tiempos
            if ($respuesta->tiempo_respuesta) {
                $tiempos[] = $respuesta->tiempo_respuesta;
            }

            // Distribución de respuestas
            $opcion = $respuesta->respuesta;
            $distribucionRespuestas[$opcion] = ($distribucionRespuestas[$opcion] ?? 0) + 1;
        }

        // Convertir distribución a porcentajes
        $distribucionRespuestas = collect($distribucionRespuestas)
            ->mapWithKeys(fn($count, $opcion) => [$opcion => round(($count / $totalRespuestas) * 100, 2)])
            ->toArray();

        // Calcular índice de discriminación
        $indiceDiscriminacion = $this->calculateDiscriminationIndex($question, $respuestas);

        return [
            'veces_respondida' => $totalRespuestas,
            'veces_correcta' => $respuestasCorrectas,
            'veces_incorrecta' => $totalRespuestas - $respuestasCorrectas,
            'tasa_acierto' => $totalRespuestas > 0 ? round(($respuestasCorrectas / $totalRespuestas) * 100, 2) : 0,
            'indice_discriminacion' => $indiceDiscriminacion,
            'tiempo_promedio_respuesta' => count($tiempos) > 0 ? round(array_sum($tiempos) / count($tiempos), 2) : null,
            'distribucion_respuestas' => $distribucionRespuestas,
        ];
    }

    /**
     * Calcular índice de discriminación
     *
     * El índice de discriminación mide si los estudiantes de mejor desempeño
     * tienden a responder correctamente la pregunta más que los de bajo desempeño.
     * Rango: -1 a 1 (valores > 0.30 son buenos)
     */
    public function calculateDiscriminationIndex(QuestionBank $question, Collection $respuestas): ?float
    {
        if ($respuestas->isEmpty()) {
            return null;
        }

        // Agrupar respuestas por desempeño del estudiante
        $respuestasAgrupadas = $respuestas->groupBy(function ($respuesta) {
            // Obtener calificación del estudiante en la evaluación
            $evaluacion = $respuesta->evaluacion;
            $calificacion = $evaluacion->calificaciones()
                ->where('usuario_id', $respuesta->usuario_id)
                ->first()?->calificacion ?? 0;

            return $calificacion >= 70 ? 'alto' : 'bajo'; // Punto de corte: 70%
        });

        $respuestasAlto = $respuestasAgrupadas->get('alto', collect());
        $respuestasBajo = $respuestasAgrupadas->get('bajo', collect());

        if ($respuestasAlto->isEmpty() || $respuestasBajo->isEmpty()) {
            return null;
        }

        // Porcentaje de respuestas correctas en cada grupo
        $pAlto = $respuestasAlto
            ->filter(fn($r) => $question->validarRespuesta($r->respuesta))
            ->count() / $respuestasAlto->count();

        $pBajo = $respuestasBajo
            ->filter(fn($r) => $question->validarRespuesta($r->respuesta))
            ->count() / $respuestasBajo->count();

        return round($pAlto - $pBajo, 3);
    }

    /**
     * Obtener errores comunes por pregunta
     */
    public function getCommonErrors(int $questionId): array
    {
        $respuestas = RespuestaEvaluacion::whereHas(
            'evaluacion.questions',
            fn($q) => $q->where('question_id', $questionId)
        )->get();

        $question = QuestionBank::findOrFail($questionId);

        // Agrupar respuestas incorrectas
        $erroresComunes = $respuestas
            ->filter(fn($r) => !$question->validarRespuesta($r->respuesta))
            ->groupBy('respuesta')
            ->map(fn($grupo) => ['respuesta' => $grupo->first()->respuesta, 'frecuencia' => $grupo->count()])
            ->sortByDesc('frecuencia')
            ->values()
            ->take(5)
            ->toArray();

        return $erroresComunes;
    }

    /**
     * Analizar rendimiento por cluster de estudiantes
     */
    public function analyzeByCluster(int $questionId, int $evaluacionId): array
    {
        $question = QuestionBank::findOrFail($questionId);
        $evaluacion = \App\Models\Evaluacion::findOrFail($evaluacionId);

        // Obtener clusters de estudiantes
        $clusters = \App\Models\StudentCluster::select('usuario_id', 'cluster')
            ->whereIn('usuario_id', $evaluacion->respuestas->pluck('usuario_id')->unique())
            ->get()
            ->groupBy('cluster');

        $rendimientoPorCluster = [];

        foreach ($clusters as $clusterId => $estudiantes) {
            $respuestas = RespuestaEvaluacion::where('evaluacion_id', $evaluacionId)
                ->whereIn('usuario_id', $estudiantes->pluck('usuario_id'))
                ->where('pregunta_id', $questionId)
                ->get();

            if (!$respuestas->isEmpty()) {
                $respuestasCorrectas = $respuestas
                    ->filter(fn($r) => $question->validarRespuesta($r->respuesta))
                    ->count();

                $rendimientoPorCluster["cluster_{$clusterId}"] = round(
                    ($respuestasCorrectas / $respuestas->count()) * 100,
                    2
                );
            }
        }

        return $rendimientoPorCluster;
    }

    /**
     * Sugerir mejoras basadas en analytics
     */
    public function suggestImprovements(int $questionId): array
    {
        $question = QuestionBank::findOrFail($questionId);
        $analytics = $question->analytics()->first();

        $sugerencias = [];

        if (!$analytics) {
            return ['message' => 'Sin datos de evaluación aún'];
        }

        // Índice de discriminación bajo
        if ($analytics->necesitaRevision()) {
            $sugerencias[] = [
                'tipo' => 'discriminacion_baja',
                'mensaje' => 'El índice de discriminación es bajo. La pregunta no diferencia bien entre estudiantes de alto y bajo desempeño.',
                'accion' => 'Considere revisar el enunciado, las opciones o los distractores.',
                'urgencia' => 'media',
            ];
        }

        // Tasa de acierto desbalanceada
        if ($analytics->tasa_acierto < 20) {
            $sugerencias[] = [
                'tipo' => 'dificultad_muy_alta',
                'mensaje' => 'La pregunta es muy difícil (tasa acierto < 20%). Reconsidere el nivel de dificultad.',
                'accion' => 'Simplifique el enunciado o proporcione más contexto.',
                'urgencia' => 'alta',
            ];
        } elseif ($analytics->tasa_acierto > 95) {
            $sugerencias[] = [
                'tipo' => 'dificultad_muy_baja',
                'mensaje' => 'La pregunta es muy fácil (tasa acierto > 95%). Aumentar dificultad para mejor discriminación.',
                'accion' => 'Aumente la complejidad del enunciado o los distractores.',
                'urgencia' => 'media',
            ];
        }

        // Errores comunes
        $erroresComunes = $this->getCommonErrors($questionId);
        if (!empty($erroresComunes) && $erroresComunes[0]['frecuencia'] > 2) {
            $sugerencias[] = [
                'tipo' => 'error_comun',
                'mensaje' => "Hay un error común: {$erroresComunes[0]['respuesta']} (elegido {$erroresComunes[0]['frecuencia']} veces)",
                'accion' => 'Reemplace este distractor con uno que sea menos atractivo.',
                'urgencia' => 'baja',
            ];
        }

        // Rendimiento desigual por cluster
        $rendimientoPorCluster = $analytics->getRendimientoPorCluster();
        if (!empty($rendimientoPorCluster)) {
            $varianza = $this->calculateVariance($rendimientoPorCluster);
            if ($varianza > 25) {
                $sugerencias[] = [
                    'tipo' => 'sesgo_cluster',
                    'mensaje' => 'Hay diferencia significativa en rendimiento entre clusters de estudiantes.',
                    'accion' => 'La pregunta puede tener sesgo hacia cierto tipo de estudiante.',
                    'urgencia' => 'media',
                ];
            }
        }

        return $sugerencias;
    }

    /**
     * Recalibrar dificultad basada en datos reales
     */
    public function recalibrateDifficulty(int $questionId): float
    {
        $question = QuestionBank::findOrFail($questionId);
        $analytics = $question->analytics()->first();

        if (!$analytics) {
            return $question->dificultad_estimada;
        }

        // Mapeo: tasa_acierto -> dificultad calibrada
        // 0% acierto -> 1.0 (muy difícil)
        // 50% acierto -> 0.5 (intermedio)
        // 100% acierto -> 0.0 (muy fácil)
        $tasaAcierto = $analytics->tasa_acierto / 100;
        $dificultadReal = 1 - $tasaAcierto;

        // Actualizar
        $question->update(['dificultad_real' => $dificultadReal]);

        return $dificultadReal;
    }

    /**
     * Calcular varianza de un array de valores
     */
    private function calculateVariance(array $values): float
    {
        if (count($values) < 2) {
            return 0;
        }

        $mean = array_sum($values) / count($values);
        $deviations = array_map(fn($v) => pow($v - $mean, 2), $values);
        return sqrt(array_sum($deviations) / count($deviations));
    }

    /**
     * Obtener dashboard de analytics para un curso
     */
    public function getDashboard(int $cursoId): array
    {
        $questions = QuestionBank::where('curso_id', $cursoId)
            ->with('analytics')
            ->get();

        $stats = [
            'total_preguntas' => $questions->count(),
            'preguntas_validadas' => $questions->where('validada', true)->count(),
            'preguntas_alta_calidad' => $questions->filter(fn($q) => $q->esAltaCalidad())->count(),
            'preguntas_requieren_revision' => $questions->filter(function ($q) {
                $analytics = $q->analytics()->first();
                return $analytics && $analytics->necesitaRevision();
            })->count(),
            'dificultad_promedio' => round($questions->avg('dificultad_estimada'), 2),
            'uso_promedio' => round($questions->avg('veces_usada'), 1),
            'distribucion_bloom' => $questions->groupBy('nivel_bloom')->map->count(),
            'distribucion_dificultad' => [
                'facil' => $questions->where('dificultad_estimada', '<', 0.4)->count(),
                'media' => $questions->whereBetween('dificultad_estimada', [0.4, 0.6])->count(),
                'dificil' => $questions->where('dificultad_estimada', '>', 0.6)->count(),
            ],
        ];

        return $stats;
    }
}
