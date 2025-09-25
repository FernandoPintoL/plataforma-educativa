import React from 'react';

const estudiantes = [
    { id: 1, nombre: 'Ana Torres', email: 'ana.torres@email.com', curso: 'Matemáticas' },
    { id: 2, nombre: 'Luis Pérez', email: 'luis.perez@email.com', curso: 'Historia' },
    { id: 3, nombre: 'María López', email: 'maria.lopez@email.com', curso: 'Ciencias' },
];

export default function Estudiantes() {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Estudiantes</h2>
            <table className="min-w-full bg-white rounded shadow">
                <thead>
                    <tr>
                        <th className="py-2 px-4">Nombre</th>
                        <th className="py-2 px-4">Email</th>
                        <th className="py-2 px-4">Curso</th>
                    </tr>
                </thead>
                <tbody>
                    {estudiantes.map(est => (
                        <tr key={est.id} className="border-t">
                            <td className="py-2 px-4">{est.nombre}</td>
                            <td className="py-2 px-4">{est.email}</td>
                            <td className="py-2 px-4">{est.curso}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
