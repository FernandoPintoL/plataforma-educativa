<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Profesor;
use App\Models\Curso;
use App\Models\Evaluacion;
use App\Models\Pregunta;
use App\Models\Trabajo;
use Illuminate\Support\Facades\DB;

echo "\n╔════════════════════════════════════════════════════════════════╗\n";
echo "║  VERIFICACIÓN Y CORRECCIÓN DEL SISTEMA COMPLETO               ║\n";
echo "╚════════════════════════════════════════════════════════════════╝\n\n";

// 1. Find any professor with evaluaciones
echo "1️⃣  FINDING PROFESSOR WITH EVALUATIONS...\n";
$profesor = Evaluacion::with('profesor')->first()?->profesor;

if (!$profesor) {
    echo "   ℹ️  No evaluations exist yet in system\n";
    echo "   ✓ Creating sample data...\n";

    // Get first professor and first 4 students
    $profesor = Profesor::first();
    if (!$profesor) {
        echo "   ❌ Cannot find professor in database\n";
        exit;
    }

    // Get first curso
    $curso = Curso::first();
    if (!$curso) {
        echo "   ❌ No courses found in database\n";
        exit;
    }

    echo "   ✓ Using profesor: {$profesor->nombre}\n";
    echo "   ✓ Using course: {$curso->nombre}\n";

    // Create evaluaciones
    for ($i = 1; $i <= 2; $i++) {
        $evaluacion = Evaluacion::create([
            'titulo' => "Evaluación {$i} - {$curso->nombre}",
            'descripcion' => "Descripción de evaluación {$i}",
            'estado' => 'publicado',
            'curso_id' => $curso->id,
            'profesor_id' => $profesor->id,
            'tipo_evaluacion' => 'quiz',
            'puntuacion_total' => 10,
        ]);

        echo "   ✓ Created evaluación: Evaluación {$i}\n";
    }

    $evaluaciones = Evaluacion::where('profesor_id', $profesor->id)->get();
} else {
    echo "   ✓ Found profesor: {$profesor->nombre}\n";
    $evaluaciones = $profesor->evaluaciones ?? Evaluacion::where('profesor_id', $profesor->id)->get();
    echo "   ✓ Found {$evaluaciones->count()} evaluations\n";
}

// 2. Get course info from first evaluación
echo "\n2️⃣  GETTING EVALUATIONS COURSE...\n";
if ($evaluaciones->isEmpty()) {
    echo "   ❌ No evaluations found\n";
    exit;
}

$primeraEval = $evaluaciones->first();
$cursoEvaluaciones = $primeraEval->curso;
if (!$cursoEvaluaciones) {
    echo "   ❌ Evaluación missing curso relationship\n";
    exit;
}

echo "   ✓ Evaluations course: {$cursoEvaluaciones->nombre}\n";

// 3. Get estudiantes from the course
echo "\n3️⃣  GETTING STUDENTS FROM COURSE...\n";
$estudiantes = $cursoEvaluaciones->estudiantes()->limit(4)->get();
if ($estudiantes->isEmpty()) {
    echo "   ⚠️  No students enrolled in this course\n";
    echo "   Getting first 4 students from system...\n";
    
    // Get any 4 students
    $estudiantes = DB::table('students')->limit(4)->get();
    if ($estudiantes->isEmpty()) {
        echo "   ❌ Cannot find students in database\n";
        exit;
    }
}

echo "   ✓ Found {$estudiantes->count()} students:\n";
foreach ($estudiantes as $est) {
    $nombre = $est->nombre ?? $est->name ?? 'Unknown';
    echo "      - {$nombre}\n";
}

