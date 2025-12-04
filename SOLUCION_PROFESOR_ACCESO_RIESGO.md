# ✅ SOLUCIÓN: Error 403 Profesor en /mi-perfil/riesgo

## 🔍 Problema Identificado

Cuando un profesor (ej: `profesor1@plataforma.edu`) intenta acceder a `/mi-perfil/riesgo`, recibe error **403 Forbidden**:

```
GET http://127.0.0.1:8000/mi-perfil/riesgo 403 (Forbidden)
```

**Causa:** La ruta y el controlador estaban restringidos solo a estudiantes.

---

## 📊 Puntos de Restricción Encontrados

### 1. Web Route (routes/web.php línea 464) ❌
```php
Route::middleware(['auth', 'verified', 'role:estudiante'])->group(function () {
    Route::get('mi-perfil/riesgo', function () {
        return Inertia::render('MiPerfil/Riesgo');
    })->name('web.mi-perfil.riesgo');
```
**Problema:** Middleware `role:estudiante` rechaza profesores

### 2. API Route (routes/api.php línea 573-574) ❌
```php
Route::get('riesgo', [MiPerfilController::class, 'getRiesgo'])
    ->middleware('role:estudiante')
    ->name('riesgo');
```
**Problema:** Middleware `role:estudiante` rechaza profesores

### 3. Controlador (app/Http/Controllers/Api/MiPerfilController.php línea 25) ❌
```php
if (!$user || $user->tipo_usuario !== 'estudiante') {
    return response()->json(['message' => 'No autorizado'], 403);
}
```
**Problema:** Validación interna rechaza profesores

---

## ✅ Solución Implementada

### 1. Actualizar Web Route (routes/web.php línea 463-474)

**Antes:**
```php
Route::middleware(['auth', 'verified', 'role:estudiante'])->group(function () {
```

**Después:**
```php
Route::middleware(['auth', 'verified', 'role:estudiante|profesor'])->group(function () {
    // Análisis de riesgo personal del estudiante/profesor
    Route::get('mi-perfil/riesgo', function () {
        return Inertia::render('MiPerfil/Riesgo');
    })->name('web.mi-perfil.riesgo');

    // Recomendaciones de carrera del estudiante/profesor
    Route::get('mi-perfil/carreras', function () {
        return Inertia::render('MiPerfil/Carreras');
    })->name('web.mi-perfil.carreras');
});
```

**Cambio:** `role:estudiante` → `role:estudiante|profesor`

### 2. Actualizar API Routes (routes/api.php línea 571-580)

**Antes:**
```php
Route::get('riesgo', [MiPerfilController::class, 'getRiesgo'])
    ->middleware('role:estudiante')
    ->name('riesgo');

Route::get('carreras', [MiPerfilController::class, 'getCarreras'])
    ->middleware('role:estudiante')
    ->name('carreras');
```

**Después:**
```php
Route::get('riesgo', [MiPerfilController::class, 'getRiesgo'])
    ->middleware('role:estudiante|profesor')
    ->name('riesgo');

Route::get('carreras', [MiPerfilController::class, 'getCarreras'])
    ->middleware('role:estudiante|profesor')
    ->name('carreras');
```

**Cambio:** `role:estudiante` → `role:estudiante|profesor` (x2)

### 3. Actualizar Controlador (app/Http/Controllers/Api/MiPerfilController.php)

#### Método getRiesgo() - línea 25
**Antes:**
```php
if (!$user || $user->tipo_usuario !== 'estudiante') {
    return response()->json(['message' => 'No autorizado'], 403);
}
```

**Después:**
```php
// Verificar que sea estudiante o profesor
if (!$user || !in_array($user->tipo_usuario, ['estudiante', 'profesor'])) {
    return response()->json(['message' => 'No autorizado'], 403);
}
```

#### Método getCarreras() - línea 104
**Antes:**
```php
if (!$user || $user->tipo_usuario !== 'estudiante') {
    return response()->json(['message' => 'No autorizado'], 403);
}
```

**Después:**
```php
if (!$user || !in_array($user->tipo_usuario, ['estudiante', 'profesor'])) {
    return response()->json(['message' => 'No autorizado'], 403);
}
```

**Cambio:** Validación estricta → Validación con array (permite ambos roles)

---

## 📋 Cambios por Archivo

