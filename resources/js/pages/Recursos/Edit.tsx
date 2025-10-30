// Página Edit de Recurso - Formulario con Upload de Archivos
import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
    ArrowLeft,
    Folder,
    Video,
    FileText,
    Image,
    Music,
    Link as LinkIcon,
    Presentation,
    Upload,
    X,
    Save,
    AlertCircle,
    Eye,
    Download
} from 'lucide-react'
import type { RecursoFormData, RecursoEditPageProps } from '@/domain/recursos'
import { recursosService } from '@/services/recursos.service'

const tipoRecursoConfig = {
    'video': { icon: Video, label: 'Video', color: 'text-red-600', description: 'Archivos de video (MP4, AVI, etc.)' },
    'documento': { icon: FileText, label: 'Documento', color: 'text-blue-600', description: 'PDFs, Word, Excel, etc.' },
    'imagen': { icon: Image, label: 'Imagen', color: 'text-green-600', description: 'JPG, PNG, GIF, SVG, etc.' },
    'audio': { icon: Music, label: 'Audio', color: 'text-purple-600', description: 'MP3, WAV, OGG, etc.' },
    'enlace': { icon: LinkIcon, label: 'Enlace', color: 'text-orange-600', description: 'Enlaces a recursos externos' },
    'presentacion': { icon: Presentation, label: 'Presentación', color: 'text-yellow-600', description: 'PowerPoint, Google Slides, etc.' }
}

