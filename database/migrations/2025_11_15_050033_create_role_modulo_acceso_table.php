<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Tabla que controla qué MÓDULOS DEL SIDEBAR ve cada ROL.
     * Independiente de los permisos de Spatie (que controlan ACCIONES).
     *
     * CAPA 3: Control de UI/Menú
     * - Una entrada = El rol PUEDE VER el módulo
     * - Sin entrada = El rol NO PUEDE VER el módulo
     * - Visible = true/false para habilitar/deshabilitar dinámicamente
     */
    public function up(): void
    {
        Schema::create('role_modulo_acceso', function (Blueprint $table) {
            $table->id();

            // Relación con roles (Spatie)
            $table->foreignId('role_id')
                ->constrained('roles')
                ->cascadeOnDelete();

            // Relación con módulos del sidebar
            $table->foreignId('modulo_sidebar_id')
                ->constrained('modulos_sidebar')
                ->cascadeOnDelete();

            // Control de visibilidad
            $table->boolean('visible')->default(true);
            $table->text('descripcion')->nullable()->comment('Motivo por el cual este rol accede a este módulo');

            $table->timestamps();

            // Clave única: Un rol solo tiene UNA entrada por módulo
            $table->unique(['role_id', 'modulo_sidebar_id']);

            // Índices para queries frecuentes
            $table->index('role_id');
            $table->index('modulo_sidebar_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_modulo_acceso');
    }
};
