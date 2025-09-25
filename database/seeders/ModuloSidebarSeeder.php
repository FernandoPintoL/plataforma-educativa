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
        // Módulo de Estudiantes
        $estudiantes = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Estudiantes', 'ruta' => '/estudiantes', 'es_submenu' => false],
            [
                'icono'       => 'User',
                'descripcion' => 'Gestión de estudiantes',
                'orden'       => 1,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['estudiantes.index'],
            ]
        );

        $submenuEstudiantes = [
            ['titulo' => 'Listado', 'ruta' => '/estudiantes', 'icono' => 'List', 'orden' => 1, 'permisos' => ['estudiantes.index']],
            ['titulo' => 'Inscripciones', 'ruta' => '/estudiantes/inscripciones', 'icono' => 'Clipboard', 'orden' => 2, 'permisos' => ['inscripciones.index']],
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

        // Módulo de Profesores
        $profesores = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Profesores', 'ruta' => '/profesores', 'es_submenu' => false],
            [
                'icono'       => 'UserCheck',
                'descripcion' => 'Gestión de profesores',
                'orden'       => 2,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['profesores.index'],
            ]
        );

        $submenuProfesores = [
            ['titulo' => 'Listado', 'ruta' => '/profesores', 'icono' => 'List', 'orden' => 1, 'permisos' => ['profesores.index']],
            ['titulo' => 'Asignaciones', 'ruta' => '/profesores/asignaciones', 'icono' => 'BookOpen', 'orden' => 2, 'permisos' => ['asignaciones.index']],
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

        // Módulo de Tareas
        $tareas = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Tareas', 'ruta' => '/tareas', 'es_submenu' => false],
            [
                'icono'       => 'ClipboardList',
                'descripcion' => 'Gestión de tareas',
                'orden'       => 3,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['tareas.index'],
            ]
        );

        $submenuTareas = [
            ['titulo' => 'Todas las tareas', 'ruta' => '/tareas', 'icono' => 'List', 'orden' => 1, 'permisos' => ['tareas.index']],
            ['titulo' => 'Entregas', 'ruta' => '/tareas/entregas', 'icono' => 'Inbox', 'orden' => 2, 'permisos' => ['entregas.index']],
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

        // Módulo de Cursos
        $cursos = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Cursos', 'ruta' => '/cursos', 'es_submenu' => false],
            [
                'icono'       => 'Book',
                'descripcion' => 'Gestión de cursos',
                'orden'       => 4,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['cursos.index'],
            ]
        );

        $submenuCursos = [
            ['titulo' => 'Listado', 'ruta' => '/cursos', 'icono' => 'List', 'orden' => 1, 'permisos' => ['cursos.index']],
            ['titulo' => 'Horarios', 'ruta' => '/cursos/horarios', 'icono' => 'Calendar', 'orden' => 2, 'permisos' => ['horarios.index']],
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

        // Módulo de Calificaciones
        $calificaciones = ModuloSidebar::firstOrCreate(
            ['titulo' => 'Calificaciones', 'ruta' => '/calificaciones', 'es_submenu' => false],
            [
                'icono'       => 'Award',
                'descripcion' => 'Gestión de calificaciones',
                'orden'       => 5,
                'categoria'   => 'Académico',
                'activo'      => true,
                'permisos'    => ['calificaciones.index'],
            ]
        );

        $submenuCalificaciones = [
            ['titulo' => 'Ver calificaciones', 'ruta' => '/calificaciones', 'icono' => 'Eye', 'orden' => 1, 'permisos' => ['calificaciones.index']],
            ['titulo' => 'Reportes', 'ruta' => '/calificaciones/reportes', 'icono' => 'BarChart', 'orden' => 2, 'permisos' => ['reportes.index']],
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
