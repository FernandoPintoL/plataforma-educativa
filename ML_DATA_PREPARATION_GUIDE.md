# Guía de Preparación de Datos ML para Test RIASEC

## 📋 Introducción

Esta guía explica cómo acceder y usar los datasets preparados para entrenar modelos de Machine Learning basados en los perfiles vocacionales RIASEC de los estudiantes.

**Versión:** 1.0
**Fecha:** 2025-11-29
**Framework:** Laravel 11, Python (para ML)

---

## 🎯 Objetivo

El sistema prepara dos tipos de datasets:

1. **Supervisado:** Mapea perfiles RIASEC → Carrera recomendada (Classification)
2. **No Supervisado:** Agrupa estudiantes por similitud de perfiles (Clustering)

---

## 📊 Descripción del Dataset Base

### Dimensiones RIASEC Extraídas

```
R (Realista):      Rango 0-100
I (Investigador):  Rango 0-100
A (Artístico):     Rango 0-100
S (Social):        Rango 0-100
E (Empresarial):   Rango 0-100
C (Convencional):  Rango 0-100
```

### Características del Dataset Actual

```
Total de Estudiantes:  220
Total de Respuestas:   13,200 (220 × 60 preguntas)
Escala de Respuesta:   1-5 (Likert)
Normalización:         (valor - 1) / 4 × 100 → [0, 100]
Carreras Mapeadas:     30+ carreras RIASEC validadas
```

---

## 🔌 API Endpoints para Datos ML

### 1. Obtener Scores RIASEC Brutos

```bash
GET /api/ml-data/test/{testId}/riasec-scores
```

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "student_id": 1,
      "student_name": "Juan Pérez",
      "R": 75.3,
      "I": 82.1,
      "A": 45.2,
      "S": 88.5,
      "E": 62.3,
      "C": 58.9
    },
    ...
  ],
  "total_students": 220
}
```

---

### 2. Obtener Dataset Supervisado (Classification)

```bash
GET /api/ml-data/test/{testId}/supervised-dataset
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "dataset": [
      {
        "student_id": 1,
        "R": 75.3,
        "I": 82.1,
        "A": 45.2,
        "S": 88.5,
        "E": 62.3,
        "C": 58.9,
        "carrera_id": 12,
        "carrera_nombre": "Enfermería",
        "compatibilidad": 0.8451
      },
      ...
    ],
    "metadata": {
      "total_samples": 198,
      "total_features": 6,
      "target_classes": 30
    },
    "train_split": 0.8,
    "test_split": 0.2,
    "description": "RIASEC scores mapped to careers for supervised learning (classification)"
  },
  "samples_count": 198
}
```

**Interpretación:**
- `student_id`: ID único del estudiante
- `R, I, A, S, E, C`: Scores normalizados RIASEC (0-100)
- `carrera_id`: ID de carrera recomendada
- `carrera_nombre`: Nombre de la carrera
- `compatibilidad`: Score de compatibilidad (0-1)

---

### 3. Obtener Dataset No Supervisado (Clustering)

```bash
GET /api/ml-data/test/{testId}/unsupervised-dataset
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "dataset": [
      {
        "student_id": 1,
        "student_name": "Juan Pérez",
        "R": 75.3,
        "I": 82.1,
        "A": 45.2,
        "S": 88.5,
        "E": 62.3,
        "C": 58.9
      },
      ...
    ],
    "metadata": {
      "total_samples": 220,
      "total_features": 6,
      "recommended_clusters": 5
    },
    "description": "RIASEC scores for clustering analysis (K-Means, DBSCAN)"
  },
  "samples_count": 220
}
```

---

### 4. Descargar Dataset como CSV

**Supervisado:**
```bash
GET /api/ml-data/test/{testId}/export/supervised
```

**Descargar CSV:**
```bash
curl -H "Authorization: Bearer {TOKEN}" \
  "http://localhost:8000/api/ml-data/test/2/export/supervised" \
  -o riasec_supervised.csv
