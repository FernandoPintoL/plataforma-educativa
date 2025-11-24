<?php

namespace App\Http\Controllers;

use App\Models\FeedbackAnalysis;
use App\Models\Calificacion;
use App\Services\FeedbackIntellicentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

/**
 * FeedbackController
 *
 * Controlador para gestionar el flujo de feedback inteligente
 * Permite a profesores revisar, aprobar o rechazar feedback generado por IA
 */
class FeedbackController extends Controller
{
    /**
     * Listar feedback pendiente de aprobación para el profesor
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user->esProfesor()) {
            abort(403, 'Solo profesores pueden acceder a esta sección.');
        }

        // Obtener feedback pendiente generado por el profesor
        $feedback = FeedbackAnalysis::whereHas('calificacion', function ($q) use ($user) {
            $q->where('evaluador_id', $user->id);
        })
            ->with([
                'calificacion.trabajo.contenido',
                'calificacion.trabajo.estudiante',
                'calificacion',
                'profesor'
            ])
            ->whereIn('estado', ['generado', 'rechazado'])
            ->orderBy('fecha_analisis', 'desc')
            ->paginate(15);

        // Estadísticas de feedback
        $stats = [
            'pending' => FeedbackAnalysis::whereHas('calificacion', function ($q) use ($user) {
                $q->where('evaluador_id', $user->id);
            })->where('estado', 'generado')->count(),

            'approved' => FeedbackAnalysis::whereHas('calificacion', function ($q) use ($user) {
                $q->where('evaluador_id', $user->id);
            })->where('estado', 'aprobado')->count(),

            'rejected' => FeedbackAnalysis::whereHas('calificacion', function ($q) use ($user) {
                $q->where('evaluador_id', $user->id);
            })->where('estado', 'rechazado')->count(),
        ];

        return Inertia::render('Feedback/Index', [
            'feedback' => $feedback,
            'stats' => $stats,
        ]);
    }

    /**
     * Mostrar detalle del feedback
     */
    public function show(FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        if (!$user->esProfesor() || $feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a este feedback.');
        }

        $feedback->load([
            'calificacion.trabajo.contenido',
            'calificacion.trabajo.estudiante',
            'calificacion',
            'profesor'
        ]);

        return Inertia::render('Feedback/Show', [
            'feedback' => $feedback,
        ]);
    }

    /**
     * Aprobar feedback y enviarlo al estudiante
     */
    public function approve(Request $request, FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        if (!$user->esProfesor() || $feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a este feedback.');
        }

        try {
            $validated = $request->validate([
                'feedback_final' => 'nullable|string|max:10000',
            ]);

            $feedbackService = new FeedbackIntellicentService();

            // Si el profesor editó el feedback, usar su versión
            $finalFeedback = $validated['feedback_final'] ?? $feedback->feedback_analysis;

            $feedbackService->aprobarFeedback($feedback->id, $finalFeedback);

            Log::info('Feedback aprobado y enviado al estudiante', [
                'feedback_id' => $feedback->id,
                'profesor_id' => $user->id,
                'trabajo_id' => $feedback->trabajo_id,
            ]);

            // Notificar al estudiante
            \App\Models\Notificacion::crear(
                destinatario: $feedback->calificacion->trabajo->estudiante,
                tipo: 'feedback',
                titulo: 'Feedback detallado disponible',
                contenido: "Tu trabajo '{$feedback->calificacion->trabajo->contenido->titulo}' tiene feedback detallado disponible.",
                datos_adicionales: [
                    'calificacion_id' => $feedback->calificacion_id,
                    'feedback_id' => $feedback->id,
                ]
            );

            return back()->with('success', 'Feedback aprobado y enviado al estudiante.');

        } catch (\Exception $e) {
            Log::error('Error aprobando feedback', [
                'feedback_id' => $feedback->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['error' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * Rechazar feedback y solicitar regeneración
     */
    public function reject(Request $request, FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        if (!$user->esProfesor() || $feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a este feedback.');
        }

        try {
            $feedbackService = new FeedbackIntellicentService();
            $feedbackService->rechazarFeedback($feedback->id);

            Log::info('Feedback rechazado - regeneración solicitada', [
                'feedback_id' => $feedback->id,
                'profesor_id' => $user->id,
            ]);

            return back()->with('success', 'Feedback rechazado. Puedes regenerarlo.');

        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * Regenerar feedback rechazado
     */
    public function regenerate(FeedbackAnalysis $feedback)
    {
        $user = auth()->user();

        if (!$user->esProfesor() || $feedback->calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a este feedback.');
        }

        try {
            $feedbackService = new FeedbackIntellicentService();
            $newFeedback = $feedbackService->generarFeedback(
                $feedback->trabajo_id,
                $feedback->calificacion_id
            );

            Log::info('Feedback regenerado exitosamente', [
                'feedback_id' => $feedback->id,
                'profesor_id' => $user->id,
            ]);

            return back()->with('success', 'Feedback regenerado. Revísalo nuevamente.');

        } catch (\Exception $e) {
            Log::error('Error regenerando feedback', [
                'feedback_id' => $feedback->id,
                'error' => $e->getMessage(),
            ]);

            return back()->withErrors(['error' => 'Error: ' . $e->getMessage()]);
        }
    }

    /**
     * Obtener resumen de feedback para un trabajo
     */
    public function getByCalificacion(Calificacion $calificacion)
    {
        $user = auth()->user();

        if (!$user->esProfesor() || $calificacion->evaluador_id !== $user->id) {
            abort(403, 'No tienes acceso a esta calificación.');
        }

        $feedback = FeedbackAnalysis::where('calificacion_id', $calificacion->id)
            ->first();

        if (!$feedback) {
            return response()->json(['message' => 'No hay feedback generado'], 404);
        }

        return response()->json($feedback);
    }
}
