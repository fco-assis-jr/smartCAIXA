import jsPDF from 'jspdf';
import autoTable, { type HAlignType } from 'jspdf-autotable';

type GerarPDFNotaBrancaParams = {
    xml: string;
    numNota: string;
    chaveNFe: string;
    cliente: string;
    cpfCnpj: string;
    valorTotal: number | string;
    dataSaida: string;
};

type RGB = [number, number, number];

// Mesma identidade visual do resto do sistema (grafite/âmbar) — ver
// gerar-pdf-baixa.ts. Calibrada pra imprimir bem em P&B: nenhuma informação
// depende só da cor pra ser entendida.
const COR_AMBAR: RGB = [214, 118, 12];
const COR_AMBAR_ESCURO: RGB = [140, 80, 10];
const COR_AMBAR_CLARO: RGB = [253, 236, 212];
const COR_TINTA: RGB = [26, 23, 20];
const COR_CINZA: RGB = [110, 100, 90];
const COR_GRADE: RGB = [224, 213, 199];

const FORMAS_PAGAMENTO: Record<string, string> = {
    '01': 'Dinheiro',
    '02': 'Cheque',
    '03': 'Cartão de Crédito',
    '04': 'Cartão de Débito',
    '05': 'Crédito Loja',
    '10': 'Vale Alimentação',
    '11': 'Vale Refeição',
    '12': 'Vale Presente',
    '13': 'Vale Combustível',
    '15': 'Boleto Bancário',
    '17': 'PIX',
    '90': 'Sem Pagamento',
    '99': 'Outros',
};

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

const desenharEyebrow = (
    doc: jsPDF,
    texto: string,
    x: number,
    y: number,
    largura: number,
) => {
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

// NFe/NFC-e usa namespace default (xmlns="http://www.portalfiscal.inf.br/nfe")
// — removê-lo antes de parsear permite usar querySelector/getElementsByTagName
// só pelo nome local, sem precisar lidar com namespace-aware XPath.
const limparNamespace = (xmlText: string) =>
    xmlText.replace(/ xmlns(:\w+)?="[^"]*"/g, '');

const texto = (elemento: Element | Document | null, seletor: string): string =>
    elemento?.querySelector(seletor)?.textContent?.trim() ?? '';

const formatarChave = (chave: string) => chave.replace(/(\d{4})(?=\d)/g, '$1 ');

const formatarDataHoraNFe = (valor: string): string => {
    // dhEmi/dhRecbto vêm no formato ISO 8601 com timezone (ex.
    // 2026-08-18T08:50:00-03:00) — parseia manualmente em vez de usar
    // `new Date()` pra não depender do timezone do navegador.
    const match = valor.match(
        /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/,
    );
    if (!match) return valor;
    const [, ano, mes, dia, hora, minuto] = match;
    return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
};

const formatarValorMonetario = (valor: number | string | undefined) => {
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    if (!numero || isNaN(numero)) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numero);
};

