// Página Edit de Módulo Educativo - Sistema Genérico
import { usePage } from '@inertiajs/react'
import GenericFormPage from '@/components/generic/crud/GenericFormPage'
import { modulosEducativosService } from '@/services/modulos.service'
import type { FormField } from '@/domain/generic'
import type { ModuloEducativo, ModuloEducativoFormData, ModuloEducativoEditPageProps } from '@/domain/modulos'

// Configuración de campos del formulario
const moduloFormFields: FormField<ModuloEducativoFormData>[] = [
    // Información Básica
    {
        key: 'titulo',
        label: 'Título del Módulo',
        type: 'text',
        required: true,
        placeholder: 'Ej: Introducción a la Programación'
    },
    {
        key: 'descripcion',
        label: 'Descripción',
        type: 'textarea',
        placeholder: 'Describe brevemente el contenido del módulo...'
    },
    {
        key: 'curso_id',
        label: 'Curso',
        type: 'select',
        required: true,
        options: [], // Se llenarán desde cursos
        extraDataKey: 'cursos'
    },

    // Configuración
    {
        key: 'orden',
        label: 'Orden',
        type: 'number',
        validation: {
            min: 1
        }
    },
    {
        key: 'duracion_estimada',
        label: 'Duración Estimada (minutos)',
        type: 'number',
        placeholder: 'Ej: 120',
        validation: {
            min: 0
        }
    },
    {
        key: 'imagen_portada',
        label: 'Imagen de Portada',
        type: 'file',
        placeholder: 'Selecciona una imagen para reemplazar la actual'
    },
    {
        key: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
            { value: 'borrador', label: 'Borrador' },
            { value: 'publicado', label: 'Publicado' },
            { value: 'archivado', label: 'Archivado' }
        ]
    }
]

// Datos iniciales del formulario (vacíos porque se llenarán con la entidad)
const initialData: ModuloEducativoFormData = {
    titulo: '',
    descripcion: '',
    curso_id: '',
    orden: 0,
    duracion_estimada: 0,
    imagen_portada: null,
    estado: 'borrador'
}

// Componente de la página
export default function Edit() {
    const { modulo, cursos } = usePage<ModuloEducativoEditPageProps>().props

    // Mapear cursos para el select
    const cursosOptions = cursos.map(curso => ({
        id: curso.id,
        nombre: `${curso.nombre} (${curso.codigo})`
    }))

    return (
        <GenericFormPage<ModuloEducativo, ModuloEducativoFormData>
            entity={modulo}
            service={modulosEducativosService}
            formFields={moduloFormFields}
            initialData={initialData}
            name="módulo educativo"
            pluralName="modulos"
            title="Editar Módulo Educativo"
            description="Actualiza la información del módulo"
            extraData={{ cursos: cursosOptions }}
        />
    )
}
