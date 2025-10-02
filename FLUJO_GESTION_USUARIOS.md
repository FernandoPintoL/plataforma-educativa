# 📚 Flujo de Gestión de Usuarios - Plataforma Educativa

## 🎯 Descripción General

El sistema de gestión de usuarios permite al **Director** crear y administrar cuentas para Profesores, Estudiantes y Padres/Tutores de manera centralizada y segura.

---

## 👥 Roles y Permisos

### Director
- **Permiso principal**: `admin.usuarios`
- **Capacidades**:
  - Crear usuarios (Profesores, Estudiantes, Padres)
  - Editar información de usuarios
  - Activar/Desactivar usuarios
  - Resetear contraseñas
  - Ver estadísticas y reportes

### Tipos de Usuarios que puede crear:
1. **Profesor**: Dicta cursos y gestiona contenido educativo
2. **Estudiante**: Accede a cursos y realiza actividades
3. **Padre/Tutor**: Supervisa el progreso de estudiantes

---

## 🔄 Flujo Completo de Creación de Usuarios

### **Paso 1: Acceso al Sistema de Gestión**
```
Director → Login → Dashboard → Administración → Gestión de Usuarios
```

**Ruta**: `/admin/usuarios`

**Vista**: Muestra:
- Tabla con todos los usuarios (profesores, estudiantes, padres)
- Estadísticas:
  - Total de usuarios
  - Cantidad por tipo (profesor/estudiante/padre)
  - Usuarios activos/inactivos
- Filtros de búsqueda:
  - Por nombre/email/usuario
  - Por tipo de usuario
  - Por estado (activo/inactivo)

---

### **Paso 2: Crear Nuevo Usuario**

El Director hace clic en **"Nuevo Usuario"**

**Ruta**: `/admin/usuarios/create`

**Formulario incluye:**

#### 🔹 **Tipo de Usuario** (Requerido)
- ✅ Profesor
- ✅ Estudiante
- ✅ Padre/Tutor

#### 🔹 **Datos Personales**
| Campo | Requerido | Tipo | Validación |
|-------|-----------|------|------------|
| Nombre | ✅ Sí | Texto | Max 255 caracteres |
| Apellido | ✅ Sí | Texto | Max 255 caracteres |
| Fecha de Nacimiento | ❌ No | Fecha | Debe ser anterior a hoy |
| Teléfono | ❌ No | Texto | Max 20 caracteres |
| Dirección | ❌ No | Texto | Max 500 caracteres |

#### 🔹 **Credenciales de Acceso**
| Campo | Requerido | Validación |
|-------|-----------|------------|
| Email | ✅ Sí | Email válido y único |
| Usuario (usernick) | ✅ Sí | Único, solo letras, números, guiones |
| Contraseña | ✅ Sí* | Mínimo 8 caracteres |

**\*Opciones de contraseña:**
1. **Generar automáticamente** (Recomendado)
   - El sistema genera una contraseña segura
   - Se muestra después de crear el usuario

2. **Definir manualmente**
   - El director ingresa la contraseña
   - Requiere confirmación

#### 🔹 **Opciones Adicionales**
- ☑️ **Enviar credenciales por email**: Envía automáticamente las credenciales al usuario

---

### **Paso 3: Validación y Creación**

El sistema valida:
- ✅ Email único en el sistema
- ✅ Usuario (usernick) único
- ✅ Formato correcto de datos
- ✅ Contraseña cumple requisitos (si es manual)

**Proceso en Backend:**
```php
1. Validar datos del formulario
2. Crear usuario en base de datos
3. Hashear contraseña
4. Asignar rol según tipo_usuario
5. Marcar como activo
6. (Opcional) Enviar email con credenciales
7. Retornar confirmación con credenciales
```

---

### **Paso 4: Confirmación**

**Si la creación es exitosa:**
- ✅ Mensaje de éxito
- 🔑 Muestra la contraseña generada (si fue automática)
- 📧 Confirma envío de email (si se marcó la opción)
- 🔄 Redirecciona a lista de usuarios

