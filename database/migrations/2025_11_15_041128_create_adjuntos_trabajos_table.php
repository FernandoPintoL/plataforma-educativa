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
        Schema::create('adjuntos_trabajos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('trabajo_id')->constrained('trabajos')->onDelete('cascade');
            $table->string('nombre_original'); // Nombre original del archivo
            $table->string('archivo_path'); // Ruta almacenada en storage
            $table->string('mime_type')->nullable(); // Tipo MIME del archivo
            $table->bigInteger('tamanio')->nullable(); // Tamaño en bytes
            $table->string('hash')->nullable(); // Hash del archivo para verificación
            $table->text('descripcion')->nullable(); // Descripción del adjunto
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('adjuntos_trabajos');
    }
};
