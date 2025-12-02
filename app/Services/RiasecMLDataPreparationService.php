<?php

namespace App\Services;

use App\Models\User;
use App\Models\RespuestaTest;
use App\Models\CategoriaTest;
use App\Models\Carrera;
use Illuminate\Support\Collection;

class RiasecMLDataPreparationService
{
    /**
     * Extract RIASEC scores for all students who completed the test
     * Returns array with student_id, R, I, A, S, E, C scores (normalized 0-100)
     */
    public function extractRiasecScores(int $test_vocacional_id): Collection
    {
        // Get all categories (dimensions) for this test
        $categorias = CategoriaTest::where('test_vocacional_id', $test_vocacional_id)
            ->orderBy('orden')
            ->get();

        // Map categoria names to dimension codes
        $dimension_map = [
            'Realista' => 'R',
            'Investigador' => 'I',
            'Artístico' => 'A',
            'Social' => 'S',
            'Empresarial' => 'E',
            'Convencional' => 'C',
        ];

        // Get all students who answered all questions in this test
        $estudiantes = User::whereHas('respuestasTest.preguntaTest.categoriaTest', fn($q) => $q->where('test_vocacional_id', $test_vocacional_id))
            ->distinct()
            ->get();

        $data = [];

        foreach ($estudiantes as $estudiante) {
            $scores = [
                'student_id' => $estudiante->id,
                'student_name' => $estudiante->name,
            ];

            // Calculate score for each dimension
            foreach ($categorias as $categoria) {
                $respuestas = RespuestaTest::whereHas('preguntaTest', fn($q) => $q->where('categoria_test_id', $categoria->id))
                    ->where('estudiante_id', $estudiante->id)
                    ->pluck('respuesta_seleccionada')
                    ->map(fn($r) => floatval($r))
                    ->toArray();

                if (!empty($respuestas)) {
                    // Calculate mean for this dimension (already in scale 1-5)
                    $mean = array_sum($respuestas) / count($respuestas);

                    // Normalize to 0-100 scale
                    $normalized = (($mean - 1) / 4) * 100;

                    $dimension_code = $dimension_map[$categoria->nombre] ?? 'X';
                    $scores[$dimension_code] = round($normalized, 2);
                }
            }

            $data[] = $scores;
        }

        return collect($data);
    }

    /**
     * Create dataset for supervised learning (career prediction)
     * Links RIASEC scores to expected career for each student
     *
     * Returns: [student_id, R, I, A, S, E, C, carrera_id, carrera_nombre, compatibilidad]
     */
    public function createSuperviserDataset(int $test_vocacional_id): array
    {
        $riasec_scores = $this->extractRiasecScores($test_vocacional_id);
        $carreras = Carrera::where('activo', true)->get();

        $dataset = [];
        $metadata = [
            'total_samples' => 0,
            'total_features' => 6, // R, I, A, S, E, C
            'target_classes' => count($carreras),
        ];

        foreach ($riasec_scores as $student) {
            // Extract RIASEC scores
            $features = [
                'student_id' => $student['student_id'],
                'R' => $student['R'] ?? 0,
                'I' => $student['I'] ?? 0,
                'A' => $student['A'] ?? 0,
                'S' => $student['S'] ?? 0,
                'E' => $student['E'] ?? 0,
                'C' => $student['C'] ?? 0,
            ];

            // Find best matching career
            $best_carrera = null;
            $best_compatibility = 0;

            foreach ($carreras as $carrera) {
                $compatibility = $this->calculateRiasecCompatibility($features, $carrera);

                if ($compatibility > $best_compatibility) {
                    $best_compatibility = $compatibility;
                    $best_carrera = $carrera;
                }
            }

            if ($best_carrera && $best_compatibility > 0.5) {
                $dataset[] = [
                    ...$features,
                    'carrera_id' => $best_carrera->id,
                    'carrera_nombre' => $best_carrera->nombre,
                    'compatibilidad' => round($best_compatibility, 4),
                ];
                $metadata['total_samples']++;
            }
        }

        return [
            'dataset' => $dataset,
            'metadata' => $metadata,
            'train_split' => 0.8,
            'test_split' => 0.2,
            'description' => 'RIASEC scores mapped to careers for supervised learning (classification)',
        ];
    }

    /**
     * Create dataset for unsupervised learning (clustering)
     * Just returns RIASEC scores for all students
     */
    public function createUnsuperviserDataset(int $test_vocacional_id): array
    {
        $riasec_scores = $this->extractRiasecScores($test_vocacional_id);

        $dataset = [];
        foreach ($riasec_scores as $student) {
            $dataset[] = [
                'student_id' => $student['student_id'],
                'student_name' => $student['student_name'],
                'R' => $student['R'] ?? 0,
                'I' => $student['I'] ?? 0,
                'A' => $student['A'] ?? 0,
                'S' => $student['S'] ?? 0,
                'E' => $student['E'] ?? 0,
                'C' => $student['C'] ?? 0,
            ];
        }

        return [
            'dataset' => $dataset,
            'metadata' => [
                'total_samples' => count($dataset),
                'total_features' => 6, // R, I, A, S, E, C
                'recommended_clusters' => min(6, max(3, intval(sqrt(count($dataset) / 2)))),
            ],
            'description' => 'RIASEC scores for clustering analysis (K-Means, DBSCAN)',
        ];
    }

