<?php

namespace App\Services;

use App\Models\RespuestaTest;
use App\Models\TestVocacional;
use App\Models\CategoriaTest;
use App\Models\PreguntaTest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class RiasecPsychometricAnalysisService
{
    /**
     * Calculate Cronbach's Alpha for internal consistency
     * Alpha = (k/(k-1)) * (1 - (sum_of_item_variances / total_variance))
     *
     * Alpha > 0.90: Excellent
     * Alpha > 0.80: Good
     * Alpha > 0.70: Acceptable
     * Alpha < 0.70: Poor (needs revision)
     */
    public function calculateCronbachAlpha(int $categoria_test_id): array
    {
        $categoria = CategoriaTest::find($categoria_test_id);
        if (!$categoria) {
            return ['error' => 'Categoría no encontrada'];
        }

        // Get all questions in this category
        $preguntas = PreguntaTest::where('categoria_test_id', $categoria_test_id)
            ->orderBy('orden')
            ->get();

        if ($preguntas->isEmpty()) {
            return ['error' => 'Sin preguntas en esta categoría'];
        }

        // Get all responses for all questions in this category
        $pregunta_ids = $preguntas->pluck('id')->toArray();

        $respuestas = RespuestaTest::whereIn('pregunta_test_id', $pregunta_ids)
            ->get()
            ->groupBy('estudiante_id')
            ->filter(fn($grupo) => $grupo->count() === count($pregunta_ids)); // Only students who answered all questions

        if ($respuestas->isEmpty()) {
            return ['error' => 'Sin respuestas suficientes'];
        }

        // Build matrix of responses (estudiante x pregunta)
        $matriz_respuestas = [];
        foreach ($respuestas as $estudiante_id => $responses_del_estudiante) {
            $matriz_respuestas[$estudiante_id] = [];
            foreach ($preguntas as $pregunta) {
                $respuesta = $responses_del_estudiante->firstWhere('pregunta_test_id', $pregunta->id);
                $matriz_respuestas[$estudiante_id][$pregunta->id] = $respuesta ? floatval($respuesta->respuesta_seleccionada) : null;
            }
        }

        // Calculate item variances
        $num_items = count($pregunta_ids);
        $num_respondents = count($matriz_respuestas);
        $item_variances = [];
        $all_responses = [];

        // Collect all responses for total variance
        foreach ($matriz_respuestas as $responses) {
            $all_responses = array_merge($all_responses, array_values($responses));
        }

        // Calculate variance for each item
        for ($i = 0; $i < $num_items; $i++) {
            $item_responses = [];
            $pregunta_id = $pregunta_ids[$i];

            foreach ($matriz_respuestas as $responses) {
                $item_responses[] = $responses[$pregunta_id];
            }

            $item_variances[] = $this->calculateVariance($item_responses);
        }

        // Calculate total variance
        $total_variance = $this->calculateVariance($all_responses);

        // Cronbach's Alpha formula
        $sum_item_variances = array_sum($item_variances);

        if ($total_variance == 0) {
            $alpha = 0;
        } else {
            $alpha = ($num_items / ($num_items - 1)) * (1 - ($sum_item_variances / $total_variance));
        }

        // Clamp between -1 and 1
        $alpha = max(-1, min(1, $alpha));

        return [
            'dimension' => $categoria->nombre,
            'cronbach_alpha' => round($alpha, 4),
            'num_items' => $num_items,
            'num_respondents' => $num_respondents,
            'sum_item_variances' => round($sum_item_variances, 4),
            'total_variance' => round($total_variance, 4),
            'interpretation' => $this->interpretAlpha($alpha),
            'status' => $alpha >= 0.70 ? 'acceptable' : 'needs_revision',
        ];
    }

    /**
     * Calculate Cronbach's Alpha for all dimensions in a test
     */
    public function calculateAllDimensionAlphas(int $test_vocacional_id): array
    {
        $categorias = CategoriaTest::where('test_vocacional_id', $test_vocacional_id)
            ->orderBy('orden')
            ->get();

        $alphas = [];
        foreach ($categorias as $categoria) {
            $alphas[] = $this->calculateCronbachAlpha($categoria->id);
        }

        // Calculate average alpha
        $valid_alphas = array_filter($alphas, fn($a) => !isset($a['error']));
        $average_alpha = !empty($valid_alphas)
            ? round(array_sum(array_column($valid_alphas, 'cronbach_alpha')) / count($valid_alphas), 4)
            : 0;

        return [
            'test_id' => $test_vocacional_id,
            'dimensions' => $alphas,
            'average_alpha' => $average_alpha,
            'overall_status' => $average_alpha >= 0.70 ? 'acceptable' : 'needs_revision',
        ];
    }

    /**
     * Calculate correlation between two dimensions
     * Pearson correlation coefficient
     */
    public function calculateDimensionCorrelation(int $cat1_id, int $cat2_id): array
    {
        $cat1 = CategoriaTest::find($cat1_id);
        $cat2 = CategoriaTest::find($cat2_id);

        if (!$cat1 || !$cat2) {
            return ['error' => 'Una o ambas categorías no encontradas'];
        }

        // Get scores for each student in both dimensions
        $student_scores = [];

        // Get all students who answered both categories
        $students = RespuestaTest::whereHas('preguntaTest.categoriaTest', fn($q) => $q->whereIn('id', [$cat1_id, $cat2_id]))
            ->distinct('estudiante_id')
            ->pluck('estudiante_id')
            ->toArray();

        foreach ($students as $student_id) {
            // Get score for dimension 1
            $respuestas_cat1 = RespuestaTest::whereHas('preguntaTest', fn($q) => $q->where('categoria_test_id', $cat1_id))
                ->where('estudiante_id', $student_id)
                ->pluck('respuesta_seleccionada')
                ->toArray();

            // Get score for dimension 2
            $respuestas_cat2 = RespuestaTest::whereHas('preguntaTest', fn($q) => $q->where('categoria_test_id', $cat2_id))
                ->where('estudiante_id', $student_id)
                ->pluck('respuesta_seleccionada')
                ->toArray();

            if (count($respuestas_cat1) > 0 && count($respuestas_cat2) > 0) {
                $score_cat1 = array_sum($respuestas_cat1) / count($respuestas_cat1);
                $score_cat2 = array_sum($respuestas_cat2) / count($respuestas_cat2);

                $student_scores[] = [
                    'student_id' => $student_id,
                    'score1' => $score_cat1,
                    'score2' => $score_cat2,
                ];
            }
        }

        if (count($student_scores) < 2) {
            return ['error' => 'Datos insuficientes para calcular correlación'];
        }

        // Calculate Pearson correlation
        $correlation = $this->calculatePearsonCorrelation(
            array_column($student_scores, 'score1'),
            array_column($student_scores, 'score2')
        );

        return [
            'dimension1' => $cat1->nombre,
            'dimension2' => $cat2->nombre,
            'correlation' => round($correlation, 4),
            'num_students' => count($student_scores),
            'interpretation' => $this->interpretCorrelation($correlation),
        ];
    }

    /**
     * Calculate correlation matrix for all dimensions
     */
    public function calculateCorrelationMatrix(int $test_vocacional_id): array
    {
        $categorias = CategoriaTest::where('test_vocacional_id', $test_vocacional_id)
            ->orderBy('orden')
            ->get();

        $correlation_matrix = [];

        for ($i = 0; $i < count($categorias); $i++) {
            for ($j = $i + 1; $j < count($categorias); $j++) {
                $corr = $this->calculateDimensionCorrelation($categorias[$i]->id, $categorias[$j]->id);

                if (!isset($corr['error'])) {
                    $correlation_matrix[] = $corr;
                }
            }
        }

        return [
            'test_id' => $test_vocacional_id,
            'correlations' => $correlation_matrix,
            'total_correlations' => count($correlation_matrix),
        ];
    }

    /**
     * Get descriptive statistics for a dimension
     */
    public function getDimensionDescriptives(int $categoria_test_id): array
    {
        $categoria = CategoriaTest::find($categoria_test_id);
        if (!$categoria) {
            return ['error' => 'Categoría no encontrada'];
        }

        $preguntas = PreguntaTest::where('categoria_test_id', $categoria_test_id)
            ->pluck('id')
            ->toArray();

        $respuestas = RespuestaTest::whereIn('pregunta_test_id', $preguntas)
            ->pluck('respuesta_seleccionada')
            ->map(fn($r) => floatval($r))
            ->toArray();

        if (empty($respuestas)) {
            return ['error' => 'Sin respuestas'];
        }

        sort($respuestas);

        $mean = array_sum($respuestas) / count($respuestas);
        $median = $this->calculateMedian($respuestas);
        $std_dev = $this->calculateStdDev($respuestas, $mean);
        $min = min($respuestas);
        $max = max($respuestas);
        $range = $max - $min;

        return [
            'dimension' => $categoria->nombre,
            'n' => count($respuestas),
            'mean' => round($mean, 4),
            'median' => round($median, 4),
            'std_dev' => round($std_dev, 4),
            'min' => round($min, 4),
            'max' => round($max, 4),
            'range' => round($range, 4),
            'q1' => round($this->calculateQuartile($respuestas, 0.25), 4),
            'q3' => round($this->calculateQuartile($respuestas, 0.75), 4),
        ];
    }

    /**
     * Get full psychometric report for a test
     */
    public function getFullPsychometricReport(int $test_vocacional_id): array
    {
        return [
            'test_id' => $test_vocacional_id,
            'cronbachs_alphas' => $this->calculateAllDimensionAlphas($test_vocacional_id),
            'correlation_matrix' => $this->calculateCorrelationMatrix($test_vocacional_id),
            'descriptive_statistics' => $this->getAllDimensionDescriptives($test_vocacional_id),
            'generated_at' => now()->toIso8601String(),
        ];
    }

    /**
     * Helper: Get descriptives for all dimensions
     */
    private function getAllDimensionDescriptives(int $test_vocacional_id): array
    {
        $categorias = CategoriaTest::where('test_vocacional_id', $test_vocacional_id)
            ->orderBy('orden')
            ->get();

        $descriptives = [];
        foreach ($categorias as $categoria) {
            $descriptives[] = $this->getDimensionDescriptives($categoria->id);
        }

        return $descriptives;
    }

    // ============ UTILITY FUNCTIONS ============

    /**
     * Calculate variance of an array
     */
    private function calculateVariance(array $values): float
    {
        $values = array_filter($values, fn($v) => !is_null($v));
        if (empty($values)) {
            return 0;
        }

        $mean = array_sum($values) / count($values);
        $squared_differences = array_map(fn($v) => pow($v - $mean, 2), $values);

        return array_sum($squared_differences) / count($values);
    }

    /**
     * Calculate Pearson correlation coefficient
     */
    private function calculatePearsonCorrelation(array $x, array $y): float
    {
        if (count($x) !== count($y) || count($x) < 2) {
            return 0;
        }

        $n = count($x);
        $mean_x = array_sum($x) / $n;
        $mean_y = array_sum($y) / $n;

        $numerator = 0;
        $sum_sq_x = 0;
        $sum_sq_y = 0;

        for ($i = 0; $i < $n; $i++) {
            $diff_x = $x[$i] - $mean_x;
            $diff_y = $y[$i] - $mean_y;

            $numerator += $diff_x * $diff_y;
            $sum_sq_x += $diff_x ** 2;
            $sum_sq_y += $diff_y ** 2;
        }

        $denominator = sqrt($sum_sq_x * $sum_sq_y);

        if ($denominator == 0) {
            return 0;
        }

        return $numerator / $denominator;
    }

    /**
     * Calculate median
     */
    private function calculateMedian(array $values): float
    {
        $count = count($values);
        $mid = intdiv($count, 2);

        if ($count % 2 === 0) {
            return ($values[$mid - 1] + $values[$mid]) / 2;
        }

        return $values[$mid];
    }

    /**
     * Calculate standard deviation
     */
    private function calculateStdDev(array $values, float $mean): float
    {
        if (empty($values)) {
            return 0;
        }

        $squared_differences = array_map(fn($v) => pow($v - $mean, 2), $values);
        $variance = array_sum($squared_differences) / count($values);

        return sqrt($variance);
    }

    /**
     * Calculate quartile
     */
    private function calculateQuartile(array $values, float $percentile): float
    {
        sort($values);
        $count = count($values);
        $position = ($percentile * ($count - 1));
        $lower = floor($position);
        $upper = ceil($position);

        if ($lower == $upper) {
            return $values[$lower];
        }

        $weight = $position - $lower;
        return $values[$lower] * (1 - $weight) + $values[$upper] * $weight;
    }

    /**
     * Interpret Cronbach's Alpha value
     */
    private function interpretAlpha(float $alpha): string
    {
        if ($alpha >= 0.90) {
            return 'Excellent - Possible redundancy';
        } elseif ($alpha >= 0.80) {
            return 'Good - Strong internal consistency';
        } elseif ($alpha >= 0.70) {
            return 'Acceptable - Adequate internal consistency';
        } elseif ($alpha >= 0.60) {
            return 'Questionable - Weak internal consistency';
        } elseif ($alpha >= 0.50) {
            return 'Poor - Very weak internal consistency';
        } else {
            return 'Unacceptable - No internal consistency';
        }
    }

    /**
     * Interpret correlation coefficient
     */
    private function interpretCorrelation(float $r): string
    {
        $abs_r = abs($r);

        if ($abs_r >= 0.90) {
            return 'Very Strong';
        } elseif ($abs_r >= 0.70) {
            return 'Strong';
        } elseif ($abs_r >= 0.50) {
            return 'Moderate';
        } elseif ($abs_r >= 0.30) {
            return 'Weak';
        } elseif ($abs_r >= 0.10) {
            return 'Very Weak';
        } else {
            return 'Negligible';
        }
    }
}
