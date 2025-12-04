<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Curso;
use App\Models\Trabajo;
use App\Models\Evaluacion;
use Illuminate\Console\Command;

class VerifyDashboardCoherence extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dashboard:verify-coherence';

    /**
     * The description of the console command.
     *
     * @var string
     */
    protected $description = 'Verifica que el dashboard del profesor muestre datos coherentes con la BD';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('=== VERIFICACIÓN DE COHERENCIA DEL DASHBOARD DEL PROFESOR ===');
        $this->newLine();

        // Obtener todos los profesores
        $profesores = User::whereHas('roles', function ($q) {
            $q->where('name', 'profesor');
        })->get();

        if ($profesores->isEmpty()) {
            $this->warn('⚠️  No hay profesores registrados en el sistema');
            return;
        }

        $this->info("✅ Se encontraron {$profesores->count()} profesor(es)");
        $this->newLine();

        foreach ($profesores as $profesor) {
            $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            $this->line("👨‍🏫 PROFESOR: {$profesor->name} (ID: {$profesor->id})");
            $this->line("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

            // 1. VERIFICAR CURSOS
            $cursos = Curso::where('profesor_id', $profesor->id)->get();
            $this->line("\n📚 CURSOS:");
            $this->line("   Total de cursos: {$cursos->count()}");

            // 2. VERIFICAR ESTUDIANTES
            $this->line("\n👥 ESTUDIANTES:");
            $total_estudiantes_activos = 0;
            $total_estudiantes_todos = 0;

            foreach ($cursos as $curso) {
                $activos = $curso->estudiantes()->wherePivot('estado', 'activo')->count();
                $todos = $curso->estudiantes()->count();
                $total_estudiantes_activos += $activos;
                $total_estudiantes_todos += $todos;

                if ($todos > 0) {
                    $inactivos = $todos - $activos;
                    if ($inactivos > 0) {
                        $this->line("   ⚠️  {$curso->nombre}: $activos activos, $inactivos inactivos (Total: $todos)");
                    } else {
                        $this->line("   ✅ {$curso->nombre}: $activos activos");
                    }
                }
            }

            $this->line("   📊 TOTAL ESTUDIANTES ACTIVOS (Correcto): $total_estudiantes_activos");
            if ($total_estudiantes_todos > $total_estudiantes_activos) {
                $this->line("   ⚠️  Estudiantes inactivos/completados/abandonados: " . ($total_estudiantes_todos - $total_estudiantes_activos));
            }

            // 3. VERIFICAR TAREAS PENDIENTES
            $this->line("\n📝 TAREAS PENDIENTES DE REVISIÓN:");
            $tareas_pendientes = Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id)
                    ->where('estado', 'publicado');
            })
                ->where('estado', 'entregado')
                ->whereDoesntHave('calificacion')
                ->count();

            $this->line("   ✅ Tareas pendientes (estado publicado): $tareas_pendientes");

            // Verificar tareas no publicadas que se entregarían (problema)
            $tareas_no_publicadas = Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('tipo', 'tarea')
                    ->where('creador_id', $profesor->id)
                    ->where('estado', '!=', 'publicado');
            })
                ->where('estado', 'entregado')
                ->whereDoesntHave('calificacion')
                ->count();

            if ($tareas_no_publicadas > 0) {
                $this->warn("   ⚠️  PROBLEMA: $tareas_no_publicadas tareas no publicadas con entregas pendientes");
            }

            // 4. VERIFICAR EVALUACIONES ACTIVAS
            $this->line("\n📋 EVALUACIONES ACTIVAS:");
            $evaluaciones_activas = Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->where('contenidos.estado', 'publicado')
                ->where('contenidos.fecha_limite', '>=', now())
                ->count();

            $this->line("   ✅ Evaluaciones activas (publicadas): $evaluaciones_activas");

            // Verificar evaluaciones no publicadas
            $evaluaciones_no_publicadas = Evaluacion::join('contenidos', 'evaluaciones.contenido_id', '=', 'contenidos.id')
                ->join('cursos', 'contenidos.curso_id', '=', 'cursos.id')
                ->where('cursos.profesor_id', $profesor->id)
                ->where('contenidos.estado', '!=', 'publicado')
                ->where('contenidos.fecha_limite', '>=', now())
                ->count();

            if ($evaluaciones_no_publicadas > 0) {
                $this->warn("   ⚠️  PROBLEMA: $evaluaciones_no_publicadas evaluaciones no publicadas activas");
            }

            // 5. VERIFICAR TRABAJOS CALIFICADOS (Últimos 7 días)
            $this->line("\n🎯 ACTIVIDAD RECIENTE (Últimos 7 días):");
            $trabajos_calificados = Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('creador_id', $profesor->id);
            })
                ->whereHas('calificacion')
                ->whereBetween('updated_at', [now()->subDays(7), now()])
                ->count();

            $this->line("   ✅ Trabajos calificados: $trabajos_calificados");

            // 6. VERIFICAR INTEGRIDAD
            $this->line("\n🔍 VERIFICACIÓN DE INTEGRIDAD:");

            // Trabajos sin calificación pero estado 'calificado'
            $inconsistencias = Trabajo::whereHas('contenido', function ($query) use ($profesor) {
                $query->where('creador_id', $profesor->id);
            })
                ->where('estado', 'calificado')
                ->whereDoesntHave('calificacion')
                ->count();

            if ($inconsistencias > 0) {
                $this->error("   ❌ CRÍTICO: $inconsistencias trabajos en estado 'calificado' sin calificación");
            } else {
                $this->line("   ✅ No hay trabajos inconsistentes (estado calificado sin calificación)");
            }

            $this->newLine();
        }

        $this->info("═══════════════════════════════════════════════════════════════════════════════════");
        $this->info("✅ VERIFICACIÓN COMPLETADA");
        $this->info("═══════════════════════════════════════════════════════════════════════════════════");
    }
}
