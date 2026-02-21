import { Head, useForm } from '@inertiajs/react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { CustomAlert } from '@/components/custom-alert';
import { FilialCombobox } from '@/components/filial-combobox';
import { type ComboboxOption } from '@/components/generic-combobox';
import Heading from '@/components/heading';
import { TipoBaixaCombobox } from '@/components/tipo-baixa-combobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';
import { gerarPDFBaixaProduto } from '@/lib/gerar-pdf-baixa';
import { dashboard } from '@/routes';
import baixaProduto from '@/routes/baixa-produto';

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
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoEncontrado, setProdutoEncontrado] = useState<Produto | null>(null);
    const [buscandoProduto, setBuscandoProduto] = useState(false);
    const [codAuxiliar, setCodAuxiliar] = useState('');
    const [quantidade, setQuantidade] = useState(1);
    const [filtroExpandido, setFiltroExpandido] = useState(true);
    const [alert, setAlert] = useState<AlertState>({
        open: false,
        message: '',
        variant: 'default',
    });

    // Limpar alert ao montar o componente (previne alertas persistentes após reload)
    useEffect(() => {
        setAlert({ open: false, message: '', variant: 'default' });
    }, []);

    // Refs para controlar foco
    const codAuxiliarInputRef = useRef<HTMLInputElement>(null);
    const quantidadeInputRef = useRef<HTMLInputElement>(null);

    const { data, setData } = useForm({
        codFilial: '',
        tipoBaixa: '',
        observacao: '',
    });

    // Função auxiliar para mostrar alertas - memoizada
    const showAlert = useCallback((message: string, variant: 'default' | 'error' | 'warning' | 'success' = 'default') => {
        setAlert({ open: true, message, variant });
    }, []);

    const closeAlert = useCallback(() => {
        setAlert(prev => ({ ...prev, open: false }));
    }, []);

    // Recolher filtro automaticamente quando ambos estiverem preenchidos
    const filtroCompleto = data.codFilial && data.tipoBaixa;

    // Calcular total geral - memoizado
    const totalGeral = useMemo(() => {
        return produtos.reduce((sum, produto) => {
            return sum + (Number(produto.PRECO || 0) * produto.quantidade);
        }, 0);
    }, [produtos]);

    // Focar no input de quantidade quando produto for encontrado
    useEffect(() => {
        if (produtoEncontrado) {
            setTimeout(() => {
                quantidadeInputRef.current?.focus();
                quantidadeInputRef.current?.select();
            }, 100);
        }
    }, [produtoEncontrado]);

    const buscarProduto = async () => {
        if (!codAuxiliar.trim() || !data.codFilial) {
            if (!data.codFilial) {
                showAlert('Selecione uma filial antes de buscar o produto', 'warning');
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
                }
            );

            if (response.data.produto) {
                setProdutoEncontrado({
                    ...response.data.produto,
                    quantidade: 1,
                });
                setQuantidade(1);
            }
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            if (axios.isAxiosError(error)) {
                const errorMessage = error.response?.data?.message ||
                                   error.response?.data?.error ||
                                   'Produto não encontrado';
                showAlert(errorMessage, 'error');
            } else {
                showAlert('Erro ao buscar produto', 'error');
            }
            setProdutoEncontrado(null);
        } finally {
            setBuscandoProduto(false);
        }
    };

    const adicionarProduto = () => {
        if (!produtoEncontrado || quantidade <= 0) return;

        const novoProduto = {
            ...produtoEncontrado,
            quantidade: quantidade,
        };

        setProdutos([...produtos, novoProduto]);
        setProdutoEncontrado(null);
        setCodAuxiliar('');
        setQuantidade(1);

        // Encolher o filtro após adicionar o primeiro produto
        if (produtos.length === 0) {
            setFiltroExpandido(false);
        }

        // Focar no input de código auxiliar para próximo produto
        setTimeout(() => {
            codAuxiliarInputRef.current?.focus();
        }, 100);
    };

    const removerProduto = (index: number) => {
        const novaLista = produtos.filter((_, i) => i !== index);
        setProdutos(novaLista);

        // Reabrir filtro se a lista ficar vazia
        if (novaLista.length === 0) {
            setFiltroExpandido(true);
        }
    };

    const limparLista = () => {
        setProdutos([]);
        setFiltroExpandido(true);
    };

    const finalizarBaixa = async () => {
        if (produtos.length === 0) {
            showAlert('Adicione pelo menos um produto antes de finalizar', 'warning');
            return;
        }

        if (!data.codFilial || !data.tipoBaixa) {
            showAlert('Selecione a filial e o tipo de baixa', 'warning');
            return;
        }

        try {
            // Buscar nome da filial
            const filialSelecionada = filiais.find(f => f.value === data.codFilial);
            const nomeFilial = filialSelecionada?.label || `Filial ${data.codFilial}`;

            // Buscar nome do tipo de baixa
            const tipoBaixaSelecionada = tiposBaixa.find(t => t.value === data.tipoBaixa);
            const nomeTipoBaixa = tipoBaixaSelecionada?.label || data.tipoBaixa;

            // Gerar PDF
            await gerarPDFBaixaProduto({
                nomeFilial,
                tipoBaixa: nomeTipoBaixa,
                produtos,
                observacao: data.observacao,
                totalGeral,
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
                    description="Registre e gerencie as baixas de produtos"
                />

                <div className="mt-6 space-y-4">
                    {/* Filtros - Compacto */}
                    <div className="rounded-lg border bg-card overflow-hidden shadow-sm">
                        <button
                            onClick={() => setFiltroExpandido(!filtroExpandido)}
                            className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                        >
                            <div className="flex-1">
                                <h2 className="text-sm font-semibold">Filtros</h2>
                                {filtroCompleto && !filtroExpandido && (
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Filial: {data.codFilial} | Tipo: {tiposBaixa.find(t => t.value === data.tipoBaixa)?.label}
                                    </p>
                                )}
                            </div>
                            <span className="text-muted-foreground transition-transform duration-300 text-sm" style={{ transform: filtroExpandido ? 'rotate(0deg)' : 'rotate(-90deg)' }}>
                                ▼
                            </span>
                        </button>

                        <div
                            className={`transition-all duration-300 ease-in-out ${
                                filtroExpandido
                                    ? 'max-h-96 opacity-100'
                                    : 'max-h-0 opacity-0'
                            }`}
                        >
                            <div className="px-4 pb-4 pt-3 border-t">
                                <div className="grid gap-3 md:grid-cols-2">
                                    <FilialCombobox
                                        filiais={filiais}
                                        value={data.codFilial}
                                        onChange={(value) => setData('codFilial', value)}
                                        disabled={produtos.length > 0}
                                    />
                                    <TipoBaixaCombobox
                                        tipos={tiposBaixa}
                                        value={data.tipoBaixa}
                                        onChange={(value) => setData('tipoBaixa', value)}
                                        disabled={produtos.length > 0}
                                    />
                                </div>

                                <div className="mt-3">
                                    <Label htmlFor="observacao" className="text-sm">Observação Geral</Label>
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
                        </div>
                    </div>

                    {/* Adicionar Produto - Interface Otimizada */}
                    <div className="rounded-lg border bg-card shadow-sm">
                        <div className="px-4 py-3 border-b bg-muted/30">
                            <h2 className="text-sm font-semibold">
                                Adicionar Produto
                            </h2>
                        </div>
                        <div className="p-4 space-y-3">
                            {/* Input de Busca */}
                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <Label htmlFor="codAuxiliar" className="text-xs text-muted-foreground">
                                        Código do Produto
                                    </Label>
                                    <Input
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
                                        onBlur={buscarProduto}
                                        placeholder="Digite o código"
                                        disabled={buscandoProduto || !data.codFilial}
                                        className="mt-1"
                                    />
                                </div>
                            </div>

                            {/* Preview do Produto Encontrado */}
                            {produtoEncontrado && (
                                <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-baseline gap-2">
                                                <h3 className="font-semibold text-sm truncate">
                                                    {produtoEncontrado.DESCRICAO}
                                                </h3>
                                                <span className="text-xs text-muted-foreground shrink-0">
                                                    Cód: {produtoEncontrado.CODPROD}
                                                </span>
                                                <span className="text-xs text-muted-foreground shrink-0">•</span>
                                                <span className="text-xs text-muted-foreground shrink-0">
                                                    {produtoEncontrado.EMBALAGEM} / {produtoEncontrado.UNIDADE}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <span className="font-bold text-lg text-primary">
                                                R$ {Number(produtoEncontrado.PRECO || 0).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="shrink-0 w-24">
                                            <Input
                                                ref={quantidadeInputRef}
                                                id="quantidade"
                                                type="number"
                                                value={quantidade}
                                                onChange={(e) =>
                                                    setQuantidade(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        adicionarProduto();
                                                    }
                                                }}
                                                min="1"
                                                placeholder="Qtd"
                                                className="h-9"
                                            />
                                        </div>
                                        <Button
                                            onClick={adicionarProduto}
                                            disabled={quantidade <= 0}
                                            size="default"
                                            className="shrink-0"
                                        >
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {buscandoProduto && (
                                <div className="text-center py-4 text-sm text-muted-foreground">
                                    Buscando produto...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Lista de Produtos */}
                    {produtos.length > 0 && (
                        <div className="rounded-lg border bg-card shadow-sm">
                            <div className="px-4 py-3 border-b flex items-center justify-between bg-muted/30">
                                <h2 className="text-sm font-semibold">
                                    Produtos Adicionados ({produtos.length})
                                </h2>
                                <div className="text-sm text-muted-foreground">
                                    Total: <span className="font-bold text-lg text-foreground">R$ {totalGeral.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b bg-muted/50">
                                        <tr className="text-xs">
                                            <th className="p-3 text-left font-semibold">
                                                Cód. Aux
                                            </th>
                                            <th className="p-3 text-left font-semibold">
                                                Cód. Prod
                                            </th>
                                            <th className="p-3 text-left font-semibold">
                                                Descrição
                                            </th>
                                            <th className="p-3 text-left font-semibold">
                                                Emb
                                            </th>
                                            <th className="p-3 text-left font-semibold">
                                                Uni
                                            </th>
                                            <th className="p-3 text-right font-semibold">
                                                Preço
                                            </th>
                                            <th className="p-3 text-right font-semibold">
                                                Qtd
                                            </th>
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
                                            const preco = Number(produto.PRECO || 0);
                                            const subtotal = preco * produto.quantidade;
                                            return (
                                                <tr
                                                    key={index}
                                                    className="hover:bg-muted/30 transition-colors"
                                                >
                                                    <td className="p-3 font-medium">
                                                        {produto.CODAUXILIAR}
                                                    </td>
                                                    <td className="p-3">
                                                        {produto.CODPROD}
                                                    </td>
                                                    <td className="p-3 max-w-xs">
                                                        <div className="font-medium truncate">{produto.DESCRICAO}</div>
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {produto.EMBALAGEM}
                                                    </td>
                                                    <td className="p-3 text-muted-foreground">
                                                        {produto.UNIDADE}
                                                    </td>
                                                    <td className="p-3 text-right font-medium">
                                                        R$ {preco.toFixed(2)}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <span className="px-2 py-1 bg-muted rounded text-sm font-medium">{produto.quantidade}</span>
                                                    </td>
                                                    <td className="p-3 text-right font-bold text-primary">
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
                                            <td colSpan={7} className="p-3 text-right font-semibold">
                                                Total Geral:
                                            </td>
                                            <td className="p-3 text-right font-bold text-xl text-primary">
                                                R$ {totalGeral.toFixed(2)}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="px-4 py-3 border-t flex justify-end gap-3 bg-muted/20">
                                <Button
                                    variant="outline"
                                    onClick={limparLista}
                                    size="lg"
                                >
                                    Limpar Lista
                                </Button>
                                <Button size="lg" onClick={finalizarBaixa} className="min-w-40">
                                    Finalizar Baixa
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Estado vazio - Melhorado */}
                    {produtos.length === 0 && filtroCompleto && (
                        <div className="rounded-lg border-2 border-dashed bg-card p-8 text-center">
                            <div className="text-sm text-muted-foreground">
                                ℹ️ Nenhum produto adicionado ainda
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                                Digite o código do produto no campo acima para começar
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
