# Guía Rápida - Restauración de Base de Datos

## 🚀 Restaurar Base de Datos (En 1 Comando)

```bash
# Windows
RESTAURAR_BD.bat

# Linux/macOS
./RESTAURAR_BD.sh
```

---

## 📋 O Hacerlo Paso a Paso

```bash
# 1. Limpiar y crear esquema
php artisan migrate:fresh

# 2. Cargar todos los datos
php artisan db:seed

# ¡Listo! Base de datos restaurada
```

---

## 🔑 Credenciales de Acceso

```
Email:     admin@plataforma.edu
Password:  password123
```

---

## ✅ Verificación Rápida

```bash
# Abrir tinker
php artisan tinker

# Contar datos
>>> User::count()           # Debería ser 350+
>>> Role::count()           # Debería ser 7
>>> Permission::count()     # Debería ser 100+
>>> ModuloSidebar::count()  # Debería ser 15+
>>> DB::table('role_modulo_acceso')->count()  # Debería ser 105+
```

---

## 🎯 Verificación Específica - Coherencia de Permisos

```bash
php artisan tinker

# Verificar que TODOS los roles tienen permisos asignados
>>> Role::with('permissions')->get()

# Verificar que hay módulos visibles para cada rol
>>> DB::table('role_modulo_acceso')->groupBy('role_id')->get()

# Verificar que un profesor específico puede ver las tareas
>>> $profesor = Role::where('name', 'profesor')->first()
>>> $profesor->hasPermissionTo('tareas.index')  # Debería ser true
```

---

## 🚨 Problemas Comunes

### Error: "Seeder no encontrado"
→ El seeder existe, asegúrate de estar en la carpeta correcta:
```bash
cd "D:\PLATAFORMA EDUCATIVA\plataforma-educativa"
php artisan db:seed
```

### Error: "Base de datos no existe"
→ Ejecuta primero las migraciones:
```bash
php artisan migrate:fresh
```

### Los módulos no aparecen en el sidebar
→ Verifica que ModuloSidebarSeeder haya ejecutado:
```bash
php artisan tinker
>>> ModuloSidebar::count()
```

---

## 🔄 Diagrama de Ejecución

```
php artisan db:seed
    ↓
DatabaseSeeder.php
    ↓
1. RolesAndPermissionsSeeder      (Crea 7 roles)
    ↓
2. PermisosUnificadosSeeder       (Crea 100+ permisos)
    ↓
3. ModuloSidebarSeeder            (Crea 15+ módulos)
    ↓
4. ModuloSidebarPermisosSeeder    (Asigna permisos a roles)
    ↓
5. RoleModuloAccesoSeeder         (Configura visibilidad dinámicamente)
    ↓
6. UsersSeeder                    (Crea 350+ usuarios)
    ↓
7. DatosAcademicosSeeder          (Datos para ML)
    ↓
✅ Base de datos lista
```

---

## 📊 Cambios Principales

### ✨ PermisosUnificadosSeeder (NUEVO)
Consolida TODOS los permisos en un único lugar en lugar de dispersos.

### 🔄 RoleModuloAccesoSeeder (ACTUALIZADO)
Ahora usa búsqueda dinámica por nombre en lugar de IDs hardcodeados:
```php
// Antes: $rolesIds = [1, 2, 3, 4, 5, 6, 7];  ❌
// Ahora: Role::where('name', $roleName)->first()  ✅
```

### 📋 DatabaseSeeder.php (REORDENADO)
Nuevo orden que respeta todas las dependencias:
1. RolesAndPermissionsSeeder
2. **PermisosUnificadosSeeder** ← NUEVO
3. ModuloSidebarSeeder
4. **ModuloSidebarPermisosSeeder** ← AGREGADO
5. RoleModuloAccesoSeeder (ahora dinámico)

---

## 💡 Para Entrenar los Modelos ML

Después de `php artisan db:seed`, los datos están listos:

```bash
cd supervisado
python training/train_all_models.py
```

Los datos de:
- Calificaciones
- Trabajos
- Rendimiento académico
- Intentos de evaluación

...están coherentemente relacionados y listos para ML.

---

## 📚 Documentación Completa

Ver: `DOCUMENTACION_SEEDERS.md` para información detallada

---

**Última actualización**: 2025-11-28
