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

class EstudianteController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:estudiantes.index|ver-estudiantes')->only('index');
        $this->middleware('permission:estudiantes.show|ver-estudiantes')->only('show');
        $this->middleware('permission:estudiantes.create|gestionar-estudiantes')->only(['create', 'store']);
        $this->middleware('permission:estudiantes.edit|gestionar-estudiantes')->only(['edit', 'update']);
        $this->middleware('permission:estudiantes.delete|gestionar-estudiantes')->only('destroy');
        $this->middleware('permission:estudiantes.toggle-status|gestionar-estudiantes')->only('toggleStatus');
    }

    public function index(Request $request)
    {
        $query = User::with(['roles', 'permissions'])
            ->where(function ($q) {
                $q->where('tipo_usuario', 'estudiante')
                  ->orWhereHas('roles', function ($roleQuery) {
                      $roleQuery->where('name', 'estudiante');
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

        // Filtro por curso (si se implementa)
        if ($request->has('curso') && $request->curso) {
            $query->whereHas('cursosComoEstudiante', function ($q) use ($request) {
                $q->where('cursos.id', $request->curso);
            });
        }

        // Filtro por estado activo
        if ($request->has('activo') && $request->activo !== '') {
            $query->where('activo', $request->activo);
        }

        $estudiantes = $query->orderBy('created_at', 'desc')->paginate(15);

        $roles = Role::where('name', 'estudiante')->get();

        return Inertia::render('Estudiantes/Index', [
            'estudiantes' => $estudiantes,
            'roles'       => $roles,
            'filters'     => [
                'search' => $request->search,
                'curso'  => $request->curso,
                'activo' => $request->activo,
            ],
        ]);
    }

    public function create()
    {
        $roles       = Role::where('name', 'estudiante')->get();
        $permissions = Permission::where('name', 'like', 'estudiantes.%')
            ->orWhere('name', 'like', 'tareas.%')
            ->orWhere('name', 'like', 'evaluaciones.%')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            });

        return Inertia::render('Estudiantes/Create', [
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

        $estudiante = User::create([
            'name'             => $validated['name'],
            'apellido'         => $validated['apellido'] ?? null,
            'usernick'         => $validated['usernick'],
            'email'            => $validated['email'],
            'password'         => Hash::make($validated['password']),
            'tipo_usuario'     => 'estudiante',
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'telefono'         => $validated['telefono'] ?? null,
            'direccion'        => $validated['direccion'] ?? null,
            'activo'           => true,
        ]);

        // Asignar rol de estudiante
        $estudiante->assignRole('estudiante');

        // Asignar permisos directos si se proporcionan
        if (isset($validated['permissions'])) {
            $estudiante->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        }

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante creado exitosamente.');
    }

    public function show(User $estudiante)
    {
        // Verificar que sea estudiante
        if (!$estudiante->esEstudiante()) {
            abort(404, 'Estudiante no encontrado.');
        }

        // Cargar relaciones
        $estudiante->load([
            'roles.permissions',
            'permissions',
            'cursosComoEstudiante',
            'trabajos.tarea',
            'perfilVocacional',
            'rendimientoAcademico'
        ]);

        return Inertia::render('Estudiantes/Show', [
            'estudiante'      => $estudiante,
            'userRoles'       => $estudiante->roles->pluck('id')->toArray(),
            'userPermissions' => $estudiante->permissions->pluck('id')->toArray(),
            'allPermissions'  => $estudiante->getAllPermissions(),
        ]);
    }

    public function edit(User $estudiante)
    {
        // Verificar que sea estudiante
        if (!$estudiante->esEstudiante()) {
            abort(404, 'Estudiante no encontrado.');
        }

        // Cargar permisos directos y permisos de los roles
        $estudiante->load(['roles.permissions', 'permissions']);

        $roles       = Role::where('name', 'estudiante')->get();
        $permissions = Permission::where('name', 'like', 'estudiantes.%')
            ->orWhere('name', 'like', 'tareas.%')
            ->orWhere('name', 'like', 'evaluaciones.%')
            ->get()
            ->groupBy(function ($permission) {
                return explode('.', $permission->name)[0];
            });

        return Inertia::render('Estudiantes/Edit', [
            'estudiante'      => $estudiante,
            'roles'           => $roles,
            'permissions'     => $permissions,
            'userRoles'       => $estudiante->roles->pluck('id')->toArray(),
            'userPermissions' => $estudiante->permissions->pluck('id')->toArray(),
        ]);
    }

    public function update(Request $request, User $estudiante)
    {
        // Verificar que sea estudiante
        if (!$estudiante->esEstudiante()) {
            abort(404, 'Estudiante no encontrado.');
        }

        $validated = $request->validate([
            'name'              => ['required', 'string', 'max:255'],
            'apellido'          => ['nullable', 'string', 'max:255'],
            'usernick'          => ['required', 'string', 'max:255', Rule::unique('users')->ignore($estudiante->id)],
            'email'             => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($estudiante->id)],
            'password'          => ['nullable', 'string', 'min:8', 'confirmed'],
            'fecha_nacimiento'  => ['nullable', 'date'],
            'telefono'          => ['nullable', 'string', 'max:20'],
            'direccion'         => ['nullable', 'string', 'max:500'],
            'activo'            => ['boolean'],
            'permissions'       => ['array'],
            'permissions.*'     => ['exists:permissions,id'],
        ]);

        $estudiante->update([
            'name'             => $validated['name'],
            'apellido'         => $validated['apellido'] ?? null,
            'usernick'         => $validated['usernick'],
            'email'            => $validated['email'],
            'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
            'telefono'         => $validated['telefono'] ?? null,
            'direccion'        => $validated['direccion'] ?? null,
            'activo'           => $validated['activo'] ?? $estudiante->activo,
        ]);

        // Actualizar contraseña solo si se proporciona
        if (!empty($validated['password'])) {
            $estudiante->update(['password' => Hash::make($validated['password'])]);
        }

        // Sincronizar permisos directos
        if (isset($validated['permissions'])) {
            $estudiante->syncPermissions(Permission::whereIn('id', $validated['permissions'])->pluck('name'));
        } else {
            $estudiante->syncPermissions([]);
        }

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante actualizado exitosamente.');
    }

    public function destroy(User $estudiante)
    {
        // Verificar que sea estudiante
        if (!$estudiante->esEstudiante()) {
            abort(404, 'Estudiante no encontrado.');
        }

        // Evitar que el usuario se elimine a sí mismo
        if ($estudiante->id === Auth::id()) {
            return back()->with('error', 'No puedes eliminar tu propia cuenta.');
        }

        $estudiante->delete();

        return redirect()->route('estudiantes.index')
            ->with('success', 'Estudiante eliminado exitosamente.');
    }

    public function toggleStatus(User $estudiante)
    {
        // Verificar que sea estudiante
        if (!$estudiante->esEstudiante()) {
            abort(404, 'Estudiante no encontrado.');
        }

        // Evitar que el usuario se desactive a sí mismo
        if ($estudiante->id === Auth::id()) {
            return back()->with('error', 'No puedes desactivar tu propia cuenta.');
        }

        $estudiante->update(['activo' => !$estudiante->activo]);

        $status = $estudiante->activo ? 'activado' : 'desactivado';

        return back()->with('success', "Estudiante {$status} exitosamente.");
    }
}
