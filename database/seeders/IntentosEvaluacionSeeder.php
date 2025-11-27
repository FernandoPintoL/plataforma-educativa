<?php

namespace Database\Seeders;

use App\Models\Evaluacion;
use App\Models\IntentosEvaluacion;
use App\Models\RespuestaEvaluacion;
use App\Models\User;
use Illuminate\Database\Seeder;

class IntentosEvaluacionSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n📝 Generando intentos de evaluación para estudiantes...\n";

        // Obtener todas las evaluaciones
        $evaluaciones = Evaluacion::with('preguntas')->get();

        if ($evaluaciones->isEmpty()) {
            echo "❌ No hay evaluaciones registradas.\n";
            return;
        }

        // Obtener todos los estudiantes
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        if ($estudiantes->isEmpty()) {
            echo "❌ No hay estudiantes registrados.\n";
            return;
        }

        $intentosCreados = 0;

        // Para cada evaluación
        foreach ($evaluaciones as $evaluacion) {
            // Cada estudiante intenta 60-80% de las evaluaciones
            foreach ($estudiantes->random(max(1, ceil(count($estudiantes) * 0.7))) as $estudiante) {
                // Verificar si ya existe un intento
                $intentoExistente = IntentosEvaluacion::where('evaluacion_id', $evaluacion->id)
                    ->where('estudiante_id', $estudiante->id)
                    ->first();

                if ($intentoExistente) {
                    continue;
                }

                // Generar datos realistas del intento
                $fechaInicio = $evaluacion->contenido->fecha_creacion ?? now()->subDays(10);
                $tiempoTotal = rand(15, $evaluacion->tiempo_limite ?? 60);
                $fechaEntrega = $fechaInicio->copy()->addMinutes($tiempoTotal);

                // Estados: entregado (80%), en_progreso (10%), expirado (10%)
                $estado = rand(1, 100) <= 80 ? 'entregado' : (rand(1, 100) <= 50 ? 'en_progreso' : 'expirado');

                // Solo los entregas pueden tener fecha_entrega
                if ($estado !== 'entregado') {
                    $fechaEntrega = null;
                }

                // Crear el intento
                $intento = IntentosEvaluacion::create([
                    'evaluacion_id' => $evaluacion->id,
                    'estudiante_id' => $estudiante->id,
                    'estado' => $estado,
                    'respuestas' => [], // Se llena con las respuestas detalladas
                    'comentarios' => $estado === 'entregado' ? $this->generarComentarioEstudiante() : null,
                    'fecha_inicio' => $fechaInicio,
                    'fecha_entrega' => $fechaEntrega,
                    'fecha_limite' => $evaluacion->contenido->fecha_limite ?? $fechaInicio->addDays(7),
                    'tiempo_total' => $tiempoTotal, // Siempre tiene tiempo_total
                    'numero_intento' => 1,
                    'consultas_material' => rand(0, 5),
                    'cambios_respuesta' => rand(0, 8),
                    'puntaje_obtenido' => null,
                    'porcentaje_acierto' => null,
                    'dificultad_detectada' => rand(1, 5) / 5, // 0.2 a 1.0
                    'nivel_confianza_respuestas' => rand(40, 95) / 100, // 0.4 a 0.95
                    'tiene_anomalias' => rand(1, 100) <= 15 ? true : false, // 15% con anomalías
                    'patrones_identificados' => $this->generarPatrones(),
                    'areas_debilidad' => $this->generarAreas('debilidad'),
                    'areas_fortaleza' => $this->generarAreas('fortaleza'),
                    'recomendaciones_ia' => $this->generarRecomendaciones(),
                    'ultimo_analisis_ml' => $estado === 'entregado' ? $fechaEntrega : null,
                ]);

                $intentosCreados++;

                // Crear respuestas detalladas para cada pregunta
                if ($evaluacion->preguntas) {
                    $puntajeTotalIntento = 0;
                    $respuestasCorrectas = 0;

                    foreach ($evaluacion->preguntas as $pregunta) {
                        $esCorrecta = rand(1, 100) <= 65; // 65% de respuestas correctas

                        if ($esCorrecta) {
                            $respuestasCorrectas++;
                            $puntosObtenidos = $pregunta->puntos;
                        } else {
                            $puntosObtenidos = rand(0, max(0, intval($pregunta->puntos / 2)));
                        }

                        $puntajeTotalIntento += $puntosObtenidos;

                        RespuestaEvaluacion::create([
                            'intento_evaluacion_id' => $intento->id,
                            'pregunta_id' => $pregunta->id,
                            'respuesta_texto' => $this->generarRespuestaPregunta($pregunta),
                            'respuesta_datos' => $this->generarDatosRespuesta($pregunta),
                            'explicacion' => $this->generarExplicacion($pregunta),
                            'es_correcta' => $esCorrecta,
                            'puntos_obtenidos' => $puntosObtenidos,
                            'puntos_totales' => $pregunta->puntos,
                            'tiempo_respuesta' => rand(10, 120), // 10 a 120 segundos
                            'numero_cambios' => rand(0, 3),
                            'fecha_respuesta' => $fechaInicio->copy()->addSeconds(rand(30, $tiempoTotal * 60)),
                            'confianza_respuesta' => $esCorrecta ? rand(70, 100) / 100 : rand(30, 70) / 100,
                            'patrones' => $this->generarPatronesRespuesta(),
                            'recomendacion' => $this->generarRecomendacionRespuesta($pregunta),
                            'respuesta_anomala' => rand(1, 100) <= 10 ? true : false, // 10% anómalo
                        ]);
                    }

                    // Actualizar el intento con los puntajes finales
                    $porcentaje = $evaluacion->preguntas->sum('puntos') > 0
                        ? round(($puntajeTotalIntento / $evaluacion->preguntas->sum('puntos')) * 100, 2)
                        : 0;

                    $intento->update([
                        'puntaje_obtenido' => $puntajeTotalIntento,
                        'porcentaje_acierto' => $porcentaje,
                    ]);
                }
            }

            echo "  ✓ Intentos creados para: {$evaluacion->contenido->titulo}\n";
        }

        echo "\n✓ {$intentosCreados} intentos de evaluación creados exitosamente\n";
    }

    /**
     * Generar respuesta de pregunta según su tipo
     */
    private function generarRespuestaPregunta($pregunta): ?string
    {
        return match ($pregunta->tipo) {
            'opcion_multiple' => 'Opción seleccionada del enunciado',
            'verdadero_falso' => rand(1, 100) <= 50 ? 'Verdadero' : 'Falso',
            'respuesta_corta' => 'Respuesta corta desarrollada por el estudiante',
            'respuesta_larga' => 'Respuesta amplia y detallada que incluye análisis, argumentos y conclusiones fundamentadas en el contenido estudiado.',
            'ensayo' => 'Ensayo completo con introducción, desarrollo y conclusión sobre el tema propuesto.',
            default => null,
        };
    }

    /**
     * Generar datos de respuesta (para respuestas complejas)
     */
    private function generarDatosRespuesta($pregunta): ?array
    {
        return match ($pregunta->tipo) {
            'opcion_multiple' => [
                'opciones_seleccionadas' => [rand(0, 3)], // Índice aleatorio
            ],
            'verdadero_falso' => [
                'respuesta' => rand(1, 100) <= 50,
            ],
            default => null,
        };
    }

    /**
     * Generar explicación de respuesta
     */
    private function generarExplicacion($pregunta): ?string
    {
        return rand(1, 100) <= 40 ? 'El estudiante proporcionó una explicación clara y fundamentada de su respuesta.' : null;
    }

    /**
     * Generar patrones en las respuestas
     */
    private function generarPatrones(): array
    {
        $posiblesPatrones = [
            'respuesta_rapida',
            'respuesta_reflexiva',
            'multiples_intentos',
            'consultó_material',
            'patron_seguridad_alta',
            'patron_inseguridad',
        ];

        return array_slice($posiblesPatrones, 0, rand(1, 3));
    }

    /**
     * Generar patrones en respuesta individual
     */
    private function generarPatronesRespuesta(): array
    {
        $patrones = [];

        if (rand(1, 100) <= 30) {
            $patrones[] = 'respuesta_rapida';
        }
        if (rand(1, 100) <= 25) {
            $patrones[] = 'multiples_intentos';
        }
        if (rand(1, 100) <= 20) {
            $patrones[] = 'respuesta_reflexiva';
        }

        return $patrones;
    }

    /**
     * Generar áreas de debilidad o fortaleza
     */
    private function generarAreas(string $tipo): array
    {
        $areasDebiles = [
            'Comprensión de conceptos abstractos',
            'Análisis crítico de textos',
            'Aplicación de fórmulas matemáticas',
            'Interpretación de gráficos',
            'Síntesis de información',
        ];

        $areasFortes = [
            'Memorización de hechos',
            'Lectura comprensiva',
            'Resolución de problemas prácticos',
            'Trabajo en equipo',
            'Comunicación escrita',
        ];

        $areas = $tipo === 'debilidad' ? $areasDebiles : $areasFortes;

        return array_slice($areas, 0, rand(1, 2));
    }

    /**
     * Generar recomendaciones de IA
     */
    private function generarRecomendaciones(): array
    {
        $recomendaciones = [
            'Revisar los conceptos fundamentales antes del próximo intento',
            'Practicar con ejercicios similares para mejorar comprensión',
            'Dedicar más tiempo a analizar las preguntas antes de responder',
            'Estudiar los temas que presentaron mayor dificultad',
            'Consultar con el profesor sobre los temas con bajo desempeño',
        ];

        return array_slice($recomendaciones, 0, rand(1, 3));
    }

    /**
     * Generar recomendación específica para una respuesta
     */
    private function generarRecomendacionRespuesta($pregunta): ?string
    {
        if (rand(1, 100) <= 50) {
            return 'Revisar la teoría relacionada para futuras evaluaciones';
        }

        return null;
    }

    /**
     * Generar comentario de estudiante
     */
    private function generarComentarioEstudiante(): ?string
    {
        $comentarios = [
            'He hecho mi mejor esfuerzo en esta evaluación.',
            'Algunas preguntas fueron desafiantes pero logré responderlas.',
            'Me fue bien en las preguntas de opción múltiple.',
            'Necesité revisar el material para algunas respuestas.',
            'Las preguntas de ensayo fueron las más difíciles para mí.',
        ];

        return rand(1, 100) <= 60 ? $comentarios[array_rand($comentarios)] : null;
    }
}
