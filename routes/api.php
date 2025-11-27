<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalisisRiesgoController;
use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\ExportarReportesController;
use App\Http\Controllers\Api\MLPipelineController;
use App\Http\Controllers\ReportesController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\MiPerfilController;
use App\Http\Controllers\Api\PadreChildController;
use App\Http\Controllers\Api\ModuloSidebarController;
use App\Http\Controllers\Api\StudentActivityController;
use App\Http\Controllers\Api\ClusteringController;
use App\Http\Controllers\Api\DiscoveryOrchestrationController;
use App\Http\Controllers\Api\AgentController;
use App\Http\Controllers\RecommendationController;
use App\Http\Controllers\MLAnalysisController;
use App\Http\Controllers\MLDashboardController;
use App\Http\Controllers\Api\ContentAnalysisController;
use App\Http\Controllers\EvaluacionController;
use App\Http\Controllers\Api\EvaluacionesApiController;

/**
 * API Routes
 *
 * These routes are protected by the "api" middleware and require authentication
 */

// Debug route - temporary for troubleshooting (remove in production)
Route::middleware(['api'])->get('/debug-auth', function (\Illuminate\Http\Request $request) {
    return response()->json([
        'timestamp' => now(),
        'authenticated' => \Illuminate\Support\Facades\Auth::check(),
        'user' => \Illuminate\Support\Facades\Auth::user(),
        'session_id' => session()->getId(),
        'session_all' => session()->all(),
        'request_user' => $request->user(),
        'guards' => [
            'web' => auth('web')->check(),
            'sanctum' => auth('sanctum')->check(),
        ],
        'headers' => [
            'Referer' => $request->header('Referer'),
            'Origin' => $request->header('Origin'),
            'Authorization' => $request->header('Authorization') ? 'present' : 'missing',
            'X-CSRF-TOKEN' => $request->header('X-CSRF-TOKEN') ? 'present' : 'missing',
        ],
        'cookies' => [
            'PHPSESSID' => $request->cookie('PHPSESSID') ? 'present' : 'missing',
            'XSRF-TOKEN' => $request->cookie('XSRF-TOKEN') ? 'present' : 'missing',
            'laravel_session' => $request->cookie('laravel_session') ? 'present' : 'missing',
        ],
    ]);
});

// Debug route para diagnosticar mi-perfil
Route::middleware(['api'])->get('/debug-mi-perfil', function (\Illuminate\Http\Request $request) {
    $user = \Illuminate\Support\Facades\Auth::user();

    if (!$user) {
        return response()->json([
            'error' => 'No authenticated user',
            'auth_check' => \Illuminate\Support\Facades\Auth::check(),
            'user' => null,
        ]);
    }

    $prediccion = \App\Models\PrediccionRiesgo::where('estudiante_id', $user->id)
        ->orderBy('fecha_prediccion', 'desc')
        ->first();

    return response()->json([
        'authenticated_user_id' => $user->id,
        'user_type' => $user->tipo_usuario ?? 'sin tipo',
        'user_name' => $user->name ?? 'sin nombre',
        'has_prediction' => !!$prediccion,
        'prediction_id' => $prediccion?->id,
        'prediction_nivel_riesgo' => $prediccion?->nivel_riesgo,
        'prediction_score_riesgo' => $prediccion?->score_riesgo,
        'total_predictions' => \App\Models\PrediccionRiesgo::where('estudiante_id', $user->id)->count(),
        'guards' => [
            'web' => auth('web')->check(),
            'sanctum' => auth('sanctum')->check(),
        ],
    ]);
});

// Auth token endpoints - available to authenticated users
// Uses both 'api' (for routing/prefix) and 'web' (for session handling)
Route::middleware(['api', 'web'])->group(function () {
    // Get current API token (for users with session)
    Route::get('auth/token', [AuthTokenController::class, 'getToken'])
        ->middleware('auth')
        ->name('api.auth.token');

    // Revoke API token (requires Sanctum authentication)
    Route::post('auth/token/revoke', [AuthTokenController::class, 'revokeToken'])
        ->middleware('auth:sanctum')
        ->name('api.auth.token.revoke');
});

