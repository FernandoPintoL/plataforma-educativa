
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Link } from '@inertiajs/react';
import { Users, BookOpen, GraduationCap, Home, Shield } from 'lucide-react';
import AppLogo from './app-logo';

const staticMenu = [
    {
        title: 'Dashboard',
        href: '/',
        icon: Home,
    },
    {
        title: 'Estudiantes',
        href: '/educacion/estudiantes',
        icon: BookOpen,
    },
    {
        title: 'Profesores',
        href: '/educacion/profesores',
        icon: GraduationCap,
    },
    {
        title: 'Cursos',
        href: '/educacion/cursos',
        icon: BookOpen,
    },
    {
        title: 'Usuarios',
        href: '/usuarios',
        icon: Users,
    },
    {
        title: 'Roles y Permisos',
        href: '/roles',
        icon: Shield,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <nav className="mt-4">
                    <ul className="space-y-1">
                        {staticMenu.map((item) => (
                            <li key={item.title}>
                                <Link
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-2 rounded hover:bg-sidebar-accent transition-colors"
                                >
                                    <item.icon className="h-5 w-5 text-sidebar-foreground/70" />
                                    <span className="font-medium">{item.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={[]} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}