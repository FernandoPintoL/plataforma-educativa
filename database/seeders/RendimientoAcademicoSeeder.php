<?php

namespace Database\Seeders;

use App\Models\RendimientoAcademico;
use App\Models\User;
use Illuminate\Database\Seeder;

class RendimientoAcademicoSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n📊 Generando datos de rendimiento académico para ML supervisada...\n";

        // Obtener todos los estudiantes
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        if ($estudiantes->isEmpty()) {
            echo "❌ No hay estudiantes registrados.\n";
            return;
        }

        $rendimientosCreados = 0;
        $materias = [
            'Matemáticas',
            'Lenguaje',
            'Ciencias',
            'Historia',
            'Inglés',
            'Educación Física',
        ];

        foreach ($estudiantes as $index => $estudiante) {
            // Verificar si ya existe rendimiento
            $rendimientoExistente = RendimientoAcademico::where('estudiante_id', $estudiante->id)->first();

            if ($rendimientoExistente) {
                continue;
            }

            // Usar desempeño base del estudiante para generar datos coherentes
            $desempenoBase = $estudiante->desempeño_promedio ?? 50;
            $asistencia = $estudiante->asistencia_porcentaje ?? 80;
            $participacion = $estudiante->participacion_porcentaje ?? 60;

            // Generar calificaciones por materia correlacionadas con desempeño base
            $calificacionesPorMateria = $this->generarCalificacionesPorMateria(
                $desempenoBase,
                $materias
            );

            // Calcular promedio
            $promedio = array_sum($calificacionesPorMateria) / count($calificacionesPorMateria);

            // Identificar fortalezas (materias con >80)
            $fortalezas = array_filter(
                $calificacionesPorMateria,
                fn($cal) => $cal >= 80
            );

            // Identificar debilidades (materias con <70)
            $debilidades = array_filter(
                $calificacionesPorMateria,
                fn($cal) => $cal < 70
            );

            // Determinar tendencia temporal
            $tendencia = $this->determinarTendencia($desempenoBase, $asistencia);

            // Crear registro de rendimiento académico
            RendimientoAcademico::create([
                'estudiante_id' => $estudiante->id,
                'materias' => $calificacionesPorMateria,
                'promedio' => round($promedio, 2),
                'fortalezas' => $fortalezas,
                'debilidades' => $debilidades,
                'tendencia_temporal' => $tendencia,
            ]);

            $rendimientosCreados++;

            if (($index + 1) % 20 === 0) {
                echo "  ✓ Procesados " . ($index + 1) . " rendimientos académicos\n";
            }
        }

        echo "✓ {$rendimientosCreados} registros de rendimiento académico creados\n";
    }

    /**
     * Generar calificaciones por materia correlacionadas con desempeño base
     */
    private function generarCalificacionesPorMateria(float $desempenoBase, array $materias): array
    {
        $calificaciones = [];

        foreach ($materias as $materia) {
            // Aplicar variación por materia (algunos estudiantes son mejores en ciertas áreas)
            $variacion = rand(-15, 15);
            $calificacion = $desempenoBase + $variacion;

            // Limitar entre 0 y 100
            $calificacion = max(0, min(100, round($calificacion, 2)));

            $calificaciones[$materia] = $calificacion;
        }

        return $calificaciones;
    }

    /**
     * Determinar tendencia temporal basada en desempeño y asistencia
     */
    private function determinarTendencia(float $desempenoBase, float $asistencia): string
    {
        if ($desempenoBase >= 80 && $asistencia >= 90) {
            return 'mejorando';
        } elseif ($desempenoBase >= 70 && $asistencia >= 80) {
            return 'estable';
        } elseif ($desempenoBase >= 60) {
            $tendencias = ['estable', 'mejorando'];
            return $tendencias[array_rand($tendencias)];
        } elseif ($desempenoBase >= 50) {
            $tendencias = ['estable', 'empeorando'];
            return $tendencias[array_rand($tendencias)];
        } else {
            return 'empeorando';
        }
    }
}
