<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AnalisisRiesgoController;

/**
 * API Routes
 *
 * These routes are protected by the "api" middleware and require authentication
 */

Route::middleware(['auth:sanctum'])->group(function () {
    /**
     * Rutas para Análisis de Riesgo
     */
    Route::prefix('analisis-riesgo')->name('analisis-riesgo.')->group(function () {
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
});
