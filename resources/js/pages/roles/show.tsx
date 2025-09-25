import { Link, Head } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Edit, Users, Shield } from 'lucide-react'
import Can from '@/components/auth/Can'
import { type BreadcrumbItem } from '@/types'

interface Permission {
    id: number
    name: string
}

interface User {
    id: number
    name: string
    email: string
}

interface Role {
    id: number
    name: string
    guard_name: string
    created_at: string
    permissions: Permission[]
    users: User[]
}

interface PageProps {
    role: Role
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestión de Roles',
        href: '/roles',
    },
    {
        title: 'Detalles del Rol',
        href: '/roles/show',
    },
]

export default function Show({ role }: PageProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Rol: ${role.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-semibold">Detalles del Rol</h1>
                        <p className="text-muted-foreground">
                            Información completa del rol y sus asignaciones.
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Can permission="roles.edit">
                            <Button variant="outline" asChild>
                                <Link href={`/roles/${role.id}/edit`}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </Link>
                            </Button>
                        </Can>
                        <Button variant="outline" asChild>
                            <Link href="/roles">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Información del Rol */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Shield className="mr-2 h-5 w-5" />
                                Información del Rol
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                                <p className="text-lg font-semibold">{role.name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Guard Name</Label>
                                <p>{role.guard_name}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Fecha de Creación</Label>
                                <p>{new Date(role.created_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Usuarios Asignados</Label>
                                <p className="text-2xl font-bold text-primary">{role.users.length}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-muted-foreground">Permisos Asignados</Label>
                                <p className="text-2xl font-bold text-primary">{role.permissions.length}</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Permisos */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Permisos Asignados</CardTitle>
                            <CardDescription>
                                Lista de permisos que tiene este rol.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {role.permissions.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {role.permissions.map((permission) => (
                                        <Badge key={permission.id} variant="secondary">
                                            {permission.name}
                                        </Badge>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No hay permisos asignados a este rol.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Usuarios Asignados */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Users className="mr-2 h-5 w-5" />
                                Usuarios Asignados
                            </CardTitle>
                            <CardDescription>
                                Usuarios que tienen este rol asignado.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {role.users.length > 0 ? (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {role.users.map((user) => (
                                        <div key={user.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                                            <div className="flex-1">
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-muted-foreground">{user.email}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground">No hay usuarios asignados a este rol.</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}