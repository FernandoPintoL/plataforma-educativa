<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;
use GuzzleHttp\Exception\ConnectException;
use Illuminate\Support\Facades\Log;
use Exception;

/**
 * Servicio para hacer predicciones usando la ML API
 *
 * Esta clase maneja la comunicación con la ML API en http://localhost:8001
 * Proporciona métodos para los 4 tipos de predicciones:
 * - Riesgo académico
 * - Recomendación de carrera
 * - Tendencia de desempeño
 * - Análisis de progreso
 */
class MLPredictionService
{
    protected $client;
    protected $baseUrl;
    protected $timeout;
    protected $retries;

    /**
     * Constructor del servicio
     *
     * Inicializa el cliente HTTP con configuración desde .env
     */
    public function __construct()
    {
        $this->baseUrl = env('ML_SERVICE_URL', 'http://localhost:8001');
        $this->timeout = env('ML_HTTP_TIMEOUT', 300);
        $this->retries = env('ML_RETRIES', 3);

        $this->client = new Client([
            'timeout' => $this->timeout,
            'connect_timeout' => 5,
        ]);

        Log::info('MLPredictionService inicializado', [
            'url' => $this->baseUrl,
            'timeout' => $this->timeout,
        ]);
    }

    /**
     * Verificar que la ML API está disponible
     *
     * @return array Con las claves: status, healthy, models_loaded, timestamp
     * @throws Exception Si la API no está disponible
     */
    public function healthCheck(): array
    {
        try {
            $response = $this->client->get("{$this->baseUrl}/health");
            $data = json_decode($response->getBody(), true);

            Log::info('Health check exitoso', ['status' => $data['status']]);

            return $data;
        } catch (ConnectException $e) {
            Log::error('ML API no disponible', [
                'url' => $this->baseUrl,
                'error' => $e->getMessage(),
            ]);
            throw new Exception("ML API no disponible en {$this->baseUrl}");
        } catch (Exception $e) {
            Log::error('Error en health check', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Obtener información del caché
     *
     * @return array Con información del caché (registros, features, tamaño, etc)
     */
    public function getCacheInfo(): array
    {
        try {
            $response = $this->client->get("{$this->baseUrl}/cache/info");
            return json_decode($response->getBody(), true);
        } catch (Exception $e) {
            Log::error('Error obteniendo info del caché', ['error' => $e->getMessage()]);
            return ['status' => 'error', 'message' => $e->getMessage()];
        }
    }

    /**
     * Predecir riesgo académico de un estudiante
     *
     * @param array $studentData Datos del estudiante con sus métricas académicas
     * @return array Predicción con risk_level, risk_score, confidence
     * @throws Exception Si hay error en la predicción
     */
    public function predictRisk(array $studentData): array
    {
        return $this->makePrediction('/predict/risk', $studentData, 'Predicción de Riesgo');
    }

    /**
     * Recomendar carreras para un estudiante
     *
     * @param array $studentData Datos del estudiante
     * @return array Predicción con top_3_careers y compatibilidad
     * @throws Exception Si hay error en la predicción
     */
    public function predictCareer(array $studentData): array
    {
        return $this->makePrediction('/predict/career', $studentData, 'Predicción de Carrera');
    }

    /**
     * Predecir tendencia de desempeño
     *
     * @param array $studentData Datos del estudiante
     * @return array Predicción con trend y confidence
     * @throws Exception Si hay error en la predicción
     */
    public function predictTrend(array $studentData): array
    {
        return $this->makePrediction('/predict/trend', $studentData, 'Predicción de Tendencia');
    }

    /**
     * Analizar y proyectar progreso del estudiante
     *
     * @param array $studentData Datos del estudiante
     * @return array Predicción con projected_grade, learning_velocity, etc
     * @throws Exception Si hay error en la predicción
     */
    public function predictProgress(array $studentData): array
    {
        return $this->makePrediction('/predict/progress', $studentData, 'Análisis de Progreso');
    }

    /**
     * Hacer una predicción genérica (método interno)
     *
     * @param string $endpoint El endpoint a llamar (ej: /predict/risk)
     * @param array $data Los datos a enviar
     * @param string $predictionType Tipo de predicción para logging
     * @return array La predicción obtenida
     * @throws Exception Si hay error
     */
    protected function makePrediction(string $endpoint, array $data, string $predictionType): array
    {
        // Validar datos mínimos
        if (empty($data['student_id'])) {
            throw new Exception("student_id es obligatorio");
        }

        $attempt = 0;
        $lastError = null;
        $startTime = microtime(true);

        Log::info("Iniciando predicción", [
            'type' => $predictionType,
            'endpoint' => $endpoint,
            'student_id' => $data['student_id'],
            'ml_api_url' => $this->baseUrl,
            'timestamp' => now()->toIso8601String(),
        ]);

        // Obtener token de Sanctum del usuario autenticado
        $token = null;
        $authUser = null;
        if (auth()->check() && auth()->user()) {
            $authUser = auth()->user();
            $currentToken = $authUser->currentAccessToken();
            if ($currentToken) {
                $token = $currentToken->plainTextToken;
            }
        }

        if (!$token) {
            Log::warning("{$predictionType} - No hay token de Sanctum disponible", [
                'student_id' => $data['student_id'],
                'user_id' => auth()->id(),
                'authenticated' => auth()->check(),
            ]);
            throw new Exception("No hay autenticación disponible para acceder a ML API");
        }

        // Reintentar si falla
        while ($attempt < $this->retries) {
            try {
                $attempt++;
                $attemptStartTime = microtime(true);

                Log::debug("{$predictionType} - Intento {$attempt}/{$this->retries}", [
                    'student_id' => $data['student_id'],
                    'endpoint' => $endpoint,
                    'user_id' => auth()->id(),
                    'data_keys' => array_keys($data),
                ]);

                // Hacer el request con token de Sanctum
                $response = $this->client->post(
                    "{$this->baseUrl}{$endpoint}",
                    [
                        'json' => $data,
                        'headers' => [
                            'Content-Type' => 'application/json',
                            'Authorization' => 'Bearer ' . $token,
                        ],
                    ]
                );

                $attemptDuration = (microtime(true) - $attemptStartTime) * 1000;

                // Decodificar respuesta
                $result = json_decode($response->getBody(), true);

                // Validar JSON
                if (json_last_error() !== JSON_ERROR_NONE) {
                    throw new Exception('JSON inválido en respuesta: ' . json_last_error_msg());
                }

                $totalDuration = (microtime(true) - $startTime) * 1000;

                // Logging detallado de éxito
                Log::info("{$predictionType} completada exitosamente", [
                    'student_id' => $data['student_id'],
                    'endpoint' => $endpoint,
                    'status_code' => $response->getStatusCode(),
                    'attempt' => $attempt,
                    'attempt_duration_ms' => round($attemptDuration, 2),
                    'total_duration_ms' => round($totalDuration, 2),
                    'response_keys' => array_keys($result),
                    'user_id' => auth()->id(),
                ]);

                return $result;

            } catch (ConnectException $e) {
                $lastError = $e;
                $attemptDuration = (microtime(true) - $attemptStartTime) * 1000;

                Log::warning("{$predictionType} - Conexión rechazada", [
                    'intento' => $attempt,
                    'student_id' => $data['student_id'],
                    'endpoint' => $endpoint,
                    'error_message' => $e->getMessage(),
                    'attempt_duration_ms' => round($attemptDuration, 2),
                    'user_id' => auth()->id(),
                ]);

                if ($attempt < $this->retries) {
                    Log::info("Reintentando en 2 segundos...", [
                        'intento' => $attempt,
                        'proximo_intento' => $attempt + 1,
                    ]);
                    sleep(2);
                }

            } catch (GuzzleException $e) {
                $lastError = $e;
                $attemptDuration = (microtime(true) - $attemptStartTime) * 1000;

                $responseBody = '';
                try {
                    $responseBody = $e->getResponse()?->getBody()->getContents() ?? '';
                } catch (\Exception $ignore) {}

                Log::error("{$predictionType} - Error HTTP", [
                    'intento' => $attempt,
                    'student_id' => $data['student_id'],
                    'endpoint' => $endpoint,
                    'error_message' => $e->getMessage(),
                    'status_code' => $e->getResponse()?->getStatusCode(),
                    'response_body' => substr($responseBody, 0, 500), // Limitar tamaño del log
                    'attempt_duration_ms' => round($attemptDuration, 2),
                    'user_id' => auth()->id(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(2);
                }

            } catch (Exception $e) {
                $lastError = $e;
                $attemptDuration = (microtime(true) - $attemptStartTime) * 1000;

                Log::error("{$predictionType} - Error inesperado", [
                    'intento' => $attempt,
                    'student_id' => $data['student_id'],
                    'endpoint' => $endpoint,
                    'error_message' => $e->getMessage(),
                    'error_class' => get_class($e),
                    'attempt_duration_ms' => round($attemptDuration, 2),
                    'user_id' => auth()->id(),
                ]);

                if ($attempt < $this->retries) {
                    sleep(2);
                }
            }
        }

        $totalDuration = (microtime(true) - $startTime) * 1000;

        // Si llegamos aquí, todos los intentos fallaron
        Log::error("{$predictionType} - Todos los intentos fallaron", [
            'student_id' => $data['student_id'],
            'endpoint' => $endpoint,
            'total_attempts' => $attempt,
            'total_duration_ms' => round($totalDuration, 2),
            'last_error' => $lastError ? $lastError->getMessage() : 'Error desconocido',
            'user_id' => auth()->id(),
        ]);

        throw new Exception(
            "{$predictionType} falló después de {$this->retries} intentos: " .
            ($lastError ? $lastError->getMessage() : 'Error desconocido')
        );
    }

    /**
     * Refrescar el caché en la ML API
     *
     * @return array Resultado de la operación
     */
    public function refreshCache(): array
    {
        try {
            $response = $this->client->post("{$this->baseUrl}/cache/refresh");
            $result = json_decode($response->getBody(), true);

            Log::info('Caché refrescado exitosamente', [
                'cache_info' => $result['cache_info'] ?? null,
            ]);

            return $result;
        } catch (Exception $e) {
            Log::error('Error refrescando caché', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Limpiar el caché en la ML API
     *
     * @return array Resultado de la operación
     */
    public function clearCache(): array
    {
        try {
            $response = $this->client->delete("{$this->baseUrl}/cache/clear");
            $result = json_decode($response->getBody(), true);

            Log::info('Caché limpiado exitosamente');

            return $result;
        } catch (Exception $e) {
            Log::error('Error limpiando caché', ['error' => $e->getMessage()]);
            throw $e;
        }
    }

    /**
     * Validar coherencia de una predicción
     */
    protected function validateCoherence(array $prediction, string $type): void
    {
        if ($type === 'risk') {
            if (!isset($prediction['score_riesgo']) || $prediction['score_riesgo'] < 0 || $prediction['score_riesgo'] > 1) {
                throw new Exception("Invalid score_riesgo: " . ($prediction['score_riesgo'] ?? 'missing'));
            }

            $validLevels = ['alto', 'medio', 'bajo'];
            if (!in_array($prediction['nivel_riesgo'] ?? null, $validLevels)) {
                throw new Exception("Invalid nivel_riesgo: " . ($prediction['nivel_riesgo'] ?? 'missing'));
            }

            if (!isset($prediction['confianza']) || $prediction['confianza'] < 0 || $prediction['confianza'] > 1) {
                throw new Exception("Invalid confianza: " . ($prediction['confianza'] ?? 'missing'));
            }
        }
    }

    /**
     * Extraer features de un estudiante desde la BD
     *
     * MEJORADO: Extrae datos REALES en lugar de valores hardcodeados
     */
    public function extractStudentFeatures($student): array
    {
        $rendimiento = $student->rendimientoAcademico;

        // Obtener calificaciones recientes
        $calificaciones = $student->calificaciones()
            ->latest('fecha_calificacion')
            ->take(20)
            ->pluck('puntaje')
            ->toArray();

        // Stats de trabajos
        $trabajos = $student->trabajos()->count();
        $trabajos_entregados = $student->trabajos()
            ->whereIn('estado', ['entregado', 'calificado'])
            ->count();

        // ASISTENCIA REAL: Si existe tabla de asistencias, usar datos reales
        $asistencia = $this->calculateAttendance($student);

        return [
            'student_id' => $student->id,
            'promedio' => (float)($rendimiento?->promedio ?? 0),
            'asistencia' => (float) $asistencia,  // AHORA ES REAL
            'trabajos_entregados' => $trabajos_entregados,
            'trabajos_totales' => max($trabajos, 1),
            'varianza_calificaciones' => $this->calculateVariance($calificaciones),
            'dias_desde_ultima_calificacion' => $this->daysSinceLastGrade($student),
            'num_consultas_materiales' => $student->materialQueries()?->count() ?? 0,
        ];
    }

    /**
     * Calcular asistencia real del estudiante (MÉTODO PÚBLICO para reutilización)
     *
     * Intenta obtener datos reales, fallback a estimación
     */
    public function calculateAttendanceForStudent($student): float
    {
        return $this->calculateAttendance($student);
    }

    /**
     * Calcular asistencia real del estudiante (MÉTODO PRIVADO)
     *
     * Intenta obtener datos reales, fallback a estimación
     */
    private function calculateAttendance($student): float
    {
        // Opción 1: Si existe tabla de asistencias
        if (method_exists($student, 'asistencias')) {
            try {
                $total = $student->asistencias()->count();
                if ($total > 0) {
                    $presentes = $student->asistencias()
                        ->where('asistio', true)
                        ->count();
                    return ($presentes / $total) * 100;
                }
            } catch (\Exception $e) {
                Log::warning("Error calculando asistencia real: {$e->getMessage()}");
            }
        }

        // Opción 2: Estimar de calificaciones recientes (más presencia = mejores notas)
        try {
            $recentGrades = $student->calificaciones()
                ->where('created_at', '>=', now()->subMonths(3))
                ->pluck('puntaje')
                ->toArray();

            if (!empty($recentGrades)) {
                $avgGrade = array_sum($recentGrades) / count($recentGrades);
                // Si tiene calificaciones recientes, asumimos buena asistencia
                return min(95, $avgGrade + 10);
            }
        } catch (\Exception $e) {
            Log::warning("Error estimando asistencia: {$e->getMessage()}");
        }

        // Fallback: valor conservador
        return 50.0;
    }

    /**
     * Calcular varianza de calificaciones
     */
    private function calculateVariance(array $values): float
    {
        if (empty($values)) return 0;

        $mean = array_sum($values) / count($values);
        $deviations = array_map(fn($v) => pow($v - $mean, 2), $values);
        $variance = array_sum($deviations) / count($deviations);

        return sqrt($variance);
    }

    /**
     * Días desde la última calificación
     */
    private function daysSinceLastGrade($student): int
    {
        $lastGrade = $student->calificaciones()
            ->latest('fecha_calificacion')
            ->first();

        return $lastGrade
            ? now()->diffInDays($lastGrade->fecha_calificacion)
            : 999;
    }

    /**
     * Guardar predicción en BD
     */
    public function savePrediction(int $studentId, string $modelType, array $prediction): void
    {
        try {
            match($modelType) {
                'risk' => \App\Models\PrediccionRiesgo::updateOrCreate(
                    ['estudiante_id' => $studentId],
                    [
                        'score_riesgo' => $prediction['score_riesgo'] ?? 0,
                        'nivel_riesgo' => $prediction['nivel_riesgo'] ?? 'medio',
                        'confianza' => $prediction['confianza'] ?? 0,
                        'modelo_version' => $prediction['modelo_version'] ?? 'v1.1',
                        'fecha_prediccion' => $prediction['timestamp'] ?? now(),
                        'factores_influyentes' => json_encode($prediction['caracteristicas_importancia'] ?? []),
                    ]
                ),

                'carrera' => \App\Models\PrediccionCarrera::updateOrCreate(
                    ['estudiante_id' => $studentId],
                    [
                        'carrera_nombre' => $prediction['carrera_nombre'] ?? 'N/A',
                        'compatibilidad' => $prediction['compatibilidad'] ?? 0,
                        'ranking' => $prediction['ranking'] ?? 1,
                        'confianza' => $prediction['confianza'] ?? 0,
                        'fecha_prediccion' => $prediction['timestamp'] ?? now(),
                    ]
                ),

                'tendencia' => \App\Models\PrediccionTendencia::updateOrCreate(
                    ['estudiante_id' => $studentId],
                    [
                        'tendencia' => $prediction['tendencia'] ?? 'estable',
                        'confianza' => $prediction['confianza'] ?? 0,
                        'fecha_prediccion' => $prediction['timestamp'] ?? now(),
                    ]
                ),

                default => Log::error("Unknown model type: $modelType")
            };

        } catch (Exception $e) {
            Log::error("Error saving $modelType prediction: {$e->getMessage()}");
        }
    }

    /**
     * Hacer predicción completa y guardar
     */
    public function predictAndSave($student): array
    {
        $features = $this->extractStudentFeatures($student);

        $predictions = [];

        try {
            $riskPred = $this->predictRisk($features);
            $this->validateCoherence($riskPred, 'risk');
            $this->savePrediction($student->id, 'risk', $riskPred);
            $predictions['risk'] = $riskPred;
        } catch (Exception $e) {
            Log::error("Risk prediction failed: {$e->getMessage()}");
            $predictions['risk'] = null;
        }

        try {
            $careerPred = $this->predictCareer($features);
            $this->savePrediction($student->id, 'carrera', $careerPred);
            $predictions['carrera'] = $careerPred;
        } catch (Exception $e) {
            Log::error("Career prediction failed: {$e->getMessage()}");
            $predictions['carrera'] = null;
        }

        try {
            $trendPred = $this->predictTrend($features);
            $this->savePrediction($student->id, 'tendencia', $trendPred);
            $predictions['tendencia'] = $trendPred;
        } catch (Exception $e) {
            Log::error("Trend prediction failed: {$e->getMessage()}");
            $predictions['tendencia'] = null;
        }

        // VALIDAR COHERENCIA entre predicciones
        $validator = new PredictionValidator();
        $validation = $validator->validatePredictions($student->id, $predictions);

        // Guardar resultado de validación
        if (!$validation['is_coherent']) {
            Log::warning("Incoherencias detectadas en predicciones del estudiante {$student->id}", [
                'inconsistencies' => $validation['inconsistencies'],
                'recommended_action' => $validation['recommendation_action'],
            ]);
        }

        return array_merge($predictions, [
            'validation' => $validation,
            'coherent' => $validation['is_coherent'],
        ]);
    }
}
