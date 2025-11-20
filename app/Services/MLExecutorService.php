<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;

/**
 * Servicio de Ejecución ML
 *
 * Abstrae la comunicación con modelos ML, soportando:
 * - Ejecución local de scripts Python (subprocess)
 * - Llamadas HTTP a servicio FastAPI remoto
 * - Modo híbrido (subprocess + fallback HTTP)
 */
class MLExecutorService
{
    private string $executionMode;
    private string $serviceUrl;
    private int $httpTimeout;
    private int $subprocessTimeout;
    private ?string $apiToken;
    private array $endpoints;
    private bool $retriesEnabled;
    private int $retriesAttempts;
    private int $retriesDelay;

    public function __construct()
    {
        $config = config('ml-service');

        $this->executionMode = $config['execution_mode'];
        $this->serviceUrl = $config['service_url'];
        $this->httpTimeout = $config['http_timeout'];
        $this->subprocessTimeout = $config['subprocess_timeout'];
        $this->apiToken = $config['api_token'];
        $this->endpoints = $config['endpoints'];
        $this->retriesEnabled = $config['retries']['enabled'];
        $this->retriesAttempts = $config['retries']['attempts'];
        $this->retriesDelay = $config['retries']['delay_ms'];
    }

    /**
     * Ejecutar predicción de riesgo
     */
    public function predictRisk(array $studentData): array
    {
        return $this->callEndpoint('risk_predictions', $studentData, 'Predicción de Riesgo');
    }

    /**
     * Ejecutar recomendación de carrera
     */
    public function recommendCareers(array $studentData): array
    {
        return $this->callEndpoint('career_recommendations', $studentData, 'Recomendación de Carrera');
    }

    /**
     * Ejecutar predicción de tendencia
     */
    public function predictTrends(array $studentData): array
    {
        return $this->callEndpoint('trend_predictions', $studentData, 'Predicción de Tendencia');
    }

    /**
     * Ejecutar predicción de progreso
     */
    public function predictProgress(array $studentData): array
    {
        return $this->callEndpoint('progress_predictions', $studentData, 'Predicción de Progreso');
    }

    /**
     * Ejecutar clustering K-Means
     */
    public function clusterKMeans(array $studentData): array
    {
        return $this->callEndpoint('kmeans_clustering', $studentData, 'Clustering K-Means');
    }

    /**
     * Ejecutar detección de anomalías
     */
    public function detectAnomalies(array $studentData): array
    {
        return $this->callEndpoint('anomaly_detection', $studentData, 'Detección de Anomalías');
    }

    /**
     * Ejecutar predicción LSTM
     */
    public function predictLSTM(array $studentData): array
    {
        return $this->callEndpoint('lstm_predictions', $studentData, 'Predicción LSTM');
    }

    /**
     * Verificar salud del servicio ML
     */
    public function healthCheck(): bool
    {
        try {
            if ($this->executionMode === 'subprocess') {
                return true; // Siempre activo en modo local
            }

            $response = Http::timeout($this->httpTimeout)
                ->get($this->serviceUrl . $this->endpoints['health']);

            return $response->successful();
        } catch (\Exception $e) {
            Log::warning('Health check ML Service falló', ['error' => $e->getMessage()]);
            return false;
        }
    }

    /**
     * Llamar a un endpoint del servicio ML
     */
    private function callEndpoint(string $endpointKey, array $data, string $operationName): array
    {
        $endpoint = $this->endpoints[$endpointKey] ?? null;

        if (!$endpoint) {
            return ['success' => false, 'error' => "Endpoint no encontrado: {$endpointKey}"];
        }

        Log::info("[ML] {$operationName} iniciado", ['mode' => $this->executionMode]);

        try {
            if ($this->executionMode === 'subprocess') {
                return $this->executeLocalScript($data, $operationName);
            } elseif ($this->executionMode === 'http') {
                return $this->executeRemoteAPI($endpoint, $data, $operationName);
            } elseif ($this->executionMode === 'hybrid') {
                // Intentar local primero
                try {
                    return $this->executeLocalScript($data, $operationName);
                } catch (\Exception $e) {
                    Log::warning("[ML] Fallback a HTTP después de fallo local", ['error' => $e->getMessage()]);
                    return $this->executeRemoteAPI($endpoint, $data, $operationName);
                }
            }

            return ['success' => false, 'error' => "Modo ejecución desconocido: {$this->executionMode}"];

        } catch (\Exception $e) {
            Log::error("[ML] Error en {$operationName}: {$e->getMessage()}");
            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    /**
     * Ejecutar script Python localmente
     */
    private function executeLocalScript(array $data, string $operationName): array
    {
        // Esto se mantiene para compatibilidad, pero requiere Python instalado
        Log::info("[ML-Local] Ejecutando: {$operationName}");

        // Por ahora retornamos un error amigable
        return [
            'success' => false,
            'error' => 'Modo subprocess requiere Python instalado. Usa ML_EXECUTION_MODE=http para Railway.',
        ];
    }

    /**
     * Ejecutar llamada HTTP a servicio remoto
     */
    private function executeRemoteAPI(string $endpoint, array $data, string $operationName): array
    {
        $url = $this->serviceUrl . $endpoint;
        $attempt = 0;

        while ($attempt < $this->retriesAttempts) {
            try {
                $attempt++;
                Log::debug("[ML-HTTP] POST {$url} (Intento {$attempt})", ['data_size' => count($data)]);

                $headers = ['Content-Type' => 'application/json'];
                if ($this->apiToken) {
                    $headers['Authorization'] = "Bearer {$this->apiToken}";
                }

                $response = Http::timeout($this->httpTimeout)
                    ->withHeaders($headers)
                    ->post($url, $data);

                if ($response->successful()) {
                    Log::info("[ML-HTTP] {$operationName} completado exitosamente");
                    return $response->json();
                }

                Log::warning("[ML-HTTP] Error {$response->status()}", [
                    'endpoint' => $endpoint,
                    'response' => $response->body(),
                ]);

                // Si es error de servidor, reintentar
                if ($response->serverError() && $attempt < $this->retriesAttempts) {
                    usleep($this->retriesDelay * 1000);
                    continue;
                }

                return [
                    'success' => false,
                    'error' => "HTTP {$response->status()}: {$response->body()}",
                ];

            } catch (\Exception $e) {
                Log::warning("[ML-HTTP] Excepción en intento {$attempt}: {$e->getMessage()}");

                if ($attempt < $this->retriesAttempts) {
                    usleep($this->retriesDelay * 1000);
                    continue;
                }

                return [
                    'success' => false,
                    'error' => "Fallo en conexión: {$e->getMessage()}",
                ];
            }
        }

        return [
            'success' => false,
            'error' => "Falló después de {$this->retriesAttempts} intentos",
        ];
    }
}
