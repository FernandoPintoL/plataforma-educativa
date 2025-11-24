<?php

namespace Database\Factories;

use App\Models\StudentAlert;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\StudentAlert>
 */
class StudentAlertFactory extends Factory
{
    protected $model = StudentAlert::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $tiposAlerta = [
            'riesgo_abandono',
            'bajo_progreso',
            'dificultad_conceptual',
            'falta_comprension',
            'desempeño_inconsistente',
            'tiempo_excesivo',
            'inactividad',
            'patrones_error',
        ];

        $severidades = ['baja', 'media', 'alta', 'critica'];

        $estudiante = User::factory()->create();
        $estudiante->assignRole('estudiante');

        return [
            'trabajo_id' => Trabajo::factory(),
            'estudiante_id' => $estudiante->id,
            'monitoring_id' => null,
            'tipo_alerta' => $this->faker->randomElement($tiposAlerta),
            'severidad' => $this->faker->randomElement($severidades),
            'confianza' => $this->faker->randomFloat(2, 0.3, 0.95),
            'mensaje' => $this->faker->sentence(),
            'recomendacion' => $this->faker->sentence(),
            'detalles_alerta' => [
                'evento_triggers' => 'test_evento',
                'timestamp_generacion' => now()->toIso8601String(),
            ],
            'metricas_activacion' => [
                'progreso' => $this->faker->numberBetween(0, 100),
                'tiempo_acumulado' => $this->faker->numberBetween(0, 3600),
                'errores' => $this->faker->numberBetween(0, 5),
                'correcciones' => $this->faker->numberBetween(0, 10),
                'score_riesgo' => $this->faker->randomFloat(2, 0, 1),
            ],
            'estado' => 'generada',
            'fecha_generacion' => now(),
            'fecha_notificacion' => null,
            'fecha_intervencion' => null,
            'fecha_resolucion' => null,
            'profesor_id' => null,
            'accion_profesor' => null,
            'fecha_revision_profesor' => null,
            'impacto_en_desempeño' => null,
            'estudiante_mejoro' => null,
        ];
    }

    /**
     * Estado: notificada
     */
    public function notificada(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'notificada',
                'fecha_notificacion' => now(),
            ];
        });
    }

    /**
     * Estado: intervenida
     */
    public function intervenida(): static
    {
        return $this->state(function (array $attributes) {
            $profesor = User::factory()->create();
            $profesor->assignRole('profesor');
            return [
                'estado' => 'intervenida',
                'fecha_intervencion' => now(),
                'profesor_id' => $profesor->id,
                'accion_profesor' => 'Se proporcionó asesoramiento',
                'fecha_revision_profesor' => now(),
            ];
        });
    }

    /**
     * Estado: resuelta
     */
    public function resuelta(): static
    {
        return $this->state(function (array $attributes) {
            return [
                'estado' => 'resuelta',
                'fecha_resolucion' => now(),
                'estudiante_mejoro' => true,
                'impacto_en_desempeño' => 0.25,
            ];
        });
    }
}
