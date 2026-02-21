import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronDown, ChevronUp, FileText, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

type Produto = {
    CODAUXILIAR: string;
    CODPROD: string;
    DESCRICAO: string;
    EMBALAGEM: string;
    UNIDADE: string;
};

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

export default function ProdutosPorDescricao({ filiais }: Props) {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [buscando, setBuscando] = useState(false);
    const [filtroExpandido, setFiltroExpandido] = useState(true);
    const [date, setDate] = useState<Date>(new Date());
    const [produtosSelecionados, setProdutosSelecionados] = useState<Produto[]>([]);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [buscandoProdutos, setBuscandoProdutos] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState('descricao');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const { data, setData, reset } = useForm({
        filial: '',
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

    // Buscar produtos no autocomplete
    useEffect(() => {
        // Determinar o mínimo de caracteres baseado no tipo de busca
        const minCaracteres = tipoBusca === 'descricao' ? 3 : 1;

        // Só busca se a filial estiver selecionada e termo tiver caracteres mínimos
        if (data.filial && termoBusca.length >= minCaracteres) {
            const timer = setTimeout(async () => {
                setBuscandoProdutos(true);
                try {
                    const response = await axios.post(
                        '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar-produtos',
                        {
                            filial: data.filial,
                            tipoBusca: tipoBusca,
                            termo: termoBusca
                        },
                    );

                    if (response.data.success) {
                        setProdutos(response.data.produtos);
                    }
                } catch (error) {
                    console.error('Erro ao buscar produtos:', error);
                } finally {
                    setBuscandoProdutos(false);
                }
            }, 500);

            return () => clearTimeout(timer);
        } else {
            setProdutos([]);
        }
    }, [termoBusca, data.filial, tipoBusca]);

    const adicionarProduto = (produto: Produto) => {
        if (!produtosSelecionados.find((p) => p.CODAUXILIAR === produto.CODAUXILIAR)) {
            setProdutosSelecionados([...produtosSelecionados, produto]);
            setTermoBusca('');
            setOpenCombobox(false);
        }
    };

    const removerProduto = (codauxiliar: string) => {
        setProdutosSelecionados(produtosSelecionados.filter((p) => p.CODAUXILIAR !== codauxiliar));
    };

    const buscarVendas = async () => {
        if (!data.filial) {
            showAlert('Selecione a filial', 'warning');
            return;
        }

        if (produtosSelecionados.length === 0) {
            showAlert('Selecione pelo menos um produto', 'warning');
            return;
        }

        if (!date) {
            showAlert('Selecione a data da venda', 'warning');
            return;
        }

        setBuscando(true);

        try {
            const codauxiliares = produtosSelecionados.map((p) => p.CODAUXILIAR);

            const response = await axios.post(
                '/smartcaixa/pesquisar-vendas/produtos-por-descricao/buscar',
                {
                    filial: data.filial,
                    codauxiliares,
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
        setProdutosSelecionados([]);
        setTermoBusca('');
        setTipoBusca('descricao');
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
            <Head title="Vendas por Produto" />

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
                    title="Vendas por Produto"
                    description="Consulte vendas através do nome ou descrição do produto"
                />

                <div className="mt-6 space-y-4">
                    {/* Card de Filtros */}
                    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                        <button
                            onClick={() => setFiltroExpandido(!filtroExpandido)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/50"
                        >
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold">Filtros</h2>
                                <p className="mt-0.5 text-xs text-muted-foreground">
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
                                <div className="grid gap-3 md:grid-cols-4">
                                    <FilialCombobox
                                        filiais={filiais}
                                        value={data.filial}
                                        onChange={(value: string) => setData('filial', value)}
                                        disabled={buscando}
                                    />

                                    <div className="space-y-2">
                                        <Label className="text-sm">Tipo de Busca</Label>
                                        <Select
                                            value={tipoBusca}
                                            onValueChange={setTipoBusca}
                                            disabled={!data.filial || buscando}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="descricao">Descrição</SelectItem>
                                                <SelectItem value="codauxiliar">Cód. Auxiliar</SelectItem>
                                                <SelectItem value="codprod">Cód. Produto</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm">Produtos</Label>
                                        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    className="w-full justify-start text-left font-normal"
                                                    disabled={!data.filial}
                                                >
                                                    <Search className="mr-2 size-4" />
                                                    {!data.filial
                                                        ? 'Selecione a filial primeiro'
                                                        : tipoBusca === 'descricao'
                                                          ? 'Buscar por descrição...'
                                                          : tipoBusca === 'codauxiliar'
                                                            ? 'Buscar por cód. auxiliar...'
                                                            : 'Buscar por cód. produto...'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[400px] p-0" align="start">
                                                <Command shouldFilter={false}>
                                                    <CommandInput
                                                        placeholder={
                                                            tipoBusca === 'descricao'
                                                                ? 'Digite a descrição do produto...'
                                                                : tipoBusca === 'codauxiliar'
                                                                  ? 'Digite o código auxiliar...'
                                                                  : 'Digite o código do produto...'
                                                        }
                                                        value={termoBusca}
                                                        onValueChange={setTermoBusca}
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            {buscandoProdutos
                                                                ? 'Buscando...'
                                                                : termoBusca.length < (tipoBusca === 'descricao' ? 3 : 1)
                                                                  ? tipoBusca === 'descricao'
                                                                    ? 'Digite pelo menos 3 caracteres'
                                                                    : 'Digite pelo menos 1 caractere'
                                                                  : 'Nenhum produto encontrado'}
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {produtos.map((produto) => (
                                                                <CommandItem
                                                                    key={produto.CODAUXILIAR}
                                                                    value={produto.CODAUXILIAR}
                                                                    onSelect={() => adicionarProduto(produto)}
                                                                >
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">
                                                                            {produto.DESCRICAO}
                                                                        </span>
                                                                        <span className="text-xs text-muted-foreground">
                                                                            Aux: {produto.CODAUXILIAR} | Prod: {produto.CODPROD} | {produto.EMBALAGEM}
                                                                        </span>
                                                                    </div>
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
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

                                {/* Produtos Selecionados */}
                                {produtosSelecionados.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {produtosSelecionados.map((produto) => (
                                            <div
                                                key={produto.CODAUXILIAR}
                                                className="flex items-center gap-1 rounded-md border bg-secondary px-2 py-1 text-sm"
                                            >
                                                <span className="max-w-[200px] truncate">
                                                    {produto.CODAUXILIAR} - {produto.DESCRICAO}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        removerProduto(produto.CODAUXILIAR)
                                                    }
                                                    className="rounded-sm hover:bg-muted"
                                                >
                                                    <X className="size-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Botões */}
                                <div className="mt-3 flex justify-end gap-3">
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
                                                    Vendedor
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
                                    Selecione a filial, produtos e data nos filtros acima e clique em
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

ProdutosPorDescricao.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Consultar Vendas', href: '#' },
            {
                title: 'Vendas por Produto',
                href: pesquisarVendas.produtosPorDescricao.index.url(),
            },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
