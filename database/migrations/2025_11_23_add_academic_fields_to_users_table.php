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
        Schema::table('users', function (Blueprint $table) {
            // Fields for professors
            $table->string('especialidad')->nullable()->after('activo');

            // Fields for students
            $table->integer('grado')->nullable()->after('especialidad');
            $table->string('seccion')->nullable()->after('grado');
            $table->string('numero_matricula')->nullable()->unique()->after('seccion');

            // Academic performance data
            $table->decimal('desempeño_promedio', 5, 2)->nullable()->after('numero_matricula');
            $table->string('categoria_desempeño')->nullable()->after('desempeño_promedio');
            $table->decimal('asistencia_porcentaje', 5, 2)->nullable()->after('categoria_desempeño');
            $table->decimal('participacion_porcentaje', 5, 2)->nullable()->after('asistencia_porcentaje');
            $table->integer('tareas_completadas')->nullable()->after('participacion_porcentaje');
            $table->integer('tareas_pendientes')->nullable()->after('tareas_completadas');
            $table->integer('actividad_hoy')->nullable()->after('tareas_pendientes');
            $table->string('tendencia_actividad')->nullable()->after('actividad_hoy');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'especialidad',
                'grado',
                'seccion',
                'numero_matricula',
                'desempeño_promedio',
                'categoria_desempeño',
                'asistencia_porcentaje',
                'participacion_porcentaje',
                'tareas_completadas',
                'tareas_pendientes',
                'actividad_hoy',
                'tendencia_actividad',
            ]);
        });
    }
};
