<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Si la columna destinatario_id ya existe, simplemente marcar como completada
        if (Schema::hasColumn('notificaciones', 'destinatario_id')) {
            return;
        }

        Schema::table('notificaciones', function (Blueprint $table) {
            $table->foreignId('destinatario_id')->constrained('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notificaciones', function (Blueprint $table) {
            if (Schema::hasColumn('notificaciones', 'destinatario_id')) {
                // Intentar dropear la FK primero
                try {
                    $table->dropForeignIdFor(\App\Models\User::class, 'destinatario_id');
                } catch (\Exception $e) {
                    // Si falla, intentar con nombre específico
                    try {
                        DB::statement('ALTER TABLE notificaciones DROP CONSTRAINT IF EXISTS notificaciones_destinatario_id_foreign');
                    } catch (\Exception $e2) {
                        // Ignorar si falla
                    }
                }
                // Finalmente, dropear la columna
                $table->dropColumn('destinatario_id');
            }
        });
    }
};
