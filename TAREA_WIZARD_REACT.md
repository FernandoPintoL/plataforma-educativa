# Componente React: TareaWizard

## 📍 Ubicación
- **Archivo:** `/resources/js/pages/Tareas/TareaWizard.tsx`
- **Compilado a:** `/public/build/assets/TareaWizard-*.js`
- **Controlador:** `/app/Http/Controllers/TareaController.php` (método `create()`)

## 🎯 Propósito
Componente React que implementa un wizard multi-paso para la creación de tareas/evaluaciones con soporte para análisis automático con IA.

## 🏗️ Arquitectura

### Props
```typescript
interface Props {
  cursos: Curso[];  // Array de cursos disponibles
}

interface Curso {
  id: number;
  nombre: string;
  codigo?: string;
}
```

### Estado Principal (WizardData)
```typescript
interface WizardData {
  selectedMode: 'ia' | 'manual' | null;    // Modo seleccionado
  basicInfo: { titulo: string; curso_id: number | null };
  analysis: AnalysisResult | null;         // Datos del agente IA
  review: { /* datos editables */ };       // Datos revisados
  form: { /* datos del formulario */ };    // Datos finales
}
```

## 🔄 Flujo de Pasos

### Paso 1: Selector
- Usuario elige entre "Crear con IA" o "Crear Manualmente"
- Cards visuales con descripción de cada opción
- Al seleccionar, avanza automáticamente a paso 2

### Paso 2: Información Básica
- Input para título (5-255 caracteres)
- Select para curso
- Validaciones en tiempo real
- Si IA: va a análisis; si Manual: va a formulario

### Paso 3: Análisis (Solo IA)
- Llama a `/api/content/analyze` con título y curso
- Muestra loading spinner mientras se procesa
- Muestra resultados en cards profesionales
- Indicador de confianza del análisis
- **Cálculo automático de fecha de entrega**

### Paso 4: Revisión & Edición (Solo IA)
- Campos editables para descripción, instrucciones, tiempo, etc.
- Fecha de entrega se recalcula si cambia el tiempo estimado
- Puntuación editable
- Preparación de datos para formulario final

### Paso 5: Formulario Completo
- Todos los campos del formulario original
- Pre-llenado con datos del análisis (si IA)
- Opciones: Guardar como borrador o Publicar

## 🔑 Funciones Principales

### `selectMode(mode)`
Selecciona el modo (IA o Manual) y avanza.

### `updateBasicInfo(titulo, curso_id)`
Actualiza título y curso.

### `analyzeContent()`
Llama al API `/api/content/analyze` y procesa resultados.

### `calculateDueDate(days, unit)`
```typescript
// Calcula fecha de entrega sumando días a ahora
const dueDate = calculateDueDate(3, 'dias');
// Retorna: '2025-11-28' (3 días desde hoy)

// Soporta: 'horas', 'dias', 'semanas'
```

### `updateReview(updates)`
Actualiza datos revisados y recalcula fecha si es necesario.

### `nextStep() / previousStep()`
Navega entre pasos con validaciones.

### `handleSubmit(e, estado)`
Envía formulario a `/tareas` con estado ('borrador' | 'publicado').

## 🎨 Componentes UI Utilizados

Del paquete `shadcn/ui`:
- `Button` - Botones de acción
- `Input` - Campos de texto
- `Label` - Etiquetas de formulario
- `Textarea` - Áreas de texto
- `Card` - Tarjetas contenedoras
- `Select` - Dropdowns
- `Badge` - Insignias para dificultad
- `Progress` - Barra de progreso

Iconos de `lucide-react`:
- `Zap` - IA
- `PenTool` - Manual
- `Loader2` - Loading
- `Clock` - Tiempo
- `Star` - Puntuación
- `AlertCircle` - Información
- etc.

## 🌐 API Calls

### Análisis de Contenido
```typescript
POST /api/content/analyze
Headers: {
  'Content-Type': 'application/json',
  'X-CSRF-TOKEN': csrf_token
}
Body: {
  titulo: string,
  curso_id: number,
  content_type: 'tarea'
}

Response: {
  success: boolean,
  analysis: {
    descripcion: string,
    instrucciones: string,
    tiempo_estimado: number,
    unidad_tiempo: 'horas' | 'dias' | 'semanas',
    dificultad: 'facil' | 'intermedia' | 'dificil',
    puntuacion_sugerida: number,
    confidence: 0-1
  }
}
```

