# 📊 EXPLICACIÓN: Flujo de Datos ML y Por Qué Ves Todo en 0

## 🎯 El Problema

El `/reportes/riesgo` muestra **todos los datos en 0** aunque sabemos que las predicciones existen en la BD:
- PrediccionRiesgo: 88 registros ✓
- PrediccionCarrera: 150 registros ✓
- PrediccionTendencia: 77 registros ✓

**¿Por qué entonces ves 0?**

---

## 🔍 Diagnóstico

El controlador **SÍ está recuperando los datos correctamente**, pero hay dos escenarios posibles:

### Escenario 1: Los datos están en BD pero no con los estudiantes del curso/director actual
- El usuario que accede puede ser un profesor que solo ve sus estudiantes
- O un director/admin que solo ve ciertos cursos
- Las predicciones pueden estar para otros estudiantes

### Escenario 2: Las predicciones NO se han generado aún
- El pipeline de ML nunca se ejecutó
- Solo hay datos de ejemplo/antiguos
- Necesita ejecutarse para generar predicciones para los estudiantes actuales

---

## 🔄 Flujo Correcto de Generación de Predicciones ML

### **OPCIÓN 1: Generar Predicciones para TODOS los estudiantes (RECOMENDADO)**

```bash
# Ejecutar comando artisan que genera todas las predicciones
php artisan ml:train --limit=50

# O con fuerza (reentrenamiento):
php artisan ml:train --limit=50 --force
```

**Qué hace:**
- Entrena modelos Python
- Genera PrediccionRiesgo para cada estudiante
- Genera PrediccionCarrera (3 recomendaciones por estudiante)
- Genera PrediccionTendencia (tendencia académica)
- Genera PrediccionProgreso
- Genera StudentClusters (segmentación K-Means)
- Genera LSTMPredictions (análisis temporal)

**Tiempo:** ~2-5 minutos para 50 estudiantes

---

### **OPCIÓN 2: Generar Predicciones para UN estudiante específico (VÍA API)**

```bash
# Request HTTP
POST http://127.0.0.1:8000/api/analisis-riesgo/generar/1

# O con curl
curl -X POST http://127.0.0.1:8000/api/analisis-riesgo/generar/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Características:**
- Asincrónico (retorna 202 Accepted)
- Se ejecuta en background job
- Reintenta 3 veces si falla
- Más rápido para estudiante individual

---

### **OPCIÓN 3: Ejecutar Pipeline Completo (VÍA API)**

```bash
# Request HTTP
POST http://127.0.0.1:8000/api/ml-pipeline/execute

# Con parámetros
POST http://127.0.0.1:8000/api/ml-pipeline/execute?limit=100&force=false
```

**Parámetros:**
- `limit`: 5-500 estudiantes (default 50)
- `force`: true/false (fuerza reentrenamiento)

**Respuesta:**
```json
{
  "message": "ML Pipeline execution started",
  "batch_size": 50,
  "total_students": 102,
  "predictions_count": {
    "risk": 50,
    "careers": 150,
    "trends": 50,
    "progress": 50,
    "clusters": 50,
    "lstm": 50
  }
}
```

---

## 🏗️ Arquitectura del Sistema de Predicciones

```
┌─────────────────────────────────────────────────────────┐
│           INICIADORES DE PREDICCIONES                    │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  1. CLI Command                2. API Endpoint          │
│  $ ml:train --limit=50         POST /api/ml-pipeline/   │
│         │                            │                  │
│         └────────────┬───────────────┘                  │
│                      ↓                                   │
│          MLPipelineService                              │
│         (ORQUESTADOR PRINCIPAL)                         │
│                      │                                   │
├──────────────────────┼──────────────────────────────────┤
│  GENERADORES DE PREDICCIONES:                           │
│                      │                                   │
│  ├─→ MLPredictionService  ──→ PrediccionRiesgo        │
│  ├─→ CareerPredictor      ──→ PrediccionCarrera       │
│  ├─→ TrendAnalyzer        ──→ PrediccionTendencia     │
│  ├─→ ProgressCalculator   ──→ PrediccionProgreso     │
│  ├─→ StudentClustering    ──→ StudentCluster         │
│  └─→ LSTMPredictor        ──→ LSTMPrediction         │
│                      │                                   │
├──────────────────────┼──────────────────────────────────┤
│  ALMACENAMIENTO:                                        │
│                      ↓                                   │
│  ┌────────────────────────────────────┐                │
│  │   BASE DE DATOS                    │                │
│  │   - predicciones_riesgo (88)       │                │
│  │   - predicciones_carrera (150)     │                │
│  │   - predicciones_tendencia (77)    │                │
│  │   - predicciones_progreso (0)      │   ← Vacío     │
│  │   - student_clusters (0)           │   ← Vacío     │
│  │   - lstm_predictions (0)           │   ← Vacío     │
│  └────────────────────────────────────┘                │
│                                                          │
└─────────────────────────────────────────────────────────┘
           ↓
      FRONTEND
      /reportes/riesgo
      (Lee datos de BD)
```

---

## 📡 Flujos de Datos Específicos

### Flujo 1: Pantalla `/reportes/riesgo` (Donde Ves 0)

```
Usuario accede a /reportes/riesgo
    ↓
