// Página Show de Lección - Visualización de Contenido Educativo
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
    ArrowRight,
    Edit,
    Trash2,
    MoreVertical,
    Clock,
    Download,
    Eye,
    Archive,
    Copy,
    CheckCircle2,
    Video,
    FileText,
    CheckSquare,
    HelpCircle,
    Paperclip,
    Link as LinkIcon,
    BookOpen,
    PlayCircle
} from 'lucide-react'
import type { LeccionShowPageProps } from '@/domain/modulos'
import { leccionesService } from '@/services/lecciones.service'

const tipoLeccionConfig = {
    'video': { icon: Video, label: 'Video', color: 'text-red-600', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
    'lectura': { icon: FileText, label: 'Lectura', color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' },
    'actividad': { icon: CheckSquare, label: 'Actividad', color: 'text-green-600', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
    'quiz': { icon: HelpCircle, label: 'Quiz', color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: 'border-purple-200' },
    'recurso': { icon: Paperclip, label: 'Recurso', color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
    'enlace': { icon: LinkIcon, label: 'Enlace', color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: 'border-indigo-200' }
}

// Función para extraer el ID de YouTube de una URL
function getYoutubeVideoId(url: string): string | null {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
}

// Función para extraer el ID de Vimeo de una URL
function getVimeoVideoId(url: string): string | null {
    const regExp = /(?:vimeo)\.com.*(?:videos|video|channels|)\/([\d]+)/i
    const match = url.match(regExp)
    return match ? match[1] : null
}

export default function Show({ leccion, leccion_anterior, leccion_siguiente }: LeccionShowPageProps) {
    const estadoConfig = {
        'borrador': { variant: 'secondary' as const, label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
        'publicado': { variant: 'default' as const, label: 'Publicado', className: 'bg-green-100 text-green-800' },
        'archivado': { variant: 'outline' as const, label: 'Archivado', className: 'bg-orange-100 text-orange-800' }
    }

    const currentEstado = estadoConfig[leccion.estado] || estadoConfig.borrador
    const tipoConfig = tipoLeccionConfig[leccion.tipo] || tipoLeccionConfig.lectura
    const TipoIcon = tipoConfig.icon

    // Renderizar el video según el proveedor
    const renderVideo = () => {
        if (!leccion.video_url) return null

        if (leccion.video_proveedor === 'youtube') {
            const videoId = getYoutubeVideoId(leccion.video_url)
            if (!videoId) return <p className="text-red-500">URL de YouTube inválida</p>

            return (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${videoId}`}
                        title={leccion.titulo}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )
        }

        if (leccion.video_proveedor === 'vimeo') {
            const videoId = getVimeoVideoId(leccion.video_url)
            if (!videoId) return <p className="text-red-500">URL de Vimeo inválida</p>

            return (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                    <iframe
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                        src={`https://player.vimeo.com/video/${videoId}`}
                        title={leccion.titulo}
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                    />
                </div>
            )
        }

        if (leccion.video_proveedor === 'local') {
            return (
                <video
                    className="w-full rounded-lg"
                    controls
                    src={leccion.video_url}
                >
                    Tu navegador no soporta el elemento de video.
                </video>
            )
        }

        return null
    }

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Lecciones', href: '/lecciones' },
                { title: leccion.titulo, href: `/lecciones/${leccion.id}` }
            ]}
        >
            <Head title={leccion.titulo} />

            <div className="py-12">
                <div className="mx-auto max-w-5xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header con navegación */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" asChild>
                                <Link href="/lecciones">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Volver
                                </Link>
                            </Button>
                        </div>

                        <div className="flex items-center gap-2">
                            {/* Navegación Anterior/Siguiente */}
                            {leccion_anterior && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/lecciones/${leccion_anterior.id}`}>
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Anterior
                                    </Link>
                                </Button>
                            )}

                            {leccion_siguiente && (
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/lecciones/${leccion_siguiente.id}`}>
                                        Siguiente
                                        <ArrowRight className="h-4 w-4 ml-2" />
                                    </Link>
                                </Button>
                            )}

                            {/* Menú de Acciones */}
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => leccionesService.edit(leccion.id)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => leccionesService.duplicar(leccion.id)}>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Duplicar
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    {leccion.estado !== 'publicado' && (
                                        <DropdownMenuItem onClick={() => leccionesService.publicar(leccion.id)}>
                                            <CheckCircle2 className="mr-2 h-4 w-4" />
                                            Publicar
                                        </DropdownMenuItem>
                                    )}
                                    {leccion.estado !== 'archivado' && (
                                        <DropdownMenuItem onClick={() => leccionesService.archivar(leccion.id)}>
                                            <Archive className="mr-2 h-4 w-4" />
                                            Archivar
                                        </DropdownMenuItem>
                                    )}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={() => leccionesService.destroy(leccion.id)}
                                        className="text-red-600"
                                    >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Eliminar
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Encabezado de la Lección */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className={`p-2 rounded-lg ${tipoConfig.bgColor} border ${tipoConfig.borderColor}`}>
                                            <TipoIcon className={`h-6 w-6 ${tipoConfig.color}`} />
                                        </div>
                                        <div>
                                            <Badge variant="outline" className="mb-2">
                                                {tipoConfig.label}
                                            </Badge>
                                            <CardTitle className="text-3xl">{leccion.titulo}</CardTitle>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 mt-4">
                                        <Badge variant={currentEstado.variant} className={currentEstado.className}>
                                            {currentEstado.label}
                                        </Badge>

                                        {leccion.duracion_estimada && (
                                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                <Clock className="w-4 h-4" />
                                                <span>{leccion.duracion_estimada} min</span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <BookOpen className="w-4 h-4" />
                                            <span>Lección #{leccion.orden}</span>
                                        </div>

                                        {leccion.es_obligatoria && (
                                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                                Obligatoria
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Contenido del Video */}
                    {leccion.tipo === 'video' && leccion.video_url && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <PlayCircle className="h-5 w-5 text-red-600" />
                                    <CardTitle>Video de la Lección</CardTitle>
                                </div>
                                <CardDescription>
                                    Proveedor: {leccion.video_proveedor === 'youtube' ? 'YouTube' :
                                               leccion.video_proveedor === 'vimeo' ? 'Vimeo' : 'Video Local'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {renderVideo()}
                            </CardContent>
                        </Card>
                    )}

                    {/* Contenido de Texto */}
                    {leccion.contenido && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Contenido</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {leccion.contenido}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Recursos Descargables */}
                    {leccion.recursos && leccion.recursos.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>Recursos de la Lección</CardTitle>
                                        <CardDescription>
                                            Material de apoyo y archivos descargables
                                        </CardDescription>
                                    </div>
                                    {!leccion.permite_descarga && (
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                            Descarga deshabilitada
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {leccion.recursos.map((recurso) => (
                                        <div
                                            key={recurso.id}
                                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        >
                                            <div className="flex items-center gap-3 flex-1">
                                                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                                                    <Paperclip className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="font-medium text-gray-900 dark:text-gray-100">
                                                        {recurso.nombre}
                                                    </div>
                                                    {recurso.descripcion && (
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {recurso.descripcion}
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="outline" className="text-xs">
                                                            {recurso.tipo}
                                                        </Badge>
                                                        {recurso.tamaño && (
                                                            <span className="text-xs text-muted-foreground">
                                                                {(recurso.tamaño / 1024 / 1024).toFixed(2)} MB
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {leccion.permite_descarga && (recurso.archivo_path || recurso.url) && (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    asChild
                                                >
                                                    <a
                                                        href={recurso.url || `/storage/${recurso.archivo_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download={recurso.archivo_path ? true : undefined}
                                                    >
                                                        <Download className="h-4 w-4 mr-2" />
                                                        Descargar
                                                    </a>
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Navegación Inferior */}
                    {(leccion_anterior || leccion_siguiente) && (
                        <div className="flex justify-between items-center pt-6 border-t">
                            <div className="flex-1">
                                {leccion_anterior && (
                                    <Link href={`/lecciones/${leccion_anterior.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="text-sm text-muted-foreground mb-1">Lección Anterior</div>
                                            <div className="flex items-center gap-2 text-primary group-hover:underline">
                                                <ArrowLeft className="h-4 w-4" />
                                                <span className="font-medium">{leccion_anterior.titulo}</span>
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>

                            <div className="flex-1 text-right">
                                {leccion_siguiente && (
                                    <Link href={`/lecciones/${leccion_siguiente.id}`}>
                                        <div className="group cursor-pointer">
                                            <div className="text-sm text-muted-foreground mb-1">Siguiente Lección</div>
                                            <div className="flex items-center justify-end gap-2 text-primary group-hover:underline">
                                                <span className="font-medium">{leccion_siguiente.titulo}</span>
                                                <ArrowRight className="h-4 w-4" />
                                            </div>
                                        </div>
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    )
}
