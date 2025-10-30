// Página Index de Recursos - Sistema Genérico
import { Badge } from '@/components/ui/badge'
import {
    Video,
    FileText,
    Image,
    Music,
    Link as LinkIcon,
    Presentation,
    Folder,
    Download,
    Eye
} from 'lucide-react'
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { recursosService } from '@/services/recursos.service'
import type { CrudConfig, TableColumn } from '@/domain/generic'
import type { Recurso, RecursoFormData, RecursoIndexPageProps } from '@/domain/recursos'
import { Button } from '@/components/ui/button'

// Configuración de iconos y colores por tipo de recurso
const tipoRecursoConfig = {
    'video': { icon: Video, label: 'Video', className: 'bg-red-50 text-red-700 dark:bg-red-900/20' },
    'documento': { icon: FileText, label: 'Documento', className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20' },
    'imagen': { icon: Image, label: 'Imagen', className: 'bg-green-50 text-green-700 dark:bg-green-900/20' },
    'audio': { icon: Music, label: 'Audio', className: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20' },
    'enlace': { icon: LinkIcon, label: 'Enlace', className: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20' },
    'presentacion': { icon: Presentation, label: 'Presentación', className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20' }
}

// Función helper para formatear tamaño
function formatBytes(bytes?: number): string {
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

// Configuración del CRUD de recursos
const recursosConfig: CrudConfig<Recurso> = {
    // Identificación
    name: 'recurso',
    pluralName: 'recursos',

    // Títulos personalizados
    title: 'Recursos Educativos',
    description: 'Gestiona archivos y enlaces para el contenido educativo',

    // Configuración de columnas para la tabla
    columns: [
        {
            key: 'nombre',
            label: 'Recurso',
            type: 'custom',
            sortable: true,
            render: (value, entity: Recurso) => {
                const tipoConfig = tipoRecursoConfig[entity.tipo] || {
                    icon: Folder,
                    label: 'Archivo',
                    className: 'bg-gray-50 text-gray-700'
                }
                const TipoIcon = tipoConfig.icon

                return (
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${tipoConfig.className}`}>
                            <TipoIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {entity.nombre}
                            </div>
                            {entity.descripcion && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {entity.descripcion}
                                </div>
                            )}
                            {entity.mime_type && (
                                <div className="text-xs text-gray-400 mt-1">
                                    {entity.mime_type}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }
        },
        {
            key: 'tipo',
            label: 'Tipo',
            type: 'custom',
            sortable: true,
            render: (value: unknown) => {
                const tipo = value as string
                const config = tipoRecursoConfig[tipo] || {
                    icon: Folder,
                    label: 'Archivo',
                    className: 'bg-gray-50 text-gray-700'
                }
                const Icon = config.icon

                return (
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${config.className}`}>
                        <Icon className="w-3 h-3" />
                        {config.label}
                    </div>
                )
            }
        },
        {
            key: 'archivo_path',
            label: 'Fuente',
            type: 'custom',
            sortable: false,
            render: (value, entity: Recurso) => {
                if (entity.archivo_path) {
                    return (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Archivo Local
                        </Badge>
                    )
                }
                if (entity.url) {
                    return (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                            URL Externa
                        </Badge>
                    )
                }
                return <span className="text-gray-400">-</span>
            }
        },
        {
            key: 'tamaño',
            label: 'Tamaño',
            type: 'custom',
            sortable: true,
            render: (value, entity: Recurso) => (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    {formatBytes(entity.tamaño)}
                </span>
            )
        },
        {
            key: 'activo',
            label: 'Estado',
            type: 'custom',
            sortable: true,
            render: (value: unknown) => {
                const activo = value as boolean
                return activo ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                        Activo
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-gray-100 text-gray-600">
                        Inactivo
                    </Badge>
                )
            }
        },
        {
            key: 'created_at',
            label: 'Fecha Creación',
            type: 'date',
            sortable: true
        }
    ] as TableColumn<Recurso>[],

    // Acciones adicionales por fila
    rowActions: (recurso: Recurso) => (
        <div className="flex items-center gap-2">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => recursosService.ver(recurso.id)}
                title="Ver recurso"
            >
                <Eye className="h-4 w-4" />
            </Button>
            {recurso.archivo_path && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => recursosService.descargar(recurso.id)}
                    title="Descargar archivo"
                >
                    <Download className="h-4 w-4" />
                </Button>
            )}
        </div>
    ),

    // Configuración de filtros
    filters: [
        {
            key: 'tipo',
            label: 'Tipo de Recurso',
            type: 'select',
            options: [
                { value: 'video', label: 'Video' },
                { value: 'documento', label: 'Documento' },
                { value: 'imagen', label: 'Imagen' },
                { value: 'audio', label: 'Audio' },
                { value: 'enlace', label: 'Enlace' },
                { value: 'presentacion', label: 'Presentación' }
            ],
            width: 'md'
        },
        {
            key: 'activo',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'true', label: 'Activo' },
                { value: 'false', label: 'Inactivo' }
            ],
            width: 'sm'
        }
    ],

    // Configuración de búsqueda
    searchPlaceholder: 'Buscar por nombre o descripción...',

    // Permisos (opcional)
    permissions: {
        create: 'recursos.create',
        edit: 'recursos.edit',
        delete: 'recursos.destroy',
        view: 'recursos.show'
    }
}

// Componente de la página - ¡Solo configuración!
export default function Index({ recursos, filters }: RecursoIndexPageProps) {
    return (
        <GenericIndexPage<Recurso, RecursoFormData>
            data={recursos}
            config={recursosConfig}
            service={recursosService}
            filters={filters}
            extraContent={
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Folder className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                Gestión Centralizada de Recursos
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Los recursos son archivos y enlaces que puedes asociar a tus lecciones. Sube videos, documentos, imágenes, audios, presentaciones o agrega enlaces externos. Máximo 50MB por archivo.
                            </p>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
