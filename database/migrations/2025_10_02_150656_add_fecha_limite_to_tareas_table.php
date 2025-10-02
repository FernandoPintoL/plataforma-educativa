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
        Schema::table('tareas', function (Blueprint $table) {
            // Añadir la columna fecha_limite
            $table->dateTime('fecha_limite')->nullable()->after('tipo_archivo_permitido');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tareas', function (Blueprint $table) {
            // Eliminar la columna fecha_limite
            $table->dropColumn('fecha_limite');
        });
    }
};
