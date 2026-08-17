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
// laser P&B de loja: nada de preenchimento preto sólido pesando no toner.
const COR_AMBAR: RGB = [214, 118, 12];
const COR_AMBAR_ESCURO: RGB = [140, 80, 10];
const COR_AMBAR_CLARO: RGB = [253, 236, 212];
const COR_TINTA: RGB = [26, 23, 20];
const COR_CINZA: RGB = [110, 100, 90];
const COR_GRADE: RGB = [224, 213, 199];

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

    // "Chip" do tipo de baixa — é a informação que quem folheia uma pilha de
    // baixas mais precisa achar rápido, por isso fica em destaque, não só em
    // texto corrido.
    const chipY = 30;
    const chipLabel = tipoBaixa.toUpperCase();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    const chipWidth = doc.getTextWidth(chipLabel) + 8;
    const chipHeight = 8;

    doc.setDrawColor(...COR_AMBAR);
    doc.setFillColor(...COR_AMBAR_CLARO);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, chipY, chipWidth, chipHeight, 1.5, 1.5, 'FD');
    doc.setTextColor(...COR_AMBAR_ESCURO);
    doc.text(chipLabel, margin + 4, chipY + chipHeight / 2 + 2.8);

    doc.setDrawColor(...COR_AMBAR);
    doc.setLineWidth(0.6);
    doc.line(margin, 44, pageWidth - margin, 44);

    // ---------- Tabela de produtos ----------
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
        startY: 50,
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
            3: { cellWidth: 16 },
            4: { cellWidth: 14, halign: 'right' },
            5: { cellWidth: 25, halign: 'right' },
            6: { cellWidth: 25, halign: 'right' },
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
        garantirEspaco(20);
        cursorY += 10;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(...COR_TINTA);
        doc.text('Observação:', margin, cursorY);
        doc.setFont('helvetica', 'normal');
        const linhas = doc.splitTextToSize(
            observacao,
            pageWidth - margin * 2 - 28,
        );
        doc.text(linhas, margin + 28, cursorY);
        cursorY += linhas.length * 4.5;
    }

    // ---------- Assinaturas ----------
    const assinaturas = [
        'Recebido por',
        'Recepcionista',
        'Gerente',
        'Financeiro / Patrimônio',
        'Financeiro / Caixa',
    ];
    const espacamento = 15;

    garantirEspaco(assinaturas.length * espacamento + 14);
    cursorY += 14;

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...COR_CINZA);
    doc.text('ASSINATURAS', margin, cursorY);
    cursorY += 7;

    assinaturas.forEach((label) => {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...COR_TINTA);
        doc.text(label, margin, cursorY - 1);

        doc.setDrawColor(200, 195, 188);
        doc.setLineWidth(0.3);
        doc.line(margin + 42, cursorY, pageWidth - margin, cursorY);

        cursorY += espacamento;
    });

    // ---------- Rodapé (em todas as páginas, inclusive as que a tabela
    // paginou automaticamente) ----------
    const totalPaginas = doc.getNumberOfPages();
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        doc.setPage(pagina);
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
