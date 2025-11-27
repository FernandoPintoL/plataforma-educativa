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
        Schema::create('question_analytics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('question_bank')->onDelete('cascade');
            $table->foreignId('evaluacion_id')->constrained('evaluaciones')->onDelete('cascade');

            // Métricas de uso
            $table->integer('veces_respondida')->default(0);
            $table->integer('veces_correcta')->default(0);
            $table->integer('veces_incorrecta')->default(0);
            $table->decimal('tasa_acierto', 5, 2)->nullable(); // Porcentaje

            // Métricas avanzadas
            $table->decimal('indice_discriminacion', 5, 2)->nullable(); // -1 a 1
            $table->decimal('tiempo_promedio_respuesta', 8, 2)->nullable(); // segundos
            $table->json('distribucion_respuestas')->nullable(); // % por cada opción

            // Análisis por cluster de estudiantes
            $table->json('rendimiento_por_cluster')->nullable(); // {cluster_0: 0.85, cluster_1: 0.45, ...}

            // Feedback
            $table->integer('reportes_incorrecta')->default(0);
            $table->text('comentarios_profesor')->nullable();

            $table->timestamps();

            $table->unique(['question_id', 'evaluacion_id']);
            $table->index('question_id');
            $table->index('evaluacion_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_analytics');
    }
};
