<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\TestVocacional;
use App\Models\CategoriaTestVocacional;
use App\Models\PreguntaTestVocacional;
use App\Models\ResultadoTestVocacional;
use App\Models\PerfilVocacional;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

/**
 * Seeder para datos de ejemplo de exposición
 * Crea un estudiante, padre y profesor realistas con test vocacional completado
 *
 * Uso:
 * - Automático: Se ejecuta con php artisan migrate:fresh --seed
 * - Manual: php artisan db:seed --class=DatosEjemploExposicionSeeder
 */
class DatosEjemploExposicionSeeder extends Seeder
{
    public function run(): void
    {
        $this->command->info('🎓 Creando datos de ejemplo para exposición...');

        // ==================== PASO 1: CREAR ESTUDIANTE ====================
        $estudiante = $this->crearEstudiante();
        $this->command->info("✓ Estudiante creado: {$estudiante->nombre_completo}");

        // ==================== PASO 2: CREAR PADRE ====================
        $padre = $this->crearPadre();
        $this->command->info("✓ Padre creado: {$padre->nombre_completo}");

        // ==================== PASO 3: CREAR PROFESOR ====================
        $profesor = $this->crearProfesor();
        $this->command->info("✓ Profesor creado: {$profesor->nombre_completo}");

        // ==================== PASO 4: VINCULAR PADRE-ESTUDIANTE ====================
        $this->vincularPadreEstudiante($padre, $estudiante);
        $this->command->info("✓ Padre vinculado a estudiante");

        // ==================== PASO 5: OBTENER TEST VOCACIONAL ====================
        $testVocacional = $this->obtenerTestVocacional();
        if (!$testVocacional) {
            $this->command->warn("⚠️  No hay test vocacional disponible. Sáltalo.");
            return;
        }

        // ==================== PASO 6: CREAR RESPUESTAS DE TEST ====================
        $respuestas = $this->generarRespuestasCoherentes($testVocacional);
        $this->command->info("✓ Respuestas de test generadas: " . count($respuestas) . " preguntas");

        // ==================== PASO 7: CREAR RESULTADO DE TEST ====================
        $resultado = $this->crearResultadoTest($estudiante, $testVocacional, $respuestas);
        $this->command->info("✓ Resultado de test creado");

        // ==================== PASO 8: CREAR PERFIL VOCACIONAL ====================
        $perfil = $this->crearPerfilVocacional($estudiante, $resultado);
        $this->command->info("✓ Perfil vocacional creado");

        // ==================== RESUMEN ====================
        $this->mostrarResumen($estudiante, $padre, $profesor, $perfil);
    }

    /**
     * Crear un estudiante ejemplo realista
     */
    private function crearEstudiante(): User
    {
        // Verificar si ya existe
        $existente = User::where('email', 'carlos.andrade@estudiante.test')->first();
        if ($existente) {
            return $existente;
        }

        $estudiante = User::create([
            'name' => 'Carlos',
            'apellido' => 'Andrade Rodríguez',
            'usernick' => 'carlos.andrade',
            'email' => 'carlos.andrade@estudiante.test',
            'password' => Hash::make('password123'),
            'tipo_usuario' => 'estudiante',
            'activo' => true,
            'grado' => 6, // 6to de Secundaria
            'seccion' => 'A',
            'numero_matricula' => '999001',
            'fecha_nacimiento' => Carbon::now()->subYears(17)->toDateString(),
        ]);

        $estudiante->assignRole('estudiante');
        return $estudiante;
    }

    /**
     * Crear un padre ejemplo realista
     */
    private function crearPadre(): User
    {
        // Verificar si ya existe
        $existente = User::where('email', 'roberto.andrade@padre.test')->first();
        if ($existente) {
            return $existente;
        }

        $padre = User::create([
            'name' => 'Roberto',
            'apellido' => 'Andrade López',
            'usernick' => 'roberto.andrade',
            'email' => 'roberto.andrade@padre.test',
            'password' => Hash::make('password123'),
            'tipo_usuario' => 'padre',
            'activo' => true,
            'telefono' => '+591 76123456',
        ]);

        $padre->assignRole('padre');
        return $padre;
    }

