<?php

namespace Database\Factories;

use App\Models\Calificacion;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class CalificacionFactory extends Factory
{
    protected $model = Calificacion::class;

    public function definition(): array
    {
        return [
            'trabajo_id' => Trabajo::factory(),
            'puntaje' => $this->faker->numberBetween(60, 100),
            'comentario' => $this->faker->optional()->sentence(),
            'fecha_calificacion' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'evaluador_id' => User::factory()->create(['tipo_usuario' => 'profesor'])->id,
            'criterios_evaluacion' => [],
        ];
    }
}