### Crear Tarea
```typescript
POST /tareas
Body: FormData {
  titulo: string,
  descripcion: string,
  curso_id: number,
  instrucciones: string,
  fecha_limite: string (YYYY-MM-DD),
  puntuacion: number,
  permite_archivos: boolean,
  max_archivos: number,
  tipo_archivo_permitido: string,
  estado: 'borrador' | 'publicado'
}
```

## 📊 Cálculo de Fecha de Entrega

```typescript
// Ejemplo: Usuario ingresa 3 días
tiempo_estimado: 3
unidad_tiempo: 'dias'

// Se calcula:
ahora = 2025-11-25
fecha_entrega = ahora + 3 días = 2025-11-28

// Si cambia a 2 semanas:
unidad_tiempo = 'semanas'
fecha_entrega = ahora + 2 semanas = 2025-12-09

// Si cambia a 5 horas:
unidad_tiempo = 'horas'
fecha_entrega = ahora + 5 horas = 2025-11-25 05:00:00
```

## 🛠️ Customización

### Cambiar colores
Modificar en el componente:
```typescript
// Colores de paso activo
className={step === currentStep ? 'bg-blue-600' : '...'}

// Modificar en Tailwind config si es necesario
```

### Agregar nuevos pasos
1. Aumentar `totalSteps` si es necesario
2. Agregar condicional `{currentStep === X && (...)}`
3. Actualizar lógica de `nextStep()`

### Cambiar layout
El layout está en `AppLayout` de Inertia.js. El wizard es flexible.

## 🧪 Testing

### Flujo IA
1. Click en "Crear con IA"
2. Ingresar: "Análisis de Shakespeare"
3. Seleccionar curso
4. Esperar análisis
5. Ver resultados
6. Editar si es necesario
7. Completar formulario
8. Publicar

### Flujo Manual
1. Click en "Crear Manualmente"
2. Ir directo a formulario
3. Completar todos los campos
4. Publicar

### Validaciones
- ✓ Título < 5 caracteres: desactivar siguiente
- ✓ Sin curso: desactivar siguiente
- ✓ Análisis falla: mostrar error y opción reintentar
- ✓ Fecha siempre es futura

## 📦 Dependencias

Todas incluidas en `package.json`:
- `react` - 19.0.0
- `@inertiajs/react` - 2.1.0
- `@headlessui/react` - 2.2.7
- `lucide-react` - 0.475.0
- `date-fns` - 4.1.0
- `tailwindcss` - 4.0.0

## 🐛 Debugging

### Ver estado actual
Agregar `console.log(wizardData)` en cualquier función.

### Network
Abrir DevTools → Network → Filtrar por `/api/content/analyze`

### Console
- Errores de validación se loguean
- Errores de API se muestran al usuario

## 📝 Notas de Desarrollo

- El componente usa hooks de React (useState)
- Inertia.js maneja routing y formularios
- Los estilos son Tailwind + componentes shadcn
- TypeScript types están definidos al inicio

## 🚀 Deployment

1. Compilar: `npm run build`
2. Los assets se generan en `/public/build/`
3. No requiere cambios en servidor
4. El controlador ya está configurado

## ⚠️ Problemas Comunes

### "Page not found: TareaWizard.tsx"
→ Ejecutar `npm run build` nuevamente

### Análisis no funciona
→ Verificar que puerto 8003 está abierto
→ Revisar response format en `/api/content/analyze`

### Fecha no se calcula
→ Verificar que `tiempo_estimado` viene en análisis
→ Verificar formato de fecha (YYYY-MM-DD)

### Estilos no se aplican
→ Ejecutar `npm run build`
→ Limpiar cache del navegador (Ctrl+Shift+Del)

## 📞 Mantenimiento Futuro

Si necesitas:
- **Agregar pasos:** Modificar el componente y actualizar lógica
- **Cambiar validaciones:** Están en la lógica de `nextStep()`
- **Cambiar API:** Actualizar fetch calls y tipos
- **Cambiar estilos:** Usar clases Tailwind

---

**Última actualización:** 2025-11-26
**Versión:** 1.0 (React/TypeScript)
**Status:** ✅ Producción
