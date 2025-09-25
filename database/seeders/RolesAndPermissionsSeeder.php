<?php
namespace Database\Seeders;

use App\Models\User;
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

            // Tareas
            'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit', 'tareas.update', 'tareas.destroy',
            'tareas.entregas', 'tareas.calificar',

            // Calificaciones
            'calificaciones.index', 'calificaciones.show', 'calificaciones.edit', 'calificaciones.update', 'calificaciones.reportes',

            // Administración
            'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit', 'usuarios.update', 'usuarios.destroy',
            'roles.index', 'roles.create', 'roles.store', 'roles.show', 'roles.edit', 'roles.update', 'roles.destroy',
        ];

        // Crear permisos
        foreach ($educationalPermissions as $name) {
            Permission::findOrCreate($name);
        }

        // Crear roles
        $admin      = Role::findOrCreate('Admin');
        $profesor   = Role::findOrCreate('Profesor');
        $estudiante = Role::findOrCreate('Estudiante');
        $coordinador = Role::findOrCreate('Coordinador');
        $tutor      = Role::findOrCreate('Tutor');

        // Asignar permisos a roles
        $admin->givePermissionTo(Permission::all());

        $profesorPerms = [
            'profesores.index', 'profesores.show', 'profesores.asignaciones',
            'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit', 'tareas.update', 'tareas.destroy', 'tareas.calificar',
            'cursos.index', 'cursos.show', 'cursos.horarios',
            'calificaciones.index', 'calificaciones.show', 'calificaciones.edit', 'calificaciones.update',
        ];
        $profesor->syncPermissions($profesorPerms);

        $estudiantePerms = [
            'estudiantes.index', 'estudiantes.show', 'estudiantes.inscripciones', 'estudiantes.historial',
            'tareas.index', 'tareas.show', 'tareas.entregas',
            'cursos.index', 'cursos.show', 'cursos.horarios',
            'calificaciones.index', 'calificaciones.show',
        ];
        $estudiante->syncPermissions($estudiantePerms);

        $coordinadorPerms = [
            'cursos.index', 'cursos.create', 'cursos.store', 'cursos.show', 'cursos.edit', 'cursos.update', 'cursos.destroy',
            'cursos.horarios', 'cursos.inscribir-estudiante', 'cursos.asignar-profesor',
            'profesores.index', 'profesores.asignaciones',
            'estudiantes.index', 'estudiantes.inscripciones',
            'calificaciones.reportes',
        ];
        $coordinador->syncPermissions($coordinadorPerms);

        $tutorPerms = [
            'estudiantes.index', 'estudiantes.show', 'estudiantes.historial',
            'tareas.index', 'tareas.show',
            'calificaciones.index', 'calificaciones.show',
        ];
        $tutor->syncPermissions($tutorPerms);
    }
}