```

**No Supervisado:**
```bash
GET /api/ml-data/test/{testId}/export/unsupervised
```

---

### 5. Obtener Estadísticas del Dataset

```bash
GET /api/ml-data/test/{testId}/supervised-dataset/statistics
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "total_records": 198,
    "features": 6,
    "dimension_statistics": {
      "R": {"mean": 72.45, "min": 25.0, "max": 100.0, "std_dev": 18.32},
      "I": {"mean": 78.92, "min": 32.1, "max": 100.0, "std_dev": 15.67},
      "A": {"mean": 55.34, "min": 10.2, "max": 98.5, "std_dev": 21.45},
      "S": {"mean": 81.23, "min": 35.6, "max": 100.0, "std_dev": 14.23},
      "E": {"mean": 68.12, "min": 20.1, "max": 99.0, "std_dev": 19.87},
      "C": {"mean": 62.45, "min": 15.0, "max": 100.0, "std_dev": 17.56}
    }
  }
}
```

---

### 6. Importancia de Features

```bash
GET /api/ml-data/test/{testId}/feature-importance
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "feature_importance": [
      {"dimension": "I", "variance": 245.78, "std_dev": 15.67},
      {"dimension": "E", "variance": 395.22, "std_dev": 19.87},
      {"dimension": "R", "variance": 335.62, "std_dev": 18.32},
      ...
    ],
    "description": "Variance-based feature importance for RIASEC dimensions"
  }
}
```

---

### 7. Crear Train/Test Split

```bash
POST /api/ml-data/test/{testId}/train-test-split
Content-Type: application/json

{
  "train_ratio": 0.8
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "train_samples": 158,
    "test_samples": 40,
    "train_ratio": 0.8,
    "test_ratio": 0.2,
    "note": "Use train_samples for training your ML model, test_samples for evaluation"
  }
}
```

---

### 8. Resumen Completo de ML Data

```bash
GET /api/ml-data/test/{testId}/summary
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "supervised_learning": {
      "total_samples": 198,
      "features": 6,
      "target_classes": 30,
      "use_case": "Career prediction (classification)",
      "recommended_algorithm": "Random Forest, SVM, or Neural Networks"
    },
    "unsupervised_learning": {
      "total_samples": 220,
      "features": 6,
      "recommended_clusters": 5,
      "use_case": "Vocational profile clustering",
      "recommended_algorithm": "K-Means (k=5) or DBSCAN"
    },
    "feature_statistics": { ... },
    "feature_importance": [ ... ],
    "download_endpoints": {
      "supervised_csv": "/api/ml-data/test/2/export/supervised",
      "unsupervised_csv": "/api/ml-data/test/2/export/unsupervised"
    }
  }
}
```

---

## 🚀 Implementación de Modelos ML

### Flujo Típico

```
1. Descargar Dataset
   GET /api/ml-data/test/2/export/{supervisado|no_supervisado}

2. Cargar en Python
   pandas.read_csv('riasec_dataset.csv')

3. Dividir Train/Test
   POST /api/ml-data/test/2/train-test-split

4. Entrenar Modelo
   python train_model.py --dataset riasec_supervisado.csv

5. Evaluar Modelo
   python evaluate_model.py --model model.pkl --test_set test.csv

6. Integrar Predicciones
   POST /api/vocacional/predict
```

---

## 🎓 Implementaciones Recomendadas

### Supervisado: Predicción de Carrera (Classification)

**Algoritmos Recomendados:**
1. **Random Forest** (Mejor balance)
2. **SVM** (Buena precisión)
3. **Neural Networks** (Mayor complejidad)
4. **Gradient Boosting** (XGBoost/LightGBM)

**Pseudo-código Python:**

```python
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

# 1. Cargar datos
df = pd.read_csv('riasec_supervised.csv')

# 2. Separar features y target
X = df[['R', 'I', 'A', 'S', 'E', 'C']]
y = df['carrera_nombre']

# 3. Train/test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# 4. Entrenar modelo
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 5. Evaluar
predictions = model.predict(X_test)
accuracy = accuracy_score(y_test, predictions)
print(f"Accuracy: {accuracy:.4f}")
print(classification_report(y_test, predictions))

# 6. Guardar modelo
import pickle
pickle.dump(model, open('carrera_model.pkl', 'wb'))
```

---

### No Supervisado: Clustering de Perfiles

**Algoritmos Recomendados:**
1. **K-Means** (k=5, rápido)
2. **DBSCAN** (automático de clusters)
3. **Hierarchical Clustering** (dendogramas)

**Pseudo-código Python:**

```python
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt

# 1. Cargar datos
df = pd.read_csv('riasec_unsupervised.csv')

# 2. Extraer features
X = df[['R', 'I', 'A', 'S', 'E', 'C']]

# 3. Normalizar (importante!)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# 4. K-Means con k=5
kmeans = KMeans(n_clusters=5, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_scaled)

# 5. Añadir clusters al dataset
df['cluster'] = clusters

