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
        Schema::create('student_clusters', function (Blueprint $table) {
            $table->id();

            // Relación con estudiante
            $table->foreignId('estudiante_id')->constrained('users')->onDelete('cascade');

            // Cluster assignment
            $table->integer('cluster_id')->default(0); // 0, 1, 2, 3, etc
            $table->float('cluster_distance')->nullable(); // Distancia al centroide

            // Pertenencia probabilística
            $table->json('membership_probabilities')->nullable(); // {0: 0.8, 1: 0.15, 2: 0.05}

            // Características del cluster
            $table->text('cluster_profile')->nullable(); // JSON con perfil del cluster
            $table->text('cluster_interpretation')->nullable(); // Descripción textual

            // Metadata
            $table->string('modelo_tipo')->default('KMeansSegmenter');
            $table->string('modelo_version')->default('v1.0');
            $table->integer('n_clusters_usado')->default(3);
            $table->timestamp('fecha_asignacion')->useCurrent();
            $table->unsignedBigInteger('creado_por')->default(1);

            // Timestamps
            $table->timestamps();

            // Índices para búsquedas rápidas
            $table->index('estudiante_id');
            $table->index('cluster_id');
            $table->index('fecha_asignacion');
            $table->index('cluster_distance');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_clusters');
    }
};