    /**
     * Calculate compatibility between RIASEC profile and career ideal profile
     * Uses Euclidean distance and cosine similarity
     */
    private function calculateRiasecCompatibility(array $student_scores, Carrera $carrera): float
    {
        $carrera_perfil = $carrera->perfil_ideal ?? [];

        if (empty($carrera_perfil)) {
            return 0;
        }

        // Map dimension codes to names
        $code_to_name = [
            'R' => 'Realista',
            'I' => 'Investigador',
            'A' => 'Artístico',
            'S' => 'Social',
            'E' => 'Empresarial',
            'C' => 'Convencional',
        ];

        // Extract student scores as vectors
        $student_vector = [];
        $carrera_vector = [];
        $dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];

        foreach ($dimensions as $dim) {
            $student_vector[] = $student_scores[$dim] / 100; // Normalize 0-1
            $dimension_name = $code_to_name[$dim];
            $carrera_vector[] = ($carrera_perfil[$dimension_name] ?? 3) / 5; // Normalize 0-1
        }

        // Calculate cosine similarity
        $dot_product = 0;
        $norm_student = 0;
        $norm_carrera = 0;

        for ($i = 0; $i < count($student_vector); $i++) {
            $dot_product += $student_vector[$i] * $carrera_vector[$i];
            $norm_student += $student_vector[$i] ** 2;
            $norm_carrera += $carrera_vector[$i] ** 2;
        }

        $norm_student = sqrt($norm_student);
        $norm_carrera = sqrt($norm_carrera);

        if ($norm_student == 0 || $norm_carrera == 0) {
            return 0;
        }

        $cosine_similarity = $dot_product / ($norm_student * $norm_carrera);

        // Ensure result is between 0 and 1
        return max(0, min(1, $cosine_similarity));
    }

    /**
     * Export dataset as CSV format
     */
    public function exportDatasetAsCsv(array $dataset, string $filename = 'riasec_dataset.csv'): string
    {
        if (empty($dataset['dataset'])) {
            return '';
        }

        $csv = '';
        $rows = $dataset['dataset'];
        $headers = array_keys($rows[0]);

        // Add headers
        $csv .= implode(',', $headers) . "\n";

        // Add rows
        foreach ($rows as $row) {
            $values = [];
            foreach ($headers as $header) {
                $value = $row[$header] ?? '';
                // Escape values with commas
                if (is_string($value) && strpos($value, ',') !== false) {
                    $value = '"' . str_replace('"', '""', $value) . '"';
                }
                $values[] = $value;
            }
            $csv .= implode(',', $values) . "\n";
        }

        return $csv;
    }

    /**
     * Get dataset statistics
     */
    public function getDatasetStatistics(array $dataset): array
    {
        $rows = $dataset['dataset'];

        if (empty($rows)) {
            return ['error' => 'Empty dataset'];
        }

        $stats = [
            'total_records' => count($rows),
            'features' => $dataset['metadata']['total_features'] ?? 0,
            'dimension_statistics' => [],
        ];

        // Calculate statistics for each dimension
        $dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];

        foreach ($dimensions as $dim) {
            $values = array_column($rows, $dim);
            $values = array_filter($values, fn($v) => !is_null($v) && $v !== '');

            if (!empty($values)) {
                $stats['dimension_statistics'][$dim] = [
                    'mean' => round(array_sum($values) / count($values), 2),
                    'min' => round(min($values), 2),
                    'max' => round(max($values), 2),
                    'std_dev' => round($this->calculateStdDev($values), 2),
                ];
            }
        }

        return $stats;
    }

    /**
     * Calculate standard deviation
     */
    private function calculateStdDev(array $values): float
    {
        if (empty($values)) {
            return 0;
        }

        $mean = array_sum($values) / count($values);
        $squared_differences = array_map(fn($v) => ($v - $mean) ** 2, $values);
        $variance = array_sum($squared_differences) / count($values);

        return sqrt($variance);
    }

    /**
     * Create train/test split
     */
    public function createTrainTestSplit(array $dataset, float $train_ratio = 0.8): array
    {
        $rows = $dataset['dataset'];
        $total = count($rows);
        $train_size = intval($total * $train_ratio);

        // Shuffle dataset
        shuffle($rows);

        return [
            'train' => array_slice($rows, 0, $train_size),
            'test' => array_slice($rows, $train_size),
            'train_size' => $train_size,
            'test_size' => $total - $train_size,
            'train_ratio' => round($train_size / $total, 4),
            'test_ratio' => round(($total - $train_size) / $total, 4),
        ];
    }

    /**
     * Get feature importance analysis
     */
    public function getFeatureImportance(array $dataset): array
    {
        $rows = $dataset['dataset'];
        $dimensions = ['R', 'I', 'A', 'S', 'E', 'C'];

        $importance = [];

        foreach ($dimensions as $dim) {
            $values = array_column($rows, $dim);
            $values = array_filter($values);

            $variance = $this->calculateVariance($values);
            $importance[] = [
                'dimension' => $dim,
                'variance' => round($variance, 4),
                'std_dev' => round(sqrt($variance), 4),
            ];
        }

        // Sort by variance (higher = more important)
        usort($importance, fn($a, $b) => $b['variance'] <=> $a['variance']);

        return [
            'feature_importance' => $importance,
            'description' => 'Variance-based feature importance for RIASEC dimensions',
        ];
    }

    /**
     * Calculate variance
     */
    private function calculateVariance(array $values): float
    {
        if (empty($values)) {
            return 0;
        }

        $mean = array_sum($values) / count($values);
        $squared_differences = array_map(fn($v) => ($v - $mean) ** 2, $values);

        return array_sum($squared_differences) / count($values);
    }
}
