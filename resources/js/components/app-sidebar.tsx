
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Users, BookOpen, GraduationCap, Home, Shield, Calendar, CheckSquare,
    FileText, ListChecks, Settings, Bell, Activity, UserCheck, User, BarChart2,
    Folder, MessageSquare, Clock, HelpCircle, Award, PlusCircle, Archive,
    Clipboard, Layout, DollarSign, LucideIcon
} from 'lucide-react';
import AppLogo from './app-logo';

// Mapeo de nombres de iconos a componentes de iconos
const iconMap: Record<string, LucideIcon> = {
    Home: Home,
    Users: Users,
    User: User,
    UserCheck: UserCheck,
    BookOpen: BookOpen,
    GraduationCap: GraduationCap,
    Shield: Shield,
    Calendar: Calendar,
    CheckSquare: CheckSquare,
    FileText: FileText,
    ListChecks: ListChecks,
    Settings: Settings,
    Bell: Bell,
    Activity: Activity,
    BarChart2: BarChart2,
    Folder: Folder,
    MessageSquare: MessageSquare,
    Clock: Clock,
    HelpCircle: HelpCircle,
    Award: Award,
    PlusCircle: PlusCircle,
    Archive: Archive,
    Clipboard: Clipboard,
    Layout: Layout,
    DollarSign: DollarSign,
    List: ListChecks,
    // Agregar más iconos según sea necesario
};

// Componente para renderizar un elemento del menú (puede tener hijos/submenús)
// Componente para renderizar un elemento del menú
const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    // Obtener el componente de icono correspondiente o usar Home como predeterminado
    const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Home;

    // Si el ítem tiene hijos/submenús
    if (item.children && item.children.length > 0) {
        return (
            <li>
                <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                        <IconComponent className="h-5 w-5 text-sidebar-foreground/70" />
                        <span className="font-medium">{item.title}</span>
                    </div>
                </div>
                <ul className="ml-6 mt-1 space-y-1">
                    {item.children.map((child, index) => (
                        <MenuItemComponent key={`${child.title}-${index}`} item={child} />
                    ))}
                </ul>
            </li>
        );
    }

    // Si es un ítem sin hijos
    return (
        <li>
            <Link
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 rounded hover:bg-sidebar-accent transition-colors"
            >
                <IconComponent className="h-5 w-5 text-sidebar-foreground/70" />
                <span className="font-medium">{item.title}</span>
            </Link>
        </li>
    );
};

export function AppSidebar() {
    // Obtener los módulos del sidebar desde la página actual
    const { props } = usePage();
    const modulosSidebar = props.modulosSidebar as MenuItem[] | undefined;

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
                        {modulosSidebar && modulosSidebar.length > 0 ? (
                            // Usar los datos dinámicos del servidor
                            modulosSidebar.map((item, index) => (
                                <MenuItemComponent key={`${item.title}-${index}`} item={item} />
                            ))
                        ) : (
                            // Si no hay datos, mostrar un elemento de carga o mensaje
                            <li className="px-4 py-2 text-sm text-gray-500">
                                Cargando menú...
                            </li>
                        )}
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