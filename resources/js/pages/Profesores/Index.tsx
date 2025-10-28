import { Link, Head } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Trash2, Pencil, Plus, Search, UserCheck, UserX } from 'lucide-react'
import Can from '@/components/auth/Can'
import { type BreadcrumbItem } from '@/types'
import { useProfesores } from '@/hooks/use-profesores'

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profesores',
        href: '/profesores',
    },
]

export default function Index() {
    // Business Logic Layer - usando el hook personalizado
    const {
        profesores,
        searchTerm,
        setSearchTerm,
        activoFilter,
        setActivoFilter,
        handleSearch,
        clearFilters,
        goToEdit,
        goToShow,
        handleDelete,
        handleToggleStatus,
        goToPage,
        hasFilters,
    } = useProfesores()

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestión de Profesores" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                                Gestión de Profesores
                            </h2>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Administra los profesores de la plataforma
                            </p>
                        </div>
                        <Can permission="profesores.create">
                            <Link href="/profesores/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Profesor
                                </Button>
                            </Link>
                        </Can>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Profesores</CardTitle>
                            <CardDescription>
                                Lista de todos los profesores registrados en la plataforma
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* Filtros */}
                            <form onSubmit={handleSearch} className="mb-6 space-y-4 lg:flex lg:space-x-4 lg:space-y-0">
                                <div className="flex-1">
                                    <Label htmlFor="search">Buscar</Label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                        <Input
                                            id="search"
                                            type="text"
                                            placeholder="Buscar por nombre, email o usuario..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="lg:w-48">
                                    <Label htmlFor="activo">Estado</Label>
                                    <select
                                        id="activo"
                                        value={activoFilter}
                                        onChange={(e) => setActivoFilter(e.target.value)}
                                        className="w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                                    >
                                        <option value="">Todos</option>
                                        <option value="1">Activos</option>
                                        <option value="0">Inactivos</option>
                                    </select>
                                </div>
                                <div className="flex space-x-2 lg:items-end lg:pb-0.5">
                                    <Button type="submit">Buscar</Button>
                                    {hasFilters && (
                                        <Button type="button" variant="outline" onClick={clearFilters}>
                                            Limpiar
                                        </Button>
                                    )}
                                </div>
                            </form>

                            {/* Tabla de profesores */}
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Profesor
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Email
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Teléfono
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Estado
                                            </th>
                                            <th className="py-3 text-left font-medium text-gray-900 dark:text-gray-100">
                                                Fecha Registro
                                            </th>
                                            <th className="py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {profesores.data.map((profesor) => (
                                            <tr
                                                key={profesor.id}
                                                className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                            >
                                                <td className="py-4">
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {profesor.name} {profesor.apellido}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            @{profesor.usernick}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 text-gray-600 dark:text-gray-300">
                                                    {profesor.email}
                                                </td>
                                                <td className="py-4 text-gray-600 dark:text-gray-300">
                                                    {profesor.telefono || '-'}
                                                </td>
                                                <td className="py-4">
                                                    <Badge variant={profesor.activo ? "default" : "secondary"}>
                                                        {profesor.activo ? 'Activo' : 'Inactivo'}
                                                    </Badge>
                                                </td>
                                                <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {new Date(profesor.created_at).toLocaleDateString('es-ES')}
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex justify-end space-x-2">
                                                        <Can permission="profesores.show">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => goToShow(profesor.id)}
                                                            >
                                                                Ver
                                                            </Button>
                                                        </Can>
                                                        <Can permission="profesores.edit">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => goToEdit(profesor.id)}
                                                            >
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </Can>
                                                        <Can permission="profesores.toggle-status">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleToggleStatus(profesor)}
                                                                title={profesor.activo ? 'Desactivar' : 'Activar'}
                                                            >
                                                                {profesor.activo ?
                                                                    <UserX className="h-4 w-4 text-orange-600" /> :
                                                                    <UserCheck className="h-4 w-4 text-green-600" />
                                                                }
                                                            </Button>
                                                        </Can>
                                                        <Can permission="profesores.delete">
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleDelete(profesor)}
                                                                className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </Can>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mensaje si no hay profesores */}
                            {profesores.data.length === 0 && (
                                <div className="py-12 text-center">
                                    <p className="text-gray-500 dark:text-gray-400">
                                        No se encontraron profesores.
                                    </p>
                                </div>
                            )}

                            {/* Paginación */}
                            {profesores.links && profesores.links.length > 3 && (
                                <div className="mt-6 flex justify-center">
                                    <div className="flex space-x-1">
                                        {profesores.links.map((link, index) => (
                                            <button
                                                key={index}
                                                onClick={() => goToPage(link.url)}
                                                disabled={!link.url}
                                                className={`px-3 py-2 text-sm ${link.active
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-white text-gray-500 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
                                                    } rounded-md border border-gray-300 dark:border-gray-600 disabled:opacity-50`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    )
}
