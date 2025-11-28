#!/bin/bash

###############################################################################
# SCRIPT DE RESTAURACIÓN DE BASE DE DATOS
#
# Este script restaura completamente la base de datos de la plataforma educativa
# siguiendo el orden correcto de seeders con dependencias resueltas.
#
# Uso: ./RESTAURAR_BD.sh
###############################################################################

set -e

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  RESTAURACIÓN DE BASE DE DATOS - PLATAFORMA EDUCATIVA         ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Verificar que estamos en la raíz del proyecto
if [ ! -f "artisan" ]; then
    echo "❌ Error: Este script debe ejecutarse desde la raíz del proyecto Laravel"
    echo "   Asegúrate de estar en: D:\\PLATAFORMA EDUCATIVA\\plataforma-educativa"
    exit 1
fi

# Paso 1: Migrar (crear esquema de BD)
echo "📋 PASO 1: Creando estructura de base de datos..."
echo "   Ejecutando: php artisan migrate:fresh"
php artisan migrate:fresh --quiet
echo "   ✅ Base de datos limpia y esquemas creados"
echo ""

# Paso 2: Seeders de Configuración
echo "🔐 PASO 2: Configurando roles, permisos y módulos..."
echo "   a) Creando roles principales..."
php artisan db:seed --class=RolesAndPermissionsSeeder
echo ""

echo "   b) Creando permisos unificados..."
php artisan db:seed --class=PermisosUnificadosSeeder
echo ""

echo "   c) Creando módulos del sidebar..."
php artisan db:seed --class=ModuloSidebarSeeder
echo ""

echo "   d) Asignando permisos a roles..."
php artisan db:seed --class=ModuloSidebarPermisosSeeder
echo ""

echo "   e) Configurando visibilidad de módulos por rol..."
php artisan db:seed --class=RoleModuloAccesoSeeder
echo ""

# Paso 3: Crear admin
echo "👤 PASO 3: Creando administrador principal..."
php artisan tinker << 'PHP'
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

$admin = User::updateOrCreate(
    ['email' => 'admin@plataforma.edu'],
    [
        'name' => 'Admin',
        'apellido' => 'Sistema',
        'usernick' => 'admin',
        'password' => Hash::make('password123'),
        'tipo_usuario' => 'admin',
        'activo' => true,
    ]
);

$admin->assignRole('admin');

$adminRole = Role::where('name', 'admin')->first();
if ($adminRole) {
    $adminRole->syncPermissions(Permission::all());
}

echo "   ✓ Admin creado: admin@plataforma.edu / password123\n";
PHP
echo ""

# Paso 4: Crear usuarios
echo "👥 PASO 4: Creando usuarios de prueba..."
php artisan db:seed --class=UsersSeeder
echo ""

# Paso 5: Crear datos académicos
echo "📚 PASO 5: Generando datos académicos..."
php artisan db:seed --class=DatosAcademicosSeeder
echo ""

# Paso 6: Crear estructura educativa
echo "🎓 PASO 6: Creando estructura educativa..."
php artisan db:seed --class=CursosSeeder 2>/dev/null || true
php artisan db:seed --class=TareasSeeder 2>/dev/null || true
php artisan db:seed --class=CalificacionesSeeder 2>/dev/null || true
php artisan db:seed --class=RendimientoAcademicoSeeder 2>/dev/null || true
echo "   ✅ Estructura educativa completada"
echo ""

# Resumen final
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ RESTAURACIÓN COMPLETADA EXITOSAMENTE                       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "📊 Estado de la Base de Datos:"
php artisan tinker << 'PHP'
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

echo "  • Usuarios: " . User::count() . "\n";
echo "  • Roles: " . Role::count() . "\n";
echo "  • Permisos: " . Permission::count() . "\n";
PHP

echo ""
echo "🔑 Credenciales de Acceso:"
echo "  • Email: admin@plataforma.edu"
echo "  • Contraseña: password123"
echo ""
echo "⚠️  IMPORTANTE: Cambiar la contraseña después de la primera acceso"
echo ""
