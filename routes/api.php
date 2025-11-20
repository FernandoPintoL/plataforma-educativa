<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalisisRiesgoController;
use App\Http\Controllers\Api\AuthTokenController;
use App\Http\Controllers\Api\ExportarReportesController;
use App\Http\Controllers\Api\MLPipelineController;
use App\Http\Controllers\Api\NotificacionController;
use App\Http\Controllers\Api\MiPerfilController;
use App\Http\Controllers\Api\PadreChildController;

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
     * Rutas para Mi Perfil - Datos personales del estudiante autenticado
     * Acceso para estudiantes y padres (padres pueden ver datos de hijos)
     */
    Route::prefix('mi-perfil')->name('mi-perfil.')->group(function () {
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
});
