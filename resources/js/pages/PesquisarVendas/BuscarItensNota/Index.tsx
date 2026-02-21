import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

export default function BuscarItensNota() {
    return (
        <>
            <Head title="Itens da Nota Fiscal" />

            <div className="space-y-6">
                <Heading
                    title="Itens da Nota Fiscal"
                    description="Visualize todos os itens vendidos em uma nota fiscal"
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

BuscarItensNota.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Consultar Vendas', href: '#' },
            { title: 'Itens da Nota Fiscal', href: pesquisarVendas.buscarItensNota.index.url() },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
