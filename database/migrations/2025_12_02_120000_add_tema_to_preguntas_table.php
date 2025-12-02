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
        Schema::table('preguntas', function (Blueprint $table) {
            // Agregar campo tema para mapeo preciso de errores a conceptos
            $table->string('tema', 100)
                  ->nullable()
                  ->after('respuesta_correcta')
                  ->comment('Tema o concepto que evalúa (Ej: Álgebra, Verbos, Ciclo del Agua)');

            // Index para búsquedas rápidas
            $table->index('tema');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('preguntas', function (Blueprint $table) {
            $table->dropIndex(['tema']);
            $table->dropColumn('tema');
        });
    }
};
