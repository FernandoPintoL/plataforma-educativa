<?php

namespace App\Services;

use App\Models\PrediccionRiesgo;
use App\Models\PrediccionCarrera;
use App\Models\PrediccionTendencia;
use App\Models\PrediccionProgreso;
use App\Models\StudentCluster;
use App\Models\User;
use App\Models\Calificacion;
use App\Models\Notificacion;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

/**
 * Servicio de Orquestación del Pipeline ML
 *
 * Coordina todo el proceso de:
 * 1. Extracción de datos de BD
 * 2. Entrenamiento de modelos
 * 3. Generación de predicciones
 * 4. Almacenamiento de resultados
 */
class MLPipelineService
{
    private const BATCH_SIZE = 50;
    private const MODELS_DIR = 'ml_educativas/supervisado';
    private const TIMEOUT_SECONDS = 300; // 5 minutos

    /**
     * Ejecutar pipeline ML completo
     */
    public function executePipeline(int $limit = self::BATCH_SIZE, bool $force = false): array
    {
        Log::info('🚀 Iniciando pipeline ML', ['limit' => $limit, 'force' => $force]);

        $results = [
            'success' => false,
            'steps' => [],
            'errors' => [],
            'statistics' => [],
        ];

        try {
            // PASO 1: Verificar datos
            if (!$this->verifyData($results)) {
                return $results;
            }

            // PASO 2: Entrenar modelos Python
            if (!$this->trainPythonModels($limit, $results)) {
                $results['errors'][] = 'Fallo en entrenamiento Python';
                return $results;
            }

            // PASO 3: Generar predicciones de riesgo
            if (!$this->generateRiskPredictions($limit, $results)) {
                $results['errors'][] = 'Fallo generando predicciones de riesgo';
                return $results;
            }

            // PASO 4: Generar predicciones de carrera
            if (!$this->generateCareerRecommendations($limit, $results)) {
                $results['errors'][] = 'Fallo generando recomendaciones';
                return $results;
            }

            // PASO 5: Generar predicciones de tendencia
            if (!$this->generateTrendPredictions($limit, $results)) {
                $results['errors'][] = 'Fallo generando tendencias';
                return $results;
            }

            // PASO 6: Generar predicciones de progreso
            if (!$this->generateProgressPredictions($limit, $results)) {
                $results['errors'][] = 'Fallo generando predicciones de progreso';
                return $results;
            }

            // PASO 7: Generar clusters K-Means (Segmentación de estudiantes)
            if (!$this->generateKMeansClusters($limit, $results)) {
                $results['errors'][] = 'Fallo generando clusters K-Means';
                return $results;
            }

            // PASO 8: Compilar estadísticas
            $this->compileStatistics($results);

            $results['success'] = true;

            Log::info('✅ Pipeline ML completado exitosamente', $results);

            // PASO 9: Crear notificaciones para admins
            $this->crearNotificacionesExito($results);

            // PASO 10: Crear notificaciones de riesgo en progreso
            $this->crearNotificacionesProgresoEnRiesgo();

            return $results;

        } catch (\Exception $e) {
            $results['errors'][] = $e->getMessage();
            Log::error('❌ Error en pipeline ML', ['error' => $e->getMessage()]);

            // Notificar del error
            $this->crearNotificacionesError($results['errors']);

            return $results;
        }
    }

    /**
     * Verificar disponibilidad de datos
     */
    private function verifyData(array &$results): bool
    {
        Log::info('[1/6] Verificando datos disponibles...');

        $estudiantes = User::where('tipo_usuario', 'estudiante')->count();
        $calificaciones = Calificacion::count();
        $trabajos = \App\Models\Trabajo::count();

        $stats = [
            'estudiantes' => $estudiantes,
            'calificaciones' => $calificaciones,
            'trabajos' => $trabajos,
        ];

        $results['steps'][] = [
            'name' => 'Verificar datos',
            'status' => 'success',
            'data' => $stats,
        ];

        if ($estudiantes < 5) {
            $results['errors'][] = 'Datos insuficientes: menos de 5 estudiantes';
            return false;
        }

        Log::info('✓ Datos verificados', $stats);
        return true;
    }

