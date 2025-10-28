import { Head, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { ArrowLeft, Save, Briefcase } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import { Badge } from '@/components/ui/badge'
import { useProfesorForm } from '@/hooks/use-profesor-form'
import type { ProfesorEditPageProps } from '@/domain/profesores'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profesores', href: '/profesores' },
    { title: 'Editar', href: '#' },
]

export default function Edit() {
    const { profesor, permissions, userPermissions } = usePage<ProfesorEditPageProps>().props

    // Business Logic Layer - usando el hook personalizado
    const {
        data,
        setData,
        processing,
        errors,
        handleSubmit,
        handleCancel,
        handlePermissionChange,
    } = useProfesorForm({
        mode: 'edit',
        profesorId: profesor.id,
        initialData: {
            name: profesor.name,
            apellido: profesor.apellido,
            usernick: profesor.usernick,
            email: profesor.email,
            fecha_nacimiento: profesor.fecha_nacimiento,
            telefono: profesor.telefono,
            direccion: profesor.direccion,
            activo: profesor.activo,
            permissions: userPermissions || [],
        },
    })

    const onPermissionChange = (permissionId: string) => {
        handlePermissionChange(parseInt(permissionId))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar Profesor: ${profesor.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
                                <Briefcase className="mr-2 h-6 w-6" />
                                Editar Profesor: {profesor.name} {profesor.apellido}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Actualiza la información del profesor
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleCancel}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Profesor</CardTitle>
                            <CardDescription>
                                Modifique los campos que desee actualizar
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Información Personal */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        Datos Personales
                                    </h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nombre *</Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Ej: Juan"
                                                required
                                            />
                                            <InputError message={errors.name} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="apellido">Apellido</Label>
                                            <Input
                                                id="apellido"
                                                type="text"
                                                value={data.apellido}
                                                onChange={(e) => setData('apellido', e.target.value)}
                                                placeholder="Ej: Pérez García"
                                            />
                                            <InputError message={errors.apellido} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="fecha_nacimiento">Fecha de Nacimiento</Label>
                                            <Input
                                                id="fecha_nacimiento"
                                                type="date"
                                                value={data.fecha_nacimiento}
                                                onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                                            />
                                            <InputError message={errors.fecha_nacimiento} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telefono">Teléfono</Label>
                                            <Input
                                                id="telefono"
                                                type="tel"
                                                value={data.telefono}
                                                onChange={(e) => setData('telefono', e.target.value)}
                                                placeholder="Ej: +1234567890"
                                            />
                                            <InputError message={errors.telefono} />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="direccion">Dirección</Label>
                                            <Input
                                                id="direccion"
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) => setData('direccion', e.target.value)}
                                                placeholder="Ej: Calle Principal #123, Ciudad"
                                            />
                                            <InputError message={errors.direccion} />
                                        </div>
                                    </div>
                                </div>

                                {/* Información de Acceso */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        Datos de Acceso
                                    </h3>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="usernick">Nombre de usuario *</Label>
                                            <Input
                                                id="usernick"
                                                type="text"
                                                value={data.usernick}
                                                onChange={(e) => setData('usernick', e.target.value)}
                                                placeholder="Ej: juan.perez"
                                                required
                                            />
                                            <InputError message={errors.usernick} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Correo electrónico *</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Ej: juan.perez@escuela.edu"
                                                required
                                            />
                                            <InputError message={errors.email} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Nueva contraseña (opcional)</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Dejar vacío para mantener la actual"
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirmar nueva contraseña</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirme la nueva contraseña"
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                {/* Estado */}
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        Estado del Profesor
                                    </h3>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="activo"
                                            checked={data.activo}
                                            onChange={(e) => setData('activo', e.target.checked)}
                                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <Label htmlFor="activo">
                                            Profesor activo
                                        </Label>
                                        <Badge variant={data.activo ? "default" : "secondary"} className="ml-2">
                                            {data.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Permisos adicionales */}
                                {permissions && Object.keys(permissions).length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            Permisos Adicionales
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            El rol de profesor ya incluye permisos básicos. Aquí puede modificar permisos especiales.
                                        </p>
                                        <div className="space-y-4">
                                            {Object.entries(permissions).map(([group, perms]) => (
                                                <div key={group}>
                                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        {group}
                                                    </h4>
                                                    <div className="grid gap-2 md:grid-cols-3">
                                                        {perms.map((perm) => (
                                                            <div key={perm.id} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`perm-${perm.id}`}
                                                                    checked={data.permissions.includes(perm.id)}
                                                                    onChange={() => onPermissionChange(perm.id.toString())}
                                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                                />
                                                                <label
                                                                    htmlFor={`perm-${perm.id}`}
                                                                    className="text-sm text-gray-700 dark:text-gray-300"
                                                                >
                                                                    {perm.name}
                                                                </label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <InputError message={errors.permissions} />
                                    </div>
                                )}

                                {/* Botones de acción */}
                                <div className="flex justify-end space-x-4 pt-4 border-t">
                                    <Button type="button" variant="outline" onClick={handleCancel}>
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        <Save className="mr-2 h-4 w-4" />
                                        {processing ? 'Actualizando...' : 'Actualizar Profesor'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
