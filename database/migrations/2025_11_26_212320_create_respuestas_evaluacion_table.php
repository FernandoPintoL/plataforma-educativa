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
        Schema::create('respuestas_evaluacion', function (Blueprint $table) {
            $table->id();

            // Relaciones
            $table->foreignId('intento_evaluacion_id')->constrained('intentos_evaluacion')->cascadeOnDelete();
            $table->foreignId('pregunta_id')->constrained('preguntas')->cascadeOnDelete();

            // Respuesta
            $table->text('respuesta_texto')->nullable();
            $table->json('respuesta_datos')->nullable(); // Para respuestas complejas (múltiples, verdadero/falso)
            $table->longText('explicacion')->nullable(); // Explicación de la respuesta

            // Validación
            $table->boolean('es_correcta')->nullable();
            $table->decimal('puntos_obtenidos', 5, 2)->default(0);
            $table->decimal('puntos_totales', 5, 2)->nullable();

            // Timeline de respuesta
            $table->integer('tiempo_respuesta')->default(0); // En segundos
            $table->integer('numero_cambios')->default(0); // Cuantas veces cambió la respuesta
            $table->timestamp('fecha_respuesta')->nullable();

            // Análisis
            $table->float('confianza_respuesta')->nullable(); // 0-1
            $table->json('patrones')->nullable(); // Patrones identificados
            $table->text('recomendacion')->nullable();
            $table->boolean('respuesta_anomala')->default(false);

            $table->timestamps();

            // Índices
            $table->index(['intento_evaluacion_id']);
            $table->index(['pregunta_id']);
            $table->index(['es_correcta']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('respuestas_evaluacion');
    }
};
