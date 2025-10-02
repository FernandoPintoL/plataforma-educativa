<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class GestionUsuariosController extends Controller
{
    /**
     * Constructor - verificar permisos de director
     */
    public function __construct()
    {
        $this->middleware('can:admin.usuarios');
    }

    /**
     * Listar todos los usuarios (profesores, estudiantes, padres)
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->with('roles')
            ->whereIn('tipo_usuario', ['profesor', 'estudiante', 'padre']);

        // Filtrar por tipo de usuario
        if ($request->has('tipo') && $request->tipo !== 'todos') {
            $query->where('tipo_usuario', $request->tipo);
        }

        // Buscar por nombre o email
        if ($request->has('search') && !empty($request->search)) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('apellido', 'like', '%' . $request->search . '%')
                    ->orWhere('email', 'like', '%' . $request->search . '%')
                    ->orWhere('usernick', 'like', '%' . $request->search . '%');
            });
        }

        // Filtrar por estado
        if ($request->has('activo')) {
            $query->where('activo', $request->activo);
        }

        $usuarios = $query->orderBy('created_at', 'desc')
            ->paginate(15)
            ->withQueryString();

        $estadisticas = [
            'total' => User::whereIn('tipo_usuario', ['profesor', 'estudiante', 'padre'])->count(),
            'profesores' => User::where('tipo_usuario', 'profesor')->count(),
            'estudiantes' => User::where('tipo_usuario', 'estudiante')->count(),
            'padres' => User::where('tipo_usuario', 'padre')->count(),
            'activos' => User::whereIn('tipo_usuario', ['profesor', 'estudiante', 'padre'])
                ->where('activo', true)
                ->count(),
        ];

        return Inertia::render('Admin/Usuarios/Index', [
            'usuarios' => $usuarios,
            'estadisticas' => $estadisticas,
            'filtros' => $request->only(['tipo', 'search', 'activo']),
        ]);
    }

    /**
     * Mostrar formulario de creación
     */
    public function create()
    {
        return Inertia::render('Admin/Usuarios/Create', [
            'tiposUsuario' => [
                ['value' => 'profesor', 'label' => 'Profesor'],
                ['value' => 'estudiante', 'label' => 'Estudiante'],
                ['value' => 'padre', 'label' => 'Padre/Tutor'],
            ],
        ]);
    }

    /**
     * Crear nuevo usuario
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'usernick' => ['required', 'string', 'max:50', 'unique:users', 'alpha_dash'],
            'tipo_usuario' => ['required', Rule::in(['profesor', 'estudiante', 'padre'])],
            'fecha_nacimiento' => ['nullable', 'date', 'before:today'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'generar_password' => ['boolean'],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
            'enviar_email' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            // Generar contraseña si se solicitó
            if ($validated['generar_password'] ?? false) {
                $password = $this->generarPasswordSegura();
                $validated['password'] = $password;
            } else {
                $password = $validated['password'] ?? 'password';
            }

            // Crear el usuario
            $user = User::create([
                'name' => $validated['name'],
                'apellido' => $validated['apellido'],
                'email' => $validated['email'],
                'usernick' => $validated['usernick'],
                'tipo_usuario' => $validated['tipo_usuario'],
                'fecha_nacimiento' => $validated['fecha_nacimiento'] ?? null,
                'telefono' => $validated['telefono'] ?? null,
                'direccion' => $validated['direccion'] ?? null,
                'password' => Hash::make($password),
                'activo' => true,
            ]);

            // Asignar rol según tipo de usuario
            $roleName = ucfirst($validated['tipo_usuario']);
            $user->assignRole($roleName);

            DB::commit();

            // Enviar email con credenciales si se solicitó
            if ($validated['enviar_email'] ?? false) {
                // TODO: Implementar envío de email
                // Mail::to($user->email)->send(new CredencialesUsuarioMail($user, $password));
            }

            return redirect()
                ->route('admin.usuarios.index')
                ->with('success', "Usuario {$user->nombre_completo} creado exitosamente." .
                    ($validated['enviar_email'] ?? false ? ' Se han enviado las credenciales por email.' :
                    " Contraseña: {$password}"));

        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al crear el usuario: ' . $e->getMessage()]);
        }
    }

    /**
     * Mostrar detalle de usuario
     */
    public function show(User $usuario)
    {
        $usuario->load(['roles', 'cursosComoProfesor', 'cursosComoEstudiante']);

        $estadisticas = [];

        if ($usuario->esProfesor()) {
            $estadisticas = [
                'cursos_dictados' => $usuario->cursosComoProfesor()->count(),
                'estudiantes_total' => $usuario->cursosComoProfesor()
                    ->withCount('estudiantes')
                    ->get()
                    ->sum('estudiantes_count'),
            ];
        } elseif ($usuario->esEstudiante()) {
            $estadisticas = [
                'cursos_inscritos' => $usuario->cursosComoEstudiante()->count(),
                'trabajos_entregados' => $usuario->trabajos()->count(),
                'promedio_general' => $this->calcularPromedioEstudiante($usuario),
            ];
        }

        return Inertia::render('Admin/Usuarios/Show', [
            'usuario' => $usuario,
            'estadisticas' => $estadisticas,
        ]);
    }

    /**
     * Mostrar formulario de edición
     */
    public function edit(User $usuario)
    {
        return Inertia::render('Admin/Usuarios/Edit', [
            'usuario' => $usuario,
            'tiposUsuario' => [
                ['value' => 'profesor', 'label' => 'Profesor'],
                ['value' => 'estudiante', 'label' => 'Estudiante'],
                ['value' => 'padre', 'label' => 'Padre/Tutor'],
            ],
        ]);
    }

    /**
     * Actualizar usuario
     */
    public function update(Request $request, User $usuario)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'apellido' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($usuario->id)],
            'usernick' => ['required', 'string', 'max:50', Rule::unique('users')->ignore($usuario->id), 'alpha_dash'],
            'tipo_usuario' => ['required', Rule::in(['profesor', 'estudiante', 'padre'])],
            'fecha_nacimiento' => ['nullable', 'date', 'before:today'],
            'telefono' => ['nullable', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:500'],
            'activo' => ['boolean'],
        ]);

        DB::beginTransaction();

        try {
            // Actualizar datos del usuario
            $usuario->update($validated);

            // Si cambió el tipo de usuario, actualizar rol
            if ($usuario->wasChanged('tipo_usuario')) {
                $usuario->syncRoles([ucfirst($validated['tipo_usuario'])]);
            }

            DB::commit();

            return redirect()
                ->route('admin.usuarios.show', $usuario)
                ->with('success', 'Usuario actualizado exitosamente.');

        } catch (\Exception $e) {
            DB::rollBack();
            return back()
                ->withInput()
                ->withErrors(['error' => 'Error al actualizar el usuario: ' . $e->getMessage()]);
        }
    }

    /**
     * Eliminar usuario (desactivar)
     */
    public function destroy(User $usuario)
    {
        try {
            // No eliminar físicamente, solo desactivar
            $usuario->update(['activo' => false]);

            return redirect()
                ->route('admin.usuarios.index')
                ->with('success', 'Usuario desactivado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al desactivar el usuario: ' . $e->getMessage()]);
        }
    }

    /**
     * Reactivar usuario
     */
    public function reactivar(User $usuario)
    {
        try {
            $usuario->update(['activo' => true]);

            return redirect()
                ->route('admin.usuarios.show', $usuario)
                ->with('success', 'Usuario reactivado exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al reactivar el usuario: ' . $e->getMessage()]);
        }
    }

    /**
     * Resetear contraseña
     */
    public function resetPassword(Request $request, User $usuario)
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        try {
            $usuario->update([
                'password' => Hash::make($validated['password']),
            ]);

            return back()->with('success', 'Contraseña actualizada exitosamente.');

        } catch (\Exception $e) {
            return back()
                ->withErrors(['error' => 'Error al resetear la contraseña: ' . $e->getMessage()]);
        }
    }

    // ==================== MÉTODOS AUXILIARES ====================

    /**
     * Generar una contraseña segura aleatoria
     */
    private function generarPasswordSegura(): string
    {
        $letras = 'abcdefghijklmnopqrstuvwxyz';
        $numeros = '0123456789';
        $mayusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $especiales = '!@#$%&*';

        $password = '';
        $password .= $mayusculas[rand(0, strlen($mayusculas) - 1)];
        $password .= $letras[rand(0, strlen($letras) - 1)];
        $password .= $numeros[rand(0, strlen($numeros) - 1)];
        $password .= $especiales[rand(0, strlen($especiales) - 1)];

        $todos = $letras . $mayusculas . $numeros;
        for ($i = 0; $i < 8; $i++) {
            $password .= $todos[rand(0, strlen($todos) - 1)];
        }

        return str_shuffle($password);
    }

    /**
     * Calcular promedio general de un estudiante
     */
    private function calcularPromedioEstudiante(User $estudiante): ?float
    {
        // TODO: Implementar cálculo real de promedio desde calificaciones
        return null;
    }
}
