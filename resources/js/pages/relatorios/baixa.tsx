import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FilialCombobox } from '@/components/filial-combobox';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppSidebarLayout from '@/layouts/app/app-sidebar-layout';

type Filial = {
    value: string;
    label: string;
};

type TipoBaixa = {
    value: string;
    label: string;
};

type Produto = {
    CODPROD: number;
    CODAUXILIAR: string;
    DESCRICAO: string;
    EMBALAGEM: string;
    UNIDADE: string;
    CODFILIAL: string;
    quantidade?: number;
    preco?: number;
    observacao?: string;
};

type Props = {
    filiais: Filial[];
    tiposBaixa: TipoBaixa[];
};

export default function RelatorioBaixa({ filiais, tiposBaixa }: Props) {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoAtual, setProdutoAtual] = useState<Produto | null>(null);
    const [buscandoProduto, setBuscandoProduto] = useState(false);

    const { data, setData } = useForm({
        codFilial: '',
        tipoBaixa: '',
        data: '',
        codAuxiliar: '',
        observacao: '',
    });

    const buscarProduto = async () => {
        if (!data.codAuxiliar || !data.codFilial) {
            alert('Por favor, selecione a filial antes de buscar produtos');
            return;
        }

        setBuscandoProduto(true);
        try {
            const response = await fetch(
                '/baixa-produto/buscar-por-codigo',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        codAuxiliar: data.codAuxiliar,
                        codFilial: data.codFilial,
                    }),
                },
            );

            if (response.ok) {
                const result = await response.json();
                setProdutoAtual({
                    ...result.produto,
                    quantidade: 1,
                    preco: result.produto.PRECO || 0,
                    observacao: data.observacao,
                });
            } else {
                const error = await response.json();
                console.error('Erro ao buscar produto:', error);
                alert(error.message || 'Produto não encontrado');
                setProdutoAtual(null);
            }
        } catch (error) {
            console.error('Erro ao buscar produto:', error);
            alert('Erro ao buscar produto. Verifique o console para mais detalhes.');
        } finally {
            setBuscandoProduto(false);
        }
    };

    const adicionarProduto = () => {
        if (!produtoAtual) return;

        setProdutos([...produtos, produtoAtual]);
        setProdutoAtual(null);
        setData('codAuxiliar', '');
    };

    const removerProduto = (index: number) => {
        setProdutos(produtos.filter((_, i) => i !== index));
    };

    const calcularTotal = () => {
        return produtos
            .reduce(
                (total, p) =>
                    total + (p.quantidade || 0) * (p.preco || 0),
                0,
            )
            .toFixed(2);
    };

    return (
        <>
            <Head title="Baixa Produto" />

            <div className="px-4 py-6">
                <Heading
                    title="Baixa Produto"
                    description="Registre e gerencie as baixas de produtos"
                />

                <div className="mt-8 space-y-6">
                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">Filtros</h2>
                        <div className="grid gap-4 md:grid-cols-3">
                            <FilialCombobox
                                filiais={filiais}
                                value={data.codFilial}
                                onChange={(value) => setData('codFilial', value)}
                            />
                            <div>
                                <Label htmlFor="tipoBaixa">
                                    Tipo de Baixa
                                </Label>
                                <select
                                    id="tipoBaixa"
                                    value={data.tipoBaixa}
                                    onChange={(e) =>
                                        setData('tipoBaixa', e.target.value)
                                    }
                                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                                >
                                    <option value="">Selecione...</option>
                                    {tiposBaixa.map((tipo) => (
                                        <option
                                            key={tipo.value}
                                            value={tipo.value}
                                        >
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="data">Data</Label>
                                <Input
                                    id="data"
                                    type="date"
                                    value={data.data}
                                    onChange={(e) =>
                                        setData('data', e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="observacao">
                                Observação Geral
                            </Label>
                            <Input
                                id="observacao"
                                type="text"
                                value={data.observacao}
                                onChange={(e) =>
                                    setData('observacao', e.target.value)
                                }
                                placeholder="Observação do relatório"
                            />
                        </div>
                    </div>

                    <div className="rounded-lg border bg-card p-6">
                        <h2 className="mb-4 text-lg font-semibold">
                            Adicionar Produto
                        </h2>
                        <div className="grid gap-4 md:grid-cols-4">
                            <div className="md:col-span-2">
                                <Label htmlFor="codAuxiliar">
                                    Código Auxiliar
                                </Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="codAuxiliar"
                                        type="text"
                                        value={data.codAuxiliar}
                                        onChange={(e) =>
                                            setData(
                                                'codAuxiliar',
                                                e.target.value,
                                            )
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                buscarProduto();
                                            }
                                        }}
                                        placeholder="Digite o código e pressione Enter"
                                        disabled={buscandoProduto}
                                    />
                                    <Button
                                        onClick={buscarProduto}
                                        disabled={
                                            buscandoProduto ||
                                            !data.codAuxiliar
                                        }
                                    >
                                        Buscar
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {produtoAtual && (
                            <div className="mt-4 rounded-md border bg-muted p-4">
                                <div className="grid gap-4 md:grid-cols-5">
                                    <div className="md:col-span-2">
                                        <Label>Descrição</Label>
                                        <div className="text-sm font-medium">
                                            {produtoAtual.DESCRICAO}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            Cód: {produtoAtual.CODPROD} | EMB:{' '}
                                            {produtoAtual.EMBALAGEM}
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="quantidade">QT</Label>
                                        <Input
                                            id="quantidade"
                                            type="number"
                                            value={produtoAtual.quantidade || 1}
                                            onChange={(e) =>
                                                setProdutoAtual({
                                                    ...produtoAtual,
                                                    quantidade: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            min="1"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="preco">Preço</Label>
                                        <Input
                                            id="preco"
                                            type="number"
                                            step="0.01"
                                            value={produtoAtual.preco || 0}
                                            onChange={(e) =>
                                                setProdutoAtual({
                                                    ...produtoAtual,
                                                    preco: Number(
                                                        e.target.value,
                                                    ),
                                                })
                                            }
                                            min="0"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            onClick={adicionarProduto}
                                            className="w-full"
                                        >
                                            Adicionar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {produtos.length > 0 && (
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Produtos
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="border-b">
                                        <tr>
                                            <th className="p-2 text-left">
                                                Código
                                            </th>
                                            <th className="p-2 text-left">
                                                Cód. Produto
                                            </th>
                                            <th className="p-2 text-left">
                                                Descrição
                                            </th>
                                            <th className="p-2 text-left">
                                                EMB
                                            </th>
                                            <th className="p-2 text-right">
                                                QT
                                            </th>
                                            <th className="p-2 text-right">
                                                Preço
                                            </th>
                                            <th className="p-2 text-right">
                                                Total
                                            </th>
                                            <th className="p-2"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {produtos.map((produto, index) => (
                                            <tr
                                                key={index}
                                                className="border-b"
                                            >
                                                <td className="p-2">
                                                    {produto.CODAUXILIAR}
                                                </td>
                                                <td className="p-2">
                                                    {produto.CODPROD}
                                                </td>
                                                <td className="p-2">
                                                    {produto.DESCRICAO}
                                                </td>
                                                <td className="p-2">
                                                    {produto.EMBALAGEM}
                                                </td>
                                                <td className="p-2 text-right">
                                                    {produto.quantidade}
                                                </td>
                                                <td className="p-2 text-right">
                                                    {produto.preco?.toFixed(2)}
                                                </td>
                                                <td className="p-2 text-right">
                                                    {(
                                                        (produto.quantidade ||
                                                            0) *
                                                        (produto.preco || 0)
                                                    ).toFixed(2)}
                                                </td>
                                                <td className="p-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() =>
                                                            removerProduto(
                                                                index,
                                                            )
                                                        }
                                                    >
                                                        Excluir
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="border-t font-semibold">
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="p-2 text-right"
                                            >
                                                Total Geral:
                                            </td>
                                            <td className="p-2 text-right">
                                                {calcularTotal()}
                                            </td>
                                            <td></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button size="lg">Imprimir</Button>
                            </div>
                        </div>
                    )}

                    {produtos.length === 0 && (
                        <div className="rounded-lg border bg-card p-6">
                            <h2 className="mb-4 text-lg font-semibold">
                                Produtos
                            </h2>
                            <div className="text-sm text-muted-foreground">
                                Nenhum produto adicionado. Use o campo acima
                                para buscar e adicionar produtos.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

RelatorioBaixa.layout = (page: React.ReactNode) => (
    <AppSidebarLayout
        breadcrumbs={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Baixa Produto', href: '/relatorios/baixa' },
        ]}
    >
        {page}
    </AppSidebarLayout>
);