Route::middleware(['auth:sanctum'])->group(function () {
    /**
     * Rutas para Módulos Sidebar (todos los usuarios autenticados)
     */
    Route::get('modulos-sidebar', [ModuloSidebarController::class, 'index'])
        ->name('modulos-sidebar.index');

    /**
     * Rutas para Análisis de Riesgo (solo director, profesor, admin)
     */
    Route::middleware('role:director|profesor|admin')->prefix('analisis-riesgo')->name('analisis-riesgo.')->group(function () {
        // Dashboard general
        Route::get('dashboard', [AnalisisRiesgoController::class, 'dashboard'])
            ->name('dashboard');

        // Listar predicciones
        Route::get('/', [AnalisisRiesgoController::class, 'index'])
            ->name('index');

        // Análisis por estudiante
        Route::get('estudiante/{id}', [AnalisisRiesgoController::class, 'porEstudiante'])
            ->name('porEstudiante');

        // Análisis por curso
        Route::get('curso/{id}', [AnalisisRiesgoController::class, 'porCurso'])
            ->name('porCurso');

        // Análisis de tendencias
        Route::get('tendencias', [AnalisisRiesgoController::class, 'tendencias'])
            ->name('tendencias');

        // Recomendaciones de carrera
        Route::get('carrera/{id}', [AnalisisRiesgoController::class, 'recomendacionesCarrera'])
            ->name('recomendacionesCarrera');

        // Actualizar predicción
        Route::put('{id}', [AnalisisRiesgoController::class, 'update'])
            ->name('update');

        // Generar nuevas predicciones
        Route::post('generar/{estudianteId}', [AnalisisRiesgoController::class, 'generarPredicciones'])
            ->name('generarPredicciones');
    });

    /**
     * Rutas para Exportar Reportes (solo director, admin)
     */
    Route::middleware('role:director|admin')->prefix('exportar')->name('exportar.')->group(function () {
        // Exportar análisis de riesgo
        Route::get('riesgo', [ExportarReportesController::class, 'exportarRiesgo'])
            ->name('riesgo');

        // Exportar desempeño académico
        Route::get('desempeno', [ExportarReportesController::class, 'exportarDesempeno'])
            ->name('desempeno');

        // Exportar carreras recomendadas
        Route::get('carreras', [ExportarReportesController::class, 'exportarCarreras'])
            ->name('carreras');

        // Exportar tendencias
        Route::get('tendencias', [ExportarReportesController::class, 'exportarTendencias'])
            ->name('tendencias');

        // Resumen general de reportes
        Route::get('resumen', [ExportarReportesController::class, 'resumenGeneral'])
            ->name('resumen');
    });

    /**
     * Rutas para Reportes Dinámicos (Lazy Loading)
     */
    Route::prefix('reportes')->name('reportes.')->group(function () {
        // Obtener síntesis de Agent para un estudiante (lazy loading)
        Route::get('student/{studentId}/synthesis', [ReportesController::class, 'getStudentSynthesis'])
            ->name('student-synthesis');
    });

    /**
     * Rutas para ML Pipeline (solo admin)
     */
    Route::middleware('role:admin')->prefix('ml-pipeline')->name('ml-pipeline.')->group(function () {
        // Ejecutar pipeline ML
        Route::post('execute', [MLPipelineController::class, 'execute'])
            ->name('execute');

        // Obtener estado del pipeline
        Route::get('status', [MLPipelineController::class, 'status'])
            ->name('status');

        // Obtener estadísticas
        Route::get('statistics', [MLPipelineController::class, 'statistics'])
            ->name('statistics');

        // Obtener logs
        Route::get('logs', [MLPipelineController::class, 'logs'])
            ->name('logs');
    });

    /**
     * Rutas para Notificaciones en Tiempo Real (todos los usuarios autenticados)
     */
    Route::prefix('notificaciones')->name('notificaciones.')->group(function () {
        // Listar notificaciones del usuario
        Route::get('/', [NotificacionController::class, 'index'])
            ->name('index');

        // Obtener notificaciones no leídas
        Route::get('no-leidas', [NotificacionController::class, 'getNoLeidas'])
            ->name('noLeidas');

        // Stream de SSE (tiempo real)
        Route::get('stream', [NotificacionController::class, 'stream'])
            ->name('stream');

        // Obtener estadísticas de notificaciones
        Route::get('estadisticas', [NotificacionController::class, 'estadisticas'])
            ->name('estadisticas');

        // Marcar como leída
        Route::put('{notificacion}/leido', [NotificacionController::class, 'marcarLeido'])
            ->name('marcarLeido');

        // Marcar como no leída
        Route::put('{notificacion}/no-leido', [NotificacionController::class, 'marcarNoLeido'])
            ->name('marcarNoLeido');

        // Marcar todas como leídas
        Route::put('marcar/todas-leidas', [NotificacionController::class, 'marcarTodasLeidas'])
            ->name('marcarTodasLeidas');

        // Eliminar notificación
        Route::delete('{notificacion}', [NotificacionController::class, 'eliminar'])
            ->name('eliminar');
    });

    /**
     * Rutas para Padres - Acceso a datos de hijos
     * Solo accesible por padres (padre role)
     */
    Route::prefix('padre')->name('padre.')->middleware('role:padre')->group(function () {
        // Listar hijos del padre
        Route::get('hijos', [PadreChildController::class, 'getHijos'])
            ->name('hijos');

        // Obtener datos de riesgo de un hijo específico
        Route::get('hijos/{hijoId}/riesgo', [PadreChildController::class, 'getHijoRiesgo'])
            ->name('hijo.riesgo');

        // Obtener recomendaciones de carrera de un hijo
        Route::get('hijos/{hijoId}/carreras', [PadreChildController::class, 'getHijoCarreras'])
            ->name('hijo.carreras');
    });

    /**
     * Rutas para Recomendaciones Educativas Personalizadas
     * Agente Inteligente que genera recomendaciones basadas en ML
     */
    Route::prefix('recommendations')->name('recommendations.')->group(function () {
        // Obtener recomendaciones del estudiante autenticado
        Route::get('my', [RecommendationController::class, 'myRecommendations'])
            ->name('my');

        // Obtener historial de recomendaciones (MUST BE BEFORE {recommendationId})
        Route::get('history', [RecommendationController::class, 'history'])
            ->name('history');

        // Obtener estadísticas de recomendaciones (MUST BE BEFORE {recommendationId})
        Route::get('stats', [RecommendationController::class, 'stats'])
            ->name('stats');

        // Obtener recomendaciones de un estudiante específico (profesor/admin)
        Route::get('student/{studentId}', [RecommendationController::class, 'studentRecommendations'])
            ->name('student');

        // Ver una recomendación específica
        Route::get('{recommendationId}', [RecommendationController::class, 'show'])
            ->name('show');

        // Aceptar una recomendación
        Route::post('{recommendationId}/accept', [RecommendationController::class, 'accept'])
            ->name('accept');

        // Completar una recomendación
        Route::post('{recommendationId}/complete', [RecommendationController::class, 'complete'])
            ->name('complete');

        // Listar todas las recomendaciones (profesor/admin)
        Route::get('/', [RecommendationController::class, 'index'])
            ->middleware('role:profesor|admin')
            ->name('index');
    });

    /**
     * Rutas para Monitoreo de Actividad Estudiantil en Tiempo Real
     * Tracking de progreso, alertas inteligentes y sugerencias Socráticas
     * Acceso: estudiantes (su propia actividad), profesores (sus estudiantes), admin (todos)
     */
    Route::prefix('student-activity')->name('student-activity.')->group(function () {
        // Registrar actividad de estudiante (estudiante registra su propia actividad)
        Route::post('/', [StudentActivityController::class, 'registrarActividad'])
            ->name('registrar');

        // Obtener resumen de actividad de un trabajo
        Route::get('trabajo/{trabajoId}', [StudentActivityController::class, 'obtenerResumen'])
            ->name('resumen');

        // Obtener alertas pendientes para un estudiante
        Route::get('alertas/{estudianteId}', [StudentActivityController::class, 'obtenerAlertas'])
            ->name('alertas');

        // Marcar alerta como intervenida
        Route::patch('alertas/{alertaId}/intervene', [StudentActivityController::class, 'marcarAlertaIntervenida'])
            ->name('alerta.intervene');
    });

    /**
     * Rutas para Análisis de Clustering No Supervisado
     * Descubrimiento de patrones y segmentación de estudiantes
     * Acceso: profesores, admin
     */
    Route::prefix('clustering')->name('clustering.')->middleware('role:profesor|admin')->group(function () {
        // Ejecutar clustering
        Route::post('run', [ClusteringController::class, 'runClustering'])
            ->name('run');

        // Obtener resumen de clusters
        Route::get('summary', [ClusteringController::class, 'getSummary'])
            ->name('summary');

        // Obtener análisis de un cluster específico
        Route::get('cluster/{clusterId}', [ClusteringController::class, 'getClusterAnalysis'])
            ->name('cluster.analysis');

        // Obtener estudiantes anómalos
        Route::get('anomalous', [ClusteringController::class, 'getAnomalousStudents'])
            ->name('anomalous');

        // Obtener estudiantes similares
        Route::get('similar/{studentId}', [ClusteringController::class, 'getSimilarStudents'])
            ->name('similar');
    });

    /**
     * Rutas para Descubrimiento Unificado y Orquestación
     * Pipeline completo: Unsupervised → Supervised → Agent → Adaptive
     * Acceso: profesores, admin
     */
    Route::prefix('discovery')->name('discovery.')->middleware('role:profesor|admin')->group(function () {
        // Pipeline unificado completo para un estudiante
        Route::post('unified-pipeline/{studentId}', [DiscoveryOrchestrationController::class, 'runUnifiedPipeline'])
            ->name('unified-pipeline');

        // Clustering
        Route::post('clustering/run', [DiscoveryOrchestrationController::class, 'runClustering'])
            ->name('clustering.run');
        Route::get('clustering/summary', [DiscoveryOrchestrationController::class, 'getClusteringSummary'])
            ->name('clustering.summary');

        // Topic Modeling
        Route::post('topics/analyze', [DiscoveryOrchestrationController::class, 'analyzeTopics'])
            ->name('topics.analyze');
        Route::get('topics/student/{studentId}', [DiscoveryOrchestrationController::class, 'getStudentTopics'])
            ->name('topics.student');
        Route::get('topics/distribution', [DiscoveryOrchestrationController::class, 'getTopicsDistribution'])
            ->name('topics.distribution');

        // Anomaly Detection
        Route::post('anomalies/detect', [DiscoveryOrchestrationController::class, 'detectAnomalies'])
            ->name('anomalies.detect');
        Route::get('anomalies/student/{studentId}', [DiscoveryOrchestrationController::class, 'getStudentAnomalies'])
            ->name('anomalies.student');
        Route::get('anomalies/summary', [DiscoveryOrchestrationController::class, 'getAnomaliesSummary'])
            ->name('anomalies.summary');

        // Correlation Analysis
        Route::post('correlations/analyze', [DiscoveryOrchestrationController::class, 'analyzeCorrelations'])
            ->name('correlations.analyze');
        Route::post('correlations/activity-performance', [DiscoveryOrchestrationController::class, 'analyzeActivityPerformance'])
            ->name('correlations.activity-performance');
        Route::get('correlations/predictive-factors', [DiscoveryOrchestrationController::class, 'getPredictiveFactors'])
            ->name('correlations.predictive-factors');

        // Integrated Insights
        Route::get('insights/{studentId}', [DiscoveryOrchestrationController::class, 'getIntegratedInsights'])
            ->name('insights');

        // System Health
        Route::get('health', [DiscoveryOrchestrationController::class, 'getHealthStatus'])
            ->name('health');
    });

    /**
     * Rutas para ML Analysis (NUEVO: Análisis Integrado)
     * Coordina supervisada + no_supervisado + síntesis LLM
     * Acceso: profesores, admin
     */
    Route::prefix('ml')->name('ml.')->middleware('role:profesor|admin')->group(function () {
        // Análisis completo integrado del estudiante
        Route::get('student/{studentId}/analysis', [MLAnalysisController::class, 'getIntegratedAnalysis'])
            ->name('analysis.integrated');

        // Solo predicciones (supervisada)
        Route::get('student/{studentId}/predictions', [MLAnalysisController::class, 'getPredictions'])
            ->name('analysis.predictions');

        // Solo clustering (no_supervisado)
        Route::get('student/{studentId}/clustering', [MLAnalysisController::class, 'getClustering'])
            ->name('analysis.clustering');

        // Análisis en lote para múltiples estudiantes
        Route::post('batch-analysis', [MLAnalysisController::class, 'batchAnalysis'])
            ->name('batch-analysis');

        // Verificar salud del ML System
        Route::post('health', [MLAnalysisController::class, 'checkMLHealth'])
            ->name('health');

        // Información del ML System
        Route::get('info', [MLAnalysisController::class, 'getMLInfo'])
            ->name('info');

        /**
         * ML Dashboard & Integration Routes (Week 4)
         * Integrated predictions, feedback loop, and metrics
         */
        // Predicción integrada para un estudiante
        Route::get('predict/{studentId}', [MLDashboardController::class, 'predictStudent'])
            ->name('predict.student');

        // Registrar feedback para completar loop
        Route::post('feedback', [MLDashboardController::class, 'recordFeedback'])
            ->name('feedback.record');

        // Dashboard con métricas y alertas
        Route::get('dashboard', [MLDashboardController::class, 'getDashboard'])
            ->name('dashboard');

        // Métricas de rendimiento
        Route::get('metrics', [MLDashboardController::class, 'getMetrics'])
            ->name('metrics');

        // Cola de revisión (predicciones con baja confianza o error alto)
        Route::get('review-queue', [MLDashboardController::class, 'getReviewQueue'])
            ->name('review-queue');

        // Predicciones pendientes de feedback
        Route::get('pending-feedback', [MLDashboardController::class, 'getPendingFeedback'])
            ->name('pending-feedback');

        // Análisis de degradación de performance
        Route::get('degradation', [MLDashboardController::class, 'checkDegradation'])
            ->name('degradation');

        /**
         * ML Reports Routes (Nuevo: Reportes Enriquecidos con ML)
         * Reportes detallados para estudiantes, institucionales y análisis de anomalías
         */
        // Reporte de riesgo detallado para un estudiante
        Route::get('reports/student/{studentId}/risk', [MLDashboardController::class, 'getStudentRiskReport'])
            ->name('reports.student.risk');

        // Reporte de riesgo a nivel institucional
        Route::get('reports/institutional/risk', [MLDashboardController::class, 'getInstitutionalRiskReport'])
            ->name('reports.institutional.risk');

        // Reporte de anomalías detectadas
        Route::get('reports/anomalies', [MLDashboardController::class, 'getAnomalyReport'])
            ->name('reports.anomalies');

        // Análisis de tendencias con predicciones ML
        Route::get('reports/trends', [MLDashboardController::class, 'getTrendAnalysis'])
            ->name('reports.trends');
    });

    /**
     * Rutas para Agent Service (Síntesis LLM)
     * Sintetiza descubrimientos usando LLM (Groq)
     * Acceso: profesores, admin
     */
    Route::prefix('agent')->name('agent.')->middleware('role:profesor|admin')->group(function () {
        // Sintetizar descubrimientos
        Route::post('synthesize/{studentId}', [AgentController::class, 'synthesize'])
            ->name('synthesize');

        // Obtener razonamiento detallado
        Route::get('reasoning/{studentId}', [AgentController::class, 'reasoning'])
            ->name('reasoning');

        // Generar estrategia de intervención
        Route::post('intervention/{studentId}', [AgentController::class, 'intervention'])
            ->name('intervention');

        // Obtener análisis completo
        Route::post('complete-analysis/{studentId}', [AgentController::class, 'completeAnalysis'])
            ->name('complete-analysis');

        // Verificar salud del servicio
        Route::get('health', [AgentController::class, 'health'])
            ->name('health');

        // Obtener información del servicio
        Route::get('info', [AgentController::class, 'info'])
            ->name('info');

        // Probar servicio
        Route::get('test', [AgentController::class, 'test'])
            ->name('test');
    });

});

