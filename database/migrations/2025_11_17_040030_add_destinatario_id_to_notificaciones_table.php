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
        Schema::table('notificaciones', function (Blueprint $table) {
            // Agregar columna destinatario_id si no existe
            if (!Schema::hasColumn('notificaciones', 'destinatario_id')) {
                $table->foreignId('destinatario_id')->constrained('users')->onDelete('cascade');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notificaciones', function (Blueprint $table) {
            if (Schema::hasColumn('notificaciones', 'destinatario_id')) {
                $table->dropForeignIdFor(\App\Models\User::class, 'destinatario_id');
                $table->dropColumn('destinatario_id');
            }
        });
    }
};
