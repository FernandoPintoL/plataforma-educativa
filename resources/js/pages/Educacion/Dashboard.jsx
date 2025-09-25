import React from 'react';

export default function Dashboard() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-4">Bienvenido a la Plataforma Educativa</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <span className="text-5xl mb-2">🎓</span>
                    <span className="text-lg font-semibold">Estudiantes</span>
                    <span className="text-2xl font-bold mt-2">120</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <span className="text-5xl mb-2">👨‍🏫</span>
                    <span className="text-lg font-semibold">Profesores</span>
                    <span className="text-2xl font-bold mt-2">15</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-center">
                    <span className="text-5xl mb-2">📚</span>
                    <span className="text-lg font-semibold">Cursos</span>
                    <span className="text-2xl font-bold mt-2">8</span>
                </div>
            </div>
        </div>
    );
}
