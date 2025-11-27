<?php

namespace Database\Seeders;

use App\Models\Curso;
use App\Models\User;
use Illuminate\Database\Seeder;

class CursosSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n=== CREANDO ESTRUCTURA DE CURSOS PARA COLEGIO SECUNDARIO ===\n";

        // Obtener todos los profesores y estudiantes
        $profesores = User::where('tipo_usuario', 'profesor')->get();
        $estudiantes = User::where('tipo_usuario', 'estudiante')->get();

        if ($profesores->isEmpty() || $estudiantes->isEmpty()) {
            $this->command->warn('No hay profesores o estudiantes. Ejecuta UsersSeeder primero.');
            return;
        }

        // Estructura de cursos por nivel - SISTEMA EDUCATIVO BOLIVIANO (1° a 6° SECUNDARIA)
        $nivelesYMaterias = [
            1 => [
                ['nombre' => 'Matemáticas 1° Secundaria', 'codigo' => 'MAT-1°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Lenguaje y Literatura 1°', 'codigo' => 'LEN-1°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Ciencias Naturales 1°', 'codigo' => 'CN-1°', 'especialidad' => 'Ciencias Naturales'],
                ['nombre' => 'Estudios Sociales 1°', 'codigo' => 'ES-1°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés 1°', 'codigo' => 'ENG-1°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 1°', 'codigo' => 'EF-1°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Artes Plásticas 1°', 'codigo' => 'ART-1°', 'especialidad' => 'Artes'],
                ['nombre' => 'Tecnología e Informática 1°', 'codigo' => 'TEC-1°', 'especialidad' => 'Informática'],
            ],
            2 => [
                ['nombre' => 'Matemáticas 2° Secundaria', 'codigo' => 'MAT-2°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Lenguaje y Literatura 2°', 'codigo' => 'LEN-2°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Biología 2°', 'codigo' => 'BIO-2°', 'especialidad' => 'Biología'],
                ['nombre' => 'Historia de Bolivia 2°', 'codigo' => 'HB-2°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Geografía 2°', 'codigo' => 'GEO-2°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés 2°', 'codigo' => 'ENG-2°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 2°', 'codigo' => 'EF-2°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Música 2°', 'codigo' => 'MUS-2°', 'especialidad' => 'Música'],
            ],
            3 => [
                ['nombre' => 'Matemáticas 3° Secundaria', 'codigo' => 'MAT-3°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Lenguaje y Literatura 3°', 'codigo' => 'LEN-3°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Química 3°', 'codigo' => 'QUI-3°', 'especialidad' => 'Química'],
                ['nombre' => 'Física 3°', 'codigo' => 'FIS-3°', 'especialidad' => 'Física'],
                ['nombre' => 'Historia Universal 3°', 'codigo' => 'HU-3°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés 3°', 'codigo' => 'ENG-3°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 3°', 'codigo' => 'EF-3°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Civismo 3°', 'codigo' => 'CIV-3°', 'especialidad' => 'Ciencias Sociales'],
            ],
            4 => [
                ['nombre' => 'Matemáticas 4° Secundaria', 'codigo' => 'MAT-4°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Lenguaje y Literatura 4°', 'codigo' => 'LEN-4°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Biología Aplicada 4°', 'codigo' => 'BIA-4°', 'especialidad' => 'Biología'],
                ['nombre' => 'Química Aplicada 4°', 'codigo' => 'QUA-4°', 'especialidad' => 'Química'],
                ['nombre' => 'Filosofía 4°', 'codigo' => 'FIL-4°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés 4°', 'codigo' => 'ENG-4°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 4°', 'codigo' => 'EF-4°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Tecnología 4°', 'codigo' => 'TEC-4°', 'especialidad' => 'Informática'],
            ],
            5 => [
                ['nombre' => 'Cálculo 5° Secundaria', 'codigo' => 'CAL-5°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Literatura Boliviana 5°', 'codigo' => 'LB-5°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Física Avanzada 5°', 'codigo' => 'FIS-5°', 'especialidad' => 'Física'],
                ['nombre' => 'Química Orgánica 5°', 'codigo' => 'QUO-5°', 'especialidad' => 'Química'],
                ['nombre' => 'Historia Económica y Social 5°', 'codigo' => 'HES-5°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés Avanzado 5°', 'codigo' => 'ENG-5°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 5°', 'codigo' => 'EF-5°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Derecho Constitucional 5°', 'codigo' => 'DER-5°', 'especialidad' => 'Ciencias Sociales'],
            ],
            6 => [
                ['nombre' => 'Matemáticas Avanzadas 6° Secundaria', 'codigo' => 'MAV-6°', 'especialidad' => 'Matemáticas'],
                ['nombre' => 'Literatura Contemporánea 6°', 'codigo' => 'LC-6°', 'especialidad' => 'Lenguaje y Literatura'],
                ['nombre' => 'Astrofísica 6°', 'codigo' => 'AST-6°', 'especialidad' => 'Física'],
                ['nombre' => 'Bioquímica 6°', 'codigo' => 'BQU-6°', 'especialidad' => 'Química'],
                ['nombre' => 'Economía Política 6°', 'codigo' => 'ECP-6°', 'especialidad' => 'Ciencias Sociales'],
                ['nombre' => 'Inglés Profesional 6°', 'codigo' => 'ENG-6°', 'especialidad' => 'Inglés'],
                ['nombre' => 'Educación Física 6°', 'codigo' => 'EF-6°', 'especialidad' => 'Educación Física'],
                ['nombre' => 'Ética y Realidad Nacional 6°', 'codigo' => 'ERN-6°', 'especialidad' => 'Ciencias Sociales'],
            ],
        ];

        $cursosCreados = 0;
        $estudiantesInscritos = 0;

        // Crear cursos por nivel
        foreach ($nivelesYMaterias as $nivel => $materias) {
            echo "\n📚 Creando cursos para {$nivel}° Secundaria...\n";

            foreach ($materias as $materia) {
                // Obtener profesor con especialidad coincidente
                $profesor = $profesores
                    ->where('especialidad', $materia['especialidad'])
                    ->random();

                // Verificar si curso ya existe
                $cursoExistente = Curso::where('codigo', $materia['codigo'])->first();
                if ($cursoExistente) {
                    echo "  ✓ Curso {$materia['codigo']} ya existe\n";
                    continue;
                }

                // Crear curso
                $curso = Curso::create([
                    'nombre' => $materia['nombre'],
                    'descripcion' => "Curso de {$materia['especialidad']} para grado {$nivel}°. Desarrollo de competencias fundamentales en el área.",
                    'profesor_id' => $profesor->id,
                    'codigo' => $materia['codigo'],
                    'estado' => 'activo',
                    'fecha_inicio' => now(),
                    'fecha_fin' => now()->addMonths(9),
                    'capacidad_maxima' => 35,
                ]);

                echo "  ✓ Creado: {$materia['nombre']} (Prof. {$profesor->name})\n";
                $cursosCreados++;

                // Inscribir estudiantes del mismo nivel
                $estudiantesDelNivel = $estudiantes->filter(function ($est) use ($nivel) {
                    return $est->grado == $nivel;
                })->shuffle();

                // Inscribir 20-30 estudiantes por curso
                $cantidadAInscribir = min(28, $estudiantesDelNivel->count());
                foreach ($estudiantesDelNivel->take($cantidadAInscribir) as $estudiante) {
                    if (!$curso->tieneEstudiante($estudiante)) {
                        $curso->inscribirEstudiante($estudiante);
                        $estudiantesInscritos++;
                    }
                }

                echo "    └─ {$cantidadAInscribir} estudiantes inscritos\n";
            }
        }

        echo "\n✅ RESUMEN DE CURSOS CREADOS (SISTEMA EDUCATIVO BOLIVIANO):\n";
        echo "  • Total de cursos: {$cursosCreados}\n";
        echo "  • Total de inscripciones: {$estudiantesInscritos}\n";
        echo "  • Niveles cubiertos: 1° a 6° Secundaria\n";
        echo "  • Materias por nivel: 8\n";
        echo "  • Total de materias: 48\n";
        echo "  • Profesores asignados por especialidad\n";
        echo "  • ~25-28 estudiantes por curso\n\n";
    }
}
