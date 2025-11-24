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
}
