# Tests Vocacionales - Vistas Frontend

Este directorio contiene todas las vistas (páginas) para el módulo de Tests Vocacionales.

## Estructura de Archivos

### Vistas Principales

#### 1. `Index.tsx`
**Descripción:** Listado de todos los tests vocacionales disponibles.

**Acceso:**
- Todos los usuarios autenticados pueden ver los tests activos
- Profesores/Directores ven opciones adicionales para crear, editar y eliminar

**Características:**
- Tarjetas de tests con información básica
- Botones de acción contextuales por rol
- Estadísticas de tests disponibles y completados
- Filtrado y búsqueda (implementar)

**Props:**
```typescript
interface IndexProps {
  tests: TestVocacional[];
}
```

---

#### 2. `CreateEdit.tsx`
**Descripción:** Formulario para crear o editar un test vocacional.

**Acceso:**
- Solo profesores y directores
- Middleware: `role:profesor|director`

**Características:**
- Formulario reactivo con validación
- Campos: nombre, descripción, duración, estado (activo/inactivo)
- Mensajes de error personalizados
- Información sobre el contenido del test

**Props:**
```typescript
interface TestVocacionalProps {
  test?: TestVocacional;
  isEdit?: boolean;
}
```

**Rutas asociadas:**
- `GET /tests-vocacionales/crear` → Renderiza CreateEdit con isEdit=false
- `GET /tests-vocacionales/{id}/editar` → Renderiza CreateEdit con test data

---

#### 3. `Take.tsx`
**Descripción:** Interfaz para que estudiantes resuelvan el test.

**Acceso:**
- Solo estudiantes autenticados
- Middleware: `role:estudiante`

**Características:**
- Timer con cuenta regresiva
- Progreso del test
- Preguntas organizadas por categorías
- Radio buttons para opciones múltiples
- Indicadores visuales de preguntas respondidas
- Validación de respuestas antes de enviar

**Props:**
```typescript
interface TakeProps {
  test: TestVocacional;
  preguntas: Categoria[];
}
```

**Estados del Timer:**
- Verde (>5 minutos restantes)
- Rojo (<5 minutos restantes)
- Auto-envío cuando tiempo se agota

---

#### 4. `Resultados.tsx`
**Descripción:** Pantalla de resultados después de completar un test.

**Acceso:**
- Solo el estudiante que realizó el test
- Middleware: Validación de propiedad del resultado

**Características:**
- Nivel de confianza con indicador visual
- Carreras recomendadas con porcentaje de compatibilidad
- Fortalezas identificadas
- Áreas de interés
- Próximos pasos recomendados
- Botón de descarga de resultados (implementar)

**Props:**
```typescript
interface ResultadosProps {
  test: TestVocacional;
  resultado: Resultado;
  perfil: PerfilVocacional | null;
}
```

**Estados:**
- Con perfil: Muestra análisis completo
- Sin perfil: Muestra mensaje "Análisis en Progreso"

---

#### 5. `Show.tsx`
**Descripción:** Vista detallada del test (para profesores/directores).

**Acceso:**
- Profesores y directores
- Middleware: `role:profesor|director`

**Características:**
- Información completa del test
- Tabs: Contenido y Respuestas
- Listado de categorías y preguntas
- Estadísticas de respuestas
- Opciones para editar y eliminar preguntas (preparado para futura implementación)

**Props:**
```typescript
interface ShowProps {
  test: TestVocacional;
}
```

**Tabs:**
1. **Contenido:** Estructura y preguntas del test
2. **Respuestas:** Historial de estudiantes que completaron el test

---

## Flujos de Navegación

### Flujo Estudiante
```
Index (ver tests activos)
  ↓
Take (resolver test)
  ↓
Resultados (ver análisis)
```

### Flujo Profesor/Director
```
Index (gestionar tests)
  ↓
CreateEdit (crear/editar)
  ↓
Show (ver detalles y respuestas)
```

---

## Control de Acceso por Rol

