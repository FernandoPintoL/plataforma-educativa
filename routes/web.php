<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal: redirige a dashboard
Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
});

// Ruta del dashboard
Route::middleware(['auth'])->get('/dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');

// Ruta de prueba para verificar CSRF token
Route::post('/test-csrf', function () {
    return response()->json(['message' => 'CSRF token is valid', 'success' => true]);
})->name('test.csrf');

// Solo usuarios, roles, permisos y prototipos educativos
Route::middleware(['auth', 'verified'])->group(function () {
    // Módulo de usuarios, roles y permisos (mantener)
    Route::resource('usuarios', \App\Http\Controllers\UserController::class);
    Route::post('usuarios/{usuario}/assign-role', [\App\Http\Controllers\UserController::class, 'assignRole'])->name('usuarios.assign-role');
    Route::delete('usuarios/{usuario}/remove-role', [\App\Http\Controllers\UserController::class, 'removeRole'])->name('usuarios.remove-role');
    Route::post('usuarios/{usuario}/assign-permission', [\App\Http\Controllers\UserController::class, 'assignPermission'])->name('usuarios.assign-permission');
    Route::delete('usuarios/{usuario}/remove-permission', [\App\Http\Controllers\UserController::class, 'removePermission'])->name('usuarios.remove-permission');
    Route::patch('usuarios/{usuario}/toggle-status', [\App\Http\Controllers\UserController::class, 'toggleStatus'])->name('usuarios.toggle-status');

    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    Route::post('roles/{role}/assign-permission', [\App\Http\Controllers\RoleController::class, 'assignPermission'])->name('roles.assign-permission');
    Route::delete('roles/{role}/remove-permission', [\App\Http\Controllers\RoleController::class, 'removePermission'])->name('roles.remove-permission');

    Route::resource('permissions', \App\Http\Controllers\PermissionController::class);

    // Módulo de estudiantes
    Route::resource('estudiantes', \App\Http\Controllers\EstudianteController::class);
    Route::patch('estudiantes/{estudiante}/toggle-status', [\App\Http\Controllers\EstudianteController::class, 'toggleStatus'])->name('estudiantes.toggle-status');

    // Módulo de profesores
    Route::resource('profesores', \App\Http\Controllers\ProfesorController::class);
    Route::patch('profesores/{profesor}/toggle-status', [\App\Http\Controllers\ProfesorController::class, 'toggleStatus'])->name('profesores.toggle-status');

    // Rutas para prototipos educativos
    Route::get('educacion/dashboard', function () {
        return Inertia::render('Educacion/Dashboard');
    })->name('educacion.dashboard');
    Route::get('educacion/estudiantes', function () {
        return Inertia::render('Educacion/Estudiantes');
    })->name('educacion.estudiantes');
    Route::get('educacion/profesores', function () {
        return Inertia::render('Educacion/Profesores');
    })->name('educacion.profesores');
    Route::get('educacion/cursos', function () {
        return Inertia::render('Educacion/Cursos');
    })->name('educacion.cursos');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
require __DIR__ . '/test.php';

// ==================== GESTIÓN DE USUARIOS (SOLO DIRECTOR/ADMIN) ====================
Route::middleware(['auth', 'verified', 'role:director|admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('usuarios', \App\Http\Controllers\GestionUsuariosController::class);
    Route::post('usuarios/{usuario}/reactivar', [\App\Http\Controllers\GestionUsuariosController::class, 'reactivar'])
        ->name('usuarios.reactivar');
    Route::post('usuarios/{usuario}/reset-password', [\App\Http\Controllers\GestionUsuariosController::class, 'resetPassword'])
        ->name('usuarios.reset-password');
});

// ==================== DASHBOARDS POR ROL ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard principal - redirige según el rol
    Route::get('/dashboard', function () {
        $user = Auth::user();

        // Redirigir según el tipo de usuario
        if ($user->esDirector() || $user->hasRole('director')) {
            return redirect()->route('dashboard.director');
        } elseif ($user->esProfesor() || $user->hasRole('profesor')) {
            return redirect()->route('dashboard.profesor');
        } elseif ($user->esEstudiante() || $user->hasRole('estudiante')) {
            return redirect()->route('dashboard.estudiante');
        } elseif ($user->esPadre() || $user->hasRole('padre')) {
            return redirect()->route('dashboard.padre');
        }

        // Por defecto, usar el dashboard general
        return Inertia::render('Educacion/Dashboard');
    })->name('dashboard');

    // Dashboards específicos por rol (protegidos con middleware)
    Route::get('/dashboard/director', [\App\Http\Controllers\DashboardDirectorController::class, 'index'])
        ->middleware('role:director')
        ->name('dashboard.director');

    Route::get('/dashboard/profesor', [\App\Http\Controllers\DashboardProfesorController::class, 'index'])
        ->middleware('role:profesor')
        ->name('dashboard.profesor');

    Route::get('/dashboard/estudiante', [\App\Http\Controllers\DashboardEstudianteController::class, 'index'])
        ->middleware('role:estudiante')
        ->name('dashboard.estudiante');

    Route::get('/dashboard/padre', [\App\Http\Controllers\DashboardPadreController::class, 'index'])
        ->middleware('role:padre')
        ->name('dashboard.padre');
});

