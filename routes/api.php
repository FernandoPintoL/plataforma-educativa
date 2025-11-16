<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalisisRiesgoController;
use App\Http\Controllers\Api\ExportarReportesController;
use App\Http\Controllers\Api\MLPipelineController;

/**
 * API Routes
 *
 * These routes are protected by the "api" middleware and require authentication
 */

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
});
