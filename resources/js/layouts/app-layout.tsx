import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { type ReactNode, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import { usePage } from '@inertiajs/react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { props: pageProps } = usePage();

    // Mostrar notificaciones de sesión
    useEffect(() => {
        const flash = pageProps.flash as Record<string, string> | undefined;

        if (flash?.success) {
            toast.success(flash.success, {
                duration: 4000,
                position: 'bottom-right',
            });
        }

        if (flash?.error) {
            toast.error(flash.error, {
                duration: 4000,
                position: 'bottom-right',
            });
        }

        if (flash?.warning) {
            toast.warning(flash.warning, {
                duration: 4000,
                position: 'bottom-right',
            });
        }

        if (flash?.info) {
            toast.info(flash.info, {
                duration: 4000,
                position: 'bottom-right',
            });
        }
    }, [pageProps.flash?.success, pageProps.flash?.error, pageProps.flash?.warning, pageProps.flash?.info]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}
            {/* Sonner Toaster - Modern toast notifications */}
            <Toaster
                position="bottom-right"
                expand={true}
                richColors
                closeButton
                duration={4000}
            />
        </AppLayoutTemplate>
    );
};
