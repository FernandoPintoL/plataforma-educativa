import { Link, useForm, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import InputError from '@/components/input-error'
import toast from 'react-hot-toast'
import { ArrowLeft, Save } from 'lucide-react'
import { type BreadcrumbItem } from '@/types'

interface Permission {
    id: number
    name: string
}

interface PermissionGroup {
    [key: string]: Permission[]
}

interface PageProps {
    permissions: PermissionGroup
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Roles',
        href: '/roles',
    },
    {
        title: 'Crear Rol',
        href: '/roles/create',
    },
]

export default function Create({ permissions }: PageProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        guard_name: 'web',
        permissions: [] as number[],
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        post('/roles', {
            onSuccess: () => {
                reset()
                toast.success('Rol creado exitosamente.')
            },
            onError: () => {
                toast.error('Error al crear el rol.')
            },
        })
    }

    const handlePermissionChange = (permissionId: number, checked: boolean) => {
        if (checked) {
            setData('permissions', [...data.permissions, permissionId])
        } else {
            setData('permissions', data.permissions.filter(id => id !== permissionId))
        }
    }

    const isPermissionSelected = (permissionId: number) => {
        return data.permissions.includes(permissionId)
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Crear Rol" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Crear Nuevo Rol</h1>
                        <p className="text-muted-foreground">
                            Crea un nuevo rol y asigna los permisos correspondientes.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href="/roles">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Volver
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Rol</CardTitle>
                        <CardDescription>
                            Complete la información requerida para crear el rol.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Nombre del Rol</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Ej: Administrador, Vendedor, etc."
                                        required
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="guard_name">Guard Name</Label>
                                    <Input
                                        id="guard_name"
                                        type="text"
                                        value={data.guard_name}
                                        onChange={(e) => setData('guard_name', e.target.value)}
                                        placeholder="web"
                                        required
                                    />
                                    <InputError message={errors.guard_name} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label>Permisos</Label>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {Object.entries(permissions).map(([module, modulePermissions]) => (
                                        <div key={module} className="space-y-3">
                                            <h4 className="font-medium text-sm uppercase tracking-wide text-muted-foreground">
                                                {module}
                                            </h4>
                                            <div className="space-y-2">
                                                {modulePermissions.map((permission) => (
                                                    <div key={permission.id} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`permission-${permission.id}`}
                                                            checked={isPermissionSelected(permission.id)}
                                                            onCheckedChange={(checked) =>
                                                                handlePermissionChange(permission.id, checked as boolean)
                                                            }
                                                        />
                                                        <Label
                                                            htmlFor={`permission-${permission.id}`}
                                                            className="text-sm font-normal"
                                                        >
                                                            {permission.name.replace(`${module}.`, '')}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <InputError message={errors.permissions} />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/roles">Cancelar</Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {processing ? 'Creando...' : 'Crear Rol'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}