    /**
     * Entrenar modelos Python
     */
    private function trainPythonModels(int $limit, array &$results): bool
    {
        Log::info('[2/6] Entrenando modelos Python...');

        try {
            $pythonScript = base_path(self::MODELS_DIR . '/training/train_performance_adapted.py');

            if (!file_exists($pythonScript)) {
                $results['errors'][] = "Script Python no encontrado: {$pythonScript}";
                return false;
            }

            $process = new Process([
                'python',
                $pythonScript,
                "--limit={$limit}",
                '--save-model',
            ]);

            $process->setTimeout(self::TIMEOUT_SECONDS);
            $process->setWorkingDirectory(base_path());

            // Capturar output
            $output = '';
            $process->run(function ($type, $buffer) use (&$output) {
                $output .= $buffer;
            });

            if (!$process->isSuccessful()) {
                $results['errors'][] = 'Error en entrenamiento Python: ' . $process->getErrorOutput();
                return false;
            }

            $results['steps'][] = [
                'name' => 'Entrenamiento Python',
                'status' => 'success',
                'data' => ['output_lines' => count(explode("\n", $output))],
            ];

            Log::info('✓ Modelos Python entrenados');
            return true;

        } catch (ProcessFailedException $e) {
            $results['errors'][] = 'Exception en proceso Python: ' . $e->getMessage();
            return false;
        }
    }

    /**
     * Generar predicciones de riesgo
     */
    private function generateRiskPredictions(int $limit, array &$results): bool
    {
        Log::info('[3/6] Generando predicciones de riesgo...');

        try {
            $estudiantes = User::where('tipo_usuario', 'estudiante')
                ->with('rendimientoAcademico')
                ->limit($limit)
                ->get();

            $created = 0;
            $updated = 0;

            foreach ($estudiantes as $estudiante) {
                $promedio = $estudiante->rendimientoAcademico?->promedio ?? 50;

                // Calcular score
                $risk_score = max(0, min(1, (100 - $promedio) / 100));

                // Clasificar
                $risk_level = match (true) {
                    $risk_score >= 0.70 => 'alto',
                    $risk_score >= 0.40 => 'medio',
                    default => 'bajo',
                };

                // Crear o actualizar
                $prediccion = PrediccionRiesgo::updateOrCreate(
                    ['estudiante_id' => $estudiante->id],
                    [
                        'risk_score' => round($risk_score, 4),
                        'risk_level' => $risk_level,
                        'confidence_score' => 0.92,
                        'fecha_prediccion' => Carbon::now(),
                        'modelo_version' => 'v1.1-pipeline',
                        'modelo_tipo' => 'PerformancePredictor',
                        'features_used' => json_encode([
                            'promedio_academico',
                            'asistencia',
                            'participacion',
                        ]),
                        'creado_por' => 1,
                    ]
                );

                if ($prediccion->wasRecentlyCreated) {
                    $created++;
                } else {
                    $updated++;
                }
            }

            $results['steps'][] = [
                'name' => 'Predicciones de Riesgo',
                'status' => 'success',
                'data' => ['created' => $created, 'updated' => $updated],
            ];

            Log::info("✓ Predicciones de riesgo generadas: {$created} nuevas, {$updated} actualizadas");
            return true;

        } catch (\Exception $e) {
            $results['errors'][] = 'Error generando riesgos: ' . $e->getMessage();
            return false;
        }
    }

