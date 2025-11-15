# ARQUITECTURA DE ROLES Y CONTROL DE ACCESO - SOLUCIÓN 2

## 📋 Resumen Ejecutivo

Se implementó una arquitectura de **3 capas** para separar responsabilidades en el control de acceso:

```
┌─────────────────────────────────────────────────────────┐
│ CAPA 3: CONTROL DE VISIBILIDAD (UI/SIDEBAR)            │
│ Tabla: role_modulo_acceso                              │
│ ¿QUIÉN VE QUÉ EN EL MENÚ?                             │
│ - Rol: director → Módulo: "Gestionar Estudiantes" ✅   │
│ - Rol: estudiante → Módulo: "Gestionar Estudiantes" ❌  │
└─────────────────────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────────────────────┐
│ CAPA 2: PERMISOS DE OPERACIONES (Spatie)               │
│ Tablas: role_has_permissions                           │
│ ¿QUÉ PUEDE HACER?                                      │
│ - $user->can('estudiantes.index') → Acceso granular    │
│ - Middleware @can protege rutas                        │
│ - Control de acciones específicas                      │
└─────────────────────────────────────────────────────────┘
              ↑
┌─────────────────────────────────────────────────────────┐
│ CAPA 1: AUTENTICACIÓN (Laravel Auth)                   │
│ Tabla: roles (Spatie)                                  │
│ ¿QUIÉN ERES?                                           │
│ - ID del usuario                                       │
│ - Roles asignados                                      │
└─────────────────────────────────────────────────────────┘
```

---

## 🔧 Cambios Implementados

### 1. Nueva Tabla: `role_modulo_acceso`

**Propósito:** Mapeo explícito de qué módulos ve cada rol

**Campos:**
```sql
CREATE TABLE role_modulo_acceso (
    id BIGINT PRIMARY KEY,
    role_id BIGINT,              -- FK a roles (Spatie)
    modulo_sidebar_id BIGINT,    -- FK a modulos_sidebar
    visible BOOLEAN DEFAULT true, -- Habilitar/deshabilitar
    descripcion TEXT NULLABLE,    -- Razón del acceso
    timestamps
);
```

**Ejemplo de datos:**
```sql
-- Director puede ver módulo "Gestionar Estudiantes"
INSERT INTO role_modulo_acceso VALUES
(1, 1, 2, true, 'Director gestiona la institución');

-- Estudiante NO tiene entrada = NO puede ver
-- (sin entrada = módulo no visible)

-- Estudiante SI puede ver módulo "Mi Perfil"
INSERT INTO role_modulo_acceso VALUES
(2, 4, 5, true, 'Estudiante accede a contenido educativo');
```

---

### 2. Nuevo Modelo: `RoleModuloAcceso`

**Ubicación:** `app/Models/RoleModuloAcceso.php`

**Responsabilidades:**
- Gestionar relaciones entre roles y módulos
- Métodos de query: `puedeVer()`, `modulosParaRol()`, `rolesParaModulo()`
- Scopes: `visibles()`, `porRol()`, `porModulo()`

**Ejemplo de uso:**
```php
// ¿Puede el rol 4 (estudiante) ver el módulo 2?
RoleModuloAcceso::puedeVer(4, 2);  // false

// Obtener módulos visibles para rol 1 (director)
RoleModuloAcceso::modulosParaRol(1);  // Collection de módulos

// Obtener roles que pueden ver módulo 5
RoleModuloAcceso::rolesParaModulo(5);  // Collection de roles
```

---

### 3. Refactorización: `ModuloSidebar`

**Cambios:**
- Nueva relación: `rolesAcceso()` → Relación con `RoleModuloAcceso`
- Nuevo método: `usuarioPuedeVerModulo(array $rolesIds)` → Revisa tabla `role_modulo_acceso`
- Método legacy: `usuarioTienePermiso()` → Ahora usa el nuevo método

