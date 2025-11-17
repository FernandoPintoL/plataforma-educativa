/**
 * Herramienta de Debugging para Autenticación API
 *
 * Ayuda a diagnosticar problemas de autenticación en requests
 */

export function debugAuth() {
  console.group('🔍 DEBUG AUTENTICACIÓN API');

  // 1. Verificar CSRF Token
  console.group('1️⃣ CSRF Token');
  const csrfMeta = document.querySelector('meta[name="csrf-token"]');
  const csrfToken = csrfMeta?.getAttribute('content');
  console.log('Meta tag encontrado:', !!csrfMeta);
  console.log('CSRF token:', csrfToken ? `${csrfToken.substring(0, 20)}...` : '❌ NO ENCONTRADO');
  console.groupEnd();

  // 2. Verificar Cookies
  console.group('2️⃣ Cookies');
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [name, value] = cookie.trim().split('=');
    acc[name] = value ? `${value.substring(0, 20)}...` : '(vacío)';
    return acc;
  }, {} as Record<string, string>);
  console.log('Cookies presentes:', Object.keys(cookies));
  console.table(cookies);
  console.log('PHPSESSID:', cookies['PHPSESSID'] ? '✅' : '❌ NO ENCONTRADO');
  console.log('XSRF-TOKEN:', cookies['XSRF-TOKEN'] ? '✅' : '❌ NO ENCONTRADO');
  console.groupEnd();

  // 3. Verificar usuario autenticado
  console.group('3️⃣ Usuario Autenticado');
  const userElement = document.querySelector('[data-user]');
  const userAttr = userElement?.getAttribute('data-user');
  console.log('User data attribute:', userAttr || '❌ NO ENCONTRADO');

  // Buscar en Inertia props
  try {
    const inertiaScript = document.querySelector('script[type="application/json"]');
    if (inertiaScript) {
      const data = JSON.parse(inertiaScript.textContent || '{}');
      console.log('Inertia user:', data.props?.auth?.user ? '✅' : '❌ NO ENCONTRADO');
      if (data.props?.auth?.user) {
        console.log('User ID:', data.props.auth.user.id);
        console.log('User email:', data.props.auth.user.email);
      }
    }
  } catch (e) {
    console.warn('No se pudo leer Inertia data');
  }
  console.groupEnd();

  // 4. Test de request
  console.group('4️⃣ Test Manual de Request');
  console.log('Ejecuta en la consola:');
  console.log(`
fetch('/api/notificaciones?limit=5', {
  method: 'GET',
  credentials: 'include',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-CSRF-TOKEN': '${csrfToken || 'TOKEN_AQUI'}',
  }
})
.then(r => r.json())
.then(d => console.log('✅ Success:', d))
.catch(e => console.error('❌ Error:', e))
  `);
  console.groupEnd();

  // 5. Verificar localStorage/sessionStorage
  console.group('5️⃣ Storage');
  console.log('LocalStorage keys:', Object.keys(localStorage));
  console.log('SessionStorage keys:', Object.keys(sessionStorage));
  console.groupEnd();

  console.groupEnd();
}

// Exportar para uso en consola
(window as any).debugAuth = debugAuth;

// Ejecutar automáticamente en development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    console.log('💡 Ejecuta debugAuth() en la consola para debugging');
  }, 1000);
}
