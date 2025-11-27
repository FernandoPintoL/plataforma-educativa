import React, { useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, GripVertical, Loader2 } from 'lucide-react';
import PreguntaForm from './PreguntaForm';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: string;
  opciones?: string[];
  categoria_test_id: number;
  orden: number;
}

interface PreguntaListProps {
  testId: number;
  categoriaId: number;
  preguntas: Pregunta[];
  onUpdate: () => void;
}

const QUESTION_TYPE_LABELS = {
  opcion_multiple: 'Opción Múltiple',
  verdadero_falso: 'Verdadero/Falso',
  escala_likert: 'Escala Likert',
};

const QUESTION_TYPE_COLORS = {
  opcion_multiple: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  verdadero_falso: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  escala_likert: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

export default function PreguntaList({
  testId,
  categoriaId,
  preguntas,
  onUpdate,
}: PreguntaListProps) {
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;

    setDeleting(true);
    try {
      await axios.delete(
        `/tests-vocacionales/${testId}/preguntas/${deleteId}`
      );
      setDeleteId(null);
      onUpdate();
    } catch (error) {
      console.error('Error al eliminar pregunta:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: number) => {
    if (!draggedId || draggedId === targetId) return;

    const draggedIndex = preguntas.findIndex((p) => p.id === draggedId);
    const targetIndex = preguntas.findIndex((p) => p.id === targetId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newPreguntas = [...preguntas];
    const [draggedItem] = newPreguntas.splice(draggedIndex, 1);
    newPreguntas.splice(targetIndex, 0, draggedItem);

    const ordenIds = newPreguntas.map((p) => p.id);

    try {
      await axios.post(
        `/tests-vocacionales/${testId}/categorias/${categoriaId}/preguntas/reorder`,
        { orden: ordenIds }
      );
      onUpdate();
    } catch (error) {
      console.error('Error al reordenar preguntas:', error);
    } finally {
      setDraggedId(null);
    }
  };

  if (preguntas.length === 0) {
    return null;
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-8"></TableHead>
              <TableHead className="w-10">Nº</TableHead>
              <TableHead>Enunciado</TableHead>
              <TableHead className="w-40">Tipo</TableHead>
              <TableHead className="w-24 text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preguntas.map((pregunta, index) => (
              <TableRow
                key={pregunta.id}
                draggable
                onDragStart={() => handleDragStart(pregunta.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(pregunta.id)}
                className={`cursor-grab active:cursor-grabbing ${
                  draggedId === pregunta.id ? 'opacity-50' : ''
                }`}
              >
                <TableCell className="text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </TableCell>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="max-w-md">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {pregunta.enunciado}
                    </p>
                    {pregunta.opciones && pregunta.opciones.length > 0 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {pregunta.opciones.slice(0, 2).join(', ')}
                        {pregunta.opciones.length > 2 && '...'}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      QUESTION_TYPE_COLORS[
                        pregunta.tipo as keyof typeof QUESTION_TYPE_COLORS
                      ]
                    }
                  >
                    {
                      QUESTION_TYPE_LABELS[
                        pregunta.tipo as keyof typeof QUESTION_TYPE_LABELS
                      ]
                    }
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <PreguntaForm
                    testId={testId}
                    categoriaId={categoriaId}
                    pregunta={pregunta}
                    onSuccess={onUpdate}
                    variant="edit"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(pregunta.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Pregunta</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar esta pregunta? Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Eliminar
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
