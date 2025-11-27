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
        Schema::create('question_usage', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('question_bank')->onDelete('cascade');
            $table->foreignId('evaluacion_id')->constrained('evaluaciones')->onDelete('cascade');
            $table->integer('orden')->default(0); // Posición en la evaluación
            $table->integer('puntos_asignados'); // Puede variar del default
            $table->timestamps();

            $table->index(['evaluacion_id', 'orden']);
            $table->index('question_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_usage');
    }
};
