// Página Show de Módulo Educativo - Personalizada con Gestión de Lecciones
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    ArrowLeft,
    Edit,
    Trash2,
    MoreVertical,
    Plus,
    BookOpen,
    Clock,
    ListChecks,
    Eye,
    Archive,
    Copy,
    CheckCircle2
} from 'lucide-react'
import type { ModuloEducativoShowPageProps } from '@/domain/modulos'
import { modulosEducativosService } from '@/services/modulos.service'
import { leccionesService } from '@/services/lecciones.service'

export default function Show({ modulo }: ModuloEducativoShowPageProps) {
    const estadoConfig = {
        'borrador': { variant: 'secondary' as const, label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
        'publicado': { variant: 'default' as const, label: 'Publicado', className: 'bg-green-100 text-green-800' },
        'archivado': { variant: 'outline' as const, label: 'Archivado', className: 'bg-orange-100 text-orange-800' }
    }

    const tipoLeccionConfig = {
        'video': { icon: '🎥', label: 'Video', className: 'bg-red-50 text-red-700' },
        'lectura': { icon: '📖', label: 'Lectura', className: 'bg-blue-50 text-blue-700' },
        'actividad': { icon: '✏️', label: 'Actividad', className: 'bg-green-50 text-green-700' },
        'quiz': { icon: '❓', label: 'Quiz', className: 'bg-purple-50 text-purple-700' },
        'recurso': { icon: '📎', label: 'Recurso', className: 'bg-yellow-50 text-yellow-700' },
        'enlace': { icon: '🔗', label: 'Enlace', className: 'bg-indigo-50 text-indigo-700' }
    }

    const currentEstado = estadoConfig[modulo.estado] || estadoConfig.borrador
    const lecciones = modulo.lecciones || []

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Módulos', href: '/modulos' },
                { title: modulo.titulo, href: `/modulos/${modulo.id}` }
            ]}
        >
            <Head title={modulo.titulo} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/modulos">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Link>
                            </Button>
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => modulosEducativosService.edit(modulo.id)}>
                                    <Edit className="mr-2 h-4 w-4" />
                                    Editar
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => modulosEducativosService.duplicar(modulo.id)}>
                                    <Copy className="mr-2 h-4 w-4" />
                                    Duplicar
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {modulo.estado !== 'publicado' && (
                                    <DropdownMenuItem onClick={() => modulosEducativosService.publicar(modulo.id)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Publicar
                                    </DropdownMenuItem>
                                )}
                                {modulo.estado !== 'archivado' && (
                                    <DropdownMenuItem onClick={() => modulosEducativosService.archivar(modulo.id)}>
                                        <Archive className="mr-2 h-4 w-4" />
                                        Archivar
                                    </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={() => modulosEducativosService.destroy(modulo.id, () => modulosEducativosService.index())}
                                    className="text-red-600"
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Eliminar
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Información del Módulo */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <CardTitle className="text-2xl">{modulo.titulo}</CardTitle>
                                        <Badge variant={currentEstado.variant} className={currentEstado.className}>
                                            {currentEstado.label}
                                        </Badge>
                                    </div>
                                    {modulo.descripcion && (
                                        <CardDescription className="text-base">
                                            {modulo.descripcion}
                                        </CardDescription>
                                    )}
                                </div>
                                {modulo.imagen_portada && (
                                    <img
                                        src={`/storage/${modulo.imagen_portada}`}
                                        alt={modulo.titulo}
                                        className="w-32 h-32 rounded-lg object-cover ml-6"
                                    />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                                    <BookOpen className="w-8 h-8 text-blue-600" />
                                    <div>
                                        <div className="text-sm text-blue-600 font-medium">Curso</div>
                                        <div className="text-lg font-semibold text-blue-900">
                                            {modulo.curso?.nombre || 'N/A'}
                                        </div>
                                        {modulo.curso?.codigo && (
                                            <div className="text-xs text-blue-600">{modulo.curso.codigo}</div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                                    <ListChecks className="w-8 h-8 text-purple-600" />
                                    <div>
                                        <div className="text-sm text-purple-600 font-medium">Lecciones</div>
                                        <div className="text-2xl font-bold text-purple-900">
                                            {modulo.total_lecciones || 0}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                                    <Clock className="w-8 h-8 text-green-600" />
                                    <div>
                                        <div className="text-sm text-green-600 font-medium">Duración</div>
                                        <div className="text-2xl font-bold text-green-900">
                                            {modulo.duracion_total || 0} min
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-lg">
                                    <div className="text-3xl">#{modulo.orden}</div>
                                    <div>
                                        <div className="text-sm text-orange-600 font-medium">Orden</div>
                                        <div className="text-sm text-orange-700">en el curso</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lecciones */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Lecciones</CardTitle>
                                    <CardDescription>
                                        Gestiona las lecciones de este módulo
                                    </CardDescription>
                                </div>
                                <Button onClick={() => leccionesService.create(modulo.id)}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nueva Lección
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {lecciones.length === 0 ? (
                                <div className="text-center py-12">
                                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-4">No hay lecciones en este módulo</p>
                                    <Button onClick={() => leccionesService.create(modulo.id)}>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Primera Lección
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {lecciones.map((leccion, index) => {
                                        const tipoConfig = tipoLeccionConfig[leccion.tipo] || tipoLeccionConfig.lectura
                                        const estadoLeccion = estadoConfig[leccion.estado] || estadoConfig.borrador

                                        return (
                                            <div
                                                key={leccion.id}
                                                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 font-semibold text-gray-700">
                                                    {leccion.orden}
                                                </div>

                                                <div className={`px-3 py-1 rounded text-sm font-medium ${tipoConfig.className}`}>
                                                    {tipoConfig.icon} {tipoConfig.label}
                                                </div>

                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900">{leccion.titulo}</div>
                                                    {leccion.duracion_estimada && (
                                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {leccion.duracion_estimada} min
                                                        </div>
                                                    )}
                                                </div>

                                                <Badge variant={estadoLeccion.variant} className={estadoLeccion.className}>
                                                    {estadoLeccion.label}
                                                </Badge>

                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => leccionesService.show(leccion.id)}
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => leccionesService.edit(leccion.id)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => leccionesService.destroy(leccion.id)}
                                                        className="text-red-600 hover:text-red-700"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