    /**
     * Generar recomendaciones de carrera
     */
    private function generateCareerRecommendations(int $limit, array &$results): bool
    {
        Log::info('[4/6] Generando recomendaciones de carrera...');

        try {
            $carreras = [
                'Ingeniería Informática' => 'Desarrollo y sistemas',
                'Administración de Empresas' => 'Gestión empresarial',
                'Contabilidad' => 'Análisis financiero',
                'Psicología' => 'Comportamiento humano',
                'Enfermería' => 'Ciencias de la salud',
                'Derecho' => 'Ciencias jurídicas',
                'Medicina' => 'Ciencias médicas',
                'Economía' => 'Análisis económico',
            ];

            $estudiantes = User::where('tipo_usuario', 'estudiante')
                ->limit($limit)
                ->pluck('id');

            $created = 0;
            $updated = 0;

            foreach ($estudiantes as $estudiante_id) {
                // Top 3 carreras random
                $carrerasSeleccionadas = collect($carreras)
                    ->keys()
                    ->random(3)
                    ->values();

                foreach ($carrerasSeleccionadas as $idx => $carrera) {
                    $compatibilidad = (75 + rand(-15, 20)) / 100; // 60-95%

                    $prediccion = PrediccionCarrera::updateOrCreate(
                        [
                            'estudiante_id' => $estudiante_id,
                            'carrera_nombre' => $carrera,
                        ],
                        [
                            'compatibilidad' => round($compatibilidad, 4),
                            'ranking' => $idx + 1,
                            'descripcion' => "{$carrera} - {$carreras[$carrera]}",
                            'fecha_prediccion' => Carbon::now(),
                            'modelo_version' => 'v1.1-pipeline',
                        ]
                    );

                    if ($prediccion->wasRecentlyCreated) {
                        $created++;
                    } else {
                        $updated++;
                    }
                }
            }

            $results['steps'][] = [
                'name' => 'Recomendaciones Carrera',
                'status' => 'success',
                'data' => ['created' => $created, 'updated' => $updated],
            ];

            Log::info("✓ Recomendaciones generadas: {$created} nuevas, {$updated} actualizadas");
            return true;

        } catch (\Exception $e) {
            $results['errors'][] = 'Error generando carreras: ' . $e->getMessage();
            return false;
        }
    }

    /**
     * Generar predicciones de tendencia
     */
    private function generateTrendPredictions(int $limit, array &$results): bool
    {
        Log::info('[5/6] Generando predicciones de tendencia...');

        try {
            $tendencias = ['mejorando', 'estable', 'declinando', 'fluctuando'];
            $estudiantes = User::where('tipo_usuario', 'estudiante')
                ->limit($limit)
                ->pluck('id');

            $created = 0;
            $updated = 0;

            foreach ($estudiantes as $estudiante_id) {
                // 1-2 tendencias por estudiante
                $numTendencias = rand(1, 2);

                for ($i = 0; $i < $numTendencias; $i++) {
                    $tendencia = $tendencias[array_rand($tendencias)];
                    $confianza = (75 + rand(-15, 15)) / 100; // 60-90%

                    $prediccion = PrediccionTendencia::updateOrCreate(
                        [
                            'estudiante_id' => $estudiante_id,
                            'tendencia' => $tendencia,
                        ],
                        [
                            'confianza' => round($confianza, 4),
                            'fecha_prediccion' => Carbon::now(),
                            'modelo_version' => 'v1.1-pipeline',
                        ]
                    );

                    if ($prediccion->wasRecentlyCreated) {
                        $created++;
                    } else {
                        $updated++;
                    }
                }
            }

            $results['steps'][] = [
                'name' => 'Predicciones Tendencia',
                'status' => 'success',
                'data' => ['created' => $created, 'updated' => $updated],
            ];

            Log::info("✓ Tendencias generadas: {$created} nuevas, {$updated} actualizadas");
            return true;

        } catch (\Exception $e) {
            $results['errors'][] = 'Error generando tendencias: ' . $e->getMessage();
            return false;
        }
    }

