<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Creando permisos faltantes...\n";

// Lista de permisos faltantes que se encontraron en el análisis previo
$permisosFaltantes = [
    'ver-estudiantes'            => 'Ver listado de estudiantes',
    'inscripciones.index'        => 'Ver listado de inscripciones',
    'ver-tareas'                 => 'Ver listado de tareas',
    'tareas.entregas.estudiante' => 'Ver mis entregas de tareas como estudiante',
    'entregas.index'             => 'Ver listado de entregas',
    'calificar-entregas'         => 'Calificar entregas de tareas',
    'ver-cursos'                 => 'Ver listado de cursos',
    'cursos.mis-cursos'          => 'Ver mis cursos asignados',
    'horarios.index'             => 'Ver horarios',
    'ver-horarios'               => 'Acceso a horarios',
    'cursos.contenido.index'     => 'Ver contenido de cursos',
    'gestionar-contenido'        => 'Administrar contenido de cursos',
    'ver-calificaciones'         => 'Ver listado de calificaciones',
    'calificaciones.estudiante'  => 'Ver mis calificaciones como estudiante',
    'reportes.index'             => 'Ver reportes',
    'ver-reportes'               => 'Acceso a reportes',
    'boletines.index'            => 'Ver boletines',
    'ver-boletines'              => 'Acceso a boletines',
    'permissions.index'          => 'Ver listado de permisos',
];

// Crear los permisos faltantes
foreach ($permisosFaltantes as $nombre => $descripcion) {
    $permiso = \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $nombre], [
        'name'        => $nombre,
        'guard_name'  => 'web',
        'description' => $descripcion,
    ]);

    echo "- Permiso '{$nombre}' " . ($permiso->wasRecentlyCreated ? 'creado' : 'ya existe') . "\n";
}

// Asignar permisos a roles
echo "\nAsignando permisos a roles...\n";

// Director: acceso completo
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
    'gestionar-profesores', 'asignar-cursos-profesor',

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
