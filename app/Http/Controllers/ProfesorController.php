<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class ProfesorController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:profesores.index|gestionar-profesores')->only('index');
        $this->middleware('permission:profesores.show|gestionar-profesores')->only('show');
        $this->middleware('permission:profesores.create|gestionar-profesores')->only(['create', 'store']);
        $this->middleware('permission:profesores.edit|gestionar-profesores')->only(['edit', 'update']);
        $this->middleware('permission:profesores.delete|gestionar-profesores')->only('destroy');
        $this->middleware('permission:profesores.toggle-status|gestionar-profesores')->only('toggleStatus');
    }

    public function index(Request $request)
    {
        $query = User::with(['roles', 'permissions'])
            ->where(function ($q) {
                $q->where('tipo_usuario', 'profesor')
                  ->orWhereHas('roles', function ($roleQuery) {
                      $roleQuery->where('name', 'profesor');
                  });
            });

        // Filtros de búsqueda
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('usernick', 'like', "%{$search}%")
                    ->orWhere('apellido', 'like', "%{$search}%");
            });
        }

        // Filtro por cursos asignados
        if ($request->has('curso') && $request->curso) {
            $query->whereHas('cursosComoProfesor', function ($q) use ($request) {
                $q->where('cursos.id', $request->curso);
            });
        }

        // Filtro por estado activo
        if ($request->has('activo') && $request->activo !== '') {
            $query->where('activo', $request->activo);
        }

        $profesores = $query->orderBy('created_at', 'desc')->paginate(15);

        $roles = Role::where('name', 'profesor')->get();

        return Inertia::render('Profesores/Index', [
            'profesores' => $profesores,
            'roles'      => $roles,
            'filters'    => [
                'search' => $request->search,
                'curso'  => $request->curso,
                'activo' => $request->activo,
            ],
        ]);
    }

    public function create()
    {
        $roles       = Role::where('name', 'profesor')->get();
        $permissions = Permission::where('name', 'like', 'profesores.%')
            ->orWhere('name', 'like', 'tareas.%')
            ->orWhere('name', 'like', 'evaluaciones.%')
            ->orWhere('name', 'like', 'cursos.%')
            ->orWhere('name', 'like', 'calificaciones.%')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            });

        return Inertia::render('Profesores/Create', [
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'apellido'          => ['nullable', 'string', 'max:255'],
            'usernick'          => ['required', 'string', 'max:255', 'unique:users'],
            'email'             => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password'          => ['required', 'string', 'min:8', 'confirmed'],
            'fecha_nacimiento'  => ['nullable', 'date'],
            'telefono'          => ['nullable', 'string', 'max:20'],
            'direccion'         => ['nullable', 'string', 'max:500'],
            'permissions'       => ['array'],
            'permissions.*'     => ['exists:permissions,id'],
        ]);

        $profesor = User::create([
            'name'             => $validated['name'],
            'apellido'         => $validated['apellido'] ?? null,
            'usernick'         => $validated['usernick'],
            'email'            => $validated['email'],
            'password'         => Hash::make($validated['password']),
            'tipo_usuario'     => 'profesor',
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'telefono'         => $validated['telefono'] ?? null,
            'direccion'        => $validated['direccion'] ?? null,
            'activo'           => true,
        ]);

        // Asignar rol de profesor
        $profesor->assignRole('profesor');

        // Asignar permisos directos si se proporcionan
        if (isset($validated['permissions'])) {
            $profesor->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        }

        return redirect()->route('profesores.index')
            ->with('success', 'Profesor creado exitosamente.');
    }

    public function show(User $profesor)
    {
        // Verificar que sea profesor
        if (!$profesor->esProfesor()) {
            abort(404, 'Profesor no encontrado.');
        }

        // Cargar relaciones
        $profesor->load([
            'roles.permissions',
            'permissions',
            'cursosComoProfesor.estudiantes'
        ]);

        return Inertia::render('Profesores/Show', [
            'profesor'        => $profesor,
            'userRoles'       => $profesor->roles->pluck('id')->toArray(),
            'userPermissions' => $profesor->permissions->pluck('id')->toArray(),
            'allPermissions'  => $profesor->getAllPermissions(),
        ]);
    }

    public function edit(User $profesor)
    {
        // Verificar que sea profesor
        if (!$profesor->esProfesor()) {
            abort(404, 'Profesor no encontrado.');
        }

        // Cargar permisos directos y permisos de los roles
        $profesor->load(['roles.permissions', 'permissions']);

        $roles       = Role::where('name', 'profesor')->get();
        $permissions = Permission::where('name', 'like', 'profesores.%')
            ->orWhere('name', 'like', 'tareas.%')
            ->orWhere('name', 'like', 'evaluaciones.%')
            ->orWhere('name', 'like', 'cursos.%')
            ->orWhere('name', 'like', 'calificaciones.%')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            });

        return Inertia::render('Profesores/Edit', [
            'profesor'        => $profesor,
            'roles'           => $roles,
            'permissions'     => $permissions,
            'userRoles'       => $profesor->roles->pluck('id')->toArray(),
            'userPermissions' => $profesor->permissions->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, User $profesor)
    {
        // Verificar que sea profesor
        if (!$profesor->esProfesor()) {
            abort(404, 'Profesor no encontrado.');
        }

        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'apellido'          => ['nullable', 'string', 'max:255'],
            'usernick'          => ['required', 'string', 'max:255', Rule::unique('users')->ignore($profesor->id)],
            'email'             => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($profesor->id)],
            'password'          => ['nullable', 'string', 'min:8', 'confirmed'],
            'fecha_nacimiento'  => ['nullable', 'date'],
            'telefono'          => ['nullable', 'string', 'max:20'],
            'direccion'         => ['nullable', 'string', 'max:500'],
            'activo'            => ['boolean'],
            'permissions'       => ['array'],
            'permissions.*'     => ['exists:permissions,id'],
        ]);

        $profesor->update([
            'name'             => $validated['name'],
            'apellido'         => $validated['apellido'] ?? null,
            'usernick'         => $validated['usernick'],
            'email'            => $validated['email'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'telefono'         => $validated['telefono'] ?? null,
            'direccion'        => $validated['direccion'] ?? null,
            'activo'           => $validated['activo'] ?? $profesor->activo,
        ]);

        // Actualizar contraseña solo si se proporciona
        if (!empty($validated['password'])) {
            $profesor->update(['password' => Hash::make($validated['password'])]);
        }

        // Sincronizar permisos directos
        if (isset($validated['permissions'])) {
            $profesor->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        } else {
            $profesor->syncPermissions([]);
        }

        return redirect()->route('profesores.index')
            ->with('success', 'Profesor actualizado exitosamente.');
    }

    public function destroy(User $profesor)
    {
        // Verificar que sea profesor
        if (!$profesor->esProfesor()) {
            abort(404, 'Profesor no encontrado.');
        }

        // Evitar que el usuario se elimine a sí mismo
        if ($profesor->id === Auth::id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $profesor->delete();

        return redirect()->route('profesores.index')
            ->with('success', 'Profesor eliminado exitosamente.');
    }

    public function toggleStatus(User $profesor)
    {
        // Verificar que sea profesor
        if (!$profesor->esProfesor()) {
            abort(404, 'Profesor no encontrado.');
        }

        // Evitar que el usuario se desactive a sí mismo
        if ($profesor->id === Auth::id()) {
            return back()->with('error', 'No puedes desactivar tu propia cuenta.');
        }

        $profesor->update(['activo' => !$profesor->activo]);

        $status = $profesor->activo ? 'activado' : 'desactivado';

        return back()->with('success', "Profesor {$status} exitosamente.");
    }
}