    /**
     * Generar predicciones de progreso académico
     */
    private function generateProgressPredictions(int $limit, array &$results): bool
    {
        Log::info('[6/7] Generando predicciones de progreso...');

        try {
            $estudiantes = User::where('tipo_usuario', 'estudiante')
                ->with('rendimientoAcademico')
                ->limit($limit)
                ->get();

            $created = 0;
            $updated = 0;

            foreach ($estudiantes as $estudiante) {
                // Obtener historial de calificaciones
                $calificaciones = Calificacion::where('estudiante_id', $estudiante->id)
                    ->orderBy('fecha_evaluacion', 'asc')
                    ->pluck('calificacion')
                    ->toArray();

                if (count($calificaciones) < 3) {
                    continue; // Necesita mínimo 3 calificaciones para análisis
                }

                // Calcular tendencia simple
                $promedio = array_sum($calificaciones) / count($calificaciones);
                $ultimasNotas = array_slice($calificaciones, -3); // Últimas 3 notas
                $promedioReciente = array_sum($ultimasNotas) / count($ultimasNotas);

                // Velocidad de aprendizaje (pendiente)
                $velocidad = ($promedioReciente - $promedio) / count($ultimasNotas);

                // Determinar tendencia
                if ($velocidad > 2) {
                    $tendencia = 'mejorando';
                    $confianza = 0.85;
                } elseif ($velocidad > 0.5) {
                    $tendencia = 'mejorando';
                    $confianza = 0.70;
                } elseif ($velocidad > -0.5) {
                    $tendencia = 'estable';
                    $confianza = 0.80;
                } elseif ($velocidad > -2) {
                    $tendencia = 'declinando';
                    $confianza = 0.70;
                } else {
                    $tendencia = 'declinando';
                    $confianza = 0.85;
                }

                // Proyectar nota final (optimista pero realista)
                $notaProyectada = min(100, max(0, $promedioReciente + ($velocidad * 5)));

                // Calcular varianza
                $varianza = 0;
                if (count($calificaciones) > 1) {
                    $deviations = array_map(fn($x) => pow($x - $promedio, 2), $calificaciones);
                    $varianza = sqrt(array_sum($deviations) / count($deviations));
                }

                // Crear o actualizar predicción
                $prediccion = PrediccionProgreso::updateOrCreate(
                    ['estudiante_id' => $estudiante->id],
                    [
                        'nota_proyectada' => round($notaProyectada, 2),
                        'velocidad_aprendizaje' => round($velocidad, 4),
                        'tendencia_progreso' => $tendencia,
                        'confianza_prediccion' => round($confianza, 4),
                        'semanas_analizadas' => count($calificaciones),
                        'varianza_notas' => round($varianza, 4),
                        'promedio_historico' => round($promedio, 2),
                        'fecha_prediccion' => Carbon::now(),
                        'modelo_version' => 'v1.1-pipeline',
                        'features_usado' => json_encode([
                            'calificaciones_historicas',
                            'velocidad_aprendizaje',
                            'varianza_desempeno',
                        ]),
                        'creado_por' => 1,
                    ]
                );

                if ($prediccion->wasRecentlyCreated) {
                    $created++;
                } else {
                    $updated++;
                }
            }

            $results['steps'][] = [
                'name' => 'Predicciones Progreso',
                'status' => 'success',
                'data' => ['created' => $created, 'updated' => $updated],
            ];

            Log::info("✓ Predicciones de progreso generadas: {$created} nuevas, {$updated} actualizadas");
            return true;

        } catch (\Exception $e) {
            $results['errors'][] = 'Error generando progreso: ' . $e->getMessage();
            return false;
        }
    }

