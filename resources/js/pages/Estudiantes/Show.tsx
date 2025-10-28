import { Link, Head, usePage } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Mail, User, Calendar, Shield, Phone, MapPin, GraduationCap, Cake } from 'lucide-react'
import Can from '@/components/auth/Can'
import { type BreadcrumbItem } from '@/types'

interface Estudiante {
    id: number
    name: string
    apellido?: string
    usernick: string
    email: string
    telefono?: string
    direccion?: string
    fecha_nacimiento?: string
    activo: boolean
    created_at: string
    updated_at: string
    roles: Array<{ id: number; name: string }>
    permissions: Array<{ id: number; name: string }>
    cursosComoEstudiante?: Array<{ id: number; nombre: string; profesor: { name: string } }>
    trabajos?: Array<{ id: number; tarea: { titulo: string }; calificacion?: number }>
}

interface PageProps {
    estudiante: Estudiante
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Estudiantes', href: '/estudiantes' },
    { title: 'Detalles', href: '#' },
]

export default function Show() {
    const { estudiante } = usePage<PageProps>().props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Estudiante: ${estudiante.name} ${estudiante.apellido || ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
                                <GraduationCap className="mr-2 h-6 w-6" />
                                Detalles del Estudiante
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Información completa del estudiante
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Link href="/estudiantes">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                            </Link>
                            <Can permission="estudiantes.edit">
                                <Link href={`/estudiantes/${estudiante.id}/edit`}>
                                    <Button>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </Button>
                                </Link>
                            </Can>
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Información Personal */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="mr-2 h-5 w-5" />
                                    Información Personal
                                </CardTitle>
                                <CardDescription>
                                    Datos personales del estudiante
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre completo
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {estudiante.name} {estudiante.apellido}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre de usuario
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        @{estudiante.usernick}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div className="flex-1">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Correo electrónico
                                        </Label>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {estudiante.email}
                                        </p>
                                    </div>
                                </div>

                                {estudiante.telefono && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Teléfono
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {estudiante.telefono}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {estudiante.direccion && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Dirección
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {estudiante.direccion}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {estudiante.fecha_nacimiento && (
                                    <div className="flex items-center space-x-2">
                                        <Cake className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Fecha de nacimiento
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {new Date(estudiante.fecha_nacimiento).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Estado
                                    </Label>
                                    <div className="mt-1">
                                        <Badge variant={estudiante.activo ? "default" : "secondary"}>
                                            {estudiante.activo ? 'Activo' : 'Inactivo'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Calendar className="h-4 w-4 text-gray-400" />
                                    <div className="flex-1">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Fecha de registro
                                        </Label>
                                        <p className="text-sm text-gray-900 dark:text-gray-100">
                                            {new Date(estudiante.created_at).toLocaleDateString('es-ES', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Roles y Permisos */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Shield className="mr-2 h-5 w-5" />
                                    Roles y Permisos
                                </CardTitle>
                                <CardDescription>
                                    Roles asignados y permisos del estudiante
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Roles asignados
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {estudiante.roles.length > 0 ? (
                                            estudiante.roles.map((role) => (
                                                <Badge key={role.id} variant="default">
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No tiene roles asignados
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Permisos adicionales
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {estudiante.permissions.length > 0 ? (
                                            estudiante.permissions.map((permission) => (
                                                <Badge key={permission.id} variant="outline">
                                                    {permission.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                No tiene permisos adicionales
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Información Académica */}
                        {estudiante.cursosComoEstudiante && estudiante.cursosComoEstudiante.length > 0 && (
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <GraduationCap className="mr-2 h-5 w-5" />
                                        Cursos Inscritos
                                    </CardTitle>
                                    <CardDescription>
                                        Cursos en los que está inscrito el estudiante
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {estudiante.cursosComoEstudiante.map((curso) => (
                                            <div key={curso.id} className="rounded-lg border p-4">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {curso.nombre}
                                                </h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Profesor: {curso.profesor.name}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`text-sm font-medium ${className}`}>
            {children}
        </div>
    )
}
