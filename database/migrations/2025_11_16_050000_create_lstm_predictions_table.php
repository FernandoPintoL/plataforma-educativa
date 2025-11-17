<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Crea tabla para almacenar predicciones LSTM de desempeño temporal
     * PASO 5: Deep Learning - Análisis Temporal con LSTM
     */
    public function up(): void
    {
        Schema::create('lstm_predictions', function (Blueprint $table) {
            $table->id();

            // Relación con estudiante
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');

            // Predicción temporal
            $table->float('prediccion_valor'); // Valor predicho de siguiente calificación
            $table->string('prediccion_tipo'); // 'proyeccion' | 'anomalia' | 'tendencia'
            $table->float('confianza')->default(0.0); // 0-1, qué tan seguro es el modelo

            // Análisis de la secuencia
            $table->json('secuencia_analizada'); // Array con últimas N calificaciones
            $table->integer('lookback_periods')->default(5); // Cuántos períodos de datos usó
            $table->integer('periodos_futuro')->default(1); // Cuántos períodos proyecta

            // Anomalías detectadas
            $table->boolean('es_anomalia')->default(false);
            $table->float('anomaly_score')->nullable(); // Score de anomalía (0-1)
            $table->string('anomaly_tipo')->nullable(); // 'cambio_tendencia' | 'valor_extremo' | etc

            // Estadísticas de la secuencia
            $table->float('promedio_secuencia')->nullable();
            $table->float('desviacion_estandar')->nullable();
            $table->float('minimo_secuencia')->nullable();
            $table->float('maximo_secuencia')->nullable();
            $table->float('velocidad_cambio')->nullable(); // Pendiente aproximada

            // Modelo utilizado
            $table->string('modelo_tipo')->default('LSTMPredictor');
            $table->string('modelo_version')->default('v1.0-deep-learning');
            $table->json('hiperparametros')->nullable(); // lookback, lstm_units, etc
            $table->json('features_usado')->nullable(); // Features utilizadas

            // Información temporal
            $table->timestamp('fecha_prediccion')->useCurrent(); // Cuándo se hizo la predicción
            $table->timestamp('fecha_validacion')->nullable(); // Cuándo se validó
            $table->float('error_validacion')->nullable(); // Error real vs predicho (después de validar)
            $table->boolean('validado')->default(false);

            // Metadata
            $table->text('notas')->nullable(); // Notas adicionales
            $table->unsignedBigInteger('creado_por')->default(1); // Admin/System

            // Timestamps
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('estudiante_id');
            $table->index('prediccion_tipo');
            $table->index('es_anomalia');
            $table->index('fecha_prediccion');
            $table->index('confianza');
            $table->index('validado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lstm_predictions');
    }
};
