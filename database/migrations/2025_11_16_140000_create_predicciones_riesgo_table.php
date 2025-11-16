<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predicciones_riesgo', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('fk_curso_id')->nullable()->constrained('cursos', 'id')->onDelete('set null');

            // Score y nivel de riesgo
            $table->decimal('score_riesgo', 5, 4)->comment('Probabilidad de riesgo (0.0-1.0)');
            $table->enum('nivel_riesgo', ['alto', 'medio', 'bajo'])->comment('Categoría de riesgo');
            $table->decimal('confianza', 5, 4)->nullable()->comment('Confianza de la predicción');

            // Metadata
            $table->timestamp('fecha_prediccion')->useCurrent();
            $table->string('modelo_version', 50)->default('v1.0');
            $table->longText('factores_influyentes')->nullable()->comment('JSON con factores que influyeron');
            $table->text('observaciones')->nullable();

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('estudiante_id');
            $table->index('fk_curso_id');
            $table->index('nivel_riesgo');
            $table->index('fecha_prediccion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predicciones_riesgo');
    }
};
