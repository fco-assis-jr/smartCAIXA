import { Head, useForm, usePage } from '@inertiajs/react';
import axios from 'axios';
import { format } from 'date-fns';
import {
    Calendar as CalendarIcon,
    CheckCircle2,
    PackageMinus,
    Receipt,
    ScanBarcode,
    Trash2,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import { TipoBaixaCombobox } from '@/components/tipo-baixa-combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { gerarPDFBaixaProduto } from '@/lib/gerar-pdf-baixa';
import { dashboard } from '@/routes';
import baixaProduto from '@/routes/baixa-produto';
import type { SharedData } from '@/types';

// Único tipo de baixa em que cada item pede uma data extra antes de entrar
// na lista — ver BaixaProdutoController::index() pra a lista completa de
// tipos (o value vem de lá, não é um rótulo livre).
const TIPO_VENCIMENTO = 'VENCIMENTO';

type Produto = {
    CODPROD: string;
    CODAUXILIAR: string;
    DESCRICAO: string;
    EMBALAGEM: string;
    UNIDADE: string;
    CODFILIAL: string;
    FORALINHA: string;
    PRECO: number;
    quantidade: number;
    /** Só preenchida em baixas de Vencimento — formato dd/MM/yyyy. */
    dataVencimento?: string;
};

type Props = {
    filiais: ComboboxOption[];
    tiposBaixa: ComboboxOption[];
};

type AlertState = {
    open: boolean;
    message: string;
    variant: 'default' | 'error' | 'warning' | 'success';
};

export default function BaixaProduto({ filiais, tiposBaixa }: Props) {
    const { auth } = usePage<SharedData>().props;
    const [produtos, setProdutos] = useState<Produto[]>([]);
    // Produto encontrado pela busca, aguardando confirmação de quantidade
    // (e data de vencimento, se for o caso) antes de entrar na lista.
    const [produtoPendente, setProdutoPendente] = useState<Produto | null>(
        null,
    );
    // Último item efetivamente confirmado — só pra mostrar o feedback
    // visual, já está na lista.
    const [ultimoAdicionado, setUltimoAdicionado] = useState<Produto | null>(
        null,
    );
    const [buscandoProduto, setBuscandoProduto] = useState(false);
    const [codAuxiliar, setCodAuxiliar] = useState('');
    const [quantidadeDigitada, setQuantidadeDigitada] = useState('1');
    const [dataDigitada, setDataDigitada] = useState('');
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    // Limpar alert ao montar o componente (previne alertas persistentes após reload)
    useEffect(() => {
        setAlert({ open: false, message: '', variant: 'default' });
    }, []);

    // Refs pra controlar foco entre código, quantidade e data de vencimento
    const codAuxiliarInputRef = useRef<HTMLInputElement>(null);
    const quantidadeInputRef = useRef<HTMLInputElement>(null);
    const dataVencimentoInputRef = useRef<HTMLInputElement>(null);

    const { data, setData } = useForm({
        codFilial: '',
        tipoBaixa: '',
        observacao: '',
    });

    // Função auxiliar para mostrar alertas - memoizada
    const showAlert = useCallback(
        (
            message: string,
            variant: 'default' | 'error' | 'warning' | 'success' = 'default',
        ) => {
            setAlert({ open: true, message, variant });
        },
        [],
    );

    const closeAlert = useCallback(() => {
        setAlert((prev) => ({ ...prev, open: false }));
    }, []);

    const contextoDefinido = Boolean(data.codFilial && data.tipoBaixa);
    const ehVencimento = data.tipoBaixa === TIPO_VENCIMENTO;

    // Produto encontrado, esperando confirmação de quantidade (e data de
    // vencimento, se for o caso) — enquanto isso não for resolvido
    // (confirmar ou cancelar), não deixa bipar o próximo.
    const temPendencia = Boolean(produtoPendente);

    // Foca a quantidade assim que a pendência aparece — igual em todos os
    // tipos de baixa, inclusive Vencimento (Tab leva pro campo de data
    // depois, na ordem em que aparecem na tela).
    useEffect(() => {
        if (!temPendencia) return;

        setTimeout(() => {
            quantidadeInputRef.current?.focus();
            quantidadeInputRef.current?.select();
        }, 100);
    }, [temPendencia]);

    // A filial e o tipo de baixa travam assim que o primeiro produto é adicionado —
    // uma baixa não pode misturar filiais ou tipos diferentes no mesmo relatório.
    const contextoTravado = produtos.length > 0;

    const filialLabel = filiais.find((f) => f.value === data.codFilial)?.label;
    const tipoBaixaLabel = tiposBaixa.find(
        (t) => t.value === data.tipoBaixa,
    )?.label;

    // Calcular total geral - memoizado
    const totalGeral = useMemo(() => {
        return produtos.reduce((sum, produto) => {
            return sum + Number(produto.PRECO || 0) * produto.quantidade;
        }, 0);
    }, [produtos]);

    // Escanear o mesmo produto de novo soma na linha existente, em vez de
    // duplicar — é assim que o operador espera ver a coleta agrupada
    // quando passa o mesmo código várias vezes. Em baixa de Vencimento, só
    // agrupa se a data de vencimento também for igual — o mesmo produto
    // com validades diferentes é lote diferente, não pode juntar.
    const chaveProduto = (produto: Produto) =>
        `${produto.CODAUXILIAR}::${produto.dataVencimento ?? ''}`;

    // Aceita vírgula ou ponto como separador decimal (produtos por peso
    // costumam ter quantidade fracionada, ex. 0.485 KG).
    const parseQuantidade = (texto: string): number | undefined => {
        const valor = parseFloat(texto.replace(',', '.').trim());
        return Number.isFinite(valor) && valor > 0 ? valor : undefined;
    };

    // Máscara dd/mm/aaaa enquanto digita — só dígitos contam, o resto (as
    // barras) é inserido automaticamente.
    const formatarDataDigitada = (valor: string) => {
        const digitos = valor.replace(/\D/g, '').slice(0, 8);
        if (digitos.length > 4) {
            return `${digitos.slice(0, 2)}/${digitos.slice(2, 4)}/${digitos.slice(4)}`;
        }
        if (digitos.length > 2) {
            return `${digitos.slice(0, 2)}/${digitos.slice(2)}`;
        }
        return digitos;
    };

    // Valida de verdade (dia/mês/ano existem no calendário) — new Date()
    // "rola" datas inválidas (31/02 vira 03/03) em vez de rejeitar, então
    // confere se os valores voltam iguais depois de montar a data.
    const parseDataDigitada = (texto: string): Date | undefined => {
        const match = texto.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (!match) return undefined;

        const dia = Number(match[1]);
        const mes = Number(match[2]);
        const ano = Number(match[3]);
        const data = new Date(ano, mes - 1, dia);

        const valida =
            data.getFullYear() === ano &&
            data.getMonth() === mes - 1 &&
            data.getDate() === dia;

        return valida ? data : undefined;
    };

    const adicionarOuSomarProduto = (produto: Produto) => {
        setProdutos((atual) => {
            const jaExiste = atual.some(
                (p) => chaveProduto(p) === chaveProduto(produto),
            );

            if (jaExiste) {
                return atual.map((p) =>
                    chaveProduto(p) === chaveProduto(produto)
                        ? {
                              ...p,
                              quantidade: p.quantidade + produto.quantidade,
                          }
                        : p,
                );
            }

            return [...atual, produto];
        });
    };

    const buscarProduto = async () => {
        // Evita duas buscas em paralelo pro mesmo escaneio (ex.: Enter e o
        // blur causado pelo campo desabilitando durante a busca) — sem
        // isso, cada bipada podia entrar na lista em dobro.
        if (buscandoProduto || temPendencia) return;

        if (!codAuxiliar.trim() || !data.codFilial) {
            if (!data.codFilial) {
                showAlert(
                    'Selecione uma filial antes de buscar o produto',
                    'warning',
                );
            }
            return;
        }

        setBuscandoProduto(true);
        try {
            const response = await axios.post<{ produto: Produto }>(
                baixaProduto.buscarPorCodigo.url(),
                {
                    codAuxiliar: codAuxiliar.trim(),
                    codFilial: data.codFilial,
                },
            );

            if (response.data.produto) {
                // Pausa pra confirmar quantidade (e data de vencimento, se
                // for o caso) — só entra na lista em confirmarAdicao().
                setProdutoPendente({
                    ...response.data.produto,
                    quantidade: 1,
                });
                setQuantidadeDigitada('1');
                setDataDigitada('');
                setCodAuxiliar('');
            }
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.response?.data?.error ||
                    'Produto não encontrado';
                showAlert(errorMessage, 'error');
            } else {
                showAlert('Erro ao buscar produto', 'error');
            }
        } finally {
            setBuscandoProduto(false);
        }
    };

    // Fecha o ciclo de uma bipada: quantidade (e data de vencimento, se for
    // o caso) confirmadas, agora sim entra na lista — soma na linha
    // existente se já tiver o mesmo produto (mesma data, em Vencimento).
    const confirmarAdicao = () => {
        if (!produtoPendente) return;

        const quantidade = parseQuantidade(quantidadeDigitada);
        if (!quantidade) {
            showAlert(
                'Quantidade inválida. Informe um valor maior que zero.',
                'warning',
            );
            return;
        }

        let dataVencimento: string | undefined;
        if (ehVencimento) {
            const dataEscolhida = parseDataDigitada(dataDigitada);
            if (!dataEscolhida) {
                showAlert(
                    'Data de vencimento inválida. Use o formato dd/mm/aaaa.',
                    'warning',
                );
                return;
            }
            dataVencimento = format(dataEscolhida, 'dd/MM/yyyy');
        }

        const produtoFinal: Produto = {
            ...produtoPendente,
            quantidade,
            dataVencimento,
        };

        adicionarOuSomarProduto(produtoFinal);
        setUltimoAdicionado(produtoFinal);
        setProdutoPendente(null);
        setQuantidadeDigitada('1');
        setDataDigitada('');

        setTimeout(() => {
            codAuxiliarInputRef.current?.focus();
        }, 100);
    };

    // Descarta a bipada pendente sem adicionar — ex.: escaneou o código
    // errado e quer tentar de novo.
    const cancelarPendente = () => {
        setProdutoPendente(null);
        setQuantidadeDigitada('1');
        setDataDigitada('');
        setTimeout(() => {
            codAuxiliarInputRef.current?.focus();
        }, 100);
    };

    const removerProduto = (index: number) => {
        setProdutos(produtos.filter((_, i) => i !== index));
    };

    const limparLista = () => {
        setProdutos([]);
        setProdutoPendente(null);
        setUltimoAdicionado(null);
    };

    const finalizarBaixa = async () => {
        if (produtos.length === 0) {
            showAlert(
                'Adicione pelo menos um produto antes de finalizar',
                'warning',
            );
            return;
        }

        if (!data.codFilial || !data.tipoBaixa) {
            showAlert('Selecione a filial e o tipo de baixa', 'warning');
            return;
        }

        try {
            const nomeFilial = filialLabel || `Filial ${data.codFilial}`;
            const nomeTipoBaixa = tipoBaixaLabel || data.tipoBaixa;

            // Gerar PDF
            await gerarPDFBaixaProduto({
                nomeFilial,
                tipoBaixa: nomeTipoBaixa,
                produtos,
                observacao: data.observacao,
                totalGeral,
                operador: auth.user.name,
            });

            // Limpar após gerar PDF
            //limparLista();
            //showAlert('Relatório gerado com sucesso!', 'success');
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showAlert('Erro ao gerar relatório. Tente novamente.', 'error');
        }
    };

    return (
        <>
            <Head title="Baixa Produto" />

            <div className="px-4 py-6">
                <Heading
                    title="Baixa Produto"
                    description="Escaneie ou digite o código dos produtos para registrar a baixa"
                />

                <div className="mt-6 space-y-4">
                    {/* Contexto da baixa: filial, tipo e observação */}
                    {contextoTravado ? (
                        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-card px-4 py-3 shadow-sm">
                            <p className="text-sm">
                                <span className="font-semibold">
                                    {filialLabel}
                                </span>
                                <span className="text-muted-foreground">
                                    {' '}
                                    ·{' '}
                                </span>
                                <span className="font-semibold">
                                    {tipoBaixaLabel}
                                </span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Esvazie a lista abaixo para trocar a filial ou o
                                tipo de baixa
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="grid gap-3 md:grid-cols-2">
                                <FilialCombobox
                                    filiais={filiais}
                                    value={data.codFilial}
                                    onChange={(value) =>
                                        setData('codFilial', value)
                                    }
                                />
                                <TipoBaixaCombobox
                                    tipos={tiposBaixa}
                                    value={data.tipoBaixa}
                                    onChange={(value) =>
                                        setData('tipoBaixa', value)
                                    }
                                />
                            </div>

                            <div className="mt-3">
                                <Label htmlFor="observacao" className="text-sm">
                                    Observação Geral
                                </Label>
                                <Input
                                    id="observacao"
                                    type="text"
                                    value={data.observacao}
                                    onChange={(e) =>
                                        setData('observacao', e.target.value)
                                    }
                                    placeholder="Observação da baixa"
                                    className="mt-1.5"
                                />
                            </div>
                        </div>
                    )}

                    {/* Escanear / adicionar produto */}
                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="border-b bg-muted/30 px-4 py-3">
                            <h2 className="text-sm font-semibold">
                                Adicionar Produto
                            </h2>
                        </div>
                        <div className="space-y-3 p-4">
                            <div>
                                <Label
                                    htmlFor="codAuxiliar"
                                    className="text-xs text-muted-foreground"
                                >
                                    Código do Produto
                                </Label>
                                <InputGroup className="mt-1.5">
                                    <InputGroupAddon>
                                        <ScanBarcode className="size-4" />
                                    </InputGroupAddon>
                                    <InputGroupInput
                                        ref={codAuxiliarInputRef}
                                        id="codAuxiliar"
                                        type="text"
                                        value={codAuxiliar}
                                        onChange={(e) =>
                                            setCodAuxiliar(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                buscarProduto();
                                            }
                                        }}
                                        placeholder={
                                            contextoDefinido
                                                ? 'Escaneie ou digite o código...'
                                                : 'Selecione a filial e o tipo de baixa primeiro'
                                        }
                                        disabled={
                                            buscandoProduto ||
                                            !contextoDefinido ||
                                            temPendencia
                                        }
                                        className="font-mono"
                                        autoFocus
                                    />
                                </InputGroup>
                                {temPendencia && (
                                    <p className="mt-1.5 text-xs text-warning">
                                        Confirme a quantidade
                                        {ehVencimento &&
                                            ' e a data de vencimento'}{' '}
                                        abaixo antes de bipar o próximo produto.
                                    </p>
                                )}
                            </div>

                            {/* Produto encontrado: confirma quantidade (e
                            data de vencimento, se for o caso) antes de
                            entrar na lista */}
                            {produtoPendente && (
                                <div className="flex animate-in flex-col gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 duration-300 fade-in slide-in-from-top-2">
                                    <div className="flex items-center gap-3">
                                        <div className="min-w-0 flex-1">
                                            <h3 className="truncate text-sm font-semibold">
                                                {produtoPendente.DESCRICAO}
                                            </h3>
                                            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                                <span className="font-mono">
                                                    Cód:{' '}
                                                    {produtoPendente.CODPROD}
                                                </span>
                                                <span>•</span>
                                                <span>
                                                    {produtoPendente.EMBALAGEM}{' '}
                                                    / {produtoPendente.UNIDADE}
                                                </span>
                                            </div>
                                        </div>
                                        <span className="shrink-0 font-mono text-lg font-bold text-warning tabular-nums">
                                            R${' '}
                                            {Number(
                                                produtoPendente.PRECO || 0,
                                            ).toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-end gap-2">
                                        <div className="space-y-1">
                                            <Label
                                                htmlFor="quantidadePendente"
                                                className="text-xs text-muted-foreground"
                                            >
                                                Quantidade
                                            </Label>
                                            <Input
                                                ref={quantidadeInputRef}
                                                id="quantidadePendente"
                                                type="text"
                                                inputMode="decimal"
                                                value={quantidadeDigitada}
                                                onChange={(e) =>
                                                    setQuantidadeDigitada(
                                                        e.target.value,
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        confirmarAdicao();
                                                    }
                                                }}
                                                className="w-24 font-mono"
                                            />
                                        </div>

                                        {ehVencimento && (
                                            <div className="space-y-1">
                                                <Label
                                                    htmlFor="dataVencimentoPendente"
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    Vencimento
                                                </Label>
                                                <InputGroup className="w-36">
                                                    <InputGroupAddon>
                                                        <CalendarIcon className="size-4" />
                                                    </InputGroupAddon>
                                                    <InputGroupInput
                                                        ref={
                                                            dataVencimentoInputRef
                                                        }
                                                        id="dataVencimentoPendente"
                                                        value={dataDigitada}
                                                        onChange={(e) =>
                                                            setDataDigitada(
                                                                formatarDataDigitada(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        onKeyDown={(e) => {
                                                            if (
                                                                e.key ===
                                                                'Enter'
                                                            ) {
                                                                confirmarAdicao();
                                                            }
                                                        }}
                                                        inputMode="numeric"
                                                        placeholder="dd/mm/aaaa"
                                                        className="font-mono"
                                                    />
                                                </InputGroup>
                                            </div>
                                        )}

                                        <Button onClick={confirmarAdicao}>
                                            Confirmar
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            onClick={cancelarPendente}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Confirmação do último produto adicionado —
                            só informativo, já está na lista */}
                            {!produtoPendente && ultimoAdicionado && (
                                <div className="flex animate-in items-center gap-3 rounded-lg border border-success/30 bg-success/10 p-3 duration-300 fade-in slide-in-from-top-2">
                                    <CheckCircle2 className="size-5 shrink-0 text-success" />
                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate text-sm font-semibold">
                                            {ultimoAdicionado.DESCRICAO}
                                        </h3>
                                        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                                            <span className="font-mono">
                                                Cód: {ultimoAdicionado.CODPROD}
                                            </span>
                                            <span>•</span>
                                            <span>
                                                Qtd:{' '}
                                                {ultimoAdicionado.quantidade}{' '}
                                                {ultimoAdicionado.UNIDADE}
                                            </span>
                                            {ultimoAdicionado.dataVencimento && (
                                                <>
                                                    <span>•</span>
                                                    <span>
                                                        Vence em{' '}
                                                        {
                                                            ultimoAdicionado.dataVencimento
                                                        }
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <span className="shrink-0 font-mono text-lg font-bold text-success tabular-nums">
                                        R${' '}
                                        {(
                                            Number(
                                                ultimoAdicionado.PRECO || 0,
                                            ) * ultimoAdicionado.quantidade
                                        ).toFixed(2)}
                                    </span>
                                </div>
                            )}

                            {buscandoProduto && (
                                <div className="flex items-center justify-center gap-2 py-4 text-sm text-muted-foreground">
                                    <Spinner />
                                    Buscando produto...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    {produtos.length > 0 && (
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="flex items-center justify-between gap-3 border-b bg-muted/30 px-4 py-3">
                                <h2 className="text-sm font-semibold">
                                    Produtos Adicionados ({produtos.length})
                                </h2>
                                <div className="text-sm text-muted-foreground">
                                    Total:{' '}
                                    <span
                                        key={totalGeral}
                                        className="inline-block animate-in font-mono text-lg font-bold text-foreground tabular-nums duration-200 zoom-in-95"
                                    >
                                        R$ {totalGeral.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-xs">
                                            <th className="p-3 text-left font-semibold">
                                                Código
                                            </th>
                                            <th className="p-3 text-left font-semibold">
                                                Descrição
                                            </th>
                                            <th className="p-3 text-right font-semibold">
                                                Preço
                                            </th>
                                            <th className="p-3 text-right font-semibold">
                                                Qtd
                                            </th>
                                            {ehVencimento && (
                                                <th className="p-3 text-center font-semibold">
                                                    Vencimento
                                                </th>
                                            )}
                                            <th className="p-3 text-right font-semibold">
                                                Subtotal
                                            </th>
                                            <th className="p-3 text-center font-semibold">
                                                Ações
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {produtos.map((produto, index) => {
                                            const preco = Number(
                                                produto.PRECO || 0,
                                            );
                                            const subtotal =
                                                preco * produto.quantidade;
                                            return (
                                                <tr
                                                    key={index}
                                                    className="transition-colors hover:bg-muted/30"
                                                >
                                                    <td className="p-3 font-mono font-medium whitespace-nowrap">
                                                        {produto.CODAUXILIAR}
                                                    </td>
                                                    <td className="p-3">
                                                        <div className="max-w-xs truncate font-medium">
                                                            {produto.DESCRICAO}
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                            {produto.EMBALAGEM}{' '}
                                                            / {produto.UNIDADE}
                                                        </div>
                                                    </td>
                                                    <td className="p-3 text-right font-medium tabular-nums">
                                                        R$ {preco.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <span className="rounded bg-muted px-2 py-1 text-sm font-medium tabular-nums">
                                                            {produto.quantidade}
                                                        </span>
                                                    </td>
                                                    {ehVencimento && (
                                                        <td className="p-3 text-center font-mono text-xs whitespace-nowrap">
                                                            {produto.dataVencimento ||
                                                                '—'}
                                                        </td>
                                                    )}
                                                    <td className="p-3 text-right font-bold text-primary tabular-nums">
                                                        R$ {subtotal.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                removerProduto(
                                                                    index,
                                                                )
                                                            }
                                                            className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                                                            title="Excluir produto"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                    <tfoot className="border-t-2 bg-muted/30">
                                        <tr>
                                            <td
                                                colSpan={ehVencimento ? 5 : 4}
                                                className="p-3 text-right font-semibold"
                                            >
                                                Total Geral:
                                            </td>
                                            <td className="p-3 text-right text-xl font-bold text-primary tabular-nums">
                                                R$ {totalGeral.toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="flex justify-end gap-3 border-t bg-muted/20 px-4 py-3">
                                <Button
                                    variant="outline"
                                    onClick={limparLista}
                                    size="lg"
                                >
                                    Limpar Lista
                                </Button>
                                <Button
                                    size="lg"
                                    onClick={finalizarBaixa}
                                    className="min-w-40"
                                >
                                    <Receipt className="size-4" />
                                    Finalizar Baixa
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Estado vazio */}
                    {produtos.length === 0 && contextoDefinido && (
                        <div className="rounded-lg border-2 border-dashed bg-card p-8 text-center">
                            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                                <PackageMinus className="size-5 text-muted-foreground" />
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Nenhum produto adicionado ainda
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground">
                                Escaneie ou digite o código do produto no campo
                                acima para começar
                            </div>
                        </div>
                    )}
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

BaixaProduto.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: dashboard.url() },
            { title: 'Baixa Produto', href: baixaProduto.index.url() },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
