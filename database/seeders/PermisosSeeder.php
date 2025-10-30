<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermisosSeeder extends Seeder
{
    /**
     * Ejecuta los seeders para permisos de todos los módulos.
     *
     * @return void
     */
    public function run()
    {
        // Crear roles principales del sistema si no existen
        $roles = [
            'director'   => 'Director del centro educativo',
            'profesor'   => 'Profesor o docente',
            'estudiante' => 'Estudiante matriculado',
            'padre'      => 'Padre o tutor legal',
            'admin'      => 'Administrador del sistema',
        ];

        foreach ($roles as $nombre => $descripcion) {
            Role::firstOrCreate(['name' => $nombre], [
                'name'       => $nombre,
                'guard_name' => 'web',
            ]);
        }

        // Crear permisos por módulo
        $this->crearPermisosGenerales();
        $this->crearPermisosDashboard();
        $this->crearPermisosEstudiantes();
        $this->crearPermisosProfesor();
        $this->crearPermisosCursos();
        $this->crearPermisosTareas();
        $this->crearPermisosCalificaciones();
        $this->crearPermisosEvaluaciones();
        $this->crearPermisosContenidoEducativo();
        $this->crearPermisosRecursos();
        $this->crearPermisosAsistencia();
        $this->crearPermisosComunicaciones();
        $this->crearPermisosSeguimientoParental();
        $this->crearPermisosConfiguracion();

        // Asignar permisos a roles
        $this->asignarPermisosARoles();
    }

    /**
     * Crear permisos generales de acceso
     */
    protected function crearPermisosGenerales()
    {
        $permisos = [
            'acceder-plataforma'   => 'Acceder a la plataforma educativa',
            'ver-perfil-propio'    => 'Ver perfil propio',
            'editar-perfil-propio' => 'Editar perfil propio',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para los dashboard
     */
    protected function crearPermisosDashboard()
    {
        $permisos = [
            'ver-dashboard'            => 'Ver el panel principal',
            'ver-dashboard-director'   => 'Ver el panel de director',
            'ver-dashboard-profesor'   => 'Ver el panel de profesor',
            'ver-dashboard-estudiante' => 'Ver el panel de estudiante',
            'ver-dashboard-padre'      => 'Ver el panel de padre',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de estudiantes
     */
    protected function crearPermisosEstudiantes()
    {
        $permisos = [
            'estudiantes.index'         => 'Listar estudiantes',
            'estudiantes.show'          => 'Ver detalles de estudiante',
            'estudiantes.create'        => 'Crear estudiante',
            'estudiantes.edit'          => 'Editar estudiante',
            'estudiantes.delete'        => 'Eliminar estudiante',
            'estudiantes.toggle-status' => 'Activar/Desactivar estudiante',
            'ver-estudiantes'           => 'Ver estudiantes',
            'gestionar-estudiantes'     => 'Gestionar estudiantes (CRUD completo)',
            'importar-estudiantes'      => 'Importar estudiantes desde archivo',
            'exportar-estudiantes'      => 'Exportar listado de estudiantes',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de profesores
     */
    protected function crearPermisosProfesor()
    {
        $permisos = [
            'profesores.index'         => 'Listar profesores',
            'profesores.show'          => 'Ver detalles de profesor',
            'profesores.create'        => 'Crear profesor',
            'profesores.edit'          => 'Editar profesor',
            'profesores.delete'        => 'Eliminar profesor',
            'profesores.toggle-status' => 'Activar/Desactivar profesor',
            'gestionar-profesores'     => 'Gestionar profesores (CRUD completo)',
            'asignar-cursos-profesor'  => 'Asignar cursos a profesor',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de cursos
     */
    protected function crearPermisosCursos()
    {
        $permisos = [
            'cursos.index'       => 'Listar cursos',
            'cursos.show'        => 'Ver detalles de curso',
            'cursos.create'      => 'Crear curso',
            'cursos.edit'        => 'Editar curso',
            'cursos.delete'      => 'Eliminar curso',
            'gestionar-cursos'   => 'Gestionar cursos (CRUD completo)',
            'ver-mis-cursos'     => 'Ver cursos propios (para estudiantes y profesores)',
            'gestionar-material' => 'Gestionar material de cursos',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de tareas
     */
    protected function crearPermisosTareas()
    {
        $permisos = [
            'tareas.index'     => 'Listar tareas',
            'tareas.show'      => 'Ver detalles de tarea',
            'tareas.create'    => 'Crear tarea',
            'tareas.edit'      => 'Editar tarea',
            'tareas.delete'    => 'Eliminar tarea',
            'gestionar-tareas' => 'Gestionar tareas (CRUD completo)',
            'ver-mis-tareas'   => 'Ver tareas asignadas (para estudiantes)',
            'entregar-tarea'   => 'Entregar tarea (para estudiantes)',
            'ver-entregas'     => 'Ver entregas de tareas (para profesores)',
            'calificar-tarea'  => 'Calificar entrega de tarea',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de calificaciones
     */
    protected function crearPermisosCalificaciones()
    {
        $permisos = [
            'calificaciones.index'     => 'Listar calificaciones',
            'calificaciones.show'      => 'Ver detalles de calificación',
            'calificaciones.create'    => 'Crear calificación',
            'calificaciones.edit'      => 'Editar calificación',
            'calificaciones.delete'    => 'Eliminar calificación',
            'gestionar-calificaciones' => 'Gestionar calificaciones (CRUD completo)',
            'ver-mis-calificaciones'   => 'Ver calificaciones propias (para estudiantes)',
            'exportar-calificaciones'  => 'Exportar reportes de calificaciones',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de evaluaciones
     */
    protected function crearPermisosEvaluaciones()
    {
        $permisos = [
            'evaluaciones.index'      => 'Listar evaluaciones',
            'evaluaciones.show'       => 'Ver detalles de evaluación',
            'evaluaciones.create'     => 'Crear evaluación',
            'evaluaciones.edit'       => 'Editar evaluación',
            'evaluaciones.delete'     => 'Eliminar evaluación',
            'gestionar-evaluaciones'  => 'Gestionar evaluaciones (CRUD completo)',
            'ver-evaluaciones'        => 'Ver evaluaciones',
            'evaluaciones.estudiante' => 'Ver evaluaciones como estudiante',
            'gestionar-preguntas'     => 'Gestionar banco de preguntas',
            'preguntas.index'         => 'Ver banco de preguntas',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de contenido educativo (módulos y lecciones)
     */
    protected function crearPermisosContenidoEducativo()
    {
        $permisos = [
            // Módulos Educativos
            'modulos.index'           => 'Listar módulos educativos',
            'modulos.show'            => 'Ver detalles de módulo',
            'modulos.create'          => 'Crear módulo educativo',
            'modulos.edit'            => 'Editar módulo educativo',
            'modulos.delete'          => 'Eliminar módulo educativo',
            'gestionar-modulos'       => 'Gestionar módulos educativos (CRUD completo)',
            'modulos.reordenar'       => 'Reordenar módulos',
            'modulos.publicar'        => 'Publicar módulos',
            'modulos.archivar'        => 'Archivar módulos',
            'modulos.duplicar'        => 'Duplicar módulos',

            // Lecciones
            'lecciones.index'         => 'Listar lecciones',
            'lecciones.show'          => 'Ver detalles de lección',
            'lecciones.create'        => 'Crear lección',
            'lecciones.edit'          => 'Editar lección',
            'lecciones.delete'        => 'Eliminar lección',
            'gestionar-lecciones'     => 'Gestionar lecciones (CRUD completo)',
            'lecciones.reordenar'     => 'Reordenar lecciones',
            'lecciones.publicar'      => 'Publicar lecciones',
            'lecciones.archivar'      => 'Archivar lecciones',
            'lecciones.duplicar'      => 'Duplicar lecciones',

            // General
            'ver-contenido-educativo' => 'Ver contenido educativo',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de recursos
     */
    protected function crearPermisosRecursos()
    {
        $permisos = [
            'recursos.index'      => 'Listar recursos',
            'recursos.show'       => 'Ver detalles de recurso',
            'recursos.create'     => 'Crear recurso',
            'recursos.edit'       => 'Editar recurso',
            'recursos.delete'     => 'Eliminar recurso',
            'gestionar-recursos'  => 'Gestionar recursos (CRUD completo)',
            'ver-recursos'        => 'Ver recursos',
            'descargar-recursos'  => 'Descargar recursos',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de asistencia
     */
    protected function crearPermisosAsistencia()
    {
        $permisos = [
            'asistencia.index'        => 'Listar asistencia',
            'asistencia.registrar'    => 'Registrar asistencia',
            'gestionar-asistencia'    => 'Gestionar asistencia',
            'asistencia.reportes'     => 'Ver reportes de asistencia',
            'ver-reportes-asistencia' => 'Ver todos los reportes de asistencia',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de comunicaciones
     */
    protected function crearPermisosComunicaciones()
    {
        $permisos = [
            'comunicaciones.index' => 'Acceder al módulo de comunicaciones',
            'mensajes.index'       => 'Ver mensajes',
            'mensajes.enviar'      => 'Enviar mensajes',
            'anuncios.index'       => 'Ver anuncios',
            'anuncios.create'      => 'Crear anuncios',
            'gestionar-anuncios'   => 'Gestionar anuncios',
            'ver-comunicaciones'   => 'Ver todas las comunicaciones',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de seguimiento parental
     */
    protected function crearPermisosSeguimientoParental()
    {
        $permisos = [
            'seguimiento.index'          => 'Acceder al módulo de seguimiento parental',
            'seguimiento.hijos'          => 'Ver información de los hijos',
            'seguimiento.calificaciones' => 'Ver calificaciones de los hijos',
            'seguimiento.asistencia'     => 'Ver asistencia de los hijos',
            'seguimiento.tareas'         => 'Ver tareas de los hijos',
            'seguimiento.comunicados'    => 'Ver comunicados escolares',
            'acceso-padres'              => 'Acceso general para padres',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Crear permisos para el módulo de configuración
     */
    protected function crearPermisosConfiguracion()
    {
        $permisos = [
            'configuracion.index'     => 'Acceder al módulo de configuración',
            'configuracion.general'   => 'Configurar ajustes generales',
            'gestionar-sistema'       => 'Gestionar configuración del sistema',
            'permisos.index'          => 'Ver permisos',
            'gestionar-permisos'      => 'Gestionar permisos',
            'roles.index'             => 'Ver roles',
            'gestionar-roles'         => 'Gestionar roles',
            'ciclo-escolar.index'     => 'Ver ciclos escolares',
            'gestionar-ciclo-escolar' => 'Gestionar ciclos escolares',
            'backup.index'            => 'Ver backups',
            'gestionar-backup'        => 'Gestionar backups',
        ];

        $this->crearPermisos($permisos);
    }

    /**
     * Método auxiliar para crear permisos
     */
    protected function crearPermisos(array $permisos)
    {
        foreach ($permisos as $nombre => $descripcion) {
            Permission::firstOrCreate(['name' => $nombre], [
                'name'       => $nombre,
                'guard_name' => 'web',
            ]);
        }
    }

    /**
     * Asignar permisos a roles
     */
    protected function asignarPermisosARoles()
    {
        $this->asignarPermisosDirector();
        $this->asignarPermisosProfesor();
        $this->asignarPermisosEstudiante();
        $this->asignarPermisosPadre();
        $this->asignarPermisosAdmin();
    }

    /**
     * Asignar permisos al rol de director
     */
    protected function asignarPermisosDirector()
    {
        $rol = Role::findByName('director');

        $permisosDirector = [
            // Generales
            'acceder-plataforma', 'ver-perfil-propio', 'editar-perfil-propio',

            // Dashboard
            'ver-dashboard', 'ver-dashboard-director',

            // Estudiantes
            'estudiantes.index', 'estudiantes.show', 'estudiantes.create', 'estudiantes.edit', 'estudiantes.delete',
            'estudiantes.toggle-status', 'ver-estudiantes', 'gestionar-estudiantes',
            'importar-estudiantes', 'exportar-estudiantes',

            // Profesores
            'profesores.index', 'profesores.show', 'profesores.create', 'profesores.edit', 'profesores.delete',
            'profesores.toggle-status', 'gestionar-profesores', 'asignar-cursos-profesor',

            // Cursos
            'cursos.index', 'cursos.show', 'cursos.create', 'cursos.edit',
            'gestionar-cursos', 'ver-mis-cursos', 'gestionar-material',

            // Tareas
            'tareas.index', 'tareas.show', 'ver-entregas',

            // Calificaciones
            'calificaciones.index', 'calificaciones.show', 'exportar-calificaciones',

            // Evaluaciones
            'evaluaciones.index', 'evaluaciones.show', 'ver-evaluaciones',

            // Contenido Educativo (Módulos y Lecciones)
            'modulos.index', 'modulos.show', 'modulos.create', 'modulos.edit', 'modulos.delete',
            'gestionar-modulos', 'modulos.reordenar', 'modulos.publicar', 'modulos.archivar', 'modulos.duplicar',
            'lecciones.index', 'lecciones.show', 'lecciones.create', 'lecciones.edit', 'lecciones.delete',
            'gestionar-lecciones', 'lecciones.reordenar', 'lecciones.publicar', 'lecciones.archivar', 'lecciones.duplicar',
            'ver-contenido-educativo',

            // Recursos
            'recursos.index', 'recursos.show', 'recursos.create', 'recursos.edit', 'recursos.delete',
            'gestionar-recursos', 'ver-recursos', 'descargar-recursos',

            // Asistencia
            'asistencia.index', 'asistencia.reportes', 'ver-reportes-asistencia',

            // Comunicaciones
            'comunicaciones.index', 'mensajes.index', 'mensajes.enviar',
            'anuncios.index', 'anuncios.create', 'gestionar-anuncios', 'ver-comunicaciones',

            // Configuración
            'configuracion.index', 'configuracion.general', 'gestionar-sistema',
            'permisos.index', 'gestionar-permisos', 'roles.index', 'gestionar-roles',
            'ciclo-escolar.index', 'gestionar-ciclo-escolar', 'backup.index', 'gestionar-backup',
        ];

        $rol->syncPermissions($permisosDirector);
    }

    /**
     * Asignar permisos al rol de profesor
     */
    protected function asignarPermisosProfesor()
    {
        $rol = Role::findByName('profesor');

        $permisosProfesor = [
            // Generales
            'acceder-plataforma', 'ver-perfil-propio', 'editar-perfil-propio',

            // Dashboard
            'ver-dashboard', 'ver-dashboard-profesor',

            // Estudiantes
            'estudiantes.index', 'estudiantes.show', 'ver-estudiantes',

            // Cursos
            'cursos.index', 'cursos.show', 'ver-mis-cursos', 'gestionar-material',

            // Tareas
            'tareas.index', 'tareas.show', 'tareas.create', 'tareas.edit',
            'gestionar-tareas', 'ver-entregas', 'calificar-tarea',

            // Calificaciones
            'calificaciones.index', 'calificaciones.show', 'calificaciones.create',
            'calificaciones.edit', 'gestionar-calificaciones', 'exportar-calificaciones',

            // Evaluaciones
            'evaluaciones.index', 'evaluaciones.show', 'evaluaciones.create',
            'evaluaciones.edit', 'gestionar-evaluaciones', 'ver-evaluaciones',
            'gestionar-preguntas', 'preguntas.index',

            // Contenido Educativo (Módulos y Lecciones)
            'modulos.index', 'modulos.show', 'modulos.create', 'modulos.edit', 'modulos.delete',
            'gestionar-modulos', 'modulos.reordenar', 'modulos.publicar', 'modulos.archivar', 'modulos.duplicar',
            'lecciones.index', 'lecciones.show', 'lecciones.create', 'lecciones.edit', 'lecciones.delete',
            'gestionar-lecciones', 'lecciones.reordenar', 'lecciones.publicar', 'lecciones.archivar', 'lecciones.duplicar',
            'ver-contenido-educativo',

            // Recursos
            'recursos.index', 'recursos.show', 'recursos.create', 'recursos.edit', 'recursos.delete',
            'gestionar-recursos', 'ver-recursos', 'descargar-recursos',

            // Asistencia
            'asistencia.index', 'asistencia.registrar', 'gestionar-asistencia',
            'asistencia.reportes',

            // Comunicaciones
            'comunicaciones.index', 'mensajes.index', 'mensajes.enviar',
            'anuncios.index', 'anuncios.create',
        ];

        $rol->syncPermissions($permisosProfesor);
    }

    /**
     * Asignar permisos al rol de estudiante
     */
    protected function asignarPermisosEstudiante()
    {
        $rol = Role::findByName('estudiante');

        $permisosEstudiante = [
            // Generales
            'acceder-plataforma', 'ver-perfil-propio', 'editar-perfil-propio',

            // Dashboard
            'ver-dashboard', 'ver-dashboard-estudiante',

            // Cursos
            'cursos.show', 'ver-mis-cursos',

            // Tareas
            'tareas.show', 'ver-mis-tareas', 'entregar-tarea',

            // Calificaciones
            'ver-mis-calificaciones',

            // Evaluaciones
            'evaluaciones.estudiante',

            // Comunicaciones
            'comunicaciones.index', 'mensajes.index', 'mensajes.enviar',
            'anuncios.index',
        ];

        $rol->syncPermissions($permisosEstudiante);
    }

    /**
     * Asignar permisos al rol de padre
     */
    protected function asignarPermisosPadre()
    {
        $rol = Role::findByName('padre');

        $permisosPadre = [
            // Generales
            'acceder-plataforma', 'ver-perfil-propio', 'editar-perfil-propio',

            // Dashboard
            'ver-dashboard', 'ver-dashboard-padre',

            // Seguimiento Parental
            'seguimiento.index', 'seguimiento.hijos', 'seguimiento.calificaciones',
            'seguimiento.asistencia', 'seguimiento.tareas', 'seguimiento.comunicados',
            'acceso-padres',

            // Comunicaciones
            'comunicaciones.index', 'mensajes.index', 'mensajes.enviar',
            'anuncios.index',
        ];

        $rol->syncPermissions($permisosPadre);
    }

    /**
     * Asignar permisos al rol de administrador
     */
    protected function asignarPermisosAdmin()
    {
        // El administrador tiene todos los permisos
        $rol              = Role::findByName('admin');
        $todosLosPermisos = Permission::all();
        $rol->syncPermissions($todosLosPermisos);
    }
}
