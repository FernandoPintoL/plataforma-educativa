# Tests para Pipeline de ML No Supervisada (Phase 6)

## Descripción General

Esta sección documenta los tests creados para el pipeline unificado de aprendizaje (Unsupervised ML Discovery Phase 6).

Los tests cubren:
- **Unit Tests**: Services PHP (StudentClusteringService, UnifiedLearningOrchestrator)
- **Feature/Integration Tests**: API endpoints Laravel
- **API Tests**: FastAPI Unsupervised ML Server (Python)

---

## Estructura de Tests

```
plataforma-educativa/
├── tests/
│   ├── Unit/
│   │   └── Services/
│   │       ├── StudentClusteringServiceTest.php
│   │       └── UnifiedLearningOrchestratorTest.php
│   └── Feature/
│       └── Api/
│           └── DiscoveryOrchestrationControllerTest.php
│
ml_educativas/
└── tests/
    └── test_unsupervised_api.py
```

---

## Unit Tests - PHP

### StudentClusteringServiceTest.php

**Ubicación**: `tests/Unit/Services/StudentClusteringServiceTest.php`

**Propósito**: Validar la lógica de clustering K-Means

**Tests incluidos**:

1. **test_extract_student_features_returns_valid_data**
   - Verifica que se extraen características académicas correctamente
   - Valida estructura de datos retornados

2. **test_cluster_students_with_mock_api**
   - Tests clustering con API mock
   - Verifica integración HTTP con unsupervised ML server

3. **test_cluster_students_returns_error_with_no_data**
   - Valida manejo de datos vacíos
   - Verifica mensajes de error apropiados

4. **test_clustering_handles_api_failure**
   - Prueba graceful degradation cuando API falla
   - Verifica error handling robusto

5. **test_get_cluster_analysis**
   - Valida análisis detallado de clusters
   - Verifica cálculo de métricas

6. **test_get_clusters_summary**
   - Prueba resumen general de clusters
   - Valida distribución y recomendaciones

7. **test_get_anomalous_students**
   - Identifica estudiantes anómalos correctamente
   - Valida threshold de distancia

8. **test_get_similar_students**
   - Encuentra estudiantes similares
   - Valida orden por distancia

**Ejecución**:
```bash
cd plataforma-educativa
php artisan test tests/Unit/Services/StudentClusteringServiceTest.php
```

---

### UnifiedLearningOrchestratorTest.php

**Ubicación**: `tests/Unit/Services/UnifiedLearningOrchestratorTest.php`

**Propósito**: Validar orquestación de 4 capas

**Tests incluidos**:

1. **test_full_learning_pipeline_returns_valid_structure**
   - Verifica estructura completa del pipeline
   - Valida todas las capas

2. **test_unsupervised_discovery_layer**
   - Tests Layer 1 (Descubrimiento no supervisado)
   - Valida clustering, topics, anomalías, correlaciones

3. **test_local_synthesis_when_agent_unavailable**
   - Prueba síntesis local como fallback
   - Verifica graceful degradation

4. **test_adaptive_actions_generation**
   - Tests Layer 4 (Acciones adaptativas)
   - Valida recomendaciones y timeline

5. **test_integrated_insights_generation**
   - Verifica generación de insights integrados
   - Valida consensus, divergence, emergent patterns

6. **test_get_platform_health_status**
   - Tests health check del sistema
   - Valida estado general de capas

7. **test_confidence_score_calculation**
   - Verifica cálculo de confianza
   - Valida rango 0-1

8. **test_pipeline_error_handling**
   - Prueba manejo de errores
   - Verifica robustez

**Ejecución**:
```bash
cd plataforma-educativa
php artisan test tests/Unit/Services/UnifiedLearningOrchestratorTest.php
```

---

## Feature Tests - Laravel API

### DiscoveryOrchestrationControllerTest.php

**Ubicación**: `tests/Feature/Api/DiscoveryOrchestrationControllerTest.php`

**Propósito**: Validar endpoints REST de API

**Tests incluidos**:

#### Autenticación y Autorización
- `test_unified_pipeline_requires_authentication` - Verifica que requiere auth
- `test_clustering_requires_role_authorization` - Verifica roles (profesor, admin)

#### Endpoints de Clustering
- `test_clustering_run_with_valid_data` - POST /api/discovery/clustering/run
- `test_clustering_summary_endpoint` - GET /api/discovery/clustering/summary

#### Endpoints de Topics
- `test_topic_analysis_endpoint` - POST /api/discovery/topics/analyze
- `test_student_topics_endpoint` - GET /api/discovery/topics/student/{id}

#### Endpoints de Anomalies
- `test_anomaly_detection_endpoint` - POST /api/discovery/anomalies/detect
- `test_student_anomalies_endpoint` - GET /api/discovery/anomalies/student/{id}

#### Endpoints de Correlaciones
- `test_correlation_analysis_endpoint` - POST /api/discovery/correlations/analyze
- `test_activity_performance_correlation_endpoint` - POST /api/discovery/correlations/activity-performance

#### Endpoints de Sistema
- `test_health_check_endpoint` - GET /api/discovery/health
- `test_integrated_insights_endpoint` - GET /api/discovery/insights/{id}

#### Validación de Parámetros
- `test_clustering_with_invalid_parameters` - Parámetros inválidos
- `test_clustering_with_out_of_range_parameters` - Valores fuera de rango

**Ejecución**:
```bash
cd plataforma-educativa
php artisan test tests/Feature/Api/DiscoveryOrchestrationControllerTest.php
```

---

## API Tests - Python (FastAPI)

### test_unsupervised_api.py

