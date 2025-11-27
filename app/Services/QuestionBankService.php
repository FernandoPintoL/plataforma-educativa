<?php

namespace App\Services;

use App\Models\QuestionBank;
use App\Models\QuestionDistractor;
use App\Models\QuestionUsage;
use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Builder;

class QuestionBankService
{
    /**
     * Guardar pregunta en el banco
     */
    public function saveQuestion(array $questionData): QuestionBank
    {
        // Validar datos requeridos
        $this->validateQuestionData($questionData);

        // Crear la pregunta
        $question = QuestionBank::create($questionData);

        // Si hay distractores, guardarlos
        if (!empty($questionData['distractors'])) {
            $this->saveDistractors($question->id, $questionData['distractors']);
        }

        return $question;
    }

    /**
     * Buscar preguntas similares (evitar duplicados)
     *
     * @param string $enunciado
     * @param int $cursoId
     * @param float $threshold Umbral de similitud (0-1)
     */
    public function findSimilarQuestions(
        string $enunciado,
        int $cursoId,
        float $threshold = 0.85
    ): Collection {
        $questions = QuestionBank::where('curso_id', $cursoId)
            ->where('estado', 'activa')
            ->get();

        $similar = collect();

        foreach ($questions as $question) {
            $similarity = $this->calculateSimilarity($enunciado, $question->enunciado);

            if ($similarity >= $threshold) {
                $similar->push([
                    'question' => $question,
                    'similarity' => $similarity,
                ]);
            }
        }

        // Ordenar por similitud descendente
        return $similar->sortByDesc('similarity');
    }

    /**
     * Obtener preguntas del banco con filtros
     */
    public function getQuestions(array $filters = []): Collection|Builder
    {
        $query = QuestionBank::query();

        if (isset($filters['curso_id'])) {
            $query->where('curso_id', $filters['curso_id']);
        }

        if (isset($filters['tipo'])) {
            $query->where('tipo', $filters['tipo']);
        }

        if (isset($filters['nivel_bloom'])) {
            $query->where('nivel_bloom', $filters['nivel_bloom']);
        }

        if (isset($filters['dificultad_min']) && isset($filters['dificultad_max'])) {
            $query->whereBetween('dificultad_estimada', [
                $filters['dificultad_min'],
                $filters['dificultad_max'],
            ]);
        }

        if (isset($filters['estado'])) {
            $query->where('estado', $filters['estado']);
        } else {
            $query->where('estado', 'activa');
        }

        if (isset($filters['validada'])) {
            $query->where('validada', $filters['validada']);
        }

        if (isset($filters['conceptos_clave'])) {
            // Buscar por conceptos clave
            $conceptos = $filters['conceptos_clave'];
            $query->whereJsonContains('conceptos_clave', is_array($conceptos) ? $conceptos[0] : $conceptos);
        }

        if (isset($filters['search'])) {
            $query->whereFullText(['enunciado', 'conceptos_clave'], $filters['search']);
        }

        return $query->get();
    }

    /**
     * Sugerir preguntas de alta calidad del banco
     */
    public function suggestHighQualityQuestions(
        int $cursoId,
        array $criteria = []
    ): Collection {
        $query = QuestionBank::where('curso_id', $cursoId)
            ->where('estado', 'activa')
            ->where('validada', true);

        // Filtrar por nivel Bloom si se especifica
        if (!empty($criteria['nivel_bloom'])) {
            $query->where('nivel_bloom', $criteria['nivel_bloom']);
        }

        // Filtrar por rango de dificultad
        if (!empty($criteria['dificultad_min']) && !empty($criteria['dificultad_max'])) {
            $query->whereBetween('dificultad_estimada', [
                $criteria['dificultad_min'],
                $criteria['dificultad_max'],
            ]);
        }

        $questions = $query->get();

        // Filtrar por alta calidad (discriminación > 0.30)
        return $questions->filter(function ($question) {
            return $question->esAltaCalidad();
        })->values();
    }

    /**
     * Registrar uso de una pregunta
     */
    public function recordUsage(
        int $questionId,
        int $evaluacionId,
        int $orden,
        int $puntos
    ): void {
        QuestionUsage::create([
            'question_id' => $questionId,
            'evaluacion_id' => $evaluacionId,
            'orden' => $orden,
            'puntos_asignados' => $puntos,
        ]);

        // Incrementar contador de veces usada
        QuestionBank::findOrFail($questionId)->increment('veces_usada');
    }

