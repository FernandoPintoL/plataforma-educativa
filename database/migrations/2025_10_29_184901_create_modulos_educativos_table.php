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
        Schema::create('modulos_educativos', function (Blueprint $table) {
            $table->id();
            $table->string('titulo');
            $table->text('descripcion')->nullable();
            $table->string('slug')->unique();
            $table->foreignId('curso_id')->constrained('cursos')->onDelete('cascade');
            $table->integer('orden')->default(0);
            $table->string('imagen_portada')->nullable();
            $table->enum('estado', ['borrador', 'publicado', 'archivado'])->default('borrador');
            $table->integer('duracion_estimada')->nullable()->comment('Duración en minutos');
            $table->foreignId('creador_id')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            // Índices para mejorar performance
            $table->index(['curso_id', 'orden']);
            $table->index('estado');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('modulos_educativos');
    }
};
