<?php

namespace Database\Factories;

use App\Models\CategoriaTest;
use App\Models\TestVocacional;
use Illuminate\Database\Eloquent\Factories\Factory;

class CategoriaTestFactory extends Factory
{
    protected $model = CategoriaTest::class;

    public function definition(): array
    {
        return [
            'test_vocacional_id' => TestVocacional::factory(),
            'nombre' => $this->faker->sentence(2),
            'descripcion' => $this->faker->paragraph(),
            'orden' => $this->faker->numberBetween(1, 10),
        ];
    }
}
