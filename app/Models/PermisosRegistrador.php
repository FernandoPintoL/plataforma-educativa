<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;

class PermisosRegistrador extends Model
{
    /**
     * Registra un permiso si no existe
     *
     * @param string $nombre Nombre del permiso
     * @param string $descripcion Descripción del permiso
     * @return \Spatie\Permission\Models\Permission
     */
    public static function registrarPermiso($nombre, $descripcion = null)
    {
        $permiso = Permission::firstOrCreate(
            ['name' => $nombre],
            [
                'name'        => $nombre,
                'guard_name'  => 'web',
                'description' => $descripcion ?? ucfirst(str_replace(['.', '-', '_'], ' ', $nombre)),
            ]
        );

        return $permiso;
    }

    /**
     * Registra permisos de forma masiva
     *
     * @param array $permisos Arreglo asociativo de permisos [nombre => descripción]
     * @return array Permisos registrados
     */
    public static function registrarPermisos($permisos)
    {
        $registrados = [];

        foreach ($permisos as $nombre => $descripcion) {
            $registrados[] = self::registrarPermiso($nombre, $descripcion);
        }

        return $registrados;
    }
}
