import React from 'react';

const profesores = [
    { id: 1, nombre: 'Carlos Ruiz', email: 'carlos.ruiz@email.com', especialidad: 'Matemáticas' },
    { id: 2, nombre: 'Sofía Gómez', email: 'sofia.gomez@email.com', especialidad: 'Historia' },
    { id: 3, nombre: 'Pedro Sánchez', email: 'pedro.sanchez@email.com', especialidad: 'Ciencias' },
];

export default function Profesores() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Profesores</h2>
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Nombre</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Especialidad</th>
                    </tr>
                </thead>
                <tbody>
                    {profesores.map(prof => (
                        <tr key={prof.id} className="border-t">
                            <td className="py-2 px-4">{prof.nombre}</td>
                            <td className="py-2 px-4">{prof.email}</td>
                            <td className="py-2 px-4">{prof.especialidad}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
