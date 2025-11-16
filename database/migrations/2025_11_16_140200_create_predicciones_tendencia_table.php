<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('predicciones_tendencia', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('fk_curso_id')->nullable()->constrained('cursos', 'id')->onDelete('set null');

            // Tendencia
            $table->enum('tendencia', ['mejorando', 'estable', 'declinando', 'fluctuando'])
                ->comment('Categoría de tendencia académica');
            $table->decimal('confianza', 5, 4)->nullable()->comment('Confianza de la predicción');

            // Metadata
            $table->timestamp('fecha_prediccion')->useCurrent();
            $table->string('modelo_version', 50)->default('v1.0');

            // Auditoría
            $table->timestamps();
            $table->softDeletes();

            // Índices
            $table->index('estudiante_id');
            $table->index('fk_curso_id');
            $table->index('tendencia');
            $table->index('fecha_prediccion');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('predicciones_tendencia');
    }
};
