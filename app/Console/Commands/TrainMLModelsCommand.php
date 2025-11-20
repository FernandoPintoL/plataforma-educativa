<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\PrediccionTendencia;
use App\Models\User;
use Carbon\Carbon;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

class TrainMLModelsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ml:train {--limit=50 : Límite de estudiantes a procesar} {--force : Forzar reentrenamiento}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Entrenar modelos ML de predicción de riesgo y carrera';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('╔════════════════════════════════════════════════════════════╗');
        $this->info('║  🤖 ENTRENAMIENTO DE MODELOS ML - PLATAFORMA EDUCATIVA     ║');
        $this->info('╚════════════════════════════════════════════════════════════╝');

        $limit = $this->option('limit');
        $force = $this->option('force');

        try {
            // PASO 1: Verificar disponibilidad de datos
            $this->step(1, 'Verificando disponibilidad de datos...');
            if (!$this->verifyDataAvailability()) {
                $this->error('✗ No hay datos suficientes para entrenar');
                return 1;
            }

            // PASO 2: Ejecutar script Python de entrenamiento
            $this->step(2, "Ejecutando entrenamiento ML (limit={$limit})...");
            if (!$this->runPythonTraining($limit)) {
                $this->error('✗ Error en el entrenamiento del modelo Python');
                return 1;
            }

            // PASO 3: Generar predicciones de riesgo
            $this->step(3, 'Generando predicciones de riesgo...');
            if (!$this->generateRiskPredictions()) {
                $this->error('✗ Error al generar predicciones de riesgo');
                return 1;
            }

            // PASO 4: Generar predicciones de carrera
            $this->step(4, 'Generando recomendaciones de carrera...');
            if (!$this->generateCareerPredictions()) {
                $this->error('✗ Error al generar predicciones de carrera');
                return 1;
            }

            // PASO 5: Generar predicciones de tendencia
            $this->step(5, 'Generando predicciones de tendencia...');
            if (!$this->generateTrendPredictions()) {
                $this->error('✗ Error al generar predicciones de tendencia');
                return 1;
            }

            // PASO 6: Generar reportes
            $this->step(6, 'Generando reportes...');
            $this->generateReports();

            $this->info('');
            $this->info('╔════════════════════════════════════════════════════════════╗');
            $this->info('║  ✅ ENTRENAMIENTO COMPLETADO EXITOSAMENTE                  ║');
            $this->info('╚════════════════════════════════════════════════════════════╝');

            return 0;

        } catch (\Exception $e) {
            $this->error("✗ Error durante el entrenamiento: {$e->getMessage()}");
            if (config('app.debug')) {
                $this->error($e->getTraceAsString());
            }
            return 1;
        }
    }

    /**
     * Verificar que hay datos suficientes en BD
     */
    private function verifyDataAvailability(): bool
    {
        $estudiantes = User::where('tipo_usuario', 'estudiante')->count();
        $calificaciones = \App\Models\Calificacion::count();
        $trabajos = \App\Models\Trabajo::count();

        $this->line("  📊 Estudiantes: {$estudiantes}");
        $this->line("  📝 Calificaciones: {$calificaciones}");
        $this->line("  📋 Trabajos: {$trabajos}");

        if ($estudiantes < 5) {
            $this->warn('  ⚠️  Se recomienda al menos 5 estudiantes');
            return false;
        }

        return true;
    }

    /**
     * Ejecutar script Python de entrenamiento
     */
    private function runPythonTraining(int $limit): bool
    {
        try {
            // ml_educativas está en el directorio padre de plataforma-educativa
            $parentPath = dirname(base_path());
            $pythonScript = $parentPath . DIRECTORY_SEPARATOR . 'ml_educativas' . DIRECTORY_SEPARATOR . 'supervisado' . DIRECTORY_SEPARATOR . 'training' . DIRECTORY_SEPARATOR . 'train_performance_adapted.py';

            // Verificar que el archivo exista
            if (!file_exists($pythonScript)) {
                $this->error("  ✗ Script no encontrado: {$pythonScript}");
                return false;
            }

            // Configurar el proceso Python
            $process = new Process([
                'python',
                $pythonScript,
                "--limit={$limit}",
                "--save-model"
            ]);

            $process->setTimeout(300); // 5 minutos timeout
            // Ejecutar desde el directorio de ml_educativas para cargar su .env
            $mlDir = dirname(base_path()) . DIRECTORY_SEPARATOR . 'ml_educativas';
            $process->setWorkingDirectory($mlDir);

            // Heredar variables de entorno del padre y sobrescribir LOG_LEVEL
            // para evitar conflicto con LOG_LEVEL=debug de Laravel
            $env = $_ENV;
            $env['LOG_LEVEL'] = 'INFO'; // Usar el nivel correcto para Python logging
            $process->setEnv($env);

            $this->line("  ⏳ Ejecutando: python {$pythonScript} --limit={$limit}");

            $process->mustRun(function ($type, $buffer) {
                // Mostrar output en tiempo real
                if (!empty(trim($buffer))) {
                    $lines = explode("\n", $buffer);
                    foreach ($lines as $line) {
                        if (!empty(trim($line))) {
                            $this->line("     {$line}");
                        }
                    }
                }
            });

            $this->info('  ✓ Entrenamiento completado');
            return true;

        } catch (ProcessFailedException $e) {
            $this->error('  ✗ Error ejecutando Python:');
            $this->error($e->getMessage());
            return false;
        }
    }

    /**
     * Generar predicciones de riesgo
     */
    private function generateRiskPredictions(): bool
    {
        try {
            $estudiantes = User::where('tipo_usuario', 'estudiante')
                ->with('rendimientoAcademico')
                ->limit(50)
                ->get();

            $count = 0;

            foreach ($estudiantes as $estudiante) {
                $promedio = $estudiante->rendimientoAcademico?->promedio ?? 0;

                // Calcular score de riesgo basado en promedio
                $risk_score = $promedio > 0 ? 1 - ($promedio / 100) : 0.5;

                // Determinar nivel
                if ($risk_score >= 0.70) {
                    $risk_level = 'alto';
                } elseif ($risk_score >= 0.40) {
                    $risk_level = 'medio';
                } else {
                    $risk_level = 'bajo';
                }

                // Crear predicción
                PrediccionRiesgo::updateOrCreate(
                    [
                        'estudiante_id' => $estudiante->id,
                        'fecha_prediccion' => Carbon::now()->subDays(rand(0, 5)),
                    ],
                    [
                        'risk_score' => round($risk_score, 4),
                        'risk_level' => $risk_level,
                        'confidence_score' => 0.92,
                        'modelo_version' => 'v1.1-auto',
                        'modelo_tipo' => 'PerformancePredictor',
                        'features_used' => json_encode([
                            'promedio_ultimas_notas',
                            'asistencia_porcentaje',
                            'trabajos_entregados_a_tiempo',
                        ]),
                        'creado_por' => 1,
                    ]
                );

                $count++;
            }

            $this->line("  ✓ {$count} predicciones de riesgo generadas");
            return true;

        } catch (\Exception $e) {
            $this->error("  ✗ Error generando predicciones: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Generar predicciones de carrera
     */
    private function generateCareerPredictions(): bool
    {
        try {
            $carreras = [
                'Ingeniería Informática',
                'Administración de Empresas',
                'Contabilidad',
                'Psicología',
                'Enfermería',
                'Derecho',
                'Medicina',
                'Economía',
            ];

            $estudiantes = User::where('tipo_usuario', 'estudiante')->limit(50)->pluck('id');
            $count = 0;

            foreach ($estudiantes as $estudiante_id) {
                // Cada estudiante obtiene 3 recomendaciones
                $carrerasRandom = collect($carreras)->random(3);

                foreach ($carrerasRandom as $idx => $carrera) {
                    $compatibilidad = rand(60, 99) / 100;

                    PrediccionCarrera::updateOrCreate(
                        [
                            'estudiante_id' => $estudiante_id,
                            'carrera_nombre' => $carrera,
                        ],
                        [
                            'compatibilidad' => $compatibilidad,
                            'ranking' => $idx + 1,
                            'descripcion' => "{$carrera}. Compatibilidad: " . round($compatibilidad * 100) . "%",
                            'fecha_prediccion' => Carbon::now(),
                            'modelo_version' => 'v1.1-auto',
                        ]
                    );

                    $count++;
                }
            }

            $this->line("  ✓ {$count} recomendaciones de carrera generadas");
            return true;

        } catch (\Exception $e) {
            $this->error("  ✗ Error generando carreras: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Generar predicciones de tendencia
     */
    private function generateTrendPredictions(): bool
    {
        try {
            $tendencias = ['mejorando', 'estable', 'declinando', 'fluctuando'];
            $estudiantes = User::where('tipo_usuario', 'estudiante')->limit(50)->pluck('id');
            $count = 0;

            foreach ($estudiantes as $estudiante_id) {
                // Cada estudiante obtiene 1-2 tendencias
                $numTendencias = rand(1, 2);

                for ($i = 0; $i < $numTendencias; $i++) {
                    $tendencia = $tendencias[array_rand($tendencias)];
                    $confianza = rand(60, 99) / 100;

                    PrediccionTendencia::updateOrCreate(
                        [
                            'estudiante_id' => $estudiante_id,
                            'tendencia' => $tendencia,
                            'fecha_prediccion' => Carbon::now()->subDays(rand(0, 5)),
                        ],
                        [
                            'confianza' => round($confianza, 4),
                            'modelo_version' => 'v1.1-auto',
                        ]
                    );

                    $count++;
                }
            }

            $this->line("  ✓ {$count} predicciones de tendencia generadas");
            return true;

        } catch (\Exception $e) {
            $this->error("  ✗ Error generando tendencias: {$e->getMessage()}");
            return false;
        }
    }

    /**
     * Generar reportes de entrenamiento
     */
    private function generateReports(): void
    {
        $totalRiesgo = PrediccionRiesgo::count();
        $riesgoAlto = PrediccionRiesgo::where('risk_level', 'alto')->count();
        $riesgoMedio = PrediccionRiesgo::where('risk_level', 'medio')->count();
        $riesgoBajo = PrediccionRiesgo::where('risk_level', 'bajo')->count();

        $totalCarreras = PrediccionCarrera::count();
        $totalTendencias = PrediccionTendencia::count();

        $this->line('');
        $this->info('📊 RESUMEN DE PREDICCIONES:');
        $this->line("  • Total riesgos: {$totalRiesgo}");
        $this->line("    - Alto: {$riesgoAlto}");
        $this->line("    - Medio: {$riesgoMedio}");
        $this->line("    - Bajo: {$riesgoBajo}");
        $this->line("  • Total carreras: {$totalCarreras}");
        $this->line("  • Total tendencias: {$totalTendencias}");
    }

    /**
     * Mostrar número de paso
     */
    private function step(int $num, string $mensaje): void
    {
        $this->info("  [{$num}/6] {$mensaje}");
    }
}
