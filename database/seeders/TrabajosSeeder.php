<?php

namespace Database\Seeders;

use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Tarea;
use App\Models\Trabajo;
use App\Models\User;
use Illuminate\Database\Seeder;

class TrabajosSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        echo "\n📚 Generando trabajos entregados por estudiantes...\n";

        // Obtener todos los estudiantes
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        // Obtener tareas existentes, o crear tareas genéricas si no existen
        $tareasConContenido = Contenido::where('tipo', 'tarea')->with('tarea')->get();

        if ($estudiantes->isEmpty()) {
            echo "❌ No hay estudiantes registrados.\n";
            return;
        }

        // Si no hay tareas, crearlas de forma genérica
        if ($tareasConContenido->isEmpty()) {
            echo "⚠️ No hay tareas creadas. Creando tareas genéricas...\n";
            $tareasConContenido = $this->crearTareasGenéricas();

            if ($tareasConContenido->isEmpty()) {
                echo "❌ No fue posible crear tareas.\n";
                return;
            }
        }

        $trabajosCreados = 0;

        // Para cada estudiante, crear trabajos entregados
        foreach ($estudiantes as $index => $estudiante) {
            // Cada estudiante entrega trabajos en algunas tareas (70% de cobertura)
            foreach ($tareasConContenido->random(ceil(count($tareasConContenido) * 0.7)) as $contenido) {
                // Verificar si el trabajo ya existe
                $trabajoExistente = Trabajo::where('contenido_id', $contenido->id)
                    ->where('estudiante_id', $estudiante->id)
                    ->first();

                if ($trabajoExistente) {
                    continue;
                }

                // Generar datos realistas del trabajo
                $fechaInicio = $contenido->fecha_creacion ?? now()->subDays(30);
                $diasParaEntrega = rand(1, (int)$contenido->fecha_limite?->diffInDays($fechaInicio) ?? 7);
                $fechaEntrega = $contenido->fecha_creacion->addDays($diasParaEntrega);
                $tiempoTotal = rand(30, 240); // 30 minutos a 4 horas

                // Estados: entregado o en_progreso (90% entregado, 10% en progreso)
                $estado = rand(1, 100) <= 90 ? 'entregado' : 'en_progreso';

                // Crear el trabajo
                $trabajo = Trabajo::create([
                    'contenido_id' => $contenido->id,
                    'estudiante_id' => $estudiante->id,
                    'respuestas' => $this->generarRespuestasAleatorias(),
                    'comentarios' => $this->generarComentarioEstudiante(),
                    'estado' => $estado,
                    'fecha_entrega' => $estado === 'entregado' ? $fechaEntrega : null,
                    'fecha_inicio' => $fechaInicio,
                    'tiempo_total' => $estado === 'entregado' ? $tiempoTotal : null,
                    'intentos' => rand(1, 4),
                    'consultas_material' => rand(0, 15),
                ]);

                $trabajosCreados++;
            }

            if (($index + 1) % 20 === 0) {
                echo "  ✓ Procesados " . ($index + 1) . " estudiantes\n";
            }
        }

        echo "✓ {$trabajosCreados} trabajos entregados creados exitosamente\n";
    }

    /**
     * Generar respuestas aleatorias para el trabajo
     */
    private function generarRespuestasAleatorias(): array
    {
        return [
            'respuesta_1' => 'Respuesta desarrollada ' . rand(1, 100),
            'respuesta_2' => 'Análisis completado',
            'respuesta_3' => 'Conclusión documentada',
        ];
    }

    /**
     * Generar comentario del estudiante
     */
    private function generarComentarioEstudiante(): string
    {
        $comentarios = [
            'Trabajo realizado con esfuerzo.',
            'Se utilizaron recursos disponibles.',
            'Enfoque basado en investigación.',
            'Aplicación práctica de conceptos.',
            'Integración de múltiples fuentes.',
            'Análisis profundo del tema.',
            'Trabajo completado en tiempo.',
        ];

        return $comentarios[array_rand($comentarios)];
    }

    /**
     * Crear tareas genéricas para que funcione el seeder
     */
    private function crearTareasGenéricas()
    {
        $curso = Curso::first();

        if (!$curso) {
            // Crear un curso genérico si no existe
            $profesor = User::where('tipo_usuario', 'profesor')->first();
            if (!$profesor) {
                return collect();
            }

            $curso = Curso::create([
                'nombre' => 'Curso General',
                'descripcion' => 'Curso para datos de entrenamiento ML',
                'profesor_id' => $profesor->id,
                'codigo' => 'GENERAL-001',
                'estado' => 'activo',
                'fecha_inicio' => now(),
                'fecha_fin' => now()->addMonths(4),
                'capacidad_maxima' => 100,
            ]);
        }

        $tareasData = [
            [
                'titulo' => 'Tarea de Programación 1',
                'descripcion' => 'Ejercicio básico de programación',
                'instrucciones' => 'Resuelve los ejercicios propuestos',
                'puntuacion' => 100,
                'dias_limite' => 7,
            ],
            [
                'titulo' => 'Análisis de Caso 1',
                'descripcion' => 'Análisis de caso de estudio',
                'instrucciones' => 'Presenta un análisis completo del caso',
                'puntuacion' => 100,
                'dias_limite' => 10,
            ],
            [
                'titulo' => 'Investigación 1',
                'descripcion' => 'Investigación sobre tema específico',
                'instrucciones' => 'Realiza una investigación y presenta resultados',
                'puntuacion' => 100,
                'dias_limite' => 14,
            ],
        ];

        $tareas = collect();

        foreach ($tareasData as $tarea) {
            $contenido = Contenido::create([
                'titulo' => $tarea['titulo'],
                'descripcion' => $tarea['descripcion'],
                'creador_id' => $curso->profesor_id,
                'curso_id' => $curso->id,
                'tipo' => 'tarea',
                'estado' => 'publicado',
                'fecha_creacion' => now()->subDays(30),
                'fecha_limite' => now()->addDays($tarea['dias_limite']),
            ]);

            Tarea::create([
                'contenido_id' => $contenido->id,
                'instrucciones' => $tarea['instrucciones'],
                'puntuacion' => $tarea['puntuacion'],
                'permite_archivos' => true,
                'max_archivos' => 1,
                'tipo_archivo_permitido' => 'pdf,docx,doc,txt',
                'fecha_limite' => now()->addDays($tarea['dias_limite']),
            ]);

            $tareas->push($contenido);
        }

        return $tareas;
    }
}
