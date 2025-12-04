import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Users, FileText, BarChart3 } from 'lucide-react';

interface Curso {
    id: number;
    nombre: string;
    codigo: string;
    descripcion: string;
    estado: string;
    fecha_inicio: string;
    fecha_fin: string;
    capacidad_maxima: number;
    total_estudiantes: number;
    total_contenidos: number;
    total_tareas: number;
    total_evaluaciones: number;
    profesor: {
        id: number;
        nombre: string;
        apellido: string;
    };
}

interface Props {
    cursos: Curso[];
    totalCursos: number;
}

export default function MisCursos({ cursos, totalCursos }: Props) {
    const getEstadoBadge = (estado: string) => {
        switch (estado) {
            case 'activo':
                return <Badge className="bg-green-100 text-green-800">Activo</Badge>;
            case 'inactivo':
                return <Badge className="bg-gray-100 text-gray-800">Inactivo</Badge>;
            case 'finalizado':
                return <Badge className="bg-blue-100 text-blue-800">Finalizado</Badge>;
            default:
                return <Badge>{estado}</Badge>;
        }
    };

    return (
        <AppLayout>
            <Head title="Mis Cursos" />

            <div className="space-y-4 sm:space-y-6 p-6! sm:px-0">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-0">
                    <div className="w-full sm:w-auto">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mis Cursos</h1>
                        <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                            Tienes {totalCursos} curso{totalCursos !== 1 ? 's' : ''} asignado{totalCursos !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link href="/tareas/create" className="w-full sm:w-auto">
                        <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
                            <BookOpen className="w-4 h-4 mr-2" />
                            Nueva Tarea
                        </Button>
                    </Link>
                </div>

                {/* Cursos Grid */}
                {cursos.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="pt-8 pb-8 text-center">
                            <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-base sm:text-lg font-medium">No tienes cursos asignados</p>
                            <p className="text-gray-400 text-sm sm:text-base mt-2">Contacta con la dirección para ser asignado a un curso</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {cursos.map((curso) => (
                            <Card
                                key={curso.id}
                                className="hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer overflow-hidden flex flex-col"
                                onClick={() => (window.location.href = `/cursos/${curso.id}`)}
                            >
                                {/* Encabezado con código */}
                                <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 sm:px-6 py-3 sm:py-4">
                                    <div className="flex justify-between items-start gap-2">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-blue-100 text-xs sm:text-sm font-semibold truncate">{curso.codigo}</p>
                                            <h3 className="text-white font-bold text-base sm:text-lg mt-1 line-clamp-2">{curso.nombre}</h3>
                                        </div>
                                        <div className="flex-shrink-0">
                                            {getEstadoBadge(curso.estado)}
                                        </div>
                                    </div>
                                </div>

                                {/* Contenido */}
                                <CardContent className="pt-4 sm:pt-6 flex-1 flex flex-col">
                                    {/* Descripción */}
                                    <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                        {curso.descripcion || 'Sin descripción disponible'}
                                    </p>

                                    {/* Fechas */}
                                    <div className="text-xs text-gray-500 mb-4 sm:mb-6 space-y-1 pb-3 sm:pb-4 border-b">
                                        <p className="truncate">📅 Inicio: {curso.fecha_inicio}</p>
                                        <p className="truncate">📅 Fin: {curso.fecha_fin}</p>
                                    </div>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
                                        {/* Estudiantes */}
                                        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center hover:bg-blue-100 transition-colors">
                                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mx-auto mb-0.5 sm:mb-1" />
                                            <p className="text-lg sm:text-2xl font-bold text-blue-600">{curso.total_estudiantes}</p>
                                            <p className="text-xs text-gray-600">Estudiantes</p>
                                        </div>

                                        {/* Tareas */}
                                        <div className="bg-purple-50 rounded-lg p-2 sm:p-3 text-center hover:bg-purple-100 transition-colors">
                                            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mx-auto mb-0.5 sm:mb-1" />
                                            <p className="text-lg sm:text-2xl font-bold text-purple-600">{curso.total_tareas}</p>
                                            <p className="text-xs text-gray-600">Tareas</p>
                                        </div>

                                        {/* Contenidos */}
                                        <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center hover:bg-green-100 transition-colors">
                                            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mx-auto mb-0.5 sm:mb-1" />
                                            <p className="text-lg sm:text-2xl font-bold text-green-600">{curso.total_contenidos}</p>
                                            <p className="text-xs text-gray-600">Contenidos</p>
                                        </div>

                                        {/* Evaluaciones */}
                                        <div className="bg-orange-50 rounded-lg p-2 sm:p-3 text-center hover:bg-orange-100 transition-colors">
                                            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mx-auto mb-0.5 sm:mb-1" />
                                            <p className="text-lg sm:text-2xl font-bold text-orange-600">{curso.total_evaluaciones}</p>
                                            <p className="text-xs text-gray-600">Evaluaciones</p>
                                        </div>
                                    </div>

                                    {/* Acciones */}
                                    <div className="space-y-2 pt-4 border-t mt-auto">
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs sm:text-sm py-2 sm:py-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/tareas?curso_id=${curso.id}`;
                                            }}
                                        >
                                            Ver Tareas
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="w-full text-xs sm:text-sm py-2 sm:py-2"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.location.href = `/evaluaciones?curso_id=${curso.id}`;
                                            }}
                                        >
                                            Ver Evaluaciones
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Estadísticas generales */}
                {totalCursos > 0 && (
                    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-4 sm:mt-6">
                        <CardHeader className="pb-3 sm:pb-6">
                            <CardTitle className="flex items-center text-base sm:text-xl">
                                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                                Resumen General
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                                    <p className="text-gray-600 text-xs sm:text-sm font-medium">Total de Cursos</p>
                                    <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">{totalCursos}</p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                                    <p className="text-gray-600 text-xs sm:text-sm font-medium">Estudiantes Totales</p>
                                    <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
                                        {cursos.reduce((sum, c) => sum + c.total_estudiantes, 0)}
                                    </p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                                    <p className="text-gray-600 text-xs sm:text-sm font-medium">Tareas Totales</p>
                                    <p className="text-xl sm:text-2xl font-bold text-purple-600 mt-1">
                                        {cursos.reduce((sum, c) => sum + c.total_tareas, 0)}
                                    </p>
                                </div>
                                <div className="bg-white/50 rounded-lg p-3 sm:p-4">
                                    <p className="text-gray-600 text-xs sm:text-sm font-medium">Evaluaciones Totales</p>
                                    <p className="text-xl sm:text-2xl font-bold text-orange-600 mt-1">
                                        {cursos.reduce((sum, c) => sum + c.total_evaluaciones, 0)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
