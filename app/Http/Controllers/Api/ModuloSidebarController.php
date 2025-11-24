<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ModuloSidebar;
use Illuminate\Http\Request;

class ModuloSidebarController extends Controller
{
    /**
     * Display a listing of the resource.
     * Retorna los módulos del sidebar para el usuario autenticado
     */
    public function index()
    {
        $modulos = ModuloSidebar::obtenerParaSidebar();

        $navItems = $modulos->map(fn($modulo) => $modulo->toNavItem())->toArray();

        return response()->json($navItems);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(ModuloSidebar $moduloSidebar)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ModuloSidebar $moduloSidebar)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ModuloSidebar $moduloSidebar)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ModuloSidebar $moduloSidebar)
    {
        //
    }
}
