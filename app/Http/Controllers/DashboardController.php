<?php
namespace App\Http\Controllers;

use App\Models\ModuloSidebar;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Muestra el dashboard principal y redirige según el tipo de usuario
     */
    public function index()
    {
        $user = Auth::user();

        // Determinar qué tipo de dashboard mostrar según el rol del usuario
        if ($user->hasRole('director') && $user->can('ver-dashboard-director')) {
            return $this->dashboardDirector();
        } elseif ($user->hasRole('profesor') && $user->can('ver-dashboard-profesor')) {
            return $this->dashboardProfesor();
        } elseif ($user->hasRole('estudiante') && $user->can('ver-dashboard-estudiante')) {
            return $this->dashboardEstudiante();
        } elseif ($user->hasRole('padre') && $user->can('ver-dashboard-padre')) {
            return $this->dashboardPadre();
        } else {
            return $this->dashboardGeneral();
        }
    }

    /**
     * Dashboard para el director
     */
    protected function dashboardDirector()
    {
        return Inertia::render('Dashboard/Director', [
            'modulosSidebar' => $this->getMenuItems(),
        ]);
    }

    /**
     * Dashboard para profesores
     */
    protected function dashboardProfesor()
    {
        return Inertia::render('Dashboard/Profesor', [
            'modulosSidebar' => $this->getMenuItems(),
        ]);
    }

    /**
     * Dashboard para estudiantes
     */
    protected function dashboardEstudiante()
    {
        return Inertia::render('Dashboard/Estudiante', [
            'modulosSidebar' => $this->getMenuItems(),
        ]);
    }

    /**
     * Dashboard para padres
     */
    protected function dashboardPadre()
    {
        return Inertia::render('Dashboard/Padre', [
            'modulosSidebar' => $this->getMenuItems(),
        ]);
    }

    /**
     * Dashboard general/genérico para otros roles
     */
    protected function dashboardGeneral()
    {
        return Inertia::render('Dashboard/General', [
            'modulosSidebar' => $this->getMenuItems(),
        ]);
    }

    /**
     * Obtener elementos del menú sidebar filtrados por permisos del usuario actual
     */
    protected function getMenuItems()
    {
        // Obtener módulos del sidebar filtrados por permisos del usuario
        $modulos = ModuloSidebar::obtenerParaSidebar();

        // Convertir a formato para frontend
        return $modulos->map(function ($modulo) {
            return $modulo->toNavItem();
        })->values()->toArray();
    }
}
