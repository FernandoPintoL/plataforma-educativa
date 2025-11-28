import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from '../ui/button';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  orden: number;
}

interface Props {
  testId: number;
  categoriaId: number;
  preguntas: Pregunta[];
  onUpdate: () => void;
}

export default function PreguntaList({ testId, categoriaId, preguntas, onUpdate }: Props) {
  const handleDelete = (preguntaId: number) => {
    if (confirm('¿Eliminar esta pregunta?')) {
      // TODO: Implementar lógica de eliminación
      onUpdate();
    }
  };

  return (
    <div className="space-y-2">
      {preguntas.map((pregunta, idx) => (
        <div key={pregunta.id} className="flex items-start justify-between p-3 border border-gray-200 rounded-md hover:bg-gray-50">
          <div className="flex-1">
            <p className="font-medium text-gray-900">
              {idx + 1}. {pregunta.enunciado}
            </p>
            <p className="text-sm text-gray-500 capitalize mt-1">
              Tipo: {pregunta.tipo.replace('_', ' ')}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(pregunta.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
