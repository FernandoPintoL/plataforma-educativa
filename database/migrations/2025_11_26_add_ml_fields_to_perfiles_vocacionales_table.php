<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Agrega campos ML a la tabla perfiles_vocacionales para almacenar:
     * - Predicciones de carrera (supervisado)
     * - Clustering de aptitudes (no supervisado)
     * - Validación de coherencia (cross-model)
     * - Recomendaciones personalizadas
     * - Confianza de predicciones
     */
    public function up(): void
    {
        Schema::table('perfiles_vocacionales', function (Blueprint $table) {
            // Campos para predicciones ML
            $table->string('carrera_predicha_ml')->nullable()->after('aptitudes');
            $table->float('confianza_prediccion')->nullable()->default(0)->after('carrera_predicha_ml');

            // Campos para clustering (no supervisado)
            $table->integer('cluster_aptitud')->nullable()->after('confianza_prediccion');
            $table->float('probabilidad_cluster')->nullable()->default(0)->after('cluster_aptitud');

            // Detalles de predicciones ML (JSON para almacenar supervisada + no supervisada + validación)
            $table->json('prediccion_detalles')->nullable()->after('probabilidad_cluster');

            // Recomendaciones personalizadas
            $table->json('recomendaciones_personalizadas')->nullable()->after('prediccion_detalles');

            // Índices para búsquedas rápidas
            $table->index('carrera_predicha_ml');
            $table->index('cluster_aptitud');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('perfiles_vocacionales', function (Blueprint $table) {
            $table->dropIndex(['carrera_predicha_ml']);
            $table->dropIndex(['cluster_aptitud']);
            $table->dropColumn([
                'carrera_predicha_ml',
                'confianza_prediccion',
                'cluster_aptitud',
                'probabilidad_cluster',
                'prediccion_detalles',
                'recomendaciones_personalizadas',
            ]);
        });
    }
};
