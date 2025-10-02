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
            $table->string('apellido')->nullable()->after('name');
            $table->date('fecha_nacimiento')->nullable()->after('apellido');
            $table->string('telefono')->nullable()->after('fecha_nacimiento');
            $table->text('direccion')->nullable()->after('telefono');
            $table->enum('tipo_usuario', ['profesor', 'estudiante', 'director', 'padre', 'admin'])->default('estudiante')->after('direccion');
            $table->boolean('activo')->default(true)->after('tipo_usuario');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'apellido',
                'fecha_nacimiento',
                'telefono',
                'direccion',
                'tipo_usuario',
                'activo'
            ]);
        });
    }
};
