<?php
namespace Database\Seeders;

use Spatie\Permission\Models\Permission;
use Illuminate\Database\Seeder;

/**
 * PermisosUnificadosSeeder
 * 
 * Consolida TODOS los permisos necesarios en la plataforma
 * Agrupa los permisos en categorías para mayor claridad
 */
class PermisosUnificadosSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n=== CREANDO TODOS LOS PERMISOS UNIFICADOS ===\n\n";

        // Lista consolidada de TODOS los permisos de la plataforma
        $permisos = [
            // ==================== ESTUDIANTES ====================
            'estudiantes.index',
            'estudiantes.create',
            'estudiantes.store',
            'estudiantes.show',
            'estudiantes.edit',
            'estudiantes.update',
            'estudiantes.destroy',
            'estudiantes.inscripciones',
            'estudiantes.historial',
            'ver-estudiantes',
            'gestionar-estudiantes',

            // ==================== PROFESORES ====================
            'profesores.index',
            'profesores.create',
            'profesores.store',
            'profesores.show',
            'profesores.edit',
            'profesores.update',
            'profesores.destroy',
            'profesores.asignaciones',
            'gestionar-profesores',

            // ==================== CURSOS ====================
            'cursos.index',
            'cursos.create',
            'cursos.store',
            'cursos.show',
            'cursos.edit',
            'cursos.update',
            'cursos.destroy',
            'cursos.horarios',
            'cursos.inscribir-estudiante',
            'cursos.asignar-profesor',
            'cursos.ver',
            'cursos.gestionar_estudiantes',
            'ver-mis-cursos',

            // ==================== TAREAS ====================
            'tareas.index',
            'tareas.create',
            'tareas.store',
            'tareas.show',
            'tareas.edit',
            'tareas.update',
            'tareas.destroy',
            'tareas.entregas',
            'tareas.calificar',
            'tareas.entregar',
            'tareas.asignar',
            'ver-tareas',
            'ver-mis-tareas',
            'gestionar-tareas',
            'entregar-tarea',

            // ==================== CALIFICACIONES ====================
            'calificaciones.index',
            'calificaciones.show',
            'calificaciones.edit',
            'calificaciones.update',
            'calificaciones.reportes',
            'calificaciones.create',
            'calificaciones.delete',
            'ver-calificaciones',
            'ver-mis-calificaciones',
            'gestionar-calificaciones',

            // ==================== CONTENIDO EDUCATIVO ====================
            'contenido.ver',
            'contenido.create',
            'contenido.edit',
            'contenido.delete',
            'contenido.publicar',
            'modulos.index',
            'modulos.create',
            'modulos.edit',
            'modulos.show',
            'gestionar-modulos',
            'lecciones.index',
            'lecciones.create',
            'lecciones.edit',
            'lecciones.show',
            'gestionar-lecciones',
            'ver-contenido-educativo',

            // ==================== EVALUACIONES ====================
            'evaluaciones.ver',
            'evaluaciones.create',
            'evaluaciones.edit',
            'evaluaciones.delete',
            'evaluaciones.tomar',
            'evaluaciones.calificar',
            'evaluaciones.index',
            'evaluaciones.show',
            'evaluaciones.estudiante',
            'ver-evaluaciones',
            'gestionar-evaluaciones',

            // ==================== TRABAJOS ====================
            'trabajos.ver',
            'trabajos.entregar',
            'trabajos.calificar',
            'trabajos.revisar',

            // ==================== RECURSOS ====================
            'recursos.ver',
            'recursos.create',
            'recursos.edit',
            'recursos.delete',
            'recursos.descargar',
            'recursos.index',
            'recursos.show',
            'gestionar-recursos',

            // ==================== ANÁLISIS Y REPORTES ====================
            'analisis.ver',
            'analisis.ejecutar',
            'analisis.recomendaciones',
            'reportes.ver',
            'reportes.create',
            'reportes.exportar',
            'reportes.estadisticas',
            'analisis-riesgo.ver',
            'analisis-riesgo.index',

            // ==================== ORIENTACIÓN VOCACIONAL ====================
            'vocacional.ver_tests',
            'vocacional.tomar_tests',
            'vocacional.ver_resultados',
            'vocacional.ver_recomendaciones',
            'vocacional.gestionar_tests',
            'vocacional.gestionar_carreras',

            // ==================== RECOMENDACIONES ====================
            'recomendaciones.ver',
            'recomendaciones.ver_mis',

            // ==================== NOTIFICACIONES ====================
            'notificaciones.ver',
            'notificaciones.enviar',
            'notificaciones.gestionar',

            // ==================== ADMINISTRACIÓN ====================
            'usuarios.index',
            'usuarios.create',
            'usuarios.store',
            'usuarios.show',
            'usuarios.edit',
            'usuarios.update',
            'usuarios.destroy',
            'roles.index',
            'roles.create',
            'roles.store',
            'roles.show',
            'roles.edit',
            'roles.update',
            'roles.destroy',
            'permisos.index',
            'permissions.index',
            'admin.usuarios',
            'admin.roles',
            'admin.permisos',
            'admin.configuracion',
            'admin.backup',
            'gestionar-permisos',
            'gestionar-roles',
        ];

        // Crear todos los permisos
        $contador = 0;
        foreach ($permisos as $permiso) {
            try {
                Permission::findOrCreate($permiso);
                $contador++;
            } catch (\Exception $e) {
                echo "⚠️ Error creando permiso '{$permiso}': {$e->getMessage()}\n";
            }
        }

        echo "\n✅ {$contador} permisos creados/verificados\n";
        echo "=" . str_repeat("=", 69) . "\n\n";
    }
}
