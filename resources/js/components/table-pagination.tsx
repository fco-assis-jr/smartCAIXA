import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type TablePaginationProps = {
    paginaAtual: number;
    totalItens: number;
    itensPorPagina: number;
    onChangePagina: (pagina: number) => void;
    onChangeItensPorPagina: (itens: number) => void;
    opcoesItensPorPagina?: number[];
    disabled?: boolean;
};

const formatarNumero = (valor: number) =>
    new Intl.NumberFormat('pt-BR').format(valor);

/**
 * Paginação client-side para tabelas de resultado que trazem tudo de uma vez
 * (ex. buscas de vendas por período, que podem voltar dezenas de milhares de
 * linhas) — evita renderizar a lista inteira de uma vez e dá um jeito rápido
 * de saltar direto pra uma página quando o total é grande.
 */
export function TablePagination({
    paginaAtual,
    totalItens,
    itensPorPagina,
    onChangePagina,
    onChangeItensPorPagina,
    opcoesItensPorPagina = [25, 50, 100, 200],
    disabled = false,
}: TablePaginationProps) {
    const totalPaginas = Math.max(1, Math.ceil(totalItens / itensPorPagina));
    const inicio =
        totalItens === 0 ? 0 : (paginaAtual - 1) * itensPorPagina + 1;
    const fim = Math.min(paginaAtual * itensPorPagina, totalItens);
    const [irPara, setIrPara] = useState('');

    // Some junto com a página atual pra não deixar um valor velho no campo
    // depois de saltar pra outra página por outro controle (setas, etc.).
    // Ajustado durante a renderização (em vez de useEffect) seguindo o
    // padrão do React pra resetar estado quando uma prop muda.
    const [paginaAnterior, setPaginaAnterior] = useState(paginaAtual);
    if (paginaAtual !== paginaAnterior) {
        setPaginaAnterior(paginaAtual);
        setIrPara('');
    }

    const irParaPagina = (pagina: number) => {
        const alvo = Math.min(Math.max(1, pagina), totalPaginas);
        onChangePagina(alvo);
    };

    const submeterIrPara = (evento: FormEvent) => {
        evento.preventDefault();
        const numero = parseInt(irPara, 10);
        if (!isNaN(numero)) {
            irParaPagina(numero);
        } else {
            setIrPara('');
        }
    };

    return (
        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Mostrando{' '}
                <span className="font-medium text-foreground tabular-nums">
                    {formatarNumero(inicio)}–{formatarNumero(fim)}
                </span>{' '}
                de{' '}
                <span className="font-medium text-foreground tabular-nums">
                    {formatarNumero(totalItens)}
                </span>{' '}
                {totalItens === 1 ? 'resultado' : 'resultados'}
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        Por página
                    </span>
                    <Select
                        value={String(itensPorPagina)}
                        onValueChange={(value) =>
                            onChangeItensPorPagina(Number(value))
                        }
                        disabled={disabled}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {opcoesItensPorPagina.map((opcao) => (
                                <SelectItem key={opcao} value={String(opcao)}>
                                    {opcao}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => irParaPagina(1)}
                        disabled={disabled || paginaAtual === 1}
                        title="Primeira página"
                    >
                        <ChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => irParaPagina(paginaAtual - 1)}
                        disabled={disabled || paginaAtual === 1}
                        title="Página anterior"
                    >
                        <ChevronLeft />
                    </Button>

                    <form
                        onSubmit={submeterIrPara}
                        className="flex items-center gap-1.5 px-1"
                    >
                        <span className="text-sm text-muted-foreground">
                            Página
                        </span>
                        <Input
                            value={irPara}
                            onChange={(e) =>
                                setIrPara(e.target.value.replace(/\D/g, ''))
                            }
                            placeholder={String(paginaAtual)}
                            inputMode="numeric"
                            aria-label="Ir para a página"
                            className="h-8 w-14 text-center font-mono text-sm tabular-nums"
                            disabled={disabled}
                        />
                        <span className="text-sm text-muted-foreground tabular-nums">
                            de {formatarNumero(totalPaginas)}
                        </span>
                    </form>

                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => irParaPagina(paginaAtual + 1)}
                        disabled={disabled || paginaAtual === totalPaginas}
                        title="Próxima página"
                    >
                        <ChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon-sm"
                        onClick={() => irParaPagina(totalPaginas)}
                        disabled={disabled || paginaAtual === totalPaginas}
                        title="Última página"
                    >
                        <ChevronsRight />
                    </Button>
                </div>
            </div>
        </div>
    );
}
