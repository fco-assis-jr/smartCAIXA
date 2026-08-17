import { Link } from '@inertiajs/react';
import { LayoutGrid, PackageMinus, Search, Wrench } from 'lucide-react';
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

// "Vendas por Gramatura" foi mesclada em "Vendas por Produto" (mesma tela,
// filtro "Buscar por: Peso (gramatura)") — ver PesquisarVendas/ProdutosPorDescricao/Index.tsx.

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
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
