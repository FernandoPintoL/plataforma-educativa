# 🔔 NOTIFICACIONES EN TIEMPO REAL - DOCUMENTACIÓN COMPLETA

**Fecha:** 16 de Noviembre 2025
**Status:** ✅ IMPLEMENTADO Y FUNCIONAL
**Versión:** 1.0
**Tecnología:** Server-Sent Events (SSE)

---

## 📋 RESUMEN EJECUTIVO

Se ha implementado un **sistema completo de notificaciones en tiempo real** que:

✅ Usa **Server-Sent Events (SSE)** en lugar de WebSocket (más simple y eficiente)
✅ Se integra automáticamente con el **ML Pipeline**
✅ Proporciona **notificaciones de éxito y error**
✅ Detecta estudiantes en **riesgo académico alto**
✅ Tiene **reconexión automática** y **heartbeat**
✅ Incluye **componente visual** en el header
✅ Proporciona **página completa** de notificaciones

**Resultado:** Los usuarios recibirán notificaciones en tiempo real cuando:
- El pipeline ML completa el entrenamiento
- Hay errores en el pipeline
- Se detectan estudiantes en riesgo alto

---

## 🏗️ ARQUITECTURA

```
┌─────────────────────────────────────────────────────────┐
│               CLIENTE (React/Browser)                   │
│  ┌──────────────────────────────────────────────────┐   │
│  │  EventSource("/api/notificaciones/stream")       │   │
│  │  • Conexión SSE bidireccional                    │   │
│  │  • Escucha eventos del servidor                  │   │
│  │  • Reconexión automática                         │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────┬──────────────────────────────────────┘
                 │
      ┌──────────▼──────────────────────┐
      │    HTTP/SSE (Streaming)        │
      │  • text/event-stream           │
      │  • Keep-alive con heartbeat    │
      │  • Polling cada 2 segundos     │
      └──────────┬─────────────────────┘
                 │
      ┌──────────▼──────────────────────────┐
      │  NotificacionController             │
      │  • stream() → SSE endpoint          │
      │  • index() → Listar                 │
      │  • getNoLeidas() → No leídas        │
      │  • marcarLeido() → Marcar           │
      │  • eliminar() → Borrar              │
      └──────────┬──────────────────────────┘
                 │
      ┌──────────▼──────────────────────────┐
      │  MLPipelineService (Triggers)       │
      │  • crearNotificacionesExito()       │
      │  • crearNotificacionesError()       │
      │  • crearNotificacionesRiesgoAlto()  │
      └──────────┬──────────────────────────┘
                 │
      ┌──────────▼──────────────────────────┐
      │      Base de Datos                  │
      │      Tabla: notificaciones          │
      │      • id, titulo, contenido        │
      │      • tipo, leido, fecha           │
      │      • destinatario_id              │
      └─────────────────────────────────────┘
```

---

## 📁 ARCHIVOS CREADOS

### Backend (Laravel)

#### 1. **app/Http/Controllers/Api/NotificacionController.php** (NEW - 295 líneas)

Controlador principal para notificaciones.

**Métodos principales:**

- `index(Request $request)` - Obtener notificaciones del usuario
  ```
  GET /api/notificaciones
  Parámetros: limit=50, tipo=?
  Retorna: Array de notificaciones con información completa
  ```

- `getNoLeidas(Request $request)` - Obtener solo no leídas
  ```
  GET /api/notificaciones/no-leidas
  Retorna: Array de notificaciones no leídas
  ```

- `stream(Request $request)` - **SSE Stream** ⭐
  ```
  GET /api/notificaciones/stream
  Retorna: Event stream con eventos 'notificacion' y 'heartbeat'
  Headers: Content-Type: text/event-stream
  ```

- `marcarLeido(Request $request, Notificacion $notificacion)`
  ```
  PUT /api/notificaciones/{id}/leido
  Marca notificación como leída
  ```

- `marcarNoLeido(Request $request, Notificacion $notificacion)`
  ```
  PUT /api/notificaciones/{id}/no-leido
  Marca notificación como no leída
  ```

- `marcarTodasLeidas(Request $request)`
  ```
  PUT /api/notificaciones/marcar/todas-leidas
  Marca todas como leídas
  ```

- `eliminar(Request $request, Notificacion $notificacion)`
  ```
  DELETE /api/notificaciones/{id}
  Elimina notificación
  ```

