// EJEMPLO: Página de Editar Estudiante usando el sistema CRUD genérico
// Esta es la versión refactorizada usando GenericFormPage

import { usePage } from '@inertiajs/react'
import GenericFormPage from '@/components/generic/crud/GenericFormPage'
import { estudiantesService } from '@/services/estudiantes.service'
import type { FormField } from '@/domain/generic'
import type { Estudiante, EstudianteFormData, EstudianteEditPageProps } from '@/domain/estudiantes'

// Configuración de campos del formulario
const estudianteFormFields: FormField<EstudianteFormData>[] = [
    // Información Personal
    {
        key: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        placeholder: 'Ej: Juan'
    },
    {
        key: 'apellido',
        label: 'Apellido',
        type: 'text',
        placeholder: 'Ej: Pérez García'
    },
    {
        key: 'fecha_nacimiento',
        label: 'Fecha de Nacimiento',
        type: 'date'
    },
    {
        key: 'telefono',
        label: 'Teléfono',
        type: 'text',
        placeholder: 'Ej: +591 12345678'
    },
    {
        key: 'direccion',
        label: 'Dirección',
        type: 'text',
        placeholder: 'Ej: Calle Principal #123, Ciudad'
    },

    // Información de Acceso
    {
        key: 'usernick',
        label: 'Nombre de usuario',
        type: 'text',
        required: true,
        placeholder: 'Ej: juan.perez'
    },
    {
        key: 'email',
        label: 'Correo electrónico',
        type: 'text',
        required: true,
        placeholder: 'Ej: juan.perez@escuela.edu'
    },
    {
        key: 'password',
        label: 'Contraseña (dejar en blanco para no cambiar)',
        type: 'text',
        placeholder: 'Opcional al editar',
        validation: {
            minLength: 8
        }
    },
    {
        key: 'password_confirmation',
        label: 'Confirmar contraseña',
        type: 'text',
        placeholder: 'Solo si cambias la contraseña'
    }
]

// Datos iniciales del formulario (vacíos porque se llenarán con la entidad)
const initialData: EstudianteFormData = {
    name: '',
    apellido: '',
    usernick: '',
    email: '',
    password: '',
    password_confirmation: '',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    activo: true,
    permissions: []
}

// Componente de la página
export default function Edit() {
    const { estudiante, permissions, userPermissions } = usePage<EstudianteEditPageProps>().props

    // Mapear los datos del estudiante a EstudianteFormData
    const estudianteData: Estudiante = {
        ...estudiante,
        // Asegurar que permissions sea un array de números
        permissions: userPermissions || []
    } as Estudiante

    return (
        <GenericFormPage<Estudiante, EstudianteFormData>
            entity={estudianteData}
            service={estudiantesService}
            formFields={estudianteFormFields}
            initialData={initialData}
            name="estudiante"
            pluralName="estudiantes"
            title="Editar Estudiante"
            description="Actualiza la información del estudiante"
            extraData={{ permissions, userPermissions }}
        />
    )
}