export default function Edit({ recurso }: RecursoEditPageProps) {
    const { data, setData, post, processing, errors } = useForm<RecursoFormData>({
        nombre: recurso.nombre,
        tipo: recurso.tipo,
        descripcion: recurso.descripcion || '',
        url: recurso.url || '',
        archivo: null,
        activo: recurso.activo,
        _method: 'PUT' as any
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [sourceType, setSourceType] = useState<'file' | 'url'>(
        recurso.archivo_path ? 'file' : 'url'
    )

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setData('archivo', file)
            setData('url', '') // Limpiar URL si se selecciona archivo
        }
    }

    const clearFile = () => {
        setSelectedFile(null)
        setData('archivo', null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        // Validar que haya URL o archivo
        if (sourceType === 'url' && !data.url) {
            alert('Debes proporcionar una URL')
            return
        }

        post(recursosService.updateUrl(recurso.id), {
            forceFormData: true,
        })
    }

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

    const SelectedIcon = tipoRecursoConfig[data.tipo].icon

    return (
        <AppLayout>
            <Head title={`Editar Recurso: ${recurso.nombre}`} />

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
                            <h1 className="text-2xl font-bold text-gray-900">Editar Recurso</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Modifica la información del recurso
                            </p>
                        </div>
                    </div>
                </div>

                {/* Archivo Actual */}
                {recurso.archivo_path && (
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            <div className="flex items-center justify-between">
                                <div>
                                    <strong>Archivo actual:</strong> {recurso.nombre}
                                    {recurso.tamaño && (
                                        <span className="ml-2 text-sm text-gray-500">
                                            ({formatFileSize(recurso.tamaño)})
                                        </span>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => recursosService.ver(recurso.id)}
                                    >
                                        <Eye className="h-4 w-4 mr-1" />
                                        Ver
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => recursosService.descargar(recurso.id)}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Descargar
                                    </Button>
                                </div>
                            </div>
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Recurso</CardTitle>
                            <CardDescription>
                                Actualiza los datos básicos del recurso
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Nombre */}
                            <div className="space-y-2">
                                <Label htmlFor="nombre">
                                    Nombre del Recurso <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="nombre"
                                    value={data.nombre}
                                    onChange={(e) => setData('nombre', e.target.value)}
                                    placeholder="Ej: Manual de usuario"
                                    required
                                />
                                {errors.nombre && (
                                    <p className="text-sm text-red-500">{errors.nombre}</p>
                                )}
                            </div>

                            {/* Tipo de Recurso */}
                            <div className="space-y-2">
                                <Label htmlFor="tipo">
                                    Tipo de Recurso <span className="text-red-500">*</span>
                                </Label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {Object.entries(tipoRecursoConfig).map(([key, config]) => {
                                        const Icon = config.icon
                                        const isSelected = data.tipo === key

                                        return (
                                            <button
                                                key={key}
                                                type="button"
                                                onClick={() => setData('tipo', key as any)}
                                                className={`
                                                    flex items-center space-x-3 p-4 rounded-lg border-2 transition-all
                                                    ${isSelected
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                    }
                                                `}
                                            >
                                                <Icon className={`h-5 w-5 ${config.color}`} />
                                                <div className="text-left">
                                                    <div className="font-medium text-sm">{config.label}</div>
                                                    <div className="text-xs text-gray-500">{config.description}</div>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                                {errors.tipo && (
                                    <p className="text-sm text-red-500">{errors.tipo}</p>
                                )}
                            </div>

                            {/* Descripción */}
                            <div className="space-y-2">
                                <Label htmlFor="descripcion">Descripción</Label>
                                <Textarea
                                    id="descripcion"
                                    value={data.descripcion}
                                    onChange={(e) => setData('descripcion', e.target.value)}
                                    placeholder="Describe brevemente el recurso..."
                                    rows={4}
                                />
                                {errors.descripcion && (
                                    <p className="text-sm text-red-500">{errors.descripcion}</p>
                                )}
                            </div>

                            {/* Estado Activo */}
                            <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-0.5">
                                    <Label>Estado</Label>
                                    <div className="text-sm text-gray-500">
                                        {data.activo ? 'El recurso está activo' : 'El recurso está inactivo'}
                                    </div>
                                </div>
                                <Switch
                                    checked={data.activo}
                                    onCheckedChange={(checked) => setData('activo', checked)}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Origen del Recurso */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Origen del Recurso</CardTitle>
                            <CardDescription>
                                Actualiza el archivo o URL del recurso (opcional)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Selector de tipo de origen */}
                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSourceType('file')
                                        setData('url', '')
                                    }}
                                    className={`
                                        flex-1 flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all
                                        ${sourceType === 'file'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <Upload className="h-5 w-5" />
                                    <span className="font-medium">Subir Archivo</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSourceType('url')
                                        clearFile()
                                    }}
                                    className={`
                                        flex-1 flex items-center justify-center space-x-2 p-4 rounded-lg border-2 transition-all
                                        ${sourceType === 'url'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-gray-200 hover:border-gray-300'
                                        }
                                    `}
                                >
                                    <LinkIcon className="h-5 w-5" />
                                    <span className="font-medium">URL Externa</span>
                                </button>
                            </div>

                            {/* Upload de archivo */}
                            {sourceType === 'file' && (
                                <div className="space-y-2">
                                    <Label htmlFor="archivo">Nuevo Archivo (opcional)</Label>
                                    {!selectedFile ? (
                                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                                            <input
                                                id="archivo"
                                                type="file"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                            <Label
                                                htmlFor="archivo"
                                                className="cursor-pointer flex flex-col items-center space-y-2"
                                            >
                                                <div className="p-3 bg-gray-100 rounded-full">
                                                    <Upload className="h-6 w-6 text-gray-600" />
                                                </div>
                                                <div>
                                                    <span className="text-primary font-medium">
                                                        Haz clic para subir
                                                    </span>
                                                    <span className="text-gray-500"> o arrastra y suelta</span>
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    Máximo 50MB
                                                </p>
                                            </Label>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                            <div className="flex items-center space-x-3">
                                                <div className="p-2 bg-white rounded-lg border">
                                                    <SelectedIcon className="h-5 w-5" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{selectedFile.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {formatFileSize(selectedFile.size)}
                                                    </p>
                                                </div>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={clearFile}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    )}
                                    {errors.archivo && (
                                        <p className="text-sm text-red-500">{errors.archivo}</p>
                                    )}
                                </div>
                            )}

                            {/* Campo de URL */}
                            {sourceType === 'url' && (
                                <div className="space-y-2">
                                    <Label htmlFor="url">URL del Recurso</Label>
                                    <Input
                                        id="url"
                                        type="url"
                                        value={data.url}
                                        onChange={(e) => setData('url', e.target.value)}
                                        placeholder="https://ejemplo.com/recurso"
                                    />
                                    {errors.url && (
                                        <p className="text-sm text-red-500">{errors.url}</p>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Botones de acción */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => recursosService.index()}
                            disabled={processing}
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-2" />
                            {processing ? 'Guardando...' : 'Guardar Cambios'}
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    )
}
