import { Head } from '@inertiajs/react';
import { ComingSoon } from '@/components/coming-soon';
import Heading from '@/components/heading';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

export default function BuscarProdutoDevolucao() {
    return (
        <>
            <Head title="Consultar Devolução" />

            <div className="px-4 py-6">
                <Heading
                    title="Consultar Devolução"
                    description="Localize vendas de produtos para processar devoluções"
                />

                <div className="mt-6">
                    <ComingSoon description="A consulta de devoluções ainda está sendo construída e chega em breve." />
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
            {
                title: 'Consultar Devolução',
                href: pesquisarVendas.buscarProdutoDevolucao.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
