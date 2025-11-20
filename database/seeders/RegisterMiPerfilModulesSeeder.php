<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ModuloSidebar;
use App\Models\RoleModuloAcceso;
use Spatie\Permission\Models\Role;

class RegisterMiPerfilModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // ==================== MÓDULOS PARA ESTUDIANTE ====================

        // Módulo padre: Mi Perfil
        $miPerfilPadre = ModuloSidebar::firstOrCreate(
            ['ruta' => '/mi-perfil'],
            [
                'titulo' => 'Mi Perfil',
                'icono' => 'User',
                'descripcion' => 'Información personal y análisis académico',
                'orden' => 10,
                'activo' => true,
                'es_submenu' => false,
                'categoria' => 'estudiante',
                'visible_dashboard' => true,
            ]
        );

        // Submódulo: Análisis de Riesgo
        $riesgoModulo = ModuloSidebar::firstOrCreate(
            ['ruta' => '/mi-perfil/riesgo'],
            [
                'titulo' => 'Análisis de Riesgo',
                'icono' => 'AlertCircle',
                'descripcion' => 'Ver tu análisis de riesgo académico',
                'orden' => 1,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $miPerfilPadre->id,
                'categoria' => 'estudiante',
                'visible_dashboard' => true,
            ]
        );

        // Submódulo: Carreras Recomendadas
        $carrerasModulo = ModuloSidebar::firstOrCreate(
            ['ruta' => '/mi-perfil/carreras'],
            [
                'titulo' => 'Carreras Recomendadas',
                'icono' => 'Briefcase',
                'descripcion' => 'Recomendaciones de carreras profesionales',
                'orden' => 2,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $miPerfilPadre->id,
                'categoria' => 'estudiante',
                'visible_dashboard' => true,
            ]
        );

        // ==================== MÓDULOS PARA PADRE ====================

        // Módulo padre: Seguimiento de Hijos
        $hijosParent = ModuloSidebar::firstOrCreate(
            ['ruta' => '/seguimiento-hijos'],
            [
                'titulo' => 'Seguimiento de Hijos',
                'icono' => 'Users',
                'descripcion' => 'Monitoreo del desempeño académico de tus hijos',
                'orden' => 10,
                'activo' => true,
                'es_submenu' => false,
                'categoria' => 'padre',
                'visible_dashboard' => true,
            ]
        );

        // Submódulo: Dashboard de Hijos
        $misDashboardModulo = ModuloSidebar::firstOrCreate(
            ['ruta' => '/dashboard'],
            [
                'titulo' => 'Mi Dashboard',
                'icono' => 'Home',
                'descripcion' => 'Panel de control con información de tus hijos',
                'orden' => 1,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $hijosParent->id,
                'categoria' => 'padre',
                'visible_dashboard' => true,
            ]
        );

        // Submódulo: Alertas Académicas
        $alertasModulo = ModuloSidebar::firstOrCreate(
            ['ruta' => '/alertas'],
            [
                'titulo' => 'Alertas Académicas',
                'icono' => 'Bell',
                'descripcion' => 'Notificaciones y alertas del desempeño de tus hijos',
                'orden' => 2,
                'activo' => true,
                'es_submenu' => true,
                'modulo_padre_id' => $hijosParent->id,
                'categoria' => 'padre',
                'visible_dashboard' => true,
            ]
        );

        // ==================== ASIGNAR PERMISOS A ROLES ====================

        // Obtener roles
        $estudianteRole = Role::where('name', 'estudiante')->first();
        $padreRole = Role::where('name', 'padre')->first();

        // Asignar módulos a rol ESTUDIANTE
        if ($estudianteRole) {
            // Mi Perfil (padre)
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $estudianteRole->id, 'modulo_sidebar_id' => $miPerfilPadre->id],
                ['visible' => true, 'descripcion' => 'Estudiante puede acceder a su perfil']
            );

            // Análisis de Riesgo
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $estudianteRole->id, 'modulo_sidebar_id' => $riesgoModulo->id],
                ['visible' => true, 'descripcion' => 'Estudiante puede ver su análisis de riesgo']
            );

            // Carreras Recomendadas
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $estudianteRole->id, 'modulo_sidebar_id' => $carrerasModulo->id],
                ['visible' => true, 'descripcion' => 'Estudiante puede ver sus carreras recomendadas']
            );

            // Registrar otros módulos de estudiante que ya existen en la BD
            $otrosModulosEstudiante = [
                4 => 'Mis Cursos',
                28 => 'Entregas (para enviar trabajos)',
                16 => 'Calificaciones',
                10 => 'Tareas',
                20 => 'Recursos',
            ];

            foreach ($otrosModulosEstudiante as $moduloId => $descripcion) {
                RoleModuloAcceso::updateOrCreate(
                    ['role_id' => $estudianteRole->id, 'modulo_sidebar_id' => $moduloId],
                    ['visible' => true, 'descripcion' => $descripcion]
                );
            }

            $this->command->info('✅ Módulos de Estudiante registrados y asignados');
        }

        // Asignar módulos a rol PADRE
        if ($padreRole) {
            // Seguimiento de Hijos (padre)
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $padreRole->id, 'modulo_sidebar_id' => $hijosParent->id],
                ['visible' => true, 'descripcion' => 'Padre puede acceder al seguimiento de hijos']
            );

            // Mi Dashboard
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $padreRole->id, 'modulo_sidebar_id' => $misDashboardModulo->id],
                ['visible' => true, 'descripcion' => 'Padre puede acceder al dashboard']
            );

            // Alertas
            RoleModuloAcceso::updateOrCreate(
                ['role_id' => $padreRole->id, 'modulo_sidebar_id' => $alertasModulo->id],
                ['visible' => true, 'descripcion' => 'Padre puede ver alertas de sus hijos']
            );

            $this->command->info('✅ Módulos de Padre registrados y asignados');
        }

        $this->command->info('✅ Todos los módulos fueron registrados correctamente en modulos_sidebar y role_modulo_acceso');
    }
}
