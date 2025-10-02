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
        Schema::create('perfiles_vocacionales', function (Blueprint $table) {
            $table->id();
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');
            $table->json('intereses'); // {categoria: puntaje}
            $table->json('habilidades'); // {habilidad: puntaje}
            $table->json('personalidad'); // {trait: puntaje}
            $table->json('aptitudes'); // {aptitud: puntaje}
            $table->timestamp('fecha_creacion');
            $table->timestamp('fecha_actualizacion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('perfiles_vocacionales');
    }
};
