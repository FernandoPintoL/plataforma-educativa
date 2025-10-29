// Application Layer: Generic CRUD form page
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save } from 'lucide-react'
import GenericFormFields from '@/components/generic/generic-form-fields'
import { useGenericForm } from '@/hooks/use-generic-form'
import type { BaseEntity, BaseFormData, BaseService, FormField } from '@/domain/generic'
import type { BreadcrumbItem } from '@/domain/shared'

interface GenericFormPageProps<T extends BaseEntity, F extends BaseFormData> {
    entity?: T | null
    service: BaseService<T, F>
    formFields: FormField<F>[]
    initialData: F
    name: string
    pluralName: string
    title?: string
    description?: string
    breadcrumbs?: BreadcrumbItem[]
    extraData?: Record<string, unknown>
    loadOptions?: (fieldKey: string) => Promise<Array<{ value: string | number; label: string }>>
}

export default function GenericFormPage<T extends BaseEntity, F extends BaseFormData>({
    entity,
    service,
    formFields,
    initialData,
    name,
    pluralName,
    title,
    description,
    breadcrumbs,
    extraData,
    loadOptions
}: GenericFormPageProps<T, F>) {
    // Business logic hook
    const {
        data,
        errors,
        processing,
        handleSubmit,
        handleFieldChange,
        handleReset,
        isEditing,
    } = useGenericForm(entity, service, initialData)

    // Generate default breadcrumbs if not provided
    const defaultBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
        {
            title: pluralName.charAt(0).toUpperCase() + pluralName.slice(1),
            href: `/${pluralName}`
        },
        {
            title: isEditing ? 'Editar' : 'Crear',
            href: isEditing ? `/${pluralName}/${entity?.id}/edit` : `/${pluralName}/create`
        }
    ]

    // Page configuration
    const pageTitle = title || (isEditing ? `Editar ${name}` : `Crear ${name}`)
    const pageDescription = description || (isEditing
        ? `Actualiza la información del ${name}`
        : `Completa el formulario para crear un nuevo ${name}`
    )
    const submitButtonText = isEditing ? `Actualizar ${name}` : `Crear ${name}`
    const entityName = entity && 'nombre' in entity ? String(entity.nombre) : entity?.id

    return (
        <AppLayout breadcrumbs={defaultBreadcrumbs}>
            <Head title={pageTitle} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                {pageTitle}
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {pageDescription}
                            </p>
                        </div>
                        <Button variant="outline" asChild>
                            <Link href={`/${pluralName}`}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>{pageTitle}</CardTitle>
                            <CardDescription>
                                {isEditing && entityName ? (
                                    <>Editando: <strong>{entityName}</strong></>
                                ) : (
                                    <>Complete todos los campos requeridos</>
                                )}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Form Fields */}
                                <GenericFormFields<F>
                                    data={data}
                                    errors={errors as Partial<Record<keyof F, string>>}
                                    fields={formFields}
                                    onChange={handleFieldChange}
                                    disabled={processing}
                                    loadOptions={loadOptions}
                                    extraData={extraData}
                                />

                                {/* Form Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-border">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleReset}
                                        disabled={processing}
                                    >
                                        Restablecer
                                    </Button>
                                    <div className="flex gap-2">
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => window.history.back()}
                                            disabled={processing}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="min-w-[140px]"
                                        >
                                            {processing ? (
                                                <>Guardando...</>
                                            ) : (
                                                <>
                                                    <Save className="mr-2 h-4 w-4" />
                                                    {submitButtonText}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