| Archivo | Cambios | Líneas |
|---------|---------|--------|
| routes/web.php | ✅ Middleware: `role:estudiante` → `role:estudiante\|profesor` | 463-474 |
| routes/api.php | ✅ Middleware (x2): `role:estudiante` → `role:estudiante\|profesor` | 573-580 |
| app/Http/Controllers/Api/MiPerfilController.php | ✅ Validaciones (x2): Comparación estricta → array check | 25, 104 |

---

## 🎯 Flujo Después del Fix

```
1. Profesor (profesor1@plataforma.edu) accede a /mi-perfil/riesgo
   ↓
2. Web route middleware: role:estudiante|profesor ✅ PERMITE
   ↓
3. Component renderiza: MiPerfil/Riesgo
   ↓
4. Component hace API call: GET /api/mi-perfil/riesgo
   ↓
5. API middleware: role:estudiante|profesor ✅ PERMITE
   ↓
6. MiPerfilController::getRiesgo()
   ↓
7. Validación interna: !in_array(profesor, [...]) ✅ PERMITE
   ↓
8. Busca PrediccionRiesgo donde estudiante_id = profesor.id
   ↓
9. Si existe: Retorna datos de riesgo
   Si no existe: Retorna "No hay predicción disponible"
```

---

## 🔐 Acceso Ahora Permitido

### Estudiantes ✅
- Pueden ver `/mi-perfil/riesgo`
- Pueden ver `/mi-perfil/carreras`
- API devuelve sus predicciones propias

### Profesores ✅
- Pueden ver `/mi-perfil/riesgo` (NUEVO)
- Pueden ver `/mi-perfil/carreras` (NUEVO)
- API busca predicciones si existen para el profesor
- Si no hay predicciones, muestra mensaje informativo

### Otros Roles ❌
- Padre: Acceso bloqueado (ruta separada: `/padre/hijo/...`)
- Admin/Director: Acceso bloqueado (deben usar `/analisis-riesgo`)
- Sin autenticación: Acceso bloqueado (middleware `auth`)

---

## 🧪 Verificación

### Paso 1: Login como profesor
```
Usuario: profesor1@plataforma.edu
Contraseña: [tu contraseña]
```

### Paso 2: Navega a /mi-perfil/riesgo
```
http://127.0.0.1:8000/mi-perfil/riesgo
```

### Paso 3: Verifica que carga
- ✅ No error 403
- ✅ Se carga el componente
- ✅ Muestra datos si existen, o mensaje "No hay predicción disponible"

### Paso 4: Navega a /mi-perfil/carreras
```
http://127.0.0.1:8000/mi-perfil/carreras
```

### Paso 5: Verifica que funciona
- ✅ No error 403
- ✅ Se carga el componente
- ✅ Muestra recomendaciones si existen

---

## 💡 Notas Técnicas

### Búsqueda de Predicciones
Ambos métodos buscan predicciones por `estudiante_id`:
```php
$prediccionRiesgo = PrediccionRiesgo::where('estudiante_id', $user->id)
    ->orderBy('fecha_prediccion', 'desc')
    ->first();
```

Esto funciona porque:
- **Estudiantes**: tienen `user.id` que coincide con `prediccion_riesgo.estudiante_id`
- **Profesores**: si el sistema genera predicciones para ellos, tendrán `user.id` que coincide

Si NO hay predicciones para un profesor, el método retorna:
```json
{
    "success": false,
    "message": "No hay predicción de riesgo disponible aún..."
}
```

### API Response Format
```json
{
    "success": true|false,
    "student_id": 123,
    "risk_score": 0.95,
    "risk_level": "alto",
    "confidence": 0.75,
    "trend": "estable",
    "trend_data": {...},
    "recent_grades": [...],
    "factors": [...],
    "recommendations": [...]
}
```

---

## 📊 Resumen

| Aspecto | Antes | Después |
|--------|-------|---------|
| **Profesor accede a /mi-perfil/riesgo** | ❌ Error 403 | ✅ Funciona |
| **Profesor accede a /mi-perfil/carreras** | ❌ Error 403 | ✅ Funciona |
| **Web middleware** | `role:estudiante` | `role:estudiante\|profesor` |
| **API middleware** | `role:estudiante` | `role:estudiante\|profesor` |
| **Controlador** | Validación estricta | Validación flexible |
| **Build** | ✅ Sin errores | ✅ Sin errores |

---

**Status:** ✅ COMPLETADO
**Fecha:** 04/12/2025
**Cambios:** 3 archivos modificados
**Líneas cambiadas:** 6 (2 en routes, 2 en API, 2 en controlador)
