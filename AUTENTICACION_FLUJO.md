# Flujo de Autenticación - Token-Based con Sanctum + Session

## Resumen
El sistema usa una combinación de **autenticación por sesión (web)** + **tokens Bearer (api)** para proporcionar:
- Sesión de navegador normal para páginas web
- Tokens para requests REST API

## El Flujo Completo

### 1. Login (Usuario inicia sesión)
```
POST /login
  ↓
AuthenticatedSessionController::store()
  ↓
  a) $request->authenticate()  // Valida credenciales
  b) $request->session()->regenerate()  // Crea sesión
  c) $user->createToken('api-token')  // Genera token Sanctum
  d) $request->session()->put('api_token', $token->plainTextToken)  // Guarda en sesión
  e) $request->session()->flash('sanctum_token', $token->plainTextToken)  // Flash para Inertia
  ↓
Redirect → /dashboard (con sesión activa)
```

**Estado después del login:**
- ✓ Usuario tiene sesión activa en el navegador (PHPSESSID cookie)
- ✓ Token Sanctum guardado en sesión del servidor
- ✓ Token disponible en sesión para el backend

---

### 2. Frontend Carga Dashboard (Inertia)
```
GET /dashboard
  ↓
Laravel envía respuesta Inertia con props
  ↓
Frontend monta el componente
  ↓
React carga NotificacionCenter y otros componentes que usan API
```

**Estado del frontend:**
- ✓ Sesión activa (cookies PHPSESSID + XSRF-TOKEN)
- ✗ No tiene token en sessionStorage todavía

---

### 3. Primer Request a API (ej: GET /api/notificaciones)
```
NotificacionCenter.tsx llama a notificacionesApi.obtenerNotificaciones()
  ↓
axios interceptor prepara la request
  ↓
axiosConfig.ts::getApiToken() verifica si tiene token
  ├─ ¿Está en memoria (apiToken)? → Usar ese
  ├─ ¿Está en sessionStorage? → Cargar y usar
  └─ ¿No está? → Fetch a /api/auth/token
      ↓
      GET /api/auth/token (con withCredentials: true)
        ↓
        AuthTokenController::getToken()
          ├─ Lee token de $request->session()->get('api_token')
          ├─ Si existe → Return token
          └─ Si no existe → Crear nuevo y guardar
        ↓
        Response: { token: "xxxxx", type: "Bearer" }
      ↓
      axiosConfig guarda token en sessionStorage
      apiToken = token
      ↓
      Ahora tiene el token, continúa con el request original
  ↓
axios agrega header: Authorization: Bearer xxxxx
  ↓
GET /api/notificaciones con Bearer token
  ↓
NotificacionController verifica auth:sanctum
  ├─ Lee Authorization header → Bearer token
  ├─ Valida con Sanctum
  └─ ✓ Token válido → Procesa request
  ↓
Response 200: { success: true, data: [...] }
```

**Estado después:**
- ✓ Token en memoria (apiToken)
- ✓ Token en sessionStorage
- ✓ Todos los próximos requests usan el token

---

### 4. Siguientes Requests (Rápidos)
```
Para cada request a /api/*:

1. getApiToken() → Encuentra el token en sessionStorage/memoria
2. Agrega header Authorization: Bearer xxxxx
3. Request se procesa inmediatamente
4. Sanctum valida el token
5. Response 200 OK
```

---

## Arquitectura de Archivos Clave

### Backend
```
app/Http/Controllers/Auth/
  └─ AuthenticatedSessionController.php
     └─ store() // Genera token en login

app/Http/Controllers/Api/
  └─ AuthTokenController.php
     └─ getToken() // Retorna token de sesión
     └─ revokeToken() // Elimina token

app/Models/User.php
  └─ tokens() // Relación con PersonalAccessToken (Sanctum)

routes/api.php
  └─ /api/auth/token // Endpoint para obtener token
  └─ /api/* // Rutas API protegidas con auth:sanctum
```

### Frontend
```
resources/js/config/
  └─ axiosConfig.ts
     ├─ getApiToken() // Obtiene token de sessionStorage o servidor
     ├─ simpleAxios // Instancia sin interceptores (para evitar circular dep)
     └─ axiosInstance.interceptors.request // Agrega Bearer token

resources/js/services/
  └─ notificacionesApi.ts
     ├─ obtenerNotificaciones() // Llamadas REST con token
     └─ conectarSSE() // Conexión SSE con token en query param

resources/js/components/
  └─ NotificacionCenter.tsx // Usa notificacionesApi
```

