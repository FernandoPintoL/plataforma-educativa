import AuthenticatedSessionController from '@/actions/App/Http/Controllers/Auth/AuthenticatedSessionController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import TextLink from '@/components/text-link';

interface LoginProps {
    status?: string;
}

export default function Login({ status }: LoginProps) {
    function register(): string {
        return route('register');
    }
    return (
        <AuthLayout title="Inicia sesión en tu cuenta" description="Ingresa tu correo o usuario y contraseña para continuar">
            <Head title="Iniciar sesión" />

            <Form {...AuthenticatedSessionController.store.form()} resetOnSuccess={['password']} className="flex flex-col gap-6">
                {({ processing, errors }) => (
                    <>
                        {/* Encabezado con logo para identidad de marca
                        <div className="flex flex-col items-center gap-3">
                            <img src="/logo.svg" alt="Distribuidora Paucara" className="h-12 w-auto" />
                            <p className="text-xs text-muted-foreground">Sistema de gestión de ventas</p>
                        </div>*/}

                        <div className="grid gap-6 rounded-lg border bg-background/60 p-6 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-black/20">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Correo o usuario</Label>
                                <Input
                                    id="email"
                                    type="text"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="username"
                                    placeholder="correo@ejemplo.com o usuario"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    {/*{canResetPassword && (
                                        <TextLink href={request()} className="ml-auto text-sm" tabIndex={5}>
                                            ¿Olvidaste tu contraseña?
                                        </TextLink>
                                    )}*/}
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox id="remember" name="remember" tabIndex={3} />
                                <Label htmlFor="remember">Recordarme</Label>
                            </div>

                            <Button type="submit" className="mt-2 w-full bg-red-600 text-white hover:bg-red-700 focus:ring-4 focus:ring-red-600/30 dark:bg-red-500 dark:hover:bg-red-600" tabIndex={4} disabled={processing}>
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                Iniciar sesión
                            </Button>
                        </div>

                        <div className="text-center text-sm text-muted-foreground">
                            ¿No tienes una cuenta?{' '}
                            <TextLink href={register()} tabIndex={5}>
                                Regístrate
                            </TextLink>
                        </div>
                    </>
                )}
            </Form>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
function route(name: string): string {
    // @ts-ignore
    if (typeof window !== 'undefined' && window.route) {
        // @ts-ignore
        return window.route(name);
    }
    // Fallback: just return the path for known routes
    if (name === 'register') {
        return '/register';
    }
    return '/';
}

