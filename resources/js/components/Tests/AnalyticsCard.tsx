import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface Props {
  testId: number;
}

export default function AnalyticsCard({ testId }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Análisis de Respuestas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Respuestas Totales</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Promedio</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Mejor Puntuación</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Peor Puntuación</p>
            <p className="text-2xl font-bold text-gray-900">-</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
