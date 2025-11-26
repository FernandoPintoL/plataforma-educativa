# Documentación: Seeders Mejorados para Entrenamiento de Modelos de ML

## Resumen de Cambios

Se han creado 3 nuevos seeders para generar datos coherentes y estructurados que permitan entrenar modelos de Machine Learning supervisada correctamente:

### 1. **TrabajosSeeder** (`database/seeders/TrabajosSeeder.php`)
- **Propósito**: Crea trabajos entregados por estudiantes
- **Funcionalidad**:
  - Genera 300 trabajos (aproximadamente 3 por estudiante)
  - Crea tareas genéricas si no existen
  - Datos incluyen: estado, fecha de entrega, tiempo total, intentos, consultas a material
  - 90% de trabajos entregados, 10% en progreso
  - Correlaciona con el desempeño base del estudiante

**Tabla afectada**: `trabajos`

### 2. **CalificacionesSeeder** (`database/seeders/CalificacionesSeeder.php`)
- **Propósito**: Crea calificaciones coherentes con el desempeño académico
- **Funcionalidad**:
  - Genera 261+ calificaciones (para cada trabajo entregado)
  - **Coherencia**: Las calificaciones se basan en:
    - Desempeño histórico del estudiante (40%)
    - Asistencia (20%)
    - Participación (15%)
    - Esfuerzo/tiempo invertido (10%)
    - Múltiples intentos (10%)
    - Consultas a material (5%)
  - Incluye criterios de evaluación desglosados
  - Comentarios personalizados basados en desempeño
  - Profesores aleatorios como evaluadores

**Tabla afectada**: `calificaciones`

**Rango de calificaciones**: 21.47 - 95.4 (Promedio: 56.25)

### 3. **RendimientoAcademicoSeeder** (`database/seeders/RendimientoAcademicoSeeder.php`)
- **Propósito**: Crea registros de rendimiento académico para análisis
- **Funcionalidad**:
  - Genera 100 registros de rendimiento (uno por estudiante)
  - Calificaciones por materia: Matemáticas, Lenguaje, Ciencias, Historia, Inglés, Educación Física
  - Identifica fortalezas (≥80) y debilidades (<70)
  - Determina tendencia temporal (mejorando, estable, empeorando)
  - Correlaciona con asistencia y participación

**Tabla afectada**: `rendimiento_academico`

## Flujo de Ejecución

Los seeders se ejecutan en este orden durante `php artisan migrate:fresh --seed`:

```
1. DatosAcademicosSeeder (ya existente)
   └─ Genera datos base (desempeño, asistencia, participación)

2. CursosSeeder
   └─ Crea cursos

3. TareasSeeder
   └─ Crea tareas en los cursos

4. TrabajosSeeder (NUEVO)
   └─ Genera trabajos entregados

5. CalificacionesSeeder (NUEVO)
   └─ Genera calificaciones coherentes

6. RendimientoAcademicoSeeder (NUEVO)
   └─ Genera rendimiento académico
```

## Datos Generados para ML

### Conteo de Registros
```
✓ 100 Estudiantes
✓ 300 Trabajos entregados
✓ 261 Calificaciones
✓ 100 Registros de rendimiento académico
```

### Características Disponibles para Entrenar ML

**Tabla `users` (para cada estudiante)**:
- `desempeño_promedio` (0-100)
- `asistencia_porcentaje` (0-100)
- `participacion_porcentaje` (0-100)
- `tareas_completadas` (entero)
- `tareas_pendientes` (entero)

**Tabla `calificaciones` (para cada trabajo)**:
- `puntaje` (0-100) - **VARIABLE OBJETIVO** para predicción
- `criterios_evaluacion` (JSON con desglose)
- `fecha_calificacion`

**Tabla `rendimiento_academico` (por estudiante)**:
- `materias` (JSON con calificaciones por materia)
- `promedio` (0-100)
- `fortalezas` (array)
- `debilidades` (array)
- `tendencia_temporal` (string: mejorando/estable/empeorando)

### Distribución de Calificaciones
```
A (90-100):     7 registros  (2.7%)
B (80-89):     31 registros  (11.9%)
C (70-79):     35 registros  (13.4%)
D (60-69):     28 registros  (10.7%)
F (<60):      160 registros  (61.3%)
```

