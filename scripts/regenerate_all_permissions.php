<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Registrando todos los permisos necesarios...\n";

// Lista completa de permisos para la aplicación
$todosPermisos = [
    // Permisos básicos
    'ver-dashboard'              => 'Acceso al panel principal',
    'ver-dashboard-director'     => 'Acceso al panel del director',
    'ver-dashboard-profesor'     => 'Acceso al panel del profesor',
    'ver-dashboard-estudiante'   => 'Acceso al panel del estudiante',
    'ver-dashboard-padre'        => 'Acceso al panel de padres',

    // Permisos de estudiantes
    'estudiantes.index'          => 'Ver listado de estudiantes',
    'estudiantes.create'         => 'Crear nuevos estudiantes',
    'estudiantes.store'          => 'Guardar nuevos estudiantes',
    'estudiantes.show'           => 'Ver detalles de estudiantes',
    'estudiantes.edit'           => 'Editar estudiantes',
    'gestionar-estudiantes'      => 'Administrar estudiantes',
    'ver-estudiantes'            => 'Ver listado de estudiantes',
    'importar-estudiantes'       => 'Importar estudiantes',
    'exportar-estudiantes'       => 'Exportar estudiantes',
    'inscripciones.index'        => 'Ver listado de inscripciones',

    // Permisos de profesores
    'profesores.index'           => 'Ver listado de profesores',
    'profesores.create'          => 'Crear nuevos profesores',
    'profesores.store'           => 'Guardar nuevos profesores',
    'profesores.show'            => 'Ver detalles de profesores',
    'profesores.edit'            => 'Editar profesores',
    'gestionar-profesores'       => 'Administrar profesores',
    'asignar-cursos-profesor'    => 'Asignar cursos a profesores',
    'asignaciones.index'         => 'Ver listado de asignaciones de cursos',

    // Permisos de cursos
    'cursos.index'               => 'Ver listado de cursos',
    'cursos.create'              => 'Crear nuevos cursos',
    'cursos.store'               => 'Guardar nuevos cursos',
    'cursos.show'                => 'Ver detalles de cursos',
    'cursos.edit'                => 'Editar cursos',
    'ver-cursos'                 => 'Ver listado de cursos',
    'gestionar-cursos'           => 'Administrar cursos',
    'ver-mis-cursos'             => 'Ver mis cursos asignados',
    'cursos.mis-cursos'          => 'Acceder a mis cursos asignados',
    'horarios.index'             => 'Ver horarios',
    'ver-horarios'               => 'Acceso a horarios',
    'cursos.contenido.index'     => 'Ver contenido de cursos',
    'gestionar-contenido'        => 'Administrar contenido de cursos',

    // Permisos de tareas
    'tareas.index'               => 'Ver listado de tareas',
    'tareas.create'              => 'Crear nuevas tareas',
    'tareas.store'               => 'Guardar nuevas tareas',
    'tareas.show'                => 'Ver detalles de tareas',
    'tareas.edit'                => 'Editar tareas',
    'ver-tareas'                 => 'Ver listado de tareas',
    'gestionar-tareas'           => 'Administrar tareas',
    'ver-mis-tareas'             => 'Ver mis tareas',
    'tareas.entregas.estudiante' => 'Ver mis entregas de tareas como estudiante',
    'entregas.index'             => 'Ver listado de entregas',
    'calificar-entregas'         => 'Calificar entregas de tareas',

    // Permisos de calificaciones
    'calificaciones.index'       => 'Ver listado de calificaciones',
    'calificaciones.create'      => 'Crear nuevas calificaciones',
    'calificaciones.store'       => 'Guardar calificaciones',
    'calificaciones.show'        => 'Ver detalles de calificaciones',
    'calificaciones.edit'        => 'Editar calificaciones',
    'ver-calificaciones'         => 'Ver listado de calificaciones',
    'gestionar-calificaciones'   => 'Administrar calificaciones',
    'calificaciones.estudiante'  => 'Ver mis calificaciones como estudiante',
    'reportes.index'             => 'Ver reportes',
    'ver-reportes'               => 'Acceso a reportes',
    'boletines.index'            => 'Ver boletines',
    'ver-boletines'              => 'Acceso a boletines',

    // Permisos de evaluaciones
    'evaluaciones.index'         => 'Ver listado de evaluaciones',
    'evaluaciones.create'        => 'Crear nuevas evaluaciones',
    'evaluaciones.store'         => 'Guardar evaluaciones',
    'evaluaciones.show'          => 'Ver detalles de evaluaciones',
    'evaluaciones.edit'          => 'Editar evaluaciones',
    'ver-evaluaciones'           => 'Ver listado de evaluaciones',
    'gestionar-evaluaciones'     => 'Administrar evaluaciones',
    'evaluaciones.estudiante'    => 'Realizar evaluaciones como estudiante',
    'preguntas.index'            => 'Ver banco de preguntas',
    'gestionar-preguntas'        => 'Administrar banco de preguntas',

    // Permisos de asistencia
    'asistencia.index'           => 'Ver registro de asistencia',
    'asistencia.registrar'       => 'Registrar asistencia',
    'gestionar-asistencia'       => 'Administrar asistencia',
    'asistencia.reportes'        => 'Generar reportes de asistencia',
    'ver-reportes-asistencia'    => 'Ver reportes de asistencia',

    // Permisos de comunicaciones
    'comunicaciones.index'       => 'Ver comunicaciones',
    'mensajes.index'             => 'Ver mensajes',
    'mensajes.enviar'            => 'Enviar mensajes',
    'anuncios.index'             => 'Ver anuncios',
    'anuncios.create'            => 'Crear anuncios',
    'ver-comunicaciones'         => 'Acceso al módulo de comunicaciones',
    'gestionar-anuncios'         => 'Administrar anuncios',

    // Permisos de seguimiento parental
    'seguimiento.index'          => 'Ver seguimiento parental',
    'seguimiento.hijos'          => 'Ver información de hijos',
    'seguimiento.calificaciones' => 'Ver calificaciones de hijos',
    'seguimiento.asistencia'     => 'Ver asistencia de hijos',
    'seguimiento.tareas'         => 'Ver tareas de hijos',
    'seguimiento.comunicados'    => 'Ver comunicados para padres',
    'acceso-padres'              => 'Acceso al módulo de padres',

    // Permisos de configuración
    'configuracion.index'        => 'Ver configuración',
    'configuracion.general'      => 'Editar configuración general',
    'gestionar-sistema'          => 'Administrar sistema',
    'permisos.index'             => 'Ver permisos',
    'gestionar-permisos'         => 'Administrar permisos',
    'roles.index'                => 'Ver roles',
    'gestionar-roles'            => 'Administrar roles',
    'ciclo-escolar.index'        => 'Ver ciclo escolar',
    'gestionar-ciclo-escolar'    => 'Administrar ciclo escolar',
    'backup.index'               => 'Ver respaldos',
    'gestionar-backup'           => 'Administrar respaldos',
    'permissions.index'          => 'Ver listado de permisos',
];

