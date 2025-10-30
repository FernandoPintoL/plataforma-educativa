<?php

namespace Database\Seeders;

use App\Models\Recurso;
use App\Models\Contenido;
use Illuminate\Database\Seeder;

class RecursosSeeder extends Seeder
{
    public function run(): void
    {
        // Recursos de ejemplo para las tareas
        $recursosData = [
            // Recursos para Matemáticas (Ecuaciones)
            [
                'nombre' => 'Guía de Ecuaciones Lineales',
                'tipo' => 'documento',
                'descripcion' => 'Manual completo sobre ecuaciones de primer grado con ejemplos prácticos.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 2048000, // 2MB simulado
                'mime_type' => 'application/pdf',
                'activo' => true,
            ],
            [
                'nombre' => 'Video: Métodos de Solución de Ecuaciones',
                'tipo' => 'video',
                'descripcion' => 'Video tutorial explicando paso a paso cómo resolver ecuaciones de primer grado.',
                'url' => 'https://www.youtube.com/watch?v=ejemplo',
                'archivo_path' => null,
                'tamaño' => null,
                'mime_type' => 'video/youtube',
                'activo' => true,
            ],
            [
                'nombre' => 'Ejercicios Prácticos - Ecuaciones',
                'tipo' => 'documento',
                'descripcion' => '50 ejercicios resueltos de ecuaciones lineales con soluciones paso a paso.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 3500000, // 3.5MB simulado
                'mime_type' => 'application/pdf',
                'activo' => true,
            ],
            [
                'nombre' => 'Presentación: Sistemas de Ecuaciones 2x2',
                'tipo' => 'presentacion',
                'descripcion' => 'Diapositivas con métodos de sustitución y eliminación en sistemas de ecuaciones.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 5200000, // 5.2MB simulado
                'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'activo' => true,
            ],

            // Recursos para Historia (Revolución Francesa)
            [
                'nombre' => 'La Revolución Francesa - Causas y Consecuencias',
                'tipo' => 'documento',
                'descripcion' => 'Documento analítico sobre las causas, desarrollo y consecuencias de la Revolución Francesa.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 4100000, // 4.1MB simulado
                'mime_type' => 'application/pdf',
                'activo' => true,
            ],
            [
                'nombre' => 'Video Documental: La Toma de la Bastilla',
                'tipo' => 'video',
                'descripcion' => 'Documental histórico sobre el evento más importante de la Revolución Francesa.',
                'url' => 'https://www.youtube.com/watch?v=revolucion',
                'archivo_path' => null,
                'tamaño' => null,
                'mime_type' => 'video/youtube',
                'activo' => true,
            ],
            [
                'nombre' => 'Personajes Clave de la Revolución',
                'tipo' => 'presentacion',
                'descripcion' => 'Presentación sobre los personajes más importantes: Robespierre, Marat, Danton, etc.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 6800000, // 6.8MB simulado
                'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'activo' => true,
            ],
            [
                'nombre' => 'Timeline Interactivo de la Revolución',
                'tipo' => 'enlace',
                'descripcion' => 'Línea de tiempo interactiva con eventos principales de 1789-1799.',
                'url' => 'https://www.timetoast.com/timelines/revolucion-francesa',
                'archivo_path' => null,
                'tamaño' => null,
                'mime_type' => 'text/html',
                'activo' => true,
            ],

            // Recursos para Biología (Ciclo del Carbono)
            [
                'nombre' => 'El Ciclo del Carbono Explicado',
                'tipo' => 'documento',
                'descripcion' => 'Documento detallado sobre fotosíntesis, respiración y el ciclo biogeoquímico del carbono.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 3800000, // 3.8MB simulado
                'mime_type' => 'application/pdf',
                'activo' => true,
            ],
            [
                'nombre' => 'Video: Cambio Climático y Efecto Invernadero',
                'tipo' => 'video',
                'descripcion' => 'Video educativo sobre cómo el aumento de CO2 afecta el clima global.',
                'url' => 'https://www.youtube.com/watch?v=cambio-climatico',
                'archivo_path' => null,
                'tamaño' => null,
                'mime_type' => 'video/youtube',
                'activo' => true,
            ],
            [
                'nombre' => 'Diagrama del Ciclo del Carbono',
                'tipo' => 'imagen',
                'descripcion' => 'Infografía detallada mostrando los procesos del ciclo del carbono en la naturaleza.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 1500000, // 1.5MB simulado
                'mime_type' => 'image/png',
                'activo' => true,
            ],
            [
                'nombre' => 'Soluciones al Cambio Climático',
                'tipo' => 'presentacion',
                'descripcion' => 'Presentación sobre energías renovables, reforestación y políticas ambientales.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 7200000, // 7.2MB simulado
                'mime_type' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                'activo' => true,
            ],
            [
                'nombre' => 'Artículo: Reservorios de Carbono',
                'tipo' => 'documento',
                'descripcion' => 'Estudio científico sobre océanos, atmósfera, litosfera como reservorios de carbono.',
                'url' => null,
                'archivo_path' => null,
                'tamaño' => 2900000, // 2.9MB simulado
                'mime_type' => 'application/pdf',
                'activo' => true,
            ],
        ];

        // Crear los recursos
        foreach ($recursosData as $recurso) {
            Recurso::create($recurso);
        }

        $this->command->info('✓ ' . count($recursosData) . ' recursos creados exitosamente.');

        // Asociar recursos con las tareas si existen
        $this->asociarRecursosAContenidos();
    }

    /**
     * Asociar recursos con contenidos (tareas)
     */
    private function asociarRecursosAContenidos(): void
    {
        $profesor1 = \App\Models\User::where('email', 'profesor1@paucara.test')->first();

        if (!$profesor1) {
            return;
        }

        // Obtener las tareas creadas por profesor1
        $tareas = Contenido::where('creador_id', $profesor1->id)
            ->where('tipo', 'tarea')
            ->get();

        $recursos = Recurso::all();

        if ($recursos->isEmpty() || $tareas->isEmpty()) {
            return;
        }

        // Asociar recursos con tareas basado en el título
        foreach ($tareas as $tarea) {
            if (str_contains($tarea->titulo, 'Ecuaciones')) {
                // Asociar los 4 primeros recursos (Matemáticas)
                $tarea->recursos()->sync($recursos->slice(0, 4)->pluck('id'));
                $this->command->line("  Recursos asociados a: {$tarea->titulo}");
            } elseif (str_contains($tarea->titulo, 'Revolución')) {
                // Asociar recursos 4-7 (Historia)
                $tarea->recursos()->sync($recursos->slice(4, 4)->pluck('id'));
                $this->command->line("  Recursos asociados a: {$tarea->titulo}");
            } elseif (str_contains($tarea->titulo, 'Ciclo')) {
                // Asociar recursos 8-12 (Biología)
                $tarea->recursos()->sync($recursos->slice(8, 5)->pluck('id'));
                $this->command->line("  Recursos asociados a: {$tarea->titulo}");
            }
        }

        $this->command->info('✓ Recursos asociados a las tareas.');
    }
}
