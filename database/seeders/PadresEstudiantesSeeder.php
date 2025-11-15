<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class PadresEstudiantesSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener padre1 y estudiante1
        $padre1 = User::where('email', 'padre1@paucara.test')->first();
        $estudiante1 = User::where('email', 'estudiante1@paucara.test')->first();

        if (!$padre1 || !$estudiante1) {
            $this->command->warn('padre1 o estudiante1 no existen. Asegúrate de ejecutar DatabaseSeeder primero.');
            return;
        }

        // Verificar si ya están relacionados
        if (!$padre1->hijos()->where('estudiante_id', $estudiante1->id)->exists()) {
            // Asignar estudiante1 como hijo de padre1
            $padre1->hijos()->attach($estudiante1->id, [
                'relacion' => 'padre',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $this->command->info('✓ Padre1 asignado como tutor de estudiante1');
        } else {
            $this->command->info('Padre1 ya está asignado a estudiante1');
        }

        // Asignar más relaciones padre-estudiante (opcional)
        $padre2 = User::where('email', 'padre2@paucara.test')->first();
        $estudiante2 = User::where('email', 'estudiante2@paucara.test')->first();

        if ($padre2 && $estudiante2) {
            if (!$padre2->hijos()->where('estudiante_id', $estudiante2->id)->exists()) {
                $padre2->hijos()->attach($estudiante2->id, [
                    'relacion' => 'madre',
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info('✓ Padre2 asignado como tutor de estudiante2');
            }
        }

        $padre3 = User::where('email', 'padre3@paucara.test')->first();
        $estudiante3 = User::where('email', 'estudiante3@paucara.test')->first();

        if ($padre3 && $estudiante3) {
            if (!$padre3->hijos()->where('estudiante_id', $estudiante3->id)->exists()) {
                $padre3->hijos()->attach($estudiante3->id, [
                    'relacion' => 'apoderado',
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $this->command->info('✓ Padre3 asignado como tutor de estudiante3');
            }
        }

        $this->command->info('✓ Relaciones padre-estudiante creadas exitosamente.');
    }
}
