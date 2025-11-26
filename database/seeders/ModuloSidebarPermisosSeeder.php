<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

class ModuloSidebarPermisosSeeder extends Seeder
{
    /**
     * Asigna permisos a roles basado en los módulos del sidebar
     * Este seeder sincroniza los permisos definidos en ModuloSidebarSeeder
     * con los roles de la aplicación
     */
    public function run(): void
    {
        echo "\n=== ASIGNANDO PERMISOS A ROLES PARA MÓDULOS SIDEBAR ===\n\n";

        // ==================== ANÁLISIS DE RIESGO ====================
        echo "📊 Procesando: Análisis de Riesgo\n";
        $this->asignarPermisosARol('profesor', [
            'analisis-riesgo.ver',
            'analisis-riesgo.index',
        ]);
        $this->asignarPermisosARol('director', [
            'analisis-riesgo.ver',
            'analisis-riesgo.index',
        ]);
        $this->asignarPermisosARol('coordinador', [
            'analisis-riesgo.ver',
            'analisis-riesgo.index',
        ]);
        echo "   ✓ Asignado a profesor, director, coordinador\n";

        // ==================== VOCACIONAL ====================
        echo "🎯 Procesando: Orientación Vocacional\n";
        $this->asignarPermisosARol('estudiante', [
            'vocacional.ver_tests',
            'vocacional.ver_resultados',
            'vocacional.ver_recomendaciones',
        ]);
        echo "   ✓ Asignado a estudiante\n";

        // ==================== RECOMENDACIONES ====================
        echo "💡 Procesando: Mis Recomendaciones\n";
        $this->asignarPermisosARol('estudiante', [
            'recomendaciones.ver',
            'recomendaciones.ver_mis',
        ]);
        echo "   ✓ Asignado a estudiante\n";

        // ==================== TAREAS ====================
        echo "📝 Procesando: Tareas\n";
        $this->asignarPermisosARol('profesor', [
            'tareas.index',
            'tareas.create',
            'tareas.show',
            'tareas.edit',
            'gestionar-tareas',
        ]);
        $this->asignarPermisosARol('estudiante', [
            'tareas.show',
            'ver-mis-tareas',
            'entregar-tarea',
        ]);
        echo "   ✓ Asignado a profesor y estudiante\n";

        // ==================== EVALUACIONES ====================
        echo "📋 Procesando: Evaluaciones\n";
        $this->asignarPermisosARol('profesor', [
            'evaluaciones.index',
            'evaluaciones.create',
            'evaluaciones.edit',
            'gestionar-evaluaciones',
        ]);
        $this->asignarPermisosARol('estudiante', [
            'evaluaciones.estudiante',
        ]);
        echo "   ✓ Asignado a profesor y estudiante\n";

        // ==================== CONTENIDO EDUCATIVO ====================
        echo "📚 Procesando: Contenido Educativo\n";
        $this->asignarPermisosARol('profesor', [
            'modulos.index',
            'modulos.create',
            'modulos.edit',
            'gestionar-modulos',
            'lecciones.index',
            'lecciones.create',
            'lecciones.edit',
            'gestionar-lecciones',
            'ver-contenido-educativo',
        ]);
        $this->asignarPermisosARol('director', [
            'modulos.index',
            'modulos.create',
            'modulos.edit',
            'gestionar-modulos',
            'lecciones.index',
            'lecciones.create',
            'lecciones.edit',
            'gestionar-lecciones',
            'ver-contenido-educativo',
        ]);
        echo "   ✓ Asignado a profesor y director\n";

        // ==================== RECURSOS ====================
        echo "📁 Procesando: Recursos\n";
        $this->asignarPermisosARol('profesor', [
            'recursos.index',
            'recursos.create',
            'recursos.edit',
            'gestionar-recursos',
            'ver-recursos',
        ]);
        $this->asignarPermisosARol('director', [
            'recursos.index',
            'recursos.create',
            'recursos.edit',
            'gestionar-recursos',
            'ver-recursos',
        ]);
        echo "   ✓ Asignado a profesor y director\n";

        // ==================== CALIFICACIONES ====================
        echo "🏆 Procesando: Calificaciones\n";
        $this->asignarPermisosARol('profesor', [
            'calificaciones.index',
            'calificaciones.show',
            'calificaciones.edit',
            'calificaciones.create',
            'gestionar-calificaciones',
        ]);
        $this->asignarPermisosARol('estudiante', [
            'ver-mis-calificaciones',
        ]);
        echo "   ✓ Asignado a profesor y estudiante\n";

        // ==================== CURSOS ====================
        echo "📖 Procesando: Mis Cursos\n";
        $this->asignarPermisosARol('estudiante', [
            'ver-mis-cursos',
        ]);
        $this->asignarPermisosARol('profesor', [
            'ver-mis-cursos',
        ]);
        echo "   ✓ Asignado a estudiante y profesor\n";

        // ==================== PERFIL ====================
        echo "👤 Procesando: Mi Perfil\n";
        // Todos los usuarios verificados tienen este permiso
        echo "   ✓ Accesible para todos los roles autenticados\n";

        // ==================== REPORTES ====================
        echo "📊 Procesando: Reportes\n";
        $this->asignarPermisosARol('director', [
            'reportes.ver',
            'admin.usuarios',
        ]);
        $this->asignarPermisosARol('coordinador', [
            'reportes.ver',
            'reportes.create',
            'reportes.exportar',
        ]);
        echo "   ✓ Asignado a director y coordinador\n";

        // ==================== ADMINISTRACIÓN ====================
        echo "⚙️ Procesando: Administración\n";
        $this->asignarPermisosARol('director', [
            'usuarios.index',
            'roles.index',
            'permisos.index',
            'gestionar-permisos',
            'gestionar-roles',
        ]);
        echo "   ✓ Asignado a director\n";

        echo "\n" . str_repeat("=", 70) . "\n";
        echo "✅ PERMISOS ASIGNADOS A ROLES CORRECTAMENTE\n";
        echo str_repeat("=", 70) . "\n\n";
    }

    /**
     * Asigna múltiples permisos a un rol específico
     * Crea los permisos si no existen
     *
     * @param string $roleName Nombre del rol
     * @param array $permisos Lista de permisos a asignar
     */
    private function asignarPermisosARol(string $roleName, array $permisos): void
    {
        $role = Role::where('name', $roleName)->first();

        if (!$role) {
            return;
        }

        foreach ($permisos as $permiso) {
            // Crear permiso si no existe
            $permission = Permission::firstOrCreate(['name' => $permiso]);

            // Asignar al rol
            if (!$role->hasPermissionTo($permission)) {
                $role->givePermissionTo($permission);
            }
        }
    }
}
