<?php
namespace App\Http\Controllers;

use App\Models\Proveedor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class ProveedorController extends Controller
{
    use Traits\ApiInertiaResponseTrait;

    public function index(Request $request): InertiaResponse
    {
        $q = (string) $request->string('q');

        // Leer filtros adicionales
        $activoParam = $request->input('activo');
        $activo      = null;
        if ($activoParam !== null && $activoParam !== '' && $activoParam !== 'all') {
            if ($activoParam === '1' || $activoParam === 1 || $activoParam === true || $activoParam === 'true') {
                $activo = true;
            } elseif ($activoParam === '0' || $activoParam === 0 || $activoParam === false || $activoParam === 'false') {
                $activo = false;
            }
        }

        $allowedOrderBy = ['id', 'nombre', 'created_at'];
        $rawOrderBy     = (string) $request->string('order_by');
        $orderBy        = in_array($rawOrderBy, $allowedOrderBy, true) ? $rawOrderBy : 'id';

        $rawOrderDir = strtolower((string) $request->string('order_dir'));
        $orderDir    = in_array($rawOrderDir, ['asc', 'desc'], true) ? $rawOrderDir : 'desc';

        $items = Proveedor::query()
            ->when($q, function ($query) use ($q) {
                $query->where(function ($sub) use ($q) {
                    $sub->where('nombre', 'like', "%$q%")
                        ->orWhere('razon_social', 'like', "%$q%")
                        ->orWhere('nit', 'like', "%$q%")
                        ->orWhere('telefono', 'like', "%$q%")
                        ->orWhere('email', 'like', "%$q%")
                        ->orWhere('contacto', 'like', "%$q%");
                });
            })
            ->when($activo !== null, function ($query) use ($activo) {
                $query->where('activo', $activo);
            })
            ->orderBy($orderBy, $orderDir)
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('proveedores/index', [
            'proveedores' => $items,
            'filters'     => [
                'q'         => $q,
                'activo'    => $activo,
                'order_by'  => $orderBy,
                'order_dir' => $orderDir,
            ],
        ]);
    }

    /**
     * API: Buscar proveedores para autocompletado
     */
    public function buscarApi(Request $request): JsonResponse
    {
        $q      = $request->string('q');
        $limite = $request->integer('limite', 10);

        if (! $q || strlen($q) < 2) {
            return response()->json([
                'success' => true,
                'data'    => [],
            ]);
        }

        $proveedores = Proveedor::select(['id', 'nombre', 'razon_social', 'nit', 'telefono', 'email', 'contacto', 'activo'])
            ->where('activo', true)
            ->where(function ($query) use ($q) {
                $query->where('nombre', 'like', "%$q%")
                    ->orWhere('razon_social', 'like', "%$q%")
                    ->orWhere('nit', 'like', "%$q%")
                    ->orWhere('telefono', 'like', "%$q%")
                    ->orWhere('email', 'like', "%$q%")
                    ->orWhere('contacto', 'like', "%$q%");
            })
            ->limit($limite)
            ->get();

        return response()->json([
            'success' => true,
            'data'    => $proveedores,
        ]);
    }

    public function create(): InertiaResponse
    {
        return Inertia::render('proveedores/form', [
            'proveedor' => null,
        ]);
    }

    public function store(Request $request): RedirectResponse | JsonResponse | Response
    {
        $isModalRequest = $this->isModalRequest($request);

        $validationRules = [
            'nombre'       => ['required', 'string', 'max:255', 'unique:proveedores,nombre'],
            'razon_social' => ['nullable', 'string', 'max:255'],
            'nit'          => ['nullable', 'string', 'max:255'],
            'telefono'     => ['nullable', 'string', 'max:100'],
            'email'        => ['nullable', 'email', 'max:255'],
            'direccion'    => ['nullable', 'string', 'max:255'],
            'contacto'     => ['nullable', 'string', 'max:255'],
            'activo'       => ['boolean'],
        ];

        // Solo validar archivos si no es una petición de modal
        if (! $isModalRequest) {
            $validationRules = array_merge($validationRules, [
                'foto_perfil' => ['nullable', 'image', 'max:5120'],
                'ci_anverso'  => ['nullable', 'image', 'max:5120'],
                'ci_reverso'  => ['nullable', 'image', 'max:5120'],
            ]);
        }

        $data = $request->validate($validationRules);

        $data['activo'] = $data['activo'] ?? true;

        // Procesar archivos solo si no es una petición de modal
        if (! $isModalRequest) {
            if ($request->hasFile('foto_perfil')) {
                $data['foto_perfil'] = $request->file('foto_perfil')->store('proveedores', 'public');
            }
            if ($request->hasFile('ci_anverso')) {
                $data['ci_anverso'] = $request->file('ci_anverso')->store('proveedores', 'public');
            }
            if ($request->hasFile('ci_reverso')) {
                $data['ci_reverso'] = $request->file('ci_reverso')->store('proveedores', 'public');
            }
        }

        return $this->handleCrudOperation(
            $request,
            function () use ($data) {
                $proveedor = Proveedor::create($data);

                return ['proveedor' => $proveedor];
            },
            'Proveedor creado exitosamente',
            'proveedores.index'
        );
    }

    /**
     * API: Crear un nuevo proveedor (solo nombre requerido)
     */
    public function storeApi(Request $request): JsonResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:255', 'unique:proveedores,nombre'],
        ]);

        $data['activo'] = true; // Por defecto activo

        try {
            $proveedor = Proveedor::create($data);

            return response()->json([
                'success' => true,
                'data'    => $proveedor,
                'message' => 'Proveedor creado exitosamente',
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al crear el proveedor: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function edit(Proveedor $proveedore): InertiaResponse
    {
        return Inertia::render('proveedores/form', [
            'proveedor' => $proveedore,
        ]);
    }

    public function update(Request $request, Proveedor $proveedore): RedirectResponse | JsonResponse | Response
    {
        $data = $request->validate([
            'nombre'       => ['required', 'string', 'max:255', 'unique:proveedores,nombre,' . $proveedore->id],
            'razon_social' => ['nullable', 'string', 'max:255'],
            'nit'          => ['nullable', 'string', 'max:255'],
            'telefono'     => ['nullable', 'string', 'max:100'],
            'email'        => ['nullable', 'email', 'max:255'],
            'direccion'    => ['nullable', 'string', 'max:255'],
            'contacto'     => ['nullable', 'string', 'max:255'],
            'activo'       => ['boolean'],
            'foto_perfil'  => ['nullable', 'image', 'max:5120'],
            'ci_anverso'   => ['nullable', 'image', 'max:5120'],
            'ci_reverso'   => ['nullable', 'image', 'max:5120'],
        ]);

        return $this->handleCrudOperation(
            $request,
            function () use ($data, $proveedore) {
                $updates = $data;

                // Procesar archivos si existen
                if (request()->hasFile('foto_perfil')) {
                    $updates['foto_perfil'] = request()->file('foto_perfil')->store('proveedores', 'public');
                }
                if (request()->hasFile('ci_anverso')) {
                    $updates['ci_anverso'] = request()->file('ci_anverso')->store('proveedores', 'public');
                }
                if (request()->hasFile('ci_reverso')) {
                    $updates['ci_reverso'] = request()->file('ci_reverso')->store('proveedores', 'public');
                }

                $proveedore->update($updates);

                return ['proveedor' => $proveedore->fresh()];
            },
            'Proveedor actualizado exitosamente',
            'proveedores.index'
        );
    }

    public function destroy(Request $request, Proveedor $proveedore): RedirectResponse | JsonResponse | Response
    {
        return $this->handleCrudOperation(
            $request,
            function () use ($proveedore) {
                $proveedore->delete();

                return [];
            },
            'Proveedor eliminado exitosamente',
            'proveedores.index'
        );
    }
}
