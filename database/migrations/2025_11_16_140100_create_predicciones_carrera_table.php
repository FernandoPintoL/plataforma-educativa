<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predicciones_carrera', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');

            // Recomendación
            $table->string('carrera_nombre', 255)->comment('Nombre de carrera recomendada');
            $table->decimal('compatibilidad', 5, 4)->comment('Puntuación de compatibilidad (0.0-1.0)');
            $table->integer('ranking')->comment('Posición en ranking (1, 2, 3, etc)');
            $table->text('descripcion')->nullable()->comment('Descripción de por qué se recomienda');

            // Metadata
            $table->timestamp('fecha_prediccion')->useCurrent();
            $table->string('modelo_version', 50)->default('v1.0');

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('estudiante_id');
            $table->index('ranking');
            $table->index('fecha_prediccion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predicciones_carrera');
    }
};
