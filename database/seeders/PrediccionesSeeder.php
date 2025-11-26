<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PrediccionesSeeder extends Seeder
{
    /**
     * Seed the application's database with prediction data.
     * Genera datos de prueba para:
     * - predicciones_riesgo
     * - predicciones_carrera
     * - predicciones_tendencia
     */
    public function run(): void
    {
        $this->command->info('Generando datos de predicciones...');

        // Obtener estudiantes
        $estudiantes = User::role('estudiante')->limit(50)->pluck('id');

        if ($estudiantes->isEmpty()) {
            $this->command->warn('No hay estudiantes disponibles para generar predicciones');
            return;
        }

        $this->command->info("Encontrados " . count($estudiantes) . " estudiantes");

        // 1. PREDICCIONES DE RIESGO
        $this->seedPrediccionesRiesgo($estudiantes);

        // 2. PREDICCIONES DE CARRERA
        $this->seedPrediccionesCarrera($estudiantes);

        // 3. PREDICCIONES DE TENDENCIA
        $this->seedPrediccionesTendencia($estudiantes);

        $this->command->info('✓ Datos de predicciones generados exitosamente');
    }

    /**
     * Generar predicciones de riesgo
     * Mapeo de columnas correcto según migración
     */
    private function seedPrediccionesRiesgo($estudiantes): void
    {
        $this->command->info('Generando predicciones_riesgo...');

        foreach ($estudiantes as $estudiante_id) {
            // Generar entre 1-3 predicciones por estudiante
            $num_predicciones = rand(1, 3);

            for ($i = 0; $i < $num_predicciones; $i++) {
                // Simular score de riesgo
                $score_riesgo = rand(20, 95) / 100;

                // Determinar nivel basado en thresholds
                if ($score_riesgo >= 0.70) {
                    $nivel_riesgo = 'alto';
                } elseif ($score_riesgo >= 0.40) {
                    $nivel_riesgo = 'medio';
                } else {
                    $nivel_riesgo = 'bajo';
                }

                $fecha = Carbon::now()->subDays(rand(0, 30));

                DB::table('predicciones_riesgo')->insert([
                    'estudiante_id' => $estudiante_id,
                    'score_riesgo' => round($score_riesgo, 4),
                    'nivel_riesgo' => $nivel_riesgo,
                    'confianza' => round(rand(70, 99) / 100, 4),
                    'fecha_prediccion' => $fecha,
                    'modelo_version' => 'v1.0',
                    'factores_influyentes' => json_encode([
                        'promedio_ultimas_notas',
                        'varianza_notas',
                        'asistencia_porcentaje',
                        'trabajos_entregados_tarde',
                        'horas_estudio_semanal'
                    ]),
                    'observaciones' => $nivel_riesgo === 'alto' ? 'Estudiante requiere intervención' : null,
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);
            }
        }

        $this->command->info('✓ predicciones_riesgo completadas (' . count($estudiantes) . ' estudiantes)');
    }

    /**
     * Generar predicciones de carrera
     * 3 recomendaciones por estudiante
     */
    private function seedPrediccionesCarrera($estudiantes): void
    {
        $this->command->info('Generando predicciones_carrera...');

        $carreras = [
            ['nombre' => 'Ingeniería Informática', 'desc' => 'Carrera en tecnología y sistemas'],
            ['nombre' => 'Administración de Empresas', 'desc' => 'Formación empresarial y gestión'],
            ['nombre' => 'Contabilidad', 'desc' => 'Especialización en finanzas'],
            ['nombre' => 'Psicología', 'desc' => 'Estudios del comportamiento humano'],
            ['nombre' => 'Enfermería', 'desc' => 'Profesión sanitaria'],
            ['nombre' => 'Derecho', 'desc' => 'Carrera jurídica'],
            ['nombre' => 'Medicina', 'desc' => 'Ciencias de la salud'],
            ['nombre' => 'Economía', 'desc' => 'Análisis económico y financiero'],
        ];

        foreach ($estudiantes as $estudiante_id) {
            // Cada estudiante tiene 3 recomendaciones de carrera
            $carreras_recomendadas = collect($carreras)->random(3)->values();

            foreach ($carreras_recomendadas as $ranking => $carrera) {
                $compatibilidad = rand(60, 99) / 100;
                $fecha = Carbon::now()->subDays(rand(0, 30));

                DB::table('predicciones_carrera')->insert([
                    'estudiante_id' => $estudiante_id,
                    'carrera_nombre' => $carrera['nombre'],
                    'compatibilidad' => round($compatibilidad, 4),
                    'ranking' => $ranking + 1,
                    'descripcion' => $carrera['desc'] . '. Compatibilidad: ' . round($compatibilidad * 100) . '%',
                    'fecha_prediccion' => $fecha,
                    'modelo_version' => 'v1.0',
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);
            }
        }

        $this->command->info('✓ predicciones_carrera completadas (' . (count($estudiantes) * 3) . ' registros)');
    }

    /**
     * Generar predicciones de tendencia
     * 1-2 tendencias por estudiante (mejorando, estable, declinando, fluctuando)
     */
    private function seedPrediccionesTendencia($estudiantes): void
    {
        $this->command->info('Generando predicciones_tendencia...');

        $tendencias = ['mejorando', 'estable', 'declinando', 'fluctuando'];
        $total_tendencias = 0;

        foreach ($estudiantes as $estudiante_id) {
            // Generar entre 1-2 tendencias por estudiante
            $num_tendencias = rand(1, 2);

            for ($i = 0; $i < $num_tendencias; $i++) {
                $tendencia = $tendencias[array_rand($tendencias)];
                $confianza = rand(60, 99) / 100;
                $fecha = Carbon::now()->subDays(rand(0, 30));

                DB::table('predicciones_tendencia')->insert([
                    'estudiante_id' => $estudiante_id,
                    'fk_curso_id' => null, // Por ahora sin filtro por curso
                    'tendencia' => $tendencia,
                    'confianza' => round($confianza, 4),
                    'fecha_prediccion' => $fecha,
                    'modelo_version' => 'v1.0',
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);

                $total_tendencias++;
            }
        }

        $this->command->info('✓ predicciones_tendencia completadas (' . $total_tendencias . ' registros)');
    }
}
