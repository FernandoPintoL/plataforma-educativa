<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Faker\Factory as Faker;

class UsersSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');

        // ==================== DIRECTORES ====================
        echo "Creando 50 directores...\n";
        for ($i = 1; $i <= 50; $i++) {
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();

            User::create([
                'name' => $firstName,
                'apellido' => $lastName,
                'usernick' => "director{$i}",
                'email' => "director{$i}@plataforma.edu",
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'director',
                'activo' => true,
            ])->assignRole('director');
        }

        // ==================== PROFESORES ====================
        echo "Creando 100 profesores...\n";
        $profesoresIds = [];
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();

            $profesor = User::create([
                'name' => $firstName,
                'apellido' => $lastName,
                'usernick' => "profesor{$i}",
                'email' => "profesor{$i}@plataforma.edu",
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'profesor',
                'activo' => true,
                'especialidad' => $this->getEspecialidad(),
            ]);
            $profesor->assignRole('profesor');
            $profesoresIds[] = $profesor->id;
        }

        // ==================== PADRES ====================
        echo "Creando 100 padres...\n";
        $padresIds = [];
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();

            $padre = User::create([
                'name' => $firstName,
                'apellido' => $lastName,
                'usernick' => "padre{$i}",
                'email' => "padre{$i}@plataforma.edu",
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'padre',
                'activo' => true,
                'telefono' => $faker->phoneNumber(),
            ]);
            $padre->assignRole('padre');
            $padresIds[] = $padre->id;
        }

        // ==================== ESTUDIANTES ====================
        echo "Creando 100 estudiantes con datos coherentes...\n";
        $estudiantesIds = [];
        for ($i = 1; $i <= 100; $i++) {
            $firstName = $faker->firstName();
            $lastName = $faker->lastName();
            $grado = rand(1, 12); // Grados 1-12

            $estudiante = User::create([
                'name' => $firstName,
                'apellido' => $lastName,
                'usernick' => "estudiante{$i}",
                'email' => "estudiante{$i}@plataforma.edu",
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'estudiante',
                'activo' => true,
                'grado' => $grado,
                'seccion' => chr(65 + rand(0, 3)), // A, B, C, D
                'numero_matricula' => str_pad($i, 6, '0', STR_PAD_LEFT),
                'fecha_nacimiento' => $faker->date('Y-m-d', '-18 years'),
            ]);
            $estudiante->assignRole('estudiante');
            $estudiantesIds[] = $estudiante->id;
        }

        // ==================== VINCULACIÓN PADRE-ESTUDIANTE ====================
        echo "Vinculando padres con estudiantes...\n";
        foreach ($estudiantesIds as $estudianteId) {
            // Cada estudiante tiene 1-2 padres asignados
            $padresAsignados = rand(1, 2);
            $padresSampled = array_rand($padresIds, $padresAsignados);

            if (!is_array($padresSampled)) {
                $padresSampled = [$padresSampled];
            }

            $estudiante = User::find($estudianteId);
            foreach ($padresSampled as $padreIdx) {
                $estudiante->padres()->attach($padresIds[$padreIdx]);
            }
        }

        echo "✓ Usuarios creados exitosamente\n";
        echo "  - 50 Directores\n";
        echo "  - 100 Profesores\n";
        echo "  - 100 Padres\n";
        echo "  - 100 Estudiantes\n";
        echo "  - Relaciones Padre-Estudiante vinculadas\n";
    }

    private function getEspecialidad(): string
    {
        $especialidades = [
            'Matemáticas',
            'Lenguaje y Literatura',
            'Ciencias Naturales',
            'Ciencias Sociales',
            'Inglés',
            'Educación Física',
            'Artes',
            'Informática',
            'Música',
            'Química',
            'Física',
            'Biología'
        ];

        return $especialidades[array_rand($especialidades)];
    }
}