// Registrar todos los permisos usando nuestro registrador
\App\Models\PermisosRegistrador::registrarPermisos($todosPermisos);
echo "Todos los permisos registrados correctamente\n";

// Asignando permisos a roles
echo "\nAsignando permisos a roles...\n";

// Recrear roles si no existen
$roles = ['admin', 'director', 'profesor', 'estudiante', 'padre'];
foreach ($roles as $rolNombre) {
    \Spatie\Permission\Models\Role::firstOrCreate(['name' => $rolNombre], [
        'name'       => $rolNombre,
        'guard_name' => 'web',
    ]);
}

// Director: acceso completo a la gestión académica
$director         = \Spatie\Permission\Models\Role::findByName('director');
$permisosDirector = [
    // Permisos de dashboard
    'ver-dashboard', 'ver-dashboard-director',

    // Permisos de estudiantes
    'estudiantes.index', 'estudiantes.create', 'estudiantes.store', 'estudiantes.show', 'estudiantes.edit',
    'ver-estudiantes', 'gestionar-estudiantes', 'importar-estudiantes', 'exportar-estudiantes',
    'inscripciones.index',

    // Permisos de profesores
    'profesores.index', 'profesores.create', 'profesores.store', 'profesores.show', 'profesores.edit',
    'gestionar-profesores', 'asignar-cursos-profesor', 'asignaciones.index',

    // Permisos de cursos
    'cursos.index', 'cursos.create', 'cursos.store', 'cursos.show', 'cursos.edit',
    'ver-cursos', 'gestionar-cursos', 'ver-mis-cursos', 'cursos.mis-cursos',
    'horarios.index', 'ver-horarios', 'cursos.contenido.index', 'gestionar-contenido',

    // Permisos de tareas
    'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit',
    'ver-tareas', 'gestionar-tareas', 'ver-mis-tareas', 'entregas.index', 'calificar-entregas',

    // Permisos de calificaciones
    'calificaciones.index', 'calificaciones.create', 'calificaciones.store', 'calificaciones.show', 'calificaciones.edit',
    'ver-calificaciones', 'gestionar-calificaciones', 'reportes.index', 'ver-reportes',
    'boletines.index', 'ver-boletines',

    // Permisos de evaluaciones
    'evaluaciones.index', 'evaluaciones.create', 'evaluaciones.store', 'evaluaciones.show', 'evaluaciones.edit',
    'ver-evaluaciones', 'gestionar-evaluaciones', 'preguntas.index', 'gestionar-preguntas',

    // Permisos de asistencia
    'asistencia.index', 'asistencia.registrar', 'gestionar-asistencia', 'asistencia.reportes', 'ver-reportes-asistencia',

    // Permisos de comunicaciones
    'comunicaciones.index', 'mensajes.index', 'mensajes.enviar', 'anuncios.index', 'anuncios.create',
    'ver-comunicaciones', 'gestionar-anuncios',

    // Permisos de configuración
    'configuracion.index', 'configuracion.general', 'gestionar-sistema', 'permisos.index', 'gestionar-permisos',
    'roles.index', 'gestionar-roles', 'ciclo-escolar.index', 'gestionar-ciclo-escolar',
    'backup.index', 'gestionar-backup', 'permissions.index',

    // Permisos de administración
    'usuarios.index', 'usuarios.create', 'usuarios.store', 'usuarios.show', 'usuarios.edit',
];

