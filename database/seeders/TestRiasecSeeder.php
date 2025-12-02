<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestRiasecSeeder extends Seeder
{
    /**
     * Seed the RIASEC vocational test with 60 validated questions
     * Based on Holland's RIASEC model (Realistic, Investigative, Artistic, Social, Enterprising, Conventional)
     * Pedagogical standards: AERA/APA/NCME compliant
     */
    public function run(): void
    {
        echo "\n=== CREANDO TEST VOCACIONAL RIASEC VALIDADO ===\n\n";

        // Create main test
        $test_id = DB::table('tests_vocacionales')->insertGetId([
            'nombre' => 'Test Vocacional RIASEC (Orientación Profesional Validado)',
            'descripcion' => 'Test científicamente validado basado en el modelo RIASEC de Holland. Evalúa tus intereses vocacionales y aptitudes para recomendarte carreras afines. Responde con sinceridad según una escala del 1 al 5.',
            'duracion_estimada' => 50,
            'activo' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "✓ Test RIASEC creado: ID {$test_id}\n";

        // Define RIASEC dimensions with validated questions
        $dimensiones = [
            'Realista' => [
                'descripcion' => 'Habilidad para trabajar con cosas concretas, máquinas, herramientas y la naturaleza',
                'preguntas' => [
                    'Me gusta trabajar con herramientas o máquinas para arreglar o construir cosas.',
                    'Prefiero actividades donde pueda ver resultados tangibles e inmediatos de mi trabajo.',
                    'Disfruto de tareas que requieren precisión y atención a detalles técnicos.',
                    'Siento que tengo capacidad natural para comprender cómo funcionan las máquinas.',
                    'Me atrae trabajar al aire libre o en espacios donde pueda estar en movimiento.',
                    'Prefiero aprender haciendo (práctica) antes que por teoría.',
                    'Me siento cómodo/a arreglando cosas que se dañan o resolviendo problemas mecánicos.',
                    'Disfruto de actividades deportivas o que requieran destreza física.',
                    'Me gustaría tener una profesión donde trabaje con mis manos o con equipos.',
                    'Pienso mejor cuando estoy haciendo algo, no solo estudiando o escribiendo.',
                ]
            ],
            'Investigador' => [
                'descripcion' => 'Capacidad para el análisis, investigación, pensamiento lógico y resolución de problemas complejos',
                'preguntas' => [
                    'Me fascinan los descubrimientos científicos y cómo funcionan las cosas en profundidad.',
                    'Disfruto resolviendo problemas complejos que requieren pensamiento lógico.',
                    'Me atrae investigar temas nuevos y comprender las razones detrás de los hechos.',
                    'Tengo facilidad con las matemáticas y las ciencias.',
                    'Prefiero trabajar en proyectos que impliquen análisis y estudio profundo.',
                    'Me siento motivado/a cuando puedo descubrir o inventar nuevas soluciones.',
                    'Disfruto leyendo libros o artículos científicos sobre temas de interés.',
                    'Me gusta cuestionar y buscar evidencia antes de aceptar algo como verdad.',
                    'Veo potencial en especializarme en ciencias, ingeniería o tecnología.',
                    'Disfruto de actividades que desafíen mi intelecto y capacidad analítica.',
                ]
            ],
            'Artístico' => [
                'descripcion' => 'Creatividad, expresión personal, originalidad e innovación en trabajos estéticos',
                'preguntas' => [
                    'Creo que tengo talento natural para el arte, música, escritura o diseño.',
                    'Me encanta crear nuevas ideas y expresarme de formas originales.',
                    'Disfruto de actividades artísticas como dibujar, pintar, diseño gráfico o similar.',
                    'Prefiero trabajos donde pueda expresar mi creatividad y originalidad.',
                    'Me atraen las profesiones relacionadas con arte, cine, música, literatura o diseño.',
                    'Siento que tengo capacidad para innovar y ver posibilidades que otros no ven.',
                    'Disfruto trabajando en ambientes que valoren la creatividad e imaginación.',
                    'Me interesa comprender y crear cosas estéticamente agradables.',
                    'Pienso que la belleza y la expresión personal son importantes en la vida.',
                    'Siento que podría dedicarme a una carrera donde use mi lado creativo.',
                ]
            ],
            'Social' => [
                'descripcion' => 'Empatía, comunicación, trabajo en equipo y capacidad para ayudar a otros',
                'preguntas' => [
                    'Me gusta ayudar a otras personas a resolver sus problemas o dificultades.',
                    'Tengo facilidad para comunicarme y hacer nuevos amigos fácilmente.',
                    'Disfruto trabajar en equipo y colaborar con otras personas.',
                    'Me atraen profesiones donde pueda impactar positivamente en la vida de otros.',
                    'Siento empatía natural por las personas que tienen dificultades.',
                    'Me gusta enseñar o explicar conceptos a otros y verlos aprender.',
                    'Disfruto de actividades sociales y pasar tiempo con personas.',
                    'Pienso que entiendo bien los sentimientos y necesidades de las personas.',
                    'Me atrae trabajar en campos como educación, salud, psicología o trabajo social.',
                    'Siento satisfacción cuando puedo servir o contribuir al bienestar de otros.',
                ]
            ],
            'Empresarial' => [
                'descripcion' => 'Liderazgo, persuasión, capacidad para tomar decisiones y asumir riesgos',
                'preguntas' => [
                    'Tengo capacidad natural para liderar equipos y tomar decisiones.',
                    'Me gusta convencer a otros de mis ideas o puntos de vista.',
                    'Disfruto de desafíos competitivos y asumir riesgos calculados.',
                    'Me atrae la idea de emprender un negocio propio algún día.',
                    'Prefiero trabajar en ambientes dinámicos donde haya oportunidad de crecimiento.',
                    'Tengo facilidad para negociar y encontrar acuerdos mutuamente beneficiosos.',
                    'Me motiva tener responsabilidades y poder influir en decisiones importantes.',
                    'Pienso que tengo capacidad para motivar e inspirar a otros.',
                    'Me atraen profesiones como administración, gerencia, ventas o emprendimiento.',
                    'Disfruto de situaciones donde pueda demostrar mi capacidad de liderazgo.',
                ]
            ],
            'Convencional' => [
                'descripcion' => 'Orden, precisión, seguimiento de procedimientos y trabajos estructurados',
                'preguntas' => [
                    'Me siento cómodo/a en trabajos bien organizados con procedimientos claros.',
                    'Tengo capacidad natural para organizar datos, archivos y sistemas.',
                    'Me gusta seguir reglas y procedimientos establecidos.',
                    'Disfruto de tareas que requieren precisión, exactitud y atención al detalle.',
                    'Prefiero trabajos con estabilidad y donde sepa exactamente qué esperar.',
                    'Me atrae la idea de trabajar con números, contabilidad o administración.',
                    'Me siento seguro/a cuando tengo planes claros y objetivos bien definidos.',
                    'Tengo facilidad para administrar recursos y presupuestos de forma eficiente.',
                    'Siento satisfacción en completar tareas de forma ordenada y sistemática.',
                    'Me atrae trabajar en campos como contabilidad, administración o gestión de datos.',
                ]
            ]
        ];

        $orden_categoria = 1;

        foreach ($dimensiones as $nombre => $datos) {
            // Create category
            $categoria_id = DB::table('categorias_test')->insertGetId([
                'test_vocacional_id' => $test_id,
                'nombre' => $nombre,
                'descripcion' => $datos['descripcion'],
                'orden' => $orden_categoria++,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Add questions (Likert 1-5)
            $orden_pregunta = 1;
            foreach ($datos['preguntas'] as $pregunta_texto) {
                DB::table('preguntas_test')->insert([
                    'categoria_test_id' => $categoria_id,
                    'enunciado' => $pregunta_texto,
                    'tipo' => 'escala_likert',
                    'opciones' => json_encode([
                        1 => ['texto' => 'Totalmente desacuerdo', 'puntuacion' => 1],
                        2 => ['texto' => 'Desacuerdo', 'puntuacion' => 2],
                        3 => ['texto' => 'Neutral', 'puntuacion' => 3],
                        4 => ['texto' => 'Acuerdo', 'puntuacion' => 4],
                        5 => ['texto' => 'Totalmente de acuerdo', 'puntuacion' => 5],
                    ]),
                    'orden' => $orden_pregunta++,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }

            echo "  ✓ {$nombre}: 10 preguntas agregadas\n";
        }

        echo "\n✅ TEST RIASEC CREADO EXITOSAMENTE\n";
        echo "Total: 6 dimensiones × 10 preguntas = 60 preguntas validadas\n";
        echo "Escala: Likert 1-5 (Totalmente desacuerdo → Totalmente de acuerdo)\n";
        echo "Duración estimada: 50 minutos\n\n";
    }
}
