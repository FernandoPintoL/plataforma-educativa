<?php

namespace Database\Seeders;

use App\Models\Contenido;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Seeder;

class AsignacionTareasSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener profesor1 y estudiante1
        $profesor1 = User::where('email', 'profesor1@paucara.test')->first();
        $estudiante1 = User::where('email', 'estudiante1@paucara.test')->first();

        if (!$profesor1 || !$estudiante1) {
            $this->command->warn('profesor1 o estudiante1 no existen.');
            return;
        }

        // Obtener todas las tareas creadas por profesor1
        $tareas = Contenido::where('creador_id', $profesor1->id)
            ->where('tipo', 'tarea')
            ->get();

        if ($tareas->isEmpty()) {
            $this->command->warn('No hay tareas creadas por profesor1. Ejecuta TareasSeeder primero.');
            return;
        }

        $asignacionesCreadas = 0;

        foreach ($tareas as $tarea) {
            // Obtener estudiantes inscritos en el curso
            $estudiantes = $tarea->curso->estudiantes()->get();

            foreach ($estudiantes as $estudiante) {
                // Verificar si la asignación ya existe
                $existente = Trabajo::query()
                    ->where('contenido_id', $tarea->id)
                    ->where('estudiante_id', $estudiante->id)
                    ->first();

                if (!$existente) {
                    // Crear la asignación (trabajo)
                    Trabajo::create([
                        'contenido_id' => $tarea->id,
                        'estudiante_id' => $estudiante->id,
                        'respuestas' => null,
                        'comentarios' => null,
                        'estado' => 'en_progreso',
                        'fecha_inicio' => now(),
                        'fecha_entrega' => null,
                        'tiempo_total' => null,
                        'intentos' => 0,
                        'consultas_material' => 0,
                    ]);

                    if ($estudiante->id === $estudiante1->id) {
                        $this->command->info("✓ Tarea '{$tarea->titulo}' asignada a estudiante1");
                    }

                    $asignacionesCreadas++;
                }
            }
        }

        $this->command->info("Total de {$asignacionesCreadas} asignaciones de tareas creadas.");
        $this->command->info("estudiante1 tiene acceso a todas las tareas del profesor1.");
    }
}
