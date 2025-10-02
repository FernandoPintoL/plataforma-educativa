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
        Schema::create('evaluaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contenido_id')->constrained('contenidos')->onDelete('cascade');
            $table->string('tipo_evaluacion');
            $table->integer('puntuacion_total')->default(100);
            $table->integer('tiempo_limite')->nullable(); // en minutos
            $table->boolean('calificacion_automatica')->default(false);
            $table->boolean('mostrar_respuestas')->default(true);
            $table->boolean('permite_reintento')->default(false);
            $table->integer('max_reintentos')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluaciones');
    }
};