/**
 * Rutas para Análisis de Contenido (Tareas y Evaluaciones)
 * FUERA del grupo auth:sanctum para permitir autenticación por sesión desde React SPA
 * Usa middleware 'auth' en lugar de 'auth:sanctum'
 *
 * Servicio para generar sugerencias de contenido usando IA
 * Acceso: profesores, admin
 */
Route::middleware(['api', 'auth:sanctum'])->prefix('content')->name('content.')->middleware('role:profesor|admin')->group(function () {
    // Analizar contenido y obtener sugerencias
    Route::post('analyze', [ContentAnalysisController::class, 'analyze'])
        ->name('analyze');

    // Analizar evaluación completa con todas sus preguntas
    Route::post('analyze-evaluation', [ContentAnalysisController::class, 'analyzeEvaluation'])
        ->name('analyze-evaluation');

    // Generar evaluación completa automáticamente con IA
    Route::post('generate-evaluation', [ContentAnalysisController::class, 'generateEvaluation'])
        ->name('generate-evaluation');

    // Generar preguntas automáticamente con IA
    Route::post('generate-questions', [ContentAnalysisController::class, 'generateQuestions'])
        ->name('generate-questions');

    // Verificar salud del servicio de análisis
    Route::get('health', [ContentAnalysisController::class, 'health'])
        ->name('health');
});

