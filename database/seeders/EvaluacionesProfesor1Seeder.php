<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\Contenido;
use App\Models\Curso;
use Illuminate\Database\Seeder;

/**
 * Seeder para evaluaciones de profesor1
 * Crea evaluaciones creadas por profesor1 para estudiantes 1, 2, 3 y 4
 *
 * Uso: php artisan db:seed --class=EvaluacionesProfesor1Seeder
 */
class EvaluacionesProfesor1Seeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📝 Creando evaluaciones de profesor1...');

        // Obtener profesor1
        $profesor1 = User::where('usernick', 'profesor1')->first();
        if (!$profesor1) {
            $this->command->error('❌ No se encontró profesor1');
            return;
        }

        // Obtener estudiantes
        $estudiantes = User::whereIn('usernick', ['estudiante1', 'estudiante2', 'estudiante3', 'estudiante4'])
            ->get()
            ->keyBy('usernick');

        if ($estudiantes->count() < 4) {
            $this->command->error('❌ No se encontraron todos los estudiantes');
            return;
        }

        // Obtener primer curso (donde estarán los estudiantes)
        $curso = Curso::first();
        if (!$curso) {
            $this->command->error('❌ No hay cursos disponibles');
            return;
        }

        // Crear evaluaciones de profesor1
        $evaluaciones = $this->crearEvaluacionesProfesor1($profesor1, $curso);

        // Crear intentos para cada estudiante
        $this->crearIntentosParaEstudiantes($estudiantes, $evaluaciones);

        $this->command->info("\n✅ Evaluaciones de profesor1 creadas exitosamente!");
        $this->mostrarResumen($profesor1, $estudiantes);
    }

    /**
     * Crear evaluaciones específicas de profesor1
     */
    private function crearEvaluacionesProfesor1(User $profesor1, Curso $curso): array
    {
        $this->command->info('Creando 3 evaluaciones para profesor1...');

        $evaluaciones = [];
        $asignaturas = [
            'Evaluación Profesor1 - Matemáticas',
            'Evaluación Profesor1 - Análisis Crítico',
            'Evaluación Profesor1 - Investigación',
        ];

        $descripciones = [
            'Prueba de habilidades matemáticas avanzadas',
            'Evaluación de pensamiento crítico y análisis',
            'Evaluación de investigación y síntesis',
        ];

        foreach ($asignaturas as $idx => $titulo) {
            $descripcion = $descripciones[$idx] ?? 'Evaluación del profesor1';

            // Verificar si ya existe
            $contenido = Contenido::where('titulo', $titulo)->first();

            if (!$contenido) {
                $contenido = Contenido::create([
                    'titulo' => $titulo,
                    'descripcion' => $descripcion,
                    'tipo' => 'evaluacion',
                    'estado' => 'publicado',
                    'creador_id' => $profesor1->id,
                    'curso_id' => $curso->id,
                    'fecha_creacion' => now()->toDateString(),
                ]);
            }

            $evaluacion = Evaluacion::firstOrCreate(
                ['contenido_id' => $contenido->id],
                [
                    'tipo_evaluacion' => 'parcial',
                    'puntuacion_total' => 100,
                    'tiempo_limite' => 60,
                    'calificacion_automatica' => true,
                    'mostrar_respuestas' => true,
                    'permite_reintento' => true,
                    'max_reintentos' => 3,
                ]
            );

            $evaluaciones[$titulo] = $evaluacion;
            $this->command->info("  ✓ {$titulo}");
        }

        return $evaluaciones;
    }

    /**
     * Crear intentos para cada estudiante en cada evaluación de profesor1
     */
    private function crearIntentosParaEstudiantes($estudiantes, array $evaluaciones): void
    {
        $this->command->info('Creando intentos de evaluación para estudiantes...');

        // Perfiles únicos para cada estudiante
        $perfilesEstudiantes = [
            'estudiante1' => [
                'Evaluación Profesor1 - Matemáticas' => ['puntaje' => 88, 'aciertos' => 88, 'debilidades' => ['geometría 3D'], 'fortalezas' => ['álgebra', 'cálculo']],
                'Evaluación Profesor1 - Análisis Crítico' => ['puntaje' => 82, 'aciertos' => 82, 'debilidades' => ['argumentación'], 'fortalezas' => ['interpretación', 'evaluación']],
                'Evaluación Profesor1 - Investigación' => ['puntaje' => 90, 'aciertos' => 90, 'debilidades' => [], 'fortalezas' => ['búsqueda de información', 'síntesis']],
            ],
            'estudiante2' => [
                'Evaluación Profesor1 - Matemáticas' => ['puntaje' => 95, 'aciertos' => 95, 'debilidades' => [], 'fortalezas' => ['operaciones', 'ecuaciones', 'funciones']],
                'Evaluación Profesor1 - Análisis Crítico' => ['puntaje' => 70, 'aciertos' => 70, 'debilidades' => ['redacción', 'estructura'], 'fortalezas' => ['comprensión']],
                'Evaluación Profesor1 - Investigación' => ['puntaje' => 78, 'aciertos' => 78, 'debilidades' => ['presentación', 'citas'], 'fortalezas' => ['investigación de campo']],
            ],
            'estudiante3' => [
                'Evaluación Profesor1 - Matemáticas' => ['puntaje' => 80, 'aciertos' => 80, 'debilidades' => ['cálculo avanzado'], 'fortalezas' => ['aritmética', 'probabilidad']],
                'Evaluación Profesor1 - Análisis Crítico' => ['puntaje' => 85, 'aciertos' => 85, 'debilidades' => ['síntesis'], 'fortalezas' => ['análisis', 'evaluación crítica']],
                'Evaluación Profesor1 - Investigación' => ['puntaje' => 83, 'aciertos' => 83, 'debilidades' => ['organización'], 'fortalezas' => ['análisis de datos', 'conclusiones']],
            ],
            'estudiante4' => [
                'Evaluación Profesor1 - Matemáticas' => ['puntaje' => 62, 'aciertos' => 62, 'debilidades' => ['ecuaciones', 'funciones'], 'fortalezas' => ['operaciones básicas']],
                'Evaluación Profesor1 - Análisis Crítico' => ['puntaje' => 88, 'aciertos' => 88, 'debilidades' => ['lógica formal'], 'fortalezas' => ['redacción', 'argumentación', 'estructura']],
                'Evaluación Profesor1 - Investigación' => ['puntaje' => 75, 'aciertos' => 75, 'debilidades' => ['metodología', 'citas'], 'fortalezas' => ['creatividad en temas']],
            ],
        ];

        foreach ($estudiantes as $usernick => $estudiante) {
            $perfil = $perfilesEstudiantes[$usernick] ?? [];

            foreach ($evaluaciones as $asignatura => $evaluacion) {
                $datos = $perfil[$asignatura] ?? ['puntaje' => 70, 'aciertos' => 70, 'debilidades' => [], 'fortalezas' => []];

                $this->crearIntentoEvaluacion(
                    $evaluacion,
                    $estudiante,
                    $datos['puntaje'],
                    $datos['aciertos'],
                    $datos['debilidades'],
                    $datos['fortalezas']
                );
            }
        }
    }

    /**
     * Crear un intento individual
     */
    private function crearIntentoEvaluacion(
        Evaluacion $evaluacion,
        User $estudiante,
        int $puntaje,
        int $aciertos,
        array $debilidades,
        array $fortalezas
    ): void {
        // Verificar si ya existe
        $existente = IntentosEvaluacion::where('evaluacion_id', $evaluacion->id)
            ->where('estudiante_id', $estudiante->id)
            ->first();

        if ($existente) {
            return;
        }

        // Generar respuestas simuladas
        $respuestas = $this->generarRespuestasSimuladas($puntaje, $evaluacion->puntuacion_total);

        // Crear intento
        IntentosEvaluacion::create([
            'evaluacion_id' => $evaluacion->id,
            'estudiante_id' => $estudiante->id,
            'estado' => 'calificado',
            'respuestas' => json_encode($respuestas),
            'fecha_inicio' => now()->subDays(rand(1, 15)),
            'fecha_entrega' => now()->subDays(rand(0, 14)),
            'tiempo_total' => rand(40, 80),
            'numero_intento' => 1,
            'puntaje_obtenido' => $puntaje,
            'porcentaje_acierto' => $aciertos,
            'dificultad_detectada' => $aciertos < 65 ? 0.8 : ($aciertos < 80 ? 0.5 : 0.2),
            'areas_debilidad' => json_encode($debilidades),
            'areas_fortaleza' => json_encode($fortalezas),
            'recomendaciones_ia' => null,
            'ultimo_analisis_ml' => null,
        ]);

        $this->command->info("  ✓ {$estudiante->usernick} - {$evaluacion->contenido->titulo} ({$puntaje}%)");
    }

    /**
     * Generar respuestas simuladas
     */
    private function generarRespuestasSimuladas(int $puntaje, int $total): array
    {
        $numPreguntas = 20;
        $respuestasCorrectas = (int)($numPreguntas * $puntaje / 100);

        $respuestas = [];
        for ($i = 1; $i <= $numPreguntas; $i++) {
            $respuestas["pregunta_{$i}"] = [
                'respuesta_dada' => ['A', 'B', 'C', 'D'][rand(0, 3)],
                'respuesta_correcta' => ['A', 'B', 'C', 'D'][rand(0, 3)],
                'correcta' => $i <= $respuestasCorrectas ? true : (rand(0, 1) ? true : false),
                'puntos' => ($i <= $respuestasCorrectas) ? ($total / $numPreguntas) : 0,
            ];
        }

        return $respuestas;
    }

    /**
     * Mostrar resumen
     */
    private function mostrarResumen(User $profesor1, $estudiantes): void
    {
        $this->command->info("\n");
        $this->command->info("═══════════════════════════════════════════════════════════");
        $this->command->info("📊 EVALUACIONES CREADAS POR PROFESOR1");
        $this->command->info("═══════════════════════════════════════════════════════════");

        $this->command->info("\n👨‍🏫 PROFESOR:");
        $this->command->info("   Email: {$profesor1->email}");
        $this->command->info("   Usuario: {$profesor1->usernick}");
        $this->command->info("   Contraseña: password123");

        $this->command->info("\n👥 ESTUDIANTES CON EVALUACIONES:");
        foreach ($estudiantes as $est) {
            $this->command->info("   - {$est->usernick} ({$est->nombre_completo})");
        }

        $this->command->info("\n📋 EVALUACIONES CREADAS:");
        $this->command->info("   1. Evaluación Profesor1 - Matemáticas");
        $this->command->info("   2. Evaluación Profesor1 - Análisis Crítico");
        $this->command->info("   3. Evaluación Profesor1 - Investigación");

        $this->command->info("\n📊 TOTAL DE INTENTOS:");
        $this->command->info("   3 evaluaciones × 4 estudiantes = 12 intentos");

        $this->command->info("\n═══════════════════════════════════════════════════════════\n");
        $this->command->info("✅ Evaluaciones listas!");
        $this->command->info("   Profesor1 puede ver y calificar desde su dashboard");
        $this->command->info("═══════════════════════════════════════════════════════════\n");
    }
}
