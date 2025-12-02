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

        // PRIMERO: Limpiar test 52 si existe (para idempotencia)
        DB::table('preguntas_test')->whereIn('categoria_test_id',
            DB::table('categorias_test')->where('test_vocacional_id', 52)->pluck('id')
        )->delete();
        DB::table('categorias_test')->where('test_vocacional_id', 52)->delete();
        DB::table('tests_vocacionales')->where('id', 52)->delete();

        // Test 1 (ID 52): Explorador de Carreras - ESPECIAL (PostgreSQL)
        DB::table('tests_vocacionales')->insert([
            'id' => 52,
            'nombre' => 'Explorador de Carreras',
            'descripcion' => 'Test para explorar intereses y aptitudes en diferentes áreas profesionales. Identifica tus fortalezas y descubre carreras afines.',
            'duracion_estimada' => 45,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Resetear secuencia para PostgreSQL
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('SELECT setval(\'tests_vocacionales_id_seq\', 53, true)');
        }

        $test1_id = 52;
        echo "✓ Test creado: Explorador de Carreras (ID: $test1_id)\n";

        // Categorías para Test 1
        $categorias1 = [
            'Habilidades STEM' => 'Matemática, Ciencias, Tecnología',
            'Creatividad' => 'Arte, Diseño, Innovación',
            'Comunicación' => 'Expresión verbal y escrita',
            'Liderazgo' => 'Capacidad de coordinación y gestión',
        ];

        // Preguntas específicas para cada categoría
        $preguntasPorCategoria = [
            'Habilidades STEM' => [
                ['¿Disfrutas resolver problemas lógicos y matemáticos?', 'escala_likert'],
                ['Tienes facilidad para entender conceptos científicos complejos', 'verdadero_falso'],
                ['La programación y el análisis de datos te resultan atractivos', 'verdadero_falso'],
                ['Prefieres trabajos basados en datos y evidencia científica', 'escala_likert'],
                ['¿Cuán cómodo te sientes con tecnología nueva y herramientas digitales?', 'escala_likert'],
                ['Disfrutas del trabajo experimental y la investigación', 'verdadero_falso'],
            ],
            'Creatividad' => [
                ['¿Cuán importante es para ti expresar tus ideas de forma original?', 'escala_likert'],
                ['Te sientes atraído por carreras artísticas, diseño o creación', 'verdadero_falso'],
                ['Consideras que tienes una perspectiva única para resolver problemas', 'escala_likert'],
                ['¿Te gusta generar nuevas ideas incluso en campos que no conoces bien?', 'escala_likert'],
                ['Disfrutas trabajar en proyectos sin procedimientos predefinidos', 'verdadero_falso'],
                ['La innovación y romper paradigmas tradicionales te motiva', 'escala_likert'],
            ],
            'Comunicación' => [
                ['¿Cuán cómodo te sientes hablando en público?', 'escala_likert'],
                ['Prefieres profesiones que requieren interacción y diálogo constante', 'verdadero_falso'],
                ['¿Cuál es tu capacidad para escuchar activamente y comprender a otros?', 'escala_likert'],
                ['Tienes facilidad para explicar conceptos complejos de forma simple', 'verdadero_falso'],
                ['¿Cuán importante es para ti trabajar en equipos multidisciplinarios?', 'escala_likert'],
                ['Disfrutas escribir y comunicar ideas por texto', 'verdadero_falso'],
            ],
            'Liderazgo' => [
                ['¿Te gusta tomar decisiones y asumir responsabilidades?', 'escala_likert'],
                ['Prefieres posiciones donde dirijas equipos y proyectos', 'verdadero_falso'],
                ['¿Cuán importante es para ti motivar y desarrollar a otros?', 'escala_likert'],
                ['Tienes capacidad para manejar conflictos y situaciones complejas', 'verdadero_falso'],
                ['¿Cuán cómodo te sientes con cambios y transformaciones organizacionales?', 'escala_likert'],
                ['Disfrutas planificar estrategias a largo plazo', 'verdadero_falso'],
            ],
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

            $pregunta_orden = 1;
            foreach ($preguntasPorCategoria[$nombre] as [$texto, $tipo]) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $texto,
                    'tipo' => $tipo,
                    'orden' => $pregunta_orden++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "  ✓ 4 categorías y 24 preguntas especializadas agregadas\n";

        // Test 2: Identificación de Preferencias Laborales
        $test2_id = DB::table('tests_vocacionales')->insertGetId([
            'nombre' => 'Identificación de Preferencias Laborales',
            'descripcion' => 'Determina qué tipo de ambiente y tareas laborales se adaptan mejor a tu perfil. Encuentra tu camino profesional ideal.',
            'duracion_estimada' => 30,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        echo "✓ Test creado: Identificación de Preferencias Laborales\n";

        // Categorías para Test 2
        $categorias2 = [
            'Ambiente Laboral' => 'Preferencias de entorno de trabajo',
            'Tipo de Tareas' => 'Naturaleza del trabajo preferido',
            'Valores Profesionales' => 'Qué es importante en tu carrera',
        ];

        // Preguntas para Preferencias Laborales
        $preferenciaPreguntas = [
            'Ambiente Laboral' => [
                ['¿Cuán importante es el ambiente físico en tu satisfacción laboral?', 'escala_likert'],
                ['Prefieres trabajar en oficina estructurada que en espacios abiertos', 'verdadero_falso'],
                ['¿Te atrae la posibilidad de trabajar de forma remota o flexible?', 'escala_likert'],
                ['Necesitas interacción cara a cara con colegas regularmente', 'verdadero_falso'],
                ['¿Qué tan importante es tener autonomía en la gestión de tu tiempo?', 'escala_likert'],
            ],
            'Tipo de Tareas' => [
                ['¿Prefieres tareas rutinarias y predecibles o variadas y desafiantes?', 'escala_likert'],
                ['Disfrutas trabajar en proyectos de larga duración', 'verdadero_falso'],
                ['¿Cuán importante es que tu trabajo tenga impacto visible e inmediato?', 'escala_likert'],
                ['Te motiva resolver problemas complejos y casos difíciles', 'verdadero_falso'],
                ['¿Prefieres trabajo especializado en tu área o roles generales?', 'escala_likert'],
            ],
            'Valores Profesionales' => [
                ['¿Cuán importante es ganar un buen salario en tu decisión laboral?', 'escala_likert'],
                ['Buscas trabajos con propósito social o impacto ambiental', 'verdadero_falso'],
                ['¿Cuál es la importancia del desarrollo profesional y oportunidades de aprendizaje?', 'escala_likert'],
                ['La estabilidad y seguridad laboral son más importantes que el crecimiento', 'verdadero_falso'],
                ['¿Cuán importante es el balance entre vida laboral y personal?', 'escala_likert'],
            ],
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

            $pregunta_orden = 1;
            foreach ($preferenciaPreguntas[$nombre] as [$texto, $tipo]) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $texto,
                    'tipo' => $tipo,
                    'orden' => $pregunta_orden++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
        echo "  ✓ 3 categorías y 15 preguntas de preferencias agregadas\n";

        echo "\n✅ TESTS VOCACIONALES CREADOS EXITOSAMENTE\n";
        echo "Total: 3 tests con 39 preguntas profesionales distribuidas\n";
        echo "  • Test 1 (Explorador de Carreras): 4 categorías × 6 preguntas = 24 preguntas\n";
        echo "  • Test 2 (Preferencias Laborales): 3 categorías × 5 preguntas = 15 preguntas\n";
        echo "  • Test 3 (RIASEC - Orientación Profesional Validado): creado por separado\n\n";
    }
}