// ==================== TAREAS Y TRABAJOS ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas de Tareas
    // IMPORTANTE: Rutas específicas (create) ANTES de rutas con parámetros ({tarea})

    // Index - accesible para todos
    Route::get('tareas', [\App\Http\Controllers\TareaController::class, 'index'])->name('tareas.index');

    // Create y Store - solo profesores y directores (ANTES de {tarea})
    Route::middleware('role:profesor|director')->group(function () {
        Route::get('tareas/create', [\App\Http\Controllers\TareaController::class, 'create'])->name('tareas.create');
        Route::post('tareas', [\App\Http\Controllers\TareaController::class, 'store'])->name('tareas.store');
    });

    // Show - accesible para todos (DESPUÉS de create)
    Route::get('tareas/{tarea}', [\App\Http\Controllers\TareaController::class, 'show'])->name('tareas.show');

    // Edit, Update, Destroy - solo profesores y directores
    Route::middleware('role:profesor|director')->group(function () {
        Route::get('tareas/{tarea}/edit', [\App\Http\Controllers\TareaController::class, 'edit'])->name('tareas.edit');
        Route::put('tareas/{tarea}', [\App\Http\Controllers\TareaController::class, 'update'])->name('tareas.update');
        Route::patch('tareas/{tarea}', [\App\Http\Controllers\TareaController::class, 'update']);
        Route::delete('tareas/{tarea}', [\App\Http\Controllers\TareaController::class, 'destroy'])->name('tareas.destroy');
    });

    // Rutas de Trabajos
    Route::resource('trabajos', \App\Http\Controllers\TrabajoController::class);

    // Estudiantes pueden entregar trabajos
    Route::post('tareas/{tarea}/entregar', [\App\Http\Controllers\TrabajoController::class, 'store'])
        ->middleware('role:estudiante')
        ->name('trabajos.entregar');

    // Solo profesores pueden calificar
    Route::get('trabajos/{trabajo}/calificar', [\App\Http\Controllers\TrabajoController::class, 'calificar'])
        ->middleware('role:profesor|director')
        ->name('trabajos.calificar');

    Route::get('trabajos/{trabajo}/archivo/{archivoIndex}', [\App\Http\Controllers\TrabajoController::class, 'descargarArchivo'])
        ->name('trabajos.descargar-archivo');

    // Rutas de Calificaciones (solo profesores)
    Route::resource('calificaciones', \App\Http\Controllers\CalificacionController::class)
        ->except(['create', 'edit', 'store']);

    Route::post('trabajos/{trabajo}/calificar', [\App\Http\Controllers\CalificacionController::class, 'store'])
        ->middleware('role:profesor|director')
        ->name('trabajos.calificacion.store');

    Route::get('calificaciones/exportar', [\App\Http\Controllers\CalificacionController::class, 'exportar'])
        ->middleware('role:profesor|director')
        ->name('calificaciones.exportar');

    // Rutas de Recursos (archivos adjuntos)
    // Rutas especiales primero (más específicas)
    Route::get('recursos/{recurso}/descargar', [\App\Http\Controllers\RecursoController::class, 'descargar'])
        ->name('recursos.descargar');
    Route::get('recursos/{recurso}/ver', [\App\Http\Controllers\RecursoController::class, 'ver'])
        ->name('recursos.ver');

    // Rutas CRUD de recursos (solo para profesores y directores)
    Route::resource('recursos', \App\Http\Controllers\RecursoController::class)
        ->middleware('role:profesor|director');
});

