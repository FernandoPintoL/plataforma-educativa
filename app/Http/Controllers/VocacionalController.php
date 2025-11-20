<?php

namespace App\Http\Controllers;

use App\Models\PerfilVocacional;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class VocacionalController extends Controller
{
    /**
     * Mostrar el perfil vocacional del estudiante
     */
    public function perfil()
    {
        $usuario = Auth::user();

        $perfil = PerfilVocacional::where('estudiante_id', $usuario->id)->first();

        if (!$perfil) {
            return redirect()->route('vocacional.index')
                ->with('info', 'Completa un test vocacional primero para ver tu perfil');
        }

        return Inertia::render('Vocacional/Perfil', [
            'perfil' => $perfil,
            'carreras' => $perfil->carreras_recomendadas ?? [],
            'fortalezas' => $perfil->fortalezas ?? [],
            'areasInteres' => $perfil->areas_interes ?? [],
            'nivelConfianza' => $perfil->nivel_confianza ?? 0,
        ]);
    }

    /**
     * Mostrar recomendaciones de carrera
     */
    public function recomendaciones()
    {
        $usuario = Auth::user();

        $perfil = PerfilVocacional::where('estudiante_id', $usuario->id)->first();

        if (!$perfil) {
            return redirect()->route('tests-vocacionales.index')
                ->with('info', 'Completa un test vocacional primero para ver recomendaciones');
        }

        return Inertia::render('Vocacional/Recomendaciones', [
            'perfil' => $perfil,
            'carreras' => $perfil->carreras_recomendadas ?? [],
            'confianza' => $perfil->nivel_confianza ?? 0,
            'fortalezas' => $perfil->fortalezas ?? [],
        ]);
    }
}
