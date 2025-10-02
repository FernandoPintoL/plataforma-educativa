# 📊 Diagrama de Flujo - Sistema de Gestión de Usuarios

## 🎯 Flujo Principal: Creación de Usuarios

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        INICIO: Director Login                            │
└─────────────────────┬───────────────────────────────────────────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │   Dashboard Principal       │
         └────────────┬───────────────┘
                      │
                      ▼
         ┌────────────────────────────┐
         │  Menú: Administración       │
         │  → Gestión de Usuarios      │
         └────────────┬───────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    LISTA DE USUARIOS                                     │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  📊 Estadísticas:                                                 │  │
│  │  • Total: 145 usuarios                                            │  │
│  │  • Profesores: 25  Estudiantes: 110  Padres: 10                  │  │
│  │  • Activos: 140    Inactivos: 5                                   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  🔍 Filtros:                                                       │  │
│  │  [ Buscar... ] [Tipo ▼] [Estado ▼] [Filtrar] [Limpiar]          │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Tabla de Usuarios                         [+ Nuevo Usuario]     │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Nombre  │ Tipo      │ Email            │ Estado │ Acciones │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Juan P. │ Profesor  │ juan@...         │ Activo │ Ver/Edit │  │  │
│  │  │ María G.│ Estudiant.│ maria@...        │ Activo │ Ver/Edit │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             │ Click: [+ Nuevo Usuario]
             ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FORMULARIO: CREAR USUARIO                             │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PASO 1: Tipo de Usuario                                         │  │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                     │  │
│  │  │ ☑ Profesor│  │ ☐ Estudian│  │ ☐ Padre   │                     │  │
│  │  └───────────┘  └───────────┘  └───────────┘                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PASO 2: Datos Personales                                        │  │
│  │  ┌────────────────────┐  ┌────────────────────┐                  │  │
│  │  │ Nombre: *          │  │ Apellido: *        │                  │  │
│  │  │ [_______________]  │  │ [_______________]  │                  │  │
│  │  └────────────────────┘  └────────────────────┘                  │  │
│  │  ┌────────────────────┐  ┌────────────────────┐                  │  │
│  │  │ F. Nacimiento:     │  │ Teléfono:          │                  │  │
│  │  │ [_______________]  │  │ [_______________]  │                  │  │
│  │  └────────────────────┘  └────────────────────┘                  │  │
│  │  ┌────────────────────────────────────────────┐                  │  │
│  │  │ Dirección:                                 │                  │  │
│  │  │ [______________________________________]   │                  │  │
│  │  └────────────────────────────────────────────┘                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  PASO 3: Credenciales de Acceso                                  │  │
│  │  ┌────────────────────┐  ┌────────────────────┐                  │  │
│  │  │ Email: *           │  │ Usuario: *         │                  │  │
│  │  │ [_______________]  │  │ [@____________]    │                  │  │
│  │  └────────────────────┘  └────────────────────┘                  │  │
│  │  ┌────────────────────────────────────────────┐                  │  │
│  │  │ ☑ Generar contraseña automáticamente      │                  │  │
│  │  │ ☐ Enviar credenciales por email           │                  │  │
│  │  └────────────────────────────────────────────┘                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  [Cancelar]                                        [Crear Usuario]      │
└────────────┬────────────────────────────────────────────────────────────┘
             │
             │ Click: [Crear Usuario]
             ▼
        ┌─────────┐
        │Validar  │
        │Datos    │
        └────┬────┘
             │
        ┌────┴────┐
        │¿Válido? │
        └────┬────┘
             │
        ┌────┴─────────────────┐
        │                      │
        ▼ SI                   ▼ NO
┌───────────────┐      ┌──────────────┐
│ Crear Usuario │      │ Mostrar      │
│ en BD         │      │ Errores      │
└───────┬───────┘      └──────┬───────┘
        │                     │
        │                     └──────┐
        ▼                            │
┌───────────────┐                    │
│ Hashear Pass  │                    │
└───────┬───────┘                    │
        │                            │
        ▼                            │
┌───────────────┐                    │
│ Asignar Rol   │                    │
└───────┬───────┘                    │
        │                            │
        ▼                            │
    ┌───────┐                        │
    │¿Enviar│                        │
    │Email? │                        │
    └───┬───┘                        │
        │                            │
   ┌────┴─────────┐                  │
   │              │                  │
   ▼ SI           ▼ NO               │
