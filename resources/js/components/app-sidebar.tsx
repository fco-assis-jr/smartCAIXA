import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    PackageMinus,
    Search,
    ShieldCheck,
    Wrench,
} from 'lucide-react';
import { useMemo } from 'react';
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
import administrador from '@/routes/administrador';
import baixaProduto from '@/routes/baixa-produto';
import ferramentas from '@/routes/ferramentas';
import pesquisarVendas from '@/routes/pesquisar-vendas';
import type { NavItem, SharedData } from '@/types';
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
        menuKey: 'consultar-vendas',
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
        menuKey: 'ferramentas',
        items: [
            {
                title: 'DBLink',
                href: ferramentas.dblink.index(),
            },
        ],
    },
    {
        title: 'Administrador',
        href: administrador.menuAcesso.index(),
        icon: ShieldCheck,
        menuKey: 'administrador',
    },
];

export function AppSidebar() {
    const { menuAccess } = usePage<SharedData>().props;

    // Um item sem menuKey é liberado pra todos (ex.: Dashboard, Baixa
    // Produto); com menuKey, some da barra se o setor do usuário não tiver
    // acesso configurado (ver menuAccess em HandleInertiaRequests).
    const visibleNavItems = useMemo(
        () =>
            mainNavItems.filter(
                (item) => !item.menuKey || menuAccess[item.menuKey],
            ),
        [menuAccess],
    );

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
                <NavMain items={visibleNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
