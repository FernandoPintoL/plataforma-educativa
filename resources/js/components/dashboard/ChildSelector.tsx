import React, { useEffect, useState } from 'react';
import { ChevronDownIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Child {
    id: number;
    name: string;
    email: string;
}

interface ChildSelectorProps {
    selectedChild: Child | null;
    onSelectChild: (child: Child) => void;
}

export function ChildSelector({ selectedChild, onSelectChild }: ChildSelectorProps) {
    const [children, setChildren] = useState<Child[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/padre/hijos', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('No se pudo cargar la lista de hijos');
            }

            const data = await response.json();
            setChildren(data.hijos || []);

            // Select first child by default if none selected
            if (data.hijos && data.hijos.length > 0 && !selectedChild) {
                onSelectChild(data.hijos[0]);
            }

            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error desconocido');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-indigo-600" />
                        Seleccionar Hijo
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                </CardContent>
            </Card>
        );
    }

    if (error || children.length === 0) {
        return (
            <Card className="bg-red-50 border-red-200">
                <CardHeader>
                    <CardTitle className="text-red-700">Error al cargar hijos</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-red-600">
                        {error || 'No tienes hijos registrados en el sistema'}
                    </p>
                    <button
                        onClick={fetchChildren}
                        className="mt-2 text-sm text-blue-600 hover:underline"
                    >
                        Reintentar
                    </button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    Seleccionar Hijo/a
                </CardTitle>
            </CardHeader>
            <CardContent>
                {/* Dropdown Selector */}
                <div className="relative">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-between"
                    >
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-600">Seleccionado:</span>
                            <span className="text-lg font-semibold text-gray-900">
                                {selectedChild?.name || 'Seleccionar hijo/a'}
                            </span>
                        </div>
                        <ChevronDownIcon
                            className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                        />
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute z-10 w-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg">
                            {children.map((child) => (
                                <button
                                    key={child.id}
                                    onClick={() => {
                                        onSelectChild(child);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full px-4 py-3 text-left transition-colors ${
                                        selectedChild?.id === child.id
                                            ? 'bg-indigo-100 text-indigo-900 border-l-4 border-l-indigo-600'
                                            : 'hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-medium">{child.name}</span>
                                        <span className="text-xs text-gray-500">{child.email}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Info */}
                {selectedChild && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-indigo-200">
                        <p className="text-xs text-gray-600">
                            Viendo información de: <span className="font-semibold text-gray-900">{selectedChild.name}</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
