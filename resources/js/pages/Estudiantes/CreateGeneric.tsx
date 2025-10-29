// EJEMPLO: Página de Crear Estudiante usando el sistema CRUD genérico
// Esta es la versión refactorizada usando GenericFormPage

import GenericFormPage from '@/components/generic/crud/GenericFormPage'
import { estudiantesService } from '@/services/estudiantes.service'
import type { FormField } from '@/domain/generic'
import type { Estudiante, EstudianteFormData, EstudianteCreatePageProps } from '@/domain/estudiantes'

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
        label: 'Contraseña',
        type: 'text',
        required: true,
        placeholder: 'Mínimo 8 caracteres',
        validation: {
            minLength: 8
        }
    },
    {
        key: 'password_confirmation',
        label: 'Confirmar contraseña',
        type: 'text',
        required: true,
        placeholder: 'Repita la contraseña'
    }
]

// Datos iniciales del formulario
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
export default function Create({ roles, permissions }: EstudianteCreatePageProps) {
    return (
        <GenericFormPage<Estudiante, EstudianteFormData>
            service={estudiantesService}
            formFields={estudianteFormFields}
            initialData={initialData}
            name="estudiante"
            pluralName="estudiantes"
            title="Crear Estudiante"
            description="Registrar un nuevo estudiante en la plataforma"
            extraData={{ roles, permissions }}
        />
    )
}
