import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  testId: number;
  testNombre: string;
}

export default function RespuestasTable({ testId, testNombre }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Respuestas del Test: {testNombre}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 px-4">Estudiante</th>
                <th className="text-left py-2 px-4">Fecha</th>
                <th className="text-left py-2 px-4">Puntaje</th>
                <th className="text-left py-2 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  Cargando respuestas...
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
