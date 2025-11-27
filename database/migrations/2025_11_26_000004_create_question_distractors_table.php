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
        Schema::create('question_distractors', function (Blueprint $table) {
            $table->id();
            $table->foreignId('question_id')->constrained('question_bank')->onDelete('cascade');
            $table->string('opcion'); // El texto del distractor
            $table->text('razon_incorrecta')->nullable(); // Por qué es incorrecto
            $table->string('error_comun')->nullable(); // Qué error conceptual representa
            $table->integer('veces_elegida')->default(0);
            $table->timestamps();

            $table->index('question_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('question_distractors');
    }
};
