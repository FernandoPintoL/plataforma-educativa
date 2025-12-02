<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

/**
 * RoleModuloAccesoSeeder
 * 
 * Configura la visibilidad de módulos para cada rol
 * IMPORTANTE: Usa dinámicamente el nombre del rol, NO IDs hardcodeados
 * 
 * Arquitectura de 3 Capas:
 * - Capa 3: ¿Puede VER el módulo? (Este seeder - role_modulo_acceso)
 * - Capa 2: ¿Puede HACER la acción? (Spatie permissions)
 * - Capa 1: ¿Quién eres? (Laravel Auth)
 */
class RoleModuloAccesoSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n=== CONFIGURANDO VISIBILIDAD DE MÓDULOS POR ROL ===\n\n";

        // Matriz de visibilidad: módulo => array de role_names (NO ids)
        $modulosVisibles = [
            // MÓDULOS UNIVERSALES (Todos los roles autenticados)
            'Inicio' => ['admin', 'director', 'profesor', 'estudiante', 'padre', 'coordinador', 'tutor'],
            'Mi Perfil' => ['admin', 'director', 'profesor', 'estudiante', 'padre', 'coordinador', 'tutor'],
            'Mis Cursos' => ['admin', 'director', 'profesor', 'estudiante', 'padre', 'coordinador', 'tutor'],

            // ADMINISTRACIÓN (Admin, Director)
            'Gestionar Estudiantes' => ['admin', 'director'],
            'Gestionar Profesores' => ['admin', 'director'],
            'Administración' => ['admin', 'director'],

            // ACADÉMICO - PROFESORES (Admin, Director, Profesor, Coordinador)
            'Tareas' => ['admin', 'director', 'profesor', 'coordinador', 'estudiante'],
            'Entregas' => ['admin', 'director', 'profesor', 'coordinador', 'estudiante'],
            'Evaluaciones' => ['admin', 'director', 'profesor', 'coordinador', 'estudiante'],
            'Calificaciones' => ['admin', 'director', 'profesor', 'estudiante', 'coordinador'],
            'Contenido Educativo' => ['admin', 'director', 'profesor', 'coordinador'],
            'Recursos' => ['admin', 'director', 'profesor', 'coordinador'],

            // REPORTES Y ANÁLISIS (Admin, Director, Profesor, Coordinador)
            'Reportes' => ['admin', 'director', 'profesor', 'coordinador'],

            // 📊 ANÁLISIS DE RIESGO (Admin, Director, Profesor, Coordinador) ⭐
            'Análisis de Riesgo' => ['admin', 'director', 'profesor', 'coordinador'],

            // VOCACIONAL Y RECOMENDACIONES (Admin, Estudiante, Padre)
            'Orientación Vocacional' => ['admin', 'estudiante'],
            'Mis Recomendaciones' => ['admin', 'estudiante'],
        ];

        // Procesar cada módulo
        foreach ($modulosVisibles as $moduloTitulo => $rolesNames) {
            // Obtener el módulo principal
            $modulo = DB::table('modulos_sidebar')
                ->where('titulo', $moduloTitulo)
                ->where('es_submenu', false)
                ->first();

            if (!$modulo) {
                echo "⚠️ Módulo no encontrado: {$moduloTitulo}\n";
                continue;
            }

            // Obtener los IDs de los roles por nombre (DINÁMICO)
            $rolesIds = [];
            foreach ($rolesNames as $roleName) {
                $role = Role::where('name', $roleName)->first();
                if ($role) {
                    $rolesIds[] = $role->id;
                } else {
                    echo "⚠️ Rol no encontrado: {$roleName}\n";
                }
            }

            // Crear registros de visibilidad para cada rol
            foreach ($rolesIds as $roleId) {
                DB::table('role_modulo_acceso')->updateOrInsert(
                    [
                        'role_id' => $roleId,
                        'modulo_sidebar_id' => $modulo->id,
                    ],
                    [
                        'visible' => true,
                        'descripcion' => "Módulo {$moduloTitulo} visible para rol ID {$roleId}",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]
                );
            }

            echo "✓ {$moduloTitulo} => " . count($rolesIds) . " roles\n";
        }

        echo "\n" . str_repeat("=", 70) . "\n";
        echo "✅ VISIBILIDAD DE MÓDULOS CONFIGURADA CORRECTAMENTE\n";
        echo str_repeat("=", 70) . "\n\n";
    }
}
