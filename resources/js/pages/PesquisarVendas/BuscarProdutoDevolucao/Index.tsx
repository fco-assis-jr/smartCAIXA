import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

export default function BuscarProdutoDevolucao() {
    return (
        <>
            <Head title="Consultar Devolução" />

            <div className="space-y-6">
                <Heading
                    title="Consultar Devolução"
                    description="Localize vendas de produtos para processar devoluções"
                />

                <div className="rounded-lg border bg-card p-6">
                    <p className="text-muted-foreground">
                        Funcionalidade em desenvolvimento...
                    </p>
                </div>
            </div>
        </>
    );
}

BuscarProdutoDevolucao.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Consultar Vendas', href: '#' },
            { title: 'Consultar Devolução', href: pesquisarVendas.buscarProdutoDevolucao.index.url() },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
