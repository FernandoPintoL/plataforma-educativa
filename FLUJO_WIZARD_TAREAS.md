# 🎯 Nuevo Flujo Multi-Paso para Creación de Tareas/Evaluaciones

## Descripción General

Se ha implementado un nuevo sistema de asistente (wizard) para crear tareas y evaluaciones de forma más intuitiva y eficiente, con soporte para análisis automático con inteligencia artificial.

## 📋 Archivos Nuevos Creados

### Componentes Vue (`/resources/js/pages/Tareas/`)
- **`TareaWizard.vue`** - Componente principal que gestiona el flujo de 5 pasos
- **`Steps/StepSelector.vue`** - Paso 1: Selector entre modo IA o Manual
- **`Steps/StepBasicInfo.vue`** - Paso 2: Entrada de título y selección de curso
- **`Steps/StepAnalysis.vue`** - Paso 3: Mostrar análisis y sugerencias del agente
- **`Steps/StepReview.vue`** - Paso 4: Revisión y edición de datos analizados
- **`Steps/StepFullForm.vue`** - Paso 5: Formulario completo con campos editables

### Utilidades (`/resources/js/utils/`)
- **`dateCalculator.js`** - Funciones para cálculo automático de fechas de entrega

## 🔄 Flujo Completo

```
PASO 1: Selector IA/Manual
   ↓
PASO 2: Ingreso de Título + Selección de Curso
   ↓
   ├─ Si IA: PASO 3 (Análisis del Agente)
   │         PASO 4 (Revisión & Edición)
   │
   └─ Si Manual: PASO 5 (Formulario Completo)

PASO 5: Formulario Completo con Datos Pre-llenados
   ↓
Publicar o Guardar como Borrador
```

## ⚙️ Funcionalidades Clave

### 1. **Análisis Automático con IA**
- El usuario selecciona "Crear con IA"
- Proporciona un título y selecciona el curso
- El agente analiza y sugiere:
  - Descripción detallada
  - Instrucciones claras
  - **Tiempo estimado** (en horas, días o semanas)
  - Nivel de dificultad
  - Puntuación sugerida
  - Confianza del análisis

### 2. **Cálculo Automático de Fecha de Entrega**
```javascript
// En StepReview.vue
const fechaEntrega = calcularFechaEntrega(
  tiempo_estimado,      // Número (ej: 3)
  unidad_tiempo        // 'horas', 'dias', 'semanas'
);
```
- La fecha se calcula sumando el tiempo estimado a partir de ahora
- Se actualiza automáticamente si el usuario cambia el tiempo estimado
- El profesor puede editarla manualmente en el siguiente paso

### 3. **Edición Interactiva en Paso 4**
- Cada campo tiene un botón "✏️ Editar"
- Los usuarios pueden cambiar descripciones, instrucciones, dificultad, etc.
- La fecha de entrega se recalcula automáticamente si cambia el tiempo

### 4. **Formulario Completo Pre-llenado**
- Todos los datos del análisis se llenan automáticamente
- El profesor puede ajustar cualquier campo
- Opción de guardar como borrador o publicar directamente

## 💾 Datos Almacenados en Cada Paso

```javascript
wizardData = {
  selectedMode: 'ia' | 'manual',  // Modo seleccionado

  basicInfo: {
    titulo: string,               // Título ingresado
    curso_id: number              // ID del curso seleccionado
  },

  analysis: {
    descripcion: string,
    instrucciones: string,
    tiempo_estimado: number,
    unidad_tiempo: 'horas'|'dias'|'semanas',
    dificultad: 'facil'|'intermedia'|'dificil',
    puntuacion_sugerida: number,
    confidence: 0-1               // Confianza del análisis
  },

  review: {
    descripcion: string,          // (Editable)
    instrucciones: string,        // (Editable)
    tiempo_estimado: number,      // (Editable)
    dificultad: string,           // (Editable)
    fecha_entrega: Date,          // (Auto-calculada)
    puntuacion: number            // (Editable)
  },

  form: {
    titulo: string,
    descripcion: string,
    curso_id: number,
    instrucciones: string,
    fecha_limite: Date,           // (Editable)
    puntuacion: number,           // (Editable, default 100)
    permite_archivos: boolean,
    max_archivos: number,
    tipo_archivo_permitido: string,
    recursos: File[]              // Archivos adjuntos
  }
}
```

## 🔧 Cambios en Backend

