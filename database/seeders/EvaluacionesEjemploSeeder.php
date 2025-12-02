<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\Contenido;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

/**
 * Seeder para evaluaciones de ejemplo
 * Crea evaluaciones de 3 asignaturas y asigna intentos a estudiantes existentes
 *
 * Uso: php artisan db:seed --class=EvaluacionesEjemploSeeder
 */
class EvaluacionesEjemploSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📝 Creando evaluaciones de ejemplo...');

        // Obtener profesor (creador de contenidos)
        $profesor = User::where('tipo_usuario', 'profesor')->first();
        if (!$profesor) {
            $this->command->error('❌ Se necesita al menos un profesor');
            return;
        }

        // Obtener curso (contenedor de evaluaciones)
        $curso = \App\Models\Curso::first();
        if (!$curso) {
            $this->command->error('❌ Se necesita al menos un curso');
            return;
        }

        // Obtener estudiantes existentes
        $estudiantes = User::where('tipo_usuario', 'estudiante')
            ->whereIn('usernick', ['estudiante2', 'estudiante3', 'estudiante4'])
            ->get()
            ->keyBy('usernick');

        if ($estudiantes->count() < 3) {
            $this->command->error('❌ Se necesitan los estudiantes: estudiante2, estudiante3, estudiante4');
            return;
        }

        // Crear evaluaciones por asignatura
        $evaluaciones = $this->crearEvaluaciones($profesor, $curso);

        // Crear intentos de evaluación para cada estudiante
        $this->crearIntentosEvaluacion($estudiantes, $evaluaciones);

        $this->command->info("\n✅ Evaluaciones creadas exitosamente!");
    }

    /**
     * Crear 3 evaluaciones (una por asignatura)
     */
    private function crearEvaluaciones(User $profesor, \App\Models\Curso $curso): array
    {
        $this->command->info('Creando 3 evaluaciones...');

        $evaluaciones = [
            'matematicas' => $this->crearEvaluacion(
                'Evaluación de Matemáticas',
                'Examen parcial de cálculo y álgebra',
                100,
                60,
                $profesor,
                $curso
            ),
            'lengua' => $this->crearEvaluacion(
                'Evaluación de Lengua',
                'Examen de comprensión lectora y redacción',
                80,
                50,
                $profesor,
                $curso
            ),
            'ciencias' => $this->crearEvaluacion(
                'Evaluación de Ciencias Naturales',
                'Examen de biología y química',
                100,
                60,
                $profesor,
                $curso
            ),
        ];

        return $evaluaciones;
    }

    /**
     * Crear una evaluación individual
     */
    private function crearEvaluacion(string $nombre, string $descripcion, int $puntajeTot, int $tiempoLimite, User $profesor, \App\Models\Curso $curso): Evaluacion
    {
        // Verificar si ya existe el contenido
        $contenido = Contenido::where('titulo', $nombre)->first();

        if (!$contenido) {
            // Crear contenido
            $contenido = Contenido::create([
                'titulo' => $nombre,
                'descripcion' => $descripcion,
                'tipo' => 'evaluacion',
                'estado' => 'publicado',
                'creador_id' => $profesor->id,
                'curso_id' => $curso->id,
                'fecha_creacion' => now()->toDateString(),
            ]);
        }

        // Crear o recuperar evaluación
        $evaluacion = Evaluacion::firstOrCreate(
            ['contenido_id' => $contenido->id],
            [
                'contenido_id' => $contenido->id,
                'tipo_evaluacion' => 'parcial',
                'puntuacion_total' => $puntajeTot,
                'tiempo_limite' => $tiempoLimite,
                'calificacion_automatica' => true,
                'mostrar_respuestas' => true,
                'permite_reintento' => true,
                'max_reintentos' => 3,
            ]
        );

        $this->command->info("  ✓ {$nombre}");
        return $evaluacion;
    }

    /**
     * Crear intentos de evaluación para cada estudiante
     */
    private function crearIntentosEvaluacion(\Illuminate\Database\Eloquent\Collection $estudiantes, array $evaluaciones): void
    {
        $this->command->info('Creando intentos de evaluación...');

        // Mapeo de estudiante a perfil (para coherencia)
        $perfiles = [
            'estudiante2' => [  // Unai - Fuerte en matemáticas
                'matematicas' => ['puntaje' => 85, 'aciertos' => 85, 'debilidades' => ['trigonometría', 'ecuaciones complejas']],
                'lengua' => ['puntaje' => 65, 'aciertos' => 65, 'debilidades' => ['ortografía', 'redacción avanzada']],
                'ciencias' => ['puntaje' => 75, 'aciertos' => 75, 'debilidades' => ['reacciones químicas', 'procesos biológicos']],
            ],
            'estudiante3' => [  // Gabriel - Balanceado
                'matematicas' => ['puntaje' => 72, 'aciertos' => 72, 'debilidades' => ['aplicaciones prácticas', 'problemas complejos']],
                'lengua' => ['puntaje' => 78, 'aciertos' => 78, 'debilidades' => ['análisis crítico', 'creatividad literaria']],
                'ciencias' => ['puntaje' => 80, 'aciertos' => 80, 'debilidades' => ['integración de conceptos', 'ejercicios prácticos']],
            ],
            'estudiante4' => [  // Francisco - Fuerte en Lengua
                'matematicas' => ['puntaje' => 58, 'aciertos' => 58, 'debilidades' => ['lógica matemática', 'cálculos complejos', 'pensamiento abstracto']],
                'lengua' => ['puntaje' => 88, 'aciertos' => 88, 'debilidades' => ['ensayos formales', 'análisis profundo']],
                'ciencias' => ['puntaje' => 62, 'aciertos' => 62, 'debilidades' => ['fórmulas', 'procesos químicos', 'fenómenos físicos']],
            ],
        ];

        foreach ($estudiantes as $usernick => $estudiante) {
            $perfil = $perfiles[$usernick] ?? [];

            foreach ($evaluaciones as $asignatura => $evaluacion) {
                $datosEstudiante = $perfil[$asignatura] ?? ['puntaje' => 70, 'aciertos' => 70, 'debilidades' => []];

                $this->crearIntentoEvaluacion(
                    $evaluacion,
                    $estudiante,
                    $datosEstudiante['puntaje'],
                    $datosEstudiante['aciertos'],
                    $datosEstudiante['debilidades']
                );
            }
        }
    }

    /**
     * Crear un intento individual de evaluación
     */
    private function crearIntentoEvaluacion(
        Evaluacion $evaluacion,
        User $estudiante,
        int $puntaje,
        int $aciertos,
        array $debilidades
    ): void {
        // Verificar si ya existe
        $existente = IntentosEvaluacion::where('evaluacion_id', $evaluacion->id)
            ->where('estudiante_id', $estudiante->id)
            ->first();

        if ($existente) {
            return;
        }

        // Generar respuestas simuladas (no es necesario en detalle)
        $respuestas = $this->generarRespuestasSimuladas($puntaje, $evaluacion->puntuacion_total);

        // Calcular fortalezas (complemento de debilidades)
        $fortalezas = $this->calcularFortalezas($evaluacion->contenido->titulo, $debilidades);

        // Crear intento
        IntentosEvaluacion::create([
            'evaluacion_id' => $evaluacion->id,
            'estudiante_id' => $estudiante->id,
            'estado' => 'calificado',
            'respuestas' => json_encode($respuestas),
            'fecha_inicio' => now()->subDays(rand(1, 7)),
            'fecha_entrega' => now()->subDays(rand(0, 6)),
            'tiempo_total' => rand(30, 60),
            'numero_intento' => 1,
            'puntaje_obtenido' => $puntaje,
            'porcentaje_acierto' => $aciertos,
            'dificultad_detectada' => $aciertos < 65 ? 0.8 : ($aciertos < 80 ? 0.5 : 0.2),
            'areas_debilidad' => json_encode($debilidades),
            'areas_fortaleza' => json_encode($fortalezas),
            'recomendaciones_ia' => null, // Se llenará con el servicio
            'ultimo_analisis_ml' => null,
        ]);

        $this->command->info("  ✓ {$estudiante->nombre_completo} - {$evaluacion->contenido->nombre} ({$puntaje}%)");
    }

    /**
     * Generar respuestas simuladas basadas en puntaje
     */
    private function generarRespuestasSimuladas(int $puntaje, int $total): array
    {
        $numPreguntas = 20; // Asumimos 20 preguntas
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
     * Calcular fortalezas basadas en la asignatura
     */
    private function calcularFortalezas(string $asignatura, array $debilidades): array
    {
        $fortalezasPorAsignatura = [
            'Evaluación de Matemáticas' => [
                'Operaciones básicas',
                'Resolución de ecuaciones simples',
                'Comprensión de conceptos',
            ],
            'Evaluación de Lengua' => [
                'Comprensión de textos',
                'Expresión escrita',
                'Vocabulario',
            ],
            'Evaluación de Ciencias Naturales' => [
                'Identificación de conceptos',
                'Comprensión de procesos naturales',
                'Observación científica',
            ],
        ];

        return $fortalezasPorAsignatura[$asignatura] ?? [];
    }
}
