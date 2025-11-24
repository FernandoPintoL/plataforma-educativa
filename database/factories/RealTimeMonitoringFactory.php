<?php

namespace Database\Factories;

use App\Models\RealTimeMonitoring;
use App\Models\Trabajo;
use App\Models\User;
use App\Models\Contenido;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\RealTimeMonitoring>
 */
class RealTimeMonitoringFactory extends Factory
{
    protected $model = RealTimeMonitoring::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $eventos = ['inicio_trabajo', 'respuesta_escrita', 'consulta_material', 'cambio_respuesta', 'pausa', 'reanudacion', 'envio_trabajo', 'abandono'];

        $estudiante = User::factory()->create();
        $estudiante->assignRole('estudiante');

        return [
            'trabajo_id' => Trabajo::factory(),
            'estudiante_id' => $estudiante->id,
            'contenido_id' => Contenido::factory(),
            'evento' => $this->faker->randomElement($eventos),
            'timestamp' => $this->faker->dateTime(),
            'duracion_evento' => $this->faker->numberBetween(0, 3600),
            'tiempo_total_acumulado' => $this->faker->numberBetween(0, 7200),
            'descripcion_evento' => $this->faker->sentence(),
            'contexto_evento' => [],
            'metricas_cognitivas' => [],
            'progreso_estimado' => $this->faker->numberBetween(0, 100),
            'velocidad_respuesta' => $this->faker->randomFloat(2, 0, 200),
            'num_correcciones' => $this->faker->numberBetween(0, 10),
            'num_consultas' => $this->faker->numberBetween(0, 5),
            'errores_detectados' => [],
            'score_riesgo' => $this->faker->randomFloat(2, 0, 1),
            'nivel_riesgo' => $this->faker->randomElement(['bajo', 'medio', 'alto', 'critico']),
            'tipo_intervencion' => $this->faker->randomElement(['none', 'encouragement', 'hint']),
            'alerta_generada' => false,
            'sugerencia_generada' => false,
            'indicadores_riesgo' => [],
        ];
    }
}
