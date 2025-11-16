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
     */
    private function seedPrediccionesRiesgo($estudiantes): void
    {
        $this->command->info('Generando predicciones_riesgo...');

        $carreras_opciones = ['Ingeniería Informática', 'Administración', 'Contabilidad', 'Enfermería', 'Psicología'];

        foreach ($estudiantes as $estudiante_id) {
            // Generar entre 1-3 predicciones por estudiante
            $num_predicciones = rand(1, 3);

            for ($i = 0; $i < $num_predicciones; $i++) {
                // Simular score de riesgo
                $risk_score = rand(20, 95) / 100;

                // Determinar nivel basado en thresholds
                if ($risk_score >= 0.70) {
                    $nivel = 'alto';
                } elseif ($risk_score >= 0.40) {
                    $nivel = 'medio';
                } else {
                    $nivel = 'bajo';
                }

                $fecha = Carbon::now()->subDays(rand(0, 30));

                DB::table('predicciones_riesgo')->insert([
                    'estudiante_id' => $estudiante_id,
                    'risk_score' => round($risk_score, 4),
                    'risk_level' => $nivel,
                    'confidence_score' => round(rand(70, 99) / 100, 4),
                    'fecha_prediccion' => $fecha,
                    'modelo_version' => 'v1.0',
                    'modelo_tipo' => 'PerformancePredictor',
                    'features_used' => json_encode([
                        'promedio_ultimas_notas',
                        'varianza_notas',
                        'asistencia_porcentaje',
                        'trabajos_entregados_tarde',
                        'horas_estudio_semanal'
                    ]),
                    'creado_por' => 1,
                    'observaciones' => $nivel === 'alto' ? 'Estudiante requiere intervención' : null,
                    'created_at' => $fecha,
                    'updated_at' => $fecha,
                ]);
            }
        }

        $this->command->info('✓ predicciones_riesgo completadas');
    }

    /**
     * Generar predicciones de carrera
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

        $this->command->info('✓ predicciones_carrera completadas');
    }

    /**
     * Generar predicciones de tendencia
     */
    private function seedPrediccionesTendencia($estudiantes): void
    {
        $this->command->info('Generando predicciones_tendencia...');

        $tendencias = ['mejorando', 'estable', 'declinando', 'fluctuando'];

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
            }
        }

        $this->command->info('✓ predicciones_tendencia completadas');
    }
}
