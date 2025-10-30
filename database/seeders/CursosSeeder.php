<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Seeder;

class CursosSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener profesor1 y estudiante1
        $profesor1 = User::where('email', 'profesor1@paucara.test')->first();
        $estudiante1 = User::where('email', 'estudiante1@paucara.test')->first();

        if (!$profesor1 || !$estudiante1) {
            $this->command->warn('profesor1 o estudiante1 no existen. Asegúrate de ejecutar DatabaseSeeder primero.');
            return;
        }

        // Crear un curso de ejemplo asignado a profesor1 si no existe
        $curso = Curso::query()
            ->where('profesor_id', $profesor1->id)
            ->where('nombre', 'Curso de Programación')
            ->first();

        if (!$curso) {
            $curso = Curso::create([
                'nombre' => 'Curso de Programación',
                'descripcion' => 'Curso introductorio a la programación con PHP y Laravel',
                'profesor_id' => $profesor1->id,
                'codigo' => 'PROG-001',
                'estado' => 'activo',
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addMonths(4),
                'capacidad_maxima' => 30,
            ]);

            $this->command->info('Curso "Curso de Programación" creado exitosamente.');
        } else {
            $this->command->info('Curso "Curso de Programación" ya existe.');
        }

        // Inscribir estudiante1 en el curso si no está inscrito
        if (!$curso->tieneEstudiante($estudiante1)) {
            $curso->inscribirEstudiante($estudiante1);
            $this->command->info('Estudiante1 inscrito en el curso.');
        } else {
            $this->command->info('Estudiante1 ya está inscrito en el curso.');
        }

        // Crear más cursos de ejemplo con profesor1
        $cursos_adicionales = [
            [
                'nombre' => 'Matemáticas Avanzadas',
                'descripcion' => 'Curso de matemáticas aplicadas a la informática',
                'codigo' => 'MATH-001',
            ],
            [
                'nombre' => 'Diseño Web',
                'descripcion' => 'Curso completo de diseño y desarrollo web',
                'codigo' => 'WEB-001',
            ],
        ];

        foreach ($cursos_adicionales as $data) {
            $cursoAux = Curso::query()
                ->where('profesor_id', $profesor1->id)
                ->where('nombre', $data['nombre'])
                ->first();

            if (!$cursoAux) {
                $cursoAux = Curso::create([
                    'nombre' => $data['nombre'],
                    'descripcion' => $data['descripcion'],
                    'profesor_id' => $profesor1->id,
                    'codigo' => $data['codigo'],
                    'estado' => 'activo',
                    'fecha_inicio' => now(),
                    'fecha_fin' => now()->addMonths(4),
                    'capacidad_maxima' => 30,
                ]);

                // Inscribir estudiante1 en cada curso
                $cursoAux->inscribirEstudiante($estudiante1);
                $this->command->info("Curso '{$data['nombre']}' creado e inscrito estudiante1.");
            }
        }
    }
}
