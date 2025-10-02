<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "Registrando permiso asignaciones.index...\n";

// Registrar el permiso faltante
$permiso = \App\Models\PermisosRegistrador::registrarPermiso(
    'asignaciones.index',
    'Ver listado de asignaciones de cursos'
);

echo "Permiso '{$permiso->name}' registrado correctamente.\n";

// Asignar el permiso a los roles que lo necesitan
$director = \Spatie\Permission\Models\Role::findByName('director');
$director->givePermissionTo($permiso);

echo "Permiso asignado al rol 'director'.\n";

echo "\n¡Permisos adicionales registrados correctamente!\n";
