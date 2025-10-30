<?php

namespace Database\Seeders;

use App\Models\Contenido;
use App\Models\Curso;
use App\Models\Tarea;
use App\Models\User;
use Illuminate\Database\Seeder;

class TareasSeeder extends Seeder
{
    public function run(): void
    {
        // Obtener profesor1
        $profesor1 = User::where('email', 'profesor1@paucara.test')->first();

        if (!$profesor1) {
            $this->command->warn('profesor1 no existe. Asegúrate de ejecutar DatabaseSeeder primero.');
            return;
        }

        // Obtener los cursos de profesor1
        $cursos = Curso::where('profesor_id', $profesor1->id)->get();

        if ($cursos->isEmpty()) {
            $this->command->warn('No hay cursos asignados a profesor1. Ejecuta CursosSeeder primero.');
            return;
        }

        // Tareas de ejemplo para cada curso - Temas de Colegio
        $tareasData = [
            [
                'titulo' => 'Ecuaciones Lineales de Primer Grado',
                'descripcion' => 'Resolver ecuaciones lineales y sistemas de ecuaciones aplicados a problemas reales.',
                'instrucciones' => 'Debes resolver y presentar:
1. 5 ecuaciones lineales de primer grado (despejando x)
2. Un sistema de 2x2 usando método de sustitución
3. Un sistema de 2x2 usando método de eliminación
4. Un problema aplicado (edades, dinero, distancias)
5. Verifica todas tus soluciones sustituyendo los valores
6. Presenta el trabajo en PDF o documento Word',
                'puntuacion' => 100,
                'permite_archivos' => true,
                'max_archivos' => 1,
                'tipo_archivo_permitido' => 'pdf,docx,doc,txt',
                'dias_limite' => 7,
            ],
            [
                'titulo' => 'La Revolución Francesa - Análisis Histórico',
                'descripcion' => 'Análisis de las causas, desarrollo y consecuencias de la Revolución Francesa.',
                'instrucciones' => 'Elabora un ensayo que incluya:
1. Contexto y causas de la Revolución (2-3 párrafos)
2. Fases principales de la Revolución (2-3 párrafos)
3. Personajes importantes y su rol
4. Consecuencias a nivel político, social y económico
5. Impacto en el mundo moderno
6. Mínimo 3-4 páginas, con referencias bibliográficas',
                'puntuacion' => 100,
                'permite_archivos' => true,
                'max_archivos' => 2,
                'tipo_archivo_permitido' => 'pdf,docx,doc',
                'dias_limite' => 10,
            ],
            [
                'titulo' => 'Ciclo del Carbono y Cambio Climático',
                'descripcion' => 'Investigación sobre el ciclo del carbono y su relación con el calentamiento global.',
                'instrucciones' => 'Realiza una investigación que incluya:
1. Explicación del ciclo del carbono (fotosíntesis y respiración)
2. Reservorios de carbono en la naturaleza
3. Actividades humanas que alteran el ciclo
4. Consecuencias del aumento de CO2 en la atmósfera
5. Propuestas de soluciones sostenibles
6. Incluir diagramas o ilustraciones
7. Mínimo 4 páginas, presentar en PDF',
                'puntuacion' => 100,
                'permite_archivos' => true,
                'max_archivos' => 2,
                'tipo_archivo_permitido' => 'pdf,docx,doc,pptx',
                'dias_limite' => 12,
            ],
        ];

        // Crear tareas para los cursos
        $cursoIndex = 0;
        $tareaIndex = 0;

        foreach ($cursos as $curso) {
            // Todas las tareas van a todos los cursos
            $tareasParaCurso = $tareasData;

            foreach ($tareasParaCurso as $tarea) {
                // Verificar si la tarea ya existe
                $existente = Contenido::query()
                    ->where('curso_id', $curso->id)
                    ->where('titulo', $tarea['titulo'])
                    ->where('tipo', 'tarea')
                    ->first();

                if (!$existente) {
                    // Crear contenido base
                    $contenido = Contenido::create([
                        'titulo' => $tarea['titulo'],
                        'descripcion' => $tarea['descripcion'],
                        'creador_id' => $profesor1->id,
                        'curso_id' => $curso->id,
                        'tipo' => 'tarea',
                        'estado' => 'publicado',
                        'fecha_creacion' => now(),
                        'fecha_limite' => now()->addDays($tarea['dias_limite']),
                    ]);

                    // Crear la tarea específica
                    Tarea::create([
                        'contenido_id' => $contenido->id,
                        'instrucciones' => $tarea['instrucciones'],
                        'puntuacion' => $tarea['puntuacion'],
                        'permite_archivos' => $tarea['permite_archivos'],
                        'max_archivos' => $tarea['max_archivos'],
                        'tipo_archivo_permitido' => $tarea['tipo_archivo_permitido'],
                        'fecha_limite' => now()->addDays($tarea['dias_limite']),
                    ]);

                    $this->command->info("Tarea '{$tarea['titulo']}' creada en curso '{$curso->nombre}'");
                    $tareaIndex++;
                } else {
                    $this->command->line("Tarea '{$tarea['titulo']}' ya existe en curso '{$curso->nombre}'");
                }
            }

            $cursoIndex++;
        }

        $this->command->info("Total de {$tareaIndex} tareas creadas.");
    }
}
