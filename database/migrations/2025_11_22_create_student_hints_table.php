<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('student_hints', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('estudiante_id');
            $table->unsignedBigInteger('monitoring_id')->nullable();

            // Hint details
            $table->enum('tipo_sugerencia', [
                'hint_socratico',       // Socratic method hint
                'concepto',             // Explain a concept
                'ejemplo',              // Provide an example
                'recurso',              // Point to a resource
                'motivacion',           // Encouragement
                'orientacion',          // Direction/guidance
                'validacion',           // Validate correct approach
            ])->index();

            // Content
            $table->text('contenido_sugerencia');
            $table->text('razonamiento')->nullable(); // Why this hint is being given

            // Context
            $table->string('tema_abordado')->nullable();
            $table->json('contexto_problema')->nullable(); // Context of the problem
            $table->json('analisis_respuesta')->nullable(); // Analysis of student's response

            // Effectiveness
            $table->float('relevancia_estimada')->nullable(); // 0-1 score
            $table->float('dificultad_estimada')->nullable(); // How difficult the hint is
            $table->float('especificidad')->nullable(); // How specific vs general

            // Status
            $table->enum('estado', [
                'generada',
                'mostrada',
                'utilizada',
                'ignorada',
                'no_efectiva'
            ])->default('generada');

            // Student interaction
            $table->timestamp('fecha_presentacion')->nullable();
            $table->timestamp('fecha_uso')->nullable();
            $table->boolean('ayudo_estudiante')->nullable();
            $table->json('feedback_efectividad')->nullable();

            // Socratic method specifics
            $table->json('preguntas_guia')->nullable(); // If it's a Socratic hint
            $table->integer('nivel_socracion')->nullable(); // 1-5 level of guidance

            // Teacher oversight
            $table->unsignedBigInteger('profesor_id')->nullable();
            $table->boolean('revisado_profesor')->default(false);
            $table->text('comentario_profesor')->nullable();

            $table->timestamps();

            // Foreign keys
            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('estudiante_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('profesor_id')->references('id')->on('users')->onDelete('set null');

            // Indexes (tipo_sugerencia already indexed via ->index())
            $table->index('estudiante_id');
            $table->index('trabajo_id');
            $table->index('estado');
            $table->index('ayudo_estudiante');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_hints');
    }
};
