<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('feedback_analysis', function (Blueprint $table) {
            $table->id();

            // Relationships
            $table->unsignedBigInteger('calificacion_id')->unique();
            $table->unsignedBigInteger('trabajo_id');
            $table->unsignedBigInteger('profesor_id')->nullable();

            // AI-generated analysis
            $table->text('feedback_analysis')->nullable(); // Detailed analysis from agent
            $table->json('conceptos_identificados')->nullable(); // Key concepts identified
            $table->json('errores_comunes')->nullable(); // Common errors found
            $table->json('areas_mejora')->nullable(); // Areas for improvement

            // Structured feedback by criteria
            $table->json('feedback_por_criterio')->nullable(); // Feedback organized by rubric criteria

            // Status and workflow
            $table->enum('estado', ['generado', 'aprobado', 'rechazado', 'revisado'])->default('generado');
            $table->text('feedback_final')->nullable(); // Final feedback after professor approval
            $table->json('cambios_profesor')->nullable(); // Edits/changes made by professor

            // Metadata
            $table->float('confidence_score')->nullable(); // Agent confidence score (0-1)
            $table->float('tiempo_generacion')->nullable(); // Generation time in milliseconds

            // Timestamps
            $table->timestamp('fecha_analisis')->nullable();
            $table->timestamp('fecha_aprobacion')->nullable();
            $table->timestamps();

            // Foreign keys
            $table->foreign('calificacion_id')->references('id')->on('calificaciones')->onDelete('cascade');
            $table->foreign('trabajo_id')->references('id')->on('trabajos')->onDelete('cascade');
            $table->foreign('profesor_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('feedback_analysis');
    }
};
