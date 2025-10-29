# Sistema CRUD Genérico - Guía Completa

## 📋 Índice

1. [Introducción](#introducción)
2. [Arquitectura](#arquitectura)
3. [Configuración Rápida](#configuración-rápida)
4. [Componentes](#componentes)
5. [Hooks](#hooks)
6. [Ejemplos Completos](#ejemplos-completos)
7. [Mejores Prácticas](#mejores-prácticas)
8. [Troubleshooting](#troubleshooting)

---

## 🎯 Introducción

El Sistema CRUD Genérico te permite crear páginas completas de listado y formularios con **90% menos código**, manteniendo la arquitectura de 3 capas del proyecto.

### Beneficios

✅ **Reducción de código**: De 250 líneas a ~60 líneas
✅ **Consistencia visual**: Todas las páginas lucen igual
✅ **Funcionalidades incluidas**: Búsqueda, filtros, paginación, sorting
✅ **Type-safe**: Totalmente tipado con TypeScript
✅ **Permisos integrados**: Control de acceso automático
✅ **Responsive**: Funciona en todos los dispositivos
✅ **Dark mode**: Soporte automático

### Comparación Antes/Después

```typescript
// ❌ ANTES - 250+ líneas
export default function Index() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filters, setFilters] = useState({})
    // ... 200+ líneas más de código
    return (<div>{/* HTML extenso */}</div>)
}

// ✅ DESPUÉS - ~60 líneas
const config: CrudConfig = { /* configuración */ }
export default function Index({ data, filters }) {
    return <GenericIndexPage data={data} config={config} service={service} filters={filters} />
}
```

---

## 🏗️ Arquitectura

El sistema respeta la arquitectura de 3 capas del proyecto:

```
┌─────────────────────────────────────────────────┐
│  PRESENTACIÓN (Componentes Genéricos)          │
│  • GenericIndexPage.tsx                         │
│  • GenericFormPage.tsx                          │
│  • GenericFilters.tsx                           │
│  • GenericSearchBar.tsx                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  LÓGICA DE NEGOCIO (Hooks)                     │
│  • use-generic-list.ts                          │
│  • use-generic-filters.ts                       │
│  • use-generic-form.ts                          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│  ACCESO A DATOS (Servicios)                    │
│  • EstudiantesService                           │
│  • ProfesoresService                            │
│  • etc.                                         │
└─────────────────────────────────────────────────┘
```

### Estructura de Archivos

```
resources/js/
├── components/generic/
│   ├── crud/
│   │   ├── GenericIndexPage.tsx      ← Página completa de listado
│   │   └── GenericFormPage.tsx       ← Página completa de formulario
│   ├── GenericFilters.tsx            ← Componente de filtros
│   ├── GenericSearchBar.tsx          ← Barra de búsqueda
│   ├── modern-table.tsx              ← Tabla (ya existía)
│   └── generic-pagination.tsx        ← Paginación (ya existía)
│
├── hooks/
│   ├── use-generic-list.ts           ← Hook para listados
│   ├── use-generic-filters.ts        ← Hook para filtros
│   └── use-generic-form.ts           ← Hook para formularios (ya existía)
│
├── domain/
│   └── generic.ts                    ← Tipos TypeScript
│
└── pages/
    └── [Entidad]/
        ├── IndexGeneric.tsx          ← Ejemplo de listado
        └── CreateGeneric.tsx         ← Ejemplo de formulario
```

---

## 🚀 Configuración Rápida

### Paso 1: Crear Configuración del CRUD

```typescript
// pages/MiEntidad/Index.tsx
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { miEntidadService } from '@/services/mi-entidad.service'
import type { CrudConfig } from '@/domain/generic'
import type { MiEntidad, MiEntidadFormData } from '@/domain/mi-entidad'

const config: CrudConfig<MiEntidad> = {
    // REQUERIDO: Identificación
    name: 'entidad',              // singular
    pluralName: 'entidades',      // plural

    // REQUERIDO: Columnas de la tabla
    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true },
        { key: 'nombre', label: 'Nombre', type: 'text', sortable: true },
        { key: 'activo', label: 'Estado', type: 'boolean' }
    ],

    // OPCIONAL: Filtros
    filters: [
        {
            key: 'activo',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ]
        }
    ],

    // OPCIONAL: Permisos
    permissions: {
        create: 'entidades.create',
        edit: 'entidades.edit',
        delete: 'entidades.delete',
        view: 'entidades.show'
    },

    // OPCIONAL: Búsqueda
    searchPlaceholder: 'Buscar entidades...'
}

export default function Index({ entidades, filters }) {
    return (
        <GenericIndexPage<MiEntidad, MiEntidadFormData>
            data={entidades}
            config={config}
            service={miEntidadService}
            filters={filters}
        />
    )
}
```

### Paso 2: ¡Listo!

Eso es todo. Ahora tienes:
- ✅ Tabla con todas las columnas
- ✅ Búsqueda funcional
- ✅ Filtros dinámicos
- ✅ Paginación
- ✅ Sorting en columnas
- ✅ Botones de acciones (Editar, Eliminar, Ver)
- ✅ Control de permisos
- ✅ Estados de carga
- ✅ Breadcrumbs

---

## 📦 Componentes

### GenericIndexPage

Componente principal para páginas de listado CRUD.

#### Props

```typescript
interface GenericIndexPageProps<T, F> {
    data: Pagination<T>          // Datos paginados del backend
    config: CrudConfig<T>        // Configuración del CRUD
    service: BaseService<T, F>   // Servicio para operaciones
    filters?: Filters            // Filtros iniciales (opcional)
    breadcrumbs?: BreadcrumbItem[] // Breadcrumbs personalizados (opcional)
    extraContent?: React.ReactNode // Contenido extra (opcional)
}
```

#### Ejemplo

```typescript
<GenericIndexPage
    data={estudiantes}
    config={estudiantesConfig}
    service={estudiantesService}
    filters={filters}
/>
```

### GenericFormPage

Componente principal para páginas de formularios (Crear/Editar).

#### Props

```typescript
interface GenericFormPageProps<T, F> {
    entity?: T | null            // Entidad a editar (null para crear)
    service: BaseService<T, F>   // Servicio para operaciones
    formFields: FormField<F>[]   // Campos del formulario
    initialData: F               // Datos iniciales
    name: string                 // Nombre singular
    pluralName: string           // Nombre plural
    title?: string               // Título personalizado (opcional)
    description?: string         // Descripción (opcional)
    breadcrumbs?: BreadcrumbItem[] // Breadcrumbs (opcional)
    extraData?: Record<string, unknown> // Datos extra (opcional)
}
```

#### Ejemplo

```typescript
<GenericFormPage
    service={estudiantesService}
    formFields={estudianteFormFields}
    initialData={initialData}
    name="estudiante"
    pluralName="estudiantes"
/>
```

### GenericFilters

Componente de filtros dinámicos.

#### Props

```typescript
interface GenericFiltersProps {
    filters: FilterField[]       // Configuración de filtros
    values: Filters              // Valores actuales
    onChange: (key: string, value: unknown) => void
    onApply: () => void          // Aplicar filtros
    onClear: () => void          // Limpiar filtros
    activeCount?: number         // Cantidad de filtros activos
    disabled?: boolean
}
```

### GenericSearchBar

Barra de búsqueda con botón de limpiar.

#### Props

```typescript
interface GenericSearchBarProps {
    value: string
    onChange: (value: string) => void
    onSearch: (e?: React.FormEvent) => void
    onClear?: () => void
    placeholder?: string
    disabled?: boolean
}
```

---

## 🪝 Hooks

### use-generic-list

Hook principal para gestionar listados CRUD.

#### Uso

```typescript
const {
    entities,           // Datos actuales
    pagination,         // Info de paginación
    searchTerm,         // Término de búsqueda
    setSearchTerm,      // Actualizar búsqueda
    filters,            // Filtros activos
    hasActiveFilters,   // Hay filtros activos?
    sortBy,             // Columna de ordenamiento
    sortDirection,      // Dirección (asc/desc)
    isLoading,          // Estado de carga

    // Acciones
    handleSearch,       // Ejecutar búsqueda
    clearFilters,       // Limpiar filtros
    goToCreate,         // Navegar a crear
    goToEdit,           // Navegar a editar
    goToShow,           // Navegar a ver
    handleDelete,       // Eliminar entidad
    handleSort,         // Ordenar columna
    applyFilters,       // Aplicar filtros
} = useGenericList({ data, config, service, initialFilters })
```

### use-generic-filters

Hook para gestionar filtros de forma independiente.

#### Uso

```typescript
const {
    filters,            // Filtros actuales
    hasActiveFilters,   // Hay filtros?
    activeFiltersCount, // Cantidad de filtros

    // Acciones
    updateFilter,       // Actualizar un filtro
    updateFilters,      // Actualizar múltiples
    clearFilters,       // Limpiar todos
    applyFilters,       // Aplicar filtros
    resetFilters,       // Resetear todo

    // Utilidades
    getFilterValue,     // Obtener valor
    getDefaultFilters,  // Obtener defaults
} = useGenericFilters({ initialFilters, filterFields })
```

### use-generic-form

Hook para gestionar formularios (ya existía, mejorado).

#### Uso

```typescript
const {
    data,               // Datos del formulario
    errors,             // Errores de validación
    processing,         // Estado de procesamiento

    // Acciones
    handleSubmit,       // Submit del formulario
    handleFieldChange,  // Cambiar campo
    handleReset,        // Resetear formulario

    // Estado
    isEditing,          // Modo edición?
} = useGenericForm(entity, service, initialData)
```

---

## 💡 Ejemplos Completos

### Ejemplo 1: CRUD Básico (Estudiantes)

#### 1. Página de Listado (Index.tsx)

```typescript
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { estudiantesService } from '@/services/estudiantes.service'
import { Badge } from '@/components/ui/badge'

const config: CrudConfig<Estudiante> = {
    name: 'estudiante',
    pluralName: 'estudiantes',

    columns: [
        { key: 'id', label: 'ID', type: 'number', sortable: true },
        {
            key: 'name',
            label: 'Estudiante',
            type: 'custom',
            sortable: true,
            render: (value, entity) => (
                <div>
                    <div className="font-medium">
                        {entity.name} {entity.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                        @{entity.usernick}
                    </div>
                </div>
            )
        },
        { key: 'email', label: 'Email', type: 'text', sortable: true },
        {
            key: 'activo',
            label: 'Estado',
            type: 'boolean',
            render: (value) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        }
    ],

    filters: [
        {
            key: 'activo',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ]
        }
    ],

    permissions: {
        create: 'estudiantes.create',
        edit: 'estudiantes.edit',
        delete: 'estudiantes.delete',
        view: 'estudiantes.show'
    }
}

export default function Index({ estudiantes, filters }) {
    return (
        <GenericIndexPage
            data={estudiantes}
            config={config}
            service={estudiantesService}
            filters={filters}
        />
    )
}
```

#### 2. Página de Crear (Create.tsx)

```typescript
import GenericFormPage from '@/components/generic/crud/GenericFormPage'
import { estudiantesService } from '@/services/estudiantes.service'

const formFields: FormField<EstudianteFormData>[] = [
    { key: 'name', label: 'Nombre', type: 'text', required: true },
    { key: 'apellido', label: 'Apellido', type: 'text' },
    { key: 'email', label: 'Email', type: 'text', required: true },
    { key: 'usernick', label: 'Usuario', type: 'text', required: true },
    { key: 'password', label: 'Contraseña', type: 'text', required: true },
]

const initialData: EstudianteFormData = {
    name: '',
    apellido: '',
    email: '',
    usernick: '',
    password: '',
    password_confirmation: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    activo: true,
    permissions: []
}

export default function Create({ roles, permissions }) {
    return (
        <GenericFormPage
            service={estudiantesService}
            formFields={formFields}
            initialData={initialData}
            name="estudiante"
            pluralName="estudiantes"
            extraData={{ roles, permissions }}
        />
    )
}
```

### Ejemplo 2: CRUD con Filtros Avanzados

```typescript
const config: CrudConfig<Producto> = {
    name: 'producto',
    pluralName: 'productos',

    columns: [
        { key: 'id', label: 'ID', type: 'number' },
        { key: 'nombre', label: 'Producto', type: 'text', sortable: true },
        { key: 'precio', label: 'Precio', type: 'number', sortable: true },
        { key: 'stock', label: 'Stock', type: 'number', sortable: true },
        { key: 'categoria', label: 'Categoría', type: 'text' }
    ],

    // Múltiples filtros
    filters: [
        {
            key: 'categoria_id',
            label: 'Categoría',
            type: 'select',
            options: [
                { value: '1', label: 'Electrónica' },
                { value: '2', label: 'Ropa' },
                { value: '3', label: 'Alimentos' }
            ]
        },
        {
            key: 'precio_min',
            label: 'Precio Mínimo',
            type: 'number',
            placeholder: '0'
        },
        {
            key: 'precio_max',
            label: 'Precio Máximo',
            type: 'number',
            placeholder: '1000'
        },
        {
            key: 'en_stock',
            label: 'En Stock',
            type: 'boolean'
        },
        {
            key: 'fecha_desde',
            label: 'Fecha Desde',
            type: 'date'
        }
    ]
}
```

### Ejemplo 3: Columnas con Renderizado Personalizado

```typescript
const config: CrudConfig<Usuario> = {
    name: 'usuario',
    pluralName: 'usuarios',

    columns: [
        {
            key: 'avatar',
            label: 'Avatar',
            type: 'custom',
            render: (value, entity) => (
                <img
                    src={entity.avatar || '/default-avatar.png'}
                    alt={entity.name}
                    className="h-10 w-10 rounded-full"
                />
            )
        },
        {
            key: 'name',
            label: 'Usuario',
            type: 'custom',
            render: (value, entity) => (
                <div>
                    <div className="font-medium">{entity.name}</div>
                    <div className="text-xs text-gray-500">
                        {entity.roles.map(r => r.name).join(', ')}
                    </div>
                </div>
            )
        },
        {
            key: 'created_at',
            label: 'Registro',
            type: 'custom',
            render: (value) => {
                const date = new Date(value as string)
                const relative = formatDistanceToNow(date, { locale: es })
                return <span title={date.toLocaleString()}>Hace {relative}</span>
            }
        }
    ]
}
```

---

## 🎨 Mejores Prácticas

### 1. Organización de Archivos

```
pages/
└── MiEntidad/
    ├── Index.tsx           ← Usa GenericIndexPage
    ├── Create.tsx          ← Usa GenericFormPage
    ├── Edit.tsx            ← Usa GenericFormPage
    ├── Show.tsx            ← Vista de detalles custom
    └── config.ts           ← Configuración compartida (opcional)
```

### 2. Configuración Compartida

Extrae la configuración a un archivo separado si la usarás en múltiples lugares:

```typescript
// pages/Estudiantes/config.ts
export const estudiantesConfig: CrudConfig<Estudiante> = {
    name: 'estudiante',
    pluralName: 'estudiantes',
    columns: [/* ... */],
    filters: [/* ... */]
}

export const estudianteFormFields: FormField<EstudianteFormData>[] = [/* ... */]
```

```typescript
// pages/Estudiantes/Index.tsx
import { estudiantesConfig } from './config'

export default function Index({ estudiantes, filters }) {
    return <GenericIndexPage data={estudiantes} config={estudiantesConfig} {...} />
}
```

### 3. Type Safety

Siempre especifica los tipos genéricos:

```typescript
// ✅ CORRECTO
<GenericIndexPage<Estudiante, EstudianteFormData>
    data={estudiantes}
    config={config}
    service={service}
/>

// ❌ INCORRECTO (pierde type safety)
<GenericIndexPage
    data={estudiantes}
    config={config}
    service={service}
/>
```

### 4. Renderizado Custom

Usa `render` para columnas complejas:

```typescript
{
    key: 'precio',
    label: 'Precio',
    type: 'custom',
    render: (value, entity) => (
        <div className="text-right">
            <span className="font-bold">
                {formatCurrency(value as number)}
            </span>
            {entity.descuento && (
                <span className="text-green-600 text-xs ml-2">
                    -{entity.descuento}%
                </span>
            )}
        </div>
    )
}
```

### 5. Permisos Opcionales

Los permisos son opcionales. Si no los especificas, no se validarán:

```typescript
// Con permisos
permissions: {
    create: 'productos.create',
    edit: 'productos.edit',
    delete: 'productos.delete'
}

// Sin permisos (todos pueden todo)
// No incluyas la propiedad 'permissions'
```

---

## 🔧 Troubleshooting

### Problema: "Property 'data' does not exist"

**Causa**: El backend no está devolviendo la estructura de paginación correcta.

**Solución**: Asegúrate de que el backend devuelve:
```php
return Inertia::render('Entidades/Index', [
    'entidades' => [
        'data' => $entidades->items(),
        'links' => $entidades->links(),
        'total' => $entidades->total(),
        // ...
    ]
]);
```

### Problema: Los filtros no se aplican

**Causa**: El servicio no está construyendo los query params correctamente.

**Solución**: Verifica que tu servicio tenga el método `search`:
```typescript
search(filters: Filters) {
    const queryParams = this.buildQueryParams(filters)
    router.get(this.indexUrl(), queryParams, {
        preserveState: true,
        preserveScroll: true
    })
}
```

### Problema: La paginación no funciona

**Causa**: Los links de paginación no están en el formato correcto.

**Solución**: Laravel debe devolver:
```php
[
    'links' => [
        ['url' => '...', 'label' => 'Previous', 'active' => false],
        ['url' => '...', 'label' => '1', 'active' => true],
        // ...
    ]
]
```

### Problema: Type errors en TypeScript

**Causa**: Los tipos genéricos no coinciden.

**Solución**: Asegúrate de que:
1. Tu entidad extiende `BaseEntity`
2. Tu form data extiende `BaseFormData`
3. Pasas los tipos correctos a los componentes

```typescript
// ✅ CORRECTO
interface Estudiante extends BaseEntity {
    id: number
    name: string
    // ...
}

interface EstudianteFormData extends BaseFormData {
    name: string
    // ...
}
```

---

## 📚 Referencia Rápida

### CrudConfig

```typescript
{
    name: string                   // REQUERIDO: nombre singular
    pluralName: string             // REQUERIDO: nombre plural
    columns: TableColumn[]         // REQUERIDO: columnas de la tabla
    title?: string                 // Título personalizado
    description?: string           // Descripción
    filters?: FilterField[]        // Filtros dinámicos
    searchPlaceholder?: string     // Placeholder de búsqueda
    permissions?: CrudPermissions  // Permisos de acceso
    customActions?: CustomAction[] // Acciones personalizadas
}
```

### TableColumn

```typescript
{
    key: keyof T                   // REQUERIDO: clave de la entidad
    label: string                  // REQUERIDO: etiqueta a mostrar
    type: 'text' | 'number' | 'boolean' | 'date' | 'custom'
    sortable?: boolean             // Permite ordenamiento
    render?: (value, entity) => ReactNode  // Renderizado custom
}
```

### FilterField

```typescript
{
    key: string                    // REQUERIDO: clave del filtro
    label: string                  // REQUERIDO: etiqueta
    type: 'text' | 'select' | 'boolean' | 'date' | 'number'
    placeholder?: string           // Placeholder
    options?: Array<{value, label}> // Opciones para select
    defaultValue?: unknown         // Valor por defecto
}
```

---

## 🎓 Siguiente Paso

Prueba el sistema con tus propios módulos:

1. Copia `IndexGeneric.tsx` como plantilla
2. Adapta la configuración a tu entidad
3. Reemplaza el Index.tsx original
4. ¡Disfruta de 75% menos código!

**¿Preguntas?** Revisa los ejemplos en `pages/Estudiantes/IndexGeneric.tsx`
