<?php

namespace Database\Seeders;

use App\Models\Calificacion;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Seeder;

class CalificacionesSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n🎯 Generando calificaciones coherentes con desempeño académico...\n";

        // Obtener todos los trabajos entregados
        $trabajosEntregados = Trabajo::where('estado', 'entregado')->get();

        if ($trabajosEntregados->isEmpty()) {
            echo "❌ No hay trabajos entregados. Ejecuta TrabajosSeeder primero.\n";
            return;
        }

        // Obtener profesores para ser evaluadores
        $profesores = User::where('tipo_usuario', 'profesor')->get();

        if ($profesores->isEmpty()) {
            echo "❌ No hay profesores registrados.\n";
            return;
        }

        $calificacionesCreadas = 0;

        // Para cada trabajo entregado, crear una calificación
        foreach ($trabajosEntregados as $index => $trabajo) {
            // Verificar si ya existe calificación
            if ($trabajo->calificacion) {
                continue;
            }

            // Obtener datos del estudiante para correlacionar calificación
            $estudiante = $trabajo->estudiante;
            $desempenoBase = $estudiante->desempeño_promedio ?? 50;
            $asistencia = $estudiante->asistencia_porcentaje ?? 80;
            $participacion = $estudiante->participacion_porcentaje ?? 60;

            // Calcular puntaje basado en desempeño del estudiante (más realista para ML)
            $puntaje = $this->calcularPuntajeCoherente(
                $desempenoBase,
                $asistencia,
                $participacion,
                $trabajo->tiempo_total ?? 120,
                $trabajo->intentos ?? 1,
                $trabajo->consultas_material ?? 5
            );

            // Generar criterios de evaluación
            $criterios = $this->generarCriterios($puntaje);

            // Profesor evaluador aleatorio
            $profesor = $profesores->random();

            // Crear la calificación
            Calificacion::create([
                'trabajo_id' => $trabajo->id,
                'puntaje' => $puntaje,
                'comentario' => $this->generarComentarioCalificacion($puntaje, $desempenoBase),
                'fecha_calificacion' => $trabajo->fecha_entrega->addDays(rand(1, 5)),
                'evaluador_id' => $profesor->id,
                'criterios_evaluacion' => $criterios,
            ]);

            // Actualizar estado del trabajo a calificado
            $trabajo->update(['estado' => 'calificado']);

            $calificacionesCreadas++;

            if (($index + 1) % 25 === 0) {
                echo "  ✓ Procesadas " . ($index + 1) . " calificaciones\n";
            }
        }

        echo "✓ {$calificacionesCreadas} calificaciones creadas exitosamente\n";
    }

    /**
     * Calcular puntaje coherente basado en el desempeño del estudiante
     * Usa características múltiples para simular evaluación realista
     */
    private function calcularPuntajeCoherente(
        float $desempenoBase,
        float $asistencia,
        float $participacion,
        int $tiempoTotal,
        int $intentos,
        int $consultasMaterial
    ): float {
        // Base: 40% desempeño histórico
        $componenteDesempeño = $desempenoBase * 0.40;

        // Asistencia: 20%
        $componenteAsistencia = ($asistencia / 100) * 20;

        // Participación: 15%
        $componenteParticipacion = ($participacion / 100) * 15;

        // Esfuerzo (tiempo invertido): 10%
        // Normalizar tiempo: 0-60 min = bajo, 60-180 min = medio, 180+ = alto
        $esfuerzo = min(10, ($tiempoTotal / 180) * 10);
        $componenteEsfuerzo = $esfuerzo;

        // Intentos (múltiples intentos = más aprendizaje): 10%
        // Más intentos = mejor (hasta cierto límite)
        $componenteIntentos = min(10, ($intentos / 4) * 10);

        // Consultas a material (indica búsqueda de ayuda): 5%
        // Algunas consultas = positivo, demasiadas = negativo
        $componenteConsultas = max(0, 5 - (abs($consultasMaterial - 8) * 0.2));

        // Sumar componentes
        $puntajeFinal = $componenteDesempeño + $componenteAsistencia +
                       $componenteParticipacion + $componenteEsfuerzo +
                       $componenteIntentos + $componenteConsultas;

        // Agregar variación aleatoria pequeña (±5 puntos)
        $puntajeFinal += rand(-5, 5);

        // Limitar entre 0 y 100
        return max(0, min(100, round($puntajeFinal, 2)));
    }

    /**
     * Generar criterios de evaluación
     */
    private function generarCriterios(float $puntaje): array
    {
        $criterios = [
            'Contenido y precisión' => 0,
            'Estructura y presentación' => 0,
            'Completitud de respuestas' => 0,
            'Análisis crítico' => 0,
            'Ortografía y formato' => 0,
        ];

        // Distribuir puntaje entre criterios de manera realista
        if ($puntaje >= 90) {
            $criterios['Contenido y precisión'] = 18;
            $criterios['Estructura y presentación'] = 18;
            $criterios['Completitud de respuestas'] = 20;
            $criterios['Análisis crítico'] = 22;
            $criterios['Ortografía y formato'] = 22;
        } elseif ($puntaje >= 80) {
            $criterios['Contenido y precisión'] = 16;
            $criterios['Estructura y presentación'] = 16;
            $criterios['Completitud de respuestas'] = 17;
            $criterios['Análisis crítico'] = 25;
            $criterios['Ortografía y formato'] = 26;
        } elseif ($puntaje >= 70) {
            $criterios['Contenido y precisión'] = 14;
            $criterios['Estructura y presentación'] = 14;
            $criterios['Completitud de respuestas'] = 17;
            $criterios['Análisis crítico'] = 27;
            $criterios['Ortografía y formato'] = 28;
        } elseif ($puntaje >= 60) {
            $criterios['Contenido y precisión'] = 12;
            $criterios['Estructura y presentación'] = 12;
            $criterios['Completitud de respuestas'] = 14;
            $criterios['Análisis crítico'] = 30;
            $criterios['Ortografía y formato'] = 32;
        } else {
            $criterios['Contenido y precisión'] = 10;
            $criterios['Estructura y presentación'] = 10;
            $criterios['Completitud de respuestas'] = 12;
            $criterios['Análisis crítico'] = 33;
            $criterios['Ortografía y formato'] = 35;
        }

        return $criterios;
    }

    /**
     * Generar comentario de calificación basado en el puntaje
     */
    private function generarComentarioCalificacion(float $puntaje, float $desempenoBase): string
    {
        $comentarios = [];

        if ($puntaje >= 90) {
            $comentarios[] = 'Excelente trabajo, demuestra profundo entendimiento del tema.';
            $comentarios[] = 'Análisis excepcional y presentación clara.';
            $comentarios[] = 'Trabajo sobresaliente con gran detalle.';
        } elseif ($puntaje >= 80) {
            $comentarios[] = 'Muy buen trabajo, contiene todos los elementos requeridos.';
            $comentarios[] = 'Análisis sólido y bien estructurado.';
            $comentarios[] = 'Buena presentación con análisis consistente.';
        } elseif ($puntaje >= 70) {
            $comentarios[] = 'Trabajo aceptable, cumple con los requisitos principales.';
            $comentarios[] = 'Necesita más profundidad en el análisis.';
            $comentarios[] = 'Estructura adecuada, pero requiere mejora en contenido.';
        } elseif ($puntaje >= 60) {
            $comentarios[] = 'Trabajo incompleto, requiere revisión y mejora.';
            $comentarios[] = 'Necesita desarrollar mejor los temas planteados.';
            $comentarios[] = 'Faltan elementos importantes, revisa las instrucciones.';
        } else {
            $comentarios[] = 'Trabajo insuficiente. Requiere rehacer con atención a instrucciones.';
            $comentarios[] = 'No cumple con los requisitos mínimos solicitados.';
            $comentarios[] = 'Necesita mayor esfuerzo y dedicación en próximas entregas.';
        }

        $comentario = $comentarios[array_rand($comentarios)];

        // Agregar feedback personalizado basado en desempeño
        if ($puntaje > $desempenoBase + 5) {
            $comentario .= ' Mejora notable respecto a trabajos anteriores.';
        } elseif ($puntaje < $desempenoBase - 10) {
            $comentario .= ' Considera las retroalimentaciones previas para mejorar.';
        }

        return $comentario;
    }
}
