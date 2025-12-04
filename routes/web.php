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

// API Token endpoint - must be in web.php to have proper session access
Route::middleware(['auth'])->group(function () {
    Route::get('/api/auth/token', [\App\Http\Controllers\Api\AuthTokenController::class, 'getToken'])
        ->name('api.auth.token');

    Route::post('/api/auth/token/revoke', [\App\Http\Controllers\Api\AuthTokenController::class, 'revokeToken'])
        ->name('api.auth.token.revoke');
});

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

    // Rutas de recomendaciones educativas
    Route::get('recomendaciones', function () {
        return Inertia::render('Recomendaciones/Index');
    })->name('web.recommendations.index');

    Route::get('recomendaciones/{id}', function ($id) {
        return Inertia::render('Recomendaciones/Show', ['id' => $id]);
    })->name('web.recommendations.show');
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

// ==================== EVALUACIONES (REORDENADAS) ====================
// Evaluaciones - routes for all authenticated users
Route::middleware(['auth', 'verified'])->group(function () {
    // Index - accessible for all
    Route::get('evaluaciones', [\App\Http\Controllers\EvaluacionController::class, 'index'])->name('evaluaciones.index');

    // Create - solo profesores y directores
    Route::get('evaluaciones/create', [\App\Http\Controllers\EvaluacionController::class, 'create'])
        ->middleware('role:profesor|director')
        ->name('evaluaciones.create');

    // Wizard - Creación guiada con IA - solo profesores y directores
    Route::get('evaluaciones/wizard', [\App\Http\Controllers\EvaluacionController::class, 'wizard'])
        ->middleware('role:profesor|director')
        ->name('evaluaciones.wizard');

    // Preguntas routes
    Route::post('preguntas', [\App\Http\Controllers\PreguntaController::class, 'store'])
        ->middleware('role:profesor|director')
        ->name('preguntas.store');
    Route::put('preguntas/{pregunta}', [\App\Http\Controllers\PreguntaController::class, 'update'])
        ->middleware('role:profesor|director')
        ->name('preguntas.update');
    Route::delete('preguntas/{pregunta}', [\App\Http\Controllers\PreguntaController::class, 'destroy'])
        ->middleware('role:profesor|director')
        ->name('preguntas.destroy');
});

// Evaluaciones - Specific routes with additional segments (must come before generic {evaluacion} route)
Route::middleware(['auth', 'verified', 'role:estudiante'])->group(function () {
    Route::get('evaluaciones/{evaluacion}/take', [\App\Http\Controllers\EvaluacionController::class, 'take'])->name('evaluaciones.take');
    Route::get('evaluaciones/{evaluacion}/results', [\App\Http\Controllers\EvaluacionController::class, 'results'])->name('evaluaciones.results');
    Route::get('evaluaciones/{evaluacion}/intentos/{trabajo}', [\App\Http\Controllers\EvaluacionController::class, 'verIntento'])->name('evaluaciones.intentos.ver');
    Route::post('evaluaciones/{evaluacion}/submit', [\App\Http\Controllers\EvaluacionController::class, 'submitRespuestas'])->name('evaluaciones.submit');
});

// Evaluaciones - Profesor routes
Route::middleware(['auth', 'verified', 'role:profesor|director'])->group(function () {
    Route::get('evaluaciones/{evaluacion}/edit', [\App\Http\Controllers\EvaluacionController::class, 'edit'])->name('evaluaciones.edit');
    Route::post('evaluaciones/{evaluacion}/preguntas/reorder', [\App\Http\Controllers\PreguntaController::class, 'reorder'])->name('preguntas.reorder');
    Route::post('evaluaciones', [\App\Http\Controllers\EvaluacionController::class, 'store'])->name('evaluaciones.store');
    Route::put('evaluaciones/{evaluacion}', [\App\Http\Controllers\EvaluacionController::class, 'update'])->name('evaluaciones.update');
    Route::patch('evaluaciones/{evaluacion}', [\App\Http\Controllers\EvaluacionController::class, 'update']);
    Route::delete('evaluaciones/{evaluacion}', [\App\Http\Controllers\EvaluacionController::class, 'destroy'])->name('evaluaciones.destroy');
});

