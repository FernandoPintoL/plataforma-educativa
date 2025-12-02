#!/bin/bash

echo "=========================================="
echo "VERIFICADOR DE FLUJO DE CALIFICACIÓN"
echo "=========================================="
echo ""

# Función para mostrar encabezados
section() {
    echo ""
    echo ">>> $1"
    echo "---"
}

# 1. Verificar que Laravel esté corriendo
section "1. Verificando servidor Laravel"
if curl -s http://127.0.0.1:8000 > /dev/null; then
    echo "✓ Servidor Laravel está activo"
else
    echo "✗ Servidor Laravel NO está accesible"
    exit 1
fi

# 2. Verificar base de datos
section "2. Verificando conexión a base de datos"
cd D:/PLATAFORMA\ EDUCATIVA/plataforma-educativa
php artisan tinker --execute="echo 'DB connected';" 2>/dev/null && echo "✓ Base de datos accesible" || echo "✗ Error en BD"

# 3. Verificar último trabajo con ID 1155
section "3. Verificando trabajo ID 1155"
php artisan tinker << 'PHP'
$trabajo = \App\Models\Trabajo::with(['calificacion'])->find(1155);
if ($trabajo) {
    echo "✓ Trabajo encontrado\n";
    echo "  - Estado: {$trabajo->estado}\n";
    echo "  - Estudiante ID: {$trabajo->estudiante_id}\n";
    if ($trabajo->calificacion) {
        echo "  - Calificación ID: {$trabajo->calificacion->id}\n";
        echo "  - Puntaje actual: {$trabajo->calificacion->puntaje}\n";
        echo "  - Última actualización: {$trabajo->calificacion->updated_at}\n";
    } else {
        echo "  - Sin calificación aún\n";
    }
} else {
    echo "✗ Trabajo no encontrado\n";
}
PHP

# 4. Mostrar últimos logs
section "4. Últimos 5 logs de calificación"
tail -50 storage/logs/laravel.log | grep -E "INICIANDO CALIFICACIÓN|TRANSACCIÓN COMPROMETIDA|Actualizando calificación|Creando nueva" || echo "No hay logs de calificación aún"

# 5. Instrucciones
section "5. Para hacer una prueba:"
echo "1. Ve a: http://127.0.0.1:8000/trabajos/1155/calificar"
echo "2. Ingresa como profesor1"
echo "3. Cambia el puntaje (ej: 85)"
echo "4. Haz clic en 'Guardar Calificación'"
echo "5. Espera a que se recargue la página"
echo "6. Verifica que el puntaje se haya actualizado"
echo ""
echo "7. Luego ejecuta este script nuevamente para verificar los logs"

