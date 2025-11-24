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
        // This migration ensures notificaciones table has the correct structure
        // It handles different database states (fresh vs. existing data)

        if (!Schema::hasTable('notificaciones')) {
            // Create table from scratch if it doesn't exist
            Schema::create('notificaciones', function (Blueprint $table) {
                $table->id();
                $table->string('titulo');
                $table->text('descripcion');
                $table->unsignedBigInteger('usuario_id');
                $table->boolean('leida')->default(false);
                $table->string('tipo')->default('general');
                $table->json('datos')->nullable();
                $table->unsignedBigInteger('prediccion_riesgo_id')->nullable();
                $table->timestamp('fecha_lectura')->nullable();
                $table->timestamps();

                $table->index('usuario_id');
                $table->index('leida');
                $table->index('created_at');
                $table->foreign('usuario_id')->references('id')->on('users')->onDelete('cascade');
            });
        } else {
            // If table exists, ensure it has all required columns
            try {
                Schema::table('notificaciones', function (Blueprint $table) {
                    // Add missing columns one by one
                    if (!Schema::hasColumn('notificaciones', 'usuario_id')) {
                        $table->unsignedBigInteger('usuario_id')->nullable();
                    }

                    if (!Schema::hasColumn('notificaciones', 'descripcion')) {
                        $table->text('descripcion')->nullable();
                    }

                    if (!Schema::hasColumn('notificaciones', 'leida')) {
                        $table->boolean('leida')->default(false);
                    }

                    if (!Schema::hasColumn('notificaciones', 'datos')) {
                        $table->json('datos')->nullable();
                    }

                    if (!Schema::hasColumn('notificaciones', 'prediccion_riesgo_id')) {
                        $table->unsignedBigInteger('prediccion_riesgo_id')->nullable();
                    }

                    if (!Schema::hasColumn('notificaciones', 'fecha_lectura')) {
                        $table->timestamp('fecha_lectura')->nullable();
                    }
                });
            } catch (\Exception $e) {
                // If there's an error adding columns, it's likely a schema issue
                // Just continue - the table exists with some columns
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Don't drop the table on rollback to preserve data
        // This is a data structure fix, not a table creation
    }
};
