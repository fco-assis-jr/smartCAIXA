import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    Calendar as CalendarIcon,
    FileText,
    Loader2,
    Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import { TablePagination } from '@/components/table-pagination';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { gerarPDFNotaBranca } from '@/lib/gerar-pdf-nota-branca';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

type NotaBranca = {
    NUMNOTA: string;
    NUMTRANSVENDA: string;
    DTSAIDA: string;
    HORA: string;
    CLIENTE: string;
    CPF_CNPJ: string;
    CHAVENFE: string;
    VLTOTAL: number | string;
    CODFILIAL: string;
    ORIGEM_NFE: string;
};

type Props = {
    filiais: ComboboxOption[];
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

const formatarValor = (valor: number | string | undefined) => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (!numero || isNaN(numero)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numero);
};

const formatarData = (valor: string) => {
    // DTSAIDA volta como "YYYY-MM-DD HH:MM:SS" (sem hora relevante — a hora
    // real da venda vem separada, no campo HORA).
    const [data] = valor.split(' ');
    const [ano, mes, dia] = data.split('-');
    return ano && mes && dia ? `${dia}/${mes}/${ano}` : valor;
};

export default function NotaBranca({ filiais }: Props) {
    const [notas, setNotas] = useState<NotaBranca[]>([]);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25);
    const [buscando, setBuscando] = useState(false);
    const [gerandoPdfPara, setGerandoPdfPara] = useState<string | null>(null);
    const [dataInicial, setDataInicial] = useState<Date>(new Date());
    const [dataFinal, setDataFinal] = useState<Date>(new Date());
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const { data, setData } = useForm({
        filial: '',
    });

    const showAlert = (
        message: string,
        variant: AlertState['variant'] = 'default',
    ) => {
        setAlert({ open: true, message, variant });
    };

    const closeAlert = () => setAlert((atual) => ({ ...atual, open: false }));

    // Mantém o intervalo sempre válido: mover a data inicial para depois da
    // final empurra a final junto (e vice-versa), em vez de deixar escolher
    // um período invertido.
    const escolherDataInicial = (novaData: Date | undefined) => {
        if (!novaData) return;
        setDataInicial(novaData);
        if (novaData > dataFinal) {
            setDataFinal(novaData);
        }
    };

    const escolherDataFinal = (novaData: Date | undefined) => {
        if (!novaData) return;
        setDataFinal(novaData);
        if (novaData < dataInicial) {
            setDataInicial(novaData);
        }
    };

    const buscarNotas = async () => {
        if (!data.filial) {
            showAlert('Selecione a filial', 'warning');
            return;
        }

        setBuscando(true);
        try {
            const response = await axios.post(
                pesquisarVendas.notaBranca.buscar.url(),
                {
                    filial: data.filial,
                    dataInicio: format(dataInicial, 'yyyy-MM-dd'),
                    dataFim: format(dataFinal, 'yyyy-MM-dd'),
                },
            );

            if (response.data.success) {
                setNotas(response.data.notas);
                setPaginaAtual(1);
                if (response.data.notas.length === 0) {
                    showAlert(
                        'Nenhuma nota encontrada com os filtros informados',
                        'warning',
                    );
                }
            } else {
                showAlert(
                    response.data.message ?? 'Erro ao buscar notas',
                    'error',
                );
            }
        } catch (error) {
            console.error('Erro ao buscar notas:', error);
            showAlert('Erro ao buscar notas. Tente novamente.', 'error');
        } finally {
            setBuscando(false);
        }
    };

    const limparFiltros = () => {
        setData('filial', '');
        setDataInicial(new Date());
        setDataFinal(new Date());
        setNotas([]);
        setPaginaAtual(1);
    };

    const gerarPdf = async (nota: NotaBranca) => {
        setGerandoPdfPara(nota.NUMTRANSVENDA);
        try {
            const response = await axios.get(
                pesquisarVendas.notaBranca.xml.url({
                    numTransVenda: nota.NUMTRANSVENDA,
                }),
            );

            if (!response.data.success) {
                showAlert(
                    response.data.message ??
                        'Não foi possível obter o XML da nota.',
                    'error',
                );
                return;
            }

            await gerarPDFNotaBranca({
                xml: response.data.xml,
                numNota: nota.NUMNOTA,
                chaveNFe: nota.CHAVENFE,
                cliente: nota.CLIENTE,
                cpfCnpj: nota.CPF_CNPJ,
                valorTotal: nota.VLTOTAL,
                dataSaida: formatarData(nota.DTSAIDA),
            });
        } catch (error) {
            console.error('Erro ao gerar PDF da nota:', error);
            showAlert('Erro ao gerar o PDF da nota. Tente novamente.', 'error');
        } finally {
            setGerandoPdfPara(null);
        }
    };

    const notasPaginadas = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return notas.slice(inicio, inicio + itensPorPagina);
    }, [notas, paginaAtual, itensPorPagina]);

    const trocarItensPorPagina = (itens: number) => {
        setItensPorPagina(itens);
        setPaginaAtual(1);
    };

    return (
        <>
            <Head title="Nota Branca (NFC)" />

            <CustomAlert
                open={alert.open}
                onClose={closeAlert}
                message={alert.message}
                variant={alert.variant}
            />

            <div className="px-4 py-6">
                <Heading
                    title="Nota Branca (NFC)"
                    description="Busque notas fiscais modelo 55 por filial e período, e gere um DANFE simplificado a partir do XML."
                />

                <div className="mt-6 space-y-4">
                    {/* Card de Filtros */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm">Filtros</CardTitle>
                            <CardDescription>
                                Selecione a filial e o período para buscar as
                                notas
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                <FilialCombobox
                                    filiais={filiais}
                                    value={data.filial}
                                    onChange={(value: string) =>
                                        setData('filial', value)
                                    }
                                    disabled={buscando}
                                />

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="dataInicial"
                                        className="text-sm"
                                    >
                                        Data Inicial
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="dataInicial"
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                                disabled={buscando}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {format(dataInicial, 'PPP', {
                                                    locale: ptBR,
                                                })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={dataInicial}
                                                onSelect={escolherDataInicial}
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="dataFinal"
                                        className="text-sm"
                                    >
                                        Data Final
                                    </Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                id="dataFinal"
                                                variant="outline"
                                                className="w-full justify-start text-left font-normal"
                                                disabled={buscando}
                                            >
                                                <CalendarIcon className="mr-2 size-4" />
                                                {format(dataFinal, 'PPP', {
                                                    locale: ptBR,
                                                })}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={dataFinal}
                                                onSelect={escolherDataFinal}
                                                locale={ptBR}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="mt-3 flex justify-end gap-3">
                                <Button
                                    variant="outline"
                                    onClick={limparFiltros}
                                    disabled={buscando}
                                >
                                    Limpar
                                </Button>
                                <Button
                                    onClick={buscarNotas}
                                    disabled={buscando}
                                >
                                    <Search className="mr-2 size-4" />
                                    {buscando ? 'Buscando...' : 'Buscar'}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Card de Resultados */}
                    {notas.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Resultados da Pesquisa</CardTitle>
                                <CardDescription>
                                    {notas.length}{' '}
                                    {notas.length === 1
                                        ? 'nota encontrada'
                                        : 'notas encontradas'}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="w-[90px]">
                                                    Nota
                                                </TableHead>
                                                <TableHead className="w-[110px]">
                                                    Data/Hora
                                                </TableHead>
                                                <TableHead className="min-w-[220px]">
                                                    Cliente
                                                </TableHead>
                                                <TableHead className="w-[140px]">
                                                    CPF/CNPJ
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Valor
                                                </TableHead>
                                                <TableHead className="w-[110px] text-center">
                                                    Origem
                                                </TableHead>
                                                <TableHead className="w-[120px] text-center">
                                                    Ações
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {notasPaginadas.map((nota) => (
                                                <TableRow
                                                    key={nota.NUMTRANSVENDA}
                                                >
                                                    <TableCell className="font-mono text-sm font-medium">
                                                        {nota.NUMNOTA}
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        <div>
                                                            {formatarData(
                                                                nota.DTSAIDA,
                                                            )}
                                                        </div>
                                                        <div className="font-mono text-xs text-muted-foreground">
                                                            {nota.HORA}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div
                                                            className="truncate"
                                                            title={nota.CLIENTE}
                                                        >
                                                            {nota.CLIENTE ||
                                                                'Consumidor não identificado'}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {nota.CPF_CNPJ}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium tabular-nums">
                                                        {formatarValor(
                                                            nota.VLTOTAL,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <span
                                                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                                nota.ORIGEM_NFE ===
                                                                'Autorizada'
                                                                    ? 'bg-success/10 text-success'
                                                                    : 'bg-warning/15 text-warning'
                                                            }`}
                                                        >
                                                            {nota.ORIGEM_NFE}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={
                                                                gerandoPdfPara !==
                                                                null
                                                            }
                                                            onClick={() =>
                                                                gerarPdf(nota)
                                                            }
                                                        >
                                                            {gerandoPdfPara ===
                                                            nota.NUMTRANSVENDA ? (
                                                                <>
                                                                    <Loader2 className="mr-1 size-3.5 animate-spin" />
                                                                    Gerando...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FileText className="mr-1 size-3.5" />
                                                                    Gerar PDF
                                                                </>
                                                            )}
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                            <CardFooter className="p-0">
                                <TablePagination
                                    paginaAtual={paginaAtual}
                                    totalItens={notas.length}
                                    itensPorPagina={itensPorPagina}
                                    onChangePagina={setPaginaAtual}
                                    onChangeItensPorPagina={
                                        trocarItensPorPagina
                                    }
                                    disabled={buscando}
                                />
                            </CardFooter>
                        </Card>
                    )}

                    {/* Estado Vazio */}
                    {notas.length === 0 && !buscando && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <Search className="size-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mb-2">
                                    Nenhuma nota encontrada
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Selecione a filial e o período nos filtros
                                    acima e clique em "Buscar" para visualizar
                                    as notas
                                </CardDescription>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </>
    );
}

NotaBranca.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Consultar Vendas', href: '#' },
            {
                title: 'Nota Branca (NFC)',
                href: pesquisarVendas.notaBranca.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