**Ejemplo de mensaje:**
```
✓ Usuario Juan Pérez creado exitosamente.
  Contraseña: Xk9#mP2qR5tY
  Se han enviado las credenciales por email.
```

---

## 🔍 Gestión de Usuarios Existentes

### **Ver Detalle de Usuario**
**Ruta**: `/admin/usuarios/{id}`

Muestra:
- 👤 Información personal completa
- 📊 Estadísticas según tipo:
  - **Profesor**: Cursos dictados, total de estudiantes
  - **Estudiante**: Cursos inscritos, trabajos entregados, promedio
  - **Padre**: Hijos asociados
- 🎯 Historial de actividad
- ⚙️ Opciones de administración

---

### **Editar Usuario**
**Ruta**: `/admin/usuarios/{id}/edit`

Permite modificar:
- ✏️ Datos personales
- ✏️ Email y usuario
- ✏️ Tipo de usuario (actualiza roles automáticamente)
- ✏️ Estado (activo/inactivo)

**Restricciones:**
- ❌ No se puede editar la contraseña aquí (hay opción específica)
- ❌ Email y usuario deben seguir siendo únicos

---

### **Resetear Contraseña**
**Ruta**: POST `/admin/usuarios/{id}/reset-password`

El Director puede:
1. Definir nueva contraseña para el usuario
2. Opcionalmente enviarla por email
3. El usuario debe cambiarla en su primer login (opcional)

---

### **Activar/Desactivar Usuario**

**Desactivar** (Soft Delete):
- Usuario no puede iniciar sesión
- Los datos se mantienen en el sistema
- Se puede reactivar en cualquier momento

**Reactivar**:
- Restaura acceso completo al usuario
- Mantiene todos los datos históricos

---

## 🔒 Seguridad Implementada

### **Contraseñas**
- ✅ Hash con bcrypt
- ✅ Mínimo 8 caracteres
- ✅ Generación automática segura (mayúsculas + minúsculas + números + especiales)

### **Validaciones**
- ✅ Email único en el sistema
- ✅ Usuario único en el sistema
- ✅ Formato de email válido
- ✅ Usuario solo con caracteres válidos (alfanumérico, guiones)

### **Permisos**
- ✅ Solo usuarios con permiso `admin.usuarios` pueden acceder
- ✅ Verificación de rol "Director" en middleware
- ✅ Transacciones de base de datos para integridad

---

## 📊 Estadísticas del Dashboard

El sistema muestra en tiempo real:

```
┌─────────────────────────────────────────────────────────┐
│  Total Usuarios: 145                                    │
│  Profesores: 25   Estudiantes: 110   Padres: 10        │
│  Activos: 140     Inactivos: 5                          │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 Características de la Interfaz

### **Filtros Avanzados**
- 🔍 Búsqueda por nombre, email o usuario
- 🏷️ Filtro por tipo (profesor/estudiante/padre)
- 🟢 Filtro por estado (activo/inactivo)
- ↻ Botón para limpiar filtros

### **Tabla de Usuarios**
- 👤 Avatar con iniciales
- 📧 Email de contacto
- 🏷️ Badge indicando tipo y estado
- 📅 Fecha de registro
- ⚙️ Acciones rápidas (Ver/Editar)

### **Paginación**
- 📄 15 usuarios por página
- ⏮️ Navegación anterior/siguiente
- 🔢 Indicador de página actual

---

## 📧 Sistema de Notificaciones (Por implementar)

### **Email de Bienvenida**
Cuando se crea un usuario con "Enviar credenciales":

```
Asunto: Bienvenido a la Plataforma Educativa

Hola [Nombre],

Has sido registrado en la Plataforma Educativa como [Tipo de Usuario].

Tus credenciales de acceso son:
Usuario: [usernick]
Contraseña: [password]
URL: https://plataforma.ejemplo.com/login

Por favor, cambia tu contraseña después de tu primer inicio de sesión.

