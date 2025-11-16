import { useState, useEffect } from 'react';
import { NavFooter } from '@/components/nav-footer';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { MenuItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import {
    Users, BookOpen, GraduationCap, Home, Shield, Calendar, CheckSquare,
    FileText, ListChecks, Settings, Bell, Activity, UserCheck, User, BarChart2,
    Folder, MessageSquare, Clock, HelpCircle, Award, PlusCircle, Archive,
    Clipboard, Layout, DollarSign, LucideIcon, ChevronDown, Layers, AlertTriangle, TrendingUp
} from 'lucide-react';
import AppLogo from './app-logo';
import { cn } from '@/lib/utils';

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
    Layers: Layers,
    ClipboardList: Clipboard,
    Edit2: FileText,
    Eye: Activity,
    BarChart: BarChart2,
    Star: Award,
    Key: Shield,
    Mail: MessageSquare,
    Edit: FileText,
    UserPlus: UserCheck,
    // Agregar más iconos según sea necesario
};

// Componente para renderizar un elemento del menú
const MenuItemComponent = ({ item }: { item: MenuItem }) => {
    const { url } = usePage();
    const [isOpen, setIsOpen] = useState<boolean>(() => {
        // Cargar estado desde localStorage
        const savedState = localStorage.getItem(`menu-${item.title}`);
        if (savedState !== null) {
            return savedState === 'true';
        }
        // Por defecto, expandir si algún hijo está activo
        if (item.children && item.children.length > 0) {
            return item.children.some(child => url === child.href);
        }
        return false;
    });

    // Guardar estado en localStorage cuando cambia
    useEffect(() => {
        if (item.children && item.children.length > 0) {
            localStorage.setItem(`menu-${item.title}`, isOpen.toString());
        }
    }, [isOpen, item.title, item.children]);

    // Obtener el componente de icono
    const IconComponent = item.icon && iconMap[item.icon] ? iconMap[item.icon] : Home;

    // Verificar si este ítem o algún hijo está activo
    const isActive = url === item.href;
    const hasActiveChild = item.children?.some(child => url === child.href);

    // Si el ítem tiene hijos/submenús
    if (item.children && item.children.length > 0) {
        return (
            <li className="mb-1">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg transition-all duration-200",
                        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        "group relative",
                        hasActiveChild && "bg-sidebar-accent/50 text-sidebar-accent-foreground font-medium"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <IconComponent className={cn(
                            "h-5 w-5 transition-colors",
                            hasActiveChild ? "text-sidebar-accent-foreground" : "text-sidebar-foreground/70"
                        )} />
                        <span className="font-medium text-sm">{item.title}</span>
                    </div>
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>

                {/* Submenú con animación */}
                <div
                    className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                >
                    <ul className="ml-4 mt-1 space-y-0.5 border-l-2 border-sidebar-border pl-4">
                        {item.children.map((child, index) => (
                            <MenuItemComponent key={`${child.title}-${index}`} item={child} />
                        ))}
                    </ul>
                </div>
            </li>
        );
    }

    // Si es un ítem sin hijos
    return (
        <li>
            <Link
                href={item.href}
                className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    "group relative",
                    isActive && "bg-primary text-primary-foreground font-medium shadow-sm"
                )}
            >
                <IconComponent className={cn(
                    "h-4 w-4 transition-colors",
                    isActive ? "text-primary-foreground" : "text-sidebar-foreground/70 group-hover:text-sidebar-accent-foreground"
                )} />
                <span className="text-sm">{item.title}</span>
                {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full" />
                )}
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

            <SidebarContent className="px-2">
                <nav className="mt-2">
                    <ul className="space-y-1">
                        {modulosSidebar && modulosSidebar.length > 0 ? (
                            // Usar los datos dinámicos del servidor
                            modulosSidebar.map((item, index) => (
                                <MenuItemComponent key={`${item.title}-${index}`} item={item} />
                            ))
                        ) : (
                            // Si no hay datos, mostrar un elemento de carga o mensaje
                            <li className="px-4 py-2 text-sm text-muted-foreground flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                <span>Cargando menú...</span>
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