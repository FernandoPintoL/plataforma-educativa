<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CarrerasRiasecProfileSeeder extends Seeder
{
    /**
     * Seed career-RIASEC profile mappings
     * Maps careers to ideal RIASEC profiles for ML training
     */
    public function run(): void
    {
        echo "\n=== MAPEANDO CARRERAS CON PERFILES RIASEC ===\n\n";

        $carreras_perfiles = [
            // CARRERAS TÉCNICAS/INGENIERÍAS (R, I dominante)
            [
                'nombre' => 'Ingeniería en Sistemas',
                'descripcion' => 'Desarrollo de software, bases de datos, ciberseguridad',
                'nivel_educativo' => 'ingenieria',
                'duracion_anos' => 5,
                'areas_conocimiento' => ['Tecnología', 'Programación', 'Sistemas', 'Informática'],
                'perfil_ideal' => [
                    'Realista' => 4.2,
                    'Investigador' => 4.3,
                    'Artístico' => 2.1,
                    'Social' => 2.0,
                    'Empresarial' => 2.5,
                    'Convencional' => 3.8,
                ],
                'oportunidades_laborales' => ['Desarrollador', 'Ingeniero de Software', 'Analista', 'DevOps'],
            ],
            [
                'nombre' => 'Ingeniería Civil',
                'descripcion' => 'Diseño y construcción de infraestructuras',
                'nivel_educativo' => 'ingenieria',
                'duracion_anos' => 5,
                'areas_conocimiento' => ['Construcción', 'Estructuras', 'Proyectos', 'Materiales'],
                'perfil_ideal' => [
                    'Realista' => 4.5,
                    'Investigador' => 3.8,
                    'Artístico' => 1.8,
                    'Social' => 2.2,
                    'Empresarial' => 3.0,
                    'Convencional' => 3.6,
                ],
                'oportunidades_laborales' => ['Ingeniero de Proyecto', 'Supervisor', 'Consultor Técnico'],
            ],
            [
                'nombre' => 'Ingeniería Mecánica',
                'descripcion' => 'Máquinas, motores, sistemas mecánicos',
                'nivel_educativo' => 'ingenieria',
                'duracion_anos' => 5,
                'areas_conocimiento' => ['Mecánica', 'Diseño', 'Manufactura', 'Termodinámica'],
                'perfil_ideal' => [
                    'Realista' => 4.3,
                    'Investigador' => 4.0,
                    'Artístico' => 2.5,
                    'Social' => 1.8,
                    'Empresarial' => 2.6,
                    'Convencional' => 3.5,
                ],
                'oportunidades_laborales' => ['Diseñador', 'Ingeniero de Planta', 'Técnico Especializado'],
            ],
            [
                'nombre' => 'Ingeniería Industrial',
                'descripcion' => 'Optimización de procesos, productividad',
                'nivel_educativo' => 'ingenieria',
                'duracion_anos' => 5,
                'areas_conocimiento' => ['Procesos', 'Logística', 'Calidad', 'Eficiencia'],
                'perfil_ideal' => [
                    'Realista' => 3.5,
                    'Investigador' => 3.8,
                    'Artístico' => 1.9,
                    'Social' => 2.8,
                    'Empresarial' => 4.0,
                    'Convencional' => 4.1,
                ],
                'oportunidades_laborales' => ['Analista de Procesos', 'Coordinador de Logística', 'Jefe de Producción'],
            ],
            [
                'nombre' => 'Técnico en Electrónica',
                'descripcion' => 'Reparación y mantenimiento de dispositivos electrónicos',
                'nivel_educativo' => 'tecnico',
                'duracion_anos' => 2.5,
                'areas_conocimiento' => ['Electrónica', 'Reparación', 'Circuitos', 'Tecnología'],
                'perfil_ideal' => [
                    'Realista' => 4.6,
                    'Investigador' => 3.5,
                    'Artístico' => 1.5,
                    'Social' => 1.8,
                    'Empresarial' => 2.0,
                    'Convencional' => 3.3,
                ],
                'oportunidades_laborales' => ['Técnico de Reparación', 'Especialista en Mantenimiento'],
            ],

            // CARRERAS CIENTÍFICAS (I dominante)
            [
                'nombre' => 'Licenciatura en Física',
                'descripcion' => 'Investigación de fenómenos físicos naturales',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Física', 'Investigación', 'Teoría', 'Ciencia'],
                'perfil_ideal' => [
                    'Realista' => 3.0,
                    'Investigador' => 4.6,
                    'Artístico' => 2.0,
                    'Social' => 2.1,
                    'Empresarial' => 1.8,
                    'Convencional' => 3.2,
                ],
                'oportunidades_laborales' => ['Investigador', 'Profesor Universitario', 'Científico'],
            ],
            [
                'nombre' => 'Licenciatura en Química',
                'descripcion' => 'Estudio de sustancias y reacciones químicas',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Química', 'Análisis', 'Laboratorio', 'Investigación'],
                'perfil_ideal' => [
                    'Realista' => 3.5,
                    'Investigador' => 4.5,
                    'Artístico' => 1.8,
                    'Social' => 2.0,
                    'Empresarial' => 2.2,
                    'Convencional' => 3.9,
                ],
                'oportunidades_laborales' => ['Químico Analista', 'Investigador', 'Técnico de Laboratorio'],
            ],
            [
                'nombre' => 'Licenciatura en Biología',
                'descripcion' => 'Estudio de organismos vivientes y ecosistemas',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Biología', 'Investigación', 'Naturaleza', 'Salud'],
                'perfil_ideal' => [
                    'Realista' => 3.2,
                    'Investigador' => 4.4,
                    'Artístico' => 2.5,
                    'Social' => 3.0,
                    'Empresarial' => 1.9,
                    'Convencional' => 3.1,
                ],
                'oportunidades_laborales' => ['Biólogo', 'Investigador', 'Profesor', 'Consultor Ambiental'],
            ],
            [
                'nombre' => 'Licenciatura en Matemáticas',
                'descripcion' => 'Teoría y aplicación de conceptos matemáticos',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Matemáticas', 'Teoría', 'Análisis', 'Computación'],
                'perfil_ideal' => [
                    'Realista' => 2.8,
                    'Investigador' => 4.7,
                    'Artístico' => 2.2,
                    'Social' => 2.0,
                    'Empresarial' => 2.0,
                    'Convencional' => 4.0,
                ],
                'oportunidades_laborales' => ['Matemático', 'Actuario', 'Profesor', 'Analista de Datos'],
            ],

            // CARRERAS CREATIVAS/ARTÍSTICAS (A dominante)
            [
                'nombre' => 'Licenciatura en Artes Visuales',
                'descripcion' => 'Pintura, escultura, instalación y artes plásticas',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Arte', 'Diseño', 'Creatividad', 'Expresión'],
                'perfil_ideal' => [
                    'Realista' => 2.0,
                    'Investigador' => 2.5,
                    'Artístico' => 4.7,
                    'Social' => 3.0,
                    'Empresarial' => 2.0,
                    'Convencional' => 1.5,
                ],
                'oportunidades_laborales' => ['Artista', 'Profesor de Arte', 'Curador'],
            ],
            [
                'nombre' => 'Diseño Gráfico',
                'descripcion' => 'Diseño visual, comunicación gráfica, multimedia',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Diseño', 'Comunicación Visual', 'Tecnología', 'Arte'],
                'perfil_ideal' => [
                    'Realista' => 2.3,
                    'Investigador' => 2.8,
                    'Artístico' => 4.5,
                    'Social' => 3.2,
                    'Empresarial' => 3.0,
                    'Convencional' => 2.8,
                ],
                'oportunidades_laborales' => ['Diseñador', 'Art Director', 'Publicista', 'Web Designer'],
            ],
            [
                'nombre' => 'Licenciatura en Música',
                'descripcion' => 'Teoría musical, composición, interpretación',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Música', 'Composición', 'Interpretación', 'Arte'],
                'perfil_ideal' => [
                    'Realista' => 1.8,
                    'Investigador' => 2.6,
                    'Artístico' => 4.8,
                    'Social' => 3.5,
                    'Empresarial' => 2.2,
                    'Convencional' => 2.0,
                ],
                'oportunidades_laborales' => ['Músico', 'Compositor', 'Profesor de Música', 'Productor'],
            ],
            [
                'nombre' => 'Cine y Audiovisual',
                'descripcion' => 'Producción de cine, video y contenido audiovisual',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Cine', 'Audiovisual', 'Producción', 'Dirección'],
                'perfil_ideal' => [
                    'Realista' => 2.5,
                    'Investigador' => 2.7,
                    'Artístico' => 4.6,
                    'Social' => 3.1,
                    'Empresarial' => 2.8,
                    'Convencional' => 2.3,
                ],
                'oportunidades_laborales' => ['Director', 'Productor', 'Camarógrafo', 'Editor'],
            ],
            [
                'nombre' => 'Escritura Creativa',
                'descripcion' => 'Novela, cuento, poesía y otras formas literarias',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Literatura', 'Escritura', 'Creatividad', 'Comunicación'],
                'perfil_ideal' => [
                    'Realista' => 1.6,
                    'Investigador' => 2.9,
                    'Artístico' => 4.6,
                    'Social' => 3.2,
                    'Empresarial' => 2.1,
                    'Convencional' => 2.2,
                ],
                'oportunidades_laborales' => ['Escritor', 'Editor', 'Periodista', 'Profesor'],
            ],

            // CARRERAS SOCIALES (S dominante)
            [
                'nombre' => 'Licenciatura en Educación',
                'descripcion' => 'Formación de docentes, pedagogía, didáctica',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Educación', 'Pedagogía', 'Enseñanza', 'Desarrollo Humano'],
                'perfil_ideal' => [
                    'Realista' => 1.9,
                    'Investigador' => 3.2,
                    'Artístico' => 2.8,
                    'Social' => 4.5,
                    'Empresarial' => 2.6,
                    'Convencional' => 3.2,
                ],
                'oportunidades_laborales' => ['Profesor', 'Diseñador Instruccional', 'Capacitador'],
            ],
            [
                'nombre' => 'Psicología',
                'descripcion' => 'Estudio del comportamiento y mente humana',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 5,
                'areas_conocimiento' => ['Psicología', 'Salud Mental', 'Comportamiento', 'Investigación'],
                'perfil_ideal' => [
                    'Realista' => 2.0,
                    'Investigador' => 3.8,
                    'Artístico' => 2.6,
                    'Social' => 4.6,
                    'Empresarial' => 2.3,
                    'Convencional' => 3.0,
                ],
                'oportunidades_laborales' => ['Psicólogo Clínico', 'Recursos Humanos', 'Orientador'],
            ],
            [
                'nombre' => 'Trabajo Social',
                'descripcion' => 'Asistencia y bienestar de comunidades',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Trabajo Social', 'Bienestar', 'Comunidad', 'Desarrollo'],
                'perfil_ideal' => [
                    'Realista' => 2.2,
                    'Investigador' => 2.9,
                    'Artístico' => 2.4,
                    'Social' => 4.7,
                    'Empresarial' => 2.2,
                    'Convencional' => 2.8,
                ],
                'oportunidades_laborales' => ['Trabajador Social', 'Gestor Comunitario', 'Asesor'],
            ],
            [
                'nombre' => 'Enfermería',
                'descripcion' => 'Cuidado y atención sanitaria a pacientes',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Salud', 'Medicina', 'Cuidado', 'Investigación Clínica'],
                'perfil_ideal' => [
                    'Realista' => 3.0,
                    'Investigador' => 3.3,
                    'Artístico' => 2.0,
                    'Social' => 4.6,
                    'Empresarial' => 2.0,
                    'Convencional' => 3.8,
                ],
                'oportunidades_laborales' => ['Enfermero', 'Especialista en Salud', 'Docente Sanitario'],
            ],
            [
                'nombre' => 'Medicina',
                'descripcion' => 'Diagnóstico, tratamiento y prevención de enfermedades',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 6,
                'areas_conocimiento' => ['Medicina', 'Salud', 'Investigación Médica', 'Cuidado'],
                'perfil_ideal' => [
                    'Realista' => 3.5,
                    'Investigador' => 4.0,
                    'Artístico' => 1.8,
                    'Social' => 4.3,
                    'Empresarial' => 2.2,
                    'Convencional' => 3.5,
                ],
                'oportunidades_laborales' => ['Médico', 'Cirujano', 'Especialista', 'Investigador Médico'],
            ],

            // CARRERAS EMPRESARIALES (E dominante)
            [
                'nombre' => 'Administración de Empresas',
                'descripcion' => 'Gestión empresarial, recursos y estrategia',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Administración', 'Gestión', 'Negocios', 'Estrategia'],
                'perfil_ideal' => [
                    'Realista' => 2.5,
                    'Investigador' => 2.8,
                    'Artístico' => 1.9,
                    'Social' => 3.8,
                    'Empresarial' => 4.5,
                    'Convencional' => 3.8,
                ],
                'oportunidades_laborales' => ['Gerente', 'Analista Empresarial', 'Consultor', 'Emprendedor'],
            ],
            [
                'nombre' => 'Marketing',
                'descripcion' => 'Estrategias de mercado, publicidad, comunicación comercial',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Marketing', 'Comunicación', 'Publicidad', 'Negocios'],
                'perfil_ideal' => [
                    'Realista' => 2.2,
                    'Investigador' => 2.9,
                    'Artístico' => 3.2,
                    'Social' => 4.0,
                    'Empresarial' => 4.3,
                    'Convencional' => 2.9,
                ],
                'oportunidades_laborales' => ['Gerente de Marketing', 'Publicista', 'Community Manager', 'Especialista Digital'],
            ],
            [
                'nombre' => 'Economía',
                'descripcion' => 'Análisis económico, política y sistemas financieros',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Economía', 'Finanzas', 'Análisis', 'Política Económica'],
                'perfil_ideal' => [
                    'Realista' => 2.3,
                    'Investigador' => 4.0,
                    'Artístico' => 1.6,
                    'Social' => 2.8,
                    'Empresarial' => 3.9,
                    'Convencional' => 4.1,
                ],
                'oportunidades_laborales' => ['Economista', 'Analista Financiero', 'Asesor Económico'],
            ],

            // CARRERAS CONVENCIONALES (C dominante)
            [
                'nombre' => 'Contabilidad',
                'descripcion' => 'Registros contables, auditoría y gestión financiera',
                'nivel_educativo' => 'licenciatura',
                'duracion_anos' => 4,
                'areas_conocimiento' => ['Contabilidad', 'Finanzas', 'Auditoría', 'Impuestos'],
                'perfil_ideal' => [
                    'Realista' => 2.4,
                    'Investigador' => 2.7,
                    'Artístico' => 1.4,
                    'Social' => 2.3,
                    'Empresarial' => 3.0,
                    'Convencional' => 4.6,
                ],
                'oportunidades_laborales' => ['Contador', 'Auditor', 'Asesor Fiscal', 'Analista Financiero'],
            ],
            [
                'nombre' => 'Secretariado Ejecutivo',
                'descripcion' => 'Apoyo administrativo, organizacion y comunicación empresarial',
                'nivel_educativo' => 'tecnico_superior',
                'duracion_anos' => 3,
                'areas_conocimiento' => ['Administración', 'Secretariado', 'Organización', 'Comunicación'],
                'perfil_ideal' => [
                    'Realista' => 2.0,
                    'Investigador' => 2.1,
                    'Artístico' => 1.8,
                    'Social' => 3.4,
                    'Empresarial' => 2.7,
                    'Convencional' => 4.5,
                ],
                'oportunidades_laborales' => ['Secretario Ejecutivo', 'Asistente Administrativo', 'Coordinador'],
            ],
            [
                'nombre' => 'Gestión Administrativa',
                'descripcion' => 'Administración de recursos, procesos y documentación',
                'nivel_educativo' => 'tecnico',
                'duracion_anos' => 2,
                'areas_conocimiento' => ['Administración', 'Gestión', 'Documentación', 'Organización'],
                'perfil_ideal' => [
                    'Realista' => 2.2,
                    'Investigador' => 2.3,
                    'Artístico' => 1.5,
                    'Social' => 2.8,
                    'Empresarial' => 2.5,
                    'Convencional' => 4.4,
                ],
                'oportunidades_laborales' => ['Técnico Administrativo', 'Gestor de Trámites'],
            ],
        ];

        $creadas = 0;
        foreach ($carreras_perfiles as $carrera_data) {
            // Check if career already exists
            $existe = DB::table('carreras')
                ->where('nombre', $carrera_data['nombre'])
                ->exists();

            if (!$existe) {
                DB::table('carreras')->insert([
                    'nombre' => $carrera_data['nombre'],
                    'descripcion' => $carrera_data['descripcion'],
                    'nivel_educativo' => $carrera_data['nivel_educativo'],
                    'duracion_anos' => $carrera_data['duracion_anos'],
                    'areas_conocimiento' => json_encode($carrera_data['areas_conocimiento']),
                    'perfil_ideal' => json_encode($carrera_data['perfil_ideal']),
                    'oportunidades_laborales' => json_encode($carrera_data['oportunidades_laborales']),
                    'activo' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $creadas++;
                echo "  ✓ {$carrera_data['nombre']}\n";
            }
        }

        echo "\n✅ CARRERAS CON PERFILES RIASEC MAPEADAS EXITOSAMENTE\n";
        echo "Total creadas: {$creadas}\n";
        echo "Total carreras en BD: " . DB::table('carreras')->count() . "\n\n";
    }
}
