<?php

namespace Database\Seeders;

use App\Models\Evaluacion;
use App\Models\Pregunta;
use App\Models\Contenido;
use App\Models\Trabajo;
use App\Models\Calificacion;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Seeder;

class EvaluacionesSeeder extends Seeder
{
    public function run(): void
    {
        $profesor1 = User::where('email', 'profesor1@paucara.test')->first();
        $estudiante1 = User::where('email', 'estudiante1@paucara.test')->first();

        if (!$profesor1 || !$estudiante1) {
            $this->command->warn('profesor1 o estudiante1 no existen.');
            return;
        }

        // Obtener el primer curso del profesor
        $curso = Curso::where('profesor_id', $profesor1->id)->first();

        if (!$curso) {
            $this->command->warn('No hay cursos asignados a profesor1.');
            return;
        }

        // Definir evaluaciones con sus preguntas
        $evaluacionesData = [
            [
                'titulo' => 'Quiz 1: Ecuaciones Lineales',
                'descripcion' => 'Evaluación rápida sobre ecuaciones lineales de primer grado.',
                'tipo_evaluacion' => 'quiz',
                'puntuacion_total' => 20,
                'tiempo_limite' => 15,
                'calificacion_automatica' => true,
                'mostrar_respuestas' => true,
                'permite_reintento' => true,
                'max_reintentos' => 2,
                'preguntas' => [
                    [
                        'enunciado' => '¿Cuál es la solución de la ecuación 2x + 3 = 7?',
                        'tipo' => 'opcion_multiple',
                        'opciones' => ['x = 1', 'x = 2', 'x = 3', 'x = 4'],
                        'respuesta_correcta' => 'x = 2',
                        'puntos' => 5,
                    ],
                    [
                        'enunciado' => 'En la ecuación 5x - 10 = 0, el valor de x es 2.',
                        'tipo' => 'verdadero_falso',
                        'opciones' => ['Verdadero', 'Falso'],
                        'respuesta_correcta' => 'Verdadero',
                        'puntos' => 5,
                    ],
                    [
                        'enunciado' => '¿Cuál es el resultado de resolver 3x + 5 = 14?',
                        'tipo' => 'respuesta_corta',
                        'opciones' => null,
                        'respuesta_correcta' => 'x = 3',
                        'puntos' => 5,
                    ],
                    [
                        'enunciado' => 'Explica brevemente qué es una ecuación lineal.',
                        'tipo' => 'respuesta_larga',
                        'opciones' => null,
                        'respuesta_correcta' => 'ecuación',
                        'puntos' => 5,
                    ],
                ],
            ],
            [
                'titulo' => 'Examen Parcial: Historia de la Revolución Francesa',
                'descripcion' => 'Evaluación parcial sobre los eventos principales de la Revolución Francesa.',
                'tipo_evaluacion' => 'parcial',
                'puntuacion_total' => 50,
                'tiempo_limite' => 60,
                'calificacion_automatica' => false,
                'mostrar_respuestas' => false,
                'permite_reintento' => false,
                'max_reintentos' => 1,
                'preguntas' => [
                    [
                        'enunciado' => '¿En qué año comenzó la Revolución Francesa?',
                        'tipo' => 'opcion_multiple',
                        'opciones' => ['1787', '1788', '1789', '1790'],
                        'respuesta_correcta' => '1789',
                        'puntos' => 10,
                    ],
                    [
                        'enunciado' => 'La Bastilla fue la primera fortaleza capturada en la Revolución Francesa.',
                        'tipo' => 'verdadero_falso',
                        'opciones' => ['Verdadero', 'Falso'],
                        'respuesta_correcta' => 'Verdadero',
                        'puntos' => 10,
                    ],
                    [
                        'enunciado' => '¿Quién fue el principal líder del Reinado del Terror?',
                        'tipo' => 'opcion_multiple',
                        'opciones' => ['Jean-Paul Marat', 'Maximilien Robespierre', 'Georges Danton', 'Lafayette'],
                        'respuesta_correcta' => 'Maximilien Robespierre',
                        'puntos' => 10,
                    ],
                    [
                        'enunciado' => 'La Declaración de los Derechos del Hombre fue proclamada en 1789.',
                        'tipo' => 'verdadero_falso',
                        'opciones' => ['Verdadero', 'Falso'],
                        'respuesta_correcta' => 'Verdadero',
                        'puntos' => 10,
                    ],
                    [
                        'enunciado' => 'Describe las principales consecuencias de la Revolución Francesa en Europa.',
                        'tipo' => 'respuesta_larga',
                        'opciones' => null,
                        'respuesta_correcta' => 'consecuencias',
                        'puntos' => 10,
                    ],
                ],
            ],
            [
                'titulo' => 'Práctica: Ciclo del Carbono',
                'descripcion' => 'Evaluación práctica para verificar comprensión del ciclo del carbono.',
                'tipo_evaluacion' => 'practica',
                'puntuacion_total' => 30,
                'tiempo_limite' => 45,
                'calificacion_automatica' => true,
                'mostrar_respuestas' => true,
                'permite_reintento' => true,
                'max_reintentos' => 3,
                'preguntas' => [
                    [
                        'enunciado' => '¿Cuál es el proceso mediante el cual las plantas absorben CO2?',
                        'tipo' => 'opcion_multiple',
                        'opciones' => ['Respiración', 'Fotosíntesis', 'Descomposición', 'Combustión'],
                        'respuesta_correcta' => 'Fotosíntesis',
                        'puntos' => 6,
                    ],
                    [
                        'enunciado' => 'El dióxido de carbono es el principal gas responsable del efecto invernadero.',
                        'tipo' => 'verdadero_falso',
                        'opciones' => ['Verdadero', 'Falso'],
                        'respuesta_correcta' => 'Verdadero',
                        'puntos' => 6,
                    ],
                    [
                        'enunciado' => '¿Cuáles son los tres principales reservorios de carbono?',
                        'tipo' => 'respuesta_corta',
                        'opciones' => null,
                        'respuesta_correcta' => 'atmósfera océanos suelo',
                        'puntos' => 6,
                    ],
                    [
                        'enunciado' => 'La deforestación es una fuente importante de emisiones de carbono.',
                        'tipo' => 'verdadero_falso',
                        'opciones' => ['Verdadero', 'Falso'],
                        'respuesta_correcta' => 'Verdadero',
                        'puntos' => 6,
                    ],
                    [
                        'enunciado' => 'Propone tres soluciones para reducir el carbono en la atmósfera.',
                        'tipo' => 'respuesta_larga',
                        'opciones' => null,
                        'respuesta_correcta' => 'soluciones',
                        'puntos' => 6,
                    ],
                ],
            ],
        ];

        // Crear evaluaciones y asignar a estudiante1
        foreach ($evaluacionesData as $index => $evalData) {
            $preguntas = $evalData['preguntas'];
            unset($evalData['preguntas']);

            // Crear contenido base
            $contenido = Contenido::create([
                'titulo' => $evalData['titulo'],
                'descripcion' => $evalData['descripcion'],
                'creador_id' => $profesor1->id,
                'curso_id' => $curso->id,
                'tipo' => 'evaluacion',
                'estado' => 'publicado',
                'fecha_creacion' => now(),
                'fecha_limite' => now()->addDays(7 + $index),
            ]);

            // Crear evaluación
            $evaluacion = Evaluacion::create([
                'contenido_id' => $contenido->id,
                'tipo_evaluacion' => $evalData['tipo_evaluacion'],
                'puntuacion_total' => $evalData['puntuacion_total'],
                'tiempo_limite' => $evalData['tiempo_limite'],
                'calificacion_automatica' => $evalData['calificacion_automatica'],
                'mostrar_respuestas' => $evalData['mostrar_respuestas'],
                'permite_reintento' => $evalData['permite_reintento'],
                'max_reintentos' => $evalData['max_reintentos'],
            ]);

            $this->command->info("✓ Evaluación '{$evaluacion->contenido->titulo}' creada");

            // Crear preguntas
            foreach ($preguntas as $preguntaIndex => $preguntaData) {
                Pregunta::create([
                    'evaluacion_id' => $evaluacion->id,
                    'enunciado' => $preguntaData['enunciado'],
                    'tipo' => $preguntaData['tipo'],
                    'opciones' => $preguntaData['opciones'] ? json_encode($preguntaData['opciones']) : null,
                    'respuesta_correcta' => $preguntaData['respuesta_correcta'],
                    'puntos' => $preguntaData['puntos'],
                    'orden' => $preguntaIndex,
                ]);
            }

            $this->command->line("  └─ " . count($preguntas) . " preguntas agregadas");

            // Crear trabajo (asignación) para estudiante1
            $trabajo = Trabajo::create([
                'contenido_id' => $contenido->id,
                'estudiante_id' => $estudiante1->id,
                'estado' => 'entregado',
                'fecha_inicio' => now()->subHours(2),
                'fecha_entrega' => now()->subMinutes(30),
                'tiempo_total' => $evalData['tiempo_limite'],
                'intentos' => 1,
                'consultas_material' => 0,
            ]);

            $this->command->line("  └─ Trabajo asignado a estudiante1");

            // Crear calificación automática
            $this->crearCalificacionAutomatica($evaluacion, $trabajo, $profesor1);

            $this->command->newLine();
        }

        $this->command->info('✓ Evaluaciones creadas exitosamente.');
        $this->command->info('✓ Todas las evaluaciones han sido asignadas a estudiante1 con calificaciones.');
    }

