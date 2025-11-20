<?php

/**
 * Configuración del Servicio ML
 * Define cómo Laravel comunica con los modelos de Machine Learning
 */

return [
    /**
     * Modo de ejecución:
     * - 'subprocess': Ejecuta scripts Python localmente (requiere Python instalado)
     * - 'http': Llama a un servicio FastAPI remoto (recomendado para Railway)
     * - 'hybrid': Intenta subprocess primero, luego HTTP como fallback
     */
    'execution_mode' => env('ML_EXECUTION_MODE', 'subprocess'),

    /**
     * URL base del servicio ML (solo para modo 'http' o 'hybrid')
     * Ejemplo para Railway:
     * ML_SERVICE_URL=https://ml-educativas-production.up.railway.app
     */
    'service_url' => env('ML_SERVICE_URL', 'http://localhost:8000'),

    /**
     * Timeout en segundos para peticiones HTTP
     */
    'http_timeout' => env('ML_HTTP_TIMEOUT', 300),

    /**
     * Timeout en segundos para ejecución de procesos locales
     */
    'subprocess_timeout' => env('ML_SUBPROCESS_TIMEOUT', 300),

    /**
     * Token de autenticación para el servicio ML (si está protegido)
     */
    'api_token' => env('ML_API_TOKEN', null),

    /**
     * Endpoints del servicio ML
     */
    'endpoints' => [
        'train_models' => '/supervisado/training/train',
        'risk_predictions' => '/supervisado/performance/predict-batch',
        'career_recommendations' => '/supervisado/carrera/recommend-batch',
        'trend_predictions' => '/supervisado/tendencia/predict-batch',
        'progress_predictions' => '/supervisado/progreso/predict-batch',
        'kmeans_clustering' => '/no-supervisado/clustering/predict-batch',
        'anomaly_detection' => '/no-supervisado/anomaly/detect-batch',
        'lstm_predictions' => '/deep-learning/lstm/predict-batch',
        'health' => '/health',
    ],

    /**
     * Rutas locales (solo para modo 'subprocess')
     */
    'local_paths' => [
        'models_dir' => base_path('ml_educativas/supervisado'),
        'training_script' => 'training/train_performance_adapted.py',
    ],

    /**
     * Reintentos en caso de fallo
     */
    'retries' => [
        'enabled' => true,
        'attempts' => env('ML_RETRIES', 3),
        'delay_ms' => env('ML_RETRY_DELAY', 1000),
    ],
];
