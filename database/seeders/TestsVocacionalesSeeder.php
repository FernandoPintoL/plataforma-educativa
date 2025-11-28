<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestsVocacionalesSeeder extends Seeder
{
    /**
     * Seed vocational tests with categories and questions
     */
    public function run(): void
    {
        echo "\n=== CREANDO TESTS VOCACIONALES ===\n\n";

        // Test 1: Explorador de Carreras
        $test1_id = DB::table('tests_vocacionales')->insertGetId([
            'nombre' => 'Explorador de Carreras',
            'descripcion' => 'Test para explorar intereses y aptitudes en diferentes áreas profesionales. Identifica tus fortalezas y descubre carreras afines.',
            'duracion_estimada' => 45,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Test creado: Explorador de Carreras\n";

        // Categorías para Test 1
        $categorias1 = [
            'Habilidades STEM' => 'Matemática, Ciencias, Tecnología',
            'Creatividad' => 'Arte, Diseño, Innovación',
            'Comunicación' => 'Expresión verbal y escrita',
            'Liderazgo' => 'Capacidad de coordinación y gestión',
        ];

        $orden = 1;
        foreach ($categorias1 as $nombre => $descripcion) {
            $categoria_id = DB::table('categorias_test')->insertGetId([
                'test_vocacional_id' => $test1_id,
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'orden' => $orden++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Preguntas para cada categoría
            $preguntas = [
                '¿Disfrutas resolviendo problemas matemáticos complejos?',
                '¿Te atrae trabajar con programación o desarrollo de software?',
                '¿Prefieres realizar actividades que requieren pensamiento creativo?',
            ];

            $pregunta_orden = 1;
            foreach ($preguntas as $texto) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $texto,
                    'tipo' => 'verdadero_falso',
                    'orden' => $pregunta_orden++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "  ✓ 4 categorías y 12 preguntas agregadas\n";

        // Test 2: Aptitud Profesional
        $test2_id = DB::table('tests_vocacionales')->insertGetId([
            'nombre' => 'Test de Aptitud Profesional',
            'descripcion' => 'Evalúa tus aptitudes naturales y habilidades para diferentes roles profesionales. Descubre dónde tienes mayor potencial.',
            'duracion_estimada' => 60,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Test creado: Test de Aptitud Profesional\n";

        // Categorías para Test 2
        $categorias2 = [
            'Análisis' => 'Capacidad de análisis y síntesis',
            'Interacción Social' => 'Empatía y relaciones humanas',
            'Organización' => 'Planificación y gestión de recursos',
            'Innovación' => 'Pensamiento creativo e inventiva',
        ];

        $orden = 1;
        foreach ($categorias2 as $nombre => $descripcion) {
            $categoria_id = DB::table('categorias_test')->insertGetId([
                'test_vocacional_id' => $test2_id,
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'orden' => $orden++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $preguntas = [
                '¿Sobresales en tu capacidad de análisis?',
                '¿Prefieres trabajar en equipo o individualmente?',
                '¿Consideras que eres organizado/a?',
            ];

            $pregunta_orden = 1;
            foreach ($preguntas as $texto) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $texto,
                    'tipo' => 'verdadero_falso',
                    'orden' => $pregunta_orden++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "  ✓ 4 categorías y 12 preguntas agregadas\n";

        // Test 3: Identificación de Preferencias Laborales
        $test3_id = DB::table('tests_vocacionales')->insertGetId([
            'nombre' => 'Identificación de Preferencias Laborales',
            'descripcion' => 'Determina qué tipo de ambiente y tareas laborales se adaptan mejor a tu perfil. Encuentra tu camino profesional ideal.',
            'duracion_estimada' => 30,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Test creado: Identificación de Preferencias Laborales\n";

        // Categorías para Test 3
        $categorias3 = [
            'Ambiente Laboral' => 'Preferencias de entorno de trabajo',
            'Tipo de Tareas' => 'Naturaleza del trabajo preferido',
            'Valores Profesionales' => 'Qué es importante en tu carrera',
        ];

        $orden = 1;
        foreach ($categorias3 as $nombre => $descripcion) {
            $categoria_id = DB::table('categorias_test')->insertGetId([
                'test_vocacional_id' => $test3_id,
                'nombre' => $nombre,
                'descripcion' => $descripcion,
                'orden' => $orden++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $preguntas = [
                '¿Prefieres trabajar en una oficina o en campo?',
                '¿Te atraen trabajos con mucha interacción social?',
                '¿La estabilidad es lo más importante para ti?',
            ];

            $pregunta_orden = 1;
            foreach ($preguntas as $texto) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $texto,
                    'tipo' => 'verdadero_falso',
                    'orden' => $pregunta_orden++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "  ✓ 3 categorías y 9 preguntas agregadas\n";

        echo "\n✅ TESTS VOCACIONALES CREADOS EXITOSAMENTE\n";
        echo "Total: 3 tests con 31 preguntas distribuidas\n\n";
    }
}
