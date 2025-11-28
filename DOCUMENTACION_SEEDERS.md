# Documentación de Seeders - Orden de Ejecución y Dependencias

## 📋 Resumen Ejecutivo

Este documento describe el **nuevo orden correcto de seeders** implementado para resolver los problemas de coherencia entre la tabla **ModuloSidebar** y los **privilegios/permisos**.

**Status**: ✅ **IMPLEMENTADO Y VERIFICADO**

---

## 🔍 Problemas Resueltos

### Problema 1: Permisos Inconsistentes
**Síntoma**: ModuloSidebarSeeder usaba permisos que no existían en la base de datos
- `ver-estudiantes`, `gestionar-estudiantes`, `gestionar-tareas`, `ver-tareas`, etc.

**Solución**: Crear `PermisosUnificadosSeeder` que consolidar TODOS los permisos en un único lugar

### Problema 2: Role IDs Hardcodeados
**Síntoma**: RoleModuloAccesoSeeder usaba IDs fijos `[1, 2, 3, 4, 5, 6, 7]`
- Si los roles se creaban en diferente orden, los IDs no coincidían

**Solución**: Implementar búsqueda dinámica usando `Role::where('name', roleName)->first()`

### Problema 3: Orden de Ejecución Incorrecto
**Síntoma**: Los seeders no respetaban las dependencias entre ellos

**Solución**: Establecer orden correcto en `DatabaseSeeder.php`

---

## 🚀 Orden Correcto de Ejecución

### PASO 1: Sistema de Permisos y Roles

```
1. RolesAndPermissionsSeeder
   └─ Crea los 7 roles principales:
      • admin
      • director
      • profesor
      • estudiante
      • padre
      • coordinador
      • tutor
   └─ Tiempo: ~1-2 segundos

2. PermisosUnificadosSeeder (NUEVO)
   └─ Crea TODOS los permisos consolidados (100+)
   └─ Incluye permisos de:
      • Estudiantes (CRUD, ver, gestionar)
      • Profesores (CRUD, gestionar)
      • Cursos (CRUD, inscribir, asignar, ver)
      • Tareas (CRUD, calificar, entregar, asignar)
      • Calificaciones (CRUD, ver, reportes)
      • Contenido Educativo (módulos, lecciones, gestionar)
      • Evaluaciones (CRUD, tomar, calificar)
      • Trabajos (ver, entregar, calificar, revisar)
      • Recursos (CRUD, descargar, gestionar)
      • Análisis y Reportes (ver, ejecutar, recomendaciones)
      • Orientación Vocacional (tests, resultados, recomendaciones)
      • Notificaciones (ver, enviar, gestionar)
      • Administración (usuarios, roles, permisos, backup)
   └─ Tiempo: ~2-3 segundos

3. ModuloSidebarSeeder
   └─ Crea la estructura de módulos del sidebar
   └─ Define 15+ módulos con:
      • Título
      • Ruta
      • Icono
      • Orden
      • Permisos requeridos (por nombre, no por ID)
   └─ Incluye módulos como:
      • Inicio, Mi Perfil, Mis Cursos
      • Gestionar Estudiantes, Gestionar Profesores
      • Tareas, Entregas, Evaluaciones, Calificaciones
      • Contenido Educativo, Recursos
      • Reportes, Análisis de Riesgo
      • Orientación Vocacional, Mis Recomendaciones
   └─ Tiempo: ~1 segundo

4. ModuloSidebarPermisosSeeder
   └─ Asigna los permisos a cada rol según los módulos
   └─ Mapeo de:
      • Profesor → Tareas, Evaluaciones, Contenido, Recursos, etc.
      • Estudiante → Ver Tareas, Evaluaciones, Calificaciones, etc.
      • Director → Gestionar Estudiantes, Profesores, Reportes, etc.
      • Coordinador → Reportes, Tareas, Evaluaciones, etc.
   └─ Tiempo: ~1-2 segundos

5. RoleModuloAccesoSeeder
   └─ Configura la VISIBILIDAD de módulos por rol
   └─ Define qué módulos VE cada rol en el sidebar
   └─ Usa búsqueda DINÁMICA por nombre:
      ```php
      $role = Role::where('name', $roleName)->first();
      $rolesIds[] = $role->id;  // ID dinámico, no hardcodeado
      ```
   └─ Tiempo: ~1 segundo

**Total PASO 1**: ~6-9 segundos

---

### PASO 2: Administrador

```
6. Creación manual del usuario admin
   └─ Email: admin@plataforma.edu
   └─ Password: password123
   └─ Rol: admin
   └─ Permisos: TODOS
