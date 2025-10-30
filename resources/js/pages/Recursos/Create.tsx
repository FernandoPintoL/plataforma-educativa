// Página Create de Recurso - Formulario con Upload de Archivos
import React, { useState } from 'react'
import { Head, useForm } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
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
    Save
} from 'lucide-react'
import type { RecursoFormData } from '@/domain/recursos'

const tipoRecursoConfig = {
    'video': { icon: Video, label: 'Video', color: 'text-red-600', description: 'Archivos de video (MP4, AVI, etc.)' },
    'documento': { icon: FileText, label: 'Documento', color: 'text-blue-600', description: 'PDFs, Word, Excel, etc.' },
    'imagen': { icon: Image, label: 'Imagen', color: 'text-green-600', description: 'JPG, PNG, GIF, SVG, etc.' },
    'audio': { icon: Music, label: 'Audio', color: 'text-purple-600', description: 'MP3, WAV, OGG, etc.' },
    'enlace': { icon: LinkIcon, label: 'Enlace', color: 'text-orange-600', description: 'Enlaces a recursos externos' },
    'presentacion': { icon: Presentation, label: 'Presentación', color: 'text-yellow-600', description: 'PowerPoint, Google Slides, etc.' }
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<RecursoFormData>({
        nombre: '',
        tipo: 'documento',
        descripcion: '',
        url: '',
        archivo: null,
        activo: true
    })

    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [sourceType, setSourceType] = useState<'file' | 'url'>('file')

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setSelectedFile(file)
            setData('archivo', file)

            // Auto-fill nombre si está vacío
            if (!data.nombre) {
                setData('nombre', file.name)
            }
        }
    }

    const removeFile = () => {
        setSelectedFile(null)
        setData('archivo', null)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        post('/recursos', {
            preserveScroll: true,
            forceFormData: true // Importante para enviar archivos
        })
    }

    const currentTipoConfig = tipoRecursoConfig[data.tipo]
    const TipoIcon = currentTipoConfig.icon

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Recursos', href: '/recursos' },
                { title: 'Crear Recurso', href: '/recursos/create' }
            ]}
        >
            <Head title="Crear Recurso" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Volver
                            </Button>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 mb-6">
                        <Folder className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Crear Nuevo Recurso</h1>
                            <p className="text-muted-foreground">
                                Sube archivos o agrega enlaces para usar en tus lecciones
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Información Básica */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                                <CardDescription>
                                    Datos fundamentales del recurso
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Nombre */}
                                <div>
                                    <Label htmlFor="nombre">
                                        Nombre del Recurso <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) => setData('nombre', e.target.value)}
                                        placeholder="Ej: Manual de Usuario en PDF"
                                        className="mt-1"
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-red-500 mt-1">{errors.nombre}</p>
                                    )}
                                </div>

                                {/* Tipo de Recurso */}
                                <div>
                                    <Label htmlFor="tipo">
                                        Tipo de Recurso <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {Object.entries(tipoRecursoConfig).map(([tipo, config]) => {
                                            const Icon = config.icon
                                            const isSelected = data.tipo === tipo
                                            return (
                                                <button
                                                    key={tipo}
                                                    type="button"
                                                    onClick={() => setData('tipo', tipo as any)}
                                                    className={`p-4 border-2 rounded-lg transition-all ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5 shadow-md'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                                >
                                                    <Icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                                                    <div className="font-medium text-sm">{config.label}</div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {config.description}
                                                    </div>
                                                </button>
                                            )
                                        })}
                                    </div>
                                    {errors.tipo && (
                                        <p className="text-sm text-red-500 mt-1">{errors.tipo}</p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div>
                                    <Label htmlFor="descripcion">Descripción</Label>
                                    <Textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) => setData('descripcion', e.target.value)}
                                        placeholder="Describe el contenido del recurso..."
                                        rows={3}
                                        className="mt-1"
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-red-500 mt-1">{errors.descripcion}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Fuente del Recurso */}
                        <Card className="mb-6">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TipoIcon className={`h-5 w-5 ${currentTipoConfig.color}`} />
                                    <CardTitle>Fuente del Recurso</CardTitle>
                                </div>
                                <CardDescription>
                                    Sube un archivo local o proporciona una URL externa
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Selector de tipo de fuente */}
                                <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setSourceType('file')}
                                        className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                                            sourceType === 'file'
                                                ? 'bg-white dark:bg-gray-700 shadow'
                                                : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        <Upload className="w-4 h-4 inline mr-2" />
                                        Subir Archivo
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSourceType('url')}
                                        className={`flex-1 py-2 px-4 rounded text-sm font-medium transition-colors ${
                                            sourceType === 'url'
                                                ? 'bg-white dark:bg-gray-700 shadow'
                                                : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                    >
                                        <LinkIcon className="w-4 h-4 inline mr-2" />
                                        URL Externa
                                    </button>
                                </div>

                                {/* Upload de archivo */}
                                {sourceType === 'file' && (
                                    <div>
                                        <Label htmlFor="archivo">
                                            Archivo <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="archivo"
                                            type="file"
                                            onChange={handleFileChange}
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Máximo 50MB por archivo
                                        </p>
                                        {errors.archivo && (
                                            <p className="text-sm text-red-500 mt-1">{errors.archivo}</p>
                                        )}

                                        {/* Preview del archivo seleccionado */}
                                        {selectedFile && (
                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded flex items-center justify-between">
                                                <div className="flex items-center gap-2 flex-1">
                                                    <TipoIcon className={`w-5 h-5 ${currentTipoConfig.color}`} />
                                                    <div className="flex-1">
                                                        <div className="font-medium text-sm">
                                                            {selectedFile.name}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </div>
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={removeFile}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* URL externa */}
                                {sourceType === 'url' && (
                                    <div>
                                        <Label htmlFor="url">
                                            URL del Recurso <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="url"
                                            type="url"
                                            value={data.url}
                                            onChange={(e) => setData('url', e.target.value)}
                                            placeholder="https://ejemplo.com/recurso.pdf"
                                            className="mt-1"
                                        />
                                        {errors.url && (
                                            <p className="text-sm text-red-500 mt-1">{errors.url}</p>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Configuración */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Configuración</CardTitle>
                                <CardDescription>
                                    Opciones adicionales del recurso
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Recurso Activo</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Los recursos activos están disponibles para asociar a lecciones
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.activo}
                                        onCheckedChange={(checked) => setData('activo', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botones de Acción */}
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-2" />
                                Crear Recurso
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => window.history.back()}
                                disabled={processing}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
