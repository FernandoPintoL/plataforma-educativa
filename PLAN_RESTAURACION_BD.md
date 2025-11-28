# Plan de Restauración y Reorganización de Seeders

## 🔴 Problemas Identificados

### 1. Permisos Inconsistentes
**Problema**: Los permisos usados en `ModuloSidebarSeeder` no existen en `RolesAndPermissionsSeeder`

Ejemplos de permisos que FALTAN:
- `ver-estudiantes`
- `gestionar-estudiantes`
- `gestionar-tareas` (solo existe `tareas.*`)
- `ver-tareas`
- `ver-mis-tareas`
- `gestionar-modulos`
- `ver-contenido-educativo`
- `gestionar-lecciones`
- Y muchos más...

### 2. Role IDs Hardcodeados
**Problema**: `RoleModuloAccesoSeeder` usa role_ids hardcodeados `[1, 2, 3, 4, 5, 6, 7]`

- Si los roles se crean en diferente orden, los IDs no coinciden
- No hay garantía de qué ID tiene cada rol

### 3. Orden de Ejecución
**Problema**: Los seeders no se ejecutan en el orden correcto

Dependencias:
```
RolesAndPermissionsSeeder 
  ↓
  ├─→ PermisosSeeder (debe crear TODOS los permisos)
  ├─→ ModuloSidebarSeeder (depende de permisos existentes)
  ├─→ ModuloSidebarPermisosSeeder (depende de roles y permisos)
  └─→ RoleModuloAccesoSeeder (depende de role_ids correctos)
        ↓
        UsersSeeder (depende de roles existentes)
          ↓
          DatosAcademicosSeeder
          ├─→ CursosSeeder
          ├─→ TrabajosSeeder
          ├─→ CalificacionesSeeder
          ├─→ RendimientoAcademicoSeeder
          └─→ IntentosEvaluacionSeeder
```

## ✅ Solución Implementada

### PASO 1: Consolidar Permisos
Crear archivo `PermisosUnificadosSeeder.php` que incluya:
- Todos los permisos de RolesAndPermissionsSeeder
- Todos los permisos de ModuloSidebarSeeder
- Todos los permisos de ModuloSidebarPermisosSeeder

### PASO 2: Usar Role Models en Lugar de IDs
Modificar `RoleModuloAccesoSeeder` para:
- Obtener roles por nombre en lugar de ID hardcodeado
- Crear registros din amicamente

### PASO 3: Orden Correcto en DatabaseSeeder
```php
// PASO 1: SISTEMA DE PERMISOS Y ROLES
RolesAndPermissionsSeeder     // Crea roles
PermisosUnificadosSeeder      // Crea TODOS los permisos
ModuloSidebarSeeder           // Crea módulos (solo los define, sin permisos requeridos)
ModuloSidebarPermisosSeeder   // Asigna permisos a roles basados en módulos
RoleModuloAccesoSeeder        // Configura visibilidad por rol

// PASO 2: USUARIOS
UsersSeeder                   // Crea usuarios con roles

// PASO 3: DATOS ACADÉMICOS
DatosAcademicosSeeder
CursosSeeder
TrabajosSeeder
CalificacionesSeeder
RendimientoAcademicoSeeder
IntentosEvaluacionSeeder
```

## 📋 Cambios Específicos Requeridos

### En `RolesAndPermissionsSeeder`:
- Remover la parte de permisos (lo hará PermisosUnificadosSeeder)
- Mantener solo la creación de roles
- Mantener la asignación básica de permisos a roles

### En `PermisosUnificadosSeeder` (NUEVO):
- Consolidar TODOS los permisos de la app
- Crear aquí todos los permisos, no en otros seeders

### En `ModuloSidebarSeeder`:
- REMOVER la asignación de permisos en los módulos
- Los permisos serán configurados en ModuloSidebarPermisosSeeder

### En `ModuloSidebarPermisosSeeder`:
- Asegurar que TODOS los permisos usados existan
- Mantener tal como está (es correcto)

### En `RoleModuloAccesoSeeder`:
- Reemplazar role_ids hardcodeados con búsqueda por nombre
- Hacerlo dinámico y seguro

## 📊 Matriz de Rol IDs (DINÁMICA)
```
Al ejecutar seeder, los IDs son asignados dinámicamente:
- admin: Se obtiene con Role::where('name', 'admin')->first()
- director: Se obtiene con Role::where('name', 'director')->first()
- profesor: Se obtiene con Role::where('name', 'profesor')->first()
- estudiante: Se obtiene con Role::where('name', 'estudiante')->first()
- padre: Se obtiene con Role::where('name', 'padre')->first()
- coordinador: Se obtiene con Role::where('name', 'coordinador')->first()
- tutor: Se obtiene con Role::where('name', 'tutor')->first()
```

## 🚀 Comandos para Restaurar BD

```bash
# 1. Limpiar BD
php artisan migrate:fresh

# 2. Ejecutar seeders ordenados
php artisan db:seed

# 3. Verificar integridad
php artisan tinker
  >>> Role::with('permissions')->get()
  >>> ModuloSidebar::count()
  >>> DB::table('role_modulo_acceso')->count()
```

## ✨ Beneficios de Esta Solución

1. ✅ **Permisos Coherentes**: Todos los permisos se crean antes de ser usados
2. ✅ **Roles Dinámicos**: No depende de IDs hardcodeados
3. ✅ **Mantenible**: Fácil agregar nuevos módulos y permisos
4. ✅ **Escalable**: Soporta nuevos roles sin cambiar código
5. ✅ **Auditable**: Cada paso registra qué se hizo
6. ✅ **Seguro para ML**: Todos los datos académicos se crean coherentemente

