import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, PackageMinus, Search, Wrench } from 'lucide-react';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import baixaProduto from '@/routes/baixa-produto';
import ferramentas from '@/routes/ferramentas';
import pesquisarVendas from '@/routes/pesquisar-vendas';
import type { NavItem } from '@/types';
import AppLogo from './app-logo';



const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Baixa Produto',
        href: baixaProduto.index(),
        icon: PackageMinus,
    },
    {
        title: 'Consultar Vendas',
        icon: Search,
        items: [
            {
                title: 'Vendas por Gramatura',
                href: pesquisarVendas.produtosPorGramatura.index(),
            },
            {
                title: 'Vendas por Produto',
                href: pesquisarVendas.produtosPorDescricao.index(),
            },
            {
                title: 'Consultar Devolução',
                href: pesquisarVendas.buscarProdutoDevolucao.index(),
            },
            {
                title: 'Itens da Nota Fiscal',
                href: pesquisarVendas.buscarItensNota.index(),
            },
        ],
    },
    {
        title: 'Ferramentas',
        icon: Wrench,
        items: [
            {
                title: 'DBLink',
                href: ferramentas.dblink.index(),
            },
        ],
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
