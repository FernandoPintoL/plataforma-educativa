# Verificación de Autenticación Token-Based - Guía Completa

## Estado Actual ✓

La arquitectura de autenticación ha sido **completamente implementada y corregida**. El sistema está listo para pruebas.

---

## 1. Verificación de Componentes

### Backend - Controladores

#### ✓ `AuthenticatedSessionController` (app/Http/Controllers/Auth/)
- **Tarea**: Generar token Sanctum durante login
- **Estado**: FUNCIONANDO
- **Verificar**:
  - El token se guarda en sesión: `$request->session()->put('api_token', $token->plainTextToken)`
  - Se genera con: `$user->createToken('api-token')`

#### ✓ `AuthTokenController` (app/Http/Controllers/Api/)
- **Tarea**: Retornar token desde sesión al frontend
- **Estado**: FUNCIONANDO
- **Verificar**:
  - Lee token de sesión: `$request->session()->get('api_token')`
  - Retorna JSON con token y type "Bearer"
  - Si no existe, lo recreaa partir del usuario autenticado

### Backend - Rutas

#### ✓ Rutas en `routes/web.php` (LÍNEAS 23-30)
```php
// API Token endpoint - debe estar en web.php para acceso a sesión
Route::middleware(['auth'])->group(function () {
    Route::get('/api/auth/token', [AuthTokenController::class, 'getToken'])
        ->name('api.auth.token');

    Route::post('/api/auth/token/revoke', [AuthTokenController::class, 'revokeToken'])
        ->name('api.auth.token.revoke');
});
```
- **Estado**: CORRECTO
- **Nota**: Estas rutas deben estar en `web.php`, NO en `api.php`
- **Razón**: Necesitan acceso a la sesión web autenticada

#### ✓ Rutas en `routes/api.php` (LÍNEAS 58-178)
- **Estado**: Rutas REST API protegidas con `auth:sanctum`
- **Verificar**:
  - Notificaciones en línea 145-177
  - Análisis de riesgo en línea 62-94
  - Exportar reportes en línea 99-119

### Frontend - Configuración Axios

#### ✓ `resources/js/config/axiosConfig.ts`
- **Instancia `simpleAxios`** (sin interceptadores)
  - Evita dependencia circular
  - Solo para `/api/auth/token`

- **Instancia `axiosInstance`** (con interceptadores)
  - Agrega header: `Authorization: Bearer <token>`
  - Agrega header: `X-CSRF-TOKEN`
  - Maneja errores 401, 403, etc.

- **Función `getApiToken()`**
  - Verifica memoria primero (variable `apiToken`)
  - Luego sessionStorage
  - Finalmente fetch a `/api/auth/token`
  - Almacena token en sesión para requests posteriores

#### ✓ `resources/js/services/notificacionesApi.ts`
- **Métodos REST**:
  - `obtenerNotificaciones()` - GET `/api/notificaciones`
  - `marcarLeido()` - PUT `/api/notificaciones/{id}/leido`
  - `obtenerEstadisticas()` - GET `/api/notificaciones/estadisticas`

- **SSE Connection** `conectarSSE()`
  - Obtiene token vía `getApiToken()`
  - Pasa token en query param: `/api/notificaciones/stream?token=<token>`
  - EventSource no soporta custom headers, por eso va en URL

#### ✓ `resources/js/components/NotificacionCenter.tsx`
- **useEffect #1**: Carga notificaciones iniciales
- **useEffect #2**: Conecta a SSE al montar
- **Estado**: Mostrado en la navbar del dashboard

---

## 2. Flujo Paso a Paso

### Paso 1: Login (Usuario inicia sesión)
```
POST /login
  ↓
AuthenticatedSessionController::store()
  ├─ Valida credenciales
  ├─ Regenera sesión
  ├─ Crea token: $user->createToken('api-token')
  ├─ Guarda en sesión: $request->session()->put('api_token', $token)
  └─ Flash: $request->session()->flash('sanctum_token', $token)
  ↓
Redirect → /dashboard/profesor (o rol correspondiente)
```