    /**
     * Calcular similitud entre dos textos (Levenshtein)
     *
     * @param string $text1
     * @param string $text2
     * @return float Similitud de 0 a 1
     */
    public function calculateSimilarity(string $text1, string $text2): float
    {
        // Normalizar textos
        $text1 = strtolower(trim($text1));
        $text2 = strtolower(trim($text2));

        // Si son idénticos
        if ($text1 === $text2) {
            return 1.0;
        }

        // Calcular distancia de Levenshtein
        $length1 = strlen($text1);
        $length2 = strlen($text2);

        if ($length1 === 0 || $length2 === 0) {
            return 0.0;
        }

        $levenshtein = levenshtein($text1, $text2);
        $maxLength = max($length1, $length2);

        // Convertir distancia a similitud (0 a 1)
        return 1 - ($levenshtein / $maxLength);
    }

    /**
     * Obtener preguntas para una evaluación
     */
    public function getQuestionsForEvaluation(int $evaluacionId): Collection
    {
        return QuestionUsage::where('evaluacion_id', $evaluacionId)
            ->orderBy('orden')
            ->with('question')
            ->get()
            ->pluck('question');
    }

    /**
     * Actualizar pregunta
     */
    public function updateQuestion(int $questionId, array $data): QuestionBank
    {
        $question = QuestionBank::findOrFail($questionId);
        $question->update($data);

        return $question;
    }

    /**
     * Archivar pregunta
     */
    public function archiveQuestion(int $questionId): void
    {
        QuestionBank::findOrFail($questionId)->update(['estado' => 'archivada']);
    }

    /**
     * Obtener estadísticas del banco por curso
     */
    public function getStats(int $cursoId): array
    {
        $questions = QuestionBank::where('curso_id', $cursoId)->get();

        $highQuality = $questions->filter(fn($q) => $q->esAltaCalidad())->count();
        $needsReview = $questions->filter(function($q) {
            $analytics = $q->analytics()->first();
            return $analytics && $analytics->necesitaRevision();
        })->count();

        return [
            'total_questions' => $questions->count(),
            'active_questions' => $questions->where('estado', 'activa')->count(),
            'high_quality' => $highQuality,
            'needs_review' => $needsReview,
            'by_bloom' => $questions->groupBy('nivel_bloom')->map->count(),
            'by_difficulty' => [
                'easy' => $questions->where('dificultad_estimada', '<', 0.4)->count(),
                'medium' => $questions->whereBetween('dificultad_estimada', [0.4, 0.6])->count(),
                'hard' => $questions->where('dificultad_estimada', '>', 0.6)->count(),
            ],
            'avg_difficulty' => $questions->avg('dificultad_estimada'),
            'total_usage' => $questions->sum('veces_usada'),
        ];
    }

    /**
     * Guardar distractores para una pregunta
     */
    private function saveDistractors(int $questionId, array $distractors): void
    {
        foreach ($distractors as $distractor) {
            QuestionDistractor::create([
                'question_id' => $questionId,
                'opcion' => $distractor['opcion'] ?? '',
                'razon_incorrecta' => $distractor['razon_incorrecta'] ?? null,
                'error_comun' => $distractor['error_comun'] ?? null,
            ]);
        }
    }

    /**
     * Validar datos de la pregunta
     */
    private function validateQuestionData(array $data): void
    {
        if (empty($data['curso_id'])) {
            throw new \InvalidArgumentException('curso_id es requerido');
        }

        if (empty($data['tipo'])) {
            throw new \InvalidArgumentException('tipo es requerido');
        }

        if (empty($data['enunciado'])) {
            throw new \InvalidArgumentException('enunciado es requerido');
        }

        if (empty($data['respuesta_correcta'])) {
            throw new \InvalidArgumentException('respuesta_correcta es requerida');
        }

        if (empty($data['nivel_bloom'])) {
            throw new \InvalidArgumentException('nivel_bloom es requerido');
        }

        if (!isset($data['dificultad_estimada'])) {
            throw new \InvalidArgumentException('dificultad_estimada es requerida');
        }
    }
}
