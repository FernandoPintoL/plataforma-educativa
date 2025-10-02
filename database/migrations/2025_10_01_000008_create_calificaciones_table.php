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
        Schema::create('calificaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trabajo_id')->constrained('trabajos')->onDelete('cascade');
            $table->double('puntaje', 5, 2);
            $table->text('comentario')->nullable();
            $table->timestamp('fecha_calificacion');
            $table->foreignId('evaluador_id')->constrained('users')->onDelete('cascade');
            $table->json('criterios_evaluacion')->nullable(); // Para criterios específicos
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calificaciones');
    }
};
