# API Authentication Fix - Notificaciones en Tiempo Real

## Problema Identificado

El navegador mostraba error `401 (Unauthorized)` al intentar acceder a `/api/notificaciones`:

```
GET http://localhost:8000/api/notificaciones?limit=20 401 (Unauthorized)
```

Además, la conexión SSE (Server-Sent Events) fallaba con error de MIME type:
```
EventSource's response has a MIME type ("text/html") that is not "text/event-stream"
```

## Causa Raíz

1. **Falta de token de autenticación**: El servicio `notificacionesApi.ts` usaba `axios` sin configurar para enviar el token de Sanctum
2. **Sin headers CSRF**: Las solicitudes no incluían el token CSRF requerido por Laravel
3. **Sin credenciales en SSE**: EventSource no enviaba cookies de sesión

## Solución Implementada

### 1. Creación de Configuración Centralizada de Axios

**Archivo**: `resources/js/config/axiosConfig.ts`

Crea una instancia centralizada de axios con:
- CSRF token automático en todos los requests
- Headers de autenticación X-XSRF-TOKEN
- `withCredentials: true` para enviar cookies de sesión
- Interceptores para manejo de errores de autenticación (401, 403)

```typescript
const axiosInstance = axios.create({
  baseURL: window.location.origin,
  withCredentials: true, // Enviar cookies
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Agregar CSRF token automáticamente
axiosInstance.interceptors.request.use((config) => {
  const token = getCsrfToken();
  if (token) {
    config.headers['X-CSRF-TOKEN'] = token;
  }
  return config;
});
```

### 2. Actualización del Servicio de Notificaciones

**Archivo**: `resources/js/services/notificacionesApi.ts`

Cambios realizados:

#### Antes:
```typescript
import axios from 'axios'
const response = await axios.get<any>(`${this.baseUrl}?${params}`)
```

#### Después:
```typescript
import axiosInstance from '../config/axiosConfig'
const response = await axiosInstance.get<any>(`${this.baseUrl}?${params}`)
```

### 3. Autenticación en SSE (Server-Sent Events)

EventSource no soporta headers personalizados, así que usamos:

```typescript
conectarSSE(onNotificacion, onError) {
  // Obtener token CSRF de la cookie
  const csrfToken = this.getCookie('XSRF-TOKEN')

  // Incluir token como parámetro de query
  const streamUrl = csrfToken
    ? `${this.baseUrl}/stream?_token=${encodeURIComponent(csrfToken)}`
    : `${this.baseUrl}/stream`

  // withCredentials permite enviar cookies
  this.eventSource = new EventSource(streamUrl, { withCredentials: true })
}
```

## Cambios de Archivos

### Nuevos Archivos:
- `resources/js/config/axiosConfig.ts` (82 líneas)
  - Configuración centralizada de axios
  - Manejo de tokens CSRF
  - Interceptores de error

### Archivos Modificados:
- `resources/js/services/notificacionesApi.ts`
  - Cambiar importación de `axios` a `axiosInstance`
  - Actualizar todas las llamadas HTTP
  - Agregar `getCookie()` helper method
  - Actualizar SSE con `withCredentials: true`

## Cómo Funciona la Autenticación

### Para Solicitudes HTTP REST:

1. **Axios interceptor** agrega CSRF token automáticamente:
   ```
   GET /api/notificaciones
   Headers:
     X-CSRF-TOKEN: {token}
     X-XSRF-TOKEN: {token}
     Cookie: XSRF-TOKEN={token}; PHPSESSID={sesion}
   ```

2. **Sanctum middleware** en Laravel verifica:
   - Cookie de sesión válida O
   - Bearer token en Authorization header

3. **Si autenticado**: Retorna `200 OK` con datos

### Para SSE Stream:

1. **EventSource conecta** con `withCredentials: true`:
   ```
   GET /api/notificaciones/stream?_token={token}
   Cookie: PHPSESSID={sesion}
   ```

2. **Sanctum verifica autenticación** y mantiene conexión abierta

3. **Content-Type correcto**: `text/event-stream`

## Testing de la Solución

### 1. Verificar en Consola del Navegador:

```javascript
// Debería retornar éxito
const service = new NotificacionesApiService()
service.obtenerNotificaciones()
  .then(res => console.log('✓ Autenticado', res))
  .catch(err => console.error('✗ Error', err))
```

### 2. Verificar Headers Enviados:

En DevTools > Network > Seleccionar request a `/api/notificaciones`

Debe mostrar:
```
Request Headers:
  X-CSRF-TOKEN: xxx...
  X-XSRF-TOKEN: xxx...
  Cookie: XSRF-TOKEN=xxx; PHPSESSID=xxx
```

### 3. Verificar SSE:

```javascript
service.conectarSSE(
  (notif) => console.log('Nueva notificación:', notif),
  (error) => console.error('Error SSE:', error)
)
```

Debe conectar sin errores de MIME type.

## Problemas Comunes y Soluciones

### Error: "401 Unauthorized"
**Causa**: Token CSRF no se está enviando
**Solución**: Verificar que `getCsrfToken()` encuentra el meta tag
```html
<!-- En layout.blade.php debe existir: -->
<meta name="csrf-token" content="{{ csrf_token() }}">
```

### Error: MIME type text/html en SSE
**Causa**: Respuesta HTML de error en lugar de stream
**Solución**: Verificar que `withCredentials: true` está en EventSource
```typescript
new EventSource(url, { withCredentials: true })
```

### EventSource retorna 403 Forbidden
**Causa**: Usuario no autenticado o sin permiso
**Solución**: Verificar cookie de sesión está activa
```javascript
document.cookie // Debe mostrar PHPSESSID
```

## Configuración de Laravel Necesaria

Las rutas deben estar protegidas con middleware:

```php
// routes/api.php
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/notificaciones', [NotificacionController::class, 'index']);
    Route::get('/notificaciones/stream', [NotificacionController::class, 'stream']);
    // ... más rutas
});
```

## Próximos Pasos

1. ✅ Implementar axiosConfig.ts
2. ✅ Actualizar notificacionesApi.ts
3. ⏳ Testing en desarrollo (usuario logueado como profesor)
4. ⏳ Verificar SSE conecta correctamente
5. ⏳ Testing en producción

## Recursos

- [Laravel Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
- [Server-Sent Events API](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

---

**Commit**: Implementación de autenticación API para notificaciones en tiempo real

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