**Flujo de obtención de módulos:**
```php
// En: ModuloSidebar::obtenerParaSidebar($usuario)
// 1. Obtener roles del usuario: $rolesIds = $usuario->roles()->pluck('id')
// 2. Filtrar módulos activos y principales
// 3. Para cada módulo: ¿$modulo->usuarioPuedeVerModulo($rolesIds)?
// 4. Si SÍ → Incluir en sidebar
// 5. Si NO → Excluir del sidebar
```

---

### 4. Nuevos Módulos en Sidebar

Para claridad, se crearon nuevos módulos:

| Módulo Anterior | Módulo Nuevo | Razón |
|-----------------|--------------|-------|
| "Estudiantes" | "Gestionar Estudiantes" | Claro que es administrativa |
| (no existía) | "Mi Perfil" | Estudiantes ven su perfil |
| (no existía) | "Mis Cursos" | Estudiantes ven sus cursos |

---

### 5. Seeder: `RoleModuloAccesoSeeder`

**Ubicación:** `database/seeders/RoleModuloAccesoSeeder.php`

**Configura:**
- Admin → Ve TODOS los módulos
- Director → Ve módulos de gestión y reportes
- Profesor → Ve módulos de enseñanza
- Estudiante → Solo módulos educativos (sin gestión)
- Padre → Ver progreso de hijos
- Coordinador → Gestión académica
- Tutor → Soporte educativo

---

### 6. Actualización: `RolesAndPermissionsSeeder`

**Cambios en permisos de Estudiante:**

```php
// ❌ REMOVIDOS:
- 'estudiantes.index'     // No ver listado de todos
- 'estudiantes.show'      // No ver detalles de otros
- 'estudiantes.create'    // No crear estudiantes
- 'estudiantes.edit'      // No editar otros

// ✅ MANTENIDOS:
- 'estudiantes.inscripciones'  // Ver MIS inscripciones
- 'estudiantes.historial'      // Ver MI historial
- 'tareas.entregar'            // ENTREGAR, no crear
- 'trabajos.entregar'          // ENTREGAR, no calificar
- 'recursos.descargar'         // DESCARGAR, no crear
```

---

## ✅ Validación: Consultas SQL

Para verificar que todo funciona correctamente:

### 1. Ver qué módulos ve cada rol

```sql
-- Módulos visibles para rol 'estudiante' (id=4)
SELECT
    rma.id,
    r.name AS rol,
    ms.titulo AS modulo,
    rma.visible,
    rma.descripcion
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE r.name = 'estudiante'
AND rma.visible = true
ORDER BY ms.orden;

-- RESULTADO ESPERADO:
-- ✓ Inicio
-- ✓ Mi Perfil
-- ✓ Mis Cursos
-- ✓ Tareas
-- ✓ Calificaciones
-- ✓ Evaluaciones
-- ✓ Contenido Educativo
-- ✓ Recursos
-- ✓ Entregas
-- ❌ NO: Gestionar Estudiantes
-- ❌ NO: Administración
```

### 2. Ver qué permisos tiene cada rol

```sql
-- Permisos de rol 'estudiante'
SELECT
    r.name AS rol,
    p.name AS permiso
FROM role_has_permissions rhp
JOIN roles r ON rhp.role_id = r.id
JOIN permissions p ON rhp.permission_id = p.id
WHERE r.name = 'estudiante'
ORDER BY p.name;

-- RESULTADO ESPERADO:
-- ✓ analisis.recomendaciones
-- ✓ analisis.ver
-- ✓ calificaciones.index
-- ✓ calificaciones.show
-- ✓ contenido.ver
-- ✓ cursos.horarios
-- ✓ cursos.index
-- ✓ cursos.show
-- ✓ cursos.ver
-- ✓ estudiantes.historial     ← PROPIO
-- ✓ estudiantes.inscripciones ← PROPIO
-- ❌ NO: estudiantes.index
-- ❌ NO: estudiantes.create
-- ❌ NO: trabajos.calificar
```

### 3. Verificar diferencia: Director vs Estudiante

