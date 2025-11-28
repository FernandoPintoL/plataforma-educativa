import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, Edit } from 'lucide-react';

interface Props {
  testId: number;
  categoriaId: number;
  pregunta?: { id: number; enunciado: string; tipo: string; opciones?: string[] };
  onSuccess: () => void;
  variant: 'create' | 'edit';
}

export default function PreguntaForm({ testId, categoriaId, pregunta, onSuccess, variant }: Props) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de crear/editar pregunta
    setOpen(false);
    onSuccess();
  };

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant={variant === 'create' ? 'default' : 'outline'}
        size={variant === 'create' ? 'default' : 'sm'}
      >
        {variant === 'create' ? (
          <>
            <Plus className="w-4 h-4 mr-2" />
            Nueva Pregunta
          </>
        ) : (
          <>
            <Edit className="w-4 h-4" />
          </>
        )}
      </Button>

      {/* Modal placeholder */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {variant === 'create' ? 'Nueva Pregunta' : 'Editar Pregunta'}
            </h2>
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="Enunciado de la pregunta"
                defaultValue={pregunta?.enunciado}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                rows={3}
              />
              <select
                defaultValue={pregunta?.tipo || 'multiple'}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              >
                <option value="multiple">Opción múltiple</option>
                <option value="verdadero_falso">Verdadero/Falso</option>
                <option value="respuesta_corta">Respuesta corta</option>
                <option value="ensayo">Ensayo</option>
              </select>
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {variant === 'create' ? 'Crear' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
