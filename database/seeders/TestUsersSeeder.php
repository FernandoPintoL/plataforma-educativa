<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Curso;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class TestUsersSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n=== CREANDO USUARIOS DE PRUEBA ===\n\n";

        // CREAR DIRECTOR1
        echo "👤 Creando director1...\n";
        $director = User::updateOrCreate(
            ['email' => 'director1@educativa.local'],
            [
                'name' => 'director1',
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'director',
                'email_verified_at' => now(),
            ]
        );
        echo "   ✓ Director creado (ID: {$director->id})\n";

        // CREAR PROFESOR1
        echo "👤 Creando profesor1...\n";
        $profesor = User::updateOrCreate(
            ['email' => 'profesor1@educativa.local'],
            [
                'name' => 'profesor1',
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'profesor',
                'email_verified_at' => now(),
            ]
        );
        echo "   ✓ Profesor creado (ID: {$profesor->id})\n";

        // CREAR PADRE1
        echo "👤 Creando padre1...\n";
        $padre = User::updateOrCreate(
            ['email' => 'padre1@educativa.local'],
            [
                'name' => 'padre1',
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'padre',
                'email_verified_at' => now(),
            ]
        );
        echo "   ✓ Padre creado (ID: {$padre->id})\n";

        // CREAR ESTUDIANTE1
        echo "👤 Creando estudiante1...\n";
        $estudiante = User::updateOrCreate(
            ['email' => 'estudiante1@educativa.local'],
            [
                'name' => 'estudiante1',
                'password' => Hash::make('password123'),
                'tipo_usuario' => 'estudiante',
                'email_verified_at' => now(),
                'desempeño_promedio' => 85.5,
                'asistencia_porcentaje' => 85.0,
            ]
        );
        echo "   ✓ Estudiante creado (ID: {$estudiante->id})\n";

        // OBTENER O CREAR CURSOS
        echo "\n📚 Asignando cursos...\n";
        $cursos = Curso::where('profesor_id', $profesor->id)->take(2)->get();

        if ($cursos->count() == 0) {
            echo "   ⚠️ Creando cursos de prueba...\n";
            $cursos = collect();
            for ($i = 1; $i <= 2; $i++) {
                $curso = Curso::create([
                    'nombre' => "Curso Prueba $i",
                    'descripcion' => "Curso de prueba para testing del sistema ML",
                    'profesor_id' => $profesor->id,
                    'codigo' => "PRUEBA-" . str_pad($i, 3, '0', STR_PAD_LEFT),
                    'estado' => 'activo',
                    'capacidad_maxima' => 50,
                    'fecha_inicio' => now()->startOfDay(),
                    'fecha_fin' => now()->addMonths(4)->endOfDay(),
                ]);
                $cursos->push($curso);
            }
        }

        // ASIGNAR CURSOS A ESTUDIANTE
        echo "   • Asignando cursos a estudiante1...\n";
        foreach ($cursos as $curso) {
            DB::table('curso_estudiante')->updateOrInsert(
                ['curso_id' => $curso->id, 'estudiante_id' => $estudiante->id],
                ['estado' => 'activo', 'fecha_inscripcion' => now()->format('Y-m-d')]
            );
        }
        echo "   ✓ {$cursos->count()} cursos asignados\n";

        // CREAR DATOS DE RENDIMIENTO ACADÉMICO
        echo "\n📊 Creando datos de rendimiento académico...\n";
        DB::table('rendimiento_academico')->updateOrInsert(
            ['estudiante_id' => $estudiante->id],
            [
                'materias' => json_encode(['Matemáticas', 'Lenguaje', 'Historia', 'Ciencias']),
                'promedio' => 85.5,
                'fortalezas' => json_encode(['Pensamiento Analítico', 'Comunicación', 'Resolución de Problemas']),
                'debilidades' => json_encode(['Gestión del Tiempo', 'Concentración Sostenida']),
                'tendencia_temporal' => 'mejora_gradual',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        echo "   ✓ Datos de rendimiento creados\n";

        // CREAR PREDICCIONES DE RIESGO
        echo "\n⚠️ Creando predicciones de riesgo...\n";
        $riesgosCreados = 0;
        foreach ($cursos as $curso) {
            DB::table('predicciones_riesgo')->updateOrInsert(
                [
                    'estudiante_id' => $estudiante->id,
                    'fk_curso_id' => $curso->id,
                ],
                [
                    'score_riesgo' => rand(15, 35) / 100,
                    'nivel_riesgo' => 'bajo',
                    'confianza' => rand(75, 95) / 100,
                    'fecha_prediccion' => now(),
                    'modelo_version' => '1.0',
                    'factores_influyentes' => json_encode([
                        'asistencia' => 'buena',
                        'calificaciones' => 'consistentes',
                        'participacion' => 'regular'
                    ]),
                    'observaciones' => 'Estudiante muestra desempeño estable',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $riesgosCreados++;
        }
        echo "   ✓ $riesgosCreados predicciones de riesgo creadas\n";

        // CREAR PREDICCIONES DE CARRERA
        echo "\n🎯 Creando predicciones de carrera...\n";
        $carrerasCandidatas = ['Ingeniería en Sistemas', 'Administración de Empresas', 'Psicología'];
        DB::table('predicciones_carrera')->updateOrInsert(
            ['estudiante_id' => $estudiante->id, 'carrera_nombre' => $carrerasCandidatas[0]],
            [
                'compatibilidad' => rand(75, 95) / 100,
                'ranking' => 1,
                'descripcion' => 'Alta compatibilidad basada en habilidades analíticas',
                'fecha_prediccion' => now(),
                'modelo_version' => '1.0',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        echo "   ✓ Predicción de carrera creada\n";

        // CREAR PREDICCIONES DE PROGRESO
        echo "\n📈 Creando predicciones de progreso...\n";
        DB::table('predicciones_progreso')->updateOrInsert(
            ['estudiante_id' => $estudiante->id],
            [
                'nota_proyectada' => 86.5,
                'velocidad_aprendizaje' => 0.87,
                'tendencia_progreso' => 'ascendente',
                'confianza_prediccion' => 0.82,
                'semanas_analizadas' => 12,
                'varianza_notas' => 2.5,
                'promedio_historico' => 85.2,
                'modelo_tipo' => 'lstm',
                'modelo_version' => '1.0',
                'features_usado' => json_encode(['asistencia', 'tareas', 'participacion']),
                'fecha_prediccion' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        echo "   ✓ Predicción de progreso creada\n";

        // CREAR PREDICCIONES DE TENDENCIA
        echo "\n📊 Creando predicciones de tendencia...\n";
        $tendenciasCreadas = 0;
        foreach ($cursos as $curso) {
            DB::table('predicciones_tendencia')->updateOrInsert(
                [
                    'estudiante_id' => $estudiante->id,
                    'fk_curso_id' => $curso->id,
                ],
                [
                    'tendencia' => 'estable',
                    'confianza' => rand(80, 95) / 100,
                    'fecha_prediccion' => now(),
                    'modelo_version' => '1.0',
                    'created_at' => now(),
                    'updated_at' => now(),
                ]
            );
            $tendenciasCreadas++;
        }
        echo "   ✓ $tendenciasCreadas predicciones de tendencia creadas\n";

        // CREAR ASIGNACIÓN A CLUSTERS
        echo "\n🎯 Creando asignación a clusters...\n";
        DB::table('student_clusters')->updateOrInsert(
            ['estudiante_id' => $estudiante->id],
            [
                'cluster_id' => 2,
                'cluster_distance' => 0.45,
                'membership_probabilities' => json_encode([0.65, 0.25, 0.10]),
                'cluster_profile' => json_encode([
                    'nombre' => 'Estudiantes de Desempeño Estable',
                    'caracteristicas' => ['asistencia regular', 'calificaciones consistentes', 'participación moderada']
                ]),
                'cluster_interpretation' => 'Grupo de estudiantes con rendimiento consistente y predecible',
                'modelo_tipo' => 'kmeans',
                'modelo_version' => '1.0',
                'n_clusters_usado' => 3,
                'fecha_asignacion' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
        echo "   ✓ Asignación a cluster creada\n";

        // RESUMEN
        echo "\n" . str_repeat("=", 70) . "\n";
        echo "✅ USUARIOS DE PRUEBA CREADOS EXITOSAMENTE\n";
        echo str_repeat("=", 70) . "\n\n";

        echo "👥 CREDENCIALES DE PRUEBA:\n\n";
        echo "1️⃣ DIRECTOR:\n";
        echo "   Email: director1@educativa.local\n";
        echo "   Pass:  password123\n";
        echo "   Rol:   director\n\n";

        echo "2️⃣ PROFESOR:\n";
        echo "   Email: profesor1@educativa.local\n";
        echo "   Pass:  password123\n";
        echo "   Rol:   profesor\n";
        echo "   Cursos: {$cursos->count()}\n\n";

        echo "3️⃣ ESTUDIANTE:\n";
        echo "   Email: estudiante1@educativa.local\n";
        echo "   Pass:  password123\n";
        echo "   Rol:   estudiante\n";
        echo "   ID:    {$estudiante->id}\n\n";

        echo "4️⃣ PADRE:\n";
        echo "   Email: padre1@educativa.local\n";
        echo "   Pass:  password123\n";
        echo "   Rol:   padre\n\n";

        echo "📊 DATOS PARA TESTING ML:\n";
        echo "   ✓ Rendimiento académico: creado\n";
        echo "   ✓ Predicciones de riesgo: $riesgosCreados registros\n";
        echo "   ✓ Predicciones de carrera: 1 carrera candidata\n";
        echo "   ✓ Predicciones de progreso: creada\n";
        echo "   ✓ Predicciones de tendencia: $tendenciasCreadas registros\n";
        echo "   ✓ Asignación a clusters: creada\n";
        echo "   ✓ Status: ✅ LISTO PARA ML TESTING\n\n";

        echo "🧪 PARA PRUEBAS:\n";
        echo "   • Usa profesor1 para ver análisis de estudiante1\n";
        echo "   • El estudiante1 tiene datos ML completos\n";
        echo "   • Endpoint: GET /api/ml/student/{$estudiante->id}/analysis\n\n";
    }
}