```

---

### PASO 3: Usuarios

```
7. UsersSeeder
   └─ Crea 350+ usuarios de prueba:
      • 1 Admin
      • 50 Directores
      • 100 Profesores
      • 100 Padres
      • 100 Estudiantes
   └─ Tiempo: ~5-10 segundos
```

---

### PASO 4: Datos Académicos

```
8. DatosAcademicosSeeder
   └─ Genera datos académicos coherentes para ML
   └─ Crea:
      • Relaciones Usuario ↔ Cursos
      • Relaciones Usuario ↔ Tareas
      • Datos de seguimiento
   └─ Tiempo: ~10-15 segundos
```

---

### PASO 5: Estructura Educativa

```
9. CursosSeeder
10. TareasSeeder (opcional si existe)
11. CalificacionesSeeder (opcional si existe)
12. RendimientoAcademicoSeeder (opcional si existe)

Estos seeders crean:
   • Cursos específicos
   • Tareas dentro de cursos
   • Calificaciones para estudiantes
   • Métricas de rendimiento académico

Tiempo total: ~15-20 segundos
```

---

## 📊 Matriz de Datos Creados

| Seeder | Tabla | Registros | Propósito |
|--------|-------|-----------|-----------|
| RolesAndPermissionsSeeder | roles | 7 | Define roles del sistema |
| PermisosUnificadosSeeder | permissions | 100+ | Define todos los permisos |
| ModuloSidebarSeeder | modulos_sidebar | 15+ | Define módulos del sidebar |
| RoleModuloAccesoSeeder | role_modulo_acceso | ~105 | Visibilidad módulos x rol |
| ModuloSidebarPermisosSeeder | role_has_permissions | ~150+ | Asigna permisos a roles |
| UsersSeeder | users | 350+ | Crea usuarios de prueba |
| DatosAcademicosSeeder | custom | Múltiple | Relaciones académicas |
| CursosSeeder | cursos | 20+ | Cursos disponibles |
| TareasSeeder | tareas | 100+ | Tareas para ML |
| CalificacionesSeeder | calificaciones | 1000+ | Calificaciones para ML |
| RendimientoAcademicoSeeder | rendimiento_academico | 100+ | Métricas para ML |

---

## 🔄 Dependencias Entre Seeders

```
RolesAndPermissionsSeeder (Paso 1.1)
        ↓
PermisosUnificadosSeeder (Paso 1.2)
        ↓
ModuloSidebarSeeder (Paso 1.3)
        ↓
ModuloSidebarPermisosSeeder (Paso 1.4)
        ↓
RoleModuloAccesoSeeder (Paso 1.5) ← Dinámico: usa Role::where()
        ↓
UsersSeeder (Paso 3) ← Depende de roles existentes
        ↓
DatosAcademicosSeeder (Paso 4) ← Depende de usuarios
        ↓
CursosSeeder (Paso 5) ← Depende de usuarios
        ↓
TareasSeeder (Paso 5) ← Depende de cursos
        ↓
CalificacionesSeeder (Paso 5) ← Depende de tareas
```

---

## 🛠️ Cambios Implementados

### 1. PermisosUnificadosSeeder (NUEVO)
**Archivo**: `database/seeders/PermisosUnificadosSeeder.php`

Consolida todos los permisos en un único seeder para evitar dispersión.

```php
$permisos = [
    // ESTUDIANTES
    'estudiantes.index', 'estudiantes.create', 'estudiantes.show', ...
    'ver-estudiantes', 'gestionar-estudiantes',

    // PROFESORES
    'profesores.index', 'profesores.create', ...
    'gestionar-profesores',

    // ... Todos los demás permisos
];

foreach ($permisos as $permiso) {
    Permission::findOrCreate($permiso);
}
```

### 2. RoleModuloAccesoSeeder (MODIFICADO)
**Archivo**: `database/seeders/RoleModuloAccesoSeeder.php`

Cambio de IDs hardcodeados a búsqueda dinámica:

```php
// ANTES (❌ Incorrecto - hardcodeado)
$rolesIds = [1, 2, 3, 4, 5, 6, 7];