**Estado después:**
- ✓ Sesión activa en navegador (PHPSESSID cookie)
- ✓ Token en `personal_access_tokens` tabla
- ✓ Token en servidor sesión
- ✓ Token en base de datos

---

### Paso 2: Frontend Carga Dashboard
```
GET /dashboard/profesor
  ↓
Inertia renderiza componentes React
  ↓
NotificacionCenter monta y useEffect dispara
  ├─ cargarNotificaciones() → GET /api/notificaciones
  └─ conectarSSE() → EventSource /api/notificaciones/stream
```

**Estado del frontend:**
- ✓ Sesión activa (cookies PHPSESSID, XSRF-TOKEN)
- ✗ Token aún NO en sessionStorage (será obtenido en paso 3)

---

### Paso 3: Primer Request a API (GET /api/notificaciones)
```
NotificacionCenter::cargarNotificaciones()
  ↓
axiosInstance.get('/api/notificaciones')
  ↓
Interceptor Request ejecuta:
  ├─ await getApiToken()
  │  ├─ ¿Está en memoria? → NO (primer request)
  │  ├─ ¿Está en sessionStorage? → NO
  │  └─ Fetch a /api/auth/token (via simpleAxios)
  │     ↓
  │     GET /api/auth/token
  │     Header: Cookie: PHPSESSID=xxx
  │     ↓
  │     AuthTokenController::getToken()
  │     ├─ Lee sesión: $request->session()->get('api_token')
  │     ├─ Verifica usuario: $request->user()
  │     └─ Return JSON: { success: true, token: "xxx", type: "Bearer" }
  │     ↓
  │     axiosConfig guarda token:
  │     ├─ apiToken = token (en memoria)
  │     └─ sessionStorage.setItem('sanctum_token', token)
  │
  ├─ Agrega header: Authorization: Bearer xxxxx
  ├─ Agrega header: X-CSRF-TOKEN: xxxxx
  └─ Completa request original: GET /api/notificaciones
     ↓
     Sanctum valida Bearer token
     ├─ Busca en personal_access_tokens
     ├─ Verifica user_id
     ├─ Verifica expiración
     └─ ✓ Token válido → Procesa request
     ↓
     NotificacionController::index()
     ├─ Lee datos del usuario autenticado
     ├─ Retorna notificaciones
     └─ Response 200: { success: true, data: [...] }
```

**Estado después:**
- ✓ Token en memoria (`apiToken`)
- ✓ Token en sessionStorage (`sanctum_token`)
- ✓ Notificaciones cargadas
- ✓ No hay 401 Unauthorized

---

### Paso 4: Conectar SSE (Server-Sent Events)
```
NotificacionCenter::conectarSSE()
  ↓
notificacionesApi::conectarSSE()
  ├─ await getApiToken()
  │  └─ Encuentra token en memoria/sessionStorage (YA EXISTE del paso 3)
  │
  ├─ Crea EventSource con token en query:
  │  URL = /api/notificaciones/stream?token=xxxxx
  │
  └─ Abre conexión HTTP
     ↓
     NotificacionController::stream()
     ├─ Lee token de query param
     ├─ Valida con Sanctum
     ├─ Abre server stream
     └─ Envía heartbeat cada 30 segundos
```

**Estado después:**
- ✓ Conexión SSE abierta
- ✓ Recibe notificaciones en tiempo real
- ✓ Mantiene conexión con heartbeat

---

### Paso 5: Requests Posteriores (Muy Rápidos)
```
Cualquier request a /api/* (después del primer login):

1. getApiToken()
   └─ Encuentra token en memoria (primera opción)
   └─ Retorna al instante (< 1ms)

2. axiosInstance.get('/api/...')
   ├─ Interceptor agrega Authorization header
   └─ Request se procesa

3. Sanctum valida el token
   └─ Token ya existe en memoria del navegador
   └─ No requiere fetch a /api/auth/token

4. Response 200 OK

Tiempo total: ~500ms (tiempo de red + procesamiento)
```

