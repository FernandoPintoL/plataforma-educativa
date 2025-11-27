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
        Schema::create('intentos_evaluacion', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('evaluacion_id')->constrained('evaluaciones')->cascadeOnDelete();
            $table->foreignId('estudiante_id')->constrained('users')->cascadeOnDelete();

            // Datos del intento
            $table->enum('estado', ['en_progreso', 'entregado', 'calificado', 'expirado'])->default('en_progreso');
            $table->json('respuestas')->nullable(); // JSON con todas las respuestas
            $table->text('comentarios')->nullable(); // Retroalimentación

            // Timeline
            $table->timestamp('fecha_inicio')->nullable();
            $table->timestamp('fecha_entrega')->nullable();
            $table->timestamp('fecha_limite')->nullable();
            $table->integer('tiempo_total')->default(0); // En minutos

            // Intentos y consultas
            $table->integer('numero_intento')->default(1);
            $table->integer('consultas_material')->default(0);
            $table->integer('cambios_respuesta')->default(0);

            // Análisis ML
            $table->decimal('puntaje_obtenido', 5, 2)->nullable();
            $table->decimal('porcentaje_acierto', 5, 2)->nullable();
            $table->float('dificultad_detectada')->nullable();
            $table->float('nivel_confianza_respuestas')->nullable();
            $table->boolean('tiene_anomalias')->default(false);
            $table->json('patrones_identificados')->nullable();
            $table->json('areas_debilidad')->nullable();
            $table->json('areas_fortaleza')->nullable();

            // Recomendaciones
            $table->json('recomendaciones_ia')->nullable();
            $table->timestamp('ultimo_analisis_ml')->nullable();

            $table->timestamps();

            // Índices
            $table->index(['evaluacion_id', 'estudiante_id']);
            $table->index(['estado']);
            $table->index(['fecha_inicio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('intentos_evaluacion');
    }
};
