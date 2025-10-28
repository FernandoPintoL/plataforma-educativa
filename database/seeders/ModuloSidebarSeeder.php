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
        // Módulo de Dashboard - Visible para todos los roles
        $dashboard = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Dashboard', 'ruta' => '/dashboard', 'es_submenu' => false],
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

        // Módulo de Estudiantes - Solo visible para directores y profesores
        $estudiantes = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Estudiantes', 'ruta' => '/estudiantes', 'es_submenu' => false],
            [
                'icono'             => 'User',
                'descripcion'       => 'Gestión de estudiantes',
                'orden'             => 2,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['estudiantes.index', 'ver-estudiantes'], // Requiere uno de estos permisos
                'visible_dashboard' => true,
            ]
        );

        $submenuEstudiantes = [
            ['titulo' => 'Listado', 'ruta' => '/estudiantes', 'icono' => 'List', 'orden' => 1, 'permisos' => ['estudiantes.index', 'ver-estudiantes']],
            ['titulo' => 'Nuevo estudiante', 'ruta' => '/estudiantes/create', 'icono' => 'UserPlus', 'orden' => 2, 'permisos' => ['estudiantes.create', 'gestionar-estudiantes']],
            ['titulo' => 'Inscripciones', 'ruta' => '/estudiantes/inscripciones', 'icono' => 'Clipboard', 'orden' => 3, 'permisos' => ['inscripciones.index']],
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

        // Módulo de Profesores - Solo visible para directores
        $profesores = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Profesores', 'ruta' => '/profesores', 'es_submenu' => false],
            [
                'icono'             => 'UserCheck',
                'descripcion'       => 'Gestión de profesores',
                'orden'             => 3,
                'categoria'         => 'Académico',
                'activo'            => true,
                'permisos'          => ['profesores.index', 'gestionar-profesores'],
                'visible_dashboard' => true,
            ]
        );

        $submenuProfesores = [
            ['titulo' => 'Listado', 'ruta' => '/profesores', 'icono' => 'List', 'orden' => 1, 'permisos' => ['profesores.index', 'gestionar-profesores']],
            ['titulo' => 'Nuevo profesor', 'ruta' => '/profesores/create', 'icono' => 'UserPlus', 'orden' => 2, 'permisos' => ['profesores.create', 'gestionar-profesores']],
            ['titulo' => 'Asignaciones', 'ruta' => '/profesores/asignaciones', 'icono' => 'BookOpen', 'orden' => 3, 'permisos' => ['asignaciones.index']],
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
                'permisos'    => ['tareas.index', 'ver-tareas', 'gestionar-tareas'],
            ]
        );

        $submenuTareas = [
            ['titulo' => 'Todas las tareas', 'ruta' => '/tareas', 'icono' => 'List', 'orden' => 1, 'permisos' => ['tareas.index', 'ver-tareas']],
            ['titulo' => 'Crear tarea', 'ruta' => '/tareas/crear', 'icono' => 'PlusCircle', 'orden' => 2, 'permisos' => ['tareas.create', 'gestionar-tareas']],
            ['titulo' => 'Mis entregas', 'ruta' => '/tareas/mis-entregas', 'icono' => 'FileText', 'orden' => 3, 'permisos' => ['tareas.entregas.estudiante']],
            ['titulo' => 'Revisar entregas', 'ruta' => '/tareas/entregas', 'icono' => 'CheckSquare', 'orden' => 4, 'permisos' => ['entregas.index', 'calificar-entregas']],
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

        // Módulo de Cursos - Visible para todos con diferentes permisos
        $cursos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Cursos', 'ruta' => '/cursos', 'es_submenu' => false],
            [
                'icono'       => 'Book',
                'descripcion' => 'Gestión de cursos',
                'orden'       => 5,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['cursos.index', 'ver-cursos', 'gestionar-cursos'],
            ]
        );

        $submenuCursos = [
            ['titulo' => 'Todos los cursos', 'ruta' => '/cursos', 'icono' => 'List', 'orden' => 1, 'permisos' => ['cursos.index', 'ver-cursos']],
            ['titulo' => 'Mis cursos', 'ruta' => '/cursos/mis-cursos', 'icono' => 'BookOpen', 'orden' => 2, 'permisos' => ['cursos.mis-cursos']],
            ['titulo' => 'Crear curso', 'ruta' => '/cursos/crear', 'icono' => 'PlusCircle', 'orden' => 3, 'permisos' => ['cursos.create', 'gestionar-cursos']],
            ['titulo' => 'Horarios', 'ruta' => '/cursos/horarios', 'icono' => 'Calendar', 'orden' => 4, 'permisos' => ['horarios.index', 'ver-horarios']],
            ['titulo' => 'Contenido', 'ruta' => '/cursos/contenido', 'icono' => 'Layers', 'orden' => 5, 'permisos' => ['cursos.contenido.index', 'gestionar-contenido']],
        ];

        foreach ($submenuCursos as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $cursos->id,
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
        $calificaciones = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Calificaciones', 'ruta' => '/calificaciones', 'es_submenu' => false],
            [
                'icono'       => 'Award',
                'descripcion' => 'Gestión de calificaciones',
                'orden'       => 6,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['calificaciones.index', 'ver-calificaciones', 'gestionar-calificaciones'],
            ]
        );

        $submenuCalificaciones = [
            ['titulo' => 'Mis calificaciones', 'ruta' => '/calificaciones/mis-calificaciones', 'icono' => 'Star', 'orden' => 1, 'permisos' => ['calificaciones.estudiante']],
            ['titulo' => 'Calificar trabajos', 'ruta' => '/calificaciones/calificar', 'icono' => 'Edit2', 'orden' => 2, 'permisos' => ['calificaciones.create', 'gestionar-calificaciones']],
            ['titulo' => 'Todas las calificaciones', 'ruta' => '/calificaciones', 'icono' => 'Eye', 'orden' => 3, 'permisos' => ['calificaciones.index', 'ver-calificaciones']],
            ['titulo' => 'Reportes académicos', 'ruta' => '/calificaciones/reportes', 'icono' => 'BarChart', 'orden' => 4, 'permisos' => ['reportes.index', 'ver-reportes']],
            ['titulo' => 'Boletines', 'ruta' => '/calificaciones/boletines', 'icono' => 'FileText', 'orden' => 5, 'permisos' => ['boletines.index', 'ver-boletines']],
        ];

        foreach ($submenuCalificaciones as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $calificaciones->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Evaluaciones - Visible para profesores y estudiantes
        $evaluaciones = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Evaluaciones', 'ruta' => '/evaluaciones', 'es_submenu' => false],
            [
                'icono'       => 'FileText',
                'descripcion' => 'Gestión de evaluaciones y exámenes',
                'orden'       => 7,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['evaluaciones.index', 'ver-evaluaciones', 'gestionar-evaluaciones'],
            ]
        );

        $submenuEvaluaciones = [
            ['titulo' => 'Mis evaluaciones', 'ruta' => '/evaluaciones/mis-evaluaciones', 'icono' => 'Clipboard', 'orden' => 1, 'permisos' => ['evaluaciones.estudiante']],
            ['titulo' => 'Crear evaluación', 'ruta' => '/evaluaciones/crear', 'icono' => 'PlusCircle', 'orden' => 2, 'permisos' => ['evaluaciones.create', 'gestionar-evaluaciones']],
            ['titulo' => 'Todas las evaluaciones', 'ruta' => '/evaluaciones', 'icono' => 'List', 'orden' => 3, 'permisos' => ['evaluaciones.index', 'ver-evaluaciones']],
            ['titulo' => 'Banco de preguntas', 'ruta' => '/evaluaciones/banco-preguntas', 'icono' => 'HelpCircle', 'orden' => 4, 'permisos' => ['preguntas.index', 'gestionar-preguntas']],
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

        // Módulo de Asistencia - Para profesores y directores
        $asistencia = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Asistencia', 'ruta' => '/asistencia', 'es_submenu' => false],
            [
                'icono'       => 'UserCheck',
                'descripcion' => 'Control de asistencia',
                'orden'       => 8,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['asistencia.index', 'gestionar-asistencia'],
            ]
        );

        $submenuAsistencia = [
            ['titulo' => 'Registrar asistencia', 'ruta' => '/asistencia/registrar', 'icono' => 'CheckSquare', 'orden' => 1, 'permisos' => ['asistencia.registrar', 'gestionar-asistencia']],
            ['titulo' => 'Ver reportes', 'ruta' => '/asistencia/reportes', 'icono' => 'BarChart', 'orden' => 2, 'permisos' => ['asistencia.reportes', 'ver-reportes-asistencia']],
        ];

        foreach ($submenuAsistencia as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $asistencia->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Comunicaciones - Para todos los roles
        $comunicaciones = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Comunicaciones', 'ruta' => '/comunicaciones', 'es_submenu' => false],
            [
                'icono'       => 'MessageCircle',
                'descripcion' => 'Sistema de comunicaciones',
                'orden'       => 9,
                'categoria'   => 'Comunicación',
                'activo'      => true,
                'permisos'    => ['comunicaciones.index', 'ver-comunicaciones'],
            ]
        );

        $submenuComunicaciones = [
            ['titulo' => 'Mensajes', 'ruta' => '/comunicaciones/mensajes', 'icono' => 'Mail', 'orden' => 1, 'permisos' => ['mensajes.index']],
            ['titulo' => 'Anuncios', 'ruta' => '/comunicaciones/anuncios', 'icono' => 'Bell', 'orden' => 2, 'permisos' => ['anuncios.index']],
            ['titulo' => 'Crear anuncio', 'ruta' => '/comunicaciones/anuncios/crear', 'icono' => 'Edit', 'orden' => 3, 'permisos' => ['anuncios.create', 'gestionar-anuncios']],
        ];

        foreach ($submenuComunicaciones as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $comunicaciones->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Seguimiento Parental - Solo para padres
        $seguimientoParental = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Seguimiento', 'ruta' => '/seguimiento', 'es_submenu' => false],
            [
                'icono'       => 'Users',
                'descripcion' => 'Seguimiento de hijos',
                'orden'       => 10,
                'categoria'   => 'Familia',
                'activo'      => true,
                'permisos'    => ['seguimiento.index', 'acceso-padres'],
            ]
        );

        $submenuSeguimiento = [
            ['titulo' => 'Mis hijos', 'ruta' => '/seguimiento/hijos', 'icono' => 'User', 'orden' => 1, 'permisos' => ['seguimiento.hijos', 'acceso-padres']],
            ['titulo' => 'Calificaciones', 'ruta' => '/seguimiento/calificaciones', 'icono' => 'Award', 'orden' => 2, 'permisos' => ['seguimiento.calificaciones', 'acceso-padres']],
            ['titulo' => 'Asistencia', 'ruta' => '/seguimiento/asistencia', 'icono' => 'Calendar', 'orden' => 3, 'permisos' => ['seguimiento.asistencia', 'acceso-padres']],
            ['titulo' => 'Tareas pendientes', 'ruta' => '/seguimiento/tareas', 'icono' => 'FileText', 'orden' => 4, 'permisos' => ['seguimiento.tareas', 'acceso-padres']],
            ['titulo' => 'Comunicados', 'ruta' => '/seguimiento/comunicados', 'icono' => 'MessageSquare', 'orden' => 5, 'permisos' => ['seguimiento.comunicados', 'acceso-padres']],
        ];

        foreach ($submenuSeguimiento as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $seguimientoParental->id,
                ],
                [
                    'icono'    => $submenu['icono'],
                    'orden'    => $submenu['orden'],
                    'activo'   => true,
                    'permisos' => $submenu['permisos'],
                ]
            );
        }

        // Módulo de Configuración - Principalmente para directores y administradores
        $configuracion = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Configuración', 'ruta' => '/configuracion', 'es_submenu' => false],
            [
                'icono'       => 'Settings',
                'descripcion' => 'Configuración del sistema',
                'orden'       => 11,
                'categoria'   => 'Sistema',
                'activo'      => true,
                'permisos'    => ['configuracion.index', 'gestionar-sistema'],
            ]
        );

        $submenuConfiguracion = [
            ['titulo' => 'General', 'ruta' => '/configuracion/general', 'icono' => 'Sliders', 'orden' => 1, 'permisos' => ['configuracion.general', 'gestionar-sistema']],
            ['titulo' => 'Permisos', 'ruta' => '/configuracion/permisos', 'icono' => 'Shield', 'orden' => 2, 'permisos' => ['permisos.index', 'gestionar-permisos']],
            ['titulo' => 'Roles', 'ruta' => '/configuracion/roles', 'icono' => 'Users', 'orden' => 3, 'permisos' => ['roles.index', 'gestionar-roles']],
            ['titulo' => 'Ciclo escolar', 'ruta' => '/configuracion/ciclo-escolar', 'icono' => 'Calendar', 'orden' => 4, 'permisos' => ['ciclo-escolar.index', 'gestionar-ciclo-escolar']],
            ['titulo' => 'Backup', 'ruta' => '/configuracion/backup', 'icono' => 'Database', 'orden' => 5, 'permisos' => ['backup.index', 'gestionar-backup']],
        ];

        foreach ($submenuConfiguracion as $submenu) {
            ModuloSidebar::firstOrCreate(
                [
                    'titulo'          => $submenu['titulo'],
                    'ruta'            => $submenu['ruta'],
                    'es_submenu'      => true,
                    'modulo_padre_id' => $configuracion->id,
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
            ['titulo' => 'Roles', 'ruta' => '/roles', 'icono' => 'Shield', 'orden' => 2, 'permisos' => ['roles.index']],
            ['titulo' => 'Permisos', 'ruta' => '/permissions', 'icono' => 'Key', 'orden' => 3, 'permisos' => ['permissions.index']],
            // ['titulo' => 'Módulos Sidebar', 'ruta' => '/modulos-sidebar', 'icono' => 'Layout', 'orden' => 4],
            // ['titulo' => 'Configuración Global', 'ruta' => '/configuracion-global', 'icono' => 'Cog', 'orden' => 4, 'permisos' => ['configuracion-global.index']],
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
    }
}
