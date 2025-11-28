<?php

namespace Database\Factories;

use App\Models\TestVocacional;
use Illuminate\Database\Eloquent\Factories\Factory;

class TestVocacionalFactory extends Factory
{
    protected $model = TestVocacional::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->sentence(3),
            'descripcion' => $this->faker->paragraph(),
            'duracion_estimada' => $this->faker->numberBetween(30, 120),
            'activo' => true,
        ];
    }

    public function inactivo(): self
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}