// Evaluaciones - Generic show route (MUST BE LAST!)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('evaluaciones/{evaluacion}', [\App\Http\Controllers\EvaluacionController::class, 'show'])->name('evaluaciones.show');
});

// ==================== CURSOS ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Mis cursos - para estudiantes (matriculados) y profesores (que enseña)
    Route::get('mis-cursos', [\App\Http\Controllers\CursoController::class, 'misCursos'])
        ->middleware('role:profesor|estudiante')
        ->name('mis-cursos');

    // Detalle de un curso
    Route::get('cursos/{curso}', [\App\Http\Controllers\CursoController::class, 'show'])
        ->middleware('role:profesor')
        ->name('cursos.show');
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


// ==================== REPORTES EDUCATIVOS ====================
Route::middleware(['auth', 'verified', 'role:director|admin|profesor'])->group(function () {
    Route::get('reportes', [\App\Http\Controllers\ReportesController::class, 'index'])->name('reportes.index');
    Route::get('reportes/desempeno', [\App\Http\Controllers\ReportesController::class, 'desempenioPorEstudiante'])->name('reportes.desempeno');
    Route::get('reportes/cursos', [\App\Http\Controllers\ReportesController::class, 'progresoPorCurso'])->name('reportes.cursos');
    Route::get('reportes/analisis', [\App\Http\Controllers\ReportesController::class, 'analisisComparativo'])->name('reportes.analisis');
    Route::get('reportes/metricas', [\App\Http\Controllers\ReportesController::class, 'metricasInstitucionales'])->name('reportes.metricas');
    Route::get('reportes/riesgo', [\App\Http\Controllers\ReportesController::class, 'reportesRiesgo'])->name('reportes.riesgo');
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

// ==================== ORIENTACIÓN VOCACIONAL ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Listar y ver tests vocacionales (todos los usuarios)
    Route::get('tests-vocacionales', [\App\Http\Controllers\TestVocacionalController::class, 'index'])
        ->name('tests-vocacionales.index');
    Route::get('tests-vocacionales/{testVocacional}', [\App\Http\Controllers\TestVocacionalController::class, 'show'])
        ->name('tests-vocacionales.show');

    // Estudiantes pueden resolver tests
    Route::middleware('role:estudiante')->group(function () {
        Route::get('tests-vocacionales/{testVocacional}/tomar', [\App\Http\Controllers\TestVocacionalController::class, 'take'])
            ->name('tests-vocacionales.take');
        Route::post('tests-vocacionales/{testVocacional}/enviar', [\App\Http\Controllers\TestVocacionalController::class, 'submitRespuestas'])
            ->name('tests-vocacionales.submit');
        Route::get('tests-vocacionales/{testVocacional}/resultados', [\App\Http\Controllers\TestVocacionalController::class, 'resultados'])
            ->name('tests-vocacionales.resultados');

        // FASE 3: Perfil Vocacional Combinado
        Route::post('perfil-vocacional/generar', [\App\Http\Controllers\TestVocacionalController::class, 'generarPerfilCombinado'])
            ->name('perfil-vocacional.generar');
        Route::get('perfil-vocacional/obtener', [\App\Http\Controllers\TestVocacionalController::class, 'obtenerPerfilCombinado'])
            ->name('perfil-vocacional.obtener');
        Route::get('perfil-vocacional', [\App\Http\Controllers\TestVocacionalController::class, 'mostrarPerfilCombinado'])
            ->name('perfil-vocacional.mostrar');
    });

    // Profesores y directores pueden crear/editar tests
    Route::middleware('role:profesor|director')->group(function () {
        Route::get('tests-vocacionales/crear', [\App\Http\Controllers\TestVocacionalController::class, 'create'])
            ->name('tests-vocacionales.create');
        Route::post('tests-vocacionales', [\App\Http\Controllers\TestVocacionalController::class, 'store'])
            ->name('tests-vocacionales.store');
        Route::get('tests-vocacionales/{testVocacional}/editar', [\App\Http\Controllers\TestVocacionalController::class, 'edit'])
            ->name('tests-vocacionales.edit');
        Route::put('tests-vocacionales/{testVocacional}', [\App\Http\Controllers\TestVocacionalController::class, 'update'])
            ->name('tests-vocacionales.update');
        Route::patch('tests-vocacionales/{testVocacional}', [\App\Http\Controllers\TestVocacionalController::class, 'update']);
        Route::delete('tests-vocacionales/{testVocacional}', [\App\Http\Controllers\TestVocacionalController::class, 'destroy'])
            ->name('tests-vocacionales.destroy');

        // ==================== CATEGORÍAS DE TEST ====================
        Route::post('tests-vocacionales/{testVocacional}/categorias',
            [\App\Http\Controllers\CategoriaTestController::class, 'store'])
            ->name('categorias-test.store');
        Route::put('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
            [\App\Http\Controllers\CategoriaTestController::class, 'update'])
            ->name('categorias-test.update');
        Route::delete('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
            [\App\Http\Controllers\CategoriaTestController::class, 'destroy'])
            ->name('categorias-test.destroy');
        Route::post('tests-vocacionales/{testVocacional}/categorias/reorder',
            [\App\Http\Controllers\CategoriaTestController::class, 'reorder'])
            ->name('categorias-test.reorder');
        Route::get('tests-vocacionales/{testVocacional}/categorias',
            [\App\Http\Controllers\CategoriaTestController::class, 'index'])
            ->name('categorias-test.index');
        Route::get('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}',
            [\App\Http\Controllers\CategoriaTestController::class, 'show'])
            ->name('categorias-test.show');

        // ==================== PREGUNTAS DEL TEST ====================
        Route::post('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas',
            [\App\Http\Controllers\PreguntaTestController::class, 'store'])
            ->name('preguntas-test.store');
        Route::put('tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
            [\App\Http\Controllers\PreguntaTestController::class, 'update'])
            ->name('preguntas-test.update');
        Route::delete('tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
            [\App\Http\Controllers\PreguntaTestController::class, 'destroy'])
            ->name('preguntas-test.destroy');
        Route::post('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas/reorder',
            [\App\Http\Controllers\PreguntaTestController::class, 'reorder'])
            ->name('preguntas-test.reorder');
        Route::get('tests-vocacionales/{testVocacional}/categorias/{categoriaTest}/preguntas',
            [\App\Http\Controllers\PreguntaTestController::class, 'indexByCategoria'])
            ->name('preguntas-test.index-by-categoria');
        Route::get('tests-vocacionales/{testVocacional}/preguntas/{preguntaTest}',
            [\App\Http\Controllers\PreguntaTestController::class, 'show'])
            ->name('preguntas-test.show');
        Route::get('preguntas-test/tipos',
            [\App\Http\Controllers\PreguntaTestController::class, 'tipos'])
            ->name('preguntas-test.tipos');

        // ==================== RESPUESTAS DEL TEST ====================
        Route::get('tests-vocacionales/{testVocacional}/respuestas',
            [\App\Http\Controllers\RespuestaTestController::class, 'index'])
            ->name('respuestas-test.index');
        Route::get('tests-vocacionales/{testVocacional}/respuestas/{resultadoTestVocacional}',
            [\App\Http\Controllers\RespuestaTestController::class, 'show'])
            ->name('respuestas-test.show');
        Route::get('tests-vocacionales/{testVocacional}/respuestas/estadisticas',
            [\App\Http\Controllers\RespuestaTestController::class, 'estadisticas'])
            ->name('respuestas-test.estadisticas');
        Route::get('tests-vocacionales/{testVocacional}/respuestas/export',
            [\App\Http\Controllers\RespuestaTestController::class, 'export'])
            ->name('respuestas-test.export');
    });
});

