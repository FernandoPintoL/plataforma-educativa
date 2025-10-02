# Documentación: Plataforma Educativa Inteligente con Orientación Vocacional

## Índice
1. [Descripción general del proyecto](#descripción-general-del-proyecto)
2. [Arquitectura del sistema](#arquitectura-del-sistema)
3. [Stack tecnológico](#stack-tecnológico)
4. [Diagrama de clases](#diagrama-de-clases)
5. [Sistema de Machine Learning](#sistema-de-machine-learning)
   - [Herramientas y bibliotecas](#herramientas-y-bibliotecas-ml)
   - [Implementación y flujos de datos](#implementación-y-flujos-de-datos)
   - [Modelos propuestos](#modelos-propuestos)
6. [Módulo de orientación vocacional](#módulo-de-orientación-vocacional)
7. [APIs y servicios](#apis-y-servicios)
8. [Plan de implementación](#plan-de-implementación)
9. [Consideraciones técnicas](#consideraciones-técnicas)

## Descripción general del proyecto

La plataforma educativa que se está desarrollando es un sistema integral que combina la gestión educativa tradicional con tecnologías avanzadas de inteligencia artificial. Los componentes principales son:

1. **Gestión de cursos y contenidos**: Permite a profesores subir tareas, evaluaciones y materiales.

2. **Sistema inteligente de análisis**: Analiza el trabajo de los estudiantes para detectar fortalezas y debilidades.

3. **Recomendación personalizada**: Sugiere materiales de apoyo específicos basados en el análisis de desempeño.

4. **Orientación vocacional**: Utiliza el historial académico y tests vocacionales para recomendar posibles carreras profesionales.

5. **Comunicación entre actores**: Interconecta a estudiantes, profesores, padres y directores.

El valor diferencial radica en la implementación de inteligencia artificial para personalizar el aprendizaje y proporcionar orientación académica y vocacional basada en datos reales.

## Arquitectura del sistema

El sistema está diseñado con una arquitectura de microservicios que separa el backend principal (Laravel) de los servicios de ML (Python):

```
+-------------------------------------------+    +--------------------------------------+
|                                           |    |                                      |
|  Frontend / Backend Principal             |    |  Servicios de Machine Learning       |
|  (Laravel + PostgreSQL)                   |    |  (Python + APIs)                     |
|                                           |    |                                      |
|  +-----------------+  +----------------+  |    |  +---------------+  +-------------+  |
|  | Interfaz de     |  | Gestión de     |  |    |  | API REST      |  | Modelos ML  |  |
|  | usuario         |<-| datos          |<------->| (FastAPI)      |->| (scikit,    |  |
|  +-----------------+  +----------------+  |    |  +---------------+  | TensorFlow) |  |
|                       | Lógica de      |  |    |  | Procesamiento |  +-------------+  |
|  +-----------------+  | negocio        |  |    |  | (Pandas, NLP) |                   |
|  | Almacenamiento  |<-|                |  |    |  +---------------+                   |
|  | PostgreSQL      |  +----------------+  |    |                                      |
|  +-----------------+                      |    |                                      |
|                                           |    |                                      |
+-------------------------------------------+    +--------------------------------------+
```

### Comunicación entre sistemas:

- API REST para la comunicación entre Laravel y los servicios de ML
- JSON para el intercambio de datos
- PostgreSQL como base de datos principal
- Servicios independientes para escalabilidad

## Stack tecnológico

### Backend principal:
- **Framework**: Laravel
- **Base de datos**: PostgreSQL
- **Servidor web**: Nginx/Apache

### Servicios ML:
- **Lenguaje**: Python 3.9+
- **APIs**: FastAPI/Flask
- **Despliegue**: Docker y contenedores
- **Bibliotecas ML**: scikit-learn, TensorFlow/PyTorch, NLTK/spaCy, Pandas

### Frontend:
- **Framework CSS**: Tailwind/Bootstrap
- **JavaScript**: Vue.js/Alpine.js (compatible con Laravel)

### Infraestructura:
- **Opción en la nube**: AWS (EC2, SageMaker, RDS)
- **Alternativa**: Google Cloud (Compute Engine, AI Platform, Cloud SQL)
- **On-premise**: Servidores Docker

## Diagrama de clases

El sistema está organizado en cinco módulos principales:

1. **Usuarios**: Gestiona los diferentes tipos de usuarios (Profesor, Estudiante, Director, Padre)
2. **Contenido Educativo**: Maneja tareas, evaluaciones, preguntas y trabajos
3. **Estructura Educativa**: Administra cursos, reportes y rendimiento académico
4. **Sistema Inteligente**: Implementa modelos ML para análisis y recomendaciones
5. **Orientación Vocacional**: Gestiona tests vocacionales y recomendación de carreras

[Nota: Para ver el diagrama de clases completo, consultar el archivo PlantUML adjunto al proyecto]

### Clases principales:

- **Usuario**: Clase base para Profesor, Estudiante, Director y Padre
- **Contenido**: Clase base para Tarea y Evaluación
- **Trabajo**: Representa el trabajo entregado por un estudiante
- **SistemaAnalisis**: Gestiona los modelos ML para analizar trabajos
- **MaterialApoyo**: Recursos recomendados por el sistema
- **PerfilVocacional**: Almacena intereses, aptitudes y personalidad del estudiante
- **TestVocacional**: Implementa evaluaciones vocacionales
- **RecomendacionCarrera**: Conecta estudiantes con carreras compatibles

## Sistema de Machine Learning

### Herramientas y bibliotecas ML

1. **scikit-learn**:
   - **Propósito**: Modelos básicos de clasificación y regresión
   - **Aplicaciones**:
     - Sistemas de recomendación para material educativo
     - Clasificación de respuestas y detección de dificultades
     - Agrupamiento (clustering) para identificar perfiles de aprendizaje
     - Evaluación del progreso y predicción de rendimiento

2. **TensorFlow/PyTorch**:
   - **Propósito**: Modelos avanzados de deep learning
   - **Aplicaciones**:
     - Análisis de texto para respuestas largas
     - Modelos secuenciales para predecir trayectorias de aprendizaje
     - Modelos de recomendación vocacional avanzados

3. **NLTK/spaCy**:
   - **Propósito**: Procesamiento de lenguaje natural
   - **Aplicaciones**:
     - Análisis de respuestas abiertas
     - Extracción de intereses para perfil vocacional
     - Análisis de retroalimentación de profesores

4. **Pandas**:
   - **Propósito**: Manipulación y análisis de datos
   - **Aplicaciones**:
     - Análisis de rendimiento académico
     - Procesamiento de datos para el módulo vocacional
     - Análisis estadístico para informes a directores

5. **FastAPI/Flask**:
   - **Propósito**: Crear APIs para servicios ML
   - **Aplicaciones**:
     - API para servicio de análisis de trabajos
     - API para servicio de recomendación vocacional
     - API para procesamiento de lenguaje natural

### Implementación y flujos de datos

#### 1. Flujo del Sistema de Análisis de Trabajos:
```
1. Estudiante completa una tarea/evaluación en Laravel
2. Laravel envía los datos a la API de Python (FastAPI)
3. FastAPI preprocesa los datos con Pandas
4. Se aplica análisis de texto con NLTK/spaCy (para respuestas escritas)
5. scikit-learn clasifica el trabajo y detecta fortalezas/debilidades
6. Se generan recomendaciones de material usando modelos de scikit-learn
7. FastAPI devuelve resultados estructurados a Laravel
8. Laravel almacena resultados y muestra recomendaciones al estudiante
```

#### 2. Flujo del Sistema de Orientación Vocacional:
```
1. Estudiante realiza tests vocacionales en Laravel
2. Se recopilan datos de rendimiento académico de PostgreSQL
3. Laravel envía todos los datos al servicio Python (FastAPI)
4. Pandas procesa y unifica los datos de distintas fuentes
5. spaCy analiza textos libres para extraer intereses
6. scikit-learn/TensorFlow aplica modelos de compatibilidad con carreras
7. FastAPI devuelve recomendaciones de carreras con justificaciones
8. Laravel almacena y muestra resultados con visualizaciones interactivas
```

### Modelos propuestos

#### Para análisis de trabajos:

1. **Modelo de clasificación de errores**:
   - **Biblioteca**: scikit-learn (RandomForestClassifier)
   - **Entradas**: Patrones de respuesta, tiempo de respuesta, intentos
   - **Salidas**: Tipo de dificultad (conceptual, procedimental, memoria)

2. **Modelo de recomendación de material**:
   - **Biblioteca**: scikit-learn (NearestNeighbors)
   - **Entradas**: Perfil de aprendizaje, dificultades detectadas
   - **Salidas**: IDs de recursos recomendados

#### Para orientación vocacional:

1. **Modelo híbrido de recomendación de carreras**:
   - **Biblioteca**: TensorFlow/PyTorch
   - **Entradas**: Rendimiento académico, intereses, aptitudes
   - **Salidas**: Carreras compatibles con porcentajes y justificaciones

2. **Modelo de análisis de texto para intereses**:
   - **Biblioteca**: spaCy/NLTK
   - **Entradas**: Textos libres escritos por el estudiante
   - **Salidas**: Categorías de interés con puntajes

## Módulo de orientación vocacional

El módulo de orientación vocacional es una extensión del sistema principal que utiliza tanto el historial académico como tests específicos para recomendar posibles carreras profesionales.

### Componentes principales:

1. **Tests vocacionales**:
   - Tests de intereses
   - Tests de aptitudes
   - Tests de personalidad laboral

2. **Integración con rendimiento académico**:
   - Análisis de fortalezas académicas
   - Identificación de patrones de aprendizaje
   - Evaluación de constancia y mejora

3. **Sistema de recomendación**:
   - Algoritmos de filtrado basado en contenido
   - Filtrado colaborativo (basado en estudiantes similares)
   - Explicación detallada de recomendaciones

4. **Presentación de resultados**:
   - Perfiles vocacionales visuales
   - Compatibilidad con carreras
   - Recursos informativos sobre cada carrera

### Proceso de implementación:

1. Diseño e implementación de tests vocacionales
2. Desarrollo de algoritmos para extraer perfiles
3. Creación de base de datos de carreras con atributos
4. Implementación de modelos de compatibilidad
5. Integración con el sistema de rendimiento académico
6. Desarrollo de interfaces para resultados y recomendaciones

## APIs y servicios

### 1. API de análisis de trabajos

```python
@app.post("/api/analizar-trabajo")
async def analizar_trabajo(trabajo: TrabajoData):
    # Implementación...
    return ResultadoAnalisis(...)
```

**Entradas**:
- ID de estudiante
- ID de contenido
- Respuestas
- Tiempos de respuesta
- Metadatos adicionales

**Salidas**:
- Áreas de fortaleza
- Áreas de debilidad
- Confianza predictiva
- Recomendaciones de material

### 2. API de recomendación vocacional

```python
@app.post("/api/recomendar-carreras")
async def recomendar_carreras(datos: DatosEstudiante):
    # Implementación...
    return ResultadoRecomendacion(...)
```

**Entradas**:
- Datos del perfil vocacional
- Datos de rendimiento académico
- Resultados de tests vocacionales

**Salidas**:
- Recomendaciones de carreras
- Perfil identificado
- Áreas destacadas
- Mensaje de orientación

### 3. API de análisis de texto

```python
@app.post("/api/analizar-texto")
async def analizar_texto(respuesta: RespuestaTexto):
    # Implementación...
    return ResultadoAnalisisTexto(...)
```

**Entradas**:
- Texto de respuesta
- ID del tema
- Conceptos esperados

**Salidas**:
- Conceptos identificados
- Conceptos faltantes
- Comprensión estimada
- Sugerencias de mejora
- Métricas de calidad de redacción

## Plan de implementación

### Fase 1: Implementación básica (2-3 meses)

1. **Infraestructura base**:
   - Configuración de Laravel + PostgreSQL
   - Estructura de microservicios para ML
   - Diseño de la base de datos

2. **Funcionalidades core**:
   - Gestión de usuarios y roles
   - Creación y asignación de tareas
   - Sistema de entrega de trabajos

3. **ML básico**:
   - API simple con FastAPI
   - Modelos iniciales con scikit-learn
   - Integración básica entre sistemas

### Fase 2: Ampliación de capacidades (3-4 meses)

1. **Mejora de análisis**:
   - Implementación de análisis de texto
   - Modelos más sofisticados para recomendaciones
   - Dashboard analítico para profesores

2. **Módulo vocacional básico**:
   - Implementación de tests iniciales
   - Creación del sistema de perfiles
   - Modelos básicos de recomendación

3. **Mejoras de UX**:
   - Visualizaciones de progreso
   - Notificaciones inteligentes
   - Interfaz adaptativa

### Fase 3: Sistema avanzado (4-6 meses)

1. **ML avanzado**:
   - Modelos con deep learning
   - Explicabilidad de modelos
   - Predicciones sobre rendimiento futuro

2. **Vocacional avanzado**:
   - Recomendación híbrida sofisticada
   - Conexión con instituciones educativas
   - Trayectorias profesionales personalizadas

3. **Integración completa**:
   - Flujos de datos optimizados
   - Automatización de procesos
   - Escalabilidad del sistema

## Consideraciones técnicas

### Seguridad:
- Protección de datos sensibles de estudiantes
- Encriptación en comunicaciones API
- Roles y permisos granulares

### Escalabilidad:
- Arquitectura de microservicios
- Balanceo de carga para servicios ML
- Optimización de consultas a PostgreSQL

### Mantenimiento:
- Reentrenamiento periódico de modelos
- Logging extensivo para debugging
- Tests automatizados

### Integración:
- APIs documentadas con OpenAPI/Swagger
- Control de versiones para compatibilidad
- WebHooks para eventos importantes

---

## Ejemplos de código

### Ejemplo: Sistema de recomendación en Python

```python
import pandas as pd
from sklearn.neighbors import NearestNeighbors

def recomendar_material(estudiante_id, dificultad_detectada):
    # Cargar historial de materiales efectivos
    materiales_df = obtener_datos_materiales_efectivos()
    
    # Matriz de características
    X = materiales_df[['nivel_dificultad', 'tema_id', 
                      'estilo_visual', 'estilo_auditivo']].values
    
    # Modelo de vecinos cercanos
    model = NearestNeighbors(n_neighbors=5, algorithm='ball_tree')
    model.fit(X)
    
    # Encontrar materiales similares
    estudiante_perfil = obtener_perfil_aprendizaje(estudiante_id)
    perfil_vector = np.array([
        dificultad_detectada, 
        obtener_tema_actual(estudiante_id),
        estudiante_perfil['estilo_visual'],
        estudiante_perfil['estilo_auditivo']
    ]).reshape(1, -1)
    
    distancias, indices = model.kneighbors(perfil_vector)
    
    # Devolver materiales recomendados
    return materiales_df.iloc[indices[0]]['recurso_id'].tolist()
```

### Ejemplo: Integración en Laravel

```php
// En un controlador de Laravel
public function analyzeStudentWork(Request $request, $trabajoId)
{
    // Obtener trabajo del estudiante
    $trabajo = Trabajo::with('estudiante', 'contenido')->findOrFail($trabajoId);
    
    // Preparar datos para el modelo ML
    $data = [
        'tiempo_respuesta' => $trabajo->tiempo_total,
        'intentos' => $trabajo->intentos,
        'consultas_material' => $trabajo->consultas_material,
        'tema_id' => $trabajo->contenido->tema_id
    ];
    
    // Llamar al servicio ML
    $client = new \GuzzleHttp\Client();
    $response = $client->post('http://servicio-ml:8000/predict', [
        'json' => $data
    ]);
    
    $result = json_decode((string) $response->getBody(), true);
    
    // Guardar resultados y recomendaciones
    $analisis = new ResultadoAnalisis();
    $analisis->trabajo_id = $trabajoId;
    $analisis->nivel_dificultad = $result['prediction'];
    $analisis->save();
    
    // Guardar recomendaciones
    foreach ($result['recommendations'] as $rec) {
        $material = new MaterialApoyo();
        $material->resultado_analisis_id = $analisis->id;
        $material->recurso_id = $rec['id'];
        $material->relevancia = $rec['relevancia'];
        $material->save();
    }
    
    return response()->json($result);
}
```

---

*Documento preparado para el equipo de desarrollo de la Plataforma Educativa Inteligente.*
*Última actualización: Octubre 2025*