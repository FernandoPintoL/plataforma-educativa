// Página Create de Lección - Formulario Personalizado con Soporte Multimedia
import React, { useEffect } from 'react'
import { Head, useForm, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
    ArrowLeft,
    BookOpen,
    Video,
    FileText,
    CheckSquare,
    HelpCircle,
    Paperclip,
    Link as LinkIcon,
    Save,
    Send
} from 'lucide-react'
import type { LeccionCreatePageProps, LeccionFormData } from '@/domain/modulos'

const tipoLeccionConfig = {
    'video': { icon: Video, label: 'Video', color: 'text-red-600', description: 'Contenido en video (YouTube, Vimeo o local)' },
    'lectura': { icon: FileText, label: 'Lectura', color: 'text-blue-600', description: 'Texto educativo para leer' },
    'actividad': { icon: CheckSquare, label: 'Actividad', color: 'text-green-600', description: 'Ejercicio práctico para realizar' },
    'quiz': { icon: HelpCircle, label: 'Quiz', color: 'text-purple-600', description: 'Evaluación con preguntas' },
    'recurso': { icon: Paperclip, label: 'Recurso', color: 'text-yellow-600', description: 'Material descargable' },
    'enlace': { icon: LinkIcon, label: 'Enlace', color: 'text-indigo-600', description: 'Enlace a recurso externo' }
}