// ==================== ANÁLISIS DE RIESGO ====================
Route::middleware(['auth', 'verified', 'role:director|profesor|admin'])->group(function () {
    $controller = \App\Http\Controllers\AnalisisRiesgoWebController::class;

    // Dashboard principal de Análisis de Riesgo
    Route::get('analisis-riesgo', [$controller, 'dashboard'])->name('riesgo.dashboard');

    // Análisis por curso
    Route::get('analisis-riesgo/cursos', [$controller, 'porCursos'])->name('riesgo.por-curso');

    // Análisis de tendencias
    Route::get('analisis-riesgo/tendencias', [$controller, 'tendencias'])->name('riesgo.tendencias');

    // Análisis individual por estudiante
    Route::get('analisis-riesgo/estudiante/{id}', [$controller, 'estudiante'])->name('riesgo.estudiante');
});

// ==================== ORIENTACIÓN VOCACIONAL ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Índice - accesible para todos
    Route::get('vocacional', function () {
        return Inertia::render('Vocacional/Index', [
            'perfil' => null, // Se puede expandir para traer datos reales
        ]);
    })->name('vocacional.index');

    // Ver perfil vocacional
    Route::get('vocacional/perfil', [\App\Http\Controllers\VocacionalController::class, 'perfil'])
        ->name('vocacional.perfil');

    // Ver recomendaciones
    Route::get('vocacional/recomendaciones', [\App\Http\Controllers\VocacionalController::class, 'recomendaciones'])
        ->name('vocacional.recomendaciones');
});

