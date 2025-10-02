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

// ==================== GESTIÓN DE USUARIOS (DIRECTOR) ====================
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
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

    // Dashboards específicos por rol
    Route::get('/dashboard/director', [\App\Http\Controllers\DashboardDirectorController::class, 'index'])
        ->name('dashboard.director');

    Route::get('/dashboard/profesor', [\App\Http\Controllers\DashboardProfesorController::class, 'index'])
        ->name('dashboard.profesor');

    Route::get('/dashboard/estudiante', [\App\Http\Controllers\DashboardEstudianteController::class, 'index'])
        ->name('dashboard.estudiante');

    Route::get('/dashboard/padre', [\App\Http\Controllers\DashboardPadreController::class, 'index'])
        ->name('dashboard.padre');
});
