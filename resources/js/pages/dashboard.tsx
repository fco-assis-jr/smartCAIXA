import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    FileSearch,
    PackageMinus,
    Receipt,
    RotateCcw,
    Wrench,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import baixaProduto from '@/routes/baixa-produto';
import ferramentas from '@/routes/ferramentas';
import pesquisarVendas from '@/routes/pesquisar-vendas';
import type { BreadcrumbItem, SharedData } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

type Tool = {
    title: string;
    description: string;
    href: string;
    icon: typeof PackageMinus;
};

type Section = {
    label: string;
    tools: Tool[];
    /**
     * Chave em config/menus.php — a seção inteira some do dashboard se o
     * setor do usuário não tiver acesso (ver menuAccess em
     * HandleInertiaRequests, mesmo mecanismo do app-sidebar.tsx). Sem
     * chave, a seção é liberada pra todos (ex.: Baixa Produto).
     */
    menuKey?: string;
};

const sections: Section[] = [
    {
        label: 'Operação de loja',
        tools: [
            {
                title: 'Baixa Produto',
                description:
                    'Registre vencimento, avaria, doação e outras baixas de estoque.',
                href: baixaProduto.index().url,
                icon: PackageMinus,
            },
        ],
    },
    {
        label: 'Consultar vendas',
        menuKey: 'consultar-vendas',
        tools: [
            {
                title: 'Vendas por Produto',
                description:
                    'Busque vendas por descrição, código ou peso (gramatura).',
                href: pesquisarVendas.produtosPorDescricao.index().url,
                icon: FileSearch,
            },
            {
                title: 'Consultar Devolução',
                description:
                    'Localize a venda original de um produto para devolução.',
                href: pesquisarVendas.buscarProdutoDevolucao.index().url,
                icon: RotateCcw,
            },
            {
                title: 'Itens da Nota Fiscal',
                description: 'Veja todos os itens vendidos em uma nota fiscal.',
                href: pesquisarVendas.buscarItensNota.index().url,
                icon: Receipt,
            },
        ],
    },
    {
        label: 'Ferramentas',
        menuKey: 'ferramentas',
        tools: [
            {
                title: 'DBLink',
                description:
                    'Reconecte um caixa ao servidor central quando ele cair.',
                href: ferramentas.dblink.index().url,
                icon: Wrench,
            },
        ],
    },
];

function useClock() {
    const [now, setNow] = useState<Date | null>(null);

    useEffect(() => {
        const tick = () => setNow(new Date());
        const immediate = setTimeout(tick, 0);
        const interval = setInterval(tick, 1000);
        return () => {
            clearTimeout(immediate);
            clearInterval(interval);
        };
    }, []);

    return now;
}

export default function Dashboard() {
    const { auth, menuAccess } = usePage<SharedData>().props;
    const now = useClock();
    const firstName = auth.user.name?.split(' ')[0] || auth.user.name;

    // Mesma regra do menu lateral: seção sem menuKey é liberada pra
    // todos; com menuKey, só aparece se o setor do usuário tiver acesso.
    const visibleSections = sections.filter(
        (section) => !section.menuKey || menuAccess[section.menuKey],
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-8 p-4 md:p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <Heading
                        title={`Olá, ${firstName}`}
                        description="Escolha uma ferramenta abaixo para começar."
                    />
                    <div className="rounded-md border bg-card px-3 py-2 text-right shadow-xs">
                        <div className="font-mono text-lg leading-none font-semibold tabular-nums">
                            {now ? now.toLocaleTimeString('pt-BR') : '--:--:--'}
                        </div>
                        <div className="mt-0.5 text-xs text-muted-foreground capitalize">
                            {now
                                ? now.toLocaleDateString('pt-BR', {
                                      weekday: 'long',
                                      day: '2-digit',
                                      month: 'long',
                                  })
                                : ''}
                        </div>
                    </div>
                </div>

                {visibleSections.map((section) => (
                    <section key={section.label} className="space-y-3">
                        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                            {section.label}
                        </h3>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {section.tools.map((tool) => (
                                <Link
                                    key={tool.href}
                                    href={tool.href}
                                    prefetch
                                    className="group flex items-start gap-4 rounded-lg border bg-card p-4 shadow-xs transition-colors hover:border-primary/40 hover:bg-accent/40"
                                >
                                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                                        <tool.icon className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center gap-1.5">
                                            <h4 className="font-display text-sm font-bold">
                                                {tool.title}
                                            </h4>
                                            <ArrowRight className="size-3.5 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                                        </div>
                                        <p className="mt-1 text-sm text-muted-foreground">
                                            {tool.description}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </AppLayout>
    );
}
