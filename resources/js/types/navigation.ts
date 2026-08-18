import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

export type BreadcrumbItem = {
    title: string;
    href: string;
};

export type NavItem = {
    title: string;
    href?: NonNullable<InertiaLinkProps['href']> | string;
    icon?: LucideIcon | null;
    isActive?: boolean;
    items?: NavItem[];
    /** Chave em config/menu_access.php — some da barra lateral se o setor do usuário não tiver acesso. Sem chave = liberado para todos. */
    menuKey?: string;
};
