import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import Layout from '../../../components/Layout/Layout';
import {
  ArrowLeftIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  CalendarIcon,
  PhoneIcon,
  MapPinIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';

interface TipoUsuario {
  value: string;
  label: string;
}

interface Props {
  tiposUsuario: TipoUsuario[];
}

export default function Create({ tiposUsuario }: Props) {
  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    apellido: '',
    email: '',
    usernick: '',
    tipo_usuario: 'estudiante',
    fecha_nacimiento: '',
    telefono: '',
    direccion: '',
    generar_password: true,
    password: '',
    password_confirmation: '',
    enviar_email: false,
  });

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('admin.usuarios.store'), {
      onSuccess: () => reset(),
    });
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
      <div className="py-12">
      <Head title="Crear Usuario" />

      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              href={route('admin.usuarios.index')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Volver a usuarios
            </Link>
            <h2 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h2>
            <p className="mt-1 text-sm text-gray-600">
              Complete los datos para crear un nuevo usuario en el sistema
            </p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Usuario */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Tipo de Usuario</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {tiposUsuario.map((tipo) => (
                  <label
                    key={tipo.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 shadow-sm focus:outline-none ${
                      data.tipo_usuario === tipo.value
                        ? 'border-blue-500 ring-2 ring-blue-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="tipo_usuario"
                      value={tipo.value}
                      checked={data.tipo_usuario === tipo.value}
                      onChange={(e) => setData('tipo_usuario', e.target.value)}
                      className="sr-only"
                    />
                    <span className="flex flex-1">
                      <span className="flex flex-col">
                        <span className="block text-sm font-medium text-gray-900">{tipo.label}</span>
                      </span>
                    </span>
                    {data.tipo_usuario === tipo.value && (
                      <CheckCircleIcon className="h-5 w-5 text-blue-600 absolute top-4 right-4" />
                    )}
                  </label>
                ))}
              </div>
              {errors.tipo_usuario && (
                <p className="mt-2 text-sm text-red-600">{errors.tipo_usuario}</p>
              )}
            </div>

            {/* Datos Personales */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Datos Personales</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={data.name}
                      onChange={(e) => setData('name', e.target.value)}
                      onBlur={generarUsername}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Juan"
                    />
                  </div>
                  {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="apellido"
                      value={data.apellido}
                      onChange={(e) => setData('apellido', e.target.value)}
                      onBlur={generarUsername}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.apellido
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Pérez"
                    />
                  </div>
                  {errors.apellido && <p className="mt-2 text-sm text-red-600">{errors.apellido}</p>}
                </div>

                <div>
                  <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-700">
                    Fecha de Nacimiento
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      id="fecha_nacimiento"
                      value={data.fecha_nacimiento}
                      onChange={(e) => setData('fecha_nacimiento', e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.fecha_nacimiento
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                    />
                  </div>
                  {errors.fecha_nacimiento && (
                    <p className="mt-2 text-sm text-red-600">{errors.fecha_nacimiento}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
                    Teléfono
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <PhoneIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="telefono"
                      value={data.telefono}
                      onChange={(e) => setData('telefono', e.target.value)}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.telefono
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="+591 12345678"
                    />
                  </div>
                  {errors.telefono && <p className="mt-2 text-sm text-red-600">{errors.telefono}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">
                    Dirección
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPinIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      id="direccion"
                      rows={2}
                      value={data.direccion}
                      onChange={(e) => setData('direccion', e.target.value)}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.direccion
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="Av. Principal #123, Ciudad"
                    />
                  </div>
                  {errors.direccion && <p className="mt-2 text-sm text-red-600">{errors.direccion}</p>}
                </div>
              </div>
            </div>

            {/* Credenciales de Acceso */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Credenciales de Acceso</h3>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className={`pl-10 block w-full rounded-md sm:text-sm ${
                        errors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="usuario@ejemplo.com"
                    />
                  </div>
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label htmlFor="usernick" className="block text-sm font-medium text-gray-700">
                    Usuario <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-sm">@</span>
                    </div>
                    <input
                      type="text"
                      id="usernick"
                      value={data.usernick}
                      onChange={(e) => setData('usernick', e.target.value)}
                      className={`pl-8 block w-full rounded-md sm:text-sm ${
                        errors.usernick
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      }`}
                      placeholder="juan.perez"
                    />
                  </div>
                  {errors.usernick && <p className="mt-2 text-sm text-red-600">{errors.usernick}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    Este será el nombre de usuario para iniciar sesión
                  </p>
                </div>
              </div>

              {/* Opciones de contraseña */}
              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="generar_password"
                    type="checkbox"
                    checked={data.generar_password}
                    onChange={(e) => {
                      setData('generar_password', e.target.checked);
                      if (e.target.checked) {
                        setData({
                          ...data,
                          generar_password: true,
                          password: '',
                          password_confirmation: '',
                        });
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="generar_password" className="ml-2 block text-sm text-gray-900">
                    Generar contraseña automáticamente
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Se generará una contraseña segura aleatoria que se mostrará al crear el usuario
                </p>
              </div>

              {!data.generar_password && (
                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        id="password"
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        className={`pl-10 block w-full rounded-md sm:text-sm ${
                          errors.password
                            ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        }`}
                      />
                    </div>
                    {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                      Confirmar Contraseña <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type={mostrarPassword ? 'text' : 'password'}
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) => setData('password_confirmation', e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        id="mostrar_password"
                        type="checkbox"
                        checked={mostrarPassword}
                        onChange={(e) => setMostrarPassword(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor="mostrar_password" className="ml-2 block text-sm text-gray-900">
                        Mostrar contraseñas
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6">
                <div className="flex items-center">
                  <input
                    id="enviar_email"
                    type="checkbox"
                    checked={data.enviar_email}
                    onChange={(e) => setData('enviar_email', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="enviar_email" className="ml-2 block text-sm text-gray-900">
                    Enviar credenciales por email
                  </label>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  El usuario recibirá un correo con sus credenciales de acceso
                </p>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="flex justify-end gap-3">
              <Link
                href={route('admin.usuarios.index')}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                disabled={processing}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing ? 'Creando...' : 'Crear Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </Layout>
  );
}
