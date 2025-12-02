<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class RiasecValidationDataSeeder extends Seeder
{
    /**
     * Generate synthetic but realistic RIASEC responses for validation
     * Creates coherent student profiles based on RIASEC dimensions
     */
    public function run(): void
    {
        echo "\n=== GENERANDO DATOS DE VALIDACIÓN RIASEC ===\n\n";

        // Get the RIASEC test
        $test = DB::table('tests_vocacionales')
            ->where('nombre', 'like', '%RIASEC%')
            ->first();

        if (!$test) {
            echo "❌ Error: Test RIASEC no encontrado. Ejecuta primero TestRiasecSeeder.\n";
            return;
        }

        // Get categories in order
        $categorias = DB::table('categorias_test')
            ->where('test_vocacional_id', $test->id)
            ->orderBy('orden')
            ->get();

        // Get all questions grouped by category
        $preguntasPorCategoria = [];
        foreach ($categorias as $categoria) {
            $preguntasPorCategoria[$categoria->id] = DB::table('preguntas_test')
                ->where('categoria_test_id', $categoria->id)
                ->orderBy('orden')
                ->get();
        }

        // Define student profiles (RIASEC archetypes with realistic patterns)
        $perfiles = [
            // Técnicos/Ingeniero (High R, I; Low A, S)
            [
                'nombre_perfil' => 'Técnico Ingeniero',
                'cantidad' => 35,
                'scores' => ['Realista' => 4.3, 'Investigador' => 4.1, 'Artístico' => 1.8, 'Social' => 2.2, 'Empresarial' => 2.8, 'Convencional' => 3.5],
                'carreras_esperadas' => ['Ingeniería en Sistemas', 'Ingeniería Mecánica', 'Ingeniería Civil'],
                'noise' => 0.4,
            ],
            // Científico/Investigador (High I; Medium R; Low E, A, S)
            [
                'nombre_perfil' => 'Investigador Científico',
                'cantidad' => 30,
                'scores' => ['Realista' => 3.2, 'Investigador' => 4.5, 'Artístico' => 2.1, 'Social' => 2.3, 'Empresarial' => 2.1, 'Convencional' => 3.8],
                'carreras_esperadas' => ['Física', 'Química', 'Biología', 'Matemáticas'],
                'noise' => 0.3,
            ],
            // Artista/Creativo (High A; Low C, E)
            [
                'nombre_perfil' => 'Creativo Artístico',
                'cantidad' => 28,
                'scores' => ['Realista' => 2.1, 'Investigador' => 2.8, 'Artístico' => 4.6, 'Social' => 3.2, 'Empresarial' => 2.3, 'Convencional' => 1.9],
                'carreras_esperadas' => ['Diseño Gráfico', 'Bellas Artes', 'Música', 'Cine'],
                'noise' => 0.5,
            ],
            // Docente/Psicólogo (High S, I; Low R, E)
            [
                'nombre_perfil' => 'Docente Humanista',
                'cantidad' => 32,
                'scores' => ['Realista' => 2.0, 'Investigador' => 3.8, 'Artístico' => 3.1, 'Social' => 4.4, 'Empresarial' => 2.5, 'Convencional' => 3.3],
                'carreras_esperadas' => ['Educación', 'Psicología', 'Trabajo Social', 'Enfermería'],
                'noise' => 0.4,
            ],
            // Emprendedor/Gerente (High E, S; Low I, A)
            [
                'nombre_perfil' => 'Líder Empresarial',
                'cantidad' => 30,
                'scores' => ['Realista' => 2.9, 'Investigador' => 2.2, 'Artístico' => 1.8, 'Social' => 3.9, 'Empresarial' => 4.5, 'Convencional' => 3.2],
                'carreras_esperadas' => ['Administración de Empresas', 'Marketing', 'Economía', 'Emprendimiento'],
                'noise' => 0.4,
            ],
            // Contador/Administrativo (High C; Medium R; Low A, S)
            [
                'nombre_perfil' => 'Administrativo Ordenado',
                'cantidad' => 28,
                'scores' => ['Realista' => 3.1, 'Investigador' => 2.5, 'Artístico' => 1.5, 'Social' => 2.4, 'Empresarial' => 2.8, 'Convencional' => 4.4],
                'carreras_esperadas' => ['Contabilidad', 'Administración', 'Auditoría', 'Secretariado'],
                'noise' => 0.3,
            ],
            // Balanceado/Multidisciplinario (Moderate all)
            [
                'nombre_perfil' => 'Profesional Versátil',
                'cantidad' => 37,
                'scores' => ['Realista' => 3.0, 'Investigador' => 3.2, 'Artístico' => 3.1, 'Social' => 3.3, 'Empresarial' => 3.2, 'Convencional' => 3.1],
                'carreras_esperadas' => ['Comunicación', 'Relaciones Internacionales', 'Gestión Pública'],
                'noise' => 0.6,
            ],
        ];

        // Get or create test users for responses
        $users = User::whereIn('role', ['estudiante', 'student'])
            ->limit(250)
            ->get();

        if ($users->count() < 20) {
            echo "⚠️  Advertencia: Pocas usuarios estudiantes encontrados. Generando usuarios de prueba...\n";
            // Create dummy users if needed
            for ($i = 1; $i <= 250; $i++) {
                $users[] = User::create([
                    'name' => "Estudiante Validación {$i}",
                    'email' => "estudiante.validacion{$i}@example.com",
                    'password' => bcrypt('password'),
                    'role' => 'estudiante',
                    'email_verified_at' => now(),
                ]);
            }
        }

        $user_index = 0;
        $total_respuestas = 0;

        // Generate responses based on profiles
        foreach ($perfiles as $perfil) {
            $cantidad = $perfil['cantidad'];
            $scores_base = $perfil['scores'];
            $noise = $perfil['noise'];

            echo "  Generando {$cantidad} respuestas para: {$perfil['nombre_perfil']}...\n";

            for ($estudiante = 0; $estudiante < $cantidad; $estudiante++) {
                if ($user_index >= count($users)) {
                    break;
                }

                $usuario = $users[$user_index++];

                // For each category/dimension
                foreach ($categorias as $categoria) {
                    // Get base score for this category
                    $categoria_nombre = $categoria->nombre;
                    $score_base = $scores_base[$categoria_nombre] ?? 3;

                    // Add noise to create variation
                    $factor_ruido = (rand(-100, 100) / 100) * $noise;
                    $score_con_ruido = $score_base + $factor_ruido;

                    // Clamp between 1 and 5
                    $score_con_ruido = max(1, min(5, $score_con_ruido));

                    // Add slight trend: first questions tend slightly higher/lower
                    $tendencia = 0;

                    // Get questions for this category
                    $preguntas = $preguntasPorCategoria[$categoria->id] ?? [];

                    foreach ($preguntas as $index => $pregunta) {
                        // Vary response around category score
                        $variacion = (rand(-2, 2)) / 10;
                        $respuesta_valor = $score_con_ruido + $variacion;

                        // Small trend effect
                        if ($index < 3) {
                            $respuesta_valor += 0.1;
                        }

                        $respuesta_valor = max(1, min(5, $respuesta_valor));

                        // Round to nearest 0.5 for realism (1, 1.5, 2, 2.5, etc)
                        $respuesta_valor = round($respuesta_valor * 2) / 2;

                        // Insert response
                        DB::table('respuestas_test')->insert([
                            'estudiante_id' => $usuario->id,
                            'pregunta_test_id' => $pregunta->id,
                            'respuesta_seleccionada' => $respuesta_valor,
                            'tiempo' => rand(15, 60), // seconds per question
                            'fecha_respuesta' => now()->subDays(rand(1, 30)),
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);

                        $total_respuestas++;
                    }
                }
            }
        }

        echo "\n✅ DATOS DE VALIDACIÓN GENERADOS EXITOSAMENTE\n";
        echo "Total: {$total_respuestas} respuestas de test\n";
        echo "Estudiantes: " . $user_index . "\n";
        echo "Perfiles coherentes creados: 7 arquetipos\n";
        echo "Ruido añadido: para simular variabilidad realista\n\n";
    }
}
