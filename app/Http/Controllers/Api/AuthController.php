<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Login de usuario para API
     */
    public function login(Request $request)
    {
        $request->validate([
            'login' => 'required|string', // Puede ser email o usernick
            'password' => 'required',
        ]);

        // Buscar usuario por email o usernick
        $user = User::where(function ($query) use ($request) {
            $query->where('email', $request->login)
                ->orWhere('usernick', $request->login);
        })->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login' => ['Las credenciales proporcionadas son incorrectas.'],
            ]);
        }

        // Verificar si el usuario está activo
        if (! $user->activo) {
            throw ValidationException::withMessages([
                'login' => ['Tu cuenta está desactivada. Contacta al administrador.'],
            ]);
        }

        // Revocar tokens anteriores (opcional)
        $user->tokens()->delete();

        // Crear nuevo token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
            ],
            'token' => $token,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    /**
     * Registro de usuario para API
     */
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'usernick' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $request->name,
            'usernick' => $request->usernick,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'activo' => true,
        ]);

        // Asignar rol por defecto (cliente)
        $user->assignRole('cliente');

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
            ],
            'token' => $token,
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ], 201);
    }

    /**
     * Logout de usuario para API
     */
    public function logout(Request $request)
    {
        // Revocar el token actual
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Sesión cerrada exitosamente']);
    }

    /**
     * Obtener información del usuario actual
     */
    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'usernick' => $user->usernick,
                'email' => $user->email,
                'activo' => $user->activo,
            ],
            'roles' => $user->roles->pluck('name'),
            'permissions' => $user->getAllPermissions()->pluck('name'),
        ]);
    }

    /**
     * Refresh token (opcional)
     */
    public function refresh(Request $request)
    {
        $user = $request->user();

        // Revocar token actual
        $request->user()->currentAccessToken()->delete();

        // Crear nuevo token
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
        ]);
    }
}
