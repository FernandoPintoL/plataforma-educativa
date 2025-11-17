# Instrucciones de Debugging para Error 401

## Paso 1: Verificar en el Navegador (Frontend)

Abre DevTools (F12) y ejecuta en la consola:

```javascript
debugAuth()
```

Esto te mostrará:
- ✅ Si el CSRF token existe
- ✅ Si las cookies están presentes
- ✅ Si el usuario está autenticado

**Captura de pantalla todo lo que aparezca**

## Paso 2: Verificar en Storage

En DevTools > Application > Cookies, busca:
- `PHPSESSID` - Session ID
- `XSRF-TOKEN` - CSRF Token
- `laravel_session` - Session Laravel

**Si alguna falta, el problema es de sesión en el lado del cliente**

## Paso 3: Verificar Request Headers

En DevTools > Network:
1. Recarga la página
2. Busca un request a `/api/notificaciones`
3. Haz clic en él
4. Abre pestaña "Headers"
5. Mira "Request Headers"

Debe tener:
```
X-CSRF-TOKEN: xxx
X-XSRF-TOKEN: xxx
Cookie: PHPSESSID=xxx; XSRF-TOKEN=xxx
```

**Si falta alguno, el problema está en axios config**

## Paso 4: Probar Request Manual

En la consola, ejecuta:

```javascript
fetch('/api/notificaciones?limit=5', {
  method: 'GET',
  credentials: 'include',  // ← CRÍTICO
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
  }
})
.then(r => {
  console.log('Status:', r.status);
  return r.json();
})
.then(d => console.log('Response:', d))
.catch(e => console.error('Error:', e))
```

- Si funciona → el problema es con axios
- Si falla → el problema es en el servidor o sesión

## Paso 5: Verificar Logs del Servidor

Ejecuta en terminal (en el directorio del proyecto):

```bash
# Ver últimas líneas del log
tail -f storage/logs/laravel.log

# O en Windows:
Get-Content storage/logs/laravel.log -Tail 50 -Wait
```

Busca mensajes como:
```
"Unauthorized API request"
"User not authenticated"
```

Esto te dirá exactamente qué está fallando en el servidor.

## Paso 6: Verificar Session en Laravel

En una ruta web (no API), agrega esto temporalmente:

```php
// routes/web.php
Route::get('/debug-session', function () {
    return response()->json([
        'authenticated' => auth()->check(),
        'user' => auth()->user(),
        'session_id' => session()->getId(),
        'session_data' => session()->all(),
    ]);
});
```

Luego ve a `http://localhost:8000/debug-session`

Si ves:
- `"authenticated": true` → sesión funciona
- `"user": null` → sesión no funciona

## Problemas Comunes y Soluciones

### Error: "Cookies no aparecen en Network"
**Causa**: `withCredentials: false`
**Solución**: Verificar que en axiosConfig.ts está `withCredentials: true`

### Error: "X-CSRF-TOKEN header no aparece"
**Causa**: CSRF token no se encontró
**Solución**: Verificar que existe meta tag en `resources/views/app.blade.php`

### Error: "Status 200 pero authentication falla"
**Causa**: Middleware de CSRF está validando
**Solución**: Las rutas API deben estar excluidas de CSRF en bootstrap/app.php

### Error: "Unauthenticated" en response
**Causa**: `auth()->user()` retorna null
**Solución**: Session no existe o no está siendo enviada

## Qué Hacer Si Aún No Funciona

1. Ejecuta los 6 pasos arriba
2. Captura EXACTAMENTE:
   - Output de `debugAuth()`
   - Headers del request a `/api/notificaciones` en Network tab
   - Logs de Laravel (`storage/logs/laravel.log`)
   - Response del `/debug-session` endpoint
3. Compartir toda esa información

Con esa información podré identificar exactamente dónde está el problema.

## Checklist Rápido

- [ ] `debugAuth()` muestra CSRF token ✅
- [ ] `debugAuth()` muestra PHPSESSID cookie ✅
- [ ] Network request tiene X-CSRF-TOKEN header ✅
- [ ] Network request tiene PHPSESSID cookie ✅
- [ ] Manual fetch request retorna 200 ✅
- [ ] Laravel logs no muestran errores ✅
- [ ] `/debug-session` muestra `"authenticated": true` ✅

Si todos están ✅, las notificaciones deben funcionar.