/**
 * Rutas para Mi Perfil - Datos personales del estudiante autenticado
 * FUERA del grupo auth:sanctum para permitir autenticación por sesión desde React SPA
 * Usa middleware 'auth' en lugar de 'auth:sanctum'
 */

// Endpoint de prueba para diagnosticar
Route::middleware(['api', 'auth'])->get('/mi-perfil-test', function () {
    return response()->json([
        'message' => 'Test endpoint working',
        'user' => \Illuminate\Support\Facades\Auth::user(),
        'timestamp' => now(),
    ]);
})->name('mi-perfil.test');

Route::middleware(['api', 'auth'])->prefix('mi-perfil')->name('mi-perfil.')->group(function () {
    // Obtener datos de riesgo personal (solo estudiante autenticado)
    Route::get('riesgo', [MiPerfilController::class, 'getRiesgo'])
        ->middleware('role:estudiante')
        ->name('riesgo');

    // Obtener recomendaciones de carreras (solo estudiante)
    Route::get('carreras', [MiPerfilController::class, 'getCarreras'])
        ->middleware('role:estudiante')
        ->name('carreras');
});

/**
 * Rutas para Test Vocacional con ML
 * Análisis de orientación de carrera enriquecido con ML
 * Acceso: estudiantes (su propio perfil), profesores/admin (todos)
 */
