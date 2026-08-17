import { Head } from '@inertiajs/react';
import { ComingSoon } from '@/components/coming-soon';
import Heading from '@/components/heading';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

export default function BuscarItensNota() {
    return (
        <>
            <Head title="Itens da Nota Fiscal" />

            <div className="px-4 py-6">
                <Heading
                    title="Itens da Nota Fiscal"
                    description="Visualize todos os itens vendidos em uma nota fiscal"
                />

                <div className="mt-6">
                    <ComingSoon description="A consulta de itens por nota fiscal ainda está sendo construída e chega em breve." />
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
            {
                title: 'Itens da Nota Fiscal',
                href: pesquisarVendas.buscarItensNota.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
