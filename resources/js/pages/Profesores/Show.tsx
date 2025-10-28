import { Link, Head, usePage } from '@inertiajs/react'
import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Mail, User, Calendar, Shield, Phone, MapPin, BookOpen, Cake, Briefcase } from 'lucide-react'
import Can from '@/components/auth/Can'
import { type BreadcrumbItem } from '@/types'

interface Profesor {
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
    cursosComoProfesor?: Array<{ id: number; nombre: string; estudiantes_count?: number }>
}

interface PageProps {
    profesor: Profesor
    [key: string]: unknown
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Profesores', href: '/profesores' },
    { title: 'Detalles', href: '#' },
]

export default function Show() {
    const { profesor } = usePage<PageProps>().props

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Profesor: ${profesor.name} ${profesor.apellido || ''}`} />

            <div className="py-12">
                <div className="mx-auto max-w-6xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center">
                                <Briefcase className="mr-2 h-6 w-6" />
                                Detalles del Profesor
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Información completa del profesor
                            </p>
                        </div>
                        <div className="flex space-x-2">
                            <Link href="/profesores">
                                <Button variant="outline">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Volver
                                </Button>
                            </Link>
                            <Can permission="profesores.edit">
                                <Link href={`/profesores/${profesor.id}/edit`}>
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
                                    Datos personales del profesor
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre completo
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        {profesor.name} {profesor.apellido}
                                    </p>
                                </div>

                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Nombre de usuario
                                    </Label>
                                    <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                        @{profesor.usernick}
                                    </p>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Mail className="h-4 w-4 text-gray-400" />
                                    <div className="flex-1">
                                        <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Correo electrónico
                                        </Label>
                                        <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                            {profesor.email}
                                        </p>
                                    </div>
                                </div>

                                {profesor.telefono && (
                                    <div className="flex items-center space-x-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Teléfono
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {profesor.telefono}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {profesor.direccion && (
                                    <div className="flex items-center space-x-2">
                                        <MapPin className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Dirección
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {profesor.direccion}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {profesor.fecha_nacimiento && (
                                    <div className="flex items-center space-x-2">
                                        <Cake className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1">
                                            <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Fecha de nacimiento
                                            </Label>
                                            <p className="text-base font-medium text-gray-900 dark:text-gray-100">
                                                {new Date(profesor.fecha_nacimiento).toLocaleDateString('es-ES', {
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
                                        <Badge variant={profesor.activo ? "default" : "secondary"}>
                                            {profesor.activo ? 'Activo' : 'Inactivo'}
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
                                            {new Date(profesor.created_at).toLocaleDateString('es-ES', {
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
                                    Roles asignados y permisos del profesor
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Roles asignados
                                    </Label>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {profesor.roles.length > 0 ? (
                                            profesor.roles.map((role) => (
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
                                        {profesor.permissions.length > 0 ? (
                                            profesor.permissions.map((permission) => (
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
                        {profesor.cursosComoProfesor && profesor.cursosComoProfesor.length > 0 && (
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <BookOpen className="mr-2 h-5 w-5" />
                                        Cursos que Imparte
                                    </CardTitle>
                                    <CardDescription>
                                        Cursos asignados al profesor
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 md:grid-cols-2">
                                        {profesor.cursosComoProfesor.map((curso) => (
                                            <div key={curso.id} className="rounded-lg border p-4">
                                                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                    {curso.nombre}
                                                </h4>
                                                {curso.estudiantes_count !== undefined && (
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        Estudiantes: {curso.estudiantes_count}
                                                    </p>
                                                )}
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
