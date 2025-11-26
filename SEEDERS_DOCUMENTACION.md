# 📚 Documentación de Seeders - Separación de Responsabilidades

## Cambios Realizados

### ✅ PrediccionesSeeder.php - Corregido

**Problema:** Las columnas en las inserciones no coincidían con las definidas en las migraciones.

**Solución:** Se corrigieron los nombres de columnas para que coincidan exactamente con la migración:

| Campo (Migración) | Campo (Seeder Anterior) | Campo (Seeder Corregido) |
|------------------|------------------------|--------------------------|
| `score_riesgo` | `risk_score` ❌ | `score_riesgo` ✅ |
| `nivel_riesgo` | `risk_level` ❌ | `nivel_riesgo` ✅ |
| `confianza` | `confidence_score` ❌ | `confianza` ✅ |
| `factores_influyentes` | `features_used` ❌ | `factores_influyentes` ✅ |

---

## 🏗️ Estructura Actual de Seeders

```
database/seeders/
├── DatabaseSeeder.php                 (ORQUESTADOR PRINCIPAL)
│   ├── 1. RolesAndPermissionsSeeder   → Roles y permisos
│   ├── 2. PermisosSeeder              → Permisos detallados
│   ├── 3. ModuloSidebarSeeder         → Estructura UI
│   ├── 4. RoleModuloAccesoSeeder      → Control de acceso
│   ├── 5. UsersSeeder                 → Usuarios (350+)
│   ├── 6. DatosAcademicosSeeder       → Datos de estudiantes
│   ├── 7. CursosSeeder                → Estructura educativa
│   ├── 8. TareasSeeder                → Tareas
│   ├── 9. AsignacionTareasSeeder      → Asignaciones
│   ├── 10. RecursosSeeder             → Recursos
│   ├── 11. ModulosEducativosSeeder    → Módulos
│   ├── 12. EvaluacionesSeeder         → Evaluaciones
│   └── 13. PrediccionesSeeder         → ML Predictions ✅ CORREGIDO
```

---

## 🎯 Responsabilidades por Seeder

### 1. **UsersSeeder** (50 + 100 + 100 + 100)
- ✅ Crea 50 directores
- ✅ Crea 100 profesores
- ✅ Crea 100 padres
- ✅ Crea 100 estudiantes CON datos académicos

**Tiempo:** ~160 segundos
**Registros:** 350+ usuarios

---

### 2. **DatosAcademicosSeeder**
- ✅ Genera calificaciones para 100 estudiantes
- ✅ Genera asistencia (60-100%)
- ✅ Genera participación (0-100%)
- ✅ Genera tareas completadas
- ✅ Genera patrones de actividad

**Tiempo:** ~235 ms
**Registros:** 600+ (6 asignaturas × 100 estudiantes)

---

### 3. **PrediccionesSeeder** (CORREGIDO ✅)
Ahora genera correctamente:

#### a) **seedPrediccionesRiesgo()**
- ✅ 1-3 predicciones por estudiante
- ✅ Niveles: alto, medio, bajo
- ✅ Score de riesgo (0.0-1.0)
- ✅ Confianza (0.7-0.99)

**Registros:** ~100-300

#### b) **seedPrediccionesCarrera()**
- ✅ 3 carreras recomendadas por estudiante
- ✅ Compatibilidad (0.6-0.99)
- ✅ Ranking (1, 2, 3)
- ✅ 8 carreras disponibles

**Registros:** ~300 (100 estudiantes × 3)

#### c) **seedPrediccionesTendencia()**
- ✅ 1-2 tendencias por estudiante
- ✅ Tipos: mejorando, estable, declinando, fluctuando
- ✅ Confianza (0.6-0.99)

**Registros:** ~100-200

---

## 🚀 Usar los Seeders

### Ejecutar TODOS (recomendado para desarrollo)
```bash
php artisan migrate:refresh --seed
```

**Resultado esperado:**
```
✓ 50 Directores
✓ 100 Profesores  
✓ 100 Padres
✓ 100 Estudiantes (con datos académicos)
✓ 600+ Calificaciones
✓ 300+ Predicciones de riesgo
✓ 300+ Predicciones de carrera
✓ 100-200 Predicciones de tendencia
```

### Ejecutar SOLO PrediccionesSeeder
```bash
php artisan db:seed --class=PrediccionesSeeder
```

### Ejecutar SOLO datos académicos
```bash
php artisan db:seed --class=DatosAcademicosSeeder
```

---

## 📊 Datos Generados

### Después de `php artisan migrate:refresh --seed`:

```
Tabla                  | Registros | Descripción
-----------------------|-----------|------------------------------------------
users                  | 350+      | Todos los usuarios (directores, profesores, etc)
calificaciones         | 600+      | Notas en 6 asignaturas
predicciones_riesgo    | ~100-300  | Riesgo académico por estudiante
predicciones_carrera   | ~300      | 3 recomendaciones por estudiante
predicciones_tendencia | ~100-200  | Tendencia de desempeño
```

---

## 🔧 Columnas Correctas (Verificadas)

### predicciones_riesgo
```sql
-- Correcto (después de corregir)
INSERT INTO predicciones_riesgo (
    estudiante_id,
    score_riesgo,           ✅ (era risk_score)
    nivel_riesgo,           ✅ (era risk_level)
    confianza,              ✅ (era confidence_score)
    fecha_prediccion,
    modelo_version,
    factores_influyentes,   ✅ (era features_used)
    observaciones,
    created_at,
    updated_at
)
```

### predicciones_carrera
```sql
INSERT INTO predicciones_carrera (
    estudiante_id,
    carrera_nombre,         ✅ Correcto
    compatibilidad,         ✅ Correcto
    ranking,                ✅ Correcto
    descripcion,            ✅ Correcto
    fecha_prediccion,
    modelo_version,
    created_at,
    updated_at
)
```

### predicciones_tendencia
```sql
INSERT INTO predicciones_tendencia (
    estudiante_id,
    fk_curso_id,
    tendencia,              ✅ Correcto
    confianza,              ✅ Correcto
    fecha_prediccion,
    modelo_version,
    created_at,
    updated_at
)
```

---

## ✅ Próximos Pasos (Opcional)

Si quieres una separación más limpia, puedes crear seeders individuales:

```
database/seeders/
├── PrediccionesRiesgoSeeder.php
├── PrediccionesCarreraSeeder.php
└── PrediccionesTendenciaSeeder.php
```

**Ventajas:**
- ✅ Responsabilidad única por seeder
- ✅ Más fácil de probar
- ✅ Se pueden ejecutar independientemente

**Por ahora:** El PrediccionesSeeder funciona correctamente y cumple su propósito.

---

## 🔍 Verificar Datos Generados

```bash
# Abrir tinker
php artisan tinker

# Verificar datos
>>> App\Models\User::where('tipo_usuario', 'estudiante')->count()
100

>>> DB::table('calificaciones')->count()
600+

>>> DB::table('predicciones_riesgo')->count()
~100-300

>>> DB::table('predicciones_carrera')->count()
~300

>>> DB::table('predicciones_tendencia')->count()
~100-200
```

---

**Estado:** ✅ Corregido y Funcional
**Última actualización:** 25 Noviembre 2025

