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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Loader2, Trash2, Copy } from 'lucide-react';

type QuestionType = 'opcion_multiple' | 'verdadero_falso' | 'escala_likert';

interface Pregunta {
  id: number;
  enunciado: string;
  tipo: QuestionType;
  opciones?: string[];
  escala_minima?: number;
  escala_maxima?: number;
  categoria_test_id: number;
  orden: number;
}

interface PreguntaFormProps {
  testId: number;
  categoriaId: number;
  pregunta?: Pregunta;
  onSuccess: () => void;
  variant?: 'create' | 'edit';
}

const QUESTION_TYPES = {
  opcion_multiple: 'Opción Múltiple',
  verdadero_falso: 'Verdadero/Falso',
  escala_likert: 'Escala Likert',
};

export default function PreguntaForm({
  testId,
  categoriaId,
  pregunta,
  onSuccess,
  variant = 'create',
}: PreguntaFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    enunciado: pregunta?.enunciado || '',
    tipo: (pregunta?.tipo || 'opcion_multiple') as QuestionType,
    opciones: pregunta?.opciones || ['', ''],
    escala_minima: pregunta?.escala_minima || 1,
    escala_maxima: pregunta?.escala_maxima || 5,
  });

  useEffect(() => {
    if (pregunta) {
      setFormData({
        enunciado: pregunta.enunciado,
        tipo: pregunta.tipo,
        opciones: pregunta.opciones || ['', ''],
        escala_minima: pregunta.escala_minima || 1,
        escala_maxima: pregunta.escala_maxima || 5,
      });
    }
  }, [pregunta, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate opciones for multiple choice
      if (formData.tipo === 'opcion_multiple') {
        const validOpciones = formData.opciones.filter((o) => o.trim());
        if (validOpciones.length < 2 || validOpciones.length > 5) {
          setError('Debe haber entre 2 y 5 opciones');
          setLoading(false);
          return;
        }
      }

      const submitData = {
        ...formData,
        opciones:
          formData.tipo === 'opcion_multiple'
            ? formData.opciones.filter((o) => o.trim())
            : undefined,
      };

      const url = pregunta
        ? `/tests-vocacionales/${testId}/preguntas/${pregunta.id}`
        : `/tests-vocacionales/${testId}/categorias/${categoriaId}/preguntas`;

      const method = pregunta ? 'put' : 'post';

      await axios[method](url, submitData);

      setFormData({
        enunciado: '',
        tipo: 'opcion_multiple',
        opciones: ['', ''],
        escala_minima: 1,
        escala_maxima: 5,
      });
      setOpen(false);
      onSuccess();
    } catch (err: any) {
      setError(
        err.response?.data?.message || 'Error al guardar la pregunta'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant === 'edit' ? 'outline' : 'default'}
          size={variant === 'edit' ? 'sm' : 'default'}
        >
          {variant === 'create' ? (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Pregunta
            </>
          ) : (
            'Editar'
          )}
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {pregunta ? 'Editar Pregunta' : 'Nueva Pregunta'}
          </DialogTitle>
          <DialogDescription>
            {pregunta
              ? 'Actualiza los datos de la pregunta'
              : 'Crea una nueva pregunta para esta categoría'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Enunciado *
            </label>
            <Textarea
              placeholder="Escribe la pregunta..."
              value={formData.enunciado}
              onChange={(e) =>
                setFormData({ ...formData, enunciado: e.target.value })
              }
              required
              minLength={10}
              maxLength={500}
              disabled={loading}
              rows={3}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mínimo 10 caracteres, máximo 500
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Pregunta *
            </label>
            <Select
              value={formData.tipo}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  tipo: value as QuestionType,
                })
              }
              disabled={loading}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUESTION_TYPES).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Opciones for Multiple Choice */}
          {formData.tipo === 'opcion_multiple' && (
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Opciones (2-5) *
                </label>
                <Badge variant="outline">
                  {formData.opciones.filter((o) => o.trim()).length}/5
                </Badge>
              </div>

              {formData.opciones.map((opcion, index) => (
                <div key={index} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder={`Opción ${index + 1}`}
                      value={opcion}
                      onChange={(e) => {
                        const newOpciones = [...formData.opciones];
                        newOpciones[index] = e.target.value;
                        setFormData({ ...formData, opciones: newOpciones });
                      }}
                      disabled={loading}
                      maxLength={100}
                    />
                  </div>
                  {formData.opciones.length > 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        const newOpciones = formData.opciones.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, opciones: newOpciones });
                      }}
                      disabled={loading}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  )}
                </div>
              ))}

              {formData.opciones.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      opciones: [...formData.opciones, ''],
                    })
                  }
                  disabled={loading}
                >
                  <Plus className="w-3 h-3 mr-2" />
                  Agregar Opción
                </Button>
              )}
            </div>
          )}

          {/* Scale for Likert */}
          {formData.tipo === 'escala_likert' && (
            <div className="space-y-3 border-t pt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Escala Mínima
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.escala_minima}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        escala_minima: parseInt(e.target.value) || 1,
                      })
                    }
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Escala Máxima
                  </label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={formData.escala_maxima}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        escala_maxima: parseInt(e.target.value) || 5,
                      })
                    }
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          )}

          {/* True/False Info */}
          {formData.tipo === 'verdadero_falso' && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-sm text-blue-600 dark:text-blue-400">
              Se generarán automáticamente las opciones: Verdadero y Falso
            </div>
          )}

          <div className="flex gap-2 justify-end pt-4 border-t">
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
              {pregunta ? 'Actualizar' : 'Crear'} Pregunta
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
