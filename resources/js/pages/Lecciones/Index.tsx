// Página Index de Lecciones - Sistema Genérico
import { Badge } from '@/components/ui/badge'
import {
    Video,
    FileText,
    CheckSquare,
    HelpCircle,
    Paperclip,
    Link as LinkIcon,
    Clock,
    BookOpen
} from 'lucide-react'
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { leccionesService } from '@/services/lecciones.service'
import type { CrudConfig, TableColumn } from '@/domain/generic'
import type { Leccion, LeccionFormData, LeccionIndexPageProps } from '@/domain/modulos'

// Configuración de iconos y colores por tipo de lección
const tipoLeccionConfig = {
    'video': { icon: Video, label: 'Video', className: 'bg-red-50 text-red-700 dark:bg-red-900/20' },
    'lectura': { icon: FileText, label: 'Lectura', className: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20' },
    'actividad': { icon: CheckSquare, label: 'Actividad', className: 'bg-green-50 text-green-700 dark:bg-green-900/20' },
    'quiz': { icon: HelpCircle, label: 'Quiz', className: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20' },
    'recurso': { icon: Paperclip, label: 'Recurso', className: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20' },
    'enlace': { icon: LinkIcon, label: 'Enlace', className: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20' }
}

// Configuración del CRUD de lecciones
const leccionesConfig: CrudConfig<Leccion> = {
    // Identificación
    name: 'lección',
    pluralName: 'lecciones',

    // Títulos personalizados
    title: 'Lecciones Educativas',
    description: 'Gestiona el contenido educativo de cada módulo',

    // Configuración de columnas para la tabla
    columns: [
        {
            key: 'orden',
            label: '#',
            type: 'number',
            sortable: true,
            render: (value) => (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {value}
                </div>
            )
        },
        {
            key: 'titulo',
            label: 'Lección',
            type: 'custom',
            sortable: true,
            render: (value, entity: Leccion) => {
                const tipoConfig = tipoLeccionConfig[entity.tipo] || tipoLeccionConfig.lectura
                const TipoIcon = tipoConfig.icon

                return (
                    <div className="flex items-start gap-3">
                        <div className={`p-2 rounded ${tipoConfig.className}`}>
                            <TipoIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                {entity.titulo}
                            </div>
                            {entity.contenido && (
                                <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                    {entity.contenido}
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
                const config = tipoLeccionConfig[tipo] || tipoLeccionConfig.lectura
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
            key: 'modulo_educativo_id',
            label: 'Módulo',
            type: 'custom',
            sortable: false,
            render: (value, entity: Leccion) => {
                // Note: We'll need to add the modulo relationship to the Leccion interface
                // For now, just show the ID
                return (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        Módulo ID: {entity.modulo_educativo_id}
                    </div>
                )
            }
        },
        {
            key: 'duracion_estimada',
            label: 'Duración',
            type: 'custom',
            sortable: true,
            render: (value, entity: Leccion) => entity.duracion_estimada ? (
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{entity.duracion_estimada} min</span>
                </div>
            ) : (
                <span className="text-gray-400">-</span>
            )
        },
        {
            key: 'es_obligatoria',
            label: 'Obligatoria',
            type: 'custom',
            sortable: false,
            render: (value: unknown) => {
                const esObligatoria = value as boolean
                return esObligatoria ? (
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        Sí
                    </Badge>
                ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-600">
                        No
                    </Badge>
                )
            }
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'custom',
            sortable: true,
            render: (value: unknown) => {
                const estado = value as string
                const variants = {
                    'borrador': { variant: 'secondary' as const, label: 'Borrador', className: 'bg-gray-100 text-gray-800' },
                    'publicado': { variant: 'default' as const, label: 'Publicado', className: 'bg-green-100 text-green-800' },
                    'archivado': { variant: 'outline' as const, label: 'Archivado', className: 'bg-orange-100 text-orange-800' }
                }

                const config = variants[estado] || variants.borrador

                return (
                    <Badge variant={config.variant} className={config.className}>
                        {config.label}
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
    ] as TableColumn<Leccion>[],

    // Configuración de filtros
    filters: [
        {
            key: 'modulo_id',
            label: 'Módulo',
            type: 'select',
            options: [], // Se llenarán dinámicamente desde modulos
            extraDataKey: 'modulos',
            width: 'md'
        },
        {
            key: 'tipo',
            label: 'Tipo de Lección',
            type: 'select',
            options: [
                { value: 'video', label: 'Video' },
                { value: 'lectura', label: 'Lectura' },
                { value: 'actividad', label: 'Actividad' },
                { value: 'quiz', label: 'Quiz' },
                { value: 'recurso', label: 'Recurso' },
                { value: 'enlace', label: 'Enlace' }
            ],
            width: 'md'
        },
        {
            key: 'estado',
            label: 'Estado',
            type: 'select',
            options: [
                { value: 'borrador', label: 'Borrador' },
                { value: 'publicado', label: 'Publicado' },
                { value: 'archivado', label: 'Archivado' }
            ],
            width: 'md'
        }
    ],

    // Configuración de búsqueda
    searchPlaceholder: 'Buscar por título o contenido...',

    // Permisos (opcional)
    permissions: {
        create: 'lecciones.create',
        edit: 'lecciones.edit',
        delete: 'lecciones.destroy',
        view: 'lecciones.show'
    }
}

// Componente de la página - ¡Solo configuración!
export default function Index({ lecciones, modulos, filters }: LeccionIndexPageProps) {
    // Mapear módulos para el filtro
    const modulosOptions = modulos.map(modulo => ({
        value: modulo.id,
        label: `${modulo.titulo} - ${modulo.curso?.nombre || 'Sin curso'}`
    }))

    return (
        <GenericIndexPage<Leccion, LeccionFormData>
            data={lecciones}
            config={leccionesConfig}
            service={leccionesService}
            filters={filters}
            extraData={{ modulos: modulosOptions }}
            extraContent={
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                Gestión de Contenido Educativo
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Las lecciones son las unidades básicas de contenido. Cada lección pertenece a un módulo y puede ser de diferentes tipos: videos, lecturas, actividades, quizzes, recursos o enlaces externos.
                            </p>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