- `estadisticas(Request $request)` - Estadísticas
  ```
  GET /api/notificaciones/estadisticas
  Retorna: total, no_leidas, leidas, recientes_24h, porcentaje_leidas
  ```

- `crearNotificacion()` - Método estático para crear notificaciones
- `crearParaMultiplesUsuarios()` - Crear para múltiples usuarios

### 2. **app/Services/MLPipelineService.php** (MODIFIED)

Se agregaron 3 métodos para crear notificaciones:

- `crearNotificacionesExito(array $results)`
  ```
  Notifica a admins y directores cuando el pipeline completa
  Tipo: 'exito' para admins, 'info' para directores
  Incluye: statistics, timestamp, URL a análisis de riesgo
  ```

- `crearNotificacionesError(array $errors)`
  ```
  Notifica a admins cuando hay errores
  Tipo: 'alerta'
  Incluye: lista de errores, timestamp
  ```

- `crearNotificacionesRiesgoAlto()`
  ```
  Notifica a profesores de estudiantes en riesgo alto
  Tipo: 'alerta'
  Incluye: cantidad, timestamp, URL a análisis
  ```

### Frontend (React/TypeScript)

#### 3. **resources/js/services/notificacionesApi.ts** (NEW - 300+ líneas)

Servicio para consumir API de notificaciones.

```typescript
// Métodos principales:
obtenerNotificaciones(limite: number, tipo?: string)
obtenerNoLeidas()
obtenerEstadisticas()
marcarLeido(id: number)
marcarNoLeido(id: number)
marcarTodasLeidas()
eliminar(id: number)

// SSE Connection:
conectarSSE(onNotificacion, onError)
desconectarSSE()
estaConectado()
obtenerEstadoConexion()
reconectar(onNotificacion, onError, reintentos)
```

#### 4. **resources/js/components/NotificacionCenter.tsx** (NEW - 400+ líneas)

Componente visual del centro de notificaciones.

**Características:**
- Dropdown con lista de notificaciones
- Conexión automática a SSE
- Badge con contador de no leídas
- Indicador de conexión (verde/rojo)
- Marcar como leído/no leído
- Eliminar notificaciones
- Marcar todas como leídas
- Animaciones y transiciones suaves

**Props:** Ninguno (usa hooks)

**Estados:**
- notificaciones: Array de notificaciones
- noLeidas: Contador
- abierto: Dropdown abierto/cerrado
- cargando: Estado de carga
- conectado: Estado SSE

#### 5. **resources/js/pages/Notificaciones/Index.tsx** (NEW - 500+ líneas)

Página completa de notificaciones.

**Características:**
- Listado completo de notificaciones
- Búsqueda en tiempo real
- Filtro por tipo
- Estadísticas (total, no leídas, leídas, últimas 24h)
- Selección múltiple
- Acciones masivas
- Paginación implícita (carga 1000)
- Interfaz responsiva

**Filtros disponibles:**
- Todas
- General
- Tarea
- Evaluación
- Calificación
- Recomendación
- Recordatorio
- Alerta
- Éxito
- Error
- Información

### 6. **resources/js/components/app-sidebar-header.tsx** (MODIFIED)

Se agregó NotificacionCenter al header principal.

---

## 🚀 CÓMO USAR

### Desde el Frontend

#### Conectar al SSE Stream:

```typescript
import notificacionesApi from '@/services/notificacionesApi'

// Conectar al stream
notificacionesApi.conectarSSE(
    (notificacion) => {
        console.log('Nueva notificación:', notificacion)
        // Hacer algo con la notificación
    },
    (error) => {
        console.error('Error SSE:', error)
    }
)

// Desconectar
notificacionesApi.desconectarSSE()
```

#### Obtener notificaciones:

```typescript
// Todas
const respuesta = await notificacionesApi.obtenerNotificaciones(50)

// No leídas
const noLeidas = await notificacionesApi.obtenerNoLeidas()

// Estadísticas
const stats = await notificacionesApi.obtenerEstadisticas()
```

#### Marcar como leído:

```typescript
await notificacionesApi.marcarLeido(123)
```

### Desde el Backend

#### Crear notificación:

```php
use App\Models\Notificacion;
use App\Models\User;

$usuario = User::find(1);

Notificacion::crearParaUsuario(
    $usuario,
    'Título de la notificación',
    'Contenido de la notificación',
    'exito', // tipo
    ['url' => '/analisis-riesgo'] // datos adicionales
);
```

#### Crear para múltiples usuarios:

```php
use App\Http\Controllers\Api\NotificacionController;

NotificacionController::crearParaMultiplesUsuarios(
    [1, 2, 3, 4], // IDs de usuarios
    'Título',
    'Contenido',
    'info',
    ['extra' => 'datos']
);
```

#### ML Pipeline dispara notificaciones automáticamente:

```php
// En executePipeline():
$this->crearNotificacionesExito($results); // Al completar
$this->crearNotificacionesError($errors);  // Al fallar
$this->crearNotificacionesRiesgoAlto();    // Detectar riesgo
```

---

## 📊 ESTRUCTURA DE DATOS

### Modelo Notificacion (Existente)

```php
$notificacion = [
    'id' => 1,
    'titulo' => 'Pipeline ML Completado',
    'contenido' => 'Se generaron 58 predicciones...',
    'tipo' => 'exito', // general|tarea|evaluacion|calificacion|recomendacion|recordatorio|alerta|exito|error|info
    'leido' => false,
    'fecha' => '2025-11-16T14:30:00Z',
    'destinatario_id' => 1,
    'datos_adicionales' => [
        'url' => '/analisis-riesgo',
        'pipeline_stats' => [...],
        'timestamp' => '2025-11-16T14:30:00Z'
    ],
    'created_at' => '2025-11-16T14:30:00Z',
    'updated_at' => '2025-11-16T14:30:00Z'
]
```

### Información Procesada (obtenerInformacion())

```php
[
    'id' => 1,
    'titulo' => 'Pipeline ML Completado',
    'contenido' => 'Se generaron 58 predicciones...',
    'tipo' => 'exito',
    'icono' => '✅', // emoji según tipo
    'color' => 'green', // color según tipo
    'leido' => false,
    'fecha' => '16/11/2025 14:30',
    'tiempo_transcurrido' => 'Hace 5 minutos',
    'es_reciente' => true,
    'datos_adicionales' => [...]
]
```

---

## 🔄 FLUJO DE EVENTOS

### Cuando el ML Pipeline se completa:

```
1. MLPipelineService::executePipeline() → Success
   ↓
2. $this->crearNotificacionesExito($results)
   ↓
3. Se crean Notificacion records en BD
   ↓
4. Cliente recibe evento SSE: "notificacion"
   ↓
5. React actualiza contador y muestra notificación toast
   ↓
6. Usuario ve badge rojo con contador
```

### Cuando el usuario abre el dropdown:

```
1. NotificacionCenter monta
   ↓
2. conectarSSE() establece conexión EventSource
   ↓
3. Servidor envía notificaciones existentes no leídas
   ↓
4. Cliente recibe "event: notificacion"
   ↓
5. React renderiza dropdown con notificaciones
   ↓
6. Servidor envía "heartbeat" cada 30 segundos
```

### Cuando el usuario marca como leído:

```
1. Usuario hace click en "Marcar leído"
   ↓
2. notificacionesApi.marcarLeido(id)
   ↓
3. PUT /api/notificaciones/{id}/leido
   ↓
4. Backend actualiza BD
   ↓
5. React actualiza estado local
   ↓
6. Badge se decrementa
```

---

## 🛠️ CONFIGURACIÓN

### Environment Variables (Opcional)

```bash
# .env
NOTIFICATIONS_ENABLED=true
NOTIFICATIONS_CLEANUP_DAYS=30
NOTIFICATIONS_BATCH_SIZE=50
```

### Scheduler para Limpiar Notificaciones Antiguas

Ya está configurado en `app/Console/Kernel.php`:

```php
// Limpiar notificaciones mayores a 90 días
// Ejecutado automáticamente los sábados a las 4:00 AM
Notificacion::limpiarAntiguas(90);
```

---

## 📈 TIPOS DE NOTIFICACIONES

| Tipo | Icono | Color | Caso de uso |
|------|-------|-------|-----------|
| general | 📢 | blue | Notificaciones generales |
| tarea | 📝 | green | Tareas asignadas |
| evaluacion | 📊 | purple | Evaluaciones |
| calificacion | 🎯 | yellow | Calificaciones recibidas |
| recomendacion | 💡 | orange | Recomendaciones personales |
| recordatorio | ⏰ | gray | Recordatorios |
| alerta | ⚠️ | red | Alertas importantes |
| exito | ✅ | green | Operaciones exitosas |
| error | ❌ | red | Errores |
| info | ℹ️ | blue | Información |

---

## ✅ VERIFICACIÓN

### 1. Verificar que el endpoint SSE funciona:

```bash
curl -i http://localhost/api/notificaciones/stream \
  -H "Authorization: Bearer TOKEN"
```

Debe retornar:
```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: notificacion
data: {"id":1,"titulo":"..."}

event: heartbeat
data: {"status":"ok"}
```

### 2. Verificar que se crean notificaciones:

```bash
php artisan tinker

>>> \App\Models\Notificacion::count()
5

>>> \App\Models\Notificacion::latest()->first()
// Debe mostrar notificaciones recientes
```

### 3. Verificar el componente en el frontend:

1. Acceder a cualquier página protegida
2. Debería ver el icono de campana en el header
3. Hacer click debería mostrar dropdown
4. Si hay notificaciones no leídas, debe haber un badge rojo

### 4. Probar pipeline con notificaciones:

```bash
php artisan ml:train --limit=50
```

Debería crear notificaciones de éxito/error para admins y directores.

---

## 🐛 SOLUCIÓN DE PROBLEMAS

### Problema: "Conexión SSE no se establece"

**Solución:**
```
✓ Verificar que el servidor soporta HTTP/1.1
✓ Revisar CORS si está en dominio diferente
✓ Revisar logs: tail -f storage/logs/laravel.log
✓ Verificar autenticación: Bearer token válido
```

### Problema: "Notificaciones no llegan en tiempo real"

**Solución:**
```
✓ Verificar que obtenerInformacion() retorna datos
✓ Revisar que la conexión SSE está abierta
✓ Comprobar que no hay buffering en nginx
✓ Aumentar timeout si es necesario
```

### Problema: "Las notificaciones se pierden"

**Solución:**
```
✓ Verificar heartbeat cada 30 segundos
✓ Reconexión automática está habilitada
✓ Aumentar límite de conexiones simultáneas
✓ Usar load balancer con sticky sessions
```

### Problema: "El componente NotificacionCenter no aparece"

**Solución:**
```
✓ Verificar que está importado en app-sidebar-header.tsx
✓ Revisar que el componente está en la ruta correcta
✓ Limpiar caché: npm run dev
✓ Reiniciar servidor
```

---

## 📊 ESTADÍSTICAS

Cada usuario puede ver sus estadísticas en `/notificaciones`:

```
Total: 45
No leídas: 5
Leídas: 40
Últimas 24h: 12
Porcentaje leído: 88.89%
```

---

## 🔐 SEGURIDAD

✅ **Autenticación:** Requiere middleware `auth:sanctum`
✅ **Autorización:** Solo ver propias notificaciones (verificar `destinatario_id`)
✅ **Rate Limiting:** Implementado en routes/api.php
✅ **SQL Injection:** Usa Eloquent ORM
✅ **XSS Protection:** React escapa contenido automáticamente
✅ **CSRF:** Protegido por middleware CSRF de Laravel

---

## 📞 ENDPOINTS API

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| GET | `/api/notificaciones` | Listar notificaciones | Sanctum |
| GET | `/api/notificaciones/no-leidas` | Obtener no leídas | Sanctum |
| GET | `/api/notificaciones/stream` | SSE Stream | Sanctum |
| GET | `/api/notificaciones/estadisticas` | Estadísticas | Sanctum |
| PUT | `/api/notificaciones/{id}/leido` | Marcar leído | Sanctum |
| PUT | `/api/notificaciones/{id}/no-leido` | Marcar no leído | Sanctum |
| PUT | `/api/notificaciones/marcar/todas-leidas` | Marcar todas | Sanctum |
| DELETE | `/api/notificaciones/{id}` | Eliminar | Sanctum |

---

## 🎯 PRÓXIMAS MEJORAS

1. **Notificaciones por Email**
   - Opción de recibir resumen diario
   - Alertas críticas por correo

2. **Notificaciones por Teléfono**
   - Push notifications para mobile
   - SMS para alertas críticas

3. **Preferences**
   - Que tipo de notificaciones recibe cada usuario
   - Horarios de silencio

4. **Analytics**
   - Tasa de lectura por tipo
   - Notificaciones más ignoradas
   - Mejoras en contenido

5. **Templates**
   - Plantillas personalizables por rol
   - Internacionalización

---

## 📚 REFERENCIAS

- [MDN - Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Laravel Broadcasting](https://laravel.com/docs/broadcasting)
- [React EventSource](https://react.dev/)

---

**Status:** 🟢 COMPLETO Y FUNCIONAL
**Implementado por:** Claude Code
**Fecha:** 16 de Noviembre 2025