### TareaController.php
- Método `create()` ahora renderiza `Tareas/TareaWizard`
- El método `store()` permanece sin cambios (recibe los mismos datos)
- La validación se realiza con las mismas reglas existentes

### ContentAnalysisController.php
- No requiere cambios
- Continúa retornando análisis en la estructura esperada
- **Importante:** Asegúrate de que incluya `tiempo_estimado` y `unidad_tiempo`

## 📱 Responsividad

- Diseño completamente responsive
- En móviles, los pasos ocupan el 100% del ancho
- Los botones se apilan verticalmente en pantallas pequeñas
- Las tarjetas se reajustan automáticamente

## 🎨 Estilos

- Colores principales: `#667eea` (azul) y `#764ba2` (púrpura)
- Transiciones suaves entre pasos
- Indicadores visuales de progreso
- Botones con feedback visual (hover, disabled, etc.)

## ✅ Validaciones

### Paso 1 (Selector)
- ✓ Se debe seleccionar un modo (IA o Manual)

### Paso 2 (Información Básica)
- ✓ Título: Mínimo 5, máximo 255 caracteres
- ✓ Curso: Debe estar seleccionado
- ✓ En modo IA, se envía a análisis; en manual, va al formulario

### Paso 3 (Análisis)
- ✓ Manejo de errores si el análisis falla
- ✓ Opción para reintentar o ir manual
- ✓ Timeout después de 15 segundos

### Paso 4 (Revisión)
- ✓ Fecha de entrega debe ser futura
- ✓ Todos los campos son opcionales excepto la fecha (auto-calculada)

### Paso 5 (Formulario)
- ✓ Usa las validaciones existentes de StoreTareaRequest
- ✓ Título es requerido
- ✓ Curso es requerido
- ✓ Puntuación entre 1-999

## 🔄 Navegación

- **Atrás:** Disponible en todos los pasos (excepto paso 1)
- **Siguiente:** Va al siguiente paso si las validaciones pasan
- **Cancelar:** En el paso 1, permite salir del wizard
- **Guardar/Publicar:** En el paso 5

## 📊 Estructura de Respuesta del Agente

Se espera que `/api/content/analyze` retorne:

```json
{
  "success": true,
  "analysis": {
    "descripcion": "Descripción detallada...",
    "instrucciones": "Instrucciones claras...",
    "tiempo_estimado": 3,
    "unidad_tiempo": "dias",
    "dificultad": "intermedia",
    "puntuacion_sugerida": 100,
    "confidence": 0.85
  },
  "timestamp": "2025-11-25T10:30:00Z"
}
```

## ⚠️ Consideraciones Importantes

1. **Compatibilidad:** El endpoint `POST /tareas` debe seguir recibiendo los mismos datos
2. **Validaciones:** El backend no cambia, todas las validaciones existentes se aplican
3. **CSRF:** El token CSRF se envía en cada request importante
4. **Autenticación:** Se verifica que el usuario sea profesor en cada paso
5. **Persistencia:** Los datos del wizard se persisten en memoria del componente Vue

## 🧪 Pruebas Recomendadas

### Flujo IA Completo
1. Ir a `/tareas/create`
2. Seleccionar "Crear con IA"
3. Ingresar título y seleccionar curso
4. Esperar análisis
5. Revisar resultados
6. Editar datos según sea necesario
7. Completar formulario
8. Publicar tarea

### Flujo Manual
1. Ir a `/tareas/create`
2. Seleccionar "Crear Manualmente"
3. Ingresar título y curso
4. Se salta directo al formulario completo
5. Completar todos los campos
6. Publicar tarea

### Casos de Error
1. Análisis falla → Reintentar
2. Análisis falla 2 veces → Volver manual
3. Validación de fecha futura
4. Cargar archivos correctamente

## 📝 Notas para el Desarrollo

- Los componentes usan Vue 3 Composition API
- Responsive design basado en CSS Grid y Flexbox
- Animaciones suaves con transiciones CSS
- Cálculo de fechas usando JavaScript nativo
- Manejo de archivos con el API estándar File

## 🚀 Próximas Mejoras Potenciales

1. Guardar borradores y recuperarlos después
2. Historial de análisis anteriores
3. Templates de tareas frecuentes
4. Compartir tareas entre profesores
5. Análisis en tiempo real mientras se escriben datos
6. Integración con más tipos de contenido (proyectos, evaluaciones, etc.)

---

**Versión:** 1.0
**Fecha:** 2025-11-25
**Status:** ✅ Implementado y listo para usar