    /**
     * Crear calificación automática para la evaluación
     */
    private function crearCalificacionAutomatica(Evaluacion $evaluacion, Trabajo $trabajo, User $profesor): void
    {
        // Simular respuestas correctas del estudiante
        $preguntas = $evaluacion->preguntas()->get();
        $puntajeTotal = 0;
        $respuestasEsperadas = [];

        foreach ($preguntas as $pregunta) {
            // 70% de probabilidad de respuesta correcta
            if (rand(0, 100) < 70) {
                $puntajeTotal += $pregunta->puntos;
                $respuestasEsperadas[$pregunta->id] = $pregunta->respuesta_correcta;
            } else {
                $respuestasEsperadas[$pregunta->id] = 'respuesta incorrecta simulada';
            }
        }

        // Guardar respuestas en el trabajo
        $trabajo->update(['respuestas' => $respuestasEsperadas]);

        // Crear calificación
        Calificacion::create([
            'trabajo_id' => $trabajo->id,
            'puntaje' => $puntajeTotal,
            'comentario' => 'Evaluación automática completada. Buen desempeño en la mayoría de las preguntas.',
            'fecha_calificacion' => now(),
            'evaluador_id' => $profesor->id,
            'criterios_evaluacion' => json_encode([
                'comprension' => 'Buena',
                'precisión' => 'Aceptable',
                'tiempo' => 'Dentro del límite',
            ]),
        ]);

        // Actualizar estado del trabajo a calificado
        $trabajo->update(['estado' => 'calificado']);
    }
}
