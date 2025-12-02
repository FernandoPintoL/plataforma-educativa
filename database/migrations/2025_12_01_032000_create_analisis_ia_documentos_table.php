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
        Schema::create('analisis_ia_documentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('calificacion_id')->constrained('calificaciones')->onDelete('cascade');
            $table->foreignId('trabajo_id')->constrained('trabajos')->onDelete('cascade');
            $table->double('porcentaje_ia', 5, 2)->default(0); // Porcentaje de similitud/contenido IA
            $table->json('detalles_analisis')->nullable(); // Detalles del análisis
            $table->string('estado')->default('pendiente'); // pendiente, procesando, completado, error
            $table->text('mensaje_error')->nullable(); // Si hay error
            $table->timestamp('fecha_analisis')->nullable(); // Cuándo se ejecutó el análisis
            $table->timestamps();

            // Índices para búsquedas frecuentes
            $table->index('calificacion_id');
            $table->index('trabajo_id');
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('analisis_ia_documentos');
    }
};
