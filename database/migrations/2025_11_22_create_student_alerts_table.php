<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_alerts', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('estudiante_id');
            $table->unsignedBigInteger('monitoring_id')->nullable(); // Reference to triggering event

            // Alert details
            $table->enum('tipo_alerta', [
                'riesgo_abandono',      // Student showing signs of abandoning work
                'bajo_progreso',        // Slow progress on task
                'dificultad_conceptual',// Struggling with concepts
                'falta_comprension',    // Lack of understanding indicators
                'desempeño_inconsistente', // Inconsistent performance
                'tiempo_excesivo',      // Spending too much time
                'inactividad',          // No activity for extended period
                'patrones_error',       // Repeating common errors
            ])->index();

            $table->enum('severidad', ['baja', 'media', 'alta', 'critica'])->default('media');
            $table->float('confianza')->nullable(); // Confidence score 0-1

            // Alert content
            $table->text('mensaje')->nullable(); // Alert message for student
            $table->text('recomendacion')->nullable(); // Recommended action
            $table->json('detalles_alerta')->nullable(); // Additional alert details
            $table->json('metricas_activacion')->nullable(); // Metrics that triggered alert

            // Status
            $table->enum('estado', ['generada', 'notificada', 'intervenida', 'resuelta', 'falsa_alarma'])->default('generada');

            // Response
            $table->timestamp('fecha_generacion')->nullable();
            $table->timestamp('fecha_notificacion')->nullable();
            $table->timestamp('fecha_intervencion')->nullable();
            $table->timestamp('fecha_resolucion')->nullable();

            // Teacher response
            $table->unsignedBigInteger('profesor_id')->nullable();
            $table->text('accion_profesor')->nullable();
            $table->timestamp('fecha_revision_profesor')->nullable();

            // Effectiveness tracking
            $table->float('impacto_en_desempeño')->nullable(); // Change in performance after alert
            $table->boolean('estudiante_mejoro')->nullable(); // Did student improve after alert?

            $table->timestamps();

            // Foreign keys
            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('estudiante_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('profesor_id')->references('id')->on('users')->onDelete('set null');

            // Indexes
            $table->index('estudiante_id');
            $table->index('trabajo_id');
            $table->index('estado');
            $table->index('severidad');
            $table->index('fecha_generacion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_alerts');
    }
};
