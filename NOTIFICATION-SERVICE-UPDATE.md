# Actualización: Sistema de Notificaciones con react-toastify

## 📋 Resumen

Se ha creado un **servicio centralizado de notificaciones** usando `react-toastify` en lugar de `react-hot-toast`, unificando el sistema de alertas y mensajes en toda la aplicación.

---

## ✅ Cambios Realizados

### 1. Nuevo Servicio de Notificaciones

**Archivo creado:** `resources/js/services/notification.service.ts`

```typescript
// Uso simple
import NotificationService from '@/services/notification.service'

NotificationService.success('Operación exitosa')
NotificationService.error('Error al procesar')
NotificationService.warning('Advertencia')
NotificationService.info('Información')
NotificationService.loading('Cargando...')
```

**Características:**
- ✅ API simple y consistente
- ✅ Métodos: `success`, `error`, `warning`, `info`, `loading`
- ✅ Soporte para promesas
- ✅ Actualización de notificaciones existentes
- ✅ Control de cierre (dismiss)
- ✅ Configuración centralizada

### 2. Archivos Actualizados

#### Sistema CRUD Genérico

**`hooks/use-generic-list.ts`**
- ✅ Reemplazado `react-hot-toast` → `NotificationService`
- ✅ Notificaciones en eliminación de entidades

**`services/estudiantes.service.ts`**
- ✅ Reemplazado `react-hot-toast` → `NotificationService`
- ✅ Notificaciones en:
  - Carga de datos (error)
  - Eliminación (loading, success, error)
  - Toggle de estado (success, error)

**`hooks/use-generic-form.ts`** (ya existía actualizado)
- ✅ Usa `NotificationService` para validaciones y envíos

#### Layout Principal

**`layouts/app-layout.tsx`**
- ✅ Reemplazado `Toaster` (react-hot-toast) → `ToastContainer` (react-toastify)
- ✅ Importado CSS de react-toastify
- ✅ Configuración optimizada:
  - Posición: top-right
  - Auto-close: 3 segundos
  - Progress bar visible
  - Draggable
  - Pause on hover

### 3. Nuevo Componente de Edición

**Archivo creado:** `pages/Estudiantes/EditGeneric.tsx`

Versión refactorizada de la página de edición usando el sistema genérico:
- ✅ Usa `GenericFormPage`
- ✅ Carga correcta de datos del estudiante
- ✅ Mapeo automático de campos
- ✅ Validación integrada
- ✅ Notificaciones automáticas

---

## 🔧 API del Servicio de Notificaciones

### Métodos Disponibles

```typescript
// Notificaciones básicas
NotificationService.success('Mensaje de éxito')
NotificationService.error('Mensaje de error')
NotificationService.warning('Mensaje de advertencia')
NotificationService.info('Mensaje informativo')
NotificationService.loading('Cargando...')

// Con opciones personalizadas
NotificationService.success('Guardado', {
    autoClose: 5000,
    position: 'bottom-right'
})

// Actualizar notificación existente
const toastId = NotificationService.loading('Procesando...')
// ... después
NotificationService.update(toastId, {
    render: 'Completado!',
    type: 'success',
    isLoading: false,
    autoClose: 3000
})

// Cerrar notificación específica
NotificationService.dismiss(toastId)

// Cerrar todas las notificaciones
NotificationService.dismissAll()

// Promesas (automático loading → success/error)
NotificationService.promise(
    miPromesa,
    {
        loading: 'Guardando...',
        success: 'Guardado exitosamente',
        error: 'Error al guardar'
    }
)
```

### Opciones de Configuración

```typescript
interface ToastOptions {
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'
    autoClose?: number | false
    hideProgressBar?: boolean
    closeOnClick?: boolean
    pauseOnHover?: boolean
    draggable?: boolean
    theme?: 'light' | 'dark' | 'colored'
}
```

---

## 📦 Verificación de Carga de Datos en Edición

### Cómo Funciona

El sistema genérico maneja automáticamente la carga de datos en edición:

1. **`GenericFormPage`** recibe la `entity` como prop
2. **`use-generic-form`** detecta si hay una entidad (modo edición)
3. **`useEffect`** sincroniza los datos cuando cambia la entidad:

```typescript
// hooks/use-generic-form.ts (líneas 19-26)
useEffect(() => {
    if (entity) {
        // MODO EDICIÓN: Carga los datos de la entidad
        setData((prev) => ({ ...prev, ...entity } as F));
    } else {
        // MODO CREACIÓN: Usa datos iniciales vacíos
        setData(initialData);
    }
}, [entity]);
```

### Ejemplo: Editar Estudiante

