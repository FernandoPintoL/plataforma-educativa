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
        Schema::create('perfil_vocacional_combinados', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('resultado_test_1_id')->nullable()->constrained('resultados_test_vocacional')->onDelete('set null');
            $table->foreignId('resultado_test_2_id')->nullable()->constrained('resultados_test_vocacional')->onDelete('set null');
            $table->foreignId('resultado_test_3_id')->nullable()->constrained('resultados_test_vocacional')->onDelete('set null');

            // Datos combinados
            $table->json('aptitudes_combinadas')->nullable();
            $table->json('preferencias_laborales')->nullable();
            $table->json('tipo_vocacional_riasec')->nullable();

            // Resultado final
            $table->string('carrera_recomendada_principal')->nullable();
            $table->json('carreras_recomendadas')->nullable();
            $table->float('confianza_general')->default(0);
            $table->text('resumen_perfil')->nullable();
            $table->json('analisis_fortalezas')->nullable();
            $table->json('analisis_oportunidades')->nullable();

            // Control
            $table->boolean('todos_tests_completados')->default(false);
            $table->timestamp('fecha_generacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfil_vocacional_combinados');
    }
};
