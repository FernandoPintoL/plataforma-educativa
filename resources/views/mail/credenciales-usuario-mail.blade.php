<x-mail::message>
# ¡Bienvenido a la Plataforma Educativa!

Hola {{ $user->nombre_completo }},

Tu cuenta ha sido creada exitosamente en la **Plataforma Educativa**. Aquí están tus credenciales de acceso:

**Datos de inicio de sesión:**
- **Usuario/Email:** {{ $user->email }}
- **Contraseña temporal:** {{ $password }}

<x-mail::button :url="config('app.url') . '/login'">
Acceder a la Plataforma
</x-mail::button>

**Pasos recomendados:**

1. Accede a la plataforma con tus credenciales
2. Cambia tu contraseña temporal por una contraseña segura y personal
3. Completa tu perfil con información adicional
4. Explora los módulos y funcionalidades disponibles

**Importante:**
- La contraseña que recibiste es temporal y debe ser cambiada al primer inicio de sesión
- Por seguridad, no compartas tu contraseña con nadie
- Si no puedes acceder, contacta al administrador del sistema

Si tienes preguntas o necesitas ayuda, no dudes en contactar al equipo de soporte.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
