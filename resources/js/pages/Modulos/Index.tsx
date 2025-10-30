// Página Index de Módulos Educativos - Sistema Genérico
import { Badge } from '@/components/ui/badge'
import { BookOpen, Clock, ListChecks } from 'lucide-react'
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { modulosEducativosService } from '@/services/modulos.service'
import type { CrudConfig, TableColumn } from '@/domain/generic'
import type { ModuloEducativo, ModuloEducativoFormData, ModuloEducativoIndexPageProps } from '@/domain/modulos'

// Configuración del CRUD de módulos educativos
const modulosConfig: CrudConfig<ModuloEducativo> = {
    // Identificación
    name: 'módulo',
    pluralName: 'modulos',

    // Títulos personalizados
    title: 'Módulos Educativos',
    description: 'Gestiona los módulos educativos y su contenido',

    // Configuración de columnas para la tabla
    columns: [
        {
            key: 'orden',
            label: 'Orden',
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
            label: 'Módulo',
            type: 'custom',
            sortable: true,
            render: (value, entity: ModuloEducativo) => (
                <div className="flex items-start gap-3">
                    {entity.imagen_portada && (
                        <img
                            src={`/storage/${entity.imagen_portada}`}
                            alt={entity.titulo}
                            className="w-12 h-12 rounded object-cover"
                        />
                    )}
                    <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-gray-100">
                            {entity.titulo}
                        </div>
                        {entity.descripcion && (
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                                {entity.descripcion}
                            </div>
                        )}
                    </div>
                </div>
            )
        },
        {
            key: 'curso_id',
            label: 'Curso',
            type: 'custom',
            sortable: false,
            render: (value, entity: ModuloEducativo) => entity.curso ? (
                <div>
                    <div className="font-medium text-sm">{entity.curso.nombre}</div>
                    <div className="text-xs text-gray-500">{entity.curso.codigo}</div>
                </div>
            ) : '-'
        },
        {
            key: 'total_lecciones',
            label: 'Lecciones',
            type: 'custom',
            sortable: false,
            render: (value, entity: ModuloEducativo) => (
                <div className="flex items-center gap-2">
                    <ListChecks className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{entity.total_lecciones || 0}</span>
                </div>
            )
        },
        {
            key: 'duracion_total',
            label: 'Duración',
            type: 'custom',
            sortable: false,
            render: (value, entity: ModuloEducativo) => entity.duracion_total ? (
                <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>{entity.duracion_total} min</span>
                </div>
            ) : (
                <span className="text-gray-400">-</span>
            )
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
    ] as TableColumn<ModuloEducativo>[],

    // Configuración de filtros
    filters: [
        {
            key: 'curso_id',
            label: 'Curso',
            type: 'select',
            options: [], // Se llenarán dinámicamente desde cursos
            extraDataKey: 'cursos',
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
    searchPlaceholder: 'Buscar por título o descripción...',

    // Permisos (opcional)
    permissions: {
        create: 'modulos.create',
        edit: 'modulos.edit',
        delete: 'modulos.destroy',
        view: 'modulos.show'
    }
}

// Componente de la página - ¡Solo configuración!
export default function Index({ modulos, cursos, filters }: ModuloEducativoIndexPageProps) {
    // Mapear cursos para el filtro
    const cursosOptions = cursos.map(curso => ({
        value: curso.id,
        label: `${curso.nombre} (${curso.codigo})`
    }))

    return (
        <GenericIndexPage<ModuloEducativo, ModuloEducativoFormData>
            data={modulos}
            config={modulosConfig}
            service={modulosEducativosService}
            filters={filters}
            extraContent={
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <BookOpen className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                                Organiza tu contenido educativo
                            </h3>
                            <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                                Los módulos son contenedores de lecciones. Cada módulo pertenece a un curso y puede contener múltiples lecciones ordenadas.
                            </p>
                        </div>
                    </div>
                </div>
            }
        />
    )
}
