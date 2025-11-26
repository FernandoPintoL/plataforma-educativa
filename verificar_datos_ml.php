<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;
use App\Models\Calificacion;
use App\Models\Trabajo;
use App\Models\RendimientoAcademico;
use App\Models\User;

echo "\n" . str_repeat("=", 70) . "\n";
echo "✅ VERIFICACIÓN DE DATOS PARA ENTRENAMIENT ML\n";
echo str_repeat("=", 70) . "\n\n";

// Conteos generales
$totalEstudiantes = User::where('tipo_usuario', 'estudiante')->count();
$totalTrabajo = Trabajo::count();
$totalCalificaciones = Calificacion::count();
$totalRendimiento = RendimientoAcademico::count();

echo "📊 CONTEO DE DATOS:\n";
echo "  • Estudiantes: {$totalEstudiantes}\n";
echo "  • Trabajos entregados: {$totalTrabajo}\n";
echo "  • Calificaciones: {$totalCalificaciones}\n";
echo "  • Registros de rendimiento académico: {$totalRendimiento}\n\n";

// Estadísticas de calificaciones
echo "📈 ESTADÍSTICAS DE CALIFICACIONES:\n";
$estadisticas = DB::table('calificaciones')
    ->selectRaw('
        MIN(puntaje) as minimo,
        MAX(puntaje) as maximo,
        AVG(puntaje) as promedio,
        STDDEV(puntaje) as desviacion
    ')
    ->first();

echo "  • Mínimo: " . round($estadisticas->minimo, 2) . "\n";
echo "  • Máximo: " . round($estadisticas->maximo, 2) . "\n";
echo "  • Promedio: " . round($estadisticas->promedio, 2) . "\n";
echo "  • Desviación estándar: " . round($estadisticas->desviacion, 2) . "\n\n";

// Correlación entre desempeño y calificaciones
echo "🔗 CORRELACIÓN DESEMPEÑO - CALIFICACIONES:\n";
$correlacion = DB::table('users')
    ->join('trabajos', 'users.id', '=', 'trabajos.estudiante_id')
    ->join('calificaciones', 'trabajos.id', '=', 'calificaciones.trabajo_id')
    ->select(
        DB::raw('users.desempeño_promedio as desempeño'),
        DB::raw('calificaciones.puntaje as calificacion')
    )
    ->limit(20)
    ->get();

echo "  Muestra de relación (primeros 10):\n";
foreach ($correlacion->slice(0, 10) as $row) {
    echo "    Desempeño: " . round($row->desempeño, 1) . " → Calificación: " . round($row->calificacion, 1) . "\n";
}

// Distribución de calificaciones
echo "\n📊 DISTRIBUCIÓN DE CALIFICACIONES:\n";
$distribucion = DB::table('calificaciones')
    ->selectRaw('
        SUM(CASE WHEN puntaje >= 90 THEN 1 ELSE 0 END) as excelente,
        SUM(CASE WHEN puntaje >= 80 AND puntaje < 90 THEN 1 ELSE 0 END) as muy_bueno,
        SUM(CASE WHEN puntaje >= 70 AND puntaje < 80 THEN 1 ELSE 0 END) as bueno,
        SUM(CASE WHEN puntaje >= 60 AND puntaje < 70 THEN 1 ELSE 0 END) as satisfactorio,
        SUM(CASE WHEN puntaje < 60 THEN 1 ELSE 0 END) as necesita_mejora
    ')
    ->first();

echo "  • A (90-100): " . $distribucion->excelente . " (" . round(($distribucion->excelente/$totalCalificaciones)*100, 1) . "%)\n";
echo "  • B (80-89): " . $distribucion->muy_bueno . " (" . round(($distribucion->muy_bueno/$totalCalificaciones)*100, 1) . "%)\n";
echo "  • C (70-79): " . $distribucion->bueno . " (" . round(($distribucion->bueno/$totalCalificaciones)*100, 1) . "%)\n";
echo "  • D (60-69): " . $distribucion->satisfactorio . " (" . round(($distribucion->satisfactorio/$totalCalificaciones)*100, 1) . "%)\n";
echo "  • F (<60): " . $distribucion->necesita_mejora . " (" . round(($distribucion->necesita_mejora/$totalCalificaciones)*100, 1) . "%)\n\n";

// Datos de rendimiento académico
echo "🎓 RENDIMIENTO ACADÉMICO:\n";
$rendimiento = RendimientoAcademico::select(
    DB::raw('MIN(promedio) as minimo'),
    DB::raw('MAX(promedio) as maximo'),
    DB::raw('AVG(promedio) as promedio'),
    DB::raw('STDDEV(promedio) as desviacion')
)->first();

echo "  • Promedio mínimo: " . round($rendimiento->minimo, 2) . "\n";
echo "  • Promedio máximo: " . round($rendimiento->maximo, 2) . "\n";
echo "  • Promedio general: " . round($rendimiento->promedio, 2) . "\n";
echo "  • Desviación estándar: " . round($rendimiento->desviacion, 2) . "\n\n";

echo "✅ DATOS LISTA PARA ENTRENAR MODELOS DE ML\n";
echo str_repeat("=", 70) . "\n\n";

// Ejemplo de características para ML
echo "📋 EJEMPLO DE CARACTERÍSTICAS DISPONIBLES PARA ML:\n";
$ejemplo = DB::table('users')
    ->leftJoin('calificaciones', function($join) {
        $join->on('users.id', '=', DB::raw('(SELECT estudiante_id FROM trabajos WHERE id = calificaciones.trabajo_id)'));
    })
    ->where('users.tipo_usuario', 'estudiante')
    ->select(
        'users.desempeño_promedio',
        'users.asistencia_porcentaje',
        'users.participacion_porcentaje',
        'users.tareas_completadas',
        'users.tareas_pendientes'
    )
    ->first();

if ($ejemplo) {
    echo "  • Desempeño promedio: {$ejemplo->desempeño_promedio}\n";
    echo "  • Asistencia (%): {$ejemplo->asistencia_porcentaje}\n";
    echo "  • Participación (%): {$ejemplo->participacion_porcentaje}\n";
    echo "  • Tareas completadas: {$ejemplo->tareas_completadas}\n";
    echo "  • Tareas pendientes: {$ejemplo->tareas_pendientes}\n";
}

echo "\n💡 PUEDES USAR ESTOS DATOS PARA:\n";
echo "  ✓ Entrenar modelos de predicción de desempeño\n";
echo "  ✓ Clasificar estudiantes por riesgo de abandono\n";
echo "  ✓ Predecir calificaciones basado en comportamiento\n";
echo "  ✓ Análisis de tendencias de aprendizaje\n";
echo "  ✓ Recomendaciones personalizadas\n\n";
