<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agrega campos para monitoreo de progreso ML:
     * - Tiempo total dedicado
     * - Número de intentos
     * - Consultas de material
     * - Score de dificultad detectada
     * - Último evento de monitoreo
     */
    public function up(): void
    {
        Schema::table('trabajos', function (Blueprint $table) {
            // Campos de monitoreo (algunos podrían ya existir)
            if (!Schema::hasColumn('trabajos', 'tiempo_total')) {
                $table->integer('tiempo_total')->nullable()->default(0)->after('fecha_inicio');
            }

            if (!Schema::hasColumn('trabajos', 'intentos')) {
                $table->integer('intentos')->nullable()->default(0)->after('tiempo_total');
            }

            if (!Schema::hasColumn('trabajos', 'consultas_material')) {
                $table->integer('consultas_material')->nullable()->default(0)->after('intentos');
            }

            // Nuevos campos para ML
            $table->float('dificultad_detectada')->nullable()->default(0)->after('consultas_material');
            $table->float('progreso_estimado_porcentaje')->nullable()->default(0)->after('dificultad_detectada');
            $table->integer('num_hints_generados')->nullable()->default(0)->after('progreso_estimado_porcentaje');
            $table->integer('num_hints_utilizados')->nullable()->default(0)->after('num_hints_generados');

            // Riesgo de entrega tardía
            $table->boolean('riesgo_entrega_tardía')->default(false)->after('num_hints_utilizados');
            $table->string('nivel_riesgo_entrega')->nullable()->default('bajo')->after('riesgo_entrega_tardía');

            // Último análisis ML
            $table->timestamp('ultimo_analisis_ml')->nullable()->after('nivel_riesgo_entrega');

            // Índices para búsquedas rápidas
            $table->index('dificultad_detectada');
            $table->index('riesgo_entrega_tardía');
            $table->index('ultimo_analisis_ml');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('trabajos', function (Blueprint $table) {
            $table->dropIndex(['dificultad_detectada']);
            $table->dropIndex(['riesgo_entrega_tardía']);
            $table->dropIndex(['ultimo_analisis_ml']);

            $table->dropColumn([
                'dificultad_detectada',
                'progreso_estimado_porcentaje',
                'num_hints_generados',
                'num_hints_utilizados',
                'riesgo_entrega_tardía',
                'nivel_riesgo_entrega',
                'ultimo_analisis_ml',
            ]);
        });
    }
};
