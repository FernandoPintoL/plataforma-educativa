# 🔨 Instrucciones de Compilación y Despliegue

## 📋 Pre-requisitos

Asegurate de tener:
- Node.js (v14 o superior)
- npm (v6 o superior)
- Laravel 11 correctamente configurado
- Vue 3 en tu configuración de webpack

## 🛠️ Pasos de Compilación

### 1. Instalar Dependencias (si es necesario)
```bash
npm install
```

### 2. Compilar Assets para Desarrollo
```bash
npm run dev
```

**Salida esperada:**
```
✔ app.js                      X.XX MB
✔ css/app.css                 X.XX KB
DONE  in Xs
```

### 3. Compilar Assets para Producción
```bash
npm run build
```

**Salida esperada:**
```
✔ app.js                      X.XX MB  (minificado)
✔ css/app.css                 X.XX KB  (minificado)
DONE  in Xs
```

## 📁 Verificar Compilación

Después de compilar, verificar que existen:
```
public/
├── js/
│   └── app.js                 [✓ Compilado]
├── css/
│   └── app.css                [✓ Compilado]
└── manifest.json              [✓ Generado por webpack]
```

## 🌍 Despliegue Local

### 1. Servidor Development (Laravel)
```bash
php artisan serve
```

La aplicación estará disponible en `http://localhost:8000`

### 2. Servidor de Desarrollo Vue (HMR)
```bash
npm run dev
```

Para **hot reload** mientras desarrollas.

## 🚀 Despliegue en Producción

### 1. Compilar con Optimizaciones
```bash
npm run build
```

### 2. Ejecutar Migraciones (si hay cambios en BD)
```bash
php artisan migrate
```

### 3. Cachear Configuración
```bash
php artisan config:cache
php artisan route:cache
```

### 4. Verificar Permisos
```bash
chmod -R 775 storage/
chmod -R 775 bootstrap/cache/
```

### 5. Clear Cache
```bash
php artisan cache:clear
php artisan view:clear
php artisan config:clear
```

## ✅ Checklist Pre-Despliegue

- [ ] Ejecutado `npm run build` sin errores
- [ ] Verificado que `public/js/app.js` existe
- [ ] Verificado que `public/css/app.css` existe
- [ ] Ejecutado migraciones si es necesario
- [ ] Cacheado configuración
- [ ] Limpiado cache de aplicación
- [ ] Verificados permisos de carpetas
- [ ] Probado en local primero

## 🧪 Testing Post-Despliegue

### Paso 1: Acceder a la Aplicación
```
http://tu-dominio.com/tareas/create
```

### Paso 2: Verificar Carga de Componentes
- ✓ Page se carga sin errores en consola
- ✓ CSS se aplica correctamente
- ✓ Selector de IA/Manual es visible
- ✓ Los botones son interactivos

### Paso 3: Probar Flujo IA
```
1. Click en "Crear con IA"
2. Ingresar título válido
3. Seleccionar curso
4. Click en "Enviar a Análisis"
5. Esperar análisis (verificar que se conecta a puerto 8003)
6. Ver resultados
```

### Paso 4: Probar Flujo Manual
```
1. Click en "Crear Manualmente"
2. Ingresar datos
3. Ir al formulario
4. Publicar tarea
```

### Paso 5: Verificar Tarea Creada
```
- La tarea debe aparecer en /tareas
- Debe tener todos los datos ingresados
- La fecha de entrega debe calcularse correctamente
```

## 🔧 Troubleshooting Compilación

### Error: "webpack not found"
```bash
npm install
npm run build
```

### Error: "Vue component not found"
- Verificar que los paths de imports son correctos
- Verificar que los archivos existen en `/resources/js/pages/Tareas/`

### Error: "Module '@' not found"
- Verificar alias en `webpack.mix.js`
- Generalmente debería estar configurado como:
```javascript
.alias({
  '@': path.resolve('resources/js'),
})
```

### Archivos no se actualizan en navegador
- Limpiar cache del navegador (Ctrl+Shift+Del)
- Ejecutar `npm run dev` para hot reload
- Verificar que manifest.json se generó

## 📊 Verificación de Assets

Usar las herramientas del navegador (F12):
```
Network tab:
- ✓ app.js se descarga (verde)
- ✓ app.css se descarga (verde)
- ✓ No hay errores 404

Console tab:
- ✓ Sin errores de Vue
- ✓ Sin errores de módulos
- ✓ Componentes se cargan correctamente
```

## 🎯 Optimizaciones Post-Compilación

### 1. Gzip Compression (en servidor)
Asegurar que Gzip está habilitado en Nginx/Apache

### 2. Cache Headers (en servidor)
```
Cache-Control: max-age=2592000  # 30 días
```

### 3. Lazy Loading
Los componentes se cargan dinámicamente. Verificar en Network:
- app.js carga primero
- Estilos CSS se aplican

## 📝 Logging

Si hay errores, revisar:
```
/storage/logs/laravel.log        # Errores de backend
F12 > Console                     # Errores de frontend
/var/log/nginx/error.log         # Errores de servidor
```

## 🔄 Compilación Continua (CI/CD)

Si usas CI/CD (GitHub Actions, GitLab CI, etc.):

```yaml
# Ejemplo GitHub Actions
- run: npm install
- run: npm run build
- run: php artisan migrate
- run: php artisan cache:clear
```

## 📞 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "app.js no se carga" | Ejecutar `npm run build` |
| "Estilos no se aplican" | Verificar que app.css existe |
| "Vue errors en console" | Revisar imports en componentes |
| "Componentes no cargan" | Verificar paths relativos |
| "Análisis no funciona" | Verificar puerto 8003 abierto |

## ✨ Verificación Final

```bash
# Compilar
npm run build

# Verificar que no hay errores
# Servir
php artisan serve

# Abrir navegador
http://localhost:8000/tareas/create

# ¡Debe cargar correctamente!
```

---

**Última actualización:** 2025-11-25
**Status:** ✅ Listo para compilar y desplegar