export const gerarPDFNotaBranca = async ({
    xml,
    numNota,
    chaveNFe,
    cliente,
    cpfCnpj,
    valorTotal,
    dataSaida,
}: GerarPDFNotaBrancaParams) => {
    const doc = new DOMParser().parseFromString(
        limparNamespace(xml),
        'application/xml',
    );
    if (doc.querySelector('parsererror')) {
        throw new Error('XML da nota inválido ou corrompido.');
    }

    const infNFe = doc.querySelector('infNFe');
    if (!infNFe) {
        throw new Error('Estrutura do XML não é uma NFe válida.');
    }

    const ide = infNFe.querySelector('ide');
    const emit = infNFe.querySelector('emit');
    const dest = infNFe.querySelector('dest');
    const total = infNFe.querySelector('total > ICMSTot');
    const transp = infNFe.querySelector('transp');
    const duplicatas = Array.from(infNFe.querySelectorAll('cobr > dup'));
    const pagamentos = Array.from(infNFe.querySelectorAll('pag > detPag'));
    const infAdic = infNFe
        .querySelector('infAdic > infCpl')
        ?.textContent?.trim();
    const protNFe = doc.querySelector('protNFe > infProt');
    const itens = Array.from(infNFe.querySelectorAll('det'));

    const tpAmb = texto(ide, 'tpAmb');
    const chave =
        chaveNFe || infNFe.getAttribute('Id')?.replace(/^NFe/, '') || '';

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
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
            pdf.addImage(logoBase64, 'PNG', margin, 9, 18, 18);
        } catch (error) {
            console.error('Erro ao inserir logo no PDF:', error);
        }
    }
    const textoX = logoBase64 ? margin + 24 : margin;

    pdf.setTextColor(...COR_TINTA);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text(texto(emit, 'xNome') || 'Emitente não identificado', textoX, 16);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COR_CINZA);
    const cnpjEmit = texto(emit, 'CNPJ');
    pdf.text(
        `CNPJ: ${cnpjEmit || '—'}${texto(emit, 'IE') ? ` · IE: ${texto(emit, 'IE')}` : ''}`,
        textoX,
        21.5,
    );
    const enderEmit = emit?.querySelector('enderEmit');
    if (enderEmit) {
        const endereco = [
            texto(enderEmit, 'xLgr'),
            texto(enderEmit, 'nro'),
            texto(enderEmit, 'xBairro'),
            texto(enderEmit, 'xMun'),
            texto(enderEmit, 'UF'),
        ]
            .filter(Boolean)
            .join(', ');
        if (endereco) pdf.text(endereco, textoX, 26);
    }

    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(...COR_AMBAR_ESCURO);
    pdf.text('DANFE SIMPLIFICADO', pageWidth - margin, 13, { align: 'right' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8.5);
    pdf.setTextColor(...COR_TINTA);
    pdf.text(
        `Nota ${numNota}${texto(ide, 'serie') ? ` · Série ${texto(ide, 'serie')}` : ''}`,
        pageWidth - margin,
        18,
        { align: 'right' },
    );
    const dhEmi = texto(ide, 'dhEmi');
    pdf.text(
        `Emitida em ${dhEmi ? formatarDataHoraNFe(dhEmi) : dataSaida}`,
        pageWidth - margin,
        23,
        { align: 'right' },
    );

    if (tpAmb === '2') {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8.5);
        pdf.setTextColor(180, 30, 30);
        pdf.text(
            'AMBIENTE DE HOMOLOGAÇÃO — SEM VALOR FISCAL',
            pageWidth - margin,
            28,
            { align: 'right' },
        );
    }

    pdf.setDrawColor(...COR_AMBAR);
    pdf.setLineWidth(0.6);
    pdf.line(margin, 32, pageWidth - margin, 32);

    // ---------- Destinatário ----------
    let cursorY = 39;
    desenharEyebrow(pdf, 'DESTINATÁRIO', margin, cursorY, larguraUtil);
    cursorY += 6;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...COR_TINTA);
    if (dest) {
        const nomeDest =
            texto(dest, 'xNome') || cliente || 'Consumidor não identificado';
        const docDest = texto(dest, 'CNPJ') || texto(dest, 'CPF') || cpfCnpj;
        pdf.text(nomeDest, margin, cursorY);
        if (docDest) {
            pdf.setFontSize(8.5);
            pdf.setTextColor(...COR_CINZA);
            pdf.text(`CPF/CNPJ: ${docDest}`, margin, cursorY + 5);
            cursorY += 5;
        }
        const enderDest = dest.querySelector('enderDest');
        if (enderDest) {
            const endereco = [
                texto(enderDest, 'xLgr'),
                texto(enderDest, 'nro'),
                texto(enderDest, 'xBairro'),
                texto(enderDest, 'xMun'),
                texto(enderDest, 'UF'),
            ]
                .filter(Boolean)
                .join(', ');
            if (endereco) {
                pdf.setFontSize(8.5);
                pdf.setTextColor(...COR_CINZA);
                pdf.text(endereco, margin, cursorY + 5);
                cursorY += 5;
            }
        }
    } else {
        pdf.text(cliente || 'Consumidor não identificado', margin, cursorY);
        if (cpfCnpj) {
            pdf.setFontSize(8.5);
            pdf.setTextColor(...COR_CINZA);
            pdf.text(`CPF/CNPJ: ${cpfCnpj}`, margin, cursorY + 5);
            cursorY += 5;
        }
    }
    cursorY += 10;

    // ---------- Itens ----------
    desenharEyebrow(pdf, 'ITENS', margin, cursorY, larguraUtil);

    const right: HAlignType = 'right';
    const center: HAlignType = 'center';

    const itensData = itens.map((det) => {
        const prod = det.querySelector('prod');
        return [
            texto(prod, 'cProd'),
            texto(prod, 'xProd'),
            texto(prod, 'NCM'),
            texto(prod, 'CFOP'),
            texto(prod, 'uCom'),
            Number(texto(prod, 'qCom') || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
            }),
            formatarValorMonetario(texto(prod, 'vUnCom')),
            formatarValorMonetario(texto(prod, 'vProd')),
        ];
    });

    autoTable(pdf, {
        startY: cursorY + 5,
        margin: { left: margin, right: margin, bottom: 16 },
        head: [
            [
                'Código',
                'Descrição',
                'NCM',
                'CFOP',
                'Un.',
                'Qtd',
                'Vl. Unit.',
                'Vl. Total',
            ],
        ],
        body: itensData,
        theme: 'grid',
        styles: { lineColor: COR_GRADE, lineWidth: 0.2 },
        headStyles: {
            fillColor: COR_AMBAR_CLARO,
            textColor: COR_AMBAR_ESCURO,
            fontStyle: 'bold',
            fontSize: 8,
        },
        bodyStyles: { fontSize: 8, textColor: COR_TINTA },
        columnStyles: {
            0: { cellWidth: 18, font: 'courier' },
            1: { cellWidth: 60 },
            2: { cellWidth: 18, halign: center },
            3: { cellWidth: 14, halign: center },
            4: { cellWidth: 12, halign: center },
            5: { cellWidth: 16, halign: right },
            6: { cellWidth: 22, halign: right },
            7: { cellWidth: 24, halign: right },
        },
    });

    // @ts-expect-error - jspdf-autotable adiciona lastAutoTable ao objeto doc
    cursorY = pdf.lastAutoTable?.finalY ?? cursorY + 20;

    const garantirEspaco = (alturaNecessaria: number) => {
        if (cursorY + alturaNecessaria > pageHeight - 16) {
            pdf.addPage();
            cursorY = 20;
        }
    };

    // ---------- Totais ----------
    garantirEspaco(20);
    cursorY += 7;
    pdf.setDrawColor(...COR_GRADE);
    pdf.setLineWidth(0.2);
    pdf.line(margin, cursorY - 4, pageWidth - margin, cursorY - 4);

    const vProd = texto(total, 'vProd');
    const vDesc = texto(total, 'vDesc');
    const vFrete = texto(total, 'vFrete');
    const vNF = texto(total, 'vNF') || String(valorTotal);

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...COR_TINTA);
    if (vProd) {
        pdf.text('Valor dos Produtos', pageWidth - margin - 45, cursorY, {
            align: 'right',
        });
        pdf.text(formatarValorMonetario(vProd), pageWidth - margin, cursorY, {
            align: 'right',
        });
        cursorY += 5;
    }
    if (vDesc && parseFloat(vDesc) > 0) {
        pdf.text('Desconto', pageWidth - margin - 45, cursorY, {
            align: 'right',
        });
        pdf.text(
            `- ${formatarValorMonetario(vDesc)}`,
            pageWidth - margin,
            cursorY,
            { align: 'right' },
        );
        cursorY += 5;
    }
    if (vFrete && parseFloat(vFrete) > 0) {
        pdf.text('Frete', pageWidth - margin - 45, cursorY, { align: 'right' });
        pdf.text(formatarValorMonetario(vFrete), pageWidth - margin, cursorY, {
            align: 'right',
        });
        cursorY += 5;
    }
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(10.5);
    pdf.text('Total da Nota', pageWidth - margin - 45, cursorY, {
        align: 'right',
    });
    pdf.text(formatarValorMonetario(vNF), pageWidth - margin, cursorY, {
        align: 'right',
    });
    cursorY += 3;

    // ---------- Transporte ----------
    const modFrete = texto(transp, 'modFrete');
    if (transp && modFrete !== '9') {
        garantirEspaco(16);
        cursorY += 10;
        desenharEyebrow(pdf, 'TRANSPORTE', margin, cursorY, larguraUtil);
        cursorY += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...COR_TINTA);
        const transportadora = transp.querySelector('transporta');
        pdf.text(
            transportadora
                ? `${texto(transportadora, 'xNome')} — CNPJ ${texto(transportadora, 'CNPJ')}`
                : 'Transporte por conta do destinatário/remetente, sem transportadora identificada.',
            margin,
            cursorY,
        );
    }

    // ---------- Parcelas ----------
    if (duplicatas.length > 0) {
        garantirEspaco(duplicatas.length * 5 + 16);
        cursorY += 10;
        desenharEyebrow(pdf, 'PARCELAS', margin, cursorY, larguraUtil);
        cursorY += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(...COR_TINTA);
        duplicatas.forEach((dup) => {
            const linha = `${texto(dup, 'nDup') || '—'}  ·  vencimento ${formatarDataHoraNFe(texto(dup, 'dVenc'))}  ·  ${formatarValorMonetario(texto(dup, 'vDup'))}`;
            pdf.text(linha, margin, cursorY);
            cursorY += 5;
        });
    }

    // ---------- Forma de pagamento ----------
    garantirEspaco(pagamentos.length * 5 + 16);
    cursorY += 10;
    desenharEyebrow(pdf, 'FORMA DE PAGAMENTO', margin, cursorY, larguraUtil);
    cursorY += 6;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(...COR_TINTA);
    if (pagamentos.length === 0) {
        pdf.text('Não informado no XML.', margin, cursorY);
        cursorY += 5;
    } else {
        pagamentos.forEach((detPag) => {
            const tPag = texto(detPag, 'tPag');
            const label = FORMAS_PAGAMENTO[tPag] ?? `Outro (${tPag})`;
            pdf.text(
                `${label}  —  ${formatarValorMonetario(texto(detPag, 'vPag'))}`,
                margin,
                cursorY,
            );
            cursorY += 5;
        });
    }

    // ---------- Informações adicionais ----------
    if (infAdic) {
        garantirEspaco(20);
        cursorY += 8;
        desenharEyebrow(
            pdf,
            'INFORMAÇÕES ADICIONAIS',
            margin,
            cursorY,
            larguraUtil,
        );
        cursorY += 6;
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(...COR_TINTA);
        const linhas = pdf.splitTextToSize(infAdic, larguraUtil);
        pdf.text(linhas, margin, cursorY);
        cursorY += linhas.length * 4.2;
    }

    // ---------- Chave de acesso e protocolo ----------
    garantirEspaco(20);
    cursorY += 12;
    pdf.setFont('courier', 'bold');
    pdf.setFontSize(9.5);
    pdf.setTextColor(...COR_TINTA);
    pdf.text(
        chave ? formatarChave(chave) : 'Chave de acesso não disponível',
        pageWidth / 2,
        cursorY,
        {
            align: 'center',
        },
    );
    cursorY += 4.5;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7.5);
    pdf.setTextColor(...COR_CINZA);
    pdf.text('Chave de Acesso', pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 6;

    pdf.setFontSize(8);
    if (protNFe) {
        pdf.text(
            `Protocolo de Autorização: ${texto(protNFe, 'nProt')} em ${formatarDataHoraNFe(texto(protNFe, 'dhRecbto'))}`,
            pageWidth / 2,
            cursorY,
            { align: 'center' },
        );
    } else {
        pdf.text(
            'Nota em contingência — protocolo de autorização pendente.',
            pageWidth / 2,
            cursorY,
            { align: 'center' },
        );
    }

    // ---------- Rodapé (em todas as páginas) ----------
    const totalPaginas = pdf.getNumberOfPages();
    for (let pagina = 1; pagina <= totalPaginas; pagina++) {
        pdf.setPage(pagina);
        pdf.setDrawColor(...COR_GRADE);
        pdf.setLineWidth(0.2);
        pdf.line(margin, pageHeight - 16, pageWidth - margin, pageHeight - 16);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.setTextColor(...COR_CINZA);
        const aviso = pdf.splitTextToSize(
            `Reimpressão interna gerada via SmartCAIXA — documento sem QR Code/código de barras, não substitui o DANFE oficial para fins fiscais. Gerado em ${dataFormatada} às ${horaFormatada}.`,
            larguraUtil,
        );
        pdf.text(aviso, margin, pageHeight - 12);
        pdf.text(
            `Página ${pagina} de ${totalPaginas}`,
            pageWidth - margin,
            pageHeight - 12,
            { align: 'right' },
        );
    }

    pdf.setProperties({ title: `Nota ${numNota} - DANFE Simplificado` });

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
};