// AHORA (✅ Correcto - dinámico)
$modulosVisibles = [
    'Inicio' => ['admin', 'director', 'profesor', ...],
    'Mi Perfil' => ['admin', 'director', ...],
];

foreach ($modulosVisibles as $moduloTitulo => $rolesNames) {
    foreach ($rolesNames as $roleName) {
        $role = Role::where('name', $roleName)->first();  // ← DINÁMICO
        if ($role) {
            $rolesIds[] = $role->id;
        }
    }
}
```

### 3. DatabaseSeeder.php (MODIFICADO)
**Archivo**: `database/seeders/DatabaseSeeder.php`

Actualización de orden de ejecución:

```php
// ANTES (❌ Incorrecto)
$this->call(RolesAndPermissionsSeeder::class);
$this->call(PermisosSeeder::class);           // ← Viejo, incompleto
$this->call(ModuloSidebarSeeder::class);
$this->call(RoleModuloAccesoSeeder::class);   // ← Falta ModuloSidebarPermisosSeeder

// AHORA (✅ Correcto)
$this->call(RolesAndPermissionsSeeder::class);
$this->call(PermisosUnificadosSeeder::class);        // ← NUEVO: Todos los permisos
$this->call(ModuloSidebarSeeder::class);
$this->call(ModuloSidebarPermisosSeeder::class);     // ← Asigna permisos
$this->call(RoleModuloAccesoSeeder::class);         // ← Configura visibilidad (dinámico)
```

---

## ✅ Cómo Restaurar la Base de Datos

### Opción 1: Script Automatizado (RECOMENDADO)

#### Windows
```bash
RESTAURAR_BD.bat
```

#### macOS/Linux
```bash
chmod +x RESTAURAR_BD.sh
./RESTAURAR_BD.sh
```

### Opción 2: Comandos Manuales

```bash
# Paso 1: Limpiar y migrar
php artisan migrate:fresh

# Paso 2: Ejecutar el seeder principal (que llamará a todos los demás)
php artisan db:seed

# Paso 3: Verificar integridad
php artisan tinker
>>> Role::with('permissions')->get()
>>> ModuloSidebar::count()
>>> DB::table('role_modulo_acceso')->count()
```

---

## 📈 Verificación Pos-Restauración

Después de ejecutar `php artisan db:seed`, verifica:

```bash
php artisan tinker

# Verificar roles
>>> Role::count()
7

# Verificar permisos
>>> Permission::count()
100+ (al menos 100)

# Verificar módulos
>>> ModuloSidebar::count()
15+

# Verificar acceso de módulos
>>> DB::table('role_modulo_acceso')->count()
105+

# Verificar usuarios
>>> User::count()
350+
```

---

## 🎯 Coherencia Garantizada

Con este nuevo orden se garantiza:

✅ **Permisos**: Todos los permisos existen antes de ser referenciados
✅ **Módulos**: Los módulos existen antes de asignar permisos
✅ **Roles**: Los roles existen antes de asignarles permisos
✅ **Dinámico**: No hay IDs hardcodeados, es seguro cambiar el orden
✅ **ML**: Los datos académicos están coherentes para entrenar modelos
✅ **Visible**: Cada rol ve exactamente los módulos para los que tiene permisos

---

## ⚠️ Notas Importantes

1. **Primer Acceso**: Cambiar la contraseña de admin@plataforma.edu inmediatamente
2. **Datos de Prueba**: Los datos generados son solo para pruebas/desarrollo
3. **Producción**: Para producción, adaptar seeders con datos reales
4. **ML**: Después de seeding, los datos están listos para entrenar modelos

---

## 📝 Historial de Cambios

| Fecha | Cambio | Status |
|-------|--------|--------|
| 2025-11-28 | Creado PermisosUnificadosSeeder | ✅ |
| 2025-11-28 | Modificado RoleModuloAccesoSeeder para uso dinámico | ✅ |
| 2025-11-28 | Actualizado DatabaseSeeder.php con nuevo orden | ✅ |
| 2025-11-28 | Creados scripts RESTAURAR_BD.sh y .bat | ✅ |
| 2025-11-28 | Documentación completada | ✅ |

---

**Generado**: 2025-11-28
**Estado**: ✅ IMPLEMENTADO Y LISTO PARA USAR
