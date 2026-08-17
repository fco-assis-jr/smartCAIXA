import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

type Produto = {
    CODPROD: string;
    CODAUXILIAR: string;
    DESCRICAO: string;
    EMBALAGEM: string;
    UNIDADE: string;
    PRECO: number;
    quantidade: number;
};

type GerarPDFParams = {
    nomeFilial: string;
    tipoBaixa: string;
    produtos: Produto[];
    observacao: string;
    totalGeral: number;
    /** Nome de quem gerou a baixa — aparece no cabeçalho e no rodapé, para rastreabilidade. */
    operador?: string;
};

type RGB = [number, number, number];

// Mesma identidade do app (grafite/âmbar), calibrada pra imprimir bem numa
// laser P&B de loja: nada de preenchimento preto sólido pesando no toner, e
// nenhuma informação depende só da cor pra ser entendida (ver memória do
// projeto sobre impressão em preto e branco).
const COR_AMBAR: RGB = [214, 118, 12];
const COR_AMBAR_ESCURO: RGB = [140, 80, 10];
const COR_AMBAR_CLARO: RGB = [253, 236, 212];
const COR_TINTA: RGB = [26, 23, 20];
const COR_CINZA: RGB = [110, 100, 90];
const COR_GRADE: RGB = [224, 213, 199];
const COR_LINHA_ASSINATURA: RGB = [200, 195, 188];

const carregarLogo = async (): Promise<string | null> => {
    try {
        const resposta = await fetch('/logo.png');
        if (!resposta.ok) return null;

        const blob = await resposta.blob();
        return await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (error) {
        console.error('Erro ao carregar logo:', error);
        return null;
    }
};

/**
 * Rótulo de seção no estilo "ficha de controle": versalete, levemente
 * espaçado, seguido de um traço fino. É o mesmo tratamento em PRODUTOS,
 * OBSERVAÇÃO e ASSINATURAS — dá ao documento uma linguagem visual única de
 * formulário oficial, em vez de blocos de texto soltos.
 */
const desenharEyebrow = (doc: jsPDF, texto: string, x: number, y: number, largura: number) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...COR_CINZA);
    doc.setCharSpace(0.5);
    doc.text(texto, x, y);
    doc.setCharSpace(0);

    doc.setDrawColor(...COR_GRADE);
    doc.setLineWidth(0.25);
    doc.line(x, y + 2, x + largura, y + 2);
};

/**
 * O "carimbo" do tipo de baixa: moldura dupla alinhada normalmente, no
 * espírito dos carimbos de conferência usados no back-office das lojas
 * (CONFERIDO, BAIXADO etc.). É o elemento de identidade deste documento —
 * a informação que mais importa achar rápido ao folhear uma pilha de
 * baixas impressas.
 */
const desenharCarimbo = (doc: jsPDF, texto: string, cx: number, cy: number, larguraMaxima = 80) => {
    const espacamento = 0.4;

    // Tipos de baixa mais longos (ex. "Devolução ao Fornecedor") não podem
    // vazar da moldura — a fonte encolhe até caber num limite de largura,
    // em vez de manter tamanho fixo e sair do carimbo.
    doc.setFont('helvetica', 'bold');
    doc.setCharSpace(espacamento);
    let fontSize = 11;
    // getTextWidth() não considera o charSpace aplicado no render, então a
    // medida leva uma margem de segurança de 15% além do espaçamento extra
    // somado à mão — sem isso, textos longos ("Devolução ao Fornecedor")
    // furam a moldura em vez de encolher a tempo.
    const medir = () => (doc.getTextWidth(texto) + espacamento * Math.max(0, texto.length - 1)) * 1.15 + 16;
    doc.setFontSize(fontSize);
    let largura = medir();
    while (largura > larguraMaxima && fontSize > 6.5) {
        fontSize -= 0.5;
        doc.setFontSize(fontSize);
        largura = medir();
    }
    const altura = 10;

    const retangulo = (inset: number, espessura: number) => {
        doc.setLineWidth(espessura);
        doc.rect(cx - largura / 2 + inset, cy - altura / 2 + inset, largura - inset * 2, altura - inset * 2);
    };

    doc.setDrawColor(...COR_AMBAR);
    retangulo(0, 0.6);
    retangulo(1.6, 0.25);

    doc.setTextColor(...COR_AMBAR_ESCURO);
    doc.text(texto, cx, cy, { align: 'center', baseline: 'middle' });
    doc.setCharSpace(0);
};

