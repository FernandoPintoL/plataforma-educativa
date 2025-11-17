# Testing Rápido - Autenticación Token API

## 🚀 Inicio Rápido (2 minutos)

### 1. Abrir navegador
```
http://localhost:8000
```

### 2. Login
```
Email: profesor@example.com
Password: password
Clic: Ingresar
```

### 3. Verificar en Console (F12 → Console)
```javascript
// Copiar y pegar en la consola:

// ✓ Test 1: Sesión activa
console.log('🔑 Sesión:', document.cookie.includes('PHPSESSID') ? '✓ ACTIVA' : '✗ NO ACTIVA');

// ✓ Test 2: Token en sessionStorage
const token = sessionStorage.getItem('sanctum_token');
console.log('📱 Token:', token ? '✓ EXISTE (' + token.substring(0, 10) + '...)' : '✗ NO EXISTE');

// ✓ Test 3: Notificaciones cargadas
console.log('🔔 Notificaciones:', document.querySelector('[class*="NotificacionCenter"]') ? '✓ VISIBLE' : '✗ NO VISIBLE');
```

### 4. Verificar en Network (F12 → Network)
```
Requests esperadas (Status 200):
✓ /api/auth/token
✓ /api/notificaciones
✓ /api/notificaciones/stream (EventSource)
```

---

## ✓ Criterios de Éxito

### Verde = Funcionando ✓

```
✓ Login exitoso
  └─ Redirige a /dashboard/profesor
  └─ Sesión activa (PHPSESSID cookie)

✓ NotificacionCenter monta
  └─ Icono campana visible en navbar
  └─ Console: "[SSE] Conexión SSE establecida"

✓ /api/auth/token → Status 200
  └─ Response: { success: true, token: "...", type: "Bearer" }
  └─ Headers: Cookie: PHPSESSID=xxx

✓ /api/notificaciones → Status 200
  └─ Response: { success: true, data: [...] }
  └─ Headers: Authorization: Bearer xxx

✓ Token en sessionStorage
  └─ sessionStorage.getItem('sanctum_token') retorna token

✓ SSE abierto
  └─ /api/notificaciones/stream → Status 200
  └─ Conexión abierta (no cierra)
```

---

## ❌ Si Algo Falla

### Problema: 401 en /api/auth/token
```bash
# Solución:
php artisan route:clear
php artisan config:clear
# Recargar navegador: F5
```

### Problema: 401 en /api/notificaciones
```bash
# Solución:
# 1. Verificar que /api/auth/token retorna token (paso anterior)
# 2. Verificar sessionStorage tiene token
sessionStorage.getItem('sanctum_token')
# 3. Si no existe, logout y login de nuevo
```

### Problema: EventSource MIME type error
```
Esto significa que /api/notificaciones/stream no recibió el token correctamente.

Verificar:
1. ¿/api/auth/token retorna token? (debe ser Status 200)
2. ¿Token está en sessionStorage?
3. Si no → logout/login nuevamente
```

### Problema: Console error en axiosConfig
```javascript
// Si ves: "Could not fetch API token from server"
// Significa: /api/auth/token falló

// Solución:
// 1. Verificar routes/web.php líneas 23-30 están correctas
// 2. php artisan route:clear
// 3. Logout y login nuevamente
```

---

## 📊 Checklist Rápido

```
Login
└─ ✓ ¿Sesión activa? (PHPSESSID cookie)
└─ ✓ ¿Redirige a dashboard?

Token
└─ ✓ ¿/api/auth/token retorna 200?
└─ ✓ ¿Token en sessionStorage?
└─ ✓ ¿Token en Authorization header?

Notificaciones
└─ ✓ ¿/api/notificaciones retorna 200?
└─ ✓ ¿Hay datos en response?
└─ ✓ ¿NotificacionCenter visible?

SSE
└─ ✓ ¿/api/notificaciones/stream está abierta?
└─ ✓ ¿Console muestra "[SSE] Conexión SSE establecida"?
└─ ✓ ¿Conexión no se cierra?

Si todos están ✓ → ¡FUNCIONA PERFECTO!
```

---

## 🔍 Debugging Avanzado

### Ver logs en tiempo real
```bash
tail -f storage/logs/laravel.log
```

### Ver estado de tokens en DB
```bash
php artisan tinker

# Contar tokens activos
>>> \Laravel\Sanctum\PersonalAccessToken::count()

# Ver token de usuario específico
>>> \App\Models\User::find(1)->tokens;

# Ver todos los tokens con detalles
>>> \Laravel\Sanctum\PersonalAccessToken::with('tokenable')->get();
```

### Limpiar tokens viejos
```bash
php artisan tinker
>>> \Laravel\Sanctum\PersonalAccessToken::where('created_at', '<', now()->subDays(1))->delete();
```

---

## 📝 Notas Importantes

1. **No cierres la sesión**: Si cierres sesión (logout), el token se invalida
2. **Token en memoria**: Una vez cargado, se guarda en memoria y sessionStorage
3. **SSE mantiene conexión**: La conexión SSE permanece abierta para notificaciones en tiempo real
4. **PHPSESSID cookie**: Debe estar siempre presente para que funcione `/api/auth/token`

---

**Última actualización:** 2025-11-17
**Duración del testing:** ~2 minutos

