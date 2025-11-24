<?php

namespace Database\Factories;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CursoFactory extends Factory
{
    protected $model = Curso::class;

    public function definition(): array
    {
        return [
            'nombre' => $this->faker->sentence(2),
            'descripcion' => $this->faker->paragraph(),
            'profesor_id' => User::factory()->create(['tipo_usuario' => 'profesor'])->id,
            'estado' => 'activo',
            'codigo' => $this->faker->unique()->regexify('[A-Z]{3}[0-9]{3}'),
        ];
    }
}
