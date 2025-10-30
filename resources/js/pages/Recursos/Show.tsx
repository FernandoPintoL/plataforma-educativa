// Página Show de Recurso - Visualización de detalles
import React from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    Video,
    FileText,
    Image,
    Music,
    Link as LinkIcon,
    Presentation,
    Eye,
    Download,
    Edit,
    Calendar,
    Clock,
    FileType,
    HardDrive,
    CheckCircle,
    XCircle,
    ExternalLink
} from 'lucide-react'
import type { RecursoShowPageProps } from '@/domain/recursos'
import { recursosService } from '@/services/recursos.service'

const tipoRecursoConfig = {
    'video': { icon: Video, label: 'Video', color: 'text-red-600', bgColor: 'bg-red-50' },
    'documento': { icon: FileText, label: 'Documento', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    'imagen': { icon: Image, label: 'Imagen', color: 'text-green-600', bgColor: 'bg-green-50' },
    'audio': { icon: Music, label: 'Audio', color: 'text-purple-600', bgColor: 'bg-purple-50' },
    'enlace': { icon: LinkIcon, label: 'Enlace', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    'presentacion': { icon: Presentation, label: 'Presentación', color: 'text-yellow-600', bgColor: 'bg-yellow-50' }
}

export default function Show({ recurso }: RecursoShowPageProps) {
    const tipoConfig = tipoRecursoConfig[recurso.tipo]
    const TipoIcon = tipoConfig.icon

    const formatFileSize = (bytes?: number): string => {
        if (!bytes) return 'N/A'
        const units = ['B', 'KB', 'MB', 'GB']
        let size = bytes
        let unitIndex = 0

        while (size > 1024 && unitIndex < units.length - 1) {
            size /= 1024
            unitIndex++
        }

        return `${size.toFixed(2)} ${units[unitIndex]}`
    }

    const formatDate = (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <AppLayout>
            <Head title={`Recurso: ${recurso.nombre}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => recursosService.index()}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Volver
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{recurso.nombre}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="outline"
                                    className={`${tipoConfig.color} border-current`}
                                >
                                    <TipoIcon className="h-3 w-3 mr-1" />
                                    {tipoConfig.label}
                                </Badge>
                                {recurso.activo ? (
                                    <Badge variant="outline" className="text-green-600 border-green-600">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Activo
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="text-red-600 border-red-600">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Inactivo
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2">
                        {recurso.archivo_path && (
                            <>
                                <Button
                                    variant="outline"
                                    onClick={() => recursosService.ver(recurso.id)}
                                >
                                    <Eye className="h-4 w-4 mr-2" />
                                    Ver
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => recursosService.descargar(recurso.id)}
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Descargar
                                </Button>
                            </>
                        )}
                        {recurso.url && (
                            <Button
                                variant="outline"
                                onClick={() => window.open(recurso.url, '_blank')}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Abrir enlace
                            </Button>
                        )}
                        <Button onClick={() => recursosService.edit(recurso.id)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Información Principal */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Descripción */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Descripción</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recurso.descripcion ? (
                                    <p className="text-gray-700 whitespace-pre-wrap">
                                        {recurso.descripcion}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic">Sin descripción</p>
                                )}
                            </CardContent>
                        </Card>

                        {/* Vista previa del recurso */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Vista Previa</CardTitle>
                                <CardDescription>
                                    Información del recurso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className={`flex items-center justify-center p-12 rounded-lg ${tipoConfig.bgColor}`}>
                                    <div className="text-center">
                                        <div className={`inline-flex p-6 rounded-full ${tipoConfig.bgColor} border-2 border-current ${tipoConfig.color} mb-4`}>
                                            <TipoIcon className="h-16 w-16" />
                                        </div>
                                        <h3 className="text-xl font-semibold mb-2">{recurso.nombre}</h3>
                                        <p className={`text-sm ${tipoConfig.color} font-medium`}>
                                            {tipoConfig.label}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Información Lateral */}
                    <div className="space-y-6">
                        {/* Detalles Técnicos */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Detalles Técnicos</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Tipo de archivo */}
                                {recurso.archivo_path && (
                                    <>
                                        <div className="flex items-start space-x-3">
                                            <FileType className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">Tipo MIME</p>
                                                <p className="text-sm text-gray-500">
                                                    {recurso.mime_type || 'No especificado'}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <HardDrive className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">Tamaño</p>
                                                <p className="text-sm text-gray-500">
                                                    {formatFileSize(recurso.tamaño)}
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {recurso.url && (
                                    <div className="flex items-start space-x-3">
                                        <LinkIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">URL</p>
                                            <p className="text-sm text-gray-500 break-all">
                                                {recurso.url}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3">
                                    <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Creado</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(recurso.created_at)}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-900">Última actualización</p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(recurso.updated_at)}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Acciones */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Acciones</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {recurso.archivo_path && (
                                    <>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => recursosService.ver(recurso.id)}
                                        >
                                            <Eye className="h-4 w-4 mr-2" />
                                            Ver recurso
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start"
                                            onClick={() => recursosService.descargar(recurso.id)}
                                        >
                                            <Download className="h-4 w-4 mr-2" />
                                            Descargar
                                        </Button>
                                    </>
                                )}
                                {recurso.url && (
                                    <Button
                                        variant="outline"
                                        className="w-full justify-start"
                                        onClick={() => window.open(recurso.url, '_blank')}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Abrir enlace externo
                                    </Button>
                                )}
                                <Button
                                    className="w-full justify-start"
                                    onClick={() => recursosService.edit(recurso.id)}
                                >
                                    <Edit className="h-4 w-4 mr-2" />
                                    Editar recurso
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}