    /**
     * Crear un profesor ejemplo realista
     */
    private function crearProfesor(): User
    {
        // Verificar si ya existe
        $existente = User::where('email', 'laura.fernandez@profesor.test')->first();
        if ($existente) {
            return $existente;
        }

        $profesor = User::create([
            'name' => 'Laura',
            'apellido' => 'Fernández García',
            'usernick' => 'laura.fernandez',
            'email' => 'laura.fernandez@profesor.test',
            'password' => Hash::make('password123'),
            'tipo_usuario' => 'profesor',
            'activo' => true,
            'especialidad' => 'Orientación Vocacional',
        ]);

        $profesor->assignRole('profesor');
        return $profesor;
    }

    /**
     * Vincular padre con estudiante
     */
    private function vincularPadreEstudiante(User $padre, User $estudiante): void
    {
        if (!$padre->hijos()->where('estudiante_id', $estudiante->id)->exists()) {
            $padre->hijos()->attach($estudiante->id, [
                'relacion' => 'padre',
                'activo' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    /**
     * Obtener test vocacional RIASEC
     */
    private function obtenerTestVocacional(): ?TestVocacional
    {
        return TestVocacional::where('nombre', 'like', '%RIASEC%')
            ->where('activo', true)
            ->first();
    }

    /**
     * Generar respuestas coherentes al test
     * Crea un perfil INVESTIGADOR + SOCIAL (alto en Matemáticas, Ciencias, Liderazgo)
     */
    private function generarRespuestasCoherentes(TestVocacional $test): array
    {
        $respuestas = [];
        $categorias = $test->categorias()->with('preguntas')->get();

        $categoriaScores = [
            'realista' => 0.4,      // Bajo
            'investigador' => 0.9,  // Alto
            'artistico' => 0.3,     // Bajo
            'social' => 0.85,       // Alto
            'emprendedor' => 0.7,   // Medio-Alto
            'convencional' => 0.5,  // Medio
        ];

        foreach ($categorias as $categoria) {
            $nombreLower = strtolower(str_replace([' ', 'ó', 'Ó'], ['_', 'o', 'o'], $categoria->nombre ?? ''));
            $score = $categoriaScores[$nombreLower] ?? 0.5;

            // Generar respuestas para todas las preguntas de esta categoría
            foreach ($categoria->preguntas as $pregunta) {
                // Convertir score a respuesta: > 0.7 = verdadero, < 0.4 = falso, resto = neutral
                if ($score > 0.7) {
                    $respuesta = 'verdadero';
                } elseif ($score < 0.4) {
                    $respuesta = 'falso';
                } else {
                    $respuesta = 'neutral';
                }

                $respuestas[$pregunta->id] = $respuesta;
            }
        }

        return $respuestas;
    }

    /**
     * Crear resultado del test con respuestas
     */
    private function crearResultadoTest(User $estudiante, TestVocacional $test, array $respuestas): ResultadoTestVocacional
    {
        // Verificar si ya existe
        $existente = ResultadoTestVocacional::where('estudiante_id', $estudiante->id)
            ->where('test_vocacional_id', $test->id)
            ->first();

        if ($existente) {
            return $existente;
        }

        $resultado = ResultadoTestVocacional::create([
            'estudiante_id' => $estudiante->id,
            'test_vocacional_id' => $test->id,
            'respuestas' => json_encode($respuestas),
            'fecha_completacion' => now(),
            'puntuacion_total' => count(array_filter($respuestas, fn($r) => $r === 'verdadero')),
            'perfil_vocacional' => 'Investigador-Social',
            'recomendaciones' => json_encode([
                'Carrera predicha: Ingeniería Informática',
                'Carrera alternativa: Administración de Empresas',
                'Carrera alternativa: Psicología Educativa',
            ]),
        ]);

        return $resultado;
    }

    /**
     * Crear perfil vocacional con datos coherentes
     */
    private function crearPerfilVocacional(User $estudiante, ResultadoTestVocacional $resultado): PerfilVocacional
    {
        // Verificar si ya existe
        $existente = PerfilVocacional::where('estudiante_id', $estudiante->id)->first();
        if ($existente) {
            return $existente;
        }

        $perfil = PerfilVocacional::create([
            'estudiante_id' => $estudiante->id,
            'fecha_creacion' => now(),
            'fecha_actualizacion' => now(),
            'intereses' => json_encode([
                'investigador' => 90,
                'social' => 85,
                'emprendedor' => 70,
                'convencional' => 50,
                'artistico' => 30,
                'realista' => 40,
            ]),
            'personalidad' => json_encode([
                'analítico' => 'Alto',
                'líder' => 'Medio-Alto',
                'creativo' => 'Bajo',
                'detallista' => 'Alto',
                'flexible' => 'Medio',
            ]),
            'aptitudes' => json_encode([
                'razonamiento_logico' => 85,
                'comprension_verbal' => 80,
                'habilidades_numericas' => 88,
                'pensamiento_critico' => 82,
                'comunicacion' => 78,
            ]),
            'habilidades' => json_encode([
                'programacion' => 75,
                'analisis_datos' => 80,
                'liderazgo' => 72,
                'comunicacion_interpersonal' => 78,
                'resolucion_problemas' => 85,
            ]),
            'carrera_predicha_ml' => 'Ingeniería Informática',
            'confianza_prediccion' => 0.82,
            'recomendaciones_personalizadas' => json_encode([
                'sintesis_agente' => 'Carlos es un estudiante con fortalezas notables en pensamiento lógico y análisis. Sus intereses en investigación y liderazgo, combinados con habilidades numéricas excepcionales, lo posicionan perfectamente para carreras STEM. La Ingeniería Informática representa una excelente alineación con su perfil, permitiéndole aplicar su capacidad analítica en soluciones tecnológicas innovadoras.',
                'recomendaciones' => [
                    'Fortalecer programación en lenguajes modernos (Python, Java)',
                    'Participar en competencias de matemáticas y programación',
                    'Explorar especialidades en desarrollo web o inteligencia artificial',
                ],
                'pasos_siguientes' => [
                    'Semana 1-2: Investigar programas de Ingeniería Informática en universidades',
                    'Semana 3-4: Conectar con profesionales en tecnología e informática',
                    'Mes 2+: Tomar cursos introductorios de programación en línea',
                ],
                'fortalezas' => [
                    'Razonamiento lógico y analítico excepcional',
                    'Habilidades matemáticas sobresalientes',
                    'Capacidad de liderazgo y organización',
                ],
                'areas_mejora' => [
                    'Desarrollar habilidades de comunicación técnica',
                    'Mejorar capacidades de trabajo en equipo en proyectos',
                    'Profundizar en aplicaciones prácticas de la teoría',
                ],
                'fecha_generacion' => now()->toIso8601String(),
            ]),
        ]);

        return $perfil;
    }

    /**
     * Mostrar resumen de lo creado
     */
    private function mostrarResumen(User $estudiante, User $padre, User $profesor, PerfilVocacional $perfil): void
    {
        $this->command->info("\n");
        $this->command->info("═══════════════════════════════════════════════════════════");
        $this->command->info("📊 DATOS DE EJEMPLO CREADOS PARA EXPOSICIÓN");
        $this->command->info("═══════════════════════════════════════════════════════════");

        $this->command->info("\n👤 ESTUDIANTE:");
        $this->command->info("   Nombre: {$estudiante->nombre_completo}");
        $this->command->info("   Email: {$estudiante->email}");
        $this->command->info("   Usuario: {$estudiante->usernick}");
        $this->command->info("   Grado: {$estudiante->grado}to de Secundaria, Sección {$estudiante->seccion}");
        $this->command->info("   Matrícula: {$estudiante->numero_matricula}");

        $this->command->info("\n👨‍👩‍👧 PADRE/TUTOR:");
        $this->command->info("   Nombre: {$padre->nombre_completo}");
        $this->command->info("   Email: {$padre->email}");
        $this->command->info("   Teléfono: {$padre->telefono}");

        $this->command->info("\n👨‍🏫 PROFESOR/ORIENTADOR:");
        $this->command->info("   Nombre: {$profesor->nombre_completo}");
        $this->command->info("   Email: {$profesor->email}");
        $this->command->info("   Especialidad: {$profesor->especialidad}");

        $this->command->info("\n📋 PERFIL VOCACIONAL:");
        $this->command->info("   Tipo: RIASEC - Investigador/Social");
        $this->command->info("   Carrera Predicha: {$perfil->carrera_predicha_ml}");
        $this->command->info("   Confianza: " . ($perfil->confianza_prediccion * 100) . "%");

        $this->command->info("\n📝 CREDENCIALES DE ACCESO (Para pruebas):");
        $this->command->info("   Estudiante: {$estudiante->email} / password123");
        $this->command->info("   Padre: {$padre->email} / password123");
        $this->command->info("   Profesor: {$profesor->email} / password123");

        $this->command->info("\n═══════════════════════════════════════════════════════════\n");
        $this->command->info("✅ Datos listos para exposición!");
        $this->command->info("   Accede a: http://127.0.0.1:8000/vocacional");
        $this->command->info("═══════════════════════════════════════════════════════════\n");
    }
}