$director->syncPermissions($permisosDirector);
echo "- Rol 'director': " . count($permisosDirector) . " permisos asignados\n";

// Profesor: acceso a sus cursos, tareas, calificaciones, etc.
$profesor         = \Spatie\Permission\Models\Role::findByName('profesor');
$permisosProfesor = [
    // Permisos de dashboard
    'ver-dashboard', 'ver-dashboard-profesor',

    // Permisos de estudiantes (limitados)
    'estudiantes.index', 'estudiantes.show', 'ver-estudiantes',

    // Permisos de cursos (limitados a propios)
    'cursos.index', 'cursos.show', 'ver-cursos', 'ver-mis-cursos', 'cursos.mis-cursos',
    'horarios.index', 'ver-horarios', 'cursos.contenido.index', 'gestionar-contenido',

    // Permisos de tareas
    'tareas.index', 'tareas.create', 'tareas.store', 'tareas.show', 'tareas.edit',
    'ver-tareas', 'gestionar-tareas', 'entregas.index', 'calificar-entregas',

    // Permisos de calificaciones
    'calificaciones.index', 'calificaciones.create', 'calificaciones.store', 'calificaciones.show',
    'ver-calificaciones', 'gestionar-calificaciones',

    // Permisos de evaluaciones
    'evaluaciones.index', 'evaluaciones.create', 'evaluaciones.store', 'evaluaciones.show', 'evaluaciones.edit',
    'ver-evaluaciones', 'gestionar-evaluaciones', 'preguntas.index', 'gestionar-preguntas',

    // Permisos de asistencia
    'asistencia.index', 'asistencia.registrar', 'gestionar-asistencia',

    // Permisos de comunicaciones
    'comunicaciones.index', 'mensajes.index', 'mensajes.enviar', 'anuncios.index', 'anuncios.create',
    'ver-comunicaciones',
];

$profesor->syncPermissions($permisosProfesor);
echo "- Rol 'profesor': " . count($permisosProfesor) . " permisos asignados\n";

