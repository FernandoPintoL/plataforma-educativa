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
        Schema::create('padre_estudiante', function (Blueprint $table) {
            $table->id();

            // Foreign keys
            $table->foreignId('padre_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('ID del padre/apoderado');

            $table->foreignId('estudiante_id')
                ->constrained('users')
                ->onDelete('cascade')
                ->comment('ID del estudiante');

            // Relationship type
            $table->enum('relacion', ['padre', 'madre', 'apoderado'])
                ->default('padre')
                ->comment('Tipo de relación con el estudiante');

            // Status
            $table->boolean('activo')
                ->default(true)
                ->comment('Indica si la relación está activa');

            // Timestamps
            $table->timestamps();

            // Unique constraint
            $table->unique(['padre_id', 'estudiante_id'], 'padre_estudiante_unique')
                ->comment('Un padre no puede estar vinculado dos veces al mismo estudiante');

            // Indexes
            $table->index('padre_id');
            $table->index('estudiante_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('padre_estudiante');
    }
};