**Ubicación**: `ml_educativas/tests/test_unsupervised_api.py`

**Propósito**: Validar servidor FastAPI de unsupervised ML

**Suite de Tests**:

#### TestHealthEndpoints
```python
test_health_check()            # GET /health
test_root_endpoint()           # GET /
```

#### TestClusteringEndpoints
```python
test_clustering_predict_with_valid_data()      # POST /clustering/predict
test_clustering_predict_with_default_clusters() # default n_clusters=3
test_clustering_predict_with_empty_data()      # error handling
test_clustering_predict_with_single_feature()  # minimal data
test_clustering_analysis()                     # POST /clustering/analysis
```

#### TestDataLoadingEndpoints
```python
test_load_features_endpoint()     # GET /data/load-features
test_load_features_with_limit()   # query params
test_load_texts_endpoint()        # GET /data/load-texts
test_load_texts_with_limit()      # query params
```

#### TestBatchProcessing
```python
test_batch_cluster_students()      # POST /batch/cluster-students
test_batch_cluster_with_limit()    # background tasks
```

#### TestUnsupervisedDataLoader
```python
test_data_loader_initialization()
test_data_loader_load_student_features()
```

#### TestUnsupervisedModelManager
```python
test_model_manager_initialization()
test_model_manager_load_models()
test_perform_clustering_with_data()
```

#### TestErrorHandling
```python
test_invalid_json_request()         # JSON malformed
test_missing_required_fields()      # campos faltantes
test_invalid_data_type()            # tipo incorrecto
test_invalid_cluster_count()        # n_clusters inválido
```

#### TestCORS
```python
test_cors_headers()  # verificar CORS middleware
```

#### TestDataValidation
```python
test_clustering_response_model()    # estructura response
test_health_response_model()        # health response
```

#### TestEndpointIntegration
```python
test_workflow_load_and_cluster()           # flujo completo
test_workflow_health_check_before_clustering()  # dependencias
```

**Ejecución**:
```bash
cd ml_educativas
pytest tests/test_unsupervised_api.py -v

# Tests específicos
pytest tests/test_unsupervised_api.py::TestClusteringEndpoints -v

# Con coverage
pytest tests/test_unsupervised_api.py --cov=api_unsupervised_server
```

---

## Ejecutar Todos los Tests

### Opción 1: Tests Laravel
```bash
cd plataforma-educativa

# Todos los tests
php artisan test

# Solo Unit tests
php artisan test tests/Unit

# Solo Feature tests
php artisan test tests/Feature

# Tests específicos de Discovery
php artisan test tests/Feature/Api/DiscoveryOrchestrationControllerTest.php
```

### Opción 2: Tests Python
```bash
cd ml_educativas

# Todos los tests
pytest tests/ -v

# Con coverage
pytest tests/ --cov=api_unsupervised_server --cov-report=html
```

### Opción 3: Tests Completos (ambos)
```bash
# Laravel
cd plataforma-educativa
php artisan test tests/Unit tests/Feature

# Python
cd ../ml_educativas
pytest tests/ -v
```

---

## Coverage

### PHP Tests
```bash
cd plataforma-educativa
php artisan test --coverage

# Generate HTML report
php artisan test --coverage --coverage-html=coverage/html
```

### Python Tests
```bash
cd ml_educativas
pytest tests/ --cov=api_unsupervised_server --cov-report=html
```

---

## Mocking y Stubbing

### Para PHP Tests (Mockery):
```php
Http::fake([
    'http://localhost:8002/clustering/predict' => Http::response([
        'success' => true,
        'labels' => [0, 1, 0],
    ]),
]);

StudentCluster::shouldReceive('where')->andReturnSelf();
```

### Para Python Tests (TestClient):
```python
from fastapi.testclient import TestClient

client = TestClient(app)
response = client.post("/clustering/predict", json={"data": data})
```

---

## Datos de Prueba

### Datos de Clustering (Python)
```python
data = [
    [1.0, 2.0, 3.0, 4.0, 5.0],      # Cluster 0
    [1.1, 2.1, 3.1, 4.1, 5.1],      # Cluster 0
    [5.0, 6.0, 7.0, 8.0, 9.0],      # Cluster 1
    [5.1, 6.1, 7.1, 8.1, 9.1],      # Cluster 1
    [9.0, 8.0, 7.0, 6.0, 5.0],      # Cluster 2
]
```

---

## Casos de Error Cubiertos

1. **No hay datos**: Empty data handling
2. **API no disponible**: Graceful degradation
3. **JSON inválido**: Validation errors
4. **Parámetros inválidos**: Out of range
5. **Base de datos no disponible**: Error handling
6. **Modelo no cargado**: Fallback behavior

---

## Requisitos para Ejecutar Tests

### PHP
```bash
composer require --dev laravel/tinker
composer require --dev mockery/mockery
php artisan test  # requiere PHPUnit
```

### Python
```bash
pip install pytest
pip install pytest-cov
pip install fastapi
pip install httpx  # para TestClient
```

---

## Próximos Pasos

1. **Dashboard**: Crear visualizaciones de descubrimientos
2. **Integración Completa**: Testar pipeline unificado end-to-end
3. **Performance Tests**: Benchmarking de clustering
4. **Load Tests**: Pruebas bajo carga con múltiples estudiantes

---

## Notas Importantes

- **Mocking**: Se usan mocks para API externas para evitar dependencias
- **Base de Datos**: Usa SQLite en memoria para tests o mock DB calls
- **Timeout**: API FastAPI mockea timeout handling
- **Graceful Degradation**: Tests verifican que sistema sigue funcionando si un componente falla