// ==================== EVALUACIONES ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas de Evaluaciones (lectura para todos, escritura solo profesores)
    Route::resource('evaluaciones', \App\Http\Controllers\EvaluacionController::class)->only(['index', 'show']);
    Route::resource('evaluaciones', \App\Http\Controllers\EvaluacionController::class)
        ->except(['index', 'show'])
        ->middleware('role:profesor|director');

    // Rutas especiales para estudiantes
    Route::get('evaluaciones/{evaluacione}/take', [\App\Http\Controllers\EvaluacionController::class, 'take'])
        ->middleware('role:estudiante')
        ->name('evaluaciones.take');

    Route::post('evaluaciones/{evaluacione}/submit', [\App\Http\Controllers\EvaluacionController::class, 'submitRespuestas'])
        ->middleware('role:estudiante')
        ->name('evaluaciones.submit');

    Route::get('evaluaciones/{evaluacione}/results', [\App\Http\Controllers\EvaluacionController::class, 'results'])
        ->middleware('role:estudiante')
        ->name('evaluaciones.results');

    // Rutas de Preguntas (solo profesores)
    Route::post('preguntas', [\App\Http\Controllers\PreguntaController::class, 'store'])
        ->middleware('role:profesor|director')
        ->name('preguntas.store');

    Route::put('preguntas/{pregunta}', [\App\Http\Controllers\PreguntaController::class, 'update'])
        ->middleware('role:profesor|director')
        ->name('preguntas.update');

    Route::delete('preguntas/{pregunta}', [\App\Http\Controllers\PreguntaController::class, 'destroy'])
        ->middleware('role:profesor|director')
        ->name('preguntas.destroy');

    Route::post('evaluaciones/{evaluacion}/preguntas/reorder', [\App\Http\Controllers\PreguntaController::class, 'reorder'])
        ->middleware('role:profesor|director')
        ->name('preguntas.reorder');
});

// ==================== MÓDULOS EDUCATIVOS Y LECCIONES ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Rutas de Módulos Educativos (lectura para todos, escritura solo profesores)
    Route::resource('modulos', \App\Http\Controllers\ModuloEducativoController::class)->only(['index', 'show']);
    Route::resource('modulos', \App\Http\Controllers\ModuloEducativoController::class)
        ->except(['index', 'show'])
        ->middleware('role:profesor|director');

    // Rutas especiales para módulos
    Route::patch('modulos/{modulo}/publicar', [\App\Http\Controllers\ModuloEducativoController::class, 'publicar'])
        ->middleware('role:profesor|director')
        ->name('modulos.publicar');

    Route::patch('modulos/{modulo}/archivar', [\App\Http\Controllers\ModuloEducativoController::class, 'archivar'])
        ->middleware('role:profesor|director')
        ->name('modulos.archivar');

    Route::post('modulos/reordenar', [\App\Http\Controllers\ModuloEducativoController::class, 'reordenar'])
        ->middleware('role:profesor|director')
        ->name('modulos.reordenar');

    Route::post('modulos/{modulo}/duplicar', [\App\Http\Controllers\ModuloEducativoController::class, 'duplicar'])
        ->middleware('role:profesor|director')
        ->name('modulos.duplicar');

    // Rutas de Lecciones (lectura para todos, escritura solo profesores)
    Route::resource('lecciones', \App\Http\Controllers\LeccionController::class)->only(['index', 'show']);
    Route::resource('lecciones', \App\Http\Controllers\LeccionController::class)
        ->except(['index', 'show'])
        ->middleware('role:profesor|director');

    // Rutas especiales para lecciones
    Route::patch('lecciones/{leccione}/publicar', [\App\Http\Controllers\LeccionController::class, 'publicar'])
        ->middleware('role:profesor|director')
        ->name('lecciones.publicar');

    Route::patch('lecciones/{leccione}/archivar', [\App\Http\Controllers\LeccionController::class, 'archivar'])
        ->middleware('role:profesor|director')
        ->name('lecciones.archivar');

    Route::post('lecciones/reordenar', [\App\Http\Controllers\LeccionController::class, 'reordenar'])
        ->middleware('role:profesor|director')
        ->name('lecciones.reordenar');

    Route::post('lecciones/{leccione}/duplicar', [\App\Http\Controllers\LeccionController::class, 'duplicar'])
        ->middleware('role:profesor|director')
        ->name('lecciones.duplicar');
});
