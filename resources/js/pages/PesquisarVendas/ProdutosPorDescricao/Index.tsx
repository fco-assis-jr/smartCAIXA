import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Calendar as CalendarIcon,
    ChevronDown,
    ChevronUp,
    FileText,
    Search,
    X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import { GramaturaCombobox } from '@/components/gramatura-combobox';
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
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
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

type TipoBusca = 'descricao' | 'codauxiliar' | 'codprod' | 'gramatura';

type Props = {
    filiais: ComboboxOption[];
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

const TIPO_BUSCA_LABEL: Record<TipoBusca, string> = {
    descricao: 'Descrição',
    codauxiliar: 'Cód. Auxiliar',
    codprod: 'Cód. Produto',
    gramatura: 'Peso (gramatura)',
};

// Colunas ordenáveis clicando no título. "VALOR" não existe na venda —
// é o total (QT x PUNIT) calculado na hora de ordenar/exibir.
type ColunaOrdenacao =
    | 'CODAUXILIAR'
    | 'CODPROD'
    | 'DESCRICAO'
    | 'QT'
    | 'PUNIT'
    | 'VALOR'
    | 'NUMNOTA'
    | 'CAIXA'
    | 'HORA'
    | 'NOME';

const paraNumero = (valor: number | string | undefined): number => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
};

const valorVenda = (venda: Venda) => paraNumero(venda.QT) * paraNumero(venda.PUNIT);

const chaveOrdenacao = (venda: Venda, coluna: ColunaOrdenacao): number | string => {
    switch (coluna) {
        case 'QT':
        case 'PUNIT':
        case 'CAIXA':
        case 'NUMNOTA':
            return paraNumero(venda[coluna]);
        case 'VALOR':
            return valorVenda(venda);
        default:
            return (venda[coluna] ?? '').toString().toLowerCase();
    }
};

