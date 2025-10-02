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
        Schema::create('preguntas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evaluacion_id')->constrained('evaluaciones')->onDelete('cascade');
            $table->text('enunciado');
            $table->enum('tipo', ['opcion_multiple', 'verdadero_falso', 'respuesta_corta', 'respuesta_larga']);
            $table->json('opciones')->nullable(); // Para opciones múltiples
            $table->string('respuesta_correcta')->nullable();
            $table->integer('puntos')->default(1);
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preguntas');
    }
};