---

## Flujos Especiales

### SSE (Server-Sent Events)
EventSource no soporta custom headers, entonces el token va en query parameter:
```
EventSource('/api/notificaciones/stream?token=xxxxx')
  ↓
NotificacionController::stream()
  ├─ Verifica Authorization header
  └─ Si no, valida token del query param
  ↓
Mantiene conexión abierta
```

### Logout
```
POST /logout
  ↓
AuthenticatedSessionController::destroy()
  ├─ Auth::guard('web')->logout()
  ├─ $request->session()->invalidate()
  └─ $request->session()->regenerateToken()
  ↓
Frontend:
  ├─ sessionStorage.removeItem('sanctum_token')
  ├─ apiToken = null
  └─ Redirect a /login
```

---

## Problemas y Soluciones

### Problema 1: Dependencia Circular
**Antes:** axios instance con interceptor intentaba obtener token, pero getApiToken() usaba el mismo axios para fetch, causando loop infinito.

**Solución:** Crear `simpleAxios` sin interceptores solo para `/api/auth/token`.

### Problema 2: Session Middleware en API Routes
**Antes:** Agregar StartSession middleware a API routes quebraba web routes.

**Solución:** Usar únicamente Sanctum y session-based auth en rutas web. API routes usan Sanctum tokens.

### Problema 3: Token No Disponible en Login
**Problema:** Token se genera en backend pero frontend no tiene acceso a él.

**Solución:** Implementar `/api/auth/token` endpoint que retorna el token de la sesión.

---

## Checklist de Funcionamiento

- [ ] Login funciona y genera sesión
- [ ] `/api/auth/token` retorna 200 con token válido
- [ ] Token se guarda en sessionStorage
- [ ] API requests incluyen header Authorization: Bearer
- [ ] SSE conexión se establece con token en query param
- [ ] Notificaciones se reciben en tiempo real
- [ ] Logout limpia token y sesión

---

## Testing Manual

### 1. Login
```bash
# Terminal 1: Servidor corriendo
php artisan serve --port=8000

# Terminal 2: Login
curl -X POST http://localhost:8000/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=profesor@example.com&password=password" \
  -c cookies.txt
```

### 2. Obtener Token
```bash
# Usar cookies de login para obtener token
curl -X GET http://localhost:8000/api/auth/token \
  -b cookies.txt \
  -H "Accept: application/json"
```

### 3. Usar Token en API
```bash
TOKEN="xxxxx" # del paso anterior
curl -X GET http://localhost:8000/api/notificaciones \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json"
```

---

## Configuración Importante

### bootstrap/app.php
```php
$middleware->api(prepend: [
    \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
    \Illuminate\Http\Middleware\HandleCors::class,
]);
```
- `EnsureFrontendRequestsAreStateful`: Detecta requests desde SPA y permite session
- Middleware API NO incluye StartSession (esto causaba problemas)

### routes/api.php
```php
// Token endpoints en 'web' middleware (necesitan sesión)
Route::middleware(['web'])->group(function () {
    Route::get('/api/auth/token', [AuthTokenController::class, 'getToken'])
        ->middleware('auth');
});

// API endpoints protegidos con Sanctum
Route::middleware(['auth:sanctum'])->group(function () {
    Route::prefix('notificaciones')->group(function () {
        Route::get('/', [NotificacionController::class, 'index']);
        // ...
    });
});
```

### config/sanctum.php
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
```
- Debe incluir tu dominio para que Sanctum reconozca como "stateful"

---

## Variables de Entorno (.env)
```
SANCTUM_STATEFUL_DOMAINS=localhost,127.0.0.1,yourdomain.com
SESSION_DRIVER=file  # o database
```

---

## Seguridad

### ✓ Lo que está bien
- Tokens se almacenan en sessionStorage (no accesible desde JS inyectado)
- Tokens tienen expiración
- CSRF protección en rutas web
- Authorization header en lugar de URL param (cuando es posible)

### ⚠️ Mejoras Futuras (Production)
- Usar HttpOnly cookies para tokens (no JavaScript access)
- Implementar refresh token rotation
- Rate limiting en `/api/auth/token`
- Logging de token creation/revocation

---

**Última actualización:** 2025-11-16
**Estado:** Funcionando ✓
