<?php
require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

// Verificar roles existentes
$roles = \Spatie\Permission\Models\Role::all();
echo "Roles disponibles:\n";
foreach ($roles as $role) {
    echo "- {$role->name}\n";
}

// Obtener usuarios
$users = \App\Models\User::all();
echo "\nUsuarios existentes:\n";
foreach ($users as $user) {
    echo "ID: {$user->id}, Nombre: {$user->name}, Email: {$user->email}, Tipo: {$user->tipo_usuario}\n";
    echo "  Roles asignados: " . implode(', ', $user->getRoleNames()->toArray()) . "\n";
}

// Asignar roles a usuarios según su tipo
echo "\nAsignando roles a usuarios según su tipo...\n";
foreach ($users as $user) {
    // Asignar el rol correspondiente según el tipo de usuario
    if ($user->tipo_usuario && ! $user->hasRole($user->tipo_usuario)) {
        $user->assignRole($user->tipo_usuario);
        echo "Usuario {$user->id} ({$user->name}): asignado rol '{$user->tipo_usuario}'\n";
    } else if ($user->hasRole($user->tipo_usuario)) {
        echo "Usuario {$user->id} ({$user->name}): ya tiene el rol '{$user->tipo_usuario}'\n";
    } else {
        echo "Usuario {$user->id} ({$user->name}): tipo de usuario no establecido\n";
    }
}

// Verificar módulos del sidebar
$modulos = \App\Models\ModuloSidebar::all();
echo "\nMódulos del sidebar:\n";
foreach ($modulos as $modulo) {
    echo "ID: {$modulo->id}, Título: {$modulo->titulo}, Ruta: {$modulo->ruta}\n";
    echo "  Permisos requeridos: " . ($modulo->permisos ? implode(', ', $modulo->permisos) : 'Ninguno') . "\n";

    // Verificar si los permisos existen
    if ($modulo->permisos) {
        foreach ($modulo->permisos as $permiso) {
            $exists = \Spatie\Permission\Models\Permission::where('name', $permiso)->exists();
            echo "    - {$permiso}: " . ($exists ? 'Existe' : 'NO EXISTE') . "\n";
        }
    }
}

// Verificar permisos por usuario
echo "\nVerificando qué módulos puede ver cada usuario:\n";
foreach ($users as $user) {
    echo "Usuario {$user->id} ({$user->name}) tipo: {$user->tipo_usuario}:\n";

    // Obtener módulos del sidebar filtrados por permisos
    $modulosParaUsuario = \App\Models\ModuloSidebar::obtenerParaSidebar();

    if ($modulosParaUsuario->isEmpty()) {
        echo "  No puede ver ningún módulo\n";
    } else {
        foreach ($modulosParaUsuario as $modulo) {
            echo "  - {$modulo->titulo} ({$modulo->ruta})\n";
        }
    }
}

echo "\n¡Finalizado!\n";