Saludos,
Equipo de Administración
```

---

## 🔧 Arquitectura Técnica

### **Backend (Laravel)**
```
Controller: GestionUsuariosController
├── index()         → Listar usuarios
├── create()        → Mostrar formulario
├── store()         → Crear usuario
├── show()          → Ver detalle
├── edit()          → Mostrar formulario edición
├── update()        → Actualizar usuario
├── destroy()       → Desactivar usuario
├── reactivar()     → Reactivar usuario
└── resetPassword() → Cambiar contraseña
```

### **Frontend (React + Inertia.js)**
```
Pages/Admin/Usuarios/
├── Index.tsx   → Lista de usuarios
├── Create.tsx  → Formulario de creación
├── Edit.tsx    → Formulario de edición
└── Show.tsx    → Detalle de usuario
```

### **Modelos y Relaciones**
```php
User Model:
├── hasRole()              → Spatie Permissions
├── esProfesor()           → Verificar tipo
├── esEstudiante()         → Verificar tipo
├── esDirector()           → Verificar tipo
├── esPadre()              → Verificar tipo
├── cursosComoProfesor()   → Relación cursos
├── cursosComoEstudiante() → Relación cursos
└── trabajos()             → Relación trabajos
```

---

## 🚀 Mejoras Futuras

### **Fase 1: Importación Masiva**
- 📁 Importar múltiples usuarios desde Excel/CSV
- ✅ Validación por lotes
- 📊 Reporte de importación

### **Fase 2: Auto-registro**
- 🔗 Link de invitación para padres
- ✉️ Verificación de email
- 📝 Formulario de completar perfil

### **Fase 3: Gestión Avanzada**
- 🔄 Cambio de rol masivo
- 📊 Reportes de actividad
- 🔔 Notificaciones personalizadas
- 📸 Fotos de perfil

### **Fase 4: Integración**
- 🔗 SSO (Single Sign-On)
- 🌐 LDAP/Active Directory
- 📱 Autenticación de dos factores (2FA)

---

## 📝 Ejemplo de Uso Completo

### **Escenario: Director crea un nuevo profesor**

1. **Login**: Director ingresa al sistema
2. **Navegación**: Dashboard → Administración → Gestión de Usuarios
3. **Acción**: Click en "Nuevo Usuario"
4. **Formulario**:
   ```
   Tipo: Profesor
   Nombre: María
   Apellido: González
   Email: maria.gonzalez@colegio.edu.bo
   Usuario: maria.gonzalez
   Fecha Nacimiento: 15/03/1985
   Teléfono: +591 78901234
   Generar contraseña: ✅ Sí
   Enviar email: ✅ Sí
   ```
5. **Creación**: Sistema crea usuario
6. **Resultado**:
   ```
   ✓ Usuario María González creado exitosamente.
     Contraseña: Mk9#pL2qR5tY
     Se han enviado las credenciales por email.
   ```
7. **Email**: María recibe email con credenciales
8. **Primer Login**: María ingresa y puede cambiar su contraseña

---

## 🆘 Soporte y Mantenimiento

### **Problemas Comunes**

**P: ¿Qué pasa si el email ya existe?**
R: El sistema muestra error de validación. Debe usar otro email.

**P: ¿Puedo cambiar el tipo de usuario después de crearlo?**
R: Sí, desde la opción "Editar" el sistema actualiza el rol automáticamente.

**P: ¿Los usuarios desactivados pierden sus datos?**
R: No, solo pierden acceso. Al reactivar recuperan todo.

**P: ¿Cómo recupero una contraseña olvidada?**
R: Como Director, usa la opción "Resetear Contraseña" en el perfil del usuario.

---

## 🎓 Conclusión

Este sistema proporciona una gestión centralizada, segura y eficiente de todos los usuarios de la plataforma educativa, permitiendo al Director mantener el control total sobre los accesos mientras facilita la incorporación de nuevos miembros a la comunidad educativa.

**Ventajas del Sistema:**
- ✅ Centralizado
- ✅ Seguro
- ✅ Fácil de usar
- ✅ Escalable
- ✅ Auditable