```sql
-- Módulos que ve DIRECTOR pero NO ESTUDIANTE
SELECT
    ms.titulo,
    ms.descripcion
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
JOIN modulos_sidebar ms ON rma.modulo_sidebar_id = ms.id
WHERE r.name = 'director'
AND rma.visible = true
AND ms.id NOT IN (
    SELECT rma2.modulo_sidebar_id
    FROM role_modulo_acceso rma2
    JOIN roles r2 ON rma2.role_id = r2.id
    WHERE r2.name = 'estudiante'
    AND rma2.visible = true
)
ORDER BY ms.orden;

-- RESULTADO ESPERADO:
-- Gestionar Estudiantes
-- Gestionar Profesores
-- Administración
-- Reportes
```

### 4. Contar módulos por rol

```sql
-- Número de módulos visibles por rol
SELECT
    r.name AS rol,
    COUNT(rma.id) AS modulos_visibles
FROM role_modulo_acceso rma
JOIN roles r ON rma.role_id = r.id
WHERE rma.visible = true
GROUP BY r.name
ORDER BY modulos_visibles DESC;

-- RESULTADO ESPERADO:
-- admin      | 16+ módulos (todos)
-- director   | 11 módulos
-- profesor   |  9 módulos
-- coordinador|  8 módulos
-- estudiante |  9 módulos
-- padre      |  7 módulos
-- tutor      |  6 módulos
```

---

## 🧪 Cómo Testear

### Test 1: Loguear como Estudiante

```bash
# Email: estudiante1@paucara.test
# Password: password
# Rol: estudiante
```

**Verificar:**
- ✅ Ve módulo "Mi Perfil"
- ✅ Ve módulo "Mis Cursos"
- ✅ Ve módulo "Tareas"
- ❌ NO ve módulo "Gestionar Estudiantes"
- ❌ NO ve módulo "Administración"

### Test 2: Loguear como Director

```bash
# Email: director@paucara.test
# Password: password
# Rol: director
```

**Verificar:**
- ✅ Ve módulo "Gestionar Estudiantes"
- ✅ Ve módulo "Gestionar Profesores"
- ✅ Ve módulo "Administración"
- ✅ Ve módulo "Reportes"
- ✅ Ve módulo "Tareas"

### Test 3: Intentar acceso directo (Frontend bloqueado)

```bash
# Loguear como estudiante1@paucara.test
# Ir a /estudiantes (módulo no visible)
```

**Resultado:**
- Módulo no aparece en sidebar (bloqueado en CAPA 3)
- Si intenta acceso directo a /estudiantes:
  - Middleware verifica permisos (CAPA 2)
  - Spatie verifica 'estudiantes.index' → No tiene
  - Abort 403 Forbidden (bloqueado en CAPA 2)

---

## 📊 Matriz de Control de Acceso

| Rol | Mi Perfil | Mis Cursos | Tareas | Calificaciones | Gest. Estudiantes | Gest. Profesores | Admin | Reportes |
|-----|-----------|-----------|--------|----------------|-------------------|------------------|-------|----------|
| **Admin** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Director** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Profesor** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **Coordinador** | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ |
| **Estudiante** | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Padre** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| **Tutor** | ✅ | ❌ | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 🔐 Seguridad en Capas

### Capa 1: Autenticación
```php
// Middleware de Laravel
Route::middleware('auth')->group(function() { ... });
```
**Protege:** Usuarios no autenticados

### Capa 2: Permisos de Spatie
```php
// En rutas
Route::get('/estudiantes', [...])
    ->middleware('can:estudiantes.index');

// En controladores
if (!$user->can('estudiantes.index')) abort(403);
```
**Protege:** Usuarios sin permiso para acción específica

### Capa 3: Visibilidad de Módulos
```php
// En ModuloSidebar::obtenerParaSidebar()
$modulo->usuarioPuedeVerModulo($rolesIds)
```
**Protege:** Módulos no visibles en UI (UX limpia)

**Combinadas:** Defensa en profundidad

---

## 📁 Archivos Modificados/Creados

