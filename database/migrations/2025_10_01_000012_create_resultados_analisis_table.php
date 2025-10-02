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
        Schema::create('resultados_analisis', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trabajo_id')->constrained('trabajos')->onDelete('cascade');
            $table->foreignId('sistema_analisis_id')->constrained('sistemas_analisis')->onDelete('cascade');
            $table->json('areas_fortaleza');
            $table->json('areas_debilidad');
            $table->double('confianza_predictiva', 5, 4);
            $table->json('recomendaciones');
            $table->json('metadatos')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultados_analisis');
    }
};