export const gerarPDFBaixaProduto = async ({
    nomeFilial,
    tipoBaixa,
    produtos,
    observacao,
    totalGeral,
    operador,
}: GerarPDFParams) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const larguraUtil = pageWidth - margin * 2;

    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString('pt-BR');
    const horaFormatada = agora.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // ---------- Cabeçalho ----------
    const logoBase64 = await carregarLogo();
    if (logoBase64) {
        try {
            doc.addImage(logoBase64, 'PNG', margin, 9, 18, 18);
        } catch (error) {
            console.error('Erro ao inserir logo no PDF:', error);
        }
    }

    const textoX = logoBase64 ? margin + 24 : margin;

    doc.setTextColor(...COR_TINTA);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(15);
    doc.text('Baixa de Produto', textoX, 17);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(...COR_CINZA);
    doc.text(nomeFilial, textoX, 24);

    // Metadados alinhados à direita: data/hora e quem gerou
    doc.setFontSize(8.5);
    doc.text(`${dataFormatada} às ${horaFormatada}`, pageWidth - margin, 13, {
        align: 'right',
    });
    if (operador) {
        doc.text(`Operador(a): ${operador}`, pageWidth - margin, 18, {
            align: 'right',
        });
    }

    desenharCarimbo(doc, tipoBaixa.toUpperCase(), textoX + 26, 33);

    doc.setDrawColor(...COR_AMBAR);
    doc.setLineWidth(0.6);
    doc.line(margin, 44, pageWidth - margin, 44);

    // ---------- Tabela de produtos ----------
    desenharEyebrow(doc, 'PRODUTOS', margin, 51, larguraUtil);

    const produtosData = produtos.map((produto) => {
        const preco = Number(produto.PRECO || 0);
        const subtotal = preco * produto.quantidade;
        return [
            produto.CODAUXILIAR,
            produto.CODPROD,
            produto.DESCRICAO,
            produto.EMBALAGEM,
            produto.quantidade.toString(),
            `R$ ${preco.toFixed(2)}`,
            `R$ ${subtotal.toFixed(2)}`,
        ];
    });

    autoTable(doc, {
        startY: 56,
        margin: { left: margin, right: margin, bottom: 16 },
        head: [
            [
                'Cód. Aux.',
                'Cód. Prod.',
                'Descrição',
                'Emb.',
                'Qtd',
                'Preço Unit.',
                'Subtotal',
            ],
        ],
        body: produtosData,
        // Sem "foot" aqui de propósito: o foot do jspdf-autotable repete em
        // toda página, o que mostraria "Total Geral" já na 1ª página mesmo
        // com produtos ainda por vir nas próximas — o total é desenhado à
        // mão depois, só uma vez, no fim real da tabela.
        theme: 'grid',
        styles: {
            lineColor: COR_GRADE,
            lineWidth: 0.2,
        },
        headStyles: {
            fillColor: COR_AMBAR_CLARO,
            textColor: COR_AMBAR_ESCURO,
            fontStyle: 'bold',
            fontSize: 8.5,
        },
        bodyStyles: {
            fontSize: 8.5,
            textColor: COR_TINTA,
        },
        columnStyles: {
            0: { cellWidth: 20, font: 'courier' },
            1: { cellWidth: 20, font: 'courier' },
            2: { cellWidth: 58 },
            3: { cellWidth: 14 },
            4: { cellWidth: 14, halign: 'right' },
            5: { cellWidth: 26, halign: 'right' },
            6: { cellWidth: 30, halign: 'right' },
        },
    });

    // @ts-expect-error - jspdf-autotable adiciona lastAutoTable ao objeto doc
    let cursorY: number = doc.lastAutoTable?.finalY ?? 100;

    // Evita que total/observação/assinaturas fiquem cortados na virada de
    // página — esse documento é impresso e assinado à mão, não pode perder
    // conteúdo nem informação.
    const garantirEspaco = (alturaNecessaria: number) => {
        if (cursorY + alturaNecessaria > pageHeight - 16) {
            doc.addPage();
            cursorY = 20;
        }
    };

    // ---------- Total Geral (desenhado uma única vez, no fim real da
    // tabela — nunca repetido nas páginas intermediárias) ----------
    garantirEspaco(10);
    doc.setDrawColor(...COR_GRADE);
    doc.setLineWidth(0.2);
    doc.line(margin, cursorY, pageWidth - margin, cursorY);
    cursorY += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(...COR_TINTA);
    doc.text('Total Geral', pageWidth - margin - 30, cursorY, { align: 'right' });
    doc.text(`R$ ${totalGeral.toFixed(2)}`, pageWidth - margin, cursorY, { align: 'right' });
    cursorY += 3;

    // ---------- Observação ----------
    if (observacao) {
        garantirEspaco(24);
        cursorY += 12;
        desenharEyebrow(doc, 'OBSERVAÇÃO', margin, cursorY, larguraUtil);
        cursorY += 6;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...COR_TINTA);
        const linhas = doc.splitTextToSize(observacao, larguraUtil);
        doc.text(linhas, margin, cursorY);
        cursorY += linhas.length * 4.5;
    }

    // ---------- Assinaturas ----------
    // A ordem aqui é real, não decorativa: é o caminho físico que o papel
    // percorre — de quem recebe a mercadoria até a baixa efetivada no caixa
    // — por isso a numeração 01–05 carrega informação, não é enfeite.
    const assinaturas = ['Recebido por', 'Recepcionista', 'Gerente', 'Financeiro / Patrimônio', 'Financeiro / Caixa'];
    const espacamento = 13;

    garantirEspaco(assinaturas.length * espacamento + 16);
    cursorY += 12;
    desenharEyebrow(doc, 'ASSINATURAS', margin, cursorY, larguraUtil);
    cursorY += 10;

    assinaturas.forEach((papel, indice) => {
        const numero = String(indice + 1).padStart(2, '0');

        doc.setFont('courier', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COR_AMBAR_ESCURO);
        doc.text(numero, margin, cursorY);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(...COR_TINTA);
        doc.text(papel, margin + 10, cursorY);

        doc.setDrawColor(...COR_LINHA_ASSINATURA);
        doc.setLineWidth(0.3);
        doc.line(margin + 60, cursorY + 2, pageWidth - margin, cursorY + 2);

        cursorY += espacamento;
    });

    // ---------- Rodapé (em todas as páginas, inclusive as que a tabela
    // paginou automaticamente) ----------
    const totalPaginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        doc.setPage(pagina);
        doc.setDrawColor(...COR_GRADE);
        doc.setLineWidth(0.2);
        doc.line(margin, pageHeight - 13, pageWidth - margin, pageHeight - 13);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...COR_CINZA);
        doc.text(
            `Gerado via SmartCAIXA em ${dataFormatada} às ${horaFormatada}${operador ? ` · ${operador}` : ''}`,
            margin,
            pageHeight - 8,
        );
        doc.text(
            `Página ${pagina} de ${totalPaginas}`,
            pageWidth - margin,
            pageHeight - 8,
            {
                align: 'right',
            },
        );
    }

    doc.setProperties({
        title: `Baixa de Produto - ${nomeFilial} - ${tipoBaixa}`,
    });

    // Abrir PDF em nova aba (fluxo é gerar e imprimir na hora)
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};
