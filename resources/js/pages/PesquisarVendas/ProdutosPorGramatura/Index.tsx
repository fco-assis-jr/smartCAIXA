import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, FileText, Search } from 'lucide-react';
import { useState } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import { GramaturaCombobox } from '@/components/gramatura-combobox';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import pesquisarVendas from '@/routes/pesquisar-vendas';

type Venda = {
    CODAUXILIAR: string;
    CODPROD: string;
    DESCRICAO: string;
    QT: number | string;
    PUNIT: number | string;
    NUMNOTA: string;
    CAIXA: string;
    HORA: string;
    QRCODENFCE: string;
    NOME: string;
};

type Props = {
    filiais: ComboboxOption[];
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

export default function ProdutosPorGramatura({ filiais }: Props) {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [filtroExpandido, setFiltroExpandido] = useState(true);
    const [date, setDate] = useState<Date>(new Date());
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const { data, setData, reset } = useForm({
        filial: '',
        gramatura: '',
    });

    const showAlert = (
        message: string,
        variant: 'default' | 'error' | 'warning' | 'success' = 'default',
    ) => {
        setAlert({ open: true, message, variant });
    };

    const closeAlert = () => {
        setAlert({ ...alert, open: false });
    };

    const buscarVendas = async () => {
        if (!data.filial) {
            showAlert('Selecione a filial', 'warning');
            return;
        }

        if (!data.gramatura) {
            showAlert('Selecione a gramatura', 'warning');
            return;
        }

        if (!date) {
            showAlert('Selecione a data da venda', 'warning');
            return;
        }

        setBuscando(true);

        try {
            const response = await axios.post(
                '/smartcaixa/pesquisar-vendas/produtos-por-gramatura/buscar',
                {
                    filial: data.filial,
                    gramatura: data.gramatura,
                    data: format(date, 'yyyy-MM-dd'),
                },
            );

            if (response.data.success) {
                setVendas(response.data.vendas);
                if (response.data.vendas.length === 0) {
                    showAlert('Nenhuma venda encontrada com os filtros informados', 'warning');
                }
            } else {
                showAlert('Erro ao buscar vendas', 'error');
            }
        } catch (error: unknown) {
            console.error('Erro ao buscar vendas:', error);
            const message =
                error instanceof Error ? error.message : 'Erro ao buscar vendas. Tente novamente.';
            showAlert(message, 'error');
        } finally {
            setBuscando(false);
        }
    };

    const limparFiltros = () => {
        reset();
        setDate(new Date());
        setVendas([]);
    };

    const formatarValor = (valor: number | string | undefined) => {
        const numericValue = typeof valor === 'string' ? parseFloat(valor) : valor;
        if (!numericValue || isNaN(numericValue)) return 'R$ 0,00';

        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(numericValue);
    };

    const formatarPeso = (peso: number | string | undefined) => {
        const numericValue = typeof peso === 'string' ? parseFloat(peso) : peso;
        if (!numericValue || isNaN(numericValue)) return '0.000 KG';

        return `${numericValue.toFixed(3)} KG`;
    };

    return (
        <>
            <Head title="Vendas por Gramatura" />

            <CustomAlert
                open={alert.open}
                onClose={closeAlert}
                title={
                    alert.variant === 'error'
                        ? 'Erro'
                        : alert.variant === 'warning'
                          ? 'Atenção'
                          : alert.variant === 'success'
                            ? 'Sucesso'
                            : 'Informação'
                }
                message={alert.message}
                variant={alert.variant}
            />

            <div className="px-4 py-6">
                <Heading
                    title="Vendas por Gramatura"
                    description="Consulte vendas de produtos comercializados por peso (kg, g)"
                />

                <div className="mt-6 space-y-4">
                    {/* Card de Filtros */}
                    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
                        <button
                            onClick={() => setFiltroExpandido(!filtroExpandido)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold">Filtros</h2>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Selecione os critérios para buscar as vendas
                                </p>
                            </div>
                            {filtroExpandido ? (
                                <ChevronUp className="size-4 text-muted-foreground" />
                            ) : (
                                <ChevronDown className="size-4 text-muted-foreground" />
                            )}
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${
                                filtroExpandido
                                    ? 'max-h-96 opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="px-4 pb-4 pt-3 border-t">
                                <div className="grid gap-6 md:grid-cols-3">
                            <div>
                                <FilialCombobox
                                    filiais={filiais}
                                    value={data.filial}
                                    onChange={(value: string) => setData('filial', value)}
                                    disabled={buscando}
                                />
                            </div>

                            <div>
                                <GramaturaCombobox
                                    value={data.gramatura}
                                    onValueChange={(value) => setData('gramatura', value)}
                                    disabled={buscando}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="data" className="text-sm">Data da Venda</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                'w-full justify-start text-left font-normal',
                                                !date && 'text-muted-foreground',
                                            )}
                                            disabled={buscando}
                                        >
                                            <CalendarIcon className="mr-2 size-4" />
                                            {date ? (
                                                format(date, 'PPP', {
                                                    locale: ptBR,
                                                })
                                            ) : (
                                                <span>Selecione uma data</span>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate) => newDate && setDate(newDate)}
                                            locale={ptBR}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={limparFiltros}
                                disabled={buscando}
                            >
                                Limpar
                            </Button>
                            <Button onClick={buscarVendas} disabled={buscando}>
                                <Search className="mr-2 size-4" />
                                {buscando ? 'Buscando...' : 'Buscar'}
                            </Button>
                        </div>
                            </div>
                        </div>
                    </div>

                {/* Card de Resultados */}
                {vendas.length > 0 && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Resultados da Pesquisa</CardTitle>
                                    <CardDescription>
                                        {vendas.length}{' '}
                                        {vendas.length === 1
                                            ? 'venda encontrada'
                                            : 'vendas encontradas'}
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">
                                                Cód. Auxiliar
                                            </TableHead>
                                            <TableHead className="w-[100px]">
                                                Cód. Produto
                                            </TableHead>
                                            <TableHead className="min-w-[250px]">
                                                Descrição
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Quantidade
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Preço Unit.
                                            </TableHead>
                                            <TableHead className="text-right">Total</TableHead>
                                            <TableHead className="w-[100px]">Nota</TableHead>
                                            <TableHead className="w-[80px] text-center">
                                                Caixa
                                            </TableHead>
                                            <TableHead className="w-[80px] text-center">
                                                Hora
                                            </TableHead>
                                            <TableHead className="min-w-[200px]">
                                                Operador(a)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vendas.map((venda, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="font-mono text-sm font-medium">
                                                    {venda.CODAUXILIAR}
                                                </TableCell>
                                                <TableCell className="font-mono text-sm">
                                                    {venda.CODPROD}
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className="truncate"
                                                        title={venda.DESCRICAO}
                                                    >
                                                        {venda.DESCRICAO}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right font-medium tabular-nums">
                                                    {formatarPeso(venda.QT)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {formatarValor(venda.PUNIT)}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold tabular-nums">
                                                    {formatarValor(
                                                        (typeof venda.QT === 'string'
                                                            ? parseFloat(venda.QT)
                                                            : venda.QT || 0) *
                                                            (typeof venda.PUNIT === 'string'
                                                                ? parseFloat(venda.PUNIT)
                                                                : venda.PUNIT || 0),
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {venda.QRCODENFCE ? (
                                                        <a
                                                            href={venda.QRCODENFCE}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                                            title="Abrir QR Code da nota"
                                                        >
                                                            <FileText className="size-3.5" />
                                                            {venda.NUMNOTA}
                                                        </a>
                                                    ) : (
                                                        <span className="text-sm">
                                                            {venda.NUMNOTA}
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center font-medium">
                                                    {venda.CAIXA}
                                                </TableCell>
                                                <TableCell className="text-center font-mono text-sm">
                                                    {venda.HORA}
                                                </TableCell>
                                                <TableCell>
                                                    <div
                                                        className="truncate text-sm"
                                                        title={venda.NOME}
                                                    >
                                                        {venda.NOME}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Estado Vazio */}
                {vendas.length === 0 && !buscando && (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-16">
                            <div className="mb-4 rounded-full bg-muted p-4">
                                <Search className="size-8 text-muted-foreground" />
                            </div>
                            <CardTitle className="mb-2">Nenhuma venda encontrada</CardTitle>
                            <CardDescription className="text-center">
                                Selecione a filial, gramatura e data nos filtros acima e clique em
                                "Buscar" para visualizar as vendas
                            </CardDescription>
                        </CardContent>
                    </Card>
                )}
                </div>
            </div>
        </>
    );
}

ProdutosPorGramatura.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Consultar Vendas', href: '#' },
            {
                title: 'Vendas por Gramatura',
                href: pesquisarVendas.produtosPorGramatura.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