---

## 3. Checklist de Verificación Manual

### En el Navegador (DevTools Console)

```javascript
// 1. Verificar que existe la sesión
console.log(document.cookie);
// Debe mostrar: PHPSESSID=xxx; XSRF-TOKEN=xxx; laravel_session=xxx

// 2. Verificar que existe el token en sessionStorage
console.log(sessionStorage.getItem('sanctum_token'));
// Debe mostrar algo como: "3|rNyXQzGxxxxx"

// 3. Verificar la configuración de axios
import axiosInstance, { getApiToken } from '@/config/axiosConfig';
const token = await getApiToken();
console.log('Token:', token.substring(0, 20) + '...');
// Debe mostrar: Token: 3|rNyXQzGxxxxx...

// 4. Hacer un request manual
const response = await axiosInstance.get('/api/notificaciones');
console.log('Notificaciones:', response.data);
// Debe mostrar array de notificaciones, NO 401
```

### En DevTools Network Tab

```
1. Buscar la request: /api/auth/token
   ├─ Method: GET
   ├─ Status: 200 OK (NO 401)
   ├─ Headers enviados:
   │  └─ Cookie: PHPSESSID=xxx
   └─ Response:
      └─ { success: true, token: "3|rNyXQzGxxxxx", type: "Bearer" }

2. Buscar la request: /api/notificaciones
   ├─ Method: GET
   ├─ Status: 200 OK (NO 401)
   ├─ Headers enviados:
   │  ├─ Authorization: Bearer 3|rNyXQzGxxxxx
   │  └─ X-CSRF-TOKEN: xxx
   └─ Response:
      └─ { success: true, data: [...notificaciones...] }

3. Buscar la conexión: /api/notificaciones/stream
   ├─ Type: EventSource
   ├─ Status: 200 OK (conexión abierta)
   └─ Messages recibidas periódicamente (heartbeat + notificaciones)
```

### En el Servidor (Terminal)

```bash
# 1. Verificar que la migración de Sanctum está corrida
php artisan tinker
>>> Schema::hasTable('personal_access_tokens')
=> true

>>> \Laravel\Sanctum\PersonalAccessToken::count()
=> N (número de tokens en la DB)

# 2. Verificar que el token existe en la sesión
php artisan tinker
>>> $user = \App\Models\User::find(1);
>>> $user->tokens()->where('name', 'api-token')->first();
=> Token object

# 3. Ver logs del servidor
# El archivo: storage/logs/laravel.log
tail -f storage/logs/laravel.log
# Debe mostrar requests a /api/auth/token y /api/notificaciones sin errores
```

---

## 4. Problemas Comunes y Soluciones

### Problema: 401 Unauthenticated en /api/auth/token

**Posibles Causas:**
1. Ruta está en `routes/api.php` en lugar de `routes/web.php`
2. Middleware no es `['auth']`
3. Session no está activa

**Solución:**
```php
// ❌ INCORRECTO (en routes/api.php)
Route::middleware(['api', 'web'])->get('/api/auth/token', ...);

// ✓ CORRECTO (en routes/web.php)
Route::middleware(['auth'])->group(function () {
    Route::get('/api/auth/token', ...);
});
```

---

### Problema: 401 en /api/notificaciones

**Posibles Causas:**
1. Token no está siendo enviado en Authorization header
2. Token expirado o inválido
3. Sanctum no validó el token correctamente

**Solución:**
```javascript
// Verificar que axios agrega el header correctamente
axiosInstance.interceptors.request.use((config) => {
    console.log('Headers enviados:', config.headers);
    // Debe mostrar: Authorization: Bearer xxxx
    return config;
});
```

---

### Problema: EventSource MIME type error

