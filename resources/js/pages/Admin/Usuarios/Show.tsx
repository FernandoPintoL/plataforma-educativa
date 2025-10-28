import React, { useState } from 'react';
import { Link, router, Head } from '@inertiajs/react';
import Layout from '../../../components/Layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  UserIcon,
  AcademicCapIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

interface User {
  id: number;
  name: string;
  apellido: string;
  email: string;
  usernick: string;
  tipo_usuario: 'profesor' | 'estudiante' | 'padre';
  activo: boolean;
  telefono: string | null;
  direccion: string | null;
  fecha_nacimiento: string | null;
  created_at: string;
  roles: Array<{ name: string }>;
  cursos_como_profesor?: any[];
  cursos_como_estudiante?: any[];
}

interface Estadisticas {
  cursos_dictados?: number;
  estudiantes_total?: number;
  cursos_inscritos?: number;
  trabajos_entregados?: number;
  promedio_general?: number | null;
}

interface Props {
  usuario: User;
  estadisticas: Estadisticas;
}

export default function Show({ usuario, estadisticas }: Props) {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleReactivar = () => {
    if (confirm('¿Estás seguro de reactivar este usuario?')) {
      router.post(route('admin.usuarios.reactivar', usuario.id));
    }
  };

  const handleDesactivar = () => {
    if (confirm('¿Estás seguro de desactivar este usuario?')) {
      router.delete(route('admin.usuarios.destroy', usuario.id));
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    router.post(
      route('admin.usuarios.reset-password', usuario.id),
      {
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        onFinish: () => {
          setProcessing(false);
          setShowPasswordModal(false);
          setPassword('');
          setPasswordConfirmation('');
        },
      }
    );
  };

  const getTipoUsuarioColor = (tipo: string) => {
    const colores = {
      profesor: 'bg-blue-500',
      estudiante: 'bg-green-500',
      padre: 'bg-purple-500',
    };
    return colores[tipo as keyof typeof colores] || 'bg-gray-500';
  };

  return (
    <Layout>
      <Head title={`${usuario.name} ${usuario.apellido}`} />

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={route('admin.usuarios.index')}>
                  <ArrowLeftIcon className="h-4 w-4 mr-2" />
                  Volver a Usuarios
                </Link>
              </Button>
              <h1 className="text-3xl font-bold text-gray-900 mt-4">
                {usuario.name} {usuario.apellido}
              </h1>
              <p className="text-sm text-gray-500 mt-1">@{usuario.usernick}</p>
            </div>

            <div className="flex gap-2">
              {usuario.activo ? (
                <>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={route('admin.usuarios.edit', usuario.id)}>
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowPasswordModal(true)}
                  >
                    <KeyIcon className="h-4 w-4 mr-2" />
                    Resetear Contraseña
                  </Button>
                  <Button variant="destructive" size="sm" onClick={handleDesactivar}>
                    Desactivar
                  </Button>
                </>
              ) : (
                <Button variant="default" size="sm" onClick={handleReactivar}>
                  Reactivar Usuario
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Columna Izquierda - Información Personal */}
            <div className="lg:col-span-2 space-y-6">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Personal</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <Label className="text-gray-500 text-sm">Tipo de Usuario</Label>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge className={getTipoUsuarioColor(usuario.tipo_usuario)}>
                          {usuario.tipo_usuario.toUpperCase()}
                        </Badge>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm">Estado</Label>
                      <div className="mt-1">
                        {usuario.activo ? (
                          <Badge className="bg-green-500">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Activo
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircleIcon className="h-3 w-3 mr-1" />
                            Inactivo
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        Email
                      </Label>
                      <p className="mt-1 font-medium">{usuario.email}</p>
                    </div>

                    <div>
                      <Label className="text-gray-500 text-sm flex items-center gap-2">
                        <UserIcon className="h-4 w-4" />
                        Usuario
                      </Label>
                      <p className="mt-1 font-medium">@{usuario.usernick}</p>
                    </div>

                    {usuario.telefono && (
                      <div>
                        <Label className="text-gray-500 text-sm flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          Teléfono
                        </Label>
                        <p className="mt-1 font-medium">{usuario.telefono}</p>
                      </div>
                    )}

                    {usuario.fecha_nacimiento && (
                      <div>
                        <Label className="text-gray-500 text-sm flex items-center gap-2">
                          <CalendarIcon className="h-4 w-4" />
                          Fecha de Nacimiento
                        </Label>
                        <p className="mt-1 font-medium">
                          {new Date(usuario.fecha_nacimiento).toLocaleDateString()}
                        </p>
                      </div>
                    )}

                    {usuario.direccion && (
                      <div className="col-span-2">
                        <Label className="text-gray-500 text-sm flex items-center gap-2">
                          <MapPinIcon className="h-4 w-4" />
                          Dirección
                        </Label>
                        <p className="mt-1 font-medium">{usuario.direccion}</p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <Label className="text-gray-500 text-sm">Fecha de Registro</Label>
                      <p className="mt-1 font-medium">
                        {new Date(usuario.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Estadísticas por tipo de usuario */}
              {(usuario.tipo_usuario === 'profesor' || usuario.tipo_usuario === 'estudiante') && (
                <Card>
                  <CardHeader>
                    <CardTitle>Estadísticas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {usuario.tipo_usuario === 'profesor' && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Cursos Dictados</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {estadisticas.cursos_dictados || 0}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Total Estudiantes</p>
                          <p className="text-2xl font-bold text-green-600">
                            {estadisticas.estudiantes_total || 0}
                          </p>
                        </div>
                      </div>
                    )}

                    {usuario.tipo_usuario === 'estudiante' && (
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm text-gray-600">Cursos</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {estadisticas.cursos_inscritos || 0}
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <p className="text-sm text-gray-600">Trabajos</p>
                          <p className="text-2xl font-bold text-green-600">
                            {estadisticas.trabajos_entregados || 0}
                          </p>
                        </div>
                        <div className="p-4 bg-purple-50 rounded-lg">
                          <p className="text-sm text-gray-600">Promedio</p>
                          <p className="text-2xl font-bold text-purple-600">
                            {estadisticas.promedio_general
                              ? estadisticas.promedio_general.toFixed(1)
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Columna Derecha - Información Adicional */}
            <div className="space-y-6">
              {/* Roles */}
              <Card>
                <CardHeader>
                  <CardTitle>Roles Asignados</CardTitle>
                </CardHeader>
                <CardContent>
                  {usuario.roles && usuario.roles.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {usuario.roles.map((role, index) => (
                        <Badge key={index} variant="outline">
                          {role.name}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No tiene roles asignados</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Resetear Contraseña */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Resetear Contraseña</CardTitle>
              <CardDescription>
                Ingresa la nueva contraseña para {usuario.name} {usuario.apellido}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <Label htmlFor="password">Nueva Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div>
                  <Label htmlFor="password_confirmation">Confirmar Contraseña</Label>
                  <Input
                    id="password_confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    required
                    minLength={8}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPasswordModal(false)}
                    disabled={processing}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={processing}>
                    {processing ? 'Guardando...' : 'Resetear Contraseña'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </Layout>
  );
}