# 6. Análisis de clusters
for i in range(5):
    cluster_df = df[df['cluster'] == i]
    print(f"\nCluster {i}: {len(cluster_df)} estudiantes")
    print(cluster_df[['R', 'I', 'A', 'S', 'E', 'C']].mean())

# 7. Visualizar (reducir a 2D con PCA)
from sklearn.decomposition import PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)
plt.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap='viridis')
plt.savefig('clusters.png')
```

---

## 📈 Interpretación de Resultados

### Carreras Mapeadas con Perfiles RIASEC

```
Perfil RIASEC Ideal por Carrera (Escala 1-5)
════════════════════════════════════════════════════════════════

Ingeniería en Sistemas
  R: 4.2 | I: 4.3 | A: 2.1 | S: 2.0 | E: 2.5 | C: 3.8 ✓
  → "Tipo: Técnico Analítico"
  → Combina habilidades técnicas + investigación

Enfermería
  R: 3.0 | I: 3.3 | A: 2.0 | S: 4.6 | E: 2.0 | C: 3.8 ✓
  → "Tipo: Cuidador Social"
  → Enfoque en personas + precisión

Administración de Empresas
  R: 2.5 | I: 2.8 | A: 1.9 | S: 3.8 | E: 4.5 | C: 3.8 ✓
  → "Tipo: Líder Organizador"
  → Liderazgo + estructura

Diseño Gráfico
  R: 2.3 | I: 2.8 | A: 4.5 | S: 3.2 | E: 3.0 | C: 2.8 ✓
  → "Tipo: Creativo Técnico"
  → Arte + solución de problemas
```

---

## 🔒 Seguridad y Privacidad

- ✅ **Autenticación:** Requiere login con `auth:sanctum`
- ✅ **Autorización:** Solo `profesor|admin` pueden acceder
- ✅ **Encriptación:** Datos normalizados (sin información sensible personal)
- ✅ **GDPR Ready:** Cumplen con privacidad de datos educativos

---

## 📁 Archivos Generados

```
Backend (PHP/Laravel):
├── app/Services/RiasecMLDataPreparationService.php
├── app/Http/Controllers/Api/RiasecMLDataController.php
├── database/seeders/CarrerasRiasecProfileSeeder.php
└── routes/api.php (actualizado)

Frontend (React):
└── resources/js/components/Tests/RiasecMlDataDashboard.tsx (próximo)

Documentación:
├── ML_DATA_PREPARATION_GUIDE.md (este archivo)
└── RIASEC_VALIDATION_GUIDE.md (normas pedagógicas)
```

---

## 🧪 Testing & Debugging

### Ver Resumen de Datos Disponibles

```bash
curl -H "Authorization: Bearer {TOKEN}" \
  "http://localhost:8000/api/ml-data/test/2/summary"
```

### Descargar Dataset Supervisado

```bash
curl -H "Authorization: Bearer {TOKEN}" \
  "http://localhost:8000/api/ml-data/test/2/export/supervised" \
  > riasec_supervised.csv
```

### Ver Importancia de Features

```bash
curl -H "Authorization: Bearer {TOKEN}" \
  "http://localhost:8000/api/ml-data/test/2/feature-importance"
```

---

## 💡 Mejores Prácticas

1. **Normalización:** Los datos ya vienen normalizados (0-100)
2. **Escalado:** Usa `StandardScaler()` antes de modelos no basados en árboles
3. **Balanceo:** Dataset con clases desbalanceadas (algunas carreras + populares)
4. **Validación:** Usar k-fold cross-validation (k=5) para más robustez
5. **Hiperparámetros:** Usar GridSearchCV para optimizar

---

## 🔄 Próximos Pasos

1. ✅ Descargar datasets CSV
2. ⬜ Entrenar modelos localmente o en Jupyter Notebook
3. ⬜ Crear API en Python (FastAPI/Flask) para exponer modelos
4. ⬜ Integrar predicciones en dashboard vocacional
5. ⬜ Implementar feedback loop (reentrenamiento periódico)

---

## 📚 Referencias

- Holland, J.L. (1997). Making Vocational Choices
- Scikit-learn Documentation: https://scikit-learn.org/
- Pandas Documentation: https://pandas.pydata.org/
- RIASEC Validation Guide: RIASEC_VALIDATION_GUIDE.md

---

**Documento preparado para:** Plataforma Educativa
**Versión:** 1.0
**Fecha:** 2025-11-29
**Autor:** Sistema de Orientación Vocacional RIASEC