// ==================== NOTIFICACIONES EN TIEMPO REAL ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Centro de notificaciones (vista web)
    Route::get('notificaciones', function () {
        return Inertia::render('Notificaciones/Index');
    })->name('notificaciones.centro');
});

// ==================== MI PERFIL - ESTUDIANTE ====================
Route::middleware(['auth', 'verified', 'role:estudiante'])->group(function () {
    // Análisis de riesgo personal del estudiante
    Route::get('mi-perfil/riesgo', function () {
        return Inertia::render('MiPerfil/Riesgo');
    })->name('web.mi-perfil.riesgo');

    // Recomendaciones de carrera del estudiante
    Route::get('mi-perfil/carreras', function () {
        return Inertia::render('MiPerfil/Carreras');
    })->name('web.mi-perfil.carreras');
});

// ==================== PADRE - VISTA DE HIJOS ====================
Route::middleware(['auth', 'verified', 'role:padre'])->group(function () {
    // Análisis de riesgo de un hijo específico
    Route::get('padre/hijo/{hijoId}/riesgo', function ($hijoId) {
        return Inertia::render('Padre/HijoRiesgo', ['hijoId' => $hijoId]);
    })->name('web.padre.hijo.riesgo');

    // Recomendaciones de carrera de un hijo
    Route::get('padre/hijo/{hijoId}/carreras', function ($hijoId) {
        return Inertia::render('Padre/HijoCarreras', ['hijoId' => $hijoId]);
    })->name('web.padre.hijo.carreras');
});

// ==================== DASHBOARD DE ALERTAS EN TIEMPO REAL ====================
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard para estudiante
    Route::middleware('role:estudiante')->group(function () {
        Route::get('dashboard/alertas', [\App\Http\Controllers\DashboardAlertsController::class, 'dashboardEstudiante'])
            ->name('dashboard.alertas.estudiante');

        Route::post('dashboard/sugerencias/{sugerenciaId}/marcar-utilizada',
            [\App\Http\Controllers\DashboardAlertsController::class, 'marcarSugerenciaUtilizada'])
            ->name('dashboard.sugerencia.marcar-utilizada');

        Route::get('dashboard/alerta/{alertaId}', [\App\Http\Controllers\DashboardAlertsController::class, 'detalleAlerta'])
            ->name('dashboard.alerta.detalle');

        Route::get('dashboard/sugerencia/{sugerenciaId}', [\App\Http\Controllers\DashboardAlertsController::class, 'detalleSugerencia'])
            ->name('dashboard.sugerencia.detalle');
    });

    // Dashboard para profesor
    Route::middleware('role:profesor')->group(function () {
        Route::get('dashboard/alertas-profesor', [\App\Http\Controllers\DashboardAlertsController::class, 'dashboardProfesor'])
            ->name('dashboard.alertas.profesor');

        Route::post('dashboard/alerta/{alertaId}/intervenir',
            [\App\Http\Controllers\DashboardAlertsController::class, 'intervenirAlerta'])
            ->name('dashboard.alerta.intervenir');

        Route::post('dashboard/alerta/{alertaId}/resolver',
            [\App\Http\Controllers\DashboardAlertsController::class, 'resolverAlerta'])
            ->name('dashboard.alerta.resolver');

        Route::get('dashboard/estudiante/{estudianteId}/estadisticas',
            [\App\Http\Controllers\DashboardAlertsController::class, 'estadisticasEstudiante'])
            ->name('dashboard.estudiante.estadisticas');
    });
});
