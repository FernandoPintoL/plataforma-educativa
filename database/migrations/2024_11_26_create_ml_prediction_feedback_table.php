<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ml_prediction_feedback', function (Blueprint $table) {
            $table->id();

            // Referencias
            $table->unsignedBigInteger('estudiante_id')->index();
            $table->foreign('estudiante_id')->references('id')->on('users')->onDelete('cascade');

            // Predicción original
            $table->enum('prediction_type', ['risk', 'carrera', 'tendencia', 'progreso', 'cluster', 'anomaly']);
            $table->json('predicted_value')->comment('Valor predicho');
            $table->float('predicted_score', 8, 4)->nullable()->comment('Score de la predicción');
            $table->float('confidence', 8, 4)->nullable()->comment('Confianza del modelo');
            $table->string('modelo_version')->nullable()->comment('Versión del modelo usado');

            // Resultado real (feedback)
            $table->json('actual_value')->nullable()->comment('Valor real observado');
            $table->float('actual_score', 8, 4)->nullable()->comment('Score real');
            $table->boolean('prediction_correct')->nullable()->comment('¿Fue correcta la predicción?');

            // Métricas de error
            $table->float('error_margin', 8, 4)->nullable()->comment('Margen de error');
            $table->float('error_percentage', 8, 4)->nullable()->comment('Porcentaje de error');
            $table->enum('accuracy_level', ['excellent', 'good', 'fair', 'poor'])->nullable();

            // Contexto de la predicción
            $table->json('student_context')->nullable()->comment('Datos del estudiante en momento de predicción');
            $table->json('prediction_details')->nullable()->comment('Detalles completos de la predicción');
            $table->json('validation_result')->nullable()->comment('Resultado de validación de coherencia');

            // Tracking de proceso
            $table->timestamp('prediction_timestamp')->comment('Cuándo se hizo la predicción');
            $table->timestamp('feedback_timestamp')->nullable()->comment('Cuándo se registró el feedback real');
            $table->integer('days_to_feedback')->nullable()->comment('Días hasta obtener feedback real');

            // Análisis
            $table->text('notes')->nullable()->comment('Notas sobre la predicción o feedback');
            $table->boolean('requires_review')->default(false)->comment('¿Requiere revisión manual?');
            $table->string('review_reason')->nullable()->comment('Razón de revisión');

            $table->timestamps();

            // Índices para queries rápidas
            $table->index(['estudiante_id', 'prediction_type']);
            $table->index(['prediction_timestamp']);
            $table->index(['accuracy_level']);
            $table->index(['requires_review']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ml_prediction_feedback');
    }
};
