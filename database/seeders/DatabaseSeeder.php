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
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(ModuloSidebarSeeder::class);
        // Create a default admin user if not exists
        $admin = User::query()->where('email', 'admin@paucara.test')->first();
        if (! $admin) {
            $admin = User::factory()->create([
                'name' => 'Administrador',
                'usernick' => 'admin',
                'email' => 'admin@paucara.test',
                'password' => Hash::make('password'),
            ]);
        } else {
            // Ensure usernick is set for legacy records
            if (empty($admin->usernick)) {
                $admin->forceFill(['usernick' => 'admin'])->save();
            }
        }
        // darle el rol de admin a $admin
        $admin->assignRole('Admin');

        // Asegurar que el rol Admin tenga todos los permisos creados por el seeder
        $adminRole = Role::where('name', 'Admin')->first();
        if ($adminRole) {
            // Sincronizar todos los permisos disponibles al rol Admin
            $adminRole->syncPermissions(Permission::all());
        }

        // Crear 10 estudiantes
        User::factory(10)->create()->each(function (User $user, int $index) {
            $user->forceFill([
                'name' => 'Estudiante ' . ($index + 1),
                'usernick' => 'estudiante' . ($index + 1),
                'email' => 'estudiante' . ($index + 1) . '@paucara.test',
                'password' => Hash::make('password'),
            ])->save();
            $user->assignRole('Estudiante');
        });

        // Crear 5 profesores
        User::factory(5)->create()->each(function (User $user, int $index) {
            $user->forceFill([
                'name' => 'Profesor ' . ($index + 1),
                'usernick' => 'profesor' . ($index + 1),
                'email' => 'profesor' . ($index + 1) . '@paucara.test',
                'password' => Hash::make('password'),
            ])->save();
            $user->assignRole('Profesor');
        });

    }
}
