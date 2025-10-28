<?php

namespace App\Http\Controllers;

use App\Models\Pregunta;
use App\Models\Evaluacion;
use App\Http\Requests\StorePreguntaRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PreguntaController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePreguntaRequest $request)
    {
        try {
            $evaluacion = Evaluacion::findOrFail($request->evaluacion_id);

            // Verificar que el usuario sea el creador de la evaluación
            if ($evaluacion->contenido->creador_id !== auth()->id()) {
                abort(403, 'No tienes permiso para agregar preguntas a esta evaluación.');
            }

            // Obtener el siguiente orden
            $maxOrden = $evaluacion->preguntas()->max('orden') ?? 0;

            $pregunta = Pregunta::create([
                'evaluacion_id' => $request->evaluacion_id,
                'enunciado' => $request->enunciado,
                'tipo' => $request->tipo,
                'opciones' => $request->opciones,
                'respuesta_correcta' => $request->respuesta_correcta,
                'puntos' => $request->puntos,
                'orden' => $request->orden ?? ($maxOrden + 1),
            ]);

            return back()->with('success', 'Pregunta agregada exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al agregar la pregunta: ' . $e->getMessage()])
                ->withInput();
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pregunta $pregunta)
    {
        try {
            // Verificar que el usuario sea el creador de la evaluación
            if ($pregunta->evaluacion->contenido->creador_id !== auth()->id()) {
                abort(403, 'No tienes permiso para modificar esta pregunta.');
            }

            $pregunta->update($request->only([
                'enunciado',
                'tipo',
                'opciones',
                'respuesta_correcta',
                'puntos',
                'orden',
            ]));

            return back()->with('success', 'Pregunta actualizada exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al actualizar la pregunta: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pregunta $pregunta)
    {
        try {
            // Verificar que el usuario sea el creador de la evaluación
            if ($pregunta->evaluacion->contenido->creador_id !== auth()->id()) {
                abort(403, 'No tienes permiso para eliminar esta pregunta.');
            }

            $pregunta->delete();

            return back()->with('success', 'Pregunta eliminada exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al eliminar la pregunta: ' . $e->getMessage()]);
        }
    }

    /**
     * Reordenar preguntas de una evaluación
     */
    public function reorder(Request $request, Evaluacion $evaluacion)
    {
        try {
            // Verificar que el usuario sea el creador de la evaluación
            if ($evaluacion->contenido->creador_id !== auth()->id()) {
                abort(403, 'No tienes permiso para reordenar las preguntas.');
            }

            $request->validate([
                'preguntas' => 'required|array',
                'preguntas.*.id' => 'required|exists:preguntas,id',
                'preguntas.*.orden' => 'required|integer|min:1',
            ]);

            DB::beginTransaction();

            foreach ($request->preguntas as $preguntaData) {
                Pregunta::where('id', $preguntaData['id'])
                    ->update(['orden' => $preguntaData['orden']]);
            }

            DB::commit();

            return back()->with('success', 'Preguntas reordenadas exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();

            return back()
                ->withErrors(['error' => 'Error al reordenar las preguntas: ' . $e->getMessage()]);
        }
    }
}
