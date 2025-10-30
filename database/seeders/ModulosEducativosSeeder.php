<?php

namespace Database\Seeders;

use App\Models\ModuloEducativo;
use App\Models\Leccion;
use App\Models\Recurso;
use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Seeder;

class ModulosEducativosSeeder extends Seeder
{
    public function run(): void
    {
        $profesor1 = User::where('email', 'profesor1@paucara.test')->first();

        if (!$profesor1) {
            $this->command->warn('profesor1 no existe. Ejecuta DatabaseSeeder primero.');
            return;
        }

        // Obtener el primer curso del profesor
        $curso = Curso::where('profesor_id', $profesor1->id)->first();

        if (!$curso) {
            $this->command->warn('No hay cursos asignados a profesor1.');
            return;
        }

        // Obtener recursos creados
        $recursos = Recurso::all();

        // Definir módulos con sus lecciones
        $modulosData = [
            [
                'titulo' => 'Módulo 1: Álgebra y Ecuaciones Lineales',
                'descripcion' => 'Aprende a resolver ecuaciones de primer grado y sistemas de ecuaciones. Este módulo cubre los conceptos fundamentales del álgebra lineal aplicada a problemas reales.',
                'duracion_estimada' => 240, // 4 horas
                'lecciones' => [
                    [
                        'titulo' => 'Introducción a las Ecuaciones Lineales',
                        'tipo' => 'lectura',
                        'contenido' => 'En esta lección aprenderemos qué es una ecuación lineal, cómo identificarla y los métodos básicos de resolución. Las ecuaciones lineales son expresiones matemáticas que tienen un grado máximo de 1 en la variable.',
                        'duracion_estimada' => 30,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Video: Resolviendo Ecuaciones Paso a Paso',
                        'tipo' => 'video',
                        'contenido' => 'En este video veremos ejercicios prácticos y cómo resolver ecuaciones usando diferentes métodos.',
                        'video_url' => 'https://www.youtube.com/embed/ejemplo',
                        'video_proveedor' => 'youtube',
                        'duracion_estimada' => 45,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Sistemas de Ecuaciones 2x2',
                        'tipo' => 'lectura',
                        'contenido' => 'Aprende a resolver sistemas de dos ecuaciones con dos incógnitas usando los métodos de sustitución, eliminación e igualación.',
                        'duracion_estimada' => 60,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Ejercicios Prácticos Interactivos',
                        'tipo' => 'actividad',
                        'contenido' => 'Resuelve 30 ejercicios interactivos sobre ecuaciones lineales. Recibe retroalimentación inmediata sobre tu desempeño.',
                        'duracion_estimada' => 75,
                        'es_obligatoria' => false,
                        'permite_descarga' => false,
                    ],
                    [
                        'titulo' => 'Quiz: Evalúa tus Conocimientos',
                        'tipo' => 'quiz',
                        'contenido' => 'Quiz de evaluación con 10 preguntas sobre los temas cubiertos en el módulo.',
                        'duracion_estimada' => 30,
                        'es_obligatoria' => true,
                        'permite_descarga' => false,
                    ],
                ],
            ],
            [
                'titulo' => 'Módulo 2: Historia de la Revolución Francesa',
                'descripcion' => 'Descubre los eventos, personajes y consecuencias de uno de los momentos más transformadores de la historia europea. Desde sus causas hasta su impacto en el mundo moderno.',
                'duracion_estimada' => 300, // 5 horas
                'lecciones' => [
                    [
                        'titulo' => 'Antecedentes y Causas de la Revolución',
                        'tipo' => 'lectura',
                        'contenido' => 'Explora las condiciones políticas, económicas y sociales que llevaron a la Revolución Francesa. Entenderemos el papel de la Ilustración y las ideas de libertad, igualdad y fraternidad.',
                        'duracion_estimada' => 45,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Documental: La Toma de la Bastilla',
                        'tipo' => 'video',
                        'contenido' => 'Un análisis visual de uno de los eventos más icónicos: la captura de la Bastilla en 1789.',
                        'video_url' => 'https://www.youtube.com/embed/bastilla',
                        'video_proveedor' => 'youtube',
                        'duracion_estimada' => 50,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Personajes Clave: Robespierre, Danton, Marat',
                        'tipo' => 'lectura',
                        'contenido' => 'Conoce a los personajes más influyentes de la Revolución: sus ideas, acciones y legado en la historia.',
                        'duracion_estimada' => 50,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'La Declaración de los Derechos del Hombre',
                        'tipo' => 'lectura',
                        'contenido' => 'Analiza el documento fundamental que proclamó los derechos universales y cómo revolucionó el pensamiento político.',
                        'duracion_estimada' => 40,
                        'es_obligatoria' => false,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'El Reinado del Terror (1793-1794)',
                        'tipo' => 'lectura',
                        'contenido' => 'Examina el período más violento de la Revolución: sus causas, eventos principales y consecuencias.',
                        'duracion_estimada' => 45,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Consecuencias Globales de la Revolución',
                        'tipo' => 'lectura',
                        'contenido' => 'Descubre cómo la Revolución Francesa influyó en otros países y moldeó el mundo moderno: abolición de la feudalidad, derechos humanos, nacionalismo.',
                        'duracion_estimada' => 40,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Reflexión: Impacto en el Mundo Moderno',
                        'tipo' => 'actividad',
                        'contenido' => 'Escribe un ensayo reflexionando sobre cómo los ideales de la Revolución Francesa continúan influyendo en la política y sociedad actual.',
                        'duracion_estimada' => 60,
                        'es_obligatoria' => false,
                        'permite_descarga' => false,
                    ],
                ],
            ],
            [
                'titulo' => 'Módulo 3: El Ciclo del Carbono y Cambio Climático',
                'descripcion' => 'Comprende los procesos biogeoquímicos del carbono, su ciclo en la naturaleza y su relación con el cambio climático global. Explora soluciones sostenibles.',
                'duracion_estimada' => 280, // 4 horas 40 minutos
                'lecciones' => [
                    [
                        'titulo' => 'Fundamentos del Ciclo del Carbono',
                        'tipo' => 'lectura',
                        'contenido' => 'Aprende cómo el carbono circula entre la atmósfera, la litosfera, la hidrósfera y la biosfera. Entiende los procesos de fotosíntesis y respiración.',
                        'duracion_estimada' => 50,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Video: Visualización del Ciclo del Carbono',
                        'tipo' => 'video',
                        'contenido' => 'Un video animado mostrando cómo fluye el carbono a través de los diferentes compartimentos del planeta.',
                        'video_url' => 'https://www.youtube.com/embed/carbono',
                        'video_proveedor' => 'youtube',
                        'duracion_estimada' => 40,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Almacenes de Carbono: Océanos y Atmósfera',
                        'tipo' => 'lectura',
                        'contenido' => 'Explora los principales reservorios de carbono del planeta: océanos, atmósfera, suelo y rocas. Entiende cómo equilibran el dióxido de carbono.',
                        'duracion_estimada' => 45,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'El Efecto Invernadero y Calentamiento Global',
                        'tipo' => 'lectura',
                        'contenido' => 'Aprende cómo el aumento de CO2 en la atmósfera contribuye al efecto invernadero y sus consecuencias: cambios climáticos, extinción de especies, desastres naturales.',
                        'duracion_estimada' => 50,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Fuentes Antropogénicas de Carbono',
                        'tipo' => 'lectura',
                        'contenido' => 'Examina cómo las actividades humanas (quema de combustibles fósiles, deforestación, industria) alteran el ciclo natural del carbono.',
                        'duracion_estimada' => 40,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Soluciones Sostenibles para Mitigar el Cambio Climático',
                        'tipo' => 'lectura',
                        'contenido' => 'Descubre soluciones: energías renovables, reforestación, captura de carbono, cambios en patrones de consumo y políticas ambientales.',
                        'duracion_estimada' => 45,
                        'es_obligatoria' => true,
                        'permite_descarga' => true,
                    ],
                    [
                        'titulo' => 'Laboratorio Virtual: Simulación del Ciclo',
                        'tipo' => 'actividad',
                        'contenido' => 'Interactúa con una simulación del ciclo del carbono. Ajusta variables y observa los efectos en el clima global.',
                        'duracion_estimada' => 50,
                        'es_obligatoria' => false,
                        'permite_descarga' => false,
                    ],
                    [
                        'titulo' => 'Proyecto Final: Propuesta de Acción Ambiental',
                        'tipo' => 'actividad',
                        'contenido' => 'Diseña una propuesta para reducir emisiones de carbono en tu comunidad. Considera fuentes renovables, educación y políticas locales.',
                        'duracion_estimada' => 70,
                        'es_obligatoria' => false,
                        'permite_descarga' => false,
                    ],
                ],
            ],
        ];

        // Crear módulos y lecciones
        foreach ($modulosData as $moduloData) {
            $lecciones = $moduloData['lecciones'];
            unset($moduloData['lecciones']);

            // Crear módulo
            $modulo = ModuloEducativo::create([
                ...$moduloData,
                'curso_id' => $curso->id,
                'creador_id' => $profesor1->id,
                'estado' => 'publicado',
                'orden' => 0,
            ]);

            $this->command->info("✓ Módulo '{$modulo->titulo}' creado");

            // Crear lecciones
            foreach ($lecciones as $index => $leccionData) {
                $leccion = Leccion::create([
                    ...$leccionData,
                    'modulo_educativo_id' => $modulo->id,
                    'estado' => 'publicado',
                    'orden' => $index,
                    'slug' => \Illuminate\Support\Str::slug($leccionData['titulo']),
                ]);

                $this->command->line("  └─ Lección: {$leccion->titulo}");

                // Asociar recursos relevantes a la lección
                $this->asociarRecursosALeccion($leccion, $modulo->titulo, $recursos);
            }

            $this->command->newLine();
        }

        $this->command->info('✓ Módulos educativos creados exitosamente.');
    }

