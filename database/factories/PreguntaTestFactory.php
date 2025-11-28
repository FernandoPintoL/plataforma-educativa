<?php

namespace Database\Factories;

use App\Models\CategoriaTest;
use App\Models\PreguntaTest;
use Illuminate\Database\Eloquent\Factories\Factory;

class PreguntaTestFactory extends Factory
{
    protected $model = PreguntaTest::class;

    public function definition(): array
    {
        $tipos = ['opcion_multiple', 'verdadero_falso', 'respuesta_abierta'];
        $tipo = $this->faker->randomElement($tipos);

        $opciones = match($tipo) {
            'opcion_multiple' => [
                $this->faker->sentence(),
                $this->faker->sentence(),
                $this->faker->sentence(),
                $this->faker->sentence(),
            ],
            'verdadero_falso' => ['Verdadero', 'Falso'],
            default => [],
        };

        return [
            'categoria_test_id' => CategoriaTest::factory(),
            'enunciado' => $this->faker->sentence(),
            'tipo' => $tipo,
            'opciones' => $opciones,
            'orden' => $this->faker->numberBetween(1, 20),
        ];
    }

    public function opcionMultiple(): self
    {
        return $this->state(fn (array $attributes) => [
            'tipo' => 'opcion_multiple',
            'opciones' => [
                $this->faker->sentence(),
                $this->faker->sentence(),
                $this->faker->sentence(),
                $this->faker->sentence(),
            ],
        ]);
    }

    public function verdaderoFalso(): self
    {
        return $this->state(fn (array $attributes) => [
            'tipo' => 'verdadero_falso',
            'opciones' => ['Verdadero', 'Falso'],
        ]);
    }

    public function respuestaAbierta(): self
    {
        return $this->state(fn (array $attributes) => [
            'tipo' => 'respuesta_abierta',
            'opciones' => [],
        ]);
    }
}
