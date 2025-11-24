<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('real_time_monitoring', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('estudiante_id');
            $table->unsignedBigInteger('contenido_id');

            // Activity tracking
            $table->enum('evento', [
                'inicio_trabajo',
                'respuesta_escrita',
                'consulta_material',
                'cambio_respuesta',
                'pausa',
                'reanudacion',
                'envio_trabajo',
                'abandono'
            ]);

            // Timing
            $table->timestamp('timestamp');
            $table->integer('duracion_evento')->nullable(); // in seconds
            $table->integer('tiempo_total_acumulado')->nullable(); // total time on task in seconds

            // Activity details
            $table->text('descripcion_evento')->nullable();
            $table->json('contexto_evento')->nullable(); // Additional context about the event
            $table->json('metricas_cognitivas')->nullable(); // Cognitive load indicators

            // Progress metrics
            $table->float('progreso_estimado')->nullable(); // Estimated progress percentage (0-100)
            $table->float('velocidad_respuesta')->nullable(); // Response speed (words/min or actions/min)
            $table->integer('num_correcciones')->default(0);
            $table->integer('num_consultas')->default(0);
            $table->json('errores_detectados')->nullable(); // Common errors identified

            // Risk indicators
            $table->enum('nivel_riesgo', ['bajo', 'medio', 'alto', 'critico'])->nullable();
            $table->float('score_riesgo')->nullable(); // Risk score 0-1
            $table->json('indicadores_riesgo')->nullable(); // Risk indicators array

            // Alerts status
            $table->boolean('alerta_generada')->default(false);
            $table->unsignedBigInteger('alerta_id')->nullable(); // Reference to generated alert

            // Hints/Interventions
            $table->boolean('sugerencia_generada')->default(false);
            $table->unsignedBigInteger('sugerencia_id')->nullable(); // Reference to hint/suggestion
            $table->enum('tipo_intervencion', ['hint', 'encouragement', 'resource', 'none'])->default('none');

            // Timestamps
            $table->timestamps();

            // Indexes
            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('estudiante_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('contenido_id')->references('id')->on('contenidos')->onDelete('cascade');

            $table->index('trabajo_id');
            $table->index('estudiante_id');
            $table->index('timestamp');
            $table->index('nivel_riesgo');
            $table->index('alerta_generada');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('real_time_monitoring');
    }
};