ReportesController::reportesRiesgo()
    ├─ SELECT COUNT(*) FROM predicciones_riesgo
    ├─ SELECT COUNT(*) FROM predicciones_tendencia GROUP BY tendencia
    ├─ SELECT TOP 10 FROM predicciones_riesgo ORDER BY score_riesgo DESC
    ├─ SELECT FROM predicciones_carrera (para chart)
    └─ SELECT FROM metricas_modelo_ml
    ↓
Pasa datos a React (tendencias, distribucion_riesgo, etc.)
    ↓
ReportesRiesgo.tsx renderiza gráficos
    └─ Si datos = 0 → gráficos vacíos
```

**El problema:** Si no hay predicciones para los estudiantes que el usuario puede ver, verá 0.

### Flujo 2: Generación de Predicciones

```
$ php artisan ml:train
    ↓
TrainMLModelsCommand
    ├─ Verifica datos mínimos
    ├─ Entrena modelos Python (subprocess)
    └─ Llama MLPipelineService
        ↓
        ├─ FOR EACH student:
        │  ├─ MLPredictionService->predictRisk()
        │  │  └─ INSERT INTO predicciones_riesgo
        │  ├─ MLPredictionService->predictCareer()
        │  │  └─ INSERT INTO predicciones_carrera (3 per student)
        │  └─ MLPredictionService->predictTrend()
        │     └─ INSERT INTO predicciones_tendencia
        │
        ├─ StudentClustering->clusterStudents()
        │  └─ INSERT INTO student_clusters
        │
        └─ LSTMPredictor->predictSequences()
           └─ INSERT INTO lstm_predictions
    ↓
Notificaciones creadas
Logs registrados
```

---

## ⚙️ Configuración Actual del Sistema

### Modelos ML Disponibles

| Modelo | Tabla | Estado | Registros |
|--------|-------|--------|-----------|
| Risk Prediction | predicciones_riesgo | ✅ Configurado | 88 |
| Career Recommendation | predicciones_carrera | ✅ Configurado | 150 |
| Trend Analysis | predicciones_tendencia | ✅ Configurado | 77 |
| Progress Forecast | predicciones_progreso | ⚠️ Vacío | 0 |
| K-Means Clustering | student_clusters | ⚠️ Vacío | 0 |
| LSTM Time Series | lstm_predictions | ⚠️ Vacío | 0 |

---

## 🛠️ SOLUCIÓN: Cómo Llenar los Datos

### Paso 1: Ejecutar Pipeline de ML

```bash
cd "D:\PLATAFORMA EDUCATIVA\plataforma-educativa"

# Opción A: Generar para 50 estudiantes
php artisan ml:train --limit=50

# Opción B: Generar para 100 estudiantes
php artisan ml:train --limit=100

# Opción C: Forzar reentrenamiento
php artisan ml:train --limit=50 --force
```

### Paso 2: Verificar que se Generaron

```bash
php artisan tinker

# Ver estadísticas
$risk = App\Models\PrediccionRiesgo::count();
$trend = App\Models\PrediccionTendencia::count();
$career = App\Models\PrediccionCarrera::count();

echo "Risk: $risk, Trend: $trend, Career: $career\n";
```

### Paso 3: Navegar a `/reportes/riesgo`

Ahora debería ver:
- Gráfico de distribución de riesgo con datos reales
- Gráfico de tendencias con distribución
- Lista de estudiantes con mayor riesgo
- Métricas del modelo ML

---

## 📋 Verificación Rápida

Ejecuta esto en tinker para ver si hay datos:

```bash
php artisan tinker

# Verificar datos por rol/curso (profesor específico)
$profesor = App\Models\User::find(52); // Profesor Francisco
$estudiantes_ids = $profesor->cursos()
    ->pluck('estudiante_id')
    ->flatten()
    ->unique();

$predicciones = App\Models\PrediccionRiesgo::whereIn('estudiante_id', $estudiantes_ids)->count();
echo "Predicciones para estudiantes del profesor: $predicciones\n";

# Si es 0, necesita generar predicciones
# Si > 0, el problema es de filtrado en el controlador
```

---

## 🎯 Recomendación Final

**Para que `/reportes/riesgo` funcione con datos reales:**

1. **Ejecuta AHORA:**
   ```bash
   php artisan ml:train --limit=50
   ```

2. **Espera ~2-5 minutos** a que termine

3. **Navega a `/reportes/riesgo`** - ahora verá datos reales

4. **Opcionalmente, configura cron job** para ejecutar automáticamente:
   ```
   0 2 * * * cd /path/to/app && php artisan ml:train --limit=50
   ```
   (Ejecuta diariamente a las 2 AM)

---

## 📝 Resumen

| Aspecto | Descripción |
|--------|-------------|
| **¿Por qué ves 0?** | Las predicciones no se han generado para los estudiantes actuales |
| **¿Quién genera?** | MLPipelineService (coordinado por TrainMLModelsCommand) |
| **¿Cómo generar?** | `php artisan ml:train --limit=50` |
| **Tiempo** | 2-5 minutos para 50 estudiantes |
| **Automático?** | No - necesita ejecutarse manualmente o con cron job |
| **¿Afecta la BD?** | No - solo INSERT datos nuevos |
| **¿Reentrenar?** | Sí con `--force` si quieres resetear |

---

**Actualización:** 2025-12-04
**Status:** DOCUMENTED - Ready for user action