    /**
     * Asociar recursos relevantes a una lección
     */
    private function asociarRecursosALeccion(Leccion $leccion, string $tituloModulo, $recursos): void
    {
        if ($recursos->isEmpty()) {
            return;
        }

        // Asociar recursos según el módulo y tipo de lección
        if (str_contains($tituloModulo, 'Álgebra')) {
            // Asociar recursos de matemáticas
            $recursosAsociar = $recursos->slice(0, 4); // Primeros 4 recursos

            if (str_contains($leccion->titulo, 'Video')) {
                // Si es video, asociar solo el video
                $recursosAsociar = $recursos->where('tipo', 'video')->slice(0, 1);
            } elseif (str_contains($leccion->titulo, 'Ejercicios')) {
                // Si es actividad, asociar documentos
                $recursosAsociar = $recursos->where('tipo', 'documento')->slice(0, 2);
            }
        } elseif (str_contains($tituloModulo, 'Revolución')) {
            // Asociar recursos de historia
            $recursosAsociar = $recursos->slice(4, 4);

            if (str_contains($leccion->titulo, 'Video')) {
                $recursosAsociar = $recursos->where('tipo', 'video')->slice(1, 1);
            } elseif (str_contains($leccion->titulo, 'Timeline')) {
                $recursosAsociar = $recursos->where('tipo', 'enlace')->slice(0, 1);
            }
        } elseif (str_contains($tituloModulo, 'Carbono')) {
            // Asociar recursos de biología
            $recursosAsociar = $recursos->slice(8, 5);

            if (str_contains($leccion->titulo, 'Video')) {
                $recursosAsociar = $recursos->where('tipo', 'video')->slice(2, 1);
            } elseif (str_contains($leccion->titulo, 'Diagrama')) {
                $recursosAsociar = $recursos->where('tipo', 'imagen')->slice(0, 1);
            }
        }

        // Sincronizar recursos con la lección (con orden)
        if (!empty($recursosAsociar)) {
            $recursosSync = [];
            foreach ($recursosAsociar as $index => $recurso) {
                $recursosSync[$recurso->id] = ['orden' => $index];
            }
            $leccion->recursos()->sync($recursosSync);
        }
    }
}