// Estudiante: acceso a sus cursos, tareas, calificaciones
$estudiante         = \Spatie\Permission\Models\Role::findByName('estudiante');
$permisosEstudiante = [
    // Permisos de dashboard
    'ver-dashboard', 'ver-dashboard-estudiante',

    // Permisos de cursos (solo ver)
    'cursos.show', 'ver-cursos', 'ver-mis-cursos', 'cursos.mis-cursos',
    'horarios.index', 'ver-horarios',

    // Permisos de tareas (solo ver y entregar)
    'tareas.show', 'ver-tareas', 'ver-mis-tareas', 'tareas.entregas.estudiante',

    // Permisos de calificaciones (solo ver propias)
    'calificaciones.show', 'ver-calificaciones', 'calificaciones.estudiante',

    // Permisos de evaluaciones (solo ver y realizar)
    'evaluaciones.show', 'ver-evaluaciones', 'evaluaciones.estudiante',

    // Permisos de comunicaciones (solo ver)
    'comunicaciones.index', 'mensajes.index', 'mensajes.enviar', 'anuncios.index',
    'ver-comunicaciones',
];

$estudiante->syncPermissions($permisosEstudiante);
echo "- Rol 'estudiante': " . count($permisosEstudiante) . " permisos asignados\n";

// Padre: acceso a información de sus hijos
$padre         = \Spatie\Permission\Models\Role::findByName('padre');
$permisosPadre = [
    // Permisos de dashboard
    'ver-dashboard', 'ver-dashboard-padre',

    // Permisos de seguimiento parental
    'seguimiento.index', 'seguimiento.hijos', 'seguimiento.calificaciones', 'seguimiento.asistencia',
    'seguimiento.tareas', 'seguimiento.comunicados', 'acceso-padres',

    // Permisos de comunicaciones (limitado)
    'comunicaciones.index', 'mensajes.index', 'mensajes.enviar', 'anuncios.index',
    'ver-comunicaciones',
];

$padre->syncPermissions($permisosPadre);
echo "- Rol 'padre': " . count($permisosPadre) . " permisos asignados\n";

// Admin: todos los permisos
$admin = \Spatie\Permission\Models\Role::findByName('admin');
$admin->syncPermissions(\Spatie\Permission\Models\Permission::all());
echo "- Rol 'admin': " . \Spatie\Permission\Models\Permission::count() . " permisos asignados (todos)\n";

echo "\n¡Permisos actualizados correctamente!\n";

// Verificar módulos por usuario después de la actualización
echo "\nVerificando módulos disponibles por usuario después de actualizar permisos:\n";
$usuarios = [
    \App\Models\User::where('tipo_usuario', 'admin')->first(),
    \App\Models\User::where('tipo_usuario', 'director')->first(),
    \App\Models\User::where('tipo_usuario', 'profesor')->first(),
    \App\Models\User::where('tipo_usuario', 'estudiante')->first(),
    \App\Models\User::where('tipo_usuario', 'padre')->first(),
];

foreach ($usuarios as $user) {
    if (! $user) {
        continue;
    }

    echo "Usuario {$user->id} ({$user->name}) tipo: {$user->tipo_usuario}:\n";

    // Aquí usamos una función personalizada para obtener los módulos del sidebar para un usuario específico
    $modulosParaUsuario = \App\Models\ModuloSidebar::where('activo', true)
        ->where('visible_dashboard', true)
        ->with(['submodulos' => function ($query) {
            $query->where('activo', true)
                ->where('visible_dashboard', true)
                ->orderBy('orden');
        }])
        ->whereNull('modulo_padre_id') // Solo módulos padre
        ->orderBy('orden')
        ->get()
        ->filter(function ($modulo) use ($user) {
            // Filtrar módulos padre por permisos del usuario específico
            return $modulo->usuarioTienePermiso($user);
        });

    if ($modulosParaUsuario->isEmpty()) {
        echo "  No puede ver ningún módulo\n";
    } else {
        foreach ($modulosParaUsuario as $modulo) {
            echo "  - {$modulo->titulo} ({$modulo->ruta})\n";

            if ($modulo->submodulos->isNotEmpty()) {
                foreach ($modulo->submodulos as $submenu) {
                    if ($submenu->usuarioTienePermiso($user)) {
                        echo "    • {$submenu->titulo} ({$submenu->ruta})\n";
                    }
                }
            }
        }
    }
    echo "\n";
}
