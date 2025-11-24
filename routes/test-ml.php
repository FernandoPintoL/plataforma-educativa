<?php

/**
 * Ruta de prueba para verificar la integración con ML API
 *
 * Usa: php artisan tinker < routes/test-ml.php
 * O navega a: http://localhost:8000/test-ml
 */

use App\Services\MLPredictionService;

// Crear instancia del servicio
$mlService = app(MLPredictionService::class);

// Datos de prueba
$studentData = [
    'student_id' => 5,
    'promedio_calificaciones' => 7.5,
    'varianza_calificaciones' => 1.2,
    'max_calificacion' => 9.5,
    'min_calificacion' => 5.0,
    'num_calificaciones' => 15,
    'num_trabajos' => 8,
    'promedio_intentos' => 1.5,
    'dias_promedio_entrega' => 2.3,
    'promedio_consultas_material' => 3.2,
    'trabajos_entregados' => 8,
    'trabajos_calificados' => 8,
];

echo "========================================\n";
echo "TEST DE INTEGRACIÓN: Laravel + ML API\n";
echo "========================================\n\n";

// Test 1: Health Check
echo "1. Health Check\n";
echo str_repeat("-", 40) . "\n";
try {
    $health = $mlService->healthCheck();
    echo "✅ API Healthy: " . ($health['status'] === 'healthy' ? 'SÍ' : 'NO') . "\n";
    echo "   Modelos cargados:\n";
    foreach ($health['models_loaded'] as $model => $loaded) {
        echo "   - $model: " . ($loaded ? '✓' : '✗') . "\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 2: Cache Info
echo "2. Cache Info\n";
echo str_repeat("-", 40) . "\n";
try {
    $cacheInfo = $mlService->getCacheInfo();
    if ($cacheInfo['cache']['exists']) {
        echo "✅ Caché cargado\n";
        echo "   Registros: " . $cacheInfo['cache']['num_records'] . "\n";
        echo "   Features: " . $cacheInfo['cache']['num_features'] . "\n";
        echo "   Tamaño: " . $cacheInfo['cache']['size_mb'] . "MB\n";
    } else {
        echo "❌ Caché no encontrado\n";
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 3: Predicción de Riesgo
echo "3. Predicción de Riesgo\n";
echo str_repeat("-", 40) . "\n";
try {
    $risk = $mlService->predictRisk($studentData);
    echo "✅ Predicción exitosa\n";
    echo "   Risk Level: " . $risk['risk_level'] . "\n";
    echo "   Risk Score: " . round($risk['risk_score'], 2) . "\n";
    echo "   Confidence: " . round($risk['confidence'], 2) . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Predicción de Carrera
echo "4. Predicción de Carrera\n";
echo str_repeat("-", 40) . "\n";
try {
    $career = $mlService->predictCareer($studentData);
    echo "✅ Predicción exitosa\n";
    if (!empty($career['top_3_careers'])) {
        foreach ($career['top_3_careers'] as $i => $c) {
            echo "   " . ($i+1) . ". " . $c['career'] .
                 " (" . round($c['compatibility'] * 100) . "%)\n";
        }
    }
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 5: Predicción de Tendencia
echo "5. Predicción de Tendencia\n";
echo str_repeat("-", 40) . "\n";
try {
    $trend = $mlService->predictTrend($studentData);
    echo "✅ Predicción exitosa\n";
    echo "   Trend: " . $trend['trend'] . "\n";
    echo "   Confidence: " . round($trend['confidence'] * 100) . "%\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 6: Análisis de Progreso
echo "6. Análisis de Progreso\n";
echo str_repeat("-", 40) . "\n";
try {
    $progress = $mlService->predictProgress($studentData);
    echo "✅ Predicción exitosa\n";
    echo "   Projected Grade: " . round($progress['projected_grade'], 2) . "\n";
    echo "   Learning Velocity: " . round($progress['learning_velocity'], 2) . "\n";
    echo "   Confidence: " . round($progress['confidence'] * 100) . "%\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}

echo "\n";
echo "========================================\n";
echo "TEST COMPLETADO\n";
echo "========================================\n";
