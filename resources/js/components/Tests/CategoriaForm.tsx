import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Plus, Edit } from 'lucide-react';

interface Props {
  testId: number;
  categoria?: { id: number; nombre: string; descripcion?: string };
  onSuccess: () => void;
  variant: 'create' | 'edit';
}

export default function CategoriaForm({ testId, categoria, onSuccess, variant }: Props) {
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar lógica de crear/editar categoría
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
            Nueva Categoría
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
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">
              {variant === 'create' ? 'Nueva Categoría' : 'Editar Categoría'}
            </h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Nombre de la categoría"
                defaultValue={categoria?.nombre}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
              />
              <textarea
                placeholder="Descripción (opcional)"
                defaultValue={categoria?.descripcion}
                className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                rows={3}
              />
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
