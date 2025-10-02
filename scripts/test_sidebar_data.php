<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\ModuloSidebar;
use App\Models\User;

echo "=== TEST DE DATOS DEL SIDEBAR ===\n\n";

// Obtener el usuario Admin
$user = User::find(1);

if (! $user) {
    echo "❌ No se encontró el usuario con ID 1\n";
    exit(1);
}

echo "✓ Usuario: {$user->name} ({$user->email})\n";
echo "✓ Roles: " . implode(', ', $user->getRoleNames()->toArray()) . "\n\n";

// Obtener módulos para el sidebar
echo "=== OBTENIENDO MÓDULOS DEL SIDEBAR ===\n\n";

auth()->login($user);

$modulos = ModuloSidebar::obtenerParaSidebar($user);

echo "✓ Total de módulos principales: {$modulos->count()}\n\n";

// Mostrar cada módulo con sus submódulos
foreach ($modulos as $index => $modulo) {
    echo "Módulo #{$index}: {$modulo->titulo}\n";
    echo "  - Ruta: {$modulo->ruta}\n";
    echo "  - Icono: {$modulo->icono}\n";
    echo "  - Activo: " . ($modulo->activo ? 'Sí' : 'No') . "\n";
    echo "  - Permisos: " . json_encode($modulo->permisos) . "\n";
    echo "  - Submódulos: {$modulo->submodulos->count()}\n";

    if ($modulo->submodulos->count() > 0) {
        foreach ($modulo->submodulos as $subIndex => $sub) {
            echo "    └─ Submódulo: {$sub->titulo} ({$sub->ruta})\n";
        }
    }
    echo "\n";
}

// Convertir a formato NavItem
echo "=== FORMATO NAVITEM ===\n\n";

$navItems = $modulos->map(function ($modulo) {
    return $modulo->toNavItem();
})->values()->toArray();

echo "✓ Total de items de navegación: " . count($navItems) . "\n\n";

// Mostrar primeros 3 items en formato JSON
echo "Primeros 3 items en formato NavItem:\n";
echo json_encode(array_slice($navItems, 0, 3), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
echo "\n\n";

echo "=== TEST COMPLETADO ===\n";
