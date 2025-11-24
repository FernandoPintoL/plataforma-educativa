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
        Schema::create('educational_resources', function (Blueprint $table) {
            $table->id();
            $table->string('title'); // Título del recurso
            $table->text('description'); // Descripción
            $table->enum('type', ['video', 'article', 'exercise', 'book', 'interactive']); // Tipo
            $table->enum('subject', ['mathematics', 'language', 'science', 'history', 'other']); // Materia
            $table->enum('difficulty', ['beginner', 'intermediate', 'advanced']); // Nivel
            $table->enum('risk_level', ['high', 'medium', 'low']); // Para qué nivel de riesgo sirve
            $table->string('url')->nullable(); // URL del recurso
            $table->integer('duration_minutes')->nullable(); // Duración en minutos
            $table->integer('rating')->default(0); // Calificación 0-5
            $table->integer('uses_count')->default(0); // Cuántas veces usado
            $table->string('provider'); // Khan Academy, YouTube, etc
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('educational_resources');
    }
};