Route::middleware(['api', 'auth'])->prefix('vocacional')->name('vocacional.')->group(function () {
    // Obtener perfil vocacional personal
    Route::get('mi-perfil', [TestVocacionalController::class, 'getPerfilVocacional'])
        ->middleware('role:estudiante')
        ->name('mi-perfil');

    // Obtener recomendaciones de carrera personalizadas
    Route::get('recomendaciones-carrera', [TestVocacionalController::class, 'getRecomendacionesCarrera'])
        ->middleware('role:estudiante')
        ->name('recomendaciones-carrera');

    // Análisis detallado de un estudiante (solo profesores/admin)
    Route::get('analisis/{studentId}', [TestVocacionalController::class, 'getAnalisisVocacional'])
        ->middleware('role:profesor|admin')
        ->name('analisis');

    // Reporte institucional de vocaciones (solo profesores/admin)
    Route::get('reporte-institucional', [TestVocacionalController::class, 'getReporteInstitucional'])
        ->middleware('role:profesor|admin')
        ->name('reporte-institucional');
});

/**
 * Rutas para Tareas con ML
 * Hints inteligentes, monitoreo de progreso, detección de dificultad
 * Acceso: estudiantes (su propia tarea), profesores (sus tareas)
 */
Route::middleware(['api', 'auth'])->prefix('tareas')->name('tareas.')->group(function () {
    // Obtener hints y análisis para una tarea (estudiantes)
    Route::get('{tareaId}/hints', [TareaController::class, 'getHintsParaTarea'])
        ->middleware('role:estudiante')
        ->name('hints');

    // Registrar actividad de estudiante en tarea
    Route::post('{tareaId}/actividad', [TareaController::class, 'registrarActividad'])
        ->middleware('role:estudiante')
        ->name('registrar-actividad');

    // Obtener análisis de tarea para profesor
    Route::get('{tareaId}/analisis-profesor', [TareaController::class, 'getAnalisisProfesor'])
        ->middleware('role:profesor|admin')
        ->name('analisis-profesor');
});

