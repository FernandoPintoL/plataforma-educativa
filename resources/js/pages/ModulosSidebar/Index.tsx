import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';

interface ModuloSidebar {
    id: number;
    titulo: string;
    ruta: string;
    icono?: string;
    descripcion?: string;
    orden: number;
    activo: boolean;
    es_submenu: boolean;
    modulo_padre_id?: number;
    categoria?: string;
    submodulos_count: number;
    padre?: {
        id: number;
        titulo: string;
    };
}

interface Props {
    modulos: ModuloSidebar[];
}

const iconosDisponibles = [
    'Package', 'Boxes', 'Users', 'Truck', 'Wallet', 'CreditCard',
    'ShoppingCart', 'TrendingUp', 'BarChart3', 'Settings',
    'FolderTree', 'Tags', 'Ruler', 'DollarSign', 'Building2',
    'ClipboardList', 'Home', 'FileText', 'Calculator'
];

export default function Index({ modulos }: Props) {
    const [selectedModulo, setSelectedModulo] = useState<ModuloSidebar | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        titulo: '',
        ruta: '',
        icono: '',
        descripcion: '',
        orden: 1,
        activo: true,
        es_submenu: false,
        modulo_padre_id: '',
        categoria: '',
        visible_dashboard: true,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/modulos-sidebar', {
            onSuccess: () => {
                setIsCreateModalOpen(false);
                reset();
            },
        });
    };

    const handleEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedModulo) return;

        put(`/modulos-sidebar/${selectedModulo.id}`, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setSelectedModulo(null);
                reset();
            },
        });
    };

    const handleDelete = (modulo: ModuloSidebar) => {
        if (confirm(`¿Está seguro de eliminar el módulo "${modulo.titulo}"?`)) {
            destroy(`/modulos-sidebar/${modulo.id}`, {
                onSuccess: () => {
                    // Módulo eliminado
                },
            });
        }
    };

    const toggleActivo = (modulo: ModuloSidebar) => {
        fetch(`/modulos-sidebar/${modulo.id}/toggle-activo`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
            },
        })
            .then(() => {
                window.location.reload();
            })
            .catch(() => {
                alert('Error al cambiar el estado del módulo');
            });
    };

    const openEditModal = (modulo: ModuloSidebar) => {
        setSelectedModulo(modulo);
        setData({
            titulo: modulo.titulo,
            ruta: modulo.ruta,
            icono: modulo.icono || '',
            descripcion: modulo.descripcion || '',
            orden: modulo.orden,
            activo: modulo.activo,
            es_submenu: modulo.es_submenu,
            modulo_padre_id: modulo.modulo_padre_id?.toString() || '',
            categoria: modulo.categoria || '',
            visible_dashboard: true,
        });
        setIsEditModalOpen(true);
    };

    const modulosPadre = modulos.filter(m => !m.es_submenu);

    return (
        <AppLayout>
            <Head title="Gestión de Módulos del Sidebar" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                            Gestión de Módulos del Sidebar
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Administra los módulos y submódulos del sidebar de la aplicación
                        </p>
                    </div>

                    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Módulo
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Módulo</DialogTitle>
                                <DialogDescription>
                                    Ingresa los datos del nuevo módulo del sidebar
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <Label htmlFor="titulo">Título</Label>
                                    <Input
                                        id="titulo"
                                        value={data.titulo}
                                        onChange={(e) => setData('titulo', e.target.value)}
                                        required
                                    />
                                    {errors.titulo && (
                                        <p className="text-sm text-red-600 mt-1">{errors.titulo}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="ruta">Ruta</Label>
                                    <Input
                                        id="ruta"
                                        value={data.ruta}
                                        onChange={(e) => setData('ruta', e.target.value)}
                                        placeholder="/example"
                                        required
                                    />
                                    {errors.ruta && (
                                        <p className="text-sm text-red-600 mt-1">{errors.ruta}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="icono">Ícono</Label>
                                    <Select onValueChange={(value) => setData('icono', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar ícono" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {iconosDisponibles.map((icono) => (
                                                <SelectItem key={icono} value={icono}>
                                                    {icono}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="categoria">Categoría</Label>
                                    <Input
                                        id="categoria"
                                        value={data.categoria}
                                        onChange={(e) => setData('categoria', e.target.value)}
                                        placeholder="Inventario, Comercial, etc."
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="orden">Orden</Label>
                                    <Input
                                        id="orden"
                                        type="number"
                                        value={data.orden}
                                        onChange={(e) => setData('orden', parseInt(e.target.value) || 1)}
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="flex items-center space-x-2">
                                    <input
                                        id="es_submenu"
                                        type="checkbox"
                                        checked={data.es_submenu}
                                        onChange={(e) => setData('es_submenu', e.target.checked)}
                                        className="rounded border-gray-300"
                                    />
                                    <Label htmlFor="es_submenu">Es submódulo</Label>
                                </div>

                                {data.es_submenu && (
                                    <div>
                                        <Label htmlFor="modulo_padre_id">Módulo Padre</Label>
                                        <Select onValueChange={(value) => setData('modulo_padre_id', value)}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Seleccionar módulo padre" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {modulosPadre.map((modulo) => (
                                                    <SelectItem key={modulo.id} value={modulo.id.toString()}>
                                                        {modulo.titulo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}

                                <div className="flex justify-end space-x-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsCreateModalOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={processing}>
                                        {processing ? 'Creando...' : 'Crear'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Módulos Registrados</CardTitle>
                        <CardDescription>
                            Total de módulos: {modulos.length}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Título</TableHead>
                                    <TableHead>Ruta</TableHead>
                                    <TableHead>Tipo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead>Orden</TableHead>
                                    <TableHead>Categoría</TableHead>
                                    <TableHead>Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {modulos.map((modulo) => (
                                    <TableRow key={modulo.id}>
                                        <TableCell className="font-medium">
                                            {modulo.es_submenu && modulo.padre && (
                                                <span className="text-gray-500 mr-2">
                                                    └
                                                </span>
                                            )}
                                            {modulo.titulo}
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600">
                                            {modulo.ruta}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={modulo.es_submenu ? "secondary" : "default"}>
                                                {modulo.es_submenu ? 'Submódulo' : 'Principal'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleActivo(modulo)}
                                            >
                                                {modulo.activo ? (
                                                    <>
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        <Badge className="bg-green-100 text-green-800">Activo</Badge>
                                                    </>
                                                ) : (
                                                    <>
                                                        <EyeOff className="h-4 w-4 mr-1" />
                                                        <Badge variant="secondary">Inactivo</Badge>
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{modulo.orden}</TableCell>
                                        <TableCell>
                                            {modulo.categoria && (
                                                <Badge variant="outline">{modulo.categoria}</Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEditModal(modulo)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleDelete(modulo)}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Modal de Edición */}
                <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Módulo</DialogTitle>
                            <DialogDescription>
                                Modifica los datos del módulo seleccionado
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleEdit} className="space-y-4">
                            <div>
                                <Label htmlFor="edit_titulo">Título</Label>
                                <Input
                                    id="edit_titulo"
                                    value={data.titulo}
                                    onChange={(e) => setData('titulo', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_ruta">Ruta</Label>
                                <Input
                                    id="edit_ruta"
                                    value={data.ruta}
                                    onChange={(e) => setData('ruta', e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_icono">Ícono</Label>
                                <Select value={data.icono} onValueChange={(value) => setData('icono', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar ícono" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {iconosDisponibles.map((icono) => (
                                            <SelectItem key={icono} value={icono}>
                                                {icono}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="edit_categoria">Categoría</Label>
                                <Input
                                    id="edit_categoria"
                                    value={data.categoria}
                                    onChange={(e) => setData('categoria', e.target.value)}
                                />
                            </div>

                            <div>
                                <Label htmlFor="edit_orden">Orden</Label>
                                <Input
                                    id="edit_orden"
                                    type="number"
                                    value={data.orden}
                                    onChange={(e) => setData('orden', parseInt(e.target.value) || 1)}
                                    min="1"
                                    required
                                />
                            </div>

                            <div className="flex justify-end space-x-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditModalOpen(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Actualizando...' : 'Actualizar'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}