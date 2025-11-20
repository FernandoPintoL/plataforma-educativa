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
        $gestEstudiantes = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Gestionar Estudiantes', 'ruta' => '/estudiantes', 'es_submenu' => false],
            [
                'icono'             => 'Users',
                'descripcion'       => 'Gestión administrativa de estudiantes',
                'orden'             => 2,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['estudiantes.index'], // Solo para spatie backup
                'visible_dashboard' => true,
            ]
        );

        // NUEVO: Módulo "Mi Perfil" para estudiantes ver sus datos
        $miPerfil = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Mi Perfil', 'ruta' => '/perfil', 'es_submenu' => false],
            [
                'icono'             => 'User',
                'descripcion'       => 'Ver y editar perfil personal',
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

        $estudiantes = $gestEstudiantes; // Para referencias posteriores

        $submenuEstudiantes = [
            ['titulo' => 'Listado', 'ruta' => '/estudiantes', 'icono' => 'List', 'orden' => 1, 'permisos' => ['estudiantes.index', 'ver-estudiantes']],
            ['titulo' => 'Nuevo estudiante', 'ruta' => '/estudiantes/create', 'icono' => 'UserPlus', 'orden' => 2, 'permisos' => ['estudiantes.create', 'gestionar-estudiantes']],
        ];

        foreach ($submenuEstudiantes as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $estudiantes->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Gestión de Profesores - Solo visible para directores
        $gestProfesores = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Gestionar Profesores', 'ruta' => '/profesores', 'es_submenu' => false],
            [
                'icono'             => 'UserCheck',
                'descripcion'       => 'Gestión administrativa de profesores',
                'orden'             => 4,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['profesores.index'],
                'visible_dashboard' => true,
            ]
        );

        $profesores = $gestProfesores; // Para referencias posteriores

        $submenuProfesores = [
            ['titulo' => 'Listado', 'ruta' => '/profesores', 'icono' => 'List', 'orden' => 1, 'permisos' => ['profesores.index', 'gestionar-profesores']],
            ['titulo' => 'Nuevo profesor', 'ruta' => '/profesores/create', 'icono' => 'UserPlus', 'orden' => 2, 'permisos' => ['profesores.create', 'gestionar-profesores']],
        ];

        foreach ($submenuProfesores as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $profesores->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

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

        // Módulo de Contenido Educativo - Para profesores y directores
        $contenidoEducativo = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Contenido Educativo', 'ruta' => '/modulos', 'es_submenu' => false],
            [
                'icono'       => 'BookOpen',
                'descripcion' => 'Gestión de módulos y lecciones educativas',
                'orden'       => 6,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['modulos.index', 'lecciones.index', 'ver-contenido-educativo'],
            ]
        );

        $submenuContenidoEducativo = [
            ['titulo' => 'Módulos Educativos', 'ruta' => '/modulos', 'icono' => 'Layers', 'orden' => 1, 'permisos' => ['modulos.index', 'gestionar-modulos']],
            ['titulo' => 'Lecciones', 'ruta' => '/lecciones', 'icono' => 'FileText', 'orden' => 2, 'permisos' => ['lecciones.index', 'gestionar-lecciones']],
        ];

        foreach ($submenuContenidoEducativo as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $contenidoEducativo->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Calificaciones - Visible para profesores, estudiantes y padres
        ModuloSidebar::firstOrCreate(
            ['titulo' => 'Calificaciones', 'ruta' => '/calificaciones', 'es_submenu' => false],
            [
                'icono'       => 'Award',
                'descripcion' => 'Gestión de calificaciones',
                'orden'       => 6,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['calificaciones.index', 'ver-calificaciones', 'gestionar-calificaciones', 'ver-mis-calificaciones'],
            ]
        );

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

        // Módulo de Recursos - Para profesores y directores
        $recursos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Recursos', 'ruta' => '/recursos', 'es_submenu' => false],
            [
                'icono'       => 'Folder',
                'descripcion' => 'Gestión de recursos educativos',
                'orden'       => 9,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['recursos.index', 'ver-recursos', 'gestionar-recursos'],
            ]
        );

        $submenuRecursos = [
            ['titulo' => 'Todos los recursos', 'ruta' => '/recursos', 'icono' => 'List', 'orden' => 1, 'permisos' => ['recursos.index', 'ver-recursos']],
            ['titulo' => 'Crear recurso', 'ruta' => '/recursos/create', 'icono' => 'PlusCircle', 'orden' => 2, 'permisos' => ['recursos.create', 'gestionar-recursos']],
        ];

        foreach ($submenuRecursos as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $recursos->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Administración
        $administracion = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Administración', 'ruta' => '/usuarios', 'es_submenu' => false],
            [
                'icono'       => 'Settings',
                'descripcion' => 'Configuración del sistema',
                'orden'       => 17,
                'categoria'   => 'Administración',
                'activo'      => true,
                'permisos'    => ['usuarios.index'],
            ]
        );

        // Submódulos de Administración
        $submenuAdministracion = [
            ['titulo' => 'Usuarios', 'ruta' => '/usuarios', 'icono' => 'Users', 'orden' => 1, 'permisos' => ['usuarios.index']],
            ['titulo' => 'Gestionar Usuarios (Admin)', 'ruta' => '/admin/usuarios', 'icono' => 'UserCog', 'orden' => 2, 'permisos' => ['admin.usuarios.index']],
            ['titulo' => 'Roles', 'ruta' => '/roles', 'icono' => 'Shield', 'orden' => 3, 'permisos' => ['roles.index']],
            ['titulo' => 'Permisos', 'ruta' => '/permissions', 'icono' => 'Key', 'orden' => 4, 'permisos' => ['permissions.index']],
            // ['titulo' => 'Módulos Sidebar', 'ruta' => '/modulos-sidebar', 'icono' => 'Layout', 'orden' => 5],
            // ['titulo' => 'Configuración Global', 'ruta' => '/configuracion-global', 'icono' => 'Cog', 'orden' => 5, 'permisos' => ['configuracion-global.index']],
        ];

        foreach ($submenuAdministracion as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $administracion->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // ==================== MÓDULOS ESPECÍFICOS PARA PADRES ====================

        // Módulo de Trabajos/Entregas - Para ver entregas y calificar trabajos
        $trabajos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Entregas', 'ruta' => '/trabajos', 'es_submenu' => false],
            [
                'icono'             => 'FileCheck',
                'descripcion'       => 'Gestión de entregas y trabajos de estudiantes',
                'orden'             => 5,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['trabajos.ver'],
                'visible_dashboard' => true,
            ]
        );

        // Submódulos de Trabajos
        $submenuTrabajos = [
            ['titulo' => 'Mis Entregas', 'ruta' => '/trabajos', 'icono' => 'DocumentText', 'orden' => 1, 'permisos' => ['trabajos.ver']],
            ['titulo' => 'Calificar Trabajos', 'ruta' => '/trabajos/calificacion', 'icono' => 'CheckCircle', 'orden' => 2, 'permisos' => ['trabajos.calificar']],
        ];

        foreach ($submenuTrabajos as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $trabajos->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

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

    }
}