/**
 * Rutas para Trabajos con ML
 * Progreso detallado y historial de hints
 * Acceso: estudiante (su trabajo) o profesor (estudiantes de su curso)
 */
Route::middleware(['api', 'auth'])->prefix('trabajos')->name('trabajos.')->group(function () {
    // Obtener progreso detallado de un trabajo
    Route::get('{trabajoId}/progreso', [TareaController::class, 'getProgresoTrabajo'])
        ->name('progreso');

    // Obtener historial de hints para un trabajo
    Route::get('{trabajoId}/hints-historial', [TareaController::class, 'getHistorialHints'])
        ->middleware('role:estudiante')
        ->name('hints-historial');
});

/**
 * Rutas para Evaluaciones con ML
 * Análisis de preguntas, detección de anomalías, correlaciones
 * Acceso: profesor (sus evaluaciones), estudiante (sus resultados)
 */
Route::middleware(['api', 'auth'])->prefix('evaluaciones')->name('evaluaciones.')->group(function () {
    // Obtener análisis detallado de una evaluación (solo profesor)
    Route::get('{evaluacionId}/analisis', [EvaluacionController::class, 'getAnalisisDetallado'])
        ->middleware('role:profesor|admin')
        ->name('analisis');

    // Obtener correlaciones académicas (acceso general)
    Route::get('correlaciones', [EvaluacionController::class, 'getCorrelaciones'])
        ->name('correlaciones');

    // Obtener recomendaciones personalizadas para estudiante
    Route::get('{evaluacionId}/recomendaciones', [EvaluacionController::class, 'getRecomendacionesEstudiante'])
        ->middleware('role:estudiante')
        ->name('recomendaciones');
});

