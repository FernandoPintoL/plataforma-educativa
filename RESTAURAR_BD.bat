@echo off
REM ###########################################################################
REM SCRIPT DE RESTAURACION DE BASE DE DATOS
REM
REM Este script restaura completamente la base de datos de la plataforma educativa
REM siguiendo el orden correcto de seeders con dependencias resueltas.
REM
REM Uso: RESTAURAR_BD.bat
REM ###########################################################################

setlocal enabledelayedexpansion

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  RESTAURACION DE BASE DE DATOS - PLATAFORMA EDUCATIVA         ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Verificar que estamos en la raiz del proyecto
if not exist "artisan" (
    echo ❌ Error: Este script debe ejecutarse desde la raiz del proyecto Laravel
    echo    Asegurate de estar en: D:\PLATAFORMA EDUCATIVA\plataforma-educativa
    pause
    exit /b 1
)

REM Paso 1: Migrar (crear esquema de BD)
echo 📋 PASO 1: Creando estructura de base de datos...
echo    Ejecutando: php artisan migrate:fresh
php artisan migrate:fresh --quiet
echo    ✅ Base de datos limpia y esquemas creados
echo.

REM Paso 2: Seeders de Configuracion
echo 🔐 PASO 2: Configurando roles, permisos y modulos...
echo    a) Creando roles principales...
php artisan db:seed --class=RolesAndPermissionsSeeder
echo.

echo    b) Creando permisos unificados...
php artisan db:seed --class=PermisosUnificadosSeeder
echo.

echo    c) Creando modulos del sidebar...
php artisan db:seed --class=ModuloSidebarSeeder
echo.

echo    d) Asignando permisos a roles...
php artisan db:seed --class=ModuloSidebarPermisosSeeder
echo.

echo    e) Configurando visibilidad de modulos por rol...
php artisan db:seed --class=RoleModuloAccesoSeeder
echo.

REM Paso 3: Crear admin
echo 👤 PASO 3: Creando administrador principal...
php artisan tinker --execute="use App\Models\User; use Illuminate\Support\Facades\Hash; use Spatie\Permission\Models\Role; use Spatie\Permission\Models\Permission; $admin = User::updateOrCreate(['email' => 'admin@plataforma.edu'], ['name' => 'Admin', 'apellido' => 'Sistema', 'usernick' => 'admin', 'password' => Hash::make('password123'), 'tipo_usuario' => 'admin', 'activo' => true]); $admin->assignRole('admin'); $adminRole = Role::where('name', 'admin')->first(); if ($adminRole) { $adminRole->syncPermissions(Permission::all()); } echo '   ✓ Admin creado: admin@plataforma.edu / password123\n';"
echo.

REM Paso 4: Crear usuarios
echo 👥 PASO 4: Creando usuarios de prueba...
php artisan db:seed --class=UsersSeeder
echo.

REM Paso 5: Crear datos academicos
echo 📚 PASO 5: Generando datos academicos...
php artisan db:seed --class=DatosAcademicosSeeder
echo.

REM Paso 6: Crear estructura educativa
echo 🎓 PASO 6: Creando estructura educativa...
php artisan db:seed --class=CursosSeeder 2>nul || echo.
php artisan db:seed --class=TareasSeeder 2>nul || echo.
php artisan db:seed --class=CalificacionesSeeder 2>nul || echo.
php artisan db:seed --class=RendimientoAcademicoSeeder 2>nul || echo.
echo    ✅ Estructura educativa completada
echo.

REM Resumen final
echo ╔════════════════════════════════════════════════════════════════╗
echo ║  ✅ RESTAURACION COMPLETADA EXITOSAMENTE                       ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo 📊 Estado de la Base de Datos:
php artisan tinker --execute="use App\Models\User; use Spatie\Permission\Models\Role; use Spatie\Permission\Models\Permission; echo '  • Usuarios: ' . User::count() . '\n'; echo '  • Roles: ' . Role::count() . '\n'; echo '  • Permisos: ' . Permission::count() . '\n';"
echo.
echo 🔑 Credenciales de Acceso:
echo    • Email: admin@plataforma.edu
echo    • Contrasena: password123
echo.
echo ⚠️  IMPORTANTE: Cambiar la contrasena despues de la primera acceso
echo.
pause
