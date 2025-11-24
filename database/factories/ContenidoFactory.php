<?php

namespace Database\Factories;

use App\Models\Contenido;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContenidoFactory extends Factory
{
    protected $model = Contenido::class;

    public function definition(): array
    {
        return [
            'curso_id' => Curso::factory(),
            'titulo' => $this->faker->sentence(3),
            'descripcion' => $this->faker->paragraph(),
            'tipo' => $this->faker->randomElement(['leccion', 'tarea', 'quiz']),
            'estado' => 'activo',
            'creador_id' => User::factory()->create(['tipo_usuario' => 'profesor'])->id,
            'fecha_creacion' => $this->faker->dateTimeBetween('-60 days', 'now'),
            'fecha_limite' => $this->faker->dateTimeBetween('now', '+30 days'),
        ];
    }
}
