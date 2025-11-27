<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\MLPredictionService;
use App\Services\PredictionValidator;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class TestMLPredictions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ml:test-predictions
                            {--student-id= : ID del estudiante a probar (si no especifica, usa el primero)}
                            {--count=5 : Cantidad de estudiantes a probar}
                            {--verbose : Mostrar detalles completos}';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Testear predicciones ML y validación de coherencia';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🧪 Testing ML Predictions Service\n');

        $mlService = new MLPredictionService();

        // Verificar salud del servicio
        $this->line('Checking ML Service health...');
        try {
            $health = $mlService->healthCheck();
            $this->info("✓ ML Service is healthy: {$health['status']}\n");
        } catch (\Exception $e) {
            $this->error("✗ ML Service unavailable: {$e->getMessage()}");
            $this->error("Make sure FastAPI is running on http://localhost:8001\n");
            return 1;
        }

        // Obtener estudiantes a testear
        if ($studentId = $this->option('student-id')) {
            $students = User::where('id', $studentId)
                ->where('tipo_usuario', 'estudiante')
                ->limit(1)
                ->get();

            if ($students->isEmpty()) {
                $this->error("No student found with ID: $studentId");
                return 1;
            }
        } else {
            $count = $this->option('count');
            $students = User::where('tipo_usuario', 'estudiante')
                ->limit($count)
                ->get();

            if ($students->isEmpty()) {
                $this->error("No students found in database");
                return 1;
            }
        }

        $this->line("Testing {$students->count()} students...\n");

        // Testear cada estudiante
        $results = [
            'total' => 0,
            'successful' => 0,
            'with_issues' => 0,
            'failed' => 0,
            'students' => []
        ];

        foreach ($students as $student) {
            $results['total']++;

            try {
                $this->testStudent($student, $mlService, $results);
            } catch (\Exception $e) {
                $results['failed']++;
                $this->error("✗ Error testing student {$student->id}: {$e->getMessage()}");
            }
        }

        // Resumen
        $this->printSummary($results);

        return 0;
    }

    private function testStudent(User $student, MLPredictionService $mlService, array &$results): void
    {
        $verbose = $this->option('verbose');

        $this->line("\n" . str_repeat('=', 80));
        $this->line("Testing Student ID: {$student->id} - {$student->nombre_completo}");
        $this->line(str_repeat('=', 80));

        // Extraer features
        $this->line("→ Extracting student features...");
        $features = $mlService->extractStudentFeatures($student);

        if ($verbose) {
            $this->table(['Feature', 'Value'], array_map(
                fn($k, $v) => [$k, is_numeric($v) ? round($v, 4) : $v],
                array_keys($features),
                array_values($features)
            ));
        }

        // Hacer predicción
        $this->line("→ Making predictions...");

        try {
            $allPredictions = $mlService->predictAndSave($student);

            // Mostrar predicciones
            if (isset($allPredictions['risk'])) {
                $this->printRiskPrediction($allPredictions['risk']);
            }

            if (isset($allPredictions['carrera'])) {
                $this->printCareerPrediction($allPredictions['carrera']);
            }

            if (isset($allPredictions['tendencia'])) {
                $this->printTrendPrediction($allPredictions['tendencia']);
            }

            // Mostrar validación
            if (isset($allPredictions['validation'])) {
                $this->printValidation($allPredictions['validation']);

                if ($allPredictions['coherent']) {
                    $results['successful']++;
                } else {
                    $results['with_issues']++;
                }
            }

            $results['students'][] = [
                'id' => $student->id,
                'name' => $student->nombre_completo,
                'coherent' => $allPredictions['coherent'] ?? false,
                'inconsistencies' => count($allPredictions['validation']['inconsistencies'] ?? [])
            ];

        } catch (\Exception $e) {
            $results['failed']++;
            $this->error("Error: {$e->getMessage()}");
        }
    }

    private function printRiskPrediction(array $risk): void
    {
        $level = $risk['nivel_riesgo'] ?? 'unknown';
        $score = $risk['score_riesgo'] ?? 0;
        $confidence = $risk['confianza'] ?? 0;

        $levelIcon = match($level) {
            'alto' => '🔴',
            'medio' => '🟡',
            'bajo' => '🟢',
            default => '⚪'
        };

        $this->line("\n📊 RISK PREDICTION:");
        $this->line("  {$levelIcon} Level: {$level} (score: {$score} | confidence: {$confidence})");

        if (isset($risk['caracteristicas_importancia']) && !empty($risk['caracteristicas_importancia'])) {
            $this->line("  Top Features:");
            $sorted = array_slice(
                $risk['caracteristicas_importancia'],
                0,
                3,
                true
            );
            foreach ($sorted as $feature => $importance) {
                $bar = str_repeat('█', (int)($importance * 20));
                $this->line("    • {$feature}: {$bar} {$importance}");
            }
        }
    }

    private function printCareerPrediction(array $career): void
    {
        $this->line("\n🎓 CAREER PREDICTION:");
        $this->line("  Career: " . ($career['carrera_nombre'] ?? 'N/A'));
        $this->line("  Compatibility: " . ($career['compatibilidad'] ?? 0));
        $this->line("  Confidence: " . ($career['confianza'] ?? 0));
    }

    private function printTrendPrediction(array $trend): void
    {
        $trendType = $trend['tendencia'] ?? 'unknown';

        $icon = match($trendType) {
            'mejorando' => '📈',
            'estable' => '➡️',
            'declinando' => '📉',
            'fluctuando' => '↔️',
            default => '❓'
        };

        $this->line("\n📈 TREND PREDICTION:");
        $this->line("  {$icon} Trend: {$trendType}");
        $this->line("  Confidence: " . ($trend['confianza'] ?? 0));
    }

    private function printValidation(array $validation): void
    {
        $this->line("\n✓ VALIDATION RESULTS:");

        if ($validation['is_coherent']) {
            $this->info("  ✓ All predictions are COHERENT");
        } else {
            $this->warn("  ⚠ Incoherencies detected: {$validation['inconsistencies_count']}");

            foreach ($validation['inconsistencies'] as $inc) {
                $icon = match($inc['severity']) {
                    'error' => '🔴',
                    'warning' => '🟡',
                    'info' => '🔵',
                    default => '⚪'
                };

                $this->line("    {$icon} [{$inc['type']}] {$inc['message']}");

                if ($details = $inc['details'] ?? null) {
                    $this->line("       Details: " . json_encode($details));
                }
            }
        }

        $this->line("  Recommended action: {$validation['recommendation_action']}");
    }

    private function printSummary(array $results): void
    {
        $this->line("\n" . str_repeat('=', 80));
        $this->info("SUMMARY");
        $this->line(str_repeat('=', 80));

        $this->table(
            ['Metric', 'Count'],
            [
                ['Total Students', $results['total']],
                ['Successful (Coherent)', $results['successful']],
                ['With Issues', $results['with_issues']],
                ['Failed', $results['failed']],
            ]
        );

        if ($results['successful'] > 0) {
            $percentage = ($results['successful'] / $results['total']) * 100;
            $this->info("✓ Success rate: {$percentage}%");
        }

        if ($results['with_issues'] > 0) {
            $this->warn("⚠ {$results['with_issues']} students have prediction inconsistencies");
        }

        if ($results['failed'] > 0) {
            $this->error("✗ {$results['failed']} students failed");
        }

        // Guardar log
        Log::info('ML Predictions Test Summary', $results);
        $this->info("\nTest log saved to logs/laravel.log");
    }
}
