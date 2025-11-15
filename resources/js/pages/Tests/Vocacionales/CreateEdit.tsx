import React, { useState } from 'react';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import AppLayout from '../../../components/Layout/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Switch } from '../../../components/ui/switch';
import { Alert, AlertDescription } from '../../../components/ui/alert';
import { ChevronLeft, Save, AlertCircle } from 'lucide-react';

interface TestVocacionalProps {
  test?: {
    id: number;
    nombre: string;
    descripcion: string;
    duracion_estimada: number;
    activo: boolean;
    categorias?: any[];
  };
  isEdit?: boolean;
}

export default function CreateEdit({ test, isEdit = false }: TestVocacionalProps) {
  const { errors } = usePage().props;
  const { data, setData, post, put, processing } = useForm({
    nombre: test?.nombre || '',
    descripcion: test?.descripcion || '',
    duracion_estimada: test?.duracion_estimada || 45,
    activo: test?.activo || true,
  });

  const breadcrumbs = [
    { label: 'Inicio', href: '/dashboard' },
    { label: 'Tests Vocacionales', href: '/tests-vocacionales' },
    { label: isEdit ? 'Editar' : 'Crear' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEdit && test) {
      put(`/tests-vocacionales/${test.id}`);
    } else {
      post('/tests-vocacionales');
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={isEdit ? 'Editar Test Vocacional' : 'Crear Test Vocacional'} />

      <div className="space-y-6 p-4">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/tests-vocacionales">
            <Button variant="outline" size="sm">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Editar Test Vocacional' : 'Crear Nuevo Test Vocacional'}
            </h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">
              {isEdit
                ? 'Modifica los detalles del test vocacional'
                : 'Define un nuevo test para orientación vocacional'}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información Básica</CardTitle>
              <CardDescription>
                Proporciona los detalles fundamentales del test
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Nombre */}
              <div className="space-y-2">
                <Label htmlFor="nombre">
                  Nombre del Test <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nombre"
                  type="text"
                  placeholder="Ej: Test de Aptitudes Profesionales"
                  value={data.nombre}
                  onChange={(e) => setData('nombre', e.target.value)}
                  className={errors?.nombre ? 'border-red-500' : ''}
                />
                {errors?.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre}</p>
                )}
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  placeholder="Describe el propósito y contenido del test..."
                  value={data.descripcion}
                  onChange={(e) => setData('descripcion', e.target.value)}
                  rows={4}
                  className={errors?.descripcion ? 'border-red-500' : ''}
                />
                {errors?.descripcion && (
                  <p className="text-sm text-red-500">{errors.descripcion}</p>
                )}
                <p className="text-xs text-gray-500">Máximo 1000 caracteres</p>
              </div>

              {/* Duración */}
              <div className="space-y-2">
                <Label htmlFor="duracion_estimada">
                  Duración Estimada (minutos)
                </Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="duracion_estimada"
                    type="number"
                    min="1"
                    max="480"
                    value={data.duracion_estimada}
                    onChange={(e) =>
                      setData('duracion_estimada', parseInt(e.target.value) || 0)
                    }
                    className="max-w-xs"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({Math.floor(data.duracion_estimada / 60)}h{' '}
                    {data.duracion_estimada % 60}m)
                  </span>
                </div>
                {errors?.duracion_estimada && (
                  <p className="text-sm text-red-500">
                    {errors.duracion_estimada}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Máximo 480 minutos (8 horas)
                </p>
              </div>

              {/* Estado */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="activo" className="text-base font-medium">
                    Test Activo
                  </Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.activo
                      ? 'Los estudiantes pueden resolver este test'
                      : 'Este test está desactivado'}
                  </p>
                </div>
                <Switch
                  id="activo"
                  checked={data.activo}
                  onCheckedChange={(checked) => setData('activo', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {isEdit
                ? 'Los cambios se reflejarán inmediatamente. Las respuestas ya registradas no serán afectadas.'
                : 'Después de crear el test, podrás agregar preguntas y categorías.'}
            </AlertDescription>
          </Alert>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={processing}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {processing
                ? 'Guardando...'
                : isEdit
                  ? 'Actualizar Test'
                  : 'Crear Test'}
            </Button>

            <Link href="/tests-vocacionales">
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>

        {/* Additional Info */}
        {isEdit && test?.categorias && test.categorias.length > 0 && (
          <Card className="border-blue-200 bg-blue-50 dark:border-blue-900 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-lg">Contenido del Test</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                Este test contiene {test.categorias.length} categorías con
                preguntas. Edítalas desde la vista de detalles del test.
              </p>
              <Link href={`/tests-vocacionales/${test.id}`}>
                <Button variant="outline" size="sm">
                  Ver Detalles del Test
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
