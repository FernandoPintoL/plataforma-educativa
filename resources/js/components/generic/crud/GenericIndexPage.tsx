// Application Layer: Generic CRUD index page
import { Head, Link } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Can from '@/components/auth/Can'
import ModernTable from '@/components/generic/modern-table'
import GenericSearchBar from '@/components/generic/GenericSearchBar'
import GenericFilters from '@/components/generic/GenericFilters'
import GenericPagination from '@/components/generic/generic-pagination'
import { useGenericList } from '@/hooks/use-generic-list'
import type { BaseEntity, BaseService, CrudConfig, BaseFormData } from '@/domain/generic'
import type { Pagination, Filters, BreadcrumbItem } from '@/domain/shared'

interface GenericIndexPageProps<T extends BaseEntity, F extends BaseFormData> {
    data: Pagination<T>
    config: CrudConfig<T>
    service: BaseService<T, F>
    filters?: Filters
    breadcrumbs?: BreadcrumbItem[]
    extraContent?: React.ReactNode
}

export default function GenericIndexPage<T extends BaseEntity, F extends BaseFormData>({
    data,
    config,
    service,
    filters: initialFilters = {},
    breadcrumbs,
    extraContent
}: GenericIndexPageProps<T, F>) {
    // Business logic hook
    const {
        entities,
        pagination,
        searchTerm,
        setSearchTerm,
        filters,
        hasActiveFilters,
        sortBy,
        sortDirection,
        isLoading,
        handleSearch,
        clearFilters,
        goToCreate,
        goToEdit,
        goToShow,
        handleDelete,
        handleSort,
        handleFilterChange,
        applyFilters,
        updateFilter,
    } = useGenericList({
        data,
        config,
        service,
        initialFilters
    })

    // Generate default breadcrumbs if not provided
    const defaultBreadcrumbs: BreadcrumbItem[] = breadcrumbs || [
        {
            title: config.title || config.pluralName.charAt(0).toUpperCase() + config.pluralName.slice(1),
            href: `/${config.pluralName}`
        }
    ]

    // Page title
    const pageTitle = config.title || `Gestión de ${config.pluralName.charAt(0).toUpperCase() + config.pluralName.slice(1)}`
    const pageDescription = config.description || `Administra los ${config.pluralName} de la plataforma`

    // Count active filters (excluding search)
    const activeFiltersCount = Object.keys(filters).filter(
        key => key !== 'search' && key !== 'order_by' && key !== 'order_dir' && filters[key] !== null && filters[key] !== undefined && filters[key] !== ''
    ).length

    return (
        <AppLayout breadcrumbs={defaultBreadcrumbs}>
            <Head title={pageTitle} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
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
                        {config.permissions?.create && (
                            <Can permission={config.permissions.create}>
                                <Button onClick={goToCreate}>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear {config.name}
                                </Button>
                            </Can>
                        )}
                        {!config.permissions?.create && (
                            <Button onClick={goToCreate}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear {config.name}
                            </Button>
                        )}
                    </div>

                    {/* Extra Content (optional) */}
                    {extraContent && (
                        <div className="mb-6">
                            {extraContent}
                        </div>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="capitalize">{config.pluralName}</CardTitle>
                            <CardDescription>
                                {entities.length === 0
                                    ? `No hay ${config.pluralName} registrados`
                                    : `Mostrando ${entities.length} de ${pagination.total} ${config.pluralName}`
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Search Bar */}
                            <div className="mb-6">
                                <GenericSearchBar
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    onSearch={handleSearch}
                                    onClear={clearFilters}
                                    placeholder={
                                        config.searchPlaceholder ||
                                        `Buscar ${config.pluralName}...`
                                    }
                                    disabled={isLoading}
                                />
                            </div>

                            {/* Filters */}
                            {config.filters && config.filters.length > 0 && (
                                <div className="mb-6">
                                    <GenericFilters
                                        filters={config.filters}
                                        values={filters}
                                        onChange={updateFilter}
                                        onApply={applyFilters}
                                        onClear={clearFilters}
                                        activeCount={activeFiltersCount}
                                        disabled={isLoading}
                                    />
                                </div>
                            )}

                            {/* Clear Filters Button */}
                            {hasActiveFilters && (
                                <div className="mb-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearFilters}
                                        disabled={isLoading}
                                    >
                                        Limpiar todos los filtros
                                    </Button>
                                </div>
                            )}

                            {/* Table */}
                            <div className="mb-6">
                                <ModernTable
                                    entities={entities}
                                    columns={config.columns}
                                    onEdit={goToEdit}
                                    onDelete={handleDelete}
                                    onView={config.permissions?.view ? goToShow : undefined}
                                    entityName={config.name}
                                    isLoading={isLoading}
                                    sortBy={sortBy}
                                    sortDirection={sortDirection}
                                    onSort={handleSort}
                                />
                            </div>

                            {/* Pagination */}
                            {pagination.links && pagination.links.length > 3 && (
                                <div className="mt-6">
                                    <GenericPagination
                                        links={pagination.links}
                                        isLoading={isLoading}
                                    />
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
