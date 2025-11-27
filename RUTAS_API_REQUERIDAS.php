<?php

/**
 * RUTAS API REQUERIDAS - Sistema de Generación de Preguntas Inteligente
 *
 * Agregar las siguientes rutas a: routes/api.php
 *
 * El archivo routes/api.php se encuentra en:
 * D:\PLATAFORMA EDUCATIVA\plataforma-educativa\routes\api.php
 */

// Rutas para generación inteligente de preguntas
Route::middleware(['auth:sanctum'])->prefix('content')->group(function () {

    /**
     * POST /api/content/generate-questions
     *
     * Generar preguntas educativas inteligentes usando el pipeline de 6 pasos
     *
     * Request:
     * {
     *   "titulo": "Evaluación de Mitosis",
     *   "tipo_evaluacion": "parcial",
     *   "curso_id": 1,
     *   "cantidad_preguntas": 5,
     *   "dificultad_deseada": "intermedia",
     *   "contexto": "Biología 101 - División Celular" (opcional)
     * }
     *
     * Response:
     * {
     *   "success": true,
     *   "preguntas": [...],
     *   "total": 5,
     *   "metadata": {
     *     "pipeline_pasos": 6,
     *     "contexto_pedagogico": true,
     *     "banco_preguntas_usado": true,
     *     "duplicados_detectados": false,
     *     "confidence": 0.92,
     *     "source": "intelligent_pipeline",
     *     "timestamp": "2025-11-27T00:00:00Z"
     *   }
     * }
     *
     * Status codes:
     * - 200: Éxito
     * - 404: Curso no encontrado
     * - 422: Validación fallida
     * - 500: Error interno (fallback a templates)
     */
    Route::post('generate-questions',
        [ContentAnalysisController::class, 'generateQuestions']
    )->name('content.generate-questions');

    // ... otras rutas existentes
});

/**
 * NOTAS DE IMPLEMENTACIÓN:
 *
 * 1. Asegúrate de importar el controlador:
 *    use App\Http\Controllers\Api\ContentAnalysisController;
 *
 * 2. El middleware 'auth:sanctum' requiere autenticación
 *    - Puedes cambiar a 'auth:api' si usas tokens tradicionales
 *    - O remover si quieres permitir acceso público
 *
 * 3. Las rutas están dentro del grupo 'api' y con prefijo 'content'
 *    - URL final: /api/content/generate-questions
 *
 * 4. El controlador inyecta QuestionGenerationService automáticamente
 *    - Laravel lo resuelve del contenedor de servicios
 *    - No necesitas hacer nada adicional
 *
 * 5. El método genera preguntas usando:
 *    - QuestionGenerationService (pipeline 6 pasos)
 *    - QuestionBankService (persistencia)
 *    - QuestionAnalyticsService (cuando se califica evaluación)
 */