| Archivo | Tipo | Cambio |
|---------|------|--------|
| `database/migrations/2025_11_15_050033_create_role_modulo_acceso_table.php` | ✨ Nuevo | Migración tabla role_modulo_acceso |
| `app/Models/RoleModuloAcceso.php` | ✨ Nuevo | Modelo para control de visibilidad |
| `database/seeders/RoleModuloAccesoSeeder.php` | ✨ Nuevo | Configuración de accesos |
| `app/Models/ModuloSidebar.php` | 📝 Modificado | Refactorización para usar nueva tabla |
| `database/seeders/ModuloSidebarSeeder.php` | 📝 Modificado | Renombrar módulos, agregar "Mi Perfil", "Mis Cursos" |
| `database/seeders/RolesAndPermissionsSeeder.php` | 📝 Modificado | Limpiar permisos de estudiante |
| `database/seeders/DatabaseSeeder.php` | 📝 Modificado | Registrar RoleModuloAccesoSeeder |

---

## 🚀 Ventajas de Esta Arquitectura

| Ventaja | Beneficio |
|---------|-----------|
| **Separación de responsabilidades** | Cada capa hace una cosa bien |
| **Escalabilidad** | Fácil agregar nuevos módulos/roles |
| **Mantenibilidad** | Código claro y documentado |
| **Flexibilidad** | Cambios en tabla sin recompilación |
| **Seguridad** | Defensa en profundidad (3 capas) |
| **Performance** | Índices optimizados en role_modulo_acceso |
| **Auditoría** | Campo 'descripcion' para rastrear cambios |

---

## 🔄 Flujo Completo de Acceso

```
1. Usuario accede a /dashboard
   ↓
2. Middleware Auth verifica token/sesión
   ✓ Autenticado → continuar
   ✗ No autenticado → redirect login
   ↓
3. HandleInertiaRequests middleware ejecuta
   ↓
4. ModuloSidebar::obtenerParaSidebar() llamado
   ↓
5. Para cada módulo activo:
   ✓ $modulo->usuarioPuedeVerModulo($rolesIds)
   ✓ Revisa tabla role_modulo_acceso
   ✓ Si visible=true → Incluir en array
   ✗ Si no existe entrada → Excluir
   ↓
6. Array de módulos pasado a React via Inertia
   ↓
7. Frontend renderiza solo módulos permitidos
   ↓
8. Usuario hace clic en módulo
   ↓
9. Request a /ruta del módulo
   ↓
10. Middleware 'can:permiso' verifica Spatie
    ✓ Tiene permiso → Mostrar página
    ✗ Sin permiso → Abort 403
    ↓
11. Controlador ejecuta lógica
```

---

## 📞 Soporte y Dudas

**¿Cómo agregar un nuevo módulo?**
```php
// 1. Crear en ModuloSidebarSeeder
$nuevoModulo = ModuloSidebar::create([
    'titulo' => 'Nuevo Módulo',
    'ruta' => '/nuevo',
    // ...
]);

// 2. Asignar en RoleModuloAccesoSeeder
RoleModuloAcceso::create([
    'role_id' => $director->id,
    'modulo_sidebar_id' => $nuevoModulo->id,
    'visible' => true,
]);
```

**¿Cómo cambiar qué módulos ve un rol?**
```php
// Opción 1: Directamente en BD
UPDATE role_modulo_acceso
SET visible = false
WHERE role_id = 4 AND modulo_sidebar_id = 5;

// Opción 2: Desde código
RoleModuloAcceso::where('role_id', 4)
    ->where('modulo_sidebar_id', 5)
    ->update(['visible' => false]);
```

**¿Cómo verificar acceso en código?**
```php
// Capa 3: ¿Ve el módulo?
$modulo->usuarioPuedeVerModulo($rolesIds);

// Capa 2: ¿Puede hacer la acción?
$user->can('estudiantes.index');

// Combinado:
if ($modulo->usuarioPuedeVerModulo($rolesIds) &&
    $user->can('estudiantes.index')) {
    // Mostrar
}
```

---

**Generado:** 2025-11-15
**Arquitectura:** 3 Capas de Control de Acceso
**Estado:** ✅ Implementado y Testeado
