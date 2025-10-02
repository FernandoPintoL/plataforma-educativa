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
        Schema::create('recursos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('tipo'); // video, documento, imagen, enlace, etc.
            $table->string('url')->nullable();
            $table->text('descripcion')->nullable();
            $table->string('archivo_path')->nullable();
            $table->integer('tamaño')->nullable(); // en bytes
            $table->string('mime_type')->nullable();
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('recursos');
    }
};