export default function ProdutosPorDescricao({ filiais }: Props) {
    const [vendas, setVendas] = useState<Venda[]>([]);
    const [ordenarPor, setOrdenarPor] = useState<ColunaOrdenacao>('VALOR');
    const [ordemAscendente, setOrdemAscendente] = useState(false);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(25);
    const [buscando, setBuscando] = useState(false);
    const [filtroExpandido, setFiltroExpandido] = useState(true);
    const [dataInicial, setDataInicial] = useState<Date>(new Date());
    const [dataFinal, setDataFinal] = useState<Date>(new Date());
    const [caixaFiltro, setCaixaFiltro] = useState('');
    const [valorFiltro, setValorFiltro] = useState('');
    const [produtosSelecionados, setProdutosSelecionados] = useState<Produto[]>(
        [],
    );
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [buscandoProdutos, setBuscandoProdutos] = useState(false);
    const [termoBusca, setTermoBusca] = useState('');
    const [tipoBusca, setTipoBusca] = useState<TipoBusca>('descricao');
    const [gramatura, setGramatura] = useState('');
    const [openCombobox, setOpenCombobox] = useState(false);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    const porGramatura = tipoBusca === 'gramatura';

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

    // Buscar produtos no autocomplete (não se aplica ao modo "gramatura", que não identifica um produto)
    useEffect(() => {
        if (porGramatura) {
            setProdutos([]);
            return;
        }

        const minCaracteres = tipoBusca === 'descricao' ? 3 : 1;

        if (data.filial && termoBusca.length >= minCaracteres) {
            const timer = setTimeout(async () => {
                setBuscandoProdutos(true);
                try {
                    const response = await axios.post(
                        pesquisarVendas.produtosPorDescricao.buscarProdutos.url(),
                        {
                            filial: data.filial,
                            tipoBusca,
                            termo: termoBusca,
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
    }, [termoBusca, data.filial, tipoBusca, porGramatura]);

    const adicionarProduto = (produto: Produto) => {
        if (
            !produtosSelecionados.find(
                (p) => p.CODAUXILIAR === produto.CODAUXILIAR,
            )
        ) {
            setProdutosSelecionados([...produtosSelecionados, produto]);
            setTermoBusca('');
            setOpenCombobox(false);
        }
    };

    const removerProduto = (codauxiliar: string) => {
        setProdutosSelecionados(
            produtosSelecionados.filter((p) => p.CODAUXILIAR !== codauxiliar),
        );
    };

    const trocarTipoBusca = (value: string) => {
        setTipoBusca(value as TipoBusca);
        setProdutosSelecionados([]);
        setTermoBusca('');
        setGramatura('');
    };

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

    const buscarVendas = async () => {
        if (!data.filial) {
            showAlert('Selecione a filial', 'warning');
            return;
        }

        if (!dataInicial || !dataFinal) {
            showAlert('Selecione o período da venda', 'warning');
            return;
        }

        if (porGramatura) {
            if (!gramatura) {
                showAlert('Selecione a gramatura', 'warning');
                return;
            }
        } else if (produtosSelecionados.length === 0) {
            showAlert('Selecione pelo menos um produto', 'warning');
            return;
        }

        setBuscando(true);

        try {
            const dataInicio = format(dataInicial, 'yyyy-MM-dd');
            const dataFim = format(dataFinal, 'yyyy-MM-dd');

            // Caixa e valor são opcionais — só entram na busca se preenchidos
            const filtrosOpcionais: Record<string, string> = {};
            if (caixaFiltro.trim()) filtrosOpcionais.caixa = caixaFiltro.trim();
            if (valorFiltro.trim()) filtrosOpcionais.valor = valorFiltro.trim();

            const response = porGramatura
                ? await axios.post(
                      pesquisarVendas.produtosPorGramatura.buscar.url(),
                      {
                          filial: data.filial,
                          gramatura,
                          dataInicio,
                          dataFim,
                          ...filtrosOpcionais,
                      },
                  )
                : await axios.post(
                      pesquisarVendas.produtosPorDescricao.buscar.url(),
                      {
                          filial: data.filial,
                          codauxiliares: produtosSelecionados.map(
                              (p) => p.CODAUXILIAR,
                          ),
                          dataInicio,
                          dataFim,
                          ...filtrosOpcionais,
                      },
                  );

            if (response.data.success) {
                setVendas(response.data.vendas);
                setPaginaAtual(1);
                setOrdenarPor('VALOR');
                setOrdemAscendente(false);
                if (response.data.vendas.length === 0) {
                    showAlert(
                        'Nenhuma venda encontrada com os filtros informados',
                        'warning',
                    );
                }
            } else {
                showAlert('Erro ao buscar vendas', 'error');
            }
        } catch (error: unknown) {
            console.error('Erro ao buscar vendas:', error);
            const message =
                error instanceof Error
                    ? error.message
                    : 'Erro ao buscar vendas. Tente novamente.';
            showAlert(message, 'error');
        } finally {
            setBuscando(false);
        }
    };

    const limparFiltros = () => {
        reset();
        setDataInicial(new Date());
        setDataFinal(new Date());
        setCaixaFiltro('');
        setValorFiltro('');
        setVendas([]);
        setPaginaAtual(1);
        setOrdenarPor('VALOR');
        setOrdemAscendente(false);
        setProdutosSelecionados([]);
        setTermoBusca('');
        setTipoBusca('descricao');
        setGramatura('');
    };

    const formatarValor = (valor: number | string | undefined) => {
        const numericValue =
            typeof valor === 'string' ? parseFloat(valor) : valor;
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

    // Ordena a lista inteira antes de paginar, senão cada página ordenaria
    // só os itens que já estavam nela.
    const vendasOrdenadas = useMemo(() => {
        const copia = [...vendas];
        copia.sort((a, b) => {
            const chaveA = chaveOrdenacao(a, ordenarPor);
            const chaveB = chaveOrdenacao(b, ordenarPor);
            const comparacao =
                typeof chaveA === 'number' && typeof chaveB === 'number'
                    ? chaveA - chaveB
                    : String(chaveA).localeCompare(String(chaveB), 'pt-BR');
            return ordemAscendente ? comparacao : -comparacao;
        });
        return copia;
    }, [vendas, ordenarPor, ordemAscendente]);

    // A busca por período pode trazer dezenas de milhares de vendas de uma
    // vez só — paginar client-side evita renderizar a lista inteira na
    // tabela, que travaria a página bem antes disso.
    const vendasPaginadas = useMemo(() => {
        const inicio = (paginaAtual - 1) * itensPorPagina;
        return vendasOrdenadas.slice(inicio, inicio + itensPorPagina);
    }, [vendasOrdenadas, paginaAtual, itensPorPagina]);

    const trocarItensPorPagina = (itens: number) => {
        setItensPorPagina(itens);
        setPaginaAtual(1);
    };

    // Clicar no mesmo título inverte a direção; clicar num título diferente
    // passa a ordenar por ele, começando crescente.
    const alternarOrdenacao = (coluna: ColunaOrdenacao) => {
        if (coluna === ordenarPor) {
            setOrdemAscendente((atual) => !atual);
        } else {
            setOrdenarPor(coluna);
            setOrdemAscendente(true);
        }
        setPaginaAtual(1);
    };

    const cabecalhoOrdenavel = (coluna: ColunaOrdenacao, label: string) => (
        <button
            type="button"
            onClick={() => alternarOrdenacao(coluna)}
            className="inline-flex items-center gap-1 transition-colors hover:text-foreground"
        >
            <span>{label}</span>
            {ordenarPor === coluna ? (
                ordemAscendente ? (
                    <ArrowUp className="size-3.5" />
                ) : (
                    <ArrowDown className="size-3.5" />
                )
            ) : (
                <ArrowUpDown className="size-3.5 text-muted-foreground/40" />
            )}
        </button>
    );

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
                    description="Busque vendas por produto, código ou peso (gramatura), numa filial e período."
                />

                <div className="mt-6 space-y-4">
                    {/* Card de Filtros */}
                    <div className="overflow-hidden rounded-lg border bg-card shadow-sm">
                        <button
                            onClick={() => setFiltroExpandido(!filtroExpandido)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-accent/50"
                        >
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold">
                                    Filtros
                                </h2>
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
                                    ? 'max-h-[32rem] opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="border-t px-4 pt-3 pb-4">
                                <div className="grid gap-3 md:grid-cols-3">
                                    <FilialCombobox
                                        filiais={filiais}
                                        value={data.filial}
                                        onChange={(value: string) =>
                                            setData('filial', value)
                                        }
                                        disabled={buscando}
                                    />

                                    <div className="space-y-2">
                                        <Label className="text-sm">
                                            Buscar por
                                        </Label>
                                        <Select
                                            value={tipoBusca}
                                            onValueChange={trocarTipoBusca}
                                            disabled={!data.filial || buscando}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Selecione o tipo" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.entries(
                                                    TIPO_BUSCA_LABEL,
                                                ).map(([value, label]) => (
                                                    <SelectItem
                                                        key={value}
                                                        value={value}
                                                    >
                                                        {label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {porGramatura ? (
                                        <GramaturaCombobox
                                            value={gramatura}
                                            onValueChange={setGramatura}
                                            disabled={!data.filial || buscando}
                                        />
                                    ) : (
                                        <div className="space-y-2">
                                            <Label className="text-sm">
                                                Produtos
                                            </Label>
                                            <Popover
                                                open={openCombobox}
                                                onOpenChange={setOpenCombobox}
                                            >
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
                                                            : `Buscar por ${TIPO_BUSCA_LABEL[tipoBusca].toLowerCase()}...`}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent
                                                    className="w-[400px] p-0"
                                                    align="start"
                                                >
                                                    <Command
                                                        shouldFilter={false}
                                                    >
                                                        <CommandInput
                                                            placeholder={
                                                                tipoBusca ===
                                                                'descricao'
                                                                    ? 'Digite a descrição do produto...'
                                                                    : tipoBusca ===
                                                                        'codauxiliar'
                                                                      ? 'Digite o código auxiliar...'
                                                                      : 'Digite o código do produto...'
                                                            }
                                                            value={termoBusca}
                                                            onValueChange={
                                                                setTermoBusca
                                                            }
                                                        />
                                                        <CommandList>
                                                            <CommandEmpty>
                                                                {buscandoProdutos
                                                                    ? 'Buscando...'
                                                                    : termoBusca.length <
                                                                        (tipoBusca ===
                                                                        'descricao'
                                                                            ? 3
                                                                            : 1)
                                                                      ? tipoBusca ===
                                                                        'descricao'
                                                                          ? 'Digite pelo menos 3 caracteres'
                                                                          : 'Digite pelo menos 1 caractere'
                                                                      : 'Nenhum produto encontrado'}
                                                            </CommandEmpty>
                                                            <CommandGroup>
                                                                {produtos.map(
                                                                    (
                                                                        produto,
                                                                    ) => (
                                                                        <CommandItem
                                                                            key={
                                                                                produto.CODAUXILIAR
                                                                            }
                                                                            value={
                                                                                produto.CODAUXILIAR
                                                                            }
                                                                            onSelect={() =>
                                                                                adicionarProduto(
                                                                                    produto,
                                                                                )
                                                                            }
                                                                        >
                                                                            <div className="flex flex-col">
                                                                                <span className="font-medium">
                                                                                    {
                                                                                        produto.DESCRICAO
                                                                                    }
                                                                                </span>
                                                                                <span className="text-xs text-muted-foreground">
                                                                                    Aux:{' '}
                                                                                    {
                                                                                        produto.CODAUXILIAR
                                                                                    }{' '}
                                                                                    |
                                                                                    Prod:{' '}
                                                                                    {
                                                                                        produto.CODPROD
                                                                                    }{' '}
                                                                                    |{' '}
                                                                                    {
                                                                                        produto.EMBALAGEM
                                                                                    }
                                                                                </span>
                                                                            </div>
                                                                        </CommandItem>
                                                                    ),
                                                                )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    )}
                                </div>

                                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
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
                                                    {format(
                                                        dataInicial,
                                                        'PPP',
                                                        {
                                                            locale: ptBR,
                                                        },
                                                    )}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent
                                                className="w-auto p-0"
                                                align="start"
                                            >
                                                <Calendar
                                                    mode="single"
                                                    selected={dataInicial}
                                                    onSelect={
                                                        escolherDataInicial
                                                    }
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

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="caixaFiltro"
                                            className="text-sm"
                                        >
                                            Número do Caixa{' '}
                                            <span className="text-muted-foreground">
                                                (opcional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="caixaFiltro"
                                            type="text"
                                            inputMode="numeric"
                                            value={caixaFiltro}
                                            onChange={(e) =>
                                                setCaixaFiltro(e.target.value)
                                            }
                                            placeholder="Ex: 101"
                                            disabled={buscando}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="valorFiltro"
                                            className="text-sm"
                                        >
                                            Valor (subtotal){' '}
                                            <span className="text-muted-foreground">
                                                (opcional)
                                            </span>
                                        </Label>
                                        <Input
                                            id="valorFiltro"
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            value={valorFiltro}
                                            onChange={(e) =>
                                                setValorFiltro(e.target.value)
                                            }
                                            placeholder="Ex: 12.90"
                                            disabled={buscando}
                                        />
                                    </div>
                                </div>

                                {porGramatura && (
                                    <p className="mt-3 text-xs text-muted-foreground">
                                        Traz qualquer produto vendido na filial
                                        e período escolhidos com peso igual ou
                                        menor que a gramatura selecionada — útil
                                        para localizar vendas com peso
                                        divergente.
                                    </p>
                                )}

                                {/* Produtos Selecionados */}
                                {!porGramatura &&
                                    produtosSelecionados.length > 0 && (
                                        <div className="mt-3 flex flex-wrap gap-2">
                                            {produtosSelecionados.map(
                                                (produto) => (
                                                    <div
                                                        key={
                                                            produto.CODAUXILIAR
                                                        }
                                                        className="flex items-center gap-1 rounded-md border bg-secondary px-2 py-1 text-sm"
                                                    >
                                                        <span className="max-w-[200px] truncate">
                                                            {
                                                                produto.CODAUXILIAR
                                                            }{' '}
                                                            -{' '}
                                                            {produto.DESCRICAO}
                                                        </span>
                                                        <button
                                                            onClick={() =>
                                                                removerProduto(
                                                                    produto.CODAUXILIAR,
                                                                )
                                                            }
                                                            className="rounded-sm hover:bg-muted"
                                                        >
                                                            <X className="size-3" />
                                                        </button>
                                                    </div>
                                                ),
                                            )}
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
                                    <Button
                                        onClick={buscarVendas}
                                        disabled={buscando}
                                    >
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
                                        <CardTitle>
                                            Resultados da Pesquisa
                                        </CardTitle>
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
                                                    {cabecalhoOrdenavel(
                                                        'CODAUXILIAR',
                                                        'Cód. Auxiliar',
                                                    )}
                                                </TableHead>
                                                <TableHead className="w-[100px]">
                                                    {cabecalhoOrdenavel(
                                                        'CODPROD',
                                                        'Cód. Produto',
                                                    )}
                                                </TableHead>
                                                <TableHead className="min-w-[250px]">
                                                    {cabecalhoOrdenavel(
                                                        'DESCRICAO',
                                                        'Descrição',
                                                    )}
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    {cabecalhoOrdenavel(
                                                        'QT',
                                                        'Quantidade',
                                                    )}
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    {cabecalhoOrdenavel(
                                                        'PUNIT',
                                                        'Preço Unit.',
                                                    )}
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    {cabecalhoOrdenavel(
                                                        'VALOR',
                                                        'Total',
                                                    )}
                                                </TableHead>
                                                <TableHead className="w-[100px]">
                                                    {cabecalhoOrdenavel(
                                                        'NUMNOTA',
                                                        'Nota',
                                                    )}
                                                </TableHead>
                                                <TableHead className="w-[80px] text-center">
                                                    {cabecalhoOrdenavel(
                                                        'CAIXA',
                                                        'Caixa',
                                                    )}
                                                </TableHead>
                                                <TableHead className="w-[80px] text-center">
                                                    {cabecalhoOrdenavel(
                                                        'HORA',
                                                        'Hora',
                                                    )}
                                                </TableHead>
                                                <TableHead className="min-w-[200px]">
                                                    {cabecalhoOrdenavel(
                                                        'NOME',
                                                        'Operador(a)',
                                                    )}
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vendasPaginadas.map((venda, index) => (
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
                                                            title={
                                                                venda.DESCRICAO
                                                            }
                                                        >
                                                            {venda.DESCRICAO}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium tabular-nums">
                                                        {formatarPeso(venda.QT)}
                                                    </TableCell>
                                                    <TableCell className="text-right tabular-nums">
                                                        {formatarValor(
                                                            venda.PUNIT,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold tabular-nums">
                                                        {formatarValor(
                                                            (typeof venda.QT ===
                                                            'string'
                                                                ? parseFloat(
                                                                      venda.QT,
                                                                  )
                                                                : venda.QT ||
                                                                  0) *
                                                                (typeof venda.PUNIT ===
                                                                'string'
                                                                    ? parseFloat(
                                                                          venda.PUNIT,
                                                                      )
                                                                    : venda.PUNIT ||
                                                                      0),
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {venda.QRCODENFCE ? (
                                                            <a
                                                                href={
                                                                    venda.QRCODENFCE
                                                                }
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
                            <CardFooter className="p-0">
                                <TablePagination
                                    paginaAtual={paginaAtual}
                                    totalItens={vendas.length}
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
                    {vendas.length === 0 && !buscando && (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-16">
                                <div className="mb-4 rounded-full bg-muted p-4">
                                    <Search className="size-8 text-muted-foreground" />
                                </div>
                                <CardTitle className="mb-2">
                                    Nenhuma venda encontrada
                                </CardTitle>
                                <CardDescription className="text-center">
                                    Selecione a filial, o critério de busca e o
                                    período nos filtros acima e clique em
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
