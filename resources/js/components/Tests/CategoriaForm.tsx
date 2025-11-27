import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';

interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
  test_vocacional_id: number;
  orden: number;
}

interface CategoriaFormProps {
  testId: number;
  categoria?: Categoria;
  onSuccess: () => void;
  variant?: 'create' | 'edit';
}

export default function CategoriaForm({
  testId,
  categoria,
  onSuccess,
  variant = 'create',
}: CategoriaFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nombre: categoria?.nombre || '',
    descripcion: categoria?.descripcion || '',
  });

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre,
        descripcion: categoria.descripcion || '',
      });
    }
  }, [categoria, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const url = categoria
        ? `/tests-vocacionales/${testId}/categorias/${categoria.id}`
        : `/tests-vocacionales/${testId}/categorias`;

      const method = categoria ? 'put' : 'post';

      await axios[method](url, formData);

      setFormData({ nombre: '', descripcion: '' });
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al guardar la categoría'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={variant === 'edit' ? 'outline' : 'default'} size={variant === 'edit' ? 'sm' : 'default'}>
          {variant === 'create' ? (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Categoría
            </>
          ) : (
            'Editar'
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
          </DialogTitle>
          <DialogDescription>
            {categoria
              ? 'Actualiza los datos de la categoría'
              : 'Crea una nueva categoría para organizar las preguntas del test'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nombre *
            </label>
            <Input
              placeholder="Ej: Habilidades Técnicas"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
              required
              minLength={3}
              maxLength={255}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 3 caracteres, máximo 255
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción
            </label>
            <Textarea
              placeholder="Describe el propósito de esta categoría..."
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              maxLength={1000}
              disabled={loading}
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Máximo 1000 caracteres
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {categoria ? 'Actualizar' : 'Crear'} Categoría
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
