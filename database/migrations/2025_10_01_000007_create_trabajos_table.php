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
        Schema::create('trabajos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contenido_id')->constrained('contenidos')->onDelete('cascade');
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->json('respuestas')->nullable(); // Para respuestas de evaluaciones
            $table->text('comentarios')->nullable(); // Para comentarios del estudiante
            $table->enum('estado', ['en_progreso', 'entregado', 'calificado', 'devuelto'])->default('en_progreso');
            $table->timestamp('fecha_entrega')->nullable();
            $table->timestamp('fecha_inicio')->nullable();
            $table->integer('tiempo_total')->nullable(); // en minutos
            $table->integer('intentos')->default(0);
            $table->integer('consultas_material')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trabajos');
    }
};
