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
        Schema::create('predicciones_progreso', function (Blueprint $table) {
            $table->id();

            // Relación con estudiante
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');

            // Predicciones de progreso
            $table->float('nota_proyectada')->nullable(); // Nota final esperada (0-100)
            $table->float('velocidad_aprendizaje')->nullable(); // Pendiente de la regresión
            $table->string('tendencia_progreso'); // mejorando, estable, declinando
            $table->float('confianza_prediccion')->default(0.0); // 0-1

            // Análisis temporal
            $table->integer('semanas_analizadas')->default(0); // Cuántos datos usó
            $table->float('varianza_notas')->nullable(); // Qué tan consistente es
            $table->float('promedio_historico')->nullable(); // Promedio histórico

            // Modelo utilizado
            $table->string('modelo_tipo')->default('ProgressAnalyzer');
            $table->string('modelo_version')->default('v1.0-pipeline');
            $table->json('features_usado')->nullable(); // Features utilizadas

            // Metadata
            $table->timestamp('fecha_prediccion')->useCurrent();
            $table->unsignedBigInteger('creado_por')->default(1); // Admin/System

            // Timestamps
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('estudiante_id');
            $table->index('tendencia_progreso');
            $table->index('fecha_prediccion');
            $table->index('confianza_prediccion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('predicciones_progreso');
    }
};
