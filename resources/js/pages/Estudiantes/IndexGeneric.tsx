// EJEMPLO: Página de Estudiantes usando el sistema CRUD genérico
// Esta es la versión refactorizada usando GenericIndexPage
// Reducido de ~250 líneas a ~60 líneas (75% menos código)

import { Badge } from '@/components/ui/badge'
import GenericIndexPage from '@/components/generic/crud/GenericIndexPage'
import { estudiantesService } from '@/services/estudiantes.service'
import type { CrudConfig, TableColumn } from '@/domain/generic'
import type { Estudiante, EstudianteIndexPageProps, EstudianteFormData } from '@/domain/estudiantes'

// Configuración del CRUD de estudiantes
const estudiantesConfig: CrudConfig<Estudiante> = {
    // Identificación
    name: 'estudiante',
    pluralName: 'estudiantes',

    // Títulos personalizados (opcional)
    title: 'Gestiónesss de Estudiantes',
    description: 'Administra los estudiantes de la plataforma',

    // Configuración de columnas para la tabla
    columns: [
        {
            key: 'id',
            label: 'ID',
            type: 'number',
            sortable: true
        },
        {
            key: 'name',
            label: 'Estudiante',
            type: 'custom',
            sortable: true,
            render: (value, entity: Estudiante) => (
                <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {entity.name} {entity.apellido}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        @{entity.usernick}
                    </div>
                </div>
            )
        },
        {
            key: 'email',
            label: 'Email',
            type: 'text',
            sortable: true
        },
        {
            key: 'telefono',
            label: 'Teléfono',
            type: 'text',
            render: (value) => value || '-'
        },
        {
            key: 'activo',
            label: 'Estado',
            type: 'boolean',
            sortable: true,
            render: (value: unknown) => (
                <Badge variant={value ? 'default' : 'secondary'}>
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            )
        },
        {
            key: 'created_at',
            label: 'Fecha Registro',
            type: 'date',
            sortable: true
        }
    ] as TableColumn<Estudiante>[],

    // Configuración de filtros (opcional)
    filters: [
        {
            key: 'activo',
            label: 'Estado',
            type: 'select',
            options: [
                { value: '1', label: 'Activos' },
                { value: '0', label: 'Inactivos' }
            ]
        }
    ],

    // Configuración de búsqueda
    searchPlaceholder: 'Buscar por nombre, email o usuario...',

    // Permisos (opcional - si no se especifican, no se validan)
    permissions: {
        create: 'estudiantes.create',
        edit: 'estudiantes.edit',
        delete: 'estudiantes.delete',
        view: 'estudiantes.show'
    }
}

// Componente de la página - ¡Solo configuración!
export default function Index({ estudiantes, filters }: EstudianteIndexPageProps) {
    return (
        <GenericIndexPage<Estudiante, EstudianteFormData>
            data={estudiantes}
            config={estudiantesConfig}
            service={estudiantesService}
            filters={filters}
        />
    )
}