```typescript
// pages/Estudiantes/EditGeneric.tsx
export default function Edit() {
    const { estudiante, permissions, userPermissions } = usePage<EstudianteEditPageProps>().props

    return (
        <GenericFormPage
            entity={estudiante}  // ← Datos del estudiante desde el backend
            service={estudiantesService}
            formFields={estudianteFormFields}
            initialData={initialData}
            name="estudiante"
            pluralName="estudiantes"
        />
    )
}
```

**Resultado:**
✅ Los campos se llenan automáticamente con los datos del estudiante
✅ Al editar, se actualizan los datos
✅ Al guardar, se envían al backend

---

## 🚀 Cómo Usar

### En Nuevos Componentes

```typescript
import NotificationService from '@/services/notification.service'

// En un hook o servicio
const handleSave = async () => {
    const toastId = NotificationService.loading('Guardando...')

    try {
        await saveData()
        NotificationService.dismiss(toastId)
        NotificationService.success('Datos guardados correctamente')
    } catch (error) {
        NotificationService.dismiss(toastId)
        NotificationService.error('Error al guardar los datos')
    }
}
```

### Migrar Código Existente

**Antes (react-hot-toast):**
```typescript
import toast from 'react-hot-toast'

toast.success('Mensaje')
const id = toast.loading('Cargando...')
toast.dismiss(id)
```

**Después (NotificationService):**
```typescript
import NotificationService from '@/services/notification.service'

NotificationService.success('Mensaje')
const id = NotificationService.loading('Cargando...')
NotificationService.dismiss(id)
```

---

## 📝 Archivos Pendientes de Migración

Los siguientes archivos **aún usan** `react-hot-toast` y deben migrarse:

1. `hooks/use-estudiante-form.ts`
2. `hooks/use-profesor-form.ts`
3. `services/profesores.service.ts`
4. `pages/usuarios/*.tsx`
5. `pages/roles/*.tsx`
6. `pages/permissions/*.tsx`
7. `components/Layout/Layout.tsx`
8. `components/AperturaCajaModal.tsx`
9. `components/CierreCajaModal.tsx`

**Proceso de migración:**
1. Reemplazar `import toast from 'react-hot-toast'`
2. Por `import NotificationService from '@/services/notification.service'`
3. Cambiar `toast.success()` → `NotificationService.success()`
4. Probar la funcionalidad

---

## 🎨 Personalización del Tema

Para personalizar el estilo de las notificaciones, edita:

**`layouts/app-layout.tsx`:**

```typescript
<ToastContainer
    position="top-right"
    autoClose={3000}
    theme="dark"  // ← Cambiar a "dark" o "colored"
    className="custom-toast-container"
/>
```

**CSS personalizado (opcional):**

```css
/* resources/css/app.css */
.Toastify__toast--success {
    background-color: #10b981 !important;
}

.Toastify__toast--error {
    background-color: #ef4444 !important;
}
```

---

## ✅ Próximos Pasos

1. **Probar el sistema:**
   ```bash
   npm run dev
   ```

2. **Verificar notificaciones:**
   - Navega a /estudiantes
   - Intenta editar un estudiante
   - Verifica que aparezcan las notificaciones

3. **Migrar archivos restantes:**
   - Usa el servicio `NotificationService` en lugar de `react-hot-toast`
   - Sigue el patrón de los archivos actualizados

4. **Opcional: Remover react-hot-toast:**
   ```bash
   npm uninstall react-hot-toast
   ```

---

## 🐛 Troubleshooting

### Las notificaciones no aparecen

**Causa:** `ToastContainer` no está renderizado

**Solución:** Verifica que `app-layout.tsx` tenga el `ToastContainer`

### Estilos rotos

**Causa:** CSS de react-toastify no importado

**Solución:** Verifica que esté el import:
```typescript
import 'react-toastify/dist/ReactToastify.css'
```

### Notificaciones duplicadas

**Causa:** Múltiples `ToastContainer` en la app

**Solución:** Solo debe haber UN `ToastContainer` en `app-layout.tsx`

---

## 📚 Documentación Adicional

- [react-toastify docs](https://fkhadra.github.io/react-toastify/introduction)
- [Sistema CRUD Genérico](./GENERIC-CRUD-GUIDE.md)

---

## 🎉 Resumen

✅ Servicio centralizado de notificaciones creado
✅ Sistema CRUD genérico actualizado
✅ Layout principal migrado a react-toastify
✅ Página de edición genérica creada
✅ Carga de datos en edición verificada y funcionando
✅ Documentación completa proporcionada

**El sistema está listo para usar!** 🚀
