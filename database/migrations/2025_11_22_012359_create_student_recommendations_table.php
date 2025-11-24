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
        Schema::create('student_recommendations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('student_id'); // Estudiante
            $table->unsignedBigInteger('educational_resource_id')->nullable(); // Recurso recomendado
            $table->enum('recommendation_type', ['study_resource', 'tutoring', 'intervention', 'enrichment']); // Tipo
            $table->enum('urgency', ['immediate', 'normal', 'preventive']); // Urgencia
            $table->string('subject'); // Materia: mathematics, language, etc
            $table->text('reason'); // Por qué se recomienda
            $table->float('risk_score')->nullable(); // Score de riesgo que generó recomendación
            $table->string('risk_level')->nullable(); // HIGH, MEDIUM, LOW
            $table->boolean('accepted')->default(false); // Si el alumno aceptó
            $table->boolean('completed')->default(false); // Si completó la recomendación
            $table->integer('effectiveness_rating')->nullable(); // Calificación de efectividad 1-5
            $table->timestamp('completed_at')->nullable(); // Cuándo completó
            $table->timestamps();

            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('educational_resource_id')->references('id')->on('educational_resources')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_recommendations');
    }
};
