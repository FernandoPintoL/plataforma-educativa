<?php

namespace Database\Factories;

use App\Models\Trabajo;
use App\Models\User;
use App\Models\Contenido;
use Illuminate\Database\Eloquent\Factories\Factory;

class TrabajoFactory extends Factory
{
    protected $model = Trabajo::class;

    public function definition(): array
    {
        return [
            'contenido_id' => Contenido::factory(),
            'estudiante_id' => User::factory()->create(['tipo_usuario' => 'estudiante'])->id,
            'estado' => $this->faker->randomElement(['en_progreso', 'entregado', 'calificado']),
            'fecha_inicio' => $this->faker->dateTimeBetween('-30 days', '-10 days'),
            'fecha_entrega' => $this->faker->dateTimeBetween('-10 days', 'now'),
            'tiempo_total' => $this->faker->randomNumber(3),
            'intentos' => $this->faker->randomNumber(1),
            'consultas_material' => $this->faker->randomNumber(1),
            'respuestas' => [],
            'comentarios' => $this->faker->optional()->sentence(),
        ];
    }
}