┌────────┐   ┌─────────┐             │
│Enviar  │   │Continuar│             │
│Email   │   │         │             │
└───┬────┘   └────┬────┘             │
    │             │                  │
    └──────┬──────┘                  │
           │                         │
           ▼                         │
┌──────────────────────────────┐    │
│  ✓ Usuario Creado            │    │
│                              │    │
│  Nombre: María González      │    │
│  Email: maria@...            │    │
│  Usuario: maria.gonzalez     │    │
│  Contraseña: Mk9#pL2qR5tY   │    │
│                              │    │
│  ☑ Email enviado            │    │
└──────────────┬───────────────┘    │
               │                    │
               ▼                    │
        [Volver a Lista] ◄──────────┘
               │
               ▼
        ┌──────────────┐
        │  Lista de    │
        │  Usuarios    │
        │  (Actualizada)│
        └──────────────┘
```

---

## 🔄 Flujo: Editar Usuario

```
Lista de Usuarios
       │
       │ Click: [Editar]
       ▼
┌─────────────────────────────────────┐
│   FORMULARIO: EDITAR USUARIO        │
│                                     │
│   Campos Pre-llenados:              │
│   • Nombre: María                   │
│   • Apellido: González              │
│   • Email: maria@...                │
│   • Usuario: maria.gonzalez         │
│   • Tipo: Profesor                  │
│   • Estado: ☑ Activo                │
│                                     │
│   [Cancelar]  [Actualizar]          │
└──────────┬──────────────────────────┘
           │
           │ Click: [Actualizar]
           ▼
     ┌────────────┐
     │  Validar   │
     └──────┬─────┘
            │
            ▼
     ┌────────────┐
     │ Actualizar │
     │ en BD      │
     └──────┬─────┘
            │
            ▼
     ┌────────────┐
     │¿Cambió tipo│
     │ usuario?   │
     └──────┬─────┘
            │
       ┌────┴────┐
       │         │
       ▼ SI      ▼ NO
  ┌─────────┐   │
  │Actualizar│  │
  │ Rol      │  │
  └────┬────┘   │
       └────┬───┘
            │
            ▼
    ✓ Usuario Actualizado
            │
            ▼
      [Ver Usuario]
```

---

## 🔐 Flujo: Resetear Contraseña

```
Ver Usuario
     │
     │ Click: [Resetear Contraseña]
     ▼
┌─────────────────────────────┐
│  MODAL: Nueva Contraseña    │
│                             │
│  Nueva Contraseña:          │
│  [__________________]       │
│                             │
│  Confirmar:                 │
│  [__________________]       │
│                             │
│  ☐ Enviar por email         │
│                             │
│  [Cancelar] [Resetear]      │
└────────┬────────────────────┘
         │
         │ Click: [Resetear]
         ▼
    ┌─────────┐
    │Validar  │
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │Hashear  │
    │Password │
    └────┬────┘
         │
         ▼
    ┌─────────┐
    │Actualizar│
    │en BD    │
    └────┬────┘
         │
         ▼
✓ Contraseña Actualizada
```

---

## 📊 Flujo: Activar/Desactivar Usuario

```
Ver Usuario
     │
     │ Estado actual: Activo
     │
     │ Click: [Desactivar]
     ▼
┌─────────────────────────────┐
│  CONFIRMACIÓN               │
│                             │
│  ⚠ ¿Desactivar usuario?     │
│                             │
│  El usuario no podrá        │
│  iniciar sesión.            │
│                             │
│  [Cancelar] [Desactivar]    │
└────────┬────────────────────┘
         │
         │ Click: [Desactivar]
         ▼
    ┌─────────┐
    │Actualizar│
    │activo=false│
    └────┬────┘
         │
         ▼
✓ Usuario Desactivado
         │
         ▼
    Ver Usuario
    (Estado: Inactivo)
    [Reactivar]
```

---

## 🎭 Diagrama de Roles y Permisos

```
┌──────────────────────────────────────────────────────────────┐
│                    JERARQUÍA DE ROLES                         │
└──────────────────────────────────────────────────────────────┘

         ┌─────────────┐
         │   ADMIN     │ ← Todos los permisos
         └──────┬──────┘
                │
         ┌──────┴──────┐
         │  DIRECTOR   │ ← admin.usuarios + gestión completa
         └──────┬──────┘
                │
      ┌─────────┴─────────┐
      │                   │
