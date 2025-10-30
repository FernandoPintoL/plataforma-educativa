<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        // Permisos para plataforma educativa
        $educationalPermissions = [
            // Estudiantes
            'estudiantes.index', 'estudiantes.create', 'estudiantes.store', 'estudiantes.show', 'estudiantes.edit', 'estudiantes.update', 'estudiantes.destroy',
            'estudiantes.inscripciones', 'estudiantes.historial',

            // Profesores
            'profesores.index', 'profesores.create', 'profesores.store', 'profesores.show', 'profesores.edit', 'profesores.update', 'profesores.destroy',
            'profesores.asignaciones',

            // Cursos
            'cursos.index', 'cursos.create', 'cursos.store', 'cursos.show', 'cursos.edit', 'cursos.update', 'cursos.destroy',
            'cursos.horarios', 'cursos.inscribir-estudiante', 'cursos.asignar-profesor',
            'cursos.ver', 'cursos.gestionar_estudiantes',

            // Tareas
            'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit', 'tareas.update', 'tareas.destroy',
            'tareas.entregas', 'tareas.calificar', 'tareas.entregar', 'tareas.asignar',

            // Calificaciones
            'calificaciones.index', 'calificaciones.show', 'calificaciones.edit', 'calificaciones.update', 'calificaciones.reportes',
            'calificaciones.create', 'calificaciones.delete',

            // Contenido educativo
            'contenido.ver', 'contenido.create', 'contenido.edit', 'contenido.delete', 'contenido.publicar',

            // Evaluaciones
            'evaluaciones.ver', 'evaluaciones.create', 'evaluaciones.edit', 'evaluaciones.delete',
            'evaluaciones.tomar', 'evaluaciones.calificar',

            // Trabajos
            'trabajos.ver', 'trabajos.entregar', 'trabajos.calificar', 'trabajos.revisar',

            // Recursos
            'recursos.ver', 'recursos.create', 'recursos.edit', 'recursos.delete', 'recursos.descargar',

            // Análisis inteligente
            'analisis.ver', 'analisis.ejecutar', 'analisis.recomendaciones',

            // Orientación vocacional
            'vocacional.ver_tests', 'vocacional.tomar_tests', 'vocacional.ver_resultados',
            'vocacional.ver_recomendaciones', 'vocacional.gestionar_tests', 'vocacional.gestionar_carreras',

            // Reportes
            'reportes.ver', 'reportes.create', 'reportes.exportar', 'reportes.estadisticas',

            // Notificaciones
            'notificaciones.ver', 'notificaciones.enviar', 'notificaciones.gestionar',

            // Administración
            'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit', 'usuarios.update', 'usuarios.destroy',
            'roles.index', 'roles.create', 'roles.store', 'roles.show', 'roles.edit', 'roles.update', 'roles.destroy',
            'admin.usuarios', 'admin.roles', 'admin.permisos', 'admin.configuracion', 'admin.backup',
        ];

        // Crear permisos
        foreach ($educationalPermissions as $name) {
            Permission::findOrCreate($name);
        }

        // Crear roles
        $admin       = Role::findOrCreate('admin');
        $director    = Role::findOrCreate('director');
        $profesor    = Role::findOrCreate('profesor');
        $estudiante  = Role::findOrCreate('estudiante');
        $padre       = Role::findOrCreate('padre');
        $coordinador = Role::findOrCreate('coordinador');
        $tutor       = Role::findOrCreate('tutor');

        // Asignar permisos a roles
        $admin->givePermissionTo(Permission::all());

        $profesorPerms = [
            'profesores.index', 'profesores.show', 'profesores.asignaciones',
            'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit', 'tareas.update', 'tareas.destroy', 'tareas.calificar', 'tareas.asignar',
            'cursos.index', 'cursos.show', 'cursos.horarios', 'cursos.ver', 'cursos.create', 'cursos.edit', 'cursos.gestionar_estudiantes',
            'calificaciones.index', 'calificaciones.show', 'calificaciones.edit', 'calificaciones.update', 'calificaciones.create',
            'contenido.ver', 'contenido.create', 'contenido.edit', 'contenido.delete', 'contenido.publicar',
            'evaluaciones.ver', 'evaluaciones.create', 'evaluaciones.edit', 'evaluaciones.delete', 'evaluaciones.calificar',
            'trabajos.ver', 'trabajos.calificar', 'trabajos.revisar',
            'recursos.ver', 'recursos.create', 'recursos.edit', 'recursos.delete',
            'analisis.ver', 'analisis.ejecutar', 'analisis.recomendaciones',
            'vocacional.ver_tests', 'vocacional.gestionar_tests',
            'reportes.ver', 'reportes.create', 'reportes.exportar',
            'notificaciones.ver', 'notificaciones.enviar',
        ];
        $profesor->syncPermissions($profesorPerms);

        $estudiantePerms = [
            'estudiantes.index', 'estudiantes.show', 'estudiantes.inscripciones', 'estudiantes.historial',
            'tareas.index', 'tareas.show', 'tareas.entregas', 'tareas.entregar',
            'cursos.index', 'cursos.show', 'cursos.horarios', 'cursos.ver',
            'calificaciones.index', 'calificaciones.show',
            'contenido.ver',
            'evaluaciones.ver', 'evaluaciones.tomar',
            'trabajos.ver', 'trabajos.entregar',
            'recursos.ver', 'recursos.descargar',
            'analisis.ver', 'analisis.recomendaciones',
            'vocacional.ver_tests', 'vocacional.tomar_tests', 'vocacional.ver_resultados', 'vocacional.ver_recomendaciones',
            'notificaciones.ver',
        ];
        $estudiante->syncPermissions($estudiantePerms);

        $coordinadorPerms = [
            'cursos.index', 'cursos.create', 'cursos.store', 'cursos.show', 'cursos.edit', 'cursos.update', 'cursos.destroy',
            'cursos.horarios', 'cursos.inscribir-estudiante', 'cursos.asignar-profesor', 'cursos.ver', 'cursos.gestionar_estudiantes',
            'profesores.index', 'profesores.asignaciones',
            'estudiantes.index', 'estudiantes.inscripciones',
            'calificaciones.reportes', 'calificaciones.index', 'calificaciones.create', 'calificaciones.edit',
            'contenido.ver', 'contenido.create', 'contenido.edit', 'contenido.publicar',
            'evaluaciones.ver', 'evaluaciones.create', 'evaluaciones.edit',
            'recursos.ver', 'recursos.create', 'recursos.edit',
            'analisis.ver', 'analisis.ejecutar',
            'reportes.ver', 'reportes.create', 'reportes.exportar', 'reportes.estadisticas',
            'notificaciones.ver', 'notificaciones.enviar', 'notificaciones.gestionar',
        ];
        $coordinador->syncPermissions($coordinadorPerms);

        $tutorPerms = [
            'estudiantes.index', 'estudiantes.show', 'estudiantes.historial',
            'tareas.index', 'tareas.show',
            'calificaciones.index', 'calificaciones.show',
            'cursos.ver',
            'contenido.ver',
            'recursos.ver',
            'analisis.ver',
            'vocacional.ver_resultados', 'vocacional.ver_recomendaciones',
            'reportes.ver',
            'notificaciones.ver',
        ];
        $tutor->syncPermissions($tutorPerms);

        $directorPerms = [
            'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit', 'usuarios.update', 'usuarios.destroy',
            'cursos.index', 'cursos.create', 'cursos.store', 'cursos.show', 'cursos.edit', 'cursos.update', 'cursos.destroy',
            'cursos.horarios', 'cursos.inscribir-estudiante', 'cursos.asignar-profesor', 'cursos.ver', 'cursos.gestionar_estudiantes',
            'profesores.index', 'profesores.create', 'profesores.store', 'profesores.show', 'profesores.edit', 'profesores.update', 'profesores.destroy', 'profesores.asignaciones',
            'estudiantes.index', 'estudiantes.create', 'estudiantes.store', 'estudiantes.show', 'estudiantes.edit', 'estudiantes.update', 'estudiantes.destroy', 'estudiantes.inscripciones', 'estudiantes.historial',
            'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit', 'tareas.update', 'tareas.destroy', 'tareas.entregas', 'tareas.calificar', 'tareas.asignar',
            'calificaciones.index', 'calificaciones.show', 'calificaciones.edit', 'calificaciones.update', 'calificaciones.reportes', 'calificaciones.create', 'calificaciones.delete',
            'contenido.ver', 'contenido.create', 'contenido.edit', 'contenido.delete', 'contenido.publicar',
            'evaluaciones.ver', 'evaluaciones.create', 'evaluaciones.edit', 'evaluaciones.delete', 'evaluaciones.calificar',
            'trabajos.ver', 'trabajos.calificar', 'trabajos.revisar',
            'recursos.ver', 'recursos.create', 'recursos.edit', 'recursos.delete',
            'analisis.ver', 'analisis.ejecutar', 'analisis.recomendaciones',
            'vocacional.ver_tests', 'vocacional.gestionar_tests', 'vocacional.gestionar_carreras',
            'reportes.ver', 'reportes.create', 'reportes.exportar', 'reportes.estadisticas',
            'notificaciones.ver', 'notificaciones.enviar', 'notificaciones.gestionar',
            'admin.usuarios', 'admin.roles', 'admin.permisos', 'admin.configuracion',
        ];
        $director->syncPermissions($directorPerms);

        $padrePerms = [
            'estudiantes.show', 'estudiantes.historial',
            'tareas.index', 'tareas.show',
            'calificaciones.index', 'calificaciones.show',
            'cursos.ver',
            'contenido.ver',
            'recursos.ver',
            'trabajos.ver',
            'analisis.ver',
            'vocacional.ver_tests', 'vocacional.ver_resultados', 'vocacional.ver_recomendaciones',
            'reportes.ver',
            'notificaciones.ver',
        ];
        $padre->syncPermissions($padrePerms);
    }
}
