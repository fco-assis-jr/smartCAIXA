import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { useState } from 'react';
import { CaixaCombobox } from '@/components/caixa-combobox';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import ferramentas from '@/routes/ferramentas';

type Props = {
    filiais: ComboboxOption[];
    caixas: ComboboxOption[];
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

type DblinkResponse = {
    message: string;
    warning?: boolean;
};


export default function Dblink({ filiais, caixas }: Props) {
    const [processando, setProcessando] = useState(false);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const { data, setData } = useForm({
        codFilial: '',
        numeroCaixa: '',
    });

    const showAlert = (message: string, variant: 'default' | 'error' | 'warning' | 'success' = 'default') => {
        setAlert({ open: true, message, variant });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };


    const recriarDblink = async () => {
        if (!data.codFilial || !data.numeroCaixa) {
            showAlert('Selecione a filial e o número do caixa', 'warning');
            return;
        }

        setProcessando(true);
        try {
            const response = await axios.post<DblinkResponse>(
                ferramentas.dblink.recriar.url(),
                {
                    codFilial: data.codFilial,
                    numeroCaixa: parseInt(data.numeroCaixa),
                }
            );

            if (response.data.warning) {
                showAlert(response.data.message, 'warning');
            } else {
                showAlert(response.data.message, 'success');
            }
        } catch (error) {
            console.error('Erro ao recriar DBLink:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message ||
                                   'Erro ao recriar DBLink';
                showAlert(errorMessage, 'error');
            } else {
                showAlert('Erro ao recriar DBLink. Verifique sua conexão.', 'error');
            }
        } finally {
            setProcessando(false);
        }
    };


    return (
        <>
            <Head title="DBLink - Ferramentas" />

            <div className="px-4 py-6">
                <Heading
                    title="Recriar Conexão do Caixa"
                    description="Recrie a conexão do caixa com o servidor central"
                />

                <div className="mt-8 space-y-6 max-w-2xl mx-auto">
                    {/* Formulário de Recriação */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Selecione o Caixa</CardTitle>
                            <CardDescription>
                                Escolha a filial e o número do caixa que precisa reconectar ao servidor
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FilialCombobox
                                        filiais={filiais}
                                        value={data.codFilial}
                                        onChange={(value) => setData('codFilial', value)}
                                        disabled={processando}
                                    />
                                    <CaixaCombobox
                                        caixas={caixas}
                                        value={data.numeroCaixa}
                                        onChange={(value) => setData('numeroCaixa', value)}
                                        disabled={processando}
                                    />
                                </div>

                                {data.codFilial && data.numeroCaixa && (
                                    <div className="rounded-md bg-blue-50 border border-blue-200 p-4">
                                        <p className="text-sm font-medium text-blue-900">
                                            Caixa selecionado:
                                        </p>
                                        <p className="text-lg font-bold text-blue-900 mt-1">
                                            Filial {data.codFilial} - Caixa {data.numeroCaixa}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={recriarDblink}
                                    disabled={processando || !data.codFilial || !data.numeroCaixa}
                                    className="w-full"
                                    size="lg"
                                >
                                    {processando ? 'Reconectando...' : 'Reconectar ao Servidor'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Alert Dialog */}
            <CustomAlert
                open={alert.open}
                onClose={closeAlert}
                message={alert.message}
                variant={alert.variant}
            />
        </>
    );
}

Dblink.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Ferramentas', href: '#' },
            { title: 'DBLink', href: ferramentas.dblink.index.url() },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