┌─────┴─────┐      ┌──────┴──────┐
│  PROFESOR │      │ ESTUDIANTE  │
└───────────┘      └──────┬──────┘
                          │
                    ┌─────┴──────┐
                    │   PADRE    │
                    └────────────┘

┌──────────────────────────────────────────────────────────────┐
│                   PERMISOS POR ROL                            │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  DIRECTOR puede:                                             │
│  ✅ Crear usuarios (admin.usuarios)                          │
│  ✅ Editar usuarios                                          │
│  ✅ Desactivar/Reactivar usuarios                            │
│  ✅ Resetear contraseñas                                     │
│  ✅ Ver estadísticas completas                               │
│  ✅ Todos los permisos de cursos                             │
│  ✅ Todos los permisos de contenido                          │
│  ✅ Gestionar evaluaciones                                   │
│  ✅ Ver reportes y análisis                                  │
│                                                               │
│  PROFESOR puede:                                             │
│  ✅ Crear/editar cursos propios                              │
│  ✅ Crear contenido educativo                                │
│  ✅ Asignar tareas                                           │
│  ✅ Calificar trabajos                                       │
│  ✅ Ver estudiantes de sus cursos                            │
│  ❌ No puede crear usuarios                                  │
│                                                               │
│  ESTUDIANTE puede:                                           │
│  ✅ Ver cursos inscritos                                     │
│  ✅ Acceder a contenido                                      │
│  ✅ Entregar tareas                                          │
│  ✅ Tomar evaluaciones                                       │
│  ✅ Ver calificaciones propias                               │
│  ❌ No puede crear usuarios                                  │
│                                                               │
│  PADRE puede:                                                │
│  ✅ Ver cursos de hijos                                      │
│  ✅ Ver calificaciones de hijos                              │
│  ✅ Acceder a reportes de progreso                           │
│  ❌ No puede crear usuarios                                  │
│  ❌ No puede editar contenido                                │
│                                                               │
└──────────────────────────────────────────────────────────────┘
```

---

## 📝 Casos de Uso Específicos

### **Caso 1: Director crea un Profesor**

```
1. Director → Login (director@paucara.test)
2. Dashboard → Administración → Gestión de Usuarios
3. Click: [+ Nuevo Usuario]
4. Seleccionar: Tipo → Profesor
5. Ingresar datos:
   - Nombre: María
   - Apellido: González
   - Email: maria.gonzalez@colegio.edu.bo
   - Usuario: maria.gonzalez (auto-generado)
   - ☑ Generar contraseña automáticamente
   - ☑ Enviar credenciales por email
6. Click: [Crear Usuario]
7. Sistema:
   ✓ Valida datos
   ✓ Crea usuario en BD
   ✓ Asigna rol "profesor"
   ✓ Genera contraseña: Mk9#pL2qR5tY
   ✓ Envía email a maría
8. Resultado:
   "Usuario María González creado exitosamente.
    Contraseña: Mk9#pL2qR5tY
    Se han enviado las credenciales por email."
```

### **Caso 2: Profesor intenta acceder a Gestión de Usuarios**

```
1. Profesor → Login (profesor@paucara.test)
2. Dashboard → Busca "Administración"
3. Resultado: ❌ No aparece en menú
4. Si intenta acceder directamente:
   URL: /admin/usuarios
   Resultado: ❌ Error 403 - No autorizado
   "No tienes permisos para acceder a esta sección"
```

### **Caso 3: Director desactiva un Estudiante**

```
1. Director → Gestión de Usuarios
2. Filtrar: Tipo → Estudiante
3. Buscar: "Juan Pérez"
4. Click: [Editar]
5. Desmarcar: ☐ Activo
6. Click: [Actualizar]
7. Sistema:
   ✓ Actualiza activo = false
   ✓ Usuario no puede iniciar sesión
   ✓ Datos se mantienen en BD
8. Estudiante intenta login:
   Resultado: ❌ "Tu cuenta ha sido desactivada"
```

---

Este flujo completo muestra cómo el Director tiene control centralizado sobre la creación y gestión de usuarios, manteniendo la seguridad y organización del sistema educativo.
