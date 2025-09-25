<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Ruta principal: dashboard educativo
Route::get('/', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return Inertia::render('Educacion/Dashboard');
    }
    return redirect()->route('login');
})->name('dashboard');

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
