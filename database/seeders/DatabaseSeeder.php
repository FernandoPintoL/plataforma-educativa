<?php
namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Primero crear roles y permisos educativos
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(ModuloSidebarSeeder::class);

        // Create a default admin user if not exists
        $admin = User::query()->where('email', 'admin@paucara.test')->first();
        if (! $admin) {
            $admin = User::factory()->create([
                'name'         => 'Administrador',
                'usernick'     => 'admin',
                'email'        => 'admin@paucara.test',
                'password'     => Hash::make('password'),
                'tipo_usuario' => 'admin',
            ]);
        } else {
            if (empty($admin->usernick)) {
                $admin->forceFill(['usernick' => 'admin', 'tipo_usuario' => 'admin'])->save();
            }
        }
        $admin->assignRole('admin');

        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
        }

        // Crear un usuario Director de ejemplo
        $director = User::query()->where('email', 'director@paucara.test')->first();
        if (! $director) {
            $director = User::factory()->create([
                'name'         => 'Carlos',
                'apellido'     => 'Ramírez',
                'usernick'     => 'director',
                'email'        => 'director@paucara.test',
                'password'     => Hash::make('password'),
                'tipo_usuario' => 'director',
                'activo'       => true,
            ]);
            $director->assignRole('director');
        }

        // Crear 10 estudiantes
        User::factory(10)->create()->each(function (User $user, int $index) {
            $user->forceFill([
                'name'         => 'Estudiante',
                'apellido'     => 'Número ' . ($index + 1),
                'usernick'     => 'estudiante' . ($index + 1),
                'email'        => 'estudiante' . ($index + 1) . '@paucara.test',
                'password'     => Hash::make('password'),
                'tipo_usuario' => 'estudiante',
                'activo'       => true,
            ])->save();
            $user->assignRole('estudiante');
        });

        // Crear 5 profesores
        User::factory(5)->create()->each(function (User $user, int $index) {
            $user->forceFill([
                'name'         => 'Profesor',
                'apellido'     => 'Número ' . ($index + 1),
                'usernick'     => 'profesor' . ($index + 1),
                'email'        => 'profesor' . ($index + 1) . '@paucara.test',
                'password'     => Hash::make('password'),
                'tipo_usuario' => 'profesor',
                'activo'       => true,
            ])->save();
            $user->assignRole('profesor');
        });

        // Crear 3 padres de ejemplo
        User::factory(3)->create()->each(function (User $user, int $index) {
            $user->forceFill([
                'name'         => 'Padre',
                'apellido'     => 'Familia ' . ($index + 1),
                'usernick'     => 'padre' . ($index + 1),
                'email'        => 'padre' . ($index + 1) . '@paucara.test',
                'password'     => Hash::make('password'),
                'tipo_usuario' => 'padre',
                'activo'       => true,
            ])->save();
            $user->assignRole('padre');
        });
    }
}
