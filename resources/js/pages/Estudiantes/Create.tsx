import { Link, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InputError from '@/components/input-error'
import { ArrowLeft, Save, GraduationCap } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'
import { useEstudianteForm } from '@/hooks/use-estudiante-form'
import type { EstudianteCreatePageProps } from '@/domain/estudiantes'

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Estudiantes', href: '/estudiantes' },
    { title: 'Crear', href: '/estudiantes/create' },
]

export default function Create({ roles, permissions }: EstudianteCreatePageProps) {
    // Business Logic Layer - usando el hook personalizado
    const {
        data,
        setData,
        processing,
        errors,
        handleSubmit,
        handleCancel,
        handlePermissionChange,
    } = useEstudianteForm({ mode: 'create' })

    const onPermissionChange = (permissionId: string) => {
        handlePermissionChange(parseInt(permissionId))
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Estudiante" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
                                <GraduationCap className="mr-2 h-6 w-6" />
                                Crear Estudiante
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Registrar un nuevo estudiante en la plataforma
                            </p>
                        </div>
                        <Button variant="outline" onClick={handleCancel}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Estudiante</CardTitle>
                            <CardDescription>
                                Complete todos los campos requeridos para registrar el estudiante
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
                                            <Label htmlFor="password">Contraseña *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Mínimo 8 caracteres"
                                                required
                                            />
                                            <InputError message={errors.password} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password_confirmation">Confirmar contraseña *</Label>
                                            <Input
                                                id="password_confirmation"
                                                type="password"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Repita la contraseña"
                                                required
                                            />
                                            <InputError message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                {/* Permisos adicionales (opcional) */}
                                {permissions && Object.keys(permissions).length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                                            Permisos Adicionales (Opcional)
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                            El rol de estudiante ya incluye permisos básicos. Aquí puede agregar permisos especiales.
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
                                        {processing ? 'Creando...' : 'Crear Estudiante'}
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
