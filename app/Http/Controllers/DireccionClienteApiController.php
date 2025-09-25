<?php
namespace App\Http\Controllers;

use App\Helpers\ApiResponse;
use App\Models\Cliente;
use App\Models\DireccionCliente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DireccionClienteApiController extends Controller
{
    public function __construct()
    {
        // Solo aplicar middleware de permisos si no estamos en testing
        if (! app()->runningUnitTests()) {
            $this->middleware('permission:clientes.manage')->only([
                'index', 'store', 'update', 'destroy', 'establecerPrincipal',
            ]);
        }
    }

    /**
     * API: Listar direcciones de un cliente
     */
    public function index(Cliente $cliente): JsonResponse
    {
        $direcciones = $cliente->direcciones()
            ->orderByDesc('es_principal')
            ->orderBy('id')
            ->get();

        return ApiResponse::success($direcciones);
    }

    /**
     * API: Crear nueva dirección para un cliente
     */
    public function store(Request $request, Cliente $cliente): JsonResponse
    {
        $data = $request->validate([
            'direccion'     => ['required', 'string', 'max:500'],
            'ciudad'        => ['nullable', 'string', 'max:100'],
            'departamento'  => ['nullable', 'string', 'max:100'],
            'codigo_postal' => ['nullable', 'string', 'max:20'],
            'es_principal'  => ['boolean'],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            // Si es principal, quitar la principal actual
            if (isset($data['es_principal']) && $data['es_principal']) {
                $cliente->direcciones()->update(['es_principal' => false]);
            }

            $direccion = $cliente->direcciones()->create([
                'direccion'     => $data['direccion'],
                'ciudad'        => $data['ciudad'] ?? null,
                'departamento'  => $data['departamento'] ?? null,
                'codigo_postal' => $data['codigo_postal'] ?? null,
                'es_principal'  => $data['es_principal'] ?? false,
                'observaciones' => $data['observaciones'] ?? null,
            ]);

            return ApiResponse::success(
                $direccion,
                'Dirección creada exitosamente',
                201
            );

        } catch (\Exception $e) {
            return ApiResponse::error('Error al crear dirección: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Actualizar dirección específica
     */
    public function update(Request $request, Cliente $cliente, DireccionCliente $direccion): JsonResponse
    {
        // Verificar que la dirección pertenece al cliente
        if ($direccion->cliente_id !== $cliente->id) {
            return ApiResponse::error('La dirección no pertenece a este cliente', 403);
        }

        $data = $request->validate([
            'direccion'     => ['sometimes', 'required', 'string', 'max:500'],
            'ciudad'        => ['nullable', 'string', 'max:100'],
            'departamento'  => ['nullable', 'string', 'max:100'],
            'codigo_postal' => ['nullable', 'string', 'max:20'],
            'es_principal'  => ['boolean'],
            'observaciones' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            // Si se establece como principal, quitar la principal actual
            if (isset($data['es_principal']) && $data['es_principal']) {
                $cliente->direcciones()->where('id', '!=', $direccion->id)->update(['es_principal' => false]);
            }

            $direccion->update($data);

            return ApiResponse::success(
                $direccion->fresh(),
                'Dirección actualizada exitosamente'
            );

        } catch (\Exception $e) {
            return ApiResponse::error('Error al actualizar dirección: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Eliminar dirección
     */
    public function destroy(Cliente $cliente, DireccionCliente $direccion): JsonResponse
    {
        // Verificar que la dirección pertenece al cliente
        if ($direccion->cliente_id !== $cliente->id) {
            return ApiResponse::error('La dirección no pertenece a este cliente', 403);
        }

        try {
            $direccion->delete();

            return ApiResponse::success(null, 'Dirección eliminada exitosamente');

        } catch (\Exception $e) {
            return ApiResponse::error('Error al eliminar dirección: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Establecer dirección como principal
     */
    public function establecerPrincipal(Cliente $cliente, DireccionCliente $direccion): JsonResponse
    {
        // Verificar que la dirección pertenece al cliente
        if ($direccion->cliente_id !== $cliente->id) {
            return ApiResponse::error('La dirección no pertenece a este cliente', 403);
        }

        try {
            // Quitar principal actual
            $cliente->direcciones()->update(['es_principal' => false]);

            // Establecer como principal
            $direccion->update(['es_principal' => true]);

            return ApiResponse::success(
                $direccion->fresh(),
                'Dirección establecida como principal'
            );

        } catch (\Exception $e) {
            return ApiResponse::error('Error al establecer dirección principal: ' . $e->getMessage(), 500);
        }
    }
}
