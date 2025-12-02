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
        Schema::create('resultados_test_vocacional', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_vocacional_id')->constrained('tests_vocacionales')->onDelete('cascade');
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->json('respuestas')->nullable();
            $table->timestamp('fecha_completacion')->nullable();
            $table->float('puntuacion_total')->nullable();
            $table->json('puntajes_por_categoria')->nullable();
            $table->string('perfil_vocacional')->nullable();
            $table->text('recomendaciones')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('resultados_test_vocacional');
    }
};
