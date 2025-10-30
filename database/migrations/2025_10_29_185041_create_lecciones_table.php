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
        Schema::create('lecciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('modulo_educativo_id')->constrained('modulos_educativos')->onDelete('cascade');
            $table->string('titulo');
            $table->text('contenido')->nullable();
            $table->string('slug')->unique();
            $table->enum('tipo', ['video', 'lectura', 'actividad', 'quiz', 'recurso', 'enlace'])->default('lectura');
            $table->integer('orden')->default(0);
            $table->integer('duracion_estimada')->nullable()->comment('Duración en minutos');
            $table->string('video_url')->nullable();
            $table->string('video_proveedor')->nullable()->comment('youtube, vimeo, local');
            $table->boolean('es_obligatoria')->default(true);
            $table->boolean('permite_descarga')->default(true);
            $table->enum('estado', ['borrador', 'publicado', 'archivado'])->default('borrador');
            $table->timestamps();

            // Índices para mejorar performance
            $table->index(['modulo_educativo_id', 'orden']);
            $table->index('estado');
            $table->index('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lecciones');
    }
};
