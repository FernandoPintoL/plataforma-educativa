<?php

namespace Database\Seeders;

use App\Models\ModuloSidebar;
use App\Models\RoleModuloAcceso;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

/**
 * RoleModuloAccesoSeeder
 *
 * CONFIGURACIÓN DE QUÉ MÓDULOS VE CADA ROL
 *
 * Capa 3: Control de VISIBILIDAD en el UI/SIDEBAR
 * ============================================
 * Define explícitamente qué módulos verá cada rol en el menú lateral.
 *
 * Una entrada en role_modulo_acceso = El rol PUEDE VER ese módulo
 * Sin entrada = El rol NO PUEDE VER ese módulo
 *
 * SEPARACIÓN DE RESPONSABILIDADES:
 * - Esta tabla: ¿QUÉ MÓDULOS VE?
 * - Spatie Permission: ¿QUÉ PUEDE HACER?
 *
 * FLUJO:
 * 1. Usuario inicia sesión
 * 2. Middleware carga roles del usuario
 * 3. ModuloSidebar::obtenerParaSidebar() revisa role_modulo_acceso
 * 4. Filtra módulos que el usuario puede ver
 * 5. Frontend renderiza solo los módulos permitidos
 * 6. En rutas: Spatie verifica permisos (segunda capa de seguridad)
 */
class RoleModuloAccesoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener roles
        $admin = Role::where('name', 'admin')->first();
        $director = Role::where('name', 'director')->first();
        $profesor = Role::where('name', 'profesor')->first();
        $estudiante = Role::where('name', 'estudiante')->first();
        $padre = Role::where('name', 'padre')->first();
        $coordinador = Role::where('name', 'coordinador')->first();
        $tutor = Role::where('name', 'tutor')->first();

        // Obtener módulos por título (más fácil que IDs hardcodeadas)
        $modulosMap = ModuloSidebar::all()->keyBy('titulo');
        $todosTitulos = $modulosMap->keys()->toArray();

        // ==================== CONFIGURACIÓN POR ROL ====================

        // 1. ADMIN - Ve TODO
        if ($admin) {
            $this->asignarModulosARol($admin, $todosTitulos, 'Admin tiene acceso a todos los módulos');
        }

        // 2. DIRECTOR - Ve TODO excepto módulos específicos de personas
        if ($director) {
            $modulosDirector = [
                'Inicio',
                'Gestionar Estudiantes',    // ✅ PUEDE gestionar
                'Gestionar Profesores',     // ✅ PUEDE gestionar
                'Cursos',
                'Tareas',
                'Contenido Educativo',
                'Calificaciones',
                'Evaluaciones',
                'Recursos',
                'Entregas',
                'Reportes',
                'Administración',
            ];
            $this->asignarModulosARol($director, $modulosDirector, 'Director gestiona la institución');
        }

        // 3. PROFESOR - Ve sus propios cursos, tareas, estudiantes inscritos en SUS cursos
        if ($profesor) {
            $modulosProfesor = [
                'Inicio',
                'Tareas',                   // ✅ Crear/calificar sus tareas
                'Cursos',                   // ✅ Sus cursos
                'Calificaciones',           // ✅ Calificar
                'Evaluaciones',             // ✅ Crear evaluaciones
                'Contenido Educativo',      // ✅ Crear contenido
                'Recursos',                 // ✅ Subir recursos
                'Entregas',                 // ✅ Ver entregas
                'Reportes',                 // ✅ Ver reportes de sus cursos
            ];
            $this->asignarModulosARol($profesor, $modulosProfesor, 'Profesor enseña en cursos');
        }

        // 4. ESTUDIANTE - SOLO ve sus propios datos y contenido de cursos
        if ($estudiante) {
            $modulosEstudiante = [
                'Inicio',
                'Mi Perfil',                // ✅ Ver su perfil
                'Mis Cursos',               // ✅ Ver sus cursos inscritos
                'Tareas',                   // ✅ Ver y entregar tareas (NO crear)
                'Calificaciones',           // ✅ Ver calificaciones
                'Evaluaciones',             // ✅ Realizar evaluaciones
                'Contenido Educativo',      // ✅ Ver contenido publicado
                'Recursos',                 // ✅ Descargar recursos
                'Entregas',                 // ✅ Entregar trabajos
            ];
            $this->asignarModulosARol($estudiante, $modulosEstudiante, 'Estudiante accede a contenido educativo');
        }

        // 5. PADRE - Ve calificaciones y tareas de SUS HIJOS
        if ($padre) {
            $modulosPadre = [
                'Inicio',
                'Mi Perfil',                // ✅ Ver su perfil
                'Calificaciones',           // ✅ Ver calificaciones de hijos
                'Tareas',                   // ✅ Ver tareas de hijos
                'Contenido Educativo',      // ✅ Ver contenido de cursos de hijos
                'Recursos',                 // ✅ Descargar recursos
                'Entregas',                 // ✅ Ver entregas de hijos
            ];
            $this->asignarModulosARol($padre, $modulosPadre, 'Padre monitorea progreso de hijos');
        }

        // 6. COORDINADOR - Gestiona cursos y estudiantes inscritos
        if ($coordinador) {
            $modulosCoordinador = [
                'Inicio',
                'Gestionar Estudiantes',    // ✅ Inscribir en cursos
                'Cursos',                   // ✅ Gestionar cursos
                'Tareas',                   // ✅ Ver tareas
                'Calificaciones',           // ✅ Ver reportes de calificaciones
                'Evaluaciones',             // ✅ Ver evaluaciones
                'Contenido Educativo',      // ✅ Gestionar contenido
                'Recursos',                 // ✅ Gestionar recursos
                'Reportes',                 // ✅ Ver reportes
            ];
            $this->asignarModulosARol($coordinador, $modulosCoordinador, 'Coordinador organiza aspectos académicos');
        }

        // 7. TUTOR - Similar a padre, ve estudiantes asignados
        if ($tutor) {
            $modulosTutor = [
                'Inicio',
                'Mi Perfil',                // ✅ Ver su perfil
                'Calificaciones',           // ✅ Ver calificaciones
                'Tareas',                   // ✅ Ver tareas
                'Contenido Educativo',      // ✅ Ver contenido
                'Recursos',                 // ✅ Descargar recursos
            ];
            $this->asignarModulosARol($tutor, $modulosTutor, 'Tutor proporciona apoyo educativo');
        }
    }

    /**
     * Asignar módulos a un rol
     *
     * @param Role $role
     * @param array $titulosModulos Array de títulos de módulos
     * @param string $descripcion Descripción del acceso
     */
    private function asignarModulosARol(Role $role, array $titulosModulos, string $descripcion): void
    {
        // Obtener todos los módulos (principales y submodulos)
        $modulos = ModuloSidebar::whereIn('titulo', $titulosModulos)->get();

        foreach ($modulos as $modulo) {
            RoleModuloAcceso::firstOrCreate(
                [
                    'role_id' => $role->id,
                    'modulo_sidebar_id' => $modulo->id,
                ],
                [
                    'visible' => true,
                    'descripcion' => $descripcion,
                ]
            );
        }
    }
}