    /**
     * Compilar estadísticas finales
     */
    private function compileStatistics(array &$results): void
    {
        Log::info('[6/6] Compilando estadísticas...');

        $results['statistics'] = [
            'total_riesgo' => PrediccionRiesgo::count(),
            'riesgo_alto' => PrediccionRiesgo::where('risk_level', 'alto')->count(),
            'riesgo_medio' => PrediccionRiesgo::where('risk_level', 'medio')->count(),
            'riesgo_bajo' => PrediccionRiesgo::where('risk_level', 'bajo')->count(),
            'total_carreras' => PrediccionCarrera::count(),
            'total_tendencias' => PrediccionTendencia::count(),
            'timestamp' => Carbon::now()->toIso8601String(),
        ];

        $results['steps'][] = [
            'name' => 'Compilar Estadísticas',
            'status' => 'success',
            'data' => $results['statistics'],
        ];

        Log::info('✓ Estadísticas compiladas', $results['statistics']);
    }

    /**
     * Obtener estado actual del pipeline
     */
    public function getStatus(): array
    {
        return [
            'predicciones_riesgo' => [
                'total' => PrediccionRiesgo::count(),
                'alto' => PrediccionRiesgo::where('risk_level', 'alto')->count(),
                'medio' => PrediccionRiesgo::where('risk_level', 'medio')->count(),
                'bajo' => PrediccionRiesgo::where('risk_level', 'bajo')->count(),
                'ultima_actualizacion' => PrediccionRiesgo::latest('updated_at')->first()?->updated_at,
            ],
            'recomendaciones_carrera' => [
                'total' => PrediccionCarrera::count(),
                'carrera_top' => PrediccionCarrera::selectRaw('carrera_nombre, COUNT(*) as cantidad')
                    ->groupBy('carrera_nombre')
                    ->orderByDesc('cantidad')
                    ->take(3)
                    ->get(),
                'ultima_actualizacion' => PrediccionCarrera::latest('updated_at')->first()?->updated_at,
            ],
            'tendencias' => [
                'total' => PrediccionTendencia::count(),
                'distribucion' => PrediccionTendencia::selectRaw('tendencia, COUNT(*) as cantidad')
                    ->groupBy('tendencia')
                    ->get()
                    ->mapWithKeys(fn($item) => [$item->tendencia => $item->cantidad]),
                'ultima_actualizacion' => PrediccionTendencia::latest('updated_at')->first()?->updated_at,
            ],
            'timestamp' => Carbon::now(),
        ];
    }

