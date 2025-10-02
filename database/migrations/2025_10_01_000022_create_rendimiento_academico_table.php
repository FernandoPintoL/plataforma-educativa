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
        Schema::create('rendimiento_academico', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->json('materias'); // {materia: promedio}
            $table->double('promedio', 5, 2);
            $table->json('fortalezas');
            $table->json('debilidades');
            $table->string('tendencia_temporal'); // mejorando, estable, empeorando
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rendimiento_academico');
    }
};
