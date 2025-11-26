# 🚀 Integración de Análisis ML en Frontend

**Fecha:** 25 de Noviembre 2025
**Estado:** ✅ COMPLETADO
**Stack:** React + TypeScript + Inertia.js

---

## 📋 Índice

1. [Estructura Creada](#estructura-creada)
2. [Componentes Disponibles](#componentes-disponibles)
3. [Cómo Usar en Páginas](#cómo-usar-en-páginas)
4. [Hook useMLAnalysis](#hook-usemlanalysis)
5. [Ejemplos Prácticos](#ejemplos-prácticos)
6. [Integración en Páginas Existentes](#integración-en-páginas-existentes)

---

## 🏗️ Estructura Creada

```
resources/js/
├── services/
│   └── ml-analysis.service.ts         ← Servicio para API ML
├── hooks/
│   └── useMLAnalysis.ts              ← Hook para obtener datos
└── components/AnalisisRiesgo/
    ├── MLPredictionsPanel.tsx         ← Panel de predicciones
    ├── MLClusteringPanel.tsx          ← Panel de clustering
    ├── MLAgentInsights.tsx            ← Panel de síntesis e intervención
    └── IntegratedMLAnalysis.tsx       ← Componente integrador (RECOMENDADO)
```

---

## 🎨 Componentes Disponibles

### 1. **IntegratedMLAnalysis** ⭐ (RECOMENDADO)

Componente integrador que muestra todo de forma ordenada:

```tsx
import { IntegratedMLAnalysis } from '@/components/AnalisisRiesgo/IntegratedMLAnalysis';
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export function EstudianteDetailPage() {
  const { data, loading, error } = useMLAnalysis({ studentId: 253 });

  return (
    <IntegratedMLAnalysis
      studentId={253}
      studentName="Juan Pérez"
      data={data?.data}
      loading={loading}
      error={error}
    />
  );
}
```

**Proporciona:**
- Tabs para: Resumen, Predicciones, Clustering, Insights
- Cards de resumen con métricas
- Manejo de estados (loading, error)
- Todo en un componente reutilizable

---

### 2. **MLPredictionsPanel**

Muestra predicciones supervisadas:

```tsx
import { MLPredictionsPanel } from '@/components/AnalisisRiesgo/MLPredictionsPanel';

<MLPredictionsPanel
  predictions={mlData.predictions}
  loading={isLoading}
/>
```

**Muestra:**
- Performance (calificación esperada)
- Career (recomendación de carrera)
- Trend (tendencia académica)
- Progress (progreso esperado)
- Confianza de cada modelo

---

### 3. **MLClusteringPanel**

Muestra análisis de clustering no supervisado:

```tsx
import { MLClusteringPanel } from '@/components/AnalisisRiesgo/MLClusteringPanel';

<MLClusteringPanel
  discoveries={mlData.discoveries}
  loading={isLoading}
/>
```

**Muestra:**
- Asignación de cluster
- Descripción del grupo
- Métricas del modelo (Silhouette, Davies-Bouldin, etc.)
- Distribución de estudiantes por cluster

---

### 4. **MLAgentInsights**

Muestra síntesis del agente e intervención personalizada:

```tsx
import { MLAgentInsights } from '@/components/AnalisisRiesgo/MLAgentInsights';

<MLAgentInsights
  synthesis={synthesis}
  interventionStrategy={interventionStrategy}
  loading={isLoading}
/>
```

**Tabs:**
- **Síntesis:** Insights clave, recomendaciones, proceso de análisis
- **Intervención:** Estrategia, acciones, recursos, criterios de éxito

---

## 🎣 Hook useMLAnalysis

### Uso Básico

```tsx
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

function MyComponent({ studentId }) {
  const { data, loading, error, isReady } = useMLAnalysis({
    studentId,
    autoFetch: true  // Auto-cargar cuando studentId cambia
  });

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (isReady) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }
}
```

### Propiedades Retornadas

```typescript
{
  // Estado
  data: IntegratedMLAnalysis | null        // Respuesta completa del API
  loading: boolean                          // Está cargando
  error: Error | null                       // Si hay error

  // Datos derivados (acceso directo a sub-componentes)
  predictions: Record<string, any> | null   // Solo predicciones
  discoveries: any | null                   // Solo clustering
  synthesis: any | null                     // Solo síntesis
  interventionStrategy: any | null          // Solo intervención

  // Métodos
  fetch: (id: number) => Promise<void>      // Forzar recarga
  reset: () => void                         // Limpiar estado

  // Banderas
  isReady: boolean                          // data && !loading && !error
}
```

### Fetch Manual

```tsx
const { data, fetch, loading } = useMLAnalysis({ autoFetch: false });

// Cargar cuando quieras
const handleLoadAnalysis = async () => {
  await fetch(studentId);
};
```

---

## 💡 Ejemplos Prácticos

### Ejemplo 1: Página Completa de Estudiante

```tsx
// resources/js/pages/AnalisisRiesgo/Estudiante.tsx

import { useRoute } from 'ziggy-js';
import { IntegratedMLAnalysis } from '@/components/AnalisisRiesgo/IntegratedMLAnalysis';
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export default function EstudianteDetail() {
  const route = useRoute();
  const studentId = route.params.id;

  const { data, loading, error, fetch } = useMLAnalysis({
    studentId: parseInt(studentId),
    autoFetch: true
  });

  return (
    <div className="space-y-6">
      {/* Datos del estudiante existentes */}
      <StudentBasicInfo studentId={studentId} />

      {/* Nuevo: Análisis ML Integrado */}
      <IntegratedMLAnalysis
        studentId={parseInt(studentId)}
        studentName="Nombre del Estudiante"
        data={data?.data}
        loading={loading}
        error={error}
        onRetry={() => fetch(parseInt(studentId))}
      />
    </div>
  );
}
```

### Ejemplo 2: Dashboard con Lista de Estudiantes

```tsx
// Mostrar análisis rápido para múltiples estudiantes

import { MLPredictionsPanel } from '@/components/AnalisisRiesgo/MLPredictionsPanel';
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export function StudentListWithML({ students }) {
  return (
    <div className="space-y-4">
      {students.map(student => (
        <StudentRowWithML key={student.id} student={student} />
      ))}
    </div>
  );
}

function StudentRowWithML({ student }) {
  const { data, loading } = useMLAnalysis({
    studentId: student.id,
    autoFetch: true
  });

  const performance = data?.data?.ml_data?.predictions?.performance;

  return (
    <div className="flex justify-between items-center p-4 border rounded">
      <span>{student.name}</span>
      {loading ? (
        <span>Analizando...</span>
      ) : performance ? (
        <span className="font-bold">
          Desempeño: {performance.prediction.toFixed(0)}/100
        </span>
      ) : null}
    </div>
  );
}
```

### Ejemplo 3: Modal/Drawer con Análisis

```tsx
// Abrir análisis completo en un modal

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { IntegratedMLAnalysis } from '@/components/AnalisisRiesgo/IntegratedMLAnalysis';
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export function AnalysisModal({ studentId, open, onClose }) {
  const { data, loading, error } = useMLAnalysis({ studentId });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Análisis ML Completo</DialogTitle>
        </DialogHeader>
        <IntegratedMLAnalysis
          studentId={studentId}
          data={data?.data}
          loading={loading}
          error={error}
        />
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🔗 Integración en Páginas Existentes

### AnalisisRiesgo/Estudiante.tsx

Agregar esto al final del componente:

```tsx
import { IntegratedMLAnalysis } from '@/components/AnalisisRiesgo/IntegratedMLAnalysis';
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export function EstudianteDetailPage({ estudiante }) {
  const { data, loading, error } = useMLAnalysis({
    studentId: estudiante.id,
    autoFetch: true
  });

  return (
    <>
      {/* Contenido existente */}
      {/* ... */}

      {/* Agregar esta sección */}
      <section className="mt-8">
        <IntegratedMLAnalysis
          studentId={estudiante.id}
          studentName={estudiante.name}
          data={data?.data}
          loading={loading}
          error={error}
        />
      </section>
    </>
  );
}
```

### AnalisisRiesgo/Index.tsx (Dashboard)

Para mostrar un resumen de análisis:

```tsx
import { useMLAnalysis } from '@/hooks/useMLAnalysis';

export function AnalisisRiesgoIndex({ estudiantes }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {estudiantes.map(est => (
        <StudentMLCard key={est.id} studentId={est.id} studentName={est.name} />
      ))}
    </div>
  );
}

function StudentMLCard({ studentId, studentName }) {
  const { data, loading } = useMLAnalysis({ studentId, autoFetch: true });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{studentName}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Spinner />
        ) : data?.data ? (
          <>
            <p>Performance: {data.data.ml_data?.predictions?.performance?.prediction?.toFixed(0)}</p>
            <p>Cluster: {data.data.ml_data?.discoveries?.cluster_assignment?.cluster_name}</p>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
```

---

## 🔑 Puntos Clave

### ✅ Qué Se Puede Reutilizar

1. **Servicio:** `mlAnalysisService` - Llamadas a `/api/ml/*`
2. **Hook:** `useMLAnalysis` - Lógica de datos en cualquier componente
3. **Componentes:** Cada uno es independiente y reutilizable
4. **Tipos TypeScript:** Todas las interfaces están definidas

### ❌ No Se Duplicó Código

- Uso del patrón existente (Axios, servicios, hooks)
- Reutilización de componentes UI (Card, Badge, Tabs, etc.)
- Integración con NotificationService existente
- Mismo estilo y paleta de colores

### 🎯 Flujo de Datos

```
Página
  ↓
useMLAnalysis Hook (obtiene datos)
  ↓
mlAnalysisService (hace request a Laravel)
  ↓
Laravel API (/api/ml/student/{id}/analysis)
  ↓
AgentSynthesisService (coordina todo)
  ↓
Agente (8003) → Supervisada (8001) + No_supervisada (8002)
  ↓
Componentes (IntegratedMLAnalysis)
  ↓
UI (Predicciones, Clustering, Síntesis, Intervención)
```

---

## 📦 Archivo de Configuración

**IMPORTANTE:** Los endpoints están configurados en:
- `AgentSynthesisService.php:24` - URL del agente
- Actualmente: `http://localhost:8003`

Para cambiar a producción (puerto 8080):
```php
private const AGENT_API_URL = 'http://localhost:8080'; // Cambiar si es necesario
```

---

## 🧪 Testing

### Test Manual en Console

```tsx
import { mlAnalysisService } from '@/services/ml-analysis.service';

// Obtener análisis
const result = await mlAnalysisService.getIntegratedAnalysis(253);
console.log(result);

// Verificar salud
const health = await mlAnalysisService.checkHealth();
console.log('ML Health:', health);
```

---

## 📝 Checklist de Integración

- [ ] Servicio creado: `ml-analysis.service.ts`
- [ ] Hook creado: `useMLAnalysis.ts`
- [ ] 4 componentes creados y funcionales
- [ ] Todos los tipos TypeScript definidos
- [ ] Sin duplicación de código
- [ ] Integrado en páginas existentes
- [ ] Tested manualmente
- [ ] Documentación completa

---

## 🚀 Próximos Pasos (Opcionales)

1. **Añadir gráficos:** Usar una librería como `recharts` para visualizar clustering
2. **Exportar reports:** Agregar botón para descargar análisis en PDF
3. **Histórico:** Guardar análisis anteriores para comparar progreso
4. **Alertas:** Notificaciones cuando hay cambios significativos en predicciones
5. **Caché:** Guardar datos locales para evitar requests innecesarios

---

**Status:** ✅ Integración Completa
**Responsable:** ML Integration System
**Última actualización:** 25 de Noviembre 2025