export default function Create({ modulos, modulo_id, recursos }: LeccionCreatePageProps) {
    const { data, setData, post, processing, errors } = useForm<LeccionFormData>({
        modulo_educativo_id: modulo_id || '',
        titulo: '',
        contenido: '',
        tipo: 'lectura',
        orden: 0,
        duracion_estimada: 0,
        video_url: '',
        video_proveedor: undefined,
        es_obligatoria: true,
        permite_descarga: true,
        estado: 'borrador',
        recursos: []
    })

    // Pre-fill modulo if provided in URL
    useEffect(() => {
        if (modulo_id && !data.modulo_educativo_id) {
            setData('modulo_educativo_id', modulo_id)
        }
    }, [modulo_id])

    const handleSubmit = (e: React.FormEvent, publicar = false) => {
        e.preventDefault()
        setData('estado', publicar ? 'publicado' : 'borrador')
        post('/lecciones', {
            preserveScroll: true
        })
    }

    const handleRecursoToggle = (recursoId: number, checked: boolean) => {
        const currentRecursos = data.recursos || []
        if (checked) {
            setData('recursos', [...currentRecursos, recursoId])
        } else {
            setData('recursos', currentRecursos.filter(id => id !== recursoId))
        }
    }

    const currentTipoConfig = tipoLeccionConfig[data.tipo]
    const TipoIcon = currentTipoConfig.icon

    return (
        <AppLayout
            breadcrumbs={[
                { title: 'Lecciones', href: '/lecciones' },
                { title: 'Crear Lección', href: '/lecciones/create' }
            ]}
        >
            <Head title="Crear Lección" />

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
                        <BookOpen className="h-8 w-8 text-primary" />
                        <div>
                            <h1 className="text-3xl font-bold">Crear Nueva Lección</h1>
                            <p className="text-muted-foreground">
                                Completa los datos para crear una nueva lección educativa
                            </p>
                        </div>
                    </div>

                    <form onSubmit={(e) => handleSubmit(e, false)}>
                        {/* Información Básica */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Información Básica</CardTitle>
                                <CardDescription>
                                    Datos fundamentales de la lección
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Módulo */}
                                <div>
                                    <Label htmlFor="modulo_educativo_id">
                                        Módulo Educativo <span className="text-red-500">*</span>
                                    </Label>
                                    <Select
                                        value={data.modulo_educativo_id.toString()}
                                        onValueChange={(value) => setData('modulo_educativo_id', Number(value))}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue placeholder="Selecciona un módulo" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {modulos.map((modulo) => (
                                                <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                                    {modulo.titulo} - {modulo.curso?.nombre || 'Sin curso'}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.modulo_educativo_id && (
                                        <p className="text-sm text-red-500 mt-1">{errors.modulo_educativo_id}</p>
                                    )}
                                </div>

                                {/* Título */}
                                <div>
                                    <Label htmlFor="titulo">
                                        Título de la Lección <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        placeholder="Ej: Introducción a las Variables en JavaScript"
                                        className="mt-1"
                                    />
                                    {errors.titulo && (
                                        <p className="text-sm text-red-500 mt-1">{errors.titulo}</p>
                                    )}
                                </div>

                                {/* Tipo de Lección */}
                                <div>
                                    <Label htmlFor="tipo">
                                        Tipo de Lección <span className="text-red-500">*</span>
                                    </Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {Object.entries(tipoLeccionConfig).map(([tipo, config]) => {
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

                                {/* Orden y Duración */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="orden">Orden</Label>
                                        <Input
                                            id="orden"
                                            type="number"
                                            value={data.orden || ''}
                                            onChange={(e) => setData('orden', Number(e.target.value))}
                                            min={0}
                                            placeholder="Se asigna automáticamente"
                                            className="mt-1"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Deja en 0 para asignar automáticamente
                                        </p>
                                        {errors.orden && (
                                            <p className="text-sm text-red-500 mt-1">{errors.orden}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="duracion_estimada">Duración Estimada (minutos)</Label>
                                        <Input
                                            id="duracion_estimada"
                                            type="number"
                                            value={data.duracion_estimada || ''}
                                            onChange={(e) => setData('duracion_estimada', Number(e.target.value))}
                                            min={0}
                                            placeholder="Ej: 15"
                                            className="mt-1"
                                        />
                                        {errors.duracion_estimada && (
                                            <p className="text-sm text-red-500 mt-1">{errors.duracion_estimada}</p>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contenido */}
                        <Card className="mb-6">
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <TipoIcon className={`h-5 w-5 ${currentTipoConfig.color}`} />
                                    <CardTitle>Contenido de la Lección</CardTitle>
                                </div>
                                <CardDescription>
                                    {currentTipoConfig.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Video Fields - Solo si el tipo es video */}
                                {data.tipo === 'video' && (
                                    <>
                                        <div>
                                            <Label htmlFor="video_proveedor">
                                                Proveedor de Video <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={data.video_proveedor || ''}
                                                onValueChange={(value) => setData('video_proveedor', value as any)}
                                            >
                                                <SelectTrigger className="mt-1">
                                                    <SelectValue placeholder="Selecciona el proveedor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="youtube">YouTube</SelectItem>
                                                    <SelectItem value="vimeo">Vimeo</SelectItem>
                                                    <SelectItem value="local">Video Local</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors.video_proveedor && (
                                                <p className="text-sm text-red-500 mt-1">{errors.video_proveedor}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="video_url">
                                                URL del Video <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="video_url"
                                                value={data.video_url || ''}
                                                onChange={(e) => setData('video_url', e.target.value)}
                                                placeholder={
                                                    data.video_proveedor === 'youtube'
                                                        ? 'https://www.youtube.com/watch?v=...'
                                                        : data.video_proveedor === 'vimeo'
                                                        ? 'https://vimeo.com/...'
                                                        : '/storage/videos/...'
                                                }
                                                className="mt-1"
                                            />
                                            {errors.video_url && (
                                                <p className="text-sm text-red-500 mt-1">{errors.video_url}</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Contenido - Para todos los tipos */}
                                <div>
                                    <Label htmlFor="contenido">
                                        Contenido
                                        {data.tipo === 'lectura' && <span className="text-red-500">*</span>}
                                    </Label>
                                    <Textarea
                                        id="contenido"
                                        value={data.contenido || ''}
                                        onChange={(e) => setData('contenido', e.target.value)}
                                        placeholder={
                                            data.tipo === 'video'
                                                ? 'Descripción del video, puntos clave, notas adicionales...'
                                                : data.tipo === 'lectura'
                                                ? 'Escribe el contenido educativo de la lección...'
                                                : data.tipo === 'actividad'
                                                ? 'Instrucciones de la actividad...'
                                                : 'Contenido adicional o instrucciones...'
                                        }
                                        rows={10}
                                        className="mt-1 font-mono text-sm"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Puedes usar Markdown para dar formato al texto
                                    </p>
                                    {errors.contenido && (
                                        <p className="text-sm text-red-500 mt-1">{errors.contenido}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recursos Asociados */}
                        {recursos.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader>
                                    <CardTitle>Recursos Asociados</CardTitle>
                                    <CardDescription>
                                        Selecciona los recursos que estarán disponibles para esta lección
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {recursos.map((recurso) => (
                                            <div key={recurso.id} className="flex items-start space-x-3">
                                                <Checkbox
                                                    id={`recurso-${recurso.id}`}
                                                    checked={data.recursos?.includes(recurso.id) || false}
                                                    onCheckedChange={(checked) =>
                                                        handleRecursoToggle(recurso.id, checked as boolean)
                                                    }
                                                />
                                                <div className="flex-1">
                                                    <Label
                                                        htmlFor={`recurso-${recurso.id}`}
                                                        className="font-medium cursor-pointer"
                                                    >
                                                        {recurso.nombre}
                                                    </Label>
                                                    {recurso.descripcion && (
                                                        <p className="text-sm text-muted-foreground">
                                                            {recurso.descripcion}
                                                        </p>
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
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Configuración */}
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Configuración</CardTitle>
                                <CardDescription>
                                    Opciones adicionales de la lección
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Es Obligatoria */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Lección Obligatoria</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Los estudiantes deben completar esta lección para avanzar
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.es_obligatoria}
                                        onCheckedChange={(checked) => setData('es_obligatoria', checked)}
                                    />
                                </div>

                                {/* Permite Descarga */}
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Permitir Descarga de Recursos</Label>
                                        <p className="text-sm text-muted-foreground">
                                            Los estudiantes pueden descargar los recursos asociados
                                        </p>
                                    </div>
                                    <Switch
                                        checked={data.permite_descarga}
                                        onCheckedChange={(checked) => setData('permite_descarga', checked)}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Botones de Acción */}
                        <div className="flex gap-4">
                            <Button type="submit" disabled={processing} variant="outline">
                                <Save className="h-4 w-4 mr-2" />
                                Guardar como Borrador
                            </Button>
                            <Button
                                type="button"
                                onClick={(e) => handleSubmit(e, true)}
                                disabled={processing}
                            >
                                <Send className="h-4 w-4 mr-2" />
                                Publicar Lección
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}
