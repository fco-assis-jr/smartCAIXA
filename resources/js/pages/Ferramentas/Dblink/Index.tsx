import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { CaixaCombobox, type CaixaInfo } from '@/components/caixa-combobox';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import {
    StatusIndicator,
    type StatusState,
} from '@/components/status-indicator';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { dashboard } from '@/routes';
import ferramentas from '@/routes/ferramentas';

type Props = {
    filiais: ComboboxOption[];
    caixas: CaixaInfo[];
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

type DblinkStatusResponse = {
    exists: boolean;
    connectionOk?: boolean;
    unreachable?: boolean;
    message?: string;
};

export default function Dblink({ filiais, caixas }: Props) {
    const [processando, setProcessando] = useState(false);
    const [statusState, setStatusState] = useState<StatusState>('idle');
    const [statusInfo, setStatusInfo] = useState<DblinkStatusResponse | null>(
        null,
    );
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const { data, setData } = useForm({
        codFilial: '',
        numeroCaixa: '',
    });

    const caixaSelecionado = caixas.find(
        (caixa) =>
            caixa.codFilial === data.codFilial &&
            String(caixa.numeroCaixa) === data.numeroCaixa,
    );

    const showAlert = (
        message: string,
        variant: 'default' | 'error' | 'warning' | 'success' = 'default',
    ) => {
        setAlert({ open: true, message, variant });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const consultarStatus = useCallback(async () => {
        if (!data.codFilial || !data.numeroCaixa) {
            setStatusState('idle');
            setStatusInfo(null);
            return;
        }

        setStatusState('checking');
        try {
            const response = await axios.get<DblinkStatusResponse>(
                ferramentas.dblink.status.url(),
                {
                    params: {
                        codFilial: data.codFilial,
                        numeroCaixa: data.numeroCaixa,
                    },
                },
            );
            setStatusInfo(response.data);

            if (!response.data.exists) {
                setStatusState('idle');
            } else if (response.data.connectionOk) {
                setStatusState('online');
            } else {
                setStatusState('offline');
            }
        } catch (error) {
            console.error('Erro ao consultar status do DBLink:', error);
            setStatusState('offline');
        }
    }, [data.codFilial, data.numeroCaixa]);

    useEffect(() => {
        consultarStatus();
    }, [consultarStatus]);

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
                },
            );

            showAlert(
                response.data.message,
                response.data.warning ? 'warning' : 'success',
            );
            consultarStatus();
        } catch (error) {
            console.error('Erro ao recriar DBLink:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message || 'Erro ao recriar o DBLink';
                showAlert(errorMessage, 'error');
            } else {
                showAlert(
                    'Erro ao recriar o DBLink. Verifique sua conexão.',
                    'error',
                );
            }
        } finally {
            setProcessando(false);
        }
    };

    const statusLabel =
        !data.codFilial || !data.numeroCaixa
            ? 'Selecione um caixa para verificar o status'
            : statusState === 'checking'
              ? 'Verificando conexão…'
              : statusInfo?.unreachable
                ? 'Não foi possível verificar este caixa agora'
                : statusState === 'idle'
                  ? 'Este caixa ainda não foi conectado ao servidor central'
                  : statusState === 'online'
                    ? 'Conectado ao servidor central'
                    : 'Sem conexão com o servidor central';

    return (
        <>
            <Head title="DBLink - Ferramentas" />

            <div className="px-4 py-6">
                <Heading
                    title="Recriar Conexão do Caixa"
                    description="Recrie a conexão do caixa com o servidor central"
                />

                <div className="mx-auto mt-8 max-w-2xl space-y-6">
                    {/* Status atual do link */}
                    <div className="flex items-center justify-between rounded-lg border bg-card px-4 py-3 shadow-sm">
                        <StatusIndicator
                            state={statusState}
                            label={statusLabel}
                        />
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={consultarStatus}
                            disabled={!data.codFilial || !data.numeroCaixa}
                            title="Verificar novamente"
                        >
                            <RefreshCw
                                className={
                                    statusState === 'checking'
                                        ? 'size-4 animate-spin'
                                        : 'size-4'
                                }
                            />
                        </Button>
                    </div>

                    {/* Formulário de Recriação */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">
                                Selecione o Caixa
                            </CardTitle>
                            <CardDescription>
                                Escolha a filial e o número do caixa para
                                recriar o DBLink
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FilialCombobox
                                        filiais={filiais}
                                        value={data.codFilial}
                                        onChange={(value) =>
                                            setData((prev) => ({
                                                ...prev,
                                                codFilial: value,
                                                numeroCaixa: '',
                                            }))
                                        }
                                        disabled={processando}
                                    />
                                    <CaixaCombobox
                                        caixas={caixas}
                                        codFilial={data.codFilial}
                                        value={data.numeroCaixa}
                                        onChange={(value) =>
                                            setData('numeroCaixa', value)
                                        }
                                        disabled={processando}
                                    />
                                </div>

                                {caixaSelecionado && (
                                    <div className="rounded-md border border-info/30 bg-info/10 p-4">
                                        <p className="text-sm font-medium text-info">
                                            Caixa selecionado:
                                        </p>
                                        <p className="mt-1 font-mono text-lg font-bold text-info">
                                            {caixaSelecionado.descricao}
                                        </p>
                                    </div>
                                )}

                                <Button
                                    onClick={recriarDblink}
                                    disabled={
                                        processando ||
                                        !data.codFilial ||
                                        !data.numeroCaixa
                                    }
                                    className="w-full"
                                    size="lg"
                                >
                                    {processando
                                        ? 'Recriando...'
                                        : 'Recriar DBLink'}
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
