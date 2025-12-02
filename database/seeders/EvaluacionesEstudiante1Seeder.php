<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\Contenido;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

/**
 * Seeder para evaluaciones de estudiante1
 * Crea intentos de evaluación para estudiante1 en las 3 asignaturas
 *
 * Uso: php artisan db:seed --class=EvaluacionesEstudiante1Seeder
 */
class EvaluacionesEstudiante1Seeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📝 Creando evaluaciones para estudiante1...');

        // Obtener estudiante1
        $estudiante = User::where('usernick', 'estudiante1')->first();
        if (!$estudiante) {
            $this->command->error('❌ No se encontró estudiante1');
            return;
        }

        // Obtener profesor
        $profesor = User::where('tipo_usuario', 'profesor')->first();
        if (!$profesor) {
            $this->command->error('❌ Se necesita al menos un profesor');
            return;
        }

        // Obtener curso
        $curso = \App\Models\Curso::first();
        if (!$curso) {
            $this->command->error('❌ Se necesita al menos un curso');
            return;
        }

        // Obtener o crear evaluaciones
        $evaluaciones = $this->obtenerEvaluaciones($profesor, $curso);

        // Crear intentos de evaluación para estudiante1
        $this->crearIntentosEstudiante1($estudiante, $evaluaciones);

        $this->command->info("\n✅ Evaluaciones para estudiante1 creadas exitosamente!");
        $this->mostrarResumen($estudiante);
    }

    /**
     * Obtener las evaluaciones existentes (creadas por EvaluacionesEjemploSeeder)
     */
    private function obtenerEvaluaciones(User $profesor, $curso): array
    {
        $this->command->info('Obteniendo evaluaciones...');

        $evaluaciones = [];
        $titulos = ['Evaluación de Matemáticas', 'Evaluación de Lengua', 'Evaluación de Ciencias Naturales'];

        foreach ($titulos as $titulo) {
            $contenido = Contenido::where('titulo', $titulo)->first();

            if (!$contenido) {
                // Crear contenido si no existe
                $contenido = Contenido::create([
                    'titulo' => $titulo,
                    'descripcion' => 'Evaluación de prueba',
                    'tipo' => 'evaluacion',
                    'estado' => 'publicado',
                    'creador_id' => $profesor->id,
                    'curso_id' => $curso->id,
                    'fecha_creacion' => now()->toDateString(),
                ]);
            }

            $evaluacion = Evaluacion::where('contenido_id', $contenido->id)->first();

            if (!$evaluacion) {
                // Crear evaluación si no existe
                $evaluacion = Evaluacion::create([
                    'contenido_id' => $contenido->id,
                    'tipo_evaluacion' => 'parcial',
                    'puntuacion_total' => 100,
                    'tiempo_limite' => 60,
                    'calificacion_automatica' => true,
                    'mostrar_respuestas' => true,
                    'permite_reintento' => true,
                    'max_reintentos' => 3,
                ]);
            }

            $evaluaciones[$titulo] = $evaluacion;
            $this->command->info("  ✓ {$titulo}");
        }

        return $evaluaciones;
    }

    /**
     * Crear intentos de evaluación para estudiante1
     * Estudiante1 será: Fuerte en Ciencias (Investigador), débil en Lengua
     */
    private function crearIntentosEstudiante1(User $estudiante, array $evaluaciones): void
    {
        $this->command->info('Creando intentos de evaluación para estudiante1...');

        // Perfil de estudiante1: Fuerte en Ciencias, balanceado en Matemáticas, débil en Lengua
        $perfilEstudiante = [
            'Evaluación de Matemáticas' => [
                'puntaje' => 76,
                'aciertos' => 76,
                'debilidades' => ['ecuaciones complejas', 'geometría avanzada'],
                'fortalezas' => ['aritmética', 'operaciones básicas', 'números enteros'],
            ],
            'Evaluación de Lengua' => [
                'puntaje' => 55,
                'aciertos' => 55,
                'debilidades' => ['redacción formal', 'ortografía', 'análisis literario'],
                'fortalezas' => ['comprensión lectora', 'vocabulario básico'],
            ],
            'Evaluación de Ciencias Naturales' => [
                'puntaje' => 92,
                'aciertos' => 92,
                'debilidades' => ['aplicaciones prácticas de fórmulas'],
                'fortalezas' => ['identificación de conceptos', 'comprensión de procesos naturales', 'observación científica', 'pensamiento analítico'],
            ],
        ];

        foreach ($evaluaciones as $asignatura => $evaluacion) {
            $datos = $perfilEstudiante[$asignatura] ?? ['puntaje' => 70, 'aciertos' => 70, 'debilidades' => [], 'fortalezas' => []];

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

    /**
     * Crear un intento individual de evaluación
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
            $this->command->info("  ⊘ {$evaluacion->contenido->titulo} ya existe para {$estudiante->nombre_completo}");
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
            'fecha_inicio' => now()->subDays(rand(1, 10)),
            'fecha_entrega' => now()->subDays(rand(0, 9)),
            'tiempo_total' => rand(40, 70),
            'numero_intento' => 1,
            'puntaje_obtenido' => $puntaje,
            'porcentaje_acierto' => $aciertos,
            'dificultad_detectada' => $aciertos < 65 ? 0.8 : ($aciertos < 80 ? 0.5 : 0.2),
            'areas_debilidad' => json_encode($debilidades),
            'areas_fortaleza' => json_encode($fortalezas),
            'recomendaciones_ia' => null,
            'ultimo_analisis_ml' => null,
        ]);

        $this->command->info("  ✓ {$evaluacion->contenido->titulo} ({$puntaje}%)");
    }

    /**
     * Generar respuestas simuladas basadas en puntaje
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
     * Mostrar resumen de lo creado
     */
    private function mostrarResumen(User $estudiante): void
    {
        $this->command->info("\n");
        $this->command->info("═══════════════════════════════════════════════════════════");
        $this->command->info("📊 EVALUACIONES CREADAS PARA ESTUDIANTE1");
        $this->command->info("═══════════════════════════════════════════════════════════");

        $this->command->info("\n👤 ESTUDIANTE:");
        $this->command->info("   Email: {$estudiante->email}");
        $this->command->info("   Usuario: {$estudiante->usernick}");
        $this->command->info("   Contraseña: password123");

        $this->command->info("\n📋 PERFIL DE DESEMPEÑO:");
        $this->command->info("   Matemáticas: 76% (Balanceado)");
        $this->command->info("   Lengua: 55% (Necesita mejora)");
        $this->command->info("   Ciencias Naturales: 92% (Excelente - Fortaleza)");

        $this->command->info("\n═══════════════════════════════════════════════════════════\n");
        $this->command->info("✅ Datos listos para estudiante1!");
        $this->command->info("   Accede a: http://127.0.0.1:8000/evaluaciones");
        $this->command->info("═══════════════════════════════════════════════════════════\n");
    }
}
