<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * IMPORTANTE: Esta migración SOLO cambia los defaults para NUEVAS evaluaciones.
     * Las evaluaciones existentes mantienen sus configuraciones actuales.
     */
    public function up(): void
    {
        Schema::table('evaluaciones', function (Blueprint $table) {
            // Cambiar default de permite_reintento de false a true
            // Esto permite reintentos por defecto en nuevas evaluaciones
            $table->boolean('permite_reintento')->default(true)->change();

            // Cambiar default de max_reintentos de 1 a 3
            // Estudiantes pueden intentar hasta 3 veces por defecto
            $table->integer('max_reintentos')->default(3)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluaciones', function (Blueprint $table) {
            // Revertir a defaults anteriores
            $table->boolean('permite_reintento')->default(false)->change();
            $table->integer('max_reintentos')->default(1)->change();
        });
    }
};