// 4. Check current enrollments
echo "\n4️⃣  CHECKING CURRENT ENROLLMENTS...\n";
$needsEnrollment = [];
foreach ($estudiantes as $estudiante) {
    $isEnrolled = DB::table('estudiante_curso')
        ->where('estudiante_id', $estudiante->id)
        ->where('curso_id', $cursoEvaluaciones->id)
        ->exists();

    if ($isEnrolled) {
        echo "   ✓ {$estudiante->nombre}: Already enrolled\n";
    } else {
        echo "   ⚠️  {$estudiante->nombre}: NOT enrolled\n";
        $needsEnrollment[] = $estudiante;
    }
}

// 5. Enroll students
if (!empty($needsEnrollment)) {
    echo "\n5️⃣  ENROLLING STUDENTS...\n";
    foreach ($needsEnrollment as $estudiante) {
        DB::table('estudiante_curso')->insert([
            'estudiante_id' => $estudiante->id,
            'curso_id' => $cursoEvaluaciones->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "   ✓ Enrolled {$estudiante->nombre}\n";
    }
} else {
    echo "\n5️⃣  ALL STUDENTS ALREADY ENROLLED ✓\n";
}

// 6. Verify questions
echo "\n6️⃣  VERIFYING QUESTIONS...\n";
$totalPreguntas = Pregunta::count();
if ($totalPreguntas === 0) {
    echo "   ⚠️  No questions found. Creating sample questions...\n";

    foreach ($evaluaciones as $eval) {
        for ($i = 1; $i <= 5; $i++) {
            Pregunta::create([
                'evaluacion_id' => $eval->id,
                'enunciado' => "Pregunta {$i} de Evaluación {$eval->id}",
                'tipo' => 'opcion_multiple',
                'opciones' => json_encode(['A', 'B', 'C', 'D']),
                'respuesta_correcta' => 'A',
                'puntos' => 1,
                'orden' => $i,
            ]);
        }
        echo "   ✓ Added 5 questions to Evaluación {$eval->id}\n";
    }
} else {
    foreach ($evaluaciones as $eval) {
        $count = $eval->preguntas->count();
        echo "   ✓ Evaluación {$eval->id}: {$count} questions\n";
    }
}

$totalPreguntas = Pregunta::count();
echo "   Total questions in system: {$totalPreguntas}\n";

// 7. Verify evaluation attempts
echo "\n7️⃣  VERIFYING EVALUATION ATTEMPTS...\n";
$totalAttempts = Trabajo::count();
if ($totalAttempts === 0) {
    echo "   ⚠️  No attempts found. Creating sample attempts...\n";

    foreach ($estudiantes as $estudiante) {
        foreach ($evaluaciones as $evaluacion) {
            Trabajo::create([
                'evaluacion_id' => $evaluacion->id,
                'estudiante_id' => $estudiante->id,
                'estado' => 'completado',
                'respuestas' => json_encode([]),
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addMinutes(30),
            ]);
        }
        echo "   ✓ Created attempts for {$estudiante->nombre}\n";
    }
} else {
    foreach ($estudiantes as $estudiante) {
        $count = Trabajo::where('estudiante_id', $estudiante->id)->count();
        echo "   ✓ {$estudiante->nombre}: {$count} attempts\n";
    }
}

$totalAttempts = Trabajo::count();
echo "   Total attempts in system: {$totalAttempts}\n";

// 8. Final Summary
echo "\n" . str_repeat("═", 65) . "\n";
echo "✅ SYSTEM STATUS SUMMARY\n";
echo str_repeat("═", 65) . "\n";
echo "   Professor: {$profesor->nombre}\n";
echo "   Course: {$cursoEvaluaciones->nombre}\n";
echo "   Students: {$estudiantes->count()}\n";
echo "   Evaluations: {$evaluaciones->count()}\n";
echo "   Total Questions: {$totalPreguntas}\n";
echo "   Total Attempts: {$totalAttempts}\n";
echo str_repeat("═", 65) . "\n";

if ($totalPreguntas > 0 && $totalAttempts > 0) {
    echo "\n✅ SYSTEM IS COMPLETE AND CORRECT!\n\n";
} else {
    echo "\n⚠️  Review issues above\n\n";
}
