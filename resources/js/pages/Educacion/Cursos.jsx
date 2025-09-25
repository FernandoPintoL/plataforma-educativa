import React from 'react';

const cursos = [
    { id: 1, nombre: 'Matemáticas', profesor: 'Carlos Ruiz', inscritos: 40 },
    { id: 2, nombre: 'Historia', profesor: 'Sofía Gómez', inscritos: 35 },
    { id: 3, nombre: 'Ciencias', profesor: 'Pedro Sánchez', inscritos: 45 },
];

export default function Cursos() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Cursos</h2>
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Nombre</th>
                        <th className="py-2 px-4">Profesor</th>
                        <th className="py-2 px-4">Inscritos</th>
                    </tr>
                </thead>
                <tbody>
                    {cursos.map(curso => (
                        <tr key={curso.id} className="border-t">
                            <td className="py-2 px-4">{curso.nombre}</td>
                            <td className="py-2 px-4">{curso.profesor}</td>
                            <td className="py-2 px-4">{curso.inscritos}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
