<?php

namespace Database\Factories;

use App\Models\StudentHint;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentHint>
 */
class StudentHintFactory extends Factory
{
    protected $model = StudentHint::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tiposSugerencia = [
            'hint_socratico',
            'concepto',
            'ejemplo',
            'recurso',
            'motivacion',
            'orientacion',
            'validacion',
        ];

        $temas = [
            'Introducción a Programación',
            'Estructuras de Datos',
            'Algoritmos',
            'Base de Datos',
            'Web Development',
        ];

        $estudiante = User::factory()->create();
        $estudiante->assignRole('estudiante');

        return [
            'trabajo_id' => Trabajo::factory(),
            'estudiante_id' => $estudiante->id,
            'monitoring_id' => null,
            'tipo_sugerencia' => $this->faker->randomElement($tiposSugerencia),
            'contenido_sugerencia' => $this->faker->paragraph(),
            'razonamiento' => $this->faker->sentence(),
            'tema_abordado' => $this->faker->randomElement($temas),
            'contexto_problema' => [
                'respuesta_estudiante' => ['campo' => 'valor'],
                'errores_detectados' => ['error1', 'error2'],
            ],
            'analisis_respuesta' => [
                'fortalezas' => ['Estructura clara'],
                'debilidades' => ['Falta validación'],
            ],
            'relevancia_estimada' => $this->faker->randomFloat(2, 0.3, 1),
            'dificultad_estimada' => $this->faker->randomFloat(2, 0, 1),
            'especificidad' => $this->faker->randomFloat(2, 0.3, 1),
            'estado' => 'generada',
            'fecha_presentacion' => null,
            'fecha_uso' => null,
            'ayudo_estudiante' => null,
            'feedback_efectividad' => null,
            'preguntas_guia' => [
                ['pregunta' => '¿Qué es lo que se pide?', 'nivel' => 1],
                ['pregunta' => '¿Cuál es el primer paso?', 'nivel' => 2],
            ],
            'nivel_socracion' => $this->faker->numberBetween(1, 5),
            'profesor_id' => null,
            'revisado_profesor' => false,
            'comentario_profesor' => null,
        ];
    }

    /**
     * Sugerencia mostrada al estudiante
     */
    public function mostrada(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'mostrada',
                'fecha_presentacion' => now(),
            ];
        });
    }

    /**
     * Sugerencia utilizada y efectiva
     */
    public function utilizada(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'utilizada',
                'fecha_uso' => now(),
                'ayudo_estudiante' => true,
                'feedback_efectividad' => [
                    'claridad' => 4,
                    'utilidad' => 5,
                    'relevancia' => 4,
                ],
            ];
        });
    }

    /**
     * Sugerencia Socrática
     */
    public function socratica(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'tipo_sugerencia' => 'hint_socratico',
                'nivel_socracion' => $this->faker->numberBetween(2, 5),
                'preguntas_guia' => [
                    ['pregunta' => '¿Qué datos tienes disponibles?', 'nivel' => 1],
                    ['pregunta' => '¿Qué necesitas encontrar?', 'nivel' => 1],
                    ['pregunta' => '¿Qué operaciones podrías usar?', 'nivel' => 2],
                    ['pregunta' => '¿En qué orden las ejecutarías?', 'nivel' => 3],
                    ['pregunta' => '¿Por qué ese orden es importante?', 'nivel' => 4],
                ],
            ];
        });
    }

    /**
     * Sugerencia revisada por profesor
     */
    public function revisada(): static
    {
        return $this->state(function (array $attributes) {
            $profesor = User::factory()->create();
            $profesor->assignRole('profesor');
            return [
                'profesor_id' => $profesor->id,
                'revisado_profesor' => true,
                'comentario_profesor' => 'Muy buena sugerencia, ayuda al estudiante a reflexionar',
            ];
        });
    }
}