| Vista | Estudiante | Profesor | Director |
|-------|-----------|----------|----------|
| Index | ✅ Ver | ✅ Gestionar | ✅ Gestionar |
| CreateEdit | ❌ | ✅ | ✅ |
| Take | ✅ Resolver | ❌ | ❌ |
| Resultados | ✅ Propio | ❌ | ❌ |
| Show | ❌ | ✅ | ✅ |

---

## Componentes Utilizados

### UI Components (from `@/components/ui`)
- `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle`
- `Button` (variantes: default, outline, destructive, ghost)
- `Input`, `Textarea`, `Label`
- `Badge`
- `RadioGroup`, `RadioGroupItem`
- `Progress`
- `Switch`
- `Alert`, `AlertDescription`
- `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`

### Iconos (from `lucide-react`)
- Plus, Edit, Trash2, Eye, CheckCircle, ArrowRight
- Clock, Users, Download, AlertCircle
- Award, TrendingUp, Lightbulb
- ChevronLeft, FileText, Save

---

## Tipos de Datos

```typescript
interface TestVocacional {
  id: number;
  nombre: string;
  descripcion?: string;
  duracion_estimada: number;
  activo: boolean;
  resultados_count: number;
  categorias?: Categoria[];
  created_at: string;
  updated_at: string;
}

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  preguntas: Pregunta[];
}

interface Pregunta {
  id: number;
  pregunta: string;
  tipo: string; // 'multiple_choice', 'essay', etc.
  opciones?: string[];
  order: number;
}

interface Resultado {
  id: number;
  test_vocacional_id: number;
  estudiante_id: number;
  respuestas: Record<number, any>;
  fecha_completacion: string;
}

interface PerfilVocacional {
  id: number;
  estudiante_id: number;
  test_id: number;
  carreras_recomendadas: Carrera[];
  fortalezas: string[];
  areas_interes: string[];
  nivel_confianza: number;
}
```

---

## Implementación Pendiente

### Funcionalidades Futuras

1. **Gestión de Preguntas**
   - Crear preguntas
   - Editar preguntas
   - Reordenar preguntas (drag-and-drop)
   - Eliminar preguntas

2. **Búsqueda y Filtros**
   - Búsqueda por nombre
   - Filtrar por estado (activo/inactivo)
   - Filtrar por fecha

3. **Exportación de Resultados**
   - Descargar PDF individual
   - Generar reporte de todas las respuestas

4. **Análisis Avanzado**
   - Gráficos de distribución de respuestas
   - Estadísticas por categoría
   - Comparación con otros estudiantes

5. **Notificaciones**
   - Email cuando un test está disponible
   - Recordatorio para completar test pendiente

---

## Notas de Desarrollo

### State Management
- Utiliza `useForm()` de Inertia para manejo de formularios
- Utiliza `useState()` para estado local (UI)
- Validación en el backend (Laravel)

### Dark Mode
- Todas las vistas soportan dark mode
- Utiliza clases `dark:` de Tailwind
- Colores contrastantes y accesibles

### Responsividad
- Mobile-first approach
- Grillas adaptables con `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Botones y inputs full-width en mobile

### Accesibilidad
- Labels asociados con inputs
- ARIA labels en componentes interactivos
- Contraste de colores suficiente
- Focus states visibles

---

## Testing

Para probar estas vistas localmente:

```bash
# 1. Generar datos de prueba
php artisan db:seed

# 2. Crear un usuario estudiante
php artisan tinker
> User::factory()->create(['tipo_usuario' => 'estudiante'])

# 3. Acceder a las rutas
# http://localhost/tests-vocacionales (Index)
# http://localhost/tests-vocacionales/1 (Show)
# http://localhost/tests-vocacionales/1/tomar (Take)
```

---

## Referencias

- [Documentación Inertia.js](https://inertiajs.com/)
- [Documentación Tailwind CSS](https://tailwindcss.com/)
- [Documentación Radix UI](https://www.radix-ui.com/)
- [Documentación Lucide Icons](https://lucide.dev/)