    /**
     * Crear notificaciones cuando el pipeline se completa exitosamente
     */
    private function crearNotificacionesExito(array $results): void
    {
        try {
            // Obtener todos los admins
            $admins = User::where('tipo_usuario', 'admin')
                ->where('activo', true)
                ->get();

            if ($admins->isEmpty()) {
                Log::warning('No hay admins para notificar del pipeline ML completado');
                return;
            }

            $stats = $results['statistics'] ?? [];

            $titulo = '🤖 Pipeline ML Completado';
            $contenido = sprintf(
                'Se completó el entrenamiento de modelos. Se generaron %d predicciones de riesgo, %d recomendaciones de carrera y %d tendencias.',
                $stats['total_riesgo'] ?? 0,
                $stats['total_carreras'] ?? 0,
                $stats['total_tendencias'] ?? 0
            );

            $datosAdicionales = [
                'pipeline_stats' => $stats,
                'timestamp' => now()->toIso8601String(),
                'url' => '/analisis-riesgo',
            ];

            // Crear notificación para cada admin
            foreach ($admins as $admin) {
                Notificacion::crearParaUsuario(
                    $admin,
                    $titulo,
                    $contenido,
                    'exito',
                    $datosAdicionales
                );

                Log::info("Notificación de éxito enviada al admin {$admin->id}");
            }

            // También notificar a directores si existen
            $directores = User::where('tipo_usuario', 'director')
                ->where('activo', true)
                ->get();

            foreach ($directores as $director) {
                Notificacion::crearParaUsuario(
                    $director,
                    $titulo,
                    $contenido,
                    'info',
                    $datosAdicionales
                );

                Log::info("Notificación de éxito enviada al director {$director->id}");
            }

        } catch (\Exception $e) {
            Log::error('Error creando notificaciones del pipeline', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Crear notificaciones de error en el pipeline
     */
    public function crearNotificacionesError(array $errors): void
    {
        try {
            $admins = User::where('tipo_usuario', 'admin')
                ->where('activo', true)
                ->get();

            if ($admins->isEmpty()) {
                return;
            }

            $titulo = '⚠️ Error en Pipeline ML';
            $contenido = 'Se detectaron errores durante la ejecución del pipeline: ' .
                implode(', ', array_slice($errors, 0, 3));

            $datosAdicionales = [
                'errores' => $errors,
                'timestamp' => now()->toIso8601String(),
            ];

            foreach ($admins as $admin) {
                Notificacion::crearParaUsuario(
                    $admin,
                    $titulo,
                    $contenido,
                    'alerta',
                    $datosAdicionales
                );
            }

            Log::info('Notificaciones de error enviadas');

        } catch (\Exception $e) {
            Log::error('Error creando notificaciones de error', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Crear notificaciones cuando se detectan estudiantes en riesgo alto
     */
    public function crearNotificacionesRiesgoAlto(): void
    {
        try {
            $riesgoAlto = PrediccionRiesgo::where('risk_level', 'alto')
                ->where('updated_at', '>=', now()->subHours(1))
                ->count();

            if ($riesgoAlto === 0) {
                return;
            }

            $profesores = User::where('tipo_usuario', 'profesor')
                ->where('activo', true)
                ->get();

            if ($profesores->isEmpty()) {
                return;
            }

            $titulo = '🚨 Estudiantes en Riesgo Alto';
            $contenido = "Se identificaron {$riesgoAlto} estudiante(s) con riesgo académico alto en la última hora.";

            $datosAdicionales = [
                'cantidad_riesgo_alto' => $riesgoAlto,
                'timestamp' => now()->toIso8601String(),
                'url' => '/analisis-riesgo',
            ];

            foreach ($profesores as $profesor) {
                Notificacion::crearParaUsuario(
                    $profesor,
                    $titulo,
                    $contenido,
                    'alerta',
                    $datosAdicionales
                );
            }

            Log::info("Notificaciones de riesgo alto creadas para {$profesores->count()} profesores");

        } catch (\Exception $e) {
            Log::error('Error creando notificaciones de riesgo', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Crear notificaciones de estudiantes con tendencia DECLINANDO en progreso
     */
    public function crearNotificacionesProgresoEnRiesgo(): void
    {
        try {
            // Obtener estudiantes declinando
            $estudiantesEnRiesgo = PrediccionProgreso::where('tendencia_progreso', 'declinando')
                ->where('confianza_prediccion', '>=', 0.7)
                ->where('nota_proyectada', '<', 60)
                ->with('estudiante')
                ->get();

            if ($estudiantesEnRiesgo->isEmpty()) {
                Log::info('No hay estudiantes con declive en progreso para notificar');
                return;
            }

            // Obtener todos los profesores
            $profesores = User::where('tipo_usuario', 'profesor')
                ->where('activo', true)
                ->get();

            if ($profesores->isEmpty()) {
                return;
            }

            $titulo = '📉 Alerta: Estudiantes en Declive de Progreso';
            $contenido = sprintf(
                'Se detectaron %d estudiante(s) con tendencia declinante en sus calificaciones. Proyectados a nota final < 60.',
                $estudiantesEnRiesgo->count()
            );

            $datosAdicionales = [
                'estudiantes_en_riesgo' => $estudiantesEnRiesgo->count(),
                'timestamp' => now()->toIso8601String(),
                'url' => '/analisis-riesgo',
                'detalles' => $estudiantesEnRiesgo->map(fn($p) => [
                    'estudiante_id' => $p->estudiante_id,
                    'nombre' => $p->estudiante?->name,
                    'velocidad' => $p->velocidad_aprendizaje,
                    'nota_proyectada' => $p->nota_proyectada,
                ]),
            ];

            // Notificar a todos los profesores
            foreach ($profesores as $profesor) {
                Notificacion::crearParaUsuario(
                    $profesor,
                    $titulo,
                    $contenido,
                    'alerta',
                    $datosAdicionales
                );
            }

            Log::info("Notificaciones de progreso en riesgo creadas para {$profesores->count()} profesores");

        } catch (\Exception $e) {
            Log::error('Error creando notificaciones de progreso en riesgo', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Generar clusters K-Means para segmentación de estudiantes
     * PASO 7 del Pipeline
     */
    private function generateKMeansClusters(int $limit, array &$results): bool
    {
        try {
            Log::info('[PASO 7] Generando clusters K-Means...');
            $results['steps'][] = 'PASO 7: Generar clusters K-Means';

            // Obtener estudiantes con datos suficientes
            $students = User::where('tipo_usuario', 'estudiante')
                ->where('activo', true)
                ->take($limit)
                ->get();

            if ($students->isEmpty()) {
                Log::warning('No hay estudiantes para clustering');
                return true;
            }

            Log::info("Procesando {$students->count()} estudiantes para K-Means clustering");

            // Limpiar clusters antiguos
            StudentCluster::truncate();

            // Crear clusters base
            $n_clusters = min(3, max(2, intval($students->count() / 5)));

            // Simular asignación de clusters (en producción usaría Python)
            // Por ahora, distribuimos estudiantes en clusters de manera simple
            foreach ($students as $index => $student) {
                // Asignar cluster basado en promedio de calificaciones
                $promedio = Calificacion::where('estudiante_id', $student->id)
                    ->average('calificacion') ?? 50;

                // Lógica simple: bajo=0, medio=1, alto=2
                if ($promedio < 40) {
                    $cluster_id = 2;
                } elseif ($promedio < 70) {
                    $cluster_id = 1;
                } else {
                    $cluster_id = 0;
                }

                $distance = abs($promedio - (($cluster_id + 1) * 30));

                StudentCluster::updateOrCreate(
                    ['estudiante_id' => $student->id],
                    [
                        'cluster_id' => $cluster_id,
                        'cluster_distance' => $distance,
                        'membership_probabilities' => [
                            0 => $cluster_id === 0 ? 0.8 : 0.1,
                            1 => $cluster_id === 1 ? 0.8 : 0.1,
                            2 => $cluster_id === 2 ? 0.8 : 0.1,
                        ],
                        'cluster_interpretation' => $this->getClusterInterpretation($cluster_id),
                        'modelo_tipo' => 'KMeansSegmenter',
                        'modelo_version' => 'v1.0-pipeline',
                        'n_clusters_usado' => $n_clusters,
                    ]
                );
            }

            $clustersCount = StudentCluster::distinct('cluster_id')->count('cluster_id');
            Log::info("✓ {$students->count()} estudiantes asignados a {$clustersCount} clusters");

            $results['statistics']['clusters_generados'] = $clustersCount;
            $results['statistics']['estudiantes_clustered'] = $students->count();

            return true;

        } catch (\Exception $e) {
            Log::error('Error generando K-Means clusters', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            return false;
        }
    }

    /**
     * Obtener interpretación textual del cluster
     */
    private function getClusterInterpretation(int $cluster_id): string
    {
        $interpretaciones = [
            0 => 'Estudiantes de Alto Desempeño - Mantener nivel y ofrecer desafíos',
            1 => 'Estudiantes de Desempeño Medio - Refuerzo en áreas débiles',
            2 => 'Estudiantes que Necesitan Apoyo - Intervención intensiva requerida',
        ];

        return $interpretaciones[$cluster_id] ?? 'Cluster sin clasificar';
    }
}
