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
        echo "\n=== INICIANDO SEEDING DE BASE DE DATOS ===\n\n";

        // ==================== PASO 1: CONFIGURACIÓN ====================
        echo "[1/6] Configurando roles y permisos...\n";
        $this->call(RolesAndPermissionsSeeder::class);
        $this->call(PermisosUnificadosSeeder::class);
        $this->call(ModuloSidebarSeeder::class);
        $this->call(ModuloSidebarPermisosSeeder::class);
        $this->call(RoleModuloAccesoSeeder::class);

        // ==================== PASO 2: ADMIN ====================
        echo "[2/6] Creando administrador principal...\n";
        $admin = User::query()->where('email', 'admin@plataforma.edu')->first();
        if (! $admin) {
            $admin = User::create([
                'name'         => 'Admin',
                'apellido'     => 'Sistema',
                'usernick'     => 'admin',
                'email'        => 'admin@plataforma.edu',
                'password'     => Hash::make('password123'),
                'tipo_usuario' => 'admin',
                'activo'       => true,
            ]);
        }
        $admin->assignRole('admin');

        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
        }

        echo "  ✓ Admin creado: admin@plataforma.edu / password123\n";

        // ==================== PASO 3: USUARIOS (100+ de cada tipo) ====================
        echo "[3/6] Creando 350+ usuarios (50 directores, 100 profesores, 100 padres, 100 estudiantes)...\n";
        $this->call(UsersSeeder::class);

        // ==================== PASO 4: DATOS ACADÉMICOS ====================
        echo "[4/6] Generando datos académicos coherentes...\n";
        $this->call(DatosAcademicosSeeder::class);
        $this->call(TestsVocacionalesSeeder::class);

        // ==================== PASO 5: ESTRUCTURA EDUCATIVA ====================
        echo "[5/6] Creando estructura educativa (cursos, tareas, evaluaciones)...\n";
        if (class_exists(CursosSeeder::class)) {
            $this->call(CursosSeeder::class);
        }
        if (class_exists(TareasSeeder::class)) {
            $this->call(TareasSeeder::class);
        }
        if (class_exists(AsignacionTareasSeeder::class)) {
            $this->call(AsignacionTareasSeeder::class);
        }
        if (class_exists(RecursosSeeder::class)) {
            $this->call(RecursosSeeder::class);
        }
        if (class_exists(ModulosEducativosSeeder::class)) {
            $this->call(ModulosEducativosSeeder::class);
        }
        if (class_exists(EvaluacionesSeeder::class)) {
            $this->call(EvaluacionesSeeder::class);
        }

        // ==================== PASO 5.5: TRABAJOS Y CALIFICACIONES PARA ML ====================
        echo "[5.5/6] Generando trabajos, calificaciones y rendimiento académico para ML...\n";
        if (class_exists(TrabajosSeeder::class)) {
            $this->call(TrabajosSeeder::class);
        }
        if (class_exists(CalificacionesSeeder::class)) {
            $this->call(CalificacionesSeeder::class);
        }
        if (class_exists(RendimientoAcademicoSeeder::class)) {
            $this->call(RendimientoAcademicoSeeder::class);
        }
        if (class_exists(IntentosEvaluacionSeeder::class)) {
            $this->call(IntentosEvaluacionSeeder::class);
        }

        // ==================== PASO 6: DATOS ML ====================
        echo "[6/6] Generando datos para análisis de ML...\n";
        if (class_exists(PrediccionesSeeder::class)) {
            $this->call(PrediccionesSeeder::class);
        }

        echo "\n=== SEEDING COMPLETADO EXITOSAMENTE ===\n";
        echo "Base de datos lista con:\n";
        echo "  • 1 Admin\n";
        echo "  • 50 Directores\n";
        echo "  • 100 Profesores\n";
        echo "  • 100 Padres\n";
        echo "  • 100 Estudiantes con datos académicos coherentes\n";
        echo "  • Datos vinculados para análisis de ML\n\n";
    }
}
