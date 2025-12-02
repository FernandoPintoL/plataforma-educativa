<?php

namespace Database\Seeders;

use App\Models\Pregunta;
use App\Models\Evaluacion;
use Illuminate\Database\Seeder;

/**
 * Seeder para crear preguntas en evaluaciones existentes
 *
 * Uso: php artisan db:seed --class=PreguntasEvaluacionesSeeder
 */
class PreguntasEvaluacionesSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('📝 Creando preguntas para evaluaciones...');

        // Obtener todas las evaluaciones
        $evaluaciones = Evaluacion::all();

        if ($evaluaciones->isEmpty()) {
            $this->command->error('❌ No hay evaluaciones registradas');
            return;
        }

        foreach ($evaluaciones as $evaluacion) {
            $this->crearPreguntasParaEvaluacion($evaluacion);
        }

        $this->command->info("\n✅ Preguntas creadas exitosamente!");
        $this->mostrarResumen();
    }

    /**
     * Crear preguntas para una evaluación específica
     */
    private function crearPreguntasParaEvaluacion(Evaluacion $evaluacion): void
    {
        $titulo = $evaluacion->contenido->titulo;

        // Preguntas predeterminadas por tipo de evaluación
        $preguntasPorTipo = [
            // Matemáticas
            'Matemáticas' => [
                [
                    'enunciado' => '¿Cuál es el resultado de 15 × 8?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['120', '100', '140', '130'],
                    'respuesta_correcta' => '120',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Es verdadero que 7² = 49?',
                    'tipo' => 'verdadero_falso',
                    'opciones' => null,
                    'respuesta_correcta' => 'verdadero',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'Resuelve: x + 5 = 12. ¿Cuál es el valor de x?',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => '7',
                    'puntos' => 2,
                ],
                [
                    'enunciado' => '¿Cuál es el área de un rectángulo con base 6 cm y altura 4 cm?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['20 cm²', '24 cm²', '28 cm²', '30 cm²'],
                    'respuesta_correcta' => '24 cm²',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'Calcula el perímetro de un cuadrado con lado de 5 cm',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => '20',
                    'puntos' => 1,
                ],
            ],

            // Lengua/Español
            'Lengua' => [
                [
                    'enunciado' => '¿Cuál es el sujeto en la oración: "Los niños juegan en el parque"?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Los niños', 'juegan', 'en el parque', 'parque'],
                    'respuesta_correcta' => 'Los niños',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'La palabra "correr" es un verbo.',
                    'tipo' => 'verdadero_falso',
                    'opciones' => null,
                    'respuesta_correcta' => 'verdadero',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Cuál es la raíz de la palabra "desaparecer"?',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'parecer',
                    'puntos' => 2,
                ],
                [
                    'enunciado' => 'Identifica la figura literaria: "Tengo el alma hecha de agua"',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Metáfora', 'Comparación', 'Aliteración', 'Hipérbole'],
                    'respuesta_correcta' => 'Metáfora',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'Escribe un antónimo de "silencio"',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'ruido',
                    'puntos' => 1,
                ],
            ],

            // Ciencias Naturales
            'Ciencias Naturales' => [
                [
                    'enunciado' => '¿Cuántos huesos tiene un adulto humano aproximadamente?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['186', '206', '226', '246'],
                    'respuesta_correcta' => '206',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'La fotosíntesis ocurre en las hojas de las plantas.',
                    'tipo' => 'verdadero_falso',
                    'opciones' => null,
                    'respuesta_correcta' => 'verdadero',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Cuál es el gas que respiramos?',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'oxígeno',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Cuál es el órgano responsable de bombear la sangre?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Pulmón', 'Corazón', 'Cerebro', 'Hígado'],
                    'respuesta_correcta' => 'Corazón',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'Menciona dos elementos que componen el agua',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'hidrógeno y oxígeno',
                    'puntos' => 2,
                ],
            ],

            // Análisis Crítico
            'Análisis Crítico' => [
                [
                    'enunciado' => '¿Cuál es el primer paso del pensamiento crítico?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Juzgar rápidamente', 'Recopilar información', 'Hacer conclusiones', 'Argumentar'],
                    'respuesta_correcta' => 'Recopilar información',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'El análisis crítico implica aceptar todo lo que escuchamos sin cuestionamiento.',
                    'tipo' => 'verdadero_falso',
                    'opciones' => null,
                    'respuesta_correcta' => 'falso',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Qué es una fuente confiable?',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'una fuente verificable y basada en hechos',
                    'puntos' => 2,
                ],
                [
                    'enunciado' => '¿Cuál de los siguientes es un sesgo cognitivo?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Información clara', 'Confirmación', 'Lógica pura', 'Datos precisos'],
                    'respuesta_correcta' => 'Confirmación',
                    'puntos' => 1,
                ],
            ],

            // Investigación
            'Investigación' => [
                [
                    'enunciado' => '¿Cuál es el propósito principal de una hipótesis?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Probar resultados', 'Hacer una predicción comprobable', 'Recopilar datos', 'Escribir conclusiones'],
                    'respuesta_correcta' => 'Hacer una predicción comprobable',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => 'El método científico debe tener pasos ordenados.',
                    'tipo' => 'verdadero_falso',
                    'opciones' => null,
                    'respuesta_correcta' => 'verdadero',
                    'puntos' => 1,
                ],
                [
                    'enunciado' => '¿Cuáles son los tres componentes principales de una investigación?',
                    'tipo' => 'respuesta_corta',
                    'opciones' => null,
                    'respuesta_correcta' => 'método, datos, conclusiones',
                    'puntos' => 2,
                ],
                [
                    'enunciado' => '¿Qué tipo de investigación busca entender el "cómo" y "por qué"?',
                    'tipo' => 'opcion_multiple',
                    'opciones' => ['Cuantitativa', 'Cualitativa', 'Mixta', 'Descriptiva'],
                    'respuesta_correcta' => 'Cualitativa',
                    'puntos' => 1,
                ],
            ],
        ];

        // Buscar las preguntas genéricas según el tipo de evaluación
        $preguntas = [];
        foreach ($preguntasPorTipo as $tipo => $pqs) {
            if (stripos($titulo, $tipo) !== false) {
                $preguntas = $pqs;
                break;
            }
        }

        // Si no se encuentran preguntas específicas, usar genéricas
        if (empty($preguntas)) {
            $preguntas = $this->obtenerPreguntasGenéricas();
        }

        // Crear las preguntas
        $ordenActual = 1;
        foreach ($preguntas as $datoPregunta) {
            Pregunta::create([
                'evaluacion_id' => $evaluacion->id,
                'enunciado' => $datoPregunta['enunciado'],
                'tipo' => $datoPregunta['tipo'],
                'opciones' => $datoPregunta['opciones'],
                'respuesta_correcta' => $datoPregunta['respuesta_correcta'],
                'puntos' => $datoPregunta['puntos'],
                'orden' => $ordenActual++,
            ]);
        }

        $cantidadPreguntas = $ordenActual - 1;
        $this->command->info("  ✓ {$titulo} ({$cantidadPreguntas} preguntas)");
    }

    /**
     * Obtener preguntas genéricas para evaluaciones sin tipo específico
     */
    private function obtenerPreguntasGenéricas(): array
    {
        return [
            [
                'enunciado' => '¿Cuál es la respuesta correcta para esta pregunta?',
                'tipo' => 'opcion_multiple',
                'opciones' => ['A', 'B', 'C', 'D'],
                'respuesta_correcta' => 'A',
                'puntos' => 1,
            ],
            [
                'enunciado' => 'Esta es una pregunta de verdadero o falso.',
                'tipo' => 'verdadero_falso',
                'opciones' => null,
                'respuesta_correcta' => 'verdadero',
                'puntos' => 1,
            ],
            [
                'enunciado' => 'Escribe tu respuesta en pocas palabras',
                'tipo' => 'respuesta_corta',
                'opciones' => null,
                'respuesta_correcta' => 'respuesta',
                'puntos' => 2,
            ],
        ];
    }

    /**
     * Mostrar resumen
     */
    private function mostrarResumen(): void
    {
        $totalPreguntas = Pregunta::count();
        $totalEvaluaciones = Evaluacion::count();

        $this->command->info("\n");
        $this->command->info("═══════════════════════════════════════════════════════════");
        $this->command->info("📚 RESUMEN DE PREGUNTAS CREADAS");
        $this->command->info("═══════════════════════════════════════════════════════════");
        $this->command->info("   Total de evaluaciones: {$totalEvaluaciones}");
        $this->command->info("   Total de preguntas: {$totalPreguntas}");
        $this->command->info("═══════════════════════════════════════════════════════════\n");
    }
}