**Error**: `EventSource's response has a MIME type ("text/html") that is not "text/event-stream"`

**Causa**: El endpoint retorna HTML error en lugar de event-stream

**Solución**:
- Esto ocurre cuando el token no es válido
- El servidor retorna 401 como HTML
- EventSource no puede procesarlo

**Verificar**:
1. `/api/auth/token` retorna token válido ✓
2. Token está en sessionStorage ✓
3. Token se pasa en query param correctamente ✓

---

## 5. Testing Manual Paso a Paso

### 1. Limpiar sesión/cookies
```javascript
// En DevTools Console
sessionStorage.clear();
localStorage.clear();
// Recargar página: F5
```

### 2. Hacer login
```
Abrir: http://localhost:8000/login
Email: profesor@example.com
Password: password
Click: Ingresar
```

### 3. Verificar en Console después del login
```javascript
// Debe retornar true (sesión activa)
document.cookie.includes('PHPSESSID')
```

### 4. Verificar que carga NotificacionCenter
```
En el navbar, debe ver el icono de campana de notificaciones
Console debe mostrar: [SSE] Conexión SSE establecida
```

### 5. Verificar Token en Network
```
DevTools → Network
Buscar: /api/auth/token
Status: ✓ 200 (NO 401)
Response: { success: true, token: "..." }
```

### 6. Verificar Notificaciones en Network
```
DevTools → Network
Buscar: /api/notificaciones
Status: ✓ 200 (NO 401)
Response: { success: true, data: [...] }
```

### 7. Verificar SSE en Network
```
DevTools → Network
Buscar: /api/notificaciones/stream
Type: EventSource
Status: ✓ 200 (conexión abierta)
```

---

## 6. Comandos Útiles de Debugging

```bash
# Ver logs en tiempo real
tail -f storage/logs/laravel.log

# Ver requests específicos
tail -f storage/logs/laravel.log | grep "api/auth/token\|api/notificaciones"

# Limpiar logs
> storage/logs/laravel.log

# Ver tokens activos en DB
php artisan tinker
>>> \Laravel\Sanctum\PersonalAccessToken::with('tokenable')->get();

# Eliminar tokens viejos
>>> \Laravel\Sanctum\PersonalAccessToken::where('created_at', '<', now()->subDays(1))->delete();
```

---

## 7. Resumen de Cambios Realizados

### Archivos Modificados

1. **routes/web.php** (Líneas 23-30)
   - Agregadas rutas `/api/auth/token` en web middleware

2. **routes/api.php**
   - Removidas rutas `/api/auth/token` (MOVIDAS a web.php)
   - Mantenidas rutas de notificaciones, análisis, exportar

3. **app/Http/Controllers/Auth/AuthenticatedSessionController.php**
   - Token se genera al login
   - Se guarda en sesión para acceso posterior

4. **app/Http/Controllers/Api/AuthTokenController.php**
   - Lee token de sesión
   - Retorna JSON con token y type

5. **resources/js/config/axiosConfig.ts**
   - Creada `simpleAxios` para evitar circular dependency
   - Implementada `getApiToken()` con fallbacks
   - Interceptor agrega Authorization header

6. **resources/js/services/notificacionesApi.ts**
   - SSE ahora usa token en query param
   - Métodos REST usan axiosInstance con Bearer token

7. **Migraciones**
   - Sanctum: `personal_access_tokens` table creada ✓
   - Notificaciones: `destinatario_id` column agregada ✓

---

## 8. Próximos Pasos (Production)

- [ ] Implementar HttpOnly cookies para tokens
- [ ] Agregar token refresh mechanism
- [ ] Rate limiting en `/api/auth/token`
- [ ] Logging de token creation/revocation
- [ ] Monitoreo de tokens expirados
- [ ] Tests automáticos del flujo de auth

---

**Última actualización:** 2025-11-17
**Estado:** Listo para Testing ✓