> **Nota**: La distribución tiene sesgo hacia calificaciones bajas, lo cual es realista para poblaciones en riesgo académico

## Casos de Uso para ML Supervisada

Con estos datos, puedes entrenar modelos para:

### 1. **Predicción de Calificaciones**
```python
# Variables independientes:
- desempeño_promedio
- asistencia_porcentaje
- participacion_porcentaje
- tareas_completadas
- tiempo_total
- intentos

# Variable dependiente:
- calificacion.puntaje
```

### 2. **Clasificación de Riesgo de Abandono**
```python
# Features:
- desempeño_promedio < 50
- asistencia_porcentaje < 70
- tareas_completadas / tareas_totales < 0.5
- tendencia_temporal == 'empeorando'

# Target: binary (alto riesgo / bajo riesgo)
```

### 3. **Identificación de Estudiantes con Bajo Rendimiento**
```python
# Features:
- Calificaciones por materia
- Consistencia en desempeño
- Patrones de participación

# Target: 3 clases (bueno, regular, deficiente)
```

### 4. **Análisis de Tendencias**
```python
# Usar rendimiento_temporal para predecir mejora futura
# Validar coherencia entre calificaciones y desempeño
```

## Cómo Usar los Datos

### Opción 1: Ejecutar Seeders Completos
```bash
php artisan migrate:fresh --seed
```

### Opción 2: Ejecutar Solo los Nuevos Seeders
```bash
php artisan db:seed --class=TrabajosSeeder
php artisan db:seed --class=CalificacionesSeeder
php artisan db:seed --class=RendimientoAcademicoSeeder
```

### Opción 3: Verificar Datos Generados
```bash
php verificar_datos_ml.php
```

## Coherencia de Datos

Los seeders generan datos **coherentes y correlacionados**:

✅ Estudiantes con bajo desempeño → Calificaciones bajas
✅ Alta asistencia → Mejores calificaciones
✅ Participación alta → Mejor rendimiento
✅ Múltiples intentos → Mejor aprendizaje
✅ Tendencia temporal → Correlaciona con desempeño

**Ejemplo observado:**
```
Desempeño: 40 → Calificación: 49.4 ✓
Desempeño: 66 → Calificación: 64.9 ✓
Desempeño: 13 → Calificación: 35.3 ✓
```

## Exportar Datos para Python/R

### Exportar a CSV
```bash
php artisan tinker
> DB::table('calificaciones')
>   ->join('trabajos', 'calificaciones.trabajo_id', '=', 'trabajos.id')
>   ->join('users', 'trabajos.estudiante_id', '=', 'users.id')
>   ->select('calificaciones.puntaje', 'users.desempeño_promedio', 'users.asistencia_porcentaje', ...)
>   ->get()
>   ->toArray();
```

### Crear Script de Exportación
```php
// Crear archivo: export_ml_data.php
DB::table('calificaciones')
    ->join('trabajos', 'calificaciones.trabajo_id', '=', 'trabajos.id')
    ->join('users', 'trabajos.estudiante_id', '=', 'users.id')
    ->select('calificaciones.puntaje', 'users.*')
    ->cursor()
    ->map(fn($row) => [...])
    ->to_csv('ml_training_data.csv');
```

## Próximos Pasos

1. **Validar datos**: Revisar correlaciones entre variables
2. **Limpiar datos**: Remover outliers si es necesario
3. **Dividir dataset**: Train (70%), Validation (15%), Test (15%)
4. **Normalizar**: Escalar variables a rango 0-1
5. **Entrenar modelos**: Usar algoritmos de ML supervisada
6. **Validar**: Usar métricas de evaluación (accuracy, precision, recall, F1)

## Archivos Modificados/Creados

```
✓ database/seeders/TrabajosSeeder.php (NUEVO)
✓ database/seeders/CalificacionesSeeder.php (NUEVO)
✓ database/seeders/RendimientoAcademicoSeeder.php (NUEVO)
✓ database/seeders/DatabaseSeeder.php (MODIFICADO)
✓ verificar_datos_ml.php (script de verificación)
```

---

**Fecha de creación**: Noviembre 2025
**Estado**: ✅ Funcional y probado