/**
 * Rutas API para Intentos de Evaluación (NUEVO)
 * Gestión completa de intentos de estudiantes en evaluaciones
 * Incluye: inicio, respuestas, finalización, análisis ML
 * Acceso: estudiantes (sus propios intentos), profesores (análisis)
 */
Route::middleware(['api', 'auth'])->prefix('api/evaluaciones-intentos')->name('evaluaciones-intentos.')->group(function () {
    // Listar evaluaciones disponibles para el estudiante
    Route::get('/', [EvaluacionesApiController::class, 'index'])
        ->middleware('role:estudiante')
        ->name('index');

    // Ver detalles de una evaluación
    Route::get('{id}', [EvaluacionesApiController::class, 'show'])
        ->name('show');

    // Iniciar un intento de evaluación
    Route::post('{id}/iniciar', [EvaluacionesApiController::class, 'iniciarIntento'])
        ->middleware('role:estudiante')
        ->name('iniciar');

    // Guardar respuesta individual
    Route::post('intentos/{intentoId}/respuestas', [EvaluacionesApiController::class, 'guardarRespuesta'])
        ->middleware('role:estudiante')
        ->name('guardar-respuesta');

    // Completar intento
    Route::post('intentos/{intentoId}/completar', [EvaluacionesApiController::class, 'completarIntento'])
        ->middleware('role:estudiante')
        ->name('completar');

    // Ver mis intentos para una evaluación
    Route::get('{id}/mis-intentos', [EvaluacionesApiController::class, 'misIntentos'])
        ->middleware('role:estudiante')
        ->name('mis-intentos');

    // Ver detalles de un intento específico
    Route::get('intentos/{id}', [EvaluacionesApiController::class, 'verIntento'])
        ->name('ver-intento');

    // Obtener análisis IA de un intento
    Route::get('intentos/{id}/analisis-ia', [EvaluacionesApiController::class, 'obtenerAnalisisIA'])
        ->name('analisis-ia');
});
