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
        Schema::create('question_bank', function (Blueprint $table) {
            $table->id();
            $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
            $table->string('tipo'); // opcion_multiple, verdadero_falso, respuesta_corta, respuesta_larga, etc.
            $table->text('enunciado');
            $table->json('opciones')->nullable(); // Array de opciones
            $table->string('respuesta_correcta');
            $table->text('explicacion')->nullable(); // Explicación de por qué es correcta

            // Metadatos pedagógicos
            $table->string('nivel_bloom'); // remember, understand, apply, analyze, evaluate, create
            $table->decimal('dificultad_estimada', 3, 2); // 0.00 - 1.00
            $table->decimal('dificultad_real', 3, 2)->nullable(); // Calculada post-uso
            $table->integer('puntos')->default(10);
            $table->json('conceptos_clave')->nullable(); // Temas que evalúa
            $table->text('notas_profesor')->nullable(); // Sugerencias pedagógicas

            // Referencias
            $table->json('referencias')->nullable(); // Enlaces a materiales, lecciones, etc.
            $table->foreignId('leccion_id')->nullable()->constrained('contenidos')->onDelete('set null');
            $table->foreignId('modulo_id')->nullable()->constrained('modulos_sidebar')->onDelete('set null');

            // Generación
            $table->string('fuente'); // groq, manual, importada
            $table->json('metadata_generacion')->nullable(); // Info del prompt, modelo usado, etc.
            $table->foreignId('creado_por')->constrained('users');

            // Estado
            $table->enum('estado', ['borrador', 'activa', 'archivada'])->default('activa');
            $table->boolean('validada')->default(false);
            $table->integer('veces_usada')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // Índices para optimización de queries
            $table->index('curso_id');
            $table->index('nivel_bloom');
            $table->index(['dificultad_estimada', 'estado']);
            $table->fullText(['enunciado', 'conceptos_clave']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_bank');
    }
};
