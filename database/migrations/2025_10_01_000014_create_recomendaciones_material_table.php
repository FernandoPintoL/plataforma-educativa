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
        Schema::create('recomendaciones_material', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resultado_analisis_id')->constrained('resultados_analisis')->onDelete('cascade');
            $table->foreignId('material_apoyo_id')->constrained('materiales_apoyo')->onDelete('cascade');
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->double('relevancia', 5, 4); // 0-1
            $table->boolean('asignado')->default(false);
            $table->timestamp('fecha_asignacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recomendaciones_material');
    }
};
