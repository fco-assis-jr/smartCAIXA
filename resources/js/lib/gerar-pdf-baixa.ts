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
};

export const gerarPDFBaixaProduto = async ({
    nomeFilial,
    tipoBaixa,
    produtos,
    observacao,
    totalGeral,
}: GerarPDFParams) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Adicionar logo
    try {
        const logo = await fetch('/logo.png');
        const logoBlob = await logo.blob();
        const logoBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(logoBlob);
        });
        doc.addImage(logoBase64, 'PNG', 14, 10, 20, 20);
    } catch (error) {
        console.error('Erro ao carregar logo:', error);
    }

    // Cabeçalho - Nome da Filial
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(nomeFilial.toUpperCase(), pageWidth / 2, 20, { align: 'center' });

    // Data
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    doc.text(`DATA: ${dataAtual}`, pageWidth - 14, 20, { align: 'right' });

    // Tipo de Baixa
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(tipoBaixa.toUpperCase(), pageWidth / 2, 35, { align: 'center' });

    // Linha separadora
    doc.setLineWidth(0.5);
    doc.line(14, 40, pageWidth - 14, 40);

    // Tabela de produtos
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
        startY: 45,
        head: [['CODAUX', 'CODPROD', 'DESCRIÇÃO', 'EMB', 'QT', 'PREÇO', 'TOTAL']],
        body: produtosData,
        foot: [['', '', '', '', '', 'TOTAL GERAL =>', `R$ ${totalGeral.toFixed(2)}`]],
        theme: 'grid',
        headStyles: {
            fillColor: [0, 0, 0],
            textColor: [255, 255, 255],
            fontStyle: 'bold',
            fontSize: 9,
        },
        footStyles: {
            fillColor: [240, 240, 240],
            textColor: [0, 0, 0],
            fontStyle: 'bold',
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 8,
        },
        columnStyles: {
            0: { cellWidth: 20 },
            1: { cellWidth: 20 },
            2: { cellWidth: 60 },
            3: { cellWidth: 15 },
            4: { cellWidth: 15 },
            5: { cellWidth: 25 },
            6: { cellWidth: 25 },
        },
    });

    // Posição após a tabela
    // @ts-expect-error - jspdf-autotable adiciona lastAutoTable ao objeto doc
    const finalY = doc.lastAutoTable?.finalY || 100;

    // Observação
    if (observacao) {
        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.text('OBSERVAÇÃO:', 14, finalY + 10);
        doc.setFont('helvetica', 'normal');
        doc.text(observacao, 14, finalY + 15);
    }

    // Campos de assinatura
    const assinaturaY = finalY + (observacao ? 30 : 20);
    const espacamento = 20;

    // Linhas de assinatura
    const assinaturas = [
        'RECEBIDO',
        'RECEPCIONISTA',
        'GERENTE',
        'F. PATRIMÔNIO',
        'F. CAIXA',
    ];

    assinaturas.forEach((label, index) => {
        const y = assinaturaY + (index * espacamento);
        doc.setLineWidth(0.3);
        doc.line(20, y, pageWidth - 20, y);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.text(label, pageWidth / 2, y + 5, { align: 'center' });
    });

    // Abrir PDF em nova aba
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};
