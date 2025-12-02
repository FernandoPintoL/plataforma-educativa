<?php

namespace App\Http\Controllers;

use App\Models\Calificacion;
use App\Models\Trabajo;
use App\Http\Requests\StoreCalificacionRequest;
use App\Services\FeedbackIntellicentService;
use App\Services\DeteccionIAService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class CalificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->esEstudiante()) {
            // Estudiante: ver sus propias calificaciones
            $calificaciones = Calificacion::whereHas('trabajo', function ($q) use ($user) {
                $q->where('estudiante_id', $user->id);
            })
                ->with([
                    'trabajo.contenido.curso',
                    'trabajo.contenido.tarea',
                    'trabajo.estudiante',
                    'evaluador'
                ])
                ->orderBy('fecha_calificacion', 'desc')
                ->paginate(15);

            // Obtener cursos del estudiante
            $cursos = $user->cursosComoEstudiante()->get();

            return Inertia::render('Calificaciones/IndexEstudiante', [
                'calificaciones' => $calificaciones,
                'cursos' => $cursos,
            ]);
        }

        // Profesor: ver calificaciones que ha hecho
        if ($user->esProfesor()) {
            $calificaciones = Calificacion::where('evaluador_id', $user->id)
                ->with([
                    'trabajo.contenido.curso',
                    'trabajo.contenido.tarea',
                    'trabajo.estudiante'
                ])
                ->orderBy('fecha_calificacion', 'desc')
                ->paginate(15);

            // Obtener cursos del profesor
            $cursos = $user->cursosComoProfesor()->get();

            return Inertia::render('Calificaciones/IndexProfesor', [
                'calificaciones' => $calificaciones,
                'cursos' => $cursos,
            ]);
        }

        abort(403, 'No tienes permiso para ver calificaciones.');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreCalificacionRequest $request, Trabajo $trabajo)
    {
        try {
            DB::beginTransaction();

            Log::info('=== INICIANDO CALIFICACIÓN ===', [
                'trabajo_id' => $trabajo->id,
                'profesor_id' => auth()->id(),
                'puntaje_recibido' => $request->puntaje,
                'comentario' => substr($request->comentario ?? '', 0, 50),
                'timestamp' => now(),
            ]);

            // Verificar que el trabajo esté entregado
            if (!$trabajo->estaEntregado()) {
                Log::warning('Intento de calificar trabajo no entregado', [
                    'trabajo_id' => $trabajo->id,
                    'estado_actual' => $trabajo->estado,
                ]);
                return back()->withErrors([
                    'error' => 'No puedes calificar un trabajo que no ha sido entregado.'
                ]);
            }

            // Verificar si ya existe una calificación
            if ($trabajo->calificacion) {
                // Si ya existe, actualizar en lugar de rechazar
                $calificacion = $trabajo->calificacion;
                Log::info('Actualizando calificación existente', [
                    'calificacion_id' => $calificacion->id,
                    'trabajo_id' => $trabajo->id,
                    'puntaje_anterior' => $calificacion->puntaje,
                    'puntaje_nuevo' => $request->puntaje,
                ]);
                $calificacion->update([
                    'puntaje' => $request->puntaje,
                    'comentario' => $request->comentario,
                    'fecha_calificacion' => now(),
                    'evaluador_id' => auth()->id(),
                    'criterios_evaluacion' => $request->criterios_evaluacion,
                ]);
                Log::info('Calificación actualizada en BD', [
                    'calificacion_id' => $calificacion->id,
                    'puntaje_actualizado' => $calificacion->puntaje,
                ]);
            } else {
                // Crear la calificación si no existe
                Log::info('Creando nueva calificación', [
                    'trabajo_id' => $trabajo->id,
                    'puntaje' => $request->puntaje,
                ]);
                $calificacion = Calificacion::create([
                    'trabajo_id' => $trabajo->id,
                    'puntaje' => $request->puntaje,
                    'comentario' => $request->comentario,
                    'fecha_calificacion' => now(),
                    'evaluador_id' => auth()->id(),
                    'criterios_evaluacion' => $request->criterios_evaluacion,
                ]);
                Log::info('Calificación creada en BD', [
                    'calificacion_id' => $calificacion->id,
                    'puntaje' => $calificacion->puntaje,
                ]);
            }

            // Actualizar estado del trabajo a "calificado"
            $trabajo->update([
                'estado' => 'calificado',
            ]);
            Log::info('Estado del trabajo actualizado a calificado', [
                'trabajo_id' => $trabajo->id,
                'estado' => $trabajo->estado,
            ]);

            DB::commit();
            Log::info('=== TRANSACCIÓN COMPROMETIDA ===', [
                'calificacion_id' => $calificacion->id,
                'trabajo_id' => $trabajo->id,
                'puntaje_final' => $calificacion->puntaje,
                'timestamp' => now(),
            ]);

            // NOTA: Los siguientes servicios se ejecutan DESPUÉS de confirmar la transacción
            // para que si fallan, no afecten el guardado de la calificación

            // Analizar PDF en busca de contenido generado por IA
            try {
                $deteccionIAService = new DeteccionIAService();
                $deteccionIAService->analizarDocumentoDeCalificacion($calificacion);
                Log::info('Análisis de IA iniciado para calificación', [
                    'calificacion_id' => $calificacion->id,
                    'trabajo_id' => $trabajo->id,
                ]);
            } catch (\Exception $iaError) {
                Log::error('Error en análisis de IA', [
                    'calificacion_id' => $calificacion->id,
                    'error' => $iaError->getMessage(),
                ]);
                // No afecta el flujo de calificación si el análisis de IA falla
            }

            // Generar feedback inteligente de forma asincrónica
            try {
                $feedbackService = new FeedbackIntellicentService();
                $feedbackService->generarFeedback($trabajo->id, $calificacion->id);
                Log::info('Feedback inteligente generado para calificación', [
                    'calificacion_id' => $calificacion->id,
                    'trabajo_id' => $trabajo->id,
                ]);
            } catch (\Exception $feedbackError) {
                Log::error('Error generando feedback inteligente', [
                    'calificacion_id' => $calificacion->id,
                    'error' => $feedbackError->getMessage(),
                ]);
                // No afecta el flujo de calificación si el feedback falla
            }

            // Notificar al estudiante (con manejo de errores para no afectar la calificación)
            try {
                \App\Models\Notificacion::crear(
                    destinatario: $trabajo->estudiante,
                    tipo: 'calificacion',
                    titulo: 'Trabajo calificado',
                    contenido: "Tu trabajo '{$trabajo->contenido->titulo}' ha sido calificado. Puntaje: {$request->puntaje}",
                    datos_adicionales: [
                        'trabajo_id' => $trabajo->id,
                        'calificacion_id' => $calificacion->id,
                        'puntaje' => $request->puntaje,
                    ]
                );
            } catch (\Exception $notificationError) {
                // Si falla la notificación, registrar en logs pero no afectar la calificación
                Log::warning('Error al notificar al estudiante sobre la calificación: ' . $notificationError->getMessage());
            }

            return redirect()
                ->route('trabajos.calificar', $trabajo->id)
                ->with('success', 'Trabajo calificado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al calificar el trabajo: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Calificacion $calificacion)
    {
        $user = auth()->user();

        // Verificar permisos
        if ($user->esEstudiante() && $calificacion->trabajo->estudiante_id !== $user->id) {
            abort(403, 'No tienes acceso a esta calificación.');
        }

        if ($user->esProfesor() && $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a esta calificación.');
        }

        $calificacion->load([
            'trabajo.contenido.curso',
            'trabajo.contenido.tarea',
            'trabajo.estudiante',
            'evaluador',
            'analisisIA'
        ]);

        // Cargar feedback inteligente si existe
        $feedback = \App\Models\FeedbackAnalysis::where('calificacion_id', $calificacion->id)->first();

        // Cargar análisis de IA si existe
        $analisisIA = $calificacion->analisisIA;

        return Inertia::render('Calificaciones/Show', [
            'calificacion' => $calificacion,
            'feedback' => $feedback,
            'analisisIA' => $analisisIA,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Calificacion $calificacion)
    {
        $user = $request->user();

        // Solo el profesor evaluador puede actualizar
        if (!$user->esProfesor() || $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para actualizar esta calificación.');
        }

        // Validar
        $validated = $request->validate([
            'puntaje' => 'required|numeric|min:0',
            'comentario' => 'nullable|string|max:5000',
            'criterios_evaluacion' => 'nullable|array',
        ]);

        try {
            DB::beginTransaction();

            $calificacion->update([
                'puntaje' => $validated['puntaje'],
                'comentario' => $validated['comentario'] ?? $calificacion->comentario,
                'criterios_evaluacion' => $validated['criterios_evaluacion'] ?? $calificacion->criterios_evaluacion,
            ]);

            // Notificar al estudiante sobre la actualización
            \App\Models\Notificacion::crear(
                destinatario: $calificacion->trabajo->estudiante,
                tipo: 'calificacion',
                titulo: 'Calificación actualizada',
                contenido: "Tu calificación para '{$calificacion->trabajo->contenido->titulo}' ha sido actualizada. Nuevo puntaje: {$validated['puntaje']}",
                datos_adicionales: [
                    'trabajo_id' => $calificacion->trabajo_id,
                    'calificacion_id' => $calificacion->id,
                    'puntaje' => $validated['puntaje'],
                ]
            );

            DB::commit();

            return back()->with('success', 'Calificación actualizada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al actualizar la calificación: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Calificacion $calificacion)
    {
        $user = auth()->user();

        // Solo el profesor evaluador o un administrador pueden eliminar
        if (!$user->esProfesor() || $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para eliminar esta calificación.');
        }

        try {
            DB::beginTransaction();

            // Actualizar estado del trabajo a "entregado" (ya no calificado)
            $calificacion->trabajo->update([
                'estado' => 'entregado',
            ]);

            $calificacion->delete();

            DB::commit();

            return redirect()
                ->route('trabajos.index')
                ->with('success', 'Calificación eliminada exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al eliminar la calificación: ' . $e->getMessage()]);
        }
    }

    /**
     * Aprobar feedback inteligente generado
     */
    public function approveFeedback(Request $request, \App\Models\FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        // Verificar que sea profesor
        if (!$user->esProfesor()) {
            abort(403, 'Solo profesores pueden aprobar feedback.');
        }

        // Verificar que sea el evaluador de la calificación
        if ($feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para aprobar este feedback.');
        }

        try {
            $feedbackFinal = $request->get('feedback_final');

            $feedbackService = new FeedbackIntellicentService();
            $feedbackService->aprobarFeedback($feedback->id, $feedbackFinal);

            Log::info('Feedback aprobado por profesor', [
                'feedback_id' => $feedback->id,
                'profesor_id' => $user->id,
            ]);

            return back()->with('success', 'Feedback aprobado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al aprobar feedback: ' . $e->getMessage()]);
        }
    }

    /**
     * Rechazar feedback inteligente y solicitar regeneración
     */
    public function rejectFeedback(Request $request, \App\Models\FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        // Verificar que sea profesor
        if (!$user->esProfesor()) {
            abort(403, 'Solo profesores pueden rechazar feedback.');
        }

        // Verificar que sea el evaluador de la calificación
        if ($feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes permiso para rechazar este feedback.');
        }

        try {
            $feedbackService = new FeedbackIntellicentService();
            $feedbackService->rechazarFeedback($feedback->id);

            Log::info('Feedback rechazado por profesor - regeneración solicitada', [
                'feedback_id' => $feedback->id,
                'profesor_id' => $user->id,
            ]);

            return back()->with('success', 'Feedback rechazado. Se puede regenerar.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al rechazar feedback: ' . $e->getMessage()]);
        }
    }

    /**
     * Exportar calificaciones de un curso a CSV
     */
    public function exportar(Request $request)
    {
        $user = $request->user();

        if (!$user->esProfesor()) {
            abort(403, 'No tienes permiso para exportar calificaciones.');
        }

        $cursoId = $request->get('curso_id');

        if (!$cursoId) {
            return back()->withErrors(['error' => 'Debes especificar un curso.']);
        }

        // Obtener calificaciones del curso
        $calificaciones = Calificacion::whereHas('trabajo.contenido', function ($q) use ($cursoId, $user) {
            $q->where('curso_id', $cursoId)
              ->where('creador_id', $user->id);
        })
            ->with([
                'trabajo.contenido.tarea',
                'trabajo.estudiante'
            ])
            ->get();

        // Generar CSV
        $filename = 'calificaciones_curso_' . $cursoId . '_' . date('Y-m-d') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function () use ($calificaciones) {
            $file = fopen('php://output', 'w');

            // Encabezados
            fputcsv($file, [
                'Estudiante',
                'Matrícula',
                'Tarea',
                'Puntaje',
                'Calificación Letra',
                'Estado',
                'Fecha Entrega',
                'Fecha Calificación',
                'Comentario'
            ]);

            // Datos
            foreach ($calificaciones as $calificacion) {
                fputcsv($file, [
                    $calificacion->trabajo->estudiante->name,
                    $calificacion->trabajo->estudiante->estudiante->matricula ?? 'N/A',
                    $calificacion->trabajo->contenido->titulo,
                    $calificacion->puntaje,
                    $calificacion->getCalificacionLetra(),
                    $calificacion->trabajo->estado,
                    $calificacion->trabajo->fecha_entrega?->format('Y-m-d H:i'),
                    $calificacion->fecha_calificacion->format('Y-m-d H:i'),
                    $calificacion->comentario ?? '',
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
