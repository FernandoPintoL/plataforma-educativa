<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleModuloAccesoSeeder extends Seeder
{
    /**
     * Configura la visibilidad de módulos para cada rol
     *
     * IMPORTANTE: Este seeder define CUÁLES MÓDULOS son VISIBLES en el sidebar
     * para cada rol. Es la Capa 3 de la arquitectura de control de acceso.
     *
     * Arquitectura de 3 Capas:
     * - Capa 3: ¿Puede VER el módulo? (Este seeder - role_modulo_acceso)
     * - Capa 2: ¿Puede HACER la acción? (Spatie permissions)
     * - Capa 1: ¿Quién eres? (Laravel Auth)
     */
    public function run(): void
    {
        echo "\n=== CONFIGURANDO VISIBILIDAD DE MÓDULOS POR ROL ===\n\n";

        // Matriz de visibilidad: módulo => array de role_ids
        $modulosVisibles = [
            // MÓDULOS UNIVERSALES (Todos los roles autenticados)
            'Inicio' => [1, 2, 3, 4, 5, 6, 7, 8],
            'Mi Perfil' => [1, 2, 3, 4, 5, 6, 7, 8],
            'Mis Cursos' => [1, 2, 3, 4, 5, 6, 7],

            // ADMINISTRACIÓN (Admin, Director)
            'Gestionar Estudiantes' => [1, 2],
            'Gestionar Profesores' => [1, 2],
            'Administración' => [1, 2],

            // ACADÉMICO - PROFESORES (Admin, Director, Profesor, Coordinador)
            'Tareas' => [1, 2, 3, 6],
            'Entregas' => [1, 2, 3, 6],
            'Evaluaciones' => [1, 2, 3, 6],
            'Calificaciones' => [1, 2, 3, 4, 6],
            'Contenido Educativo' => [1, 2, 3, 6],
            'Recursos' => [1, 2, 3, 6],

            // REPORTES Y ANÁLISIS (Admin, Director, Coordinador)
            'Reportes' => [1, 2, 6],

            // 📊 ANÁLISIS DE RIESGO (Admin, Director, Profesor, Coordinador) ⭐
            'Análisis de Riesgo' => [1, 2, 3, 6],

            // VOCACIONAL Y RECOMENDACIONES (Admin, Estudiante)
            'Orientación Vocacional' => [1, 4],
            'Mis Recomendaciones' => [1, 4],
        ];

        foreach ($modulosVisibles as $moduloTitulo => $rolesIds) {
            // Obtener el módulo principal
            $modulo = DB::table('modulos_sidebar')
                ->where('titulo', $moduloTitulo)
                ->where('es_submenu', false)
                ->first();

            if (!$modulo) {
                echo "⚠️ Módulo no encontrado: {$moduloTitulo}\n";
                continue;
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
                        'descripcion' => "Módulo {$moduloTitulo} visible para rol {$roleId}",
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
