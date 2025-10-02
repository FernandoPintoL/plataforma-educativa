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
        Schema::create('preguntas_test', function (Blueprint $table) {
            $table->id();
            $table->foreignId('categoria_test_id')->constrained('categorias_test')->onDelete('cascade');
            $table->text('enunciado');
            $table->enum('tipo', ['opcion_multiple', 'escala_likert', 'verdadero_falso']);
            $table->json('opciones')->nullable();
            $table->integer('orden')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('preguntas_test');
    }
};
