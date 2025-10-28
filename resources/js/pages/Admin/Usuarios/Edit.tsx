import React from 'react';
import { Link, useForm, Head, router } from '@inertiajs/react';
import Layout from '../../../components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface TipoUsuario {
  value: string;
  label: string;
}

interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  usernick: string;
  tipo_usuario: 'profesor' | 'estudiante' | 'padre';
  fecha_nacimiento: string | null;
  telefono: string | null;
  direccion: string | null;
  activo: boolean;
}

interface Props {
  usuario: User;
  tiposUsuario: TipoUsuario[];
}

export default function Edit({ usuario, tiposUsuario }: Props) {
  const { data, setData, put, processing, errors } = useForm({
    name: usuario.name,
    apellido: usuario.apellido,
    email: usuario.email,
    usernick: usuario.usernick,
    tipo_usuario: usuario.tipo_usuario,
    fecha_nacimiento: usuario.fecha_nacimiento?.slice(0, 10) || '',
    telefono: usuario.telefono || '',
    direccion: usuario.direccion || '',
    activo: usuario.activo,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('admin.usuarios.update', usuario.id));
  };

  // Generar username automáticamente desde nombre y apellido
  const generarUsername = () => {
    if (data.name && data.apellido) {
      const username =
        data.name.toLowerCase().replace(/\s+/g, '') +
        '.' +
        data.apellido.toLowerCase().replace(/\s+/g, '');
      setData('usernick', username);
    }
  };

  return (
    <Layout>
      <Head title={`Editar - ${usuario.name} ${usuario.apellido}`} />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link href={route('admin.usuarios.show', usuario.id)}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Volver al detalle
              </Link>
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">Editar Usuario</h2>
            <p className="mt-1 text-sm text-gray-600">
              Actualiza la información de {usuario.name} {usuario.apellido}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Información Personal
                </CardTitle>
                <CardDescription>
                  Datos personales básicos del usuario
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">
                      Nombre <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      placeholder="Juan"
                      required
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="apellido">
                      Apellido <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="apellido"
                      type="text"
                      value={data.apellido}
                      onChange={(e) => setData('apellido', e.target.value)}
                      placeholder="Pérez"
                      required
                    />
                    {errors.apellido && (
                      <p className="text-sm text-red-500 mt-1">{errors.apellido}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_usuario">
                      Tipo de Usuario <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={data.tipo_usuario}
                      onValueChange={(value) => setData('tipo_usuario', value as any)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposUsuario.map((tipo) => (
                          <SelectItem key={tipo.value} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.tipo_usuario && (
                      <p className="text-sm text-red-500 mt-1">{errors.tipo_usuario}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="fecha_nacimiento">
                      <CalendarIcon className="inline h-4 w-4 mr-1" />
                      Fecha de Nacimiento
                    </Label>
                    <Input
                      id="fecha_nacimiento"
                      type="date"
                      value={data.fecha_nacimiento}
                      onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                    />
                    {errors.fecha_nacimiento && (
                      <p className="text-sm text-red-500 mt-1">{errors.fecha_nacimiento}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credenciales de Acceso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5" />
                  Credenciales de Acceso
                </CardTitle>
                <CardDescription>
                  Información para iniciar sesión en el sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">
                      Email <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      placeholder="usuario@ejemplo.com"
                      required
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="usernick">
                      Nombre de Usuario <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="usernick"
                        type="text"
                        value={data.usernick}
                        onChange={(e) => setData('usernick', e.target.value)}
                        placeholder="juan.perez"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={generarUsername}
                      >
                        Auto
                      </Button>
                    </div>
                    {errors.usernick && (
                      <p className="text-sm text-red-500 mt-1">{errors.usernick}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">
                      Solo letras, números, guiones y guiones bajos
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Información de Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5" />
                  Información de Contacto
                </CardTitle>
                <CardDescription>Datos de contacto adicionales (opcional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="telefono">
                      <PhoneIcon className="inline h-4 w-4 mr-1" />
                      Teléfono
                    </Label>
                    <Input
                      id="telefono"
                      type="tel"
                      value={data.telefono}
                      onChange={(e) => setData('telefono', e.target.value)}
                      placeholder="+1 234 567 8900"
                    />
                    {errors.telefono && (
                      <p className="text-sm text-red-500 mt-1">{errors.telefono}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="direccion">
                    <MapPinIcon className="inline h-4 w-4 mr-1" />
                    Dirección
                  </Label>
                  <Textarea
                    id="direccion"
                    value={data.direccion}
                    onChange={(e) => setData('direccion', e.target.value)}
                    placeholder="Calle Principal #123, Ciudad, País"
                    rows={3}
                  />
                  {errors.direccion && (
                    <p className="text-sm text-red-500 mt-1">{errors.direccion}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Estado */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Estado del Usuario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Usuario Activo</Label>
                    <p className="text-sm text-gray-500">
                      {data.activo
                        ? 'El usuario puede acceder al sistema'
                        : 'El usuario no puede acceder al sistema'}
                    </p>
                  </div>
                  <Switch
                    checked={data.activo}
                    onCheckedChange={(checked) => setData('activo', checked)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.visit(route('admin.usuarios.show', usuario.id))}
                disabled={processing}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={processing}>
                {processing ? 'Guardando...' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}
