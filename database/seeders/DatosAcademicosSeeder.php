<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class DatosAcademicosSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('es_ES');
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        echo "Generando datos académicos coherentes para " . count($estudiantes) . " estudiantes...\n";

        foreach ($estudiantes as $index => $estudiante) {
            // Generar perfil de desempeño - base
            $desempenoBase = rand(1, 100);

            // Datos coherentes basados en desempeño
            $this->crearDatosEstudiante(
                $estudiante,
                $desempenoBase,
                $faker
            );

            if (($index + 1) % 20 === 0) {
                echo "  ✓ Procesados " . ($index + 1) . " estudiantes\n";
            }
        }

        echo "✓ Datos académicos generados exitosamente\n";
    }

    private function crearDatosEstudiante(User $estudiante, int $desempenoBase, $faker): void
    {
        // Determinar categoría de desempeño
        if ($desempenoBase >= 80) {
            $categoria = 'excelente';
            $multiplicador = 1.0;
        } elseif ($desempenoBase >= 70) {
            $categoria = 'bueno';
            $multiplicador = 0.85;
        } elseif ($desempenoBase >= 60) {
            $categoria = 'promedio';
            $multiplicador = 0.70;
        } elseif ($desempenoBase >= 50) {
            $categoria = 'bajo';
            $multiplicador = 0.50;
        } else {
            $categoria = 'deficiente';
            $multiplicador = 0.30;
        }

        // Asistencia: excelente = 95-100%, bajo = 60-75%
        $asistencia = max(60, min(100, 95 * $multiplicador + rand(0, 20)));

        // Participación: correlacionada con desempeño
        $participacion = max(0, min(100, $desempenoBase * 0.8 + rand(-10, 10)));

        // Calificaciones en diferentes asignaturas (correlacionadas con base)
        $calificaciones = [
            'Matemáticas' => $this->generarCalificacion($desempenoBase, $faker),
            'Lenguaje' => $this->generarCalificacion($desempenoBase + rand(-5, 5), $faker),
            'Ciencias' => $this->generarCalificacion($desempenoBase + rand(-10, 10), $faker),
            'Historia' => $this->generarCalificacion($desempenoBase - 5 + rand(-5, 10), $faker),
            'Inglés' => $this->generarCalificacion($desempenoBase - 10 + rand(-5, 15), $faker),
            'Educación Física' => $this->generarCalificacion($desempenoBase + 5 + rand(-5, 10), $faker),
        ];

        // Tareas completadas - inversamente proporcional a desempeño bajo
        $tareasTotal = 30;
        $tareasCompletadas = max(10, (int)($tareasTotal * ($desempenoBase / 100)));
        $tareasPendientes = $tareasTotal - $tareasCompletadas;

        // Patrones de actividad (para anomalías ML)
        $hoyActividad = rand(0, 10);
        $ultimosLosActivo = ($categoria === 'deficiente' || $categoria === 'bajo');
        $tendenciaActividad = $ultimosLosActivo ? 'decreciente' : 'creciente';

        // Registrar datos en tabla custom (si existe)
        // Para este ejemplo, guardamos en JSON en el campo de usuario
        $estudiante->update([
            'desempeño_promedio' => round($desempenoBase, 2),
            'categoria_desempeño' => $categoria,
            'asistencia_porcentaje' => round($asistencia, 2),
            'participacion_porcentaje' => round($participacion, 2),
            'tareas_completadas' => $tareasCompletadas,
            'tareas_pendientes' => $tareasPendientes,
            'actividad_hoy' => $hoyActividad,
            'tendencia_actividad' => $tendenciaActividad,
        ]);

        // Guardar datos en formato JSON para acceso flexible
        $datosAcademicos = [
            'estudiante_id' => $estudiante->id,
            'periodo' => date('Y-m'),
            'desempeño' => [
                'promedio_general' => $desempenoBase,
                'categoria' => $categoria,
                'cambio_mes_anterior' => rand(-15, 15), // Cambio porcentual
            ],
            'asistencia' => [
                'porcentaje' => round($asistencia, 2),
                'dias_asistidos' => (int)(20 * ($asistencia / 100)),
                'dias_ausentes' => (int)(20 * ((100 - $asistencia) / 100)),
                'justificados' => (int)(20 * ((100 - $asistencia) / 100) * 0.6),
            ],
            'actividad' => [
                'participacion_clase' => round($participacion, 2),
                'registros_ultima_semana' => rand(5, 35),
                'horas_plataforma_mes' => rand(10, 100),
                'tendencia' => $tendenciaActividad,
            ],
            'evaluaciones' => [
                'calificaciones' => $calificaciones,
                'promedio_evaluaciones' => round(array_sum($calificaciones) / count($calificaciones), 2),
            ],
            'tareas' => [
                'total' => $tareasTotal,
                'completadas' => $tareasCompletadas,
                'pendientes' => $tareasPendientes,
                'porcentaje_completadas' => round(($tareasCompletadas / $tareasTotal) * 100, 2),
                'tiempo_promedio_entrega_dias' => max(0, rand(-5, 15)),
            ],
            'comportamiento' => [
                'reportes_disciplinarios' => $categoria === 'excelente' ? 0 : ($categoria === 'bueno' ? rand(0, 1) : rand(1, 3)),
                'puntos_conducta' => max(0, 100 - abs(rand(-30, 30))),
            ],
            'indicadores_alerta' => $this->generarIndicadoresAlerta($desempenoBase, $asistencia, $participacion),
        ];

        // Aquí podrías guardar en tabla dedicada si existe
        // DatoAcademico::create(['data' => json_encode($datosAcademicos)]);
    }

    private function generarCalificacion(float $base, $faker): float
    {
        // Simular variación en calificaciones
        $base = max(0, min(100, $base));
        $variacion = $faker->randomFloat(2, -5, 5);
        return round(max(0, min(100, $base + $variacion)), 2);
    }

    private function generarIndicadoresAlerta(float $desempeño, float $asistencia, float $participacion): array
    {
        $indicadores = [];

        // Bajo desempeño
        if ($desempeño < 60) {
            $indicadores[] = [
                'tipo' => 'desempeño_bajo',
                'severidad' => $desempeño < 50 ? 'crítico' : 'alto',
                'mensaje' => 'Desempeño académico por debajo de lo esperado',
            ];
        }

        // Baja asistencia
        if ($asistencia < 80) {
            $indicadores[] = [
                'tipo' => 'asistencia_baja',
                'severidad' => $asistencia < 70 ? 'crítico' : 'alto',
                'mensaje' => 'Patrones de asistencia deficientes',
            ];
        }

        // Baja participación
        if ($participacion < 50) {
            $indicadores[] = [
                'tipo' => 'participacion_baja',
                'severidad' => 'medio',
                'mensaje' => 'Falta de participación en clase',
            ];
        }

        // Riesgo de abandono (correlación de factores)
        if ($desempeño < 50 && $asistencia < 75) {
            $indicadores[] = [
                'tipo' => 'riesgo_abandono',
                'severidad' => 'crítico',
                'mensaje' => 'Alto riesgo de abandono escolar',
            ];
        }

        return $indicadores;
    }
}
