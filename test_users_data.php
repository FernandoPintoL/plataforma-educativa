<?php
/**
 * Verificar Datos de Usuarios de Prueba
 * Usuarios: director1, profesor1, estudiante1, padre1
 */

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\DB;

echo "=== VERIFICACIÓN DE USUARIOS DE PRUEBA ===\n\n";

$usuarios = ['director1', 'profesor1', 'estudiante1', 'padre1'];

foreach ($usuarios as $nombreUsuario) {
    echo "\n" . str_repeat("=", 60) . "\n";
    echo "USUARIO: $nombreUsuario\n";
    echo str_repeat("=", 60) . "\n\n";

    $user = User::where('name', $nombreUsuario)->first();

    if (!$user) {
        echo "❌ Usuario NO encontrado\n";
        continue;
    }

    echo "✓ Usuario encontrado\n";
    echo "  ID: {$user->id}\n";
    echo "  Email: {$user->email}\n";
    echo "  Tipo: {$user->tipo_usuario}\n";
    echo "  Estado: " . ($user->email_verified_at ? "Verificado" : "No verificado") . "\n\n";

    // Datos adicionales según tipo
    switch ($user->tipo_usuario) {
        case 'director':
            echo "📋 DATOS DIRECTOR:\n";
            // Directors don't have courses directly, check if they manage any
            echo "  - Rol: Director (administrador)\n\n";
            break;

        case 'profesor':
            echo "📋 DATOS PROFESOR:\n";
            $cursos = DB::table('cursos')->where('profesor_id', $user->id)->count();
            echo "  - Cursos asignados: $cursos\n";

            if ($cursos > 0) {
                $cursosData = DB::table('cursos')->where('profesor_id', $user->id)->get();
                foreach ($cursosData as $curso) {
                    $estudiantesEnCurso = DB::table('curso_estudiante')
                        ->where('curso_id', $curso->id)
                        ->count();
                    echo "    • {$curso->nombre}: $estudiantesEnCurso estudiantes\n";
                }
            }
            echo "\n";
            break;

        case 'estudiante':
            echo "📋 DATOS ESTUDIANTE:\n";
            $cursos = DB::table('curso_estudiante')->where('estudiante_id', $user->id)->count();
            echo "  - Cursos matriculados: $cursos\n";

            if ($cursos > 0) {
                $cursosData = DB::table('curso_estudiante')
                    ->join('cursos', 'curso_estudiante.curso_id', '=', 'cursos.id')
                    ->where('curso_estudiante.estudiante_id', $user->id)
                    ->select('cursos.nombre')
                    ->get();
                foreach ($cursosData as $curso) {
                    echo "    • {$curso->nombre}\n";
                }
            }

            // Rendimiento académico
            $rendimiento = DB::table('rendimiento_academico')
                ->where('estudiante_id', $user->id)
                ->first();
            if ($rendimiento) {
                echo "  - Promedio académico: {$rendimiento->promedio}\n";
            }

            // Predicciones de riesgo
            $riesgo = DB::table('predicciones_riesgo')
                ->where('estudiante_id', $user->id)
                ->first();
            if ($riesgo) {
                echo "  - Nivel de riesgo: {$riesgo->nivel_riesgo}\n";
            }

            // Predicciones de carrera
            $carrera = DB::table('predicciones_carrera')
                ->where('estudiante_id', $user->id)
                ->first();
            if ($carrera) {
                echo "  - Carrera sugerida: {$carrera->carrera_nombre}\n";
            }

            // Cluster asignado
            $cluster = DB::table('student_clusters')
                ->where('estudiante_id', $user->id)
                ->first();
            if ($cluster) {
                echo "  - Cluster asignado: {$cluster->cluster_id}\n";
            }

            echo "\n";
            break;

        case 'padre':
            echo "📋 DATOS PADRE:\n";
            $hijos = DB::table('padre_estudiante')
                ->where('padre_id', $user->id)
                ->count();
            echo "  - Hijos (estudiantes): $hijos\n";

            if ($hijos > 0) {
                $hijosList = DB::table('padre_estudiante')
                    ->join('users', 'padre_estudiante.estudiante_id', '=', 'users.id')
                    ->where('padre_estudiante.padre_id', $user->id)
                    ->select('users.name', 'users.id')
                    ->get();
                foreach ($hijosList as $hijo) {
                    echo "    • {$hijo->name} (ID: {$hijo->id})\n";
                }
            }
            echo "\n";
            break;
    }
}

echo "\n" . str_repeat("=", 60) . "\n";
echo "VERIFICACIÓN DE DATOS PARA TESTING ML\n";
echo str_repeat("=", 60) . "\n\n";

// Buscar el estudiante de prueba
$estudiante = User::where('name', 'estudiante1')->first();

if ($estudiante) {
    echo "✓ Estudiante encontrado: {$estudiante->name} (ID: {$estudiante->id})\n\n";

    // Datos necesarios para ML
    $rendimiento = DB::table('rendimiento_academico')
        ->where('estudiante_id', $estudiante->id)
        ->first();

    $riesgo = DB::table('predicciones_riesgo')
        ->where('estudiante_id', $estudiante->id)
        ->count();

    $carrera = DB::table('predicciones_carrera')
        ->where('estudiante_id', $estudiante->id)
        ->count();

    $progreso = DB::table('predicciones_progreso')
        ->where('estudiante_id', $estudiante->id)
        ->count();

    $tendencia = DB::table('predicciones_tendencia')
        ->where('estudiante_id', $estudiante->id)
        ->count();

    $cluster = DB::table('student_clusters')
        ->where('estudiante_id', $estudiante->id)
        ->first();

    echo "📊 DATOS PARA ML:\n";
    echo "  ✓ Rendimiento académico: " . ($rendimiento ? "✅ CREADO" : "❌ SIN DATOS") . "\n";
    echo "  ✓ Predicciones de riesgo: " . ($riesgo > 0 ? "$riesgo registros ✅" : "❌ SIN DATOS") . "\n";
    echo "  ✓ Predicciones de carrera: " . ($carrera > 0 ? "$carrera registros ✅" : "❌ SIN DATOS") . "\n";
    echo "  ✓ Predicciones de progreso: " . ($progreso > 0 ? "$progreso registros ✅" : "❌ SIN DATOS") . "\n";
    echo "  ✓ Predicciones de tendencia: " . ($tendencia > 0 ? "$tendencia registros ✅" : "❌ SIN DATOS") . "\n";
    echo "  ✓ Asignación a cluster: " . ($cluster ? "✅ CREADA" : "❌ SIN DATOS") . "\n";

    echo "\n📌 RESULTADO: ";
    if ($rendimiento && $riesgo > 0 && $cluster) {
        echo "✅ LISTO PARA PRUEBAS DE ML\n";
        echo "\n🧪 ENDPOINT PARA PRUEBAS:\n";
        echo "   GET /api/ml/student/{$estudiante->id}/analysis\n\n";
        echo "   Autenticación: Usar profesor1@educativa.local con password: password123\n";
    } else {
        echo "⚠️ INCOMPLETO - VERIFICAR DATOS\n";
    }
} else {
    echo "❌ Estudiante no encontrado\n";
}

echo "\n";
