<?php
namespace Database\Seeders;

use App\Models\ModuloSidebar;
use Illuminate\Database\Seeder;

class ModuloSidebarSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Me puedes ayudar a completar rutas para Estudiantes, Profesores, tareas y otros puntos que deberia tener una plataforma educativa
        // Módulo de Inicio - Visible para todos los roles
        $dashboard = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Inicio', 'ruta' => '/dashboard', 'es_submenu' => false],
            [
                'icono'             => 'Home',
                'descripcion'       => 'Panel principal',
                'orden'             => 1,
                'categoria'         => 'General',
                'activo'            => true,
                'permisos'          => [], // Accesible para todos
                'visible_dashboard' => true,
            ]
        );

        // Módulo de Gestión de Estudiantes - Solo visible para directores y coordinadores
        // IMPORTANTE: El nombre cambió de 'Estudiantes' a 'Gestionar Estudiantes'
        // para ser claro que es un módulo ADMINISTRATIVO, no para estudiantes
        // NOTA: Estas rutas aún no están completamente implementadas en web.php
        // Se dejan comentadas hasta que se implementen
        /*
        $gestEstudiantes = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Gestionar Estudiantes', 'ruta' => '/estudiantes', 'es_submenu' => false],
            [
                'icono'             => 'Users',
                'descripcion'       => 'Gestión administrativa de estudiantes',
                'orden'             => 2,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['estudiantes.index'],
                'visible_dashboard' => true,
            ]
        );
        */
        $gestEstudiantes = null; // Para evitar undefined

        // NUEVO: Módulo "Mi Perfil" para estudiantes ver sus datos
        $miPerfil = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Mi Perfil', 'ruta' => '/mi-perfil/riesgo', 'es_submenu' => false],
            [
                'icono'             => 'User',
                'descripcion'       => 'Ver y editar perfil personal con análisis de riesgo',
                'orden'             => 2,
                'categoria'         => 'Personal',
                'activo'            => true,
                'permisos'          => [], // Visible para cualquiera autenticado
                'visible_dashboard' => true,
            ]
        );

        // NUEVO: Módulo "Mis Cursos" para estudiantes
        $misCursos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Mis Cursos', 'ruta' => '/mis-cursos', 'es_submenu' => false],
            [
                'icono'             => 'BookOpen',
                'descripcion'       => 'Cursos en los que estoy inscrito',
                'orden'             => 3,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => [], // Visible para estudiantes
                'visible_dashboard' => true,
            ]
        );

        // COMENTADO: Gestión de estudiantes y profesores no tienen rutas en web.php aún
        // Se implementarán en futuras versiones
        /*
        $estudiantes = $gestEstudiantes;
        ... submenu code ...
        */

        // Módulo de Tareas - Visible para profesores y estudiantes con diferentes submenús
        $tareas = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Tareas', 'ruta' => '/tareas', 'es_submenu' => false],
            [
                'icono'       => 'ClipboardList',
                'descripcion' => 'Gestión de tareas',
                'orden'       => 4,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['tareas.index', 'ver-tareas', 'gestionar-tareas', 'ver-mis-tareas', 'tareas.show'],
            ]
        );

        $submenuTareas = [
            ['titulo' => 'Todas las tareas', 'ruta' => '/tareas', 'icono' => 'List', 'orden' => 1, 'permisos' => ['tareas.index', 'ver-tareas', 'ver-mis-tareas', 'tareas.show']],
            ['titulo' => 'Crear tarea', 'ruta' => '/tareas/create', 'icono' => 'PlusCircle', 'orden' => 2, 'permisos' => ['tareas.create', 'gestionar-tareas']],
        ];

        foreach ($submenuTareas as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $tareas->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // COMENTADO: Contenido Educativo y Calificaciones no tienen rutas en web.php aún
        // Se implementarán en futuras versiones
        /*
        ... código comentado ...
        */

        // Módulo de Evaluaciones - Visible para profesores y estudiantes
        $evaluaciones = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Evaluaciones', 'ruta' => '/evaluaciones', 'es_submenu' => false],
            [
                'icono'       => 'FileText',
                'descripcion' => 'Gestión de evaluaciones y exámenes',
                'orden'       => 7,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['evaluaciones.index', 'ver-evaluaciones', 'gestionar-evaluaciones', 'evaluaciones.estudiante'],
            ]
        );

        $submenuEvaluaciones = [
            ['titulo' => 'Todas las evaluaciones', 'ruta' => '/evaluaciones', 'icono' => 'List', 'orden' => 1, 'permisos' => ['evaluaciones.index', 'ver-evaluaciones', 'evaluaciones.estudiante']],
            ['titulo' => 'Crear evaluación', 'ruta' => '/evaluaciones/create', 'icono' => 'PlusCircle', 'orden' => 2, 'permisos' => ['evaluaciones.create', 'gestionar-evaluaciones']],
        ];

        foreach ($submenuEvaluaciones as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $evaluaciones->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // COMENTADO: Recursos, Administración y Trabajos no tienen rutas en web.php aún
        // Se implementarán en futuras versiones
        /*
        ... código comentado ...
        */

        // Módulo de Reportes Académicos - Para directores/admin ver análisis de rendimiento
        $reportes = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Reportes', 'ruta' => '/reportes', 'es_submenu' => false],
            [
                'icono'             => 'BarChart3',
                'descripcion'       => 'Sistema completo de reportes académicos',
                'orden'             => 8,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['reportes.ver', 'admin.usuarios'],
                'visible_dashboard' => true,
            ]
        );

        // Submódulos de Reportes
        $submenuReportes = [
            ['titulo' => 'Todos los Reportes', 'ruta' => '/reportes', 'icono' => 'BarChart3', 'orden' => 1, 'permisos' => ['reportes.ver', 'admin.usuarios']],
            ['titulo' => 'Desempeño por Estudiante', 'ruta' => '/reportes/desempeno', 'icono' => 'User', 'orden' => 2, 'permisos' => ['reportes.ver', 'admin.usuarios']],
            ['titulo' => 'Progreso por Curso', 'ruta' => '/reportes/cursos', 'icono' => 'AcademicCap', 'orden' => 3, 'permisos' => ['reportes.ver', 'admin.usuarios']],
            ['titulo' => 'Análisis Comparativo', 'ruta' => '/reportes/analisis', 'icono' => 'TrendingUp', 'orden' => 4, 'permisos' => ['reportes.ver', 'admin.usuarios']],
            ['titulo' => 'Métricas Institucionales', 'ruta' => '/reportes/metricas', 'icono' => 'SparklesIcon', 'orden' => 5, 'permisos' => ['reportes.ver', 'admin.usuarios']],
        ];

        foreach ($submenuReportes as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $reportes->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // ==================== MÓDULO DE ANÁLISIS DE RIESGO ====================
        // Módulo de Análisis de Riesgo - Para directores y profesores
        $analisisRiesgo = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Análisis de Riesgo', 'ruta' => '/analisis-riesgo', 'es_submenu' => false],
            [
                'icono'             => 'AlertTriangle',
                'descripcion'       => 'Análisis predictivo y monitoreo de riesgo académico',
                'orden'             => 9,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['analisis-riesgo.ver', 'analisis-riesgo.index'],
                'visible_dashboard' => true,
            ]
        );

        // Submódulos de Análisis de Riesgo
        $submenuAnalisisRiesgo = [
            ['titulo' => 'Dashboard', 'ruta' => '/analisis-riesgo', 'icono' => 'AlertTriangle', 'orden' => 1, 'permisos' => ['analisis-riesgo.ver', 'analisis-riesgo.index']],
            ['titulo' => 'Por Curso', 'ruta' => '/analisis-riesgo/cursos', 'icono' => 'BookOpen', 'orden' => 2, 'permisos' => ['analisis-riesgo.ver']],
            ['titulo' => 'Tendencias', 'ruta' => '/analisis-riesgo/tendencias', 'icono' => 'TrendingUp', 'orden' => 3, 'permisos' => ['analisis-riesgo.ver']],
        ];

        foreach ($submenuAnalisisRiesgo as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $analisisRiesgo->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Orientación Vocacional - ✅ Implementado
        // Permite a estudiantes acceder a tests vocacionales y ver resultados
        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Orientación Vocacional', 'ruta' => '/vocacional', 'es_submenu' => false],
            [
                'icono'             => 'Compass',
                'descripcion'       => 'Pruebas y recomendaciones vocacionales',
                'orden'             => 10,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['vocacional.ver_tests', 'vocacional.ver_resultados', 'vocacional.ver_recomendaciones'],
                'visible_dashboard' => true,
            ]
        );

        // Módulo de Mis Recomendaciones - ✅ Implementado
        // Permite a estudiantes ver recomendaciones personalizadas basadas en su desempeño
        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Mis Recomendaciones', 'ruta' => '/recomendaciones', 'es_submenu' => false],
            [
                'icono'             => 'Lightbulb',
                'descripcion'       => 'Recomendaciones educativas personalizadas',
                'orden'             => 5,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['recomendaciones.ver', 'recomendaciones.ver_mis'],
                'visible_dashboard' => true,
            ]
        );

    }
}
