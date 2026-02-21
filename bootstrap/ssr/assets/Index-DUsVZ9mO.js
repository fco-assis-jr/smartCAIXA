import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { C as CustomAlert } from "./custom-alert-BjQgcEif.js";
import { G as GenericCombobox, F as FilialCombobox } from "./filial-combobox-C5SX_zdY.js";
import { H as Heading } from "./heading-DgovwZou.js";
import { B as Button } from "./button-DyLM49PM.js";
import { I as Input } from "./input-GB1MmPmu.js";
import { L as Label } from "./label-BeKFlcTZ.js";
import { A as AppSidebarLayout } from "./app-sidebar-layout-DdSWXqY8.js";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "radix-ui";
import "@base-ui/react";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./index-DF_fN02X.js";
import "./app-logo-icon-kpljnLMz.js";
function TipoBaixaCombobox({
  tipos,
  value,
  onChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsx(
    GenericCombobox,
    {
      id: "tipo-baixa-combobox",
      label: "Tipo de Baixa",
      options: tipos,
      value,
      onChange,
      placeholder: "Selecione um tipo...",
      emptyMessage: "Nenhum tipo encontrado.",
      disabled
    }
  );
}
const gerarPDFBaixaProduto = async ({
  nomeFilial,
  tipoBaixa,
  produtos,
  observacao,
  totalGeral
}) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  try {
    const logo = await fetch("/logo.png");
    const logoBlob = await logo.blob();
    const logoBase64 = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(logoBlob);
    });
    doc.addImage(logoBase64, "PNG", 14, 10, 20, 20);
  } catch (error) {
    console.error("Erro ao carregar logo:", error);
  }
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(nomeFilial.toUpperCase(), pageWidth / 2, 20, { align: "center" });
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const dataAtual = (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR");
  doc.text(`DATA: ${dataAtual}`, pageWidth - 14, 20, { align: "right" });
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text(tipoBaixa.toUpperCase(), pageWidth / 2, 35, { align: "center" });
  doc.setLineWidth(0.5);
  doc.line(14, 40, pageWidth - 14, 40);
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
      `R$ ${subtotal.toFixed(2)}`
    ];
  });
  autoTable(doc, {
    startY: 45,
    head: [["CODAUX", "CODPROD", "DESCRIÇÃO", "EMB", "QT", "PREÇO", "TOTAL"]],
    body: produtosData,
    foot: [["", "", "", "", "", "TOTAL GERAL =>", `R$ ${totalGeral.toFixed(2)}`]],
    theme: "grid",
    headStyles: {
      fillColor: [0, 0, 0],
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 9
    },
    footStyles: {
      fillColor: [240, 240, 240],
      textColor: [0, 0, 0],
      fontStyle: "bold",
      fontSize: 9
    },
    bodyStyles: {
      fontSize: 8
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 60 },
      3: { cellWidth: 15 },
      4: { cellWidth: 15 },
      5: { cellWidth: 25 },
      6: { cellWidth: 25 }
    }
  });
  const finalY = doc.lastAutoTable?.finalY || 100;
  if (observacao) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("OBSERVAÇÃO:", 14, finalY + 10);
    doc.setFont("helvetica", "normal");
    doc.text(observacao, 14, finalY + 15);
  }
  const assinaturaY = finalY + (observacao ? 30 : 20);
  const espacamento = 20;
  const assinaturas = [
    "RECEBIDO",
    "RECEPCIONISTA",
    "GERENTE",
    "F. PATRIMÔNIO",
    "F. CAIXA"
  ];
  assinaturas.forEach((label, index) => {
    const y = assinaturaY + index * espacamento;
    doc.setLineWidth(0.3);
    doc.line(20, y, pageWidth - 20, y);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text(label, pageWidth / 2, y + 5, { align: "center" });
  });
  const pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  window.open(pdfUrl, "_blank");
};
function BaixaProduto({ filiais, tiposBaixa }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoEncontrado, setProdutoEncontrado] = useState(null);
  const [buscandoProduto, setBuscandoProduto] = useState(false);
  const [codAuxiliar, setCodAuxiliar] = useState("");
  const [quantidade, setQuantidade] = useState(1);
  const [filtroExpandido, setFiltroExpandido] = useState(true);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    variant: "default"
  });
  const codAuxiliarInputRef = useRef(null);
  const quantidadeInputRef = useRef(null);
  const { data, setData } = useForm({
    codFilial: "",
    tipoBaixa: "",
    observacao: ""
  });
  const showAlert = (message, variant = "default") => {
    setAlert({ open: true, message, variant });
  };
  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };
  const filtroCompleto = data.codFilial && data.tipoBaixa;
  const totalGeral = produtos.reduce((sum, produto) => {
    return sum + Number(produto.PRECO || 0) * produto.quantidade;
  }, 0);
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
        showAlert("Selecione uma filial antes de buscar o produto", "warning");
      }
      return;
    }
    setBuscandoProduto(true);
    try {
      const response = await fetch("/baixa-produto/buscar-por-codigo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
        },
        body: JSON.stringify({
          codAuxiliar: codAuxiliar.trim(),
          codFilial: data.codFilial
        })
      });
      if (response.ok) {
        const result = await response.json();
        setProdutoEncontrado({
          ...result.produto,
          quantidade: 1
        });
        setQuantidade(1);
      } else {
        const error = await response.json();
        console.error("Erro ao buscar produto:", error);
        showAlert(error.message || error.error || "Produto não encontrado", "error");
        setProdutoEncontrado(null);
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      showAlert("Erro ao buscar produto. Verifique o console para mais detalhes.", "error");
      setProdutoEncontrado(null);
    } finally {
      setBuscandoProduto(false);
    }
  };
  const adicionarProduto = () => {
    if (!produtoEncontrado || quantidade <= 0) return;
    const novoProduto = {
      ...produtoEncontrado,
      quantidade
    };
    setProdutos([...produtos, novoProduto]);
    setProdutoEncontrado(null);
    setCodAuxiliar("");
    setQuantidade(1);
    if (produtos.length === 0) {
      setFiltroExpandido(false);
    }
    setTimeout(() => {
      codAuxiliarInputRef.current?.focus();
    }, 100);
  };
  const removerProduto = (index) => {
    const novaLista = produtos.filter((_, i) => i !== index);
    setProdutos(novaLista);
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
      showAlert("Adicione pelo menos um produto antes de finalizar", "warning");
      return;
    }
    if (!data.codFilial || !data.tipoBaixa) {
      showAlert("Selecione a filial e o tipo de baixa", "warning");
      return;
    }
    try {
      const filialSelecionada = filiais.find((f) => f.value === data.codFilial);
      const nomeFilial = filialSelecionada?.label || `Filial ${data.codFilial}`;
      const tipoBaixaSelecionada = tiposBaixa.find((t) => t.value === data.tipoBaixa);
      const nomeTipoBaixa = tipoBaixaSelecionada?.label || data.tipoBaixa;
      await gerarPDFBaixaProduto({
        nomeFilial,
        tipoBaixa: nomeTipoBaixa,
        produtos,
        observacao: data.observacao,
        totalGeral
      });
      limparLista();
      showAlert("Relatório gerado com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      showAlert("Erro ao gerar relatório. Tente novamente.", "error");
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Baixa Produto" }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
      /* @__PURE__ */ jsx(
        Heading,
        {
          title: "Baixa Produto",
          description: "Registre e gerencie as baixas de produtos"
        }
      ),
      /* @__PURE__ */ jsxs("div", { className: "mt-6 space-y-4", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card overflow-hidden shadow-sm", children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setFiltroExpandido(!filtroExpandido),
              className: "w-full px-4 py-3 flex items-center justify-between text-left hover:bg-accent/50 transition-colors",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
                  /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold", children: "Filtros" }),
                  filtroCompleto && !filtroExpandido && /* @__PURE__ */ jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
                    "Filial: ",
                    data.codFilial,
                    " | Tipo: ",
                    tiposBaixa.find((t) => t.value === data.tipoBaixa)?.label
                  ] })
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-muted-foreground transition-transform duration-300 text-sm", style: { transform: filtroExpandido ? "rotate(0deg)" : "rotate(-90deg)" }, children: "▼" })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "div",
            {
              className: `transition-all duration-300 ease-in-out ${filtroExpandido ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`,
              children: /* @__PURE__ */ jsxs("div", { className: "px-4 pb-4 pt-3 border-t", children: [
                /* @__PURE__ */ jsxs("div", { className: "grid gap-3 md:grid-cols-2", children: [
                  /* @__PURE__ */ jsx(
                    FilialCombobox,
                    {
                      filiais,
                      value: data.codFilial,
                      onChange: (value) => setData("codFilial", value),
                      disabled: produtos.length > 0
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    TipoBaixaCombobox,
                    {
                      tipos: tiposBaixa,
                      value: data.tipoBaixa,
                      onChange: (value) => setData("tipoBaixa", value),
                      disabled: produtos.length > 0
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
                  /* @__PURE__ */ jsx(Label, { htmlFor: "observacao", className: "text-sm", children: "Observação Geral" }),
                  /* @__PURE__ */ jsx(
                    Input,
                    {
                      id: "observacao",
                      type: "text",
                      value: data.observacao,
                      onChange: (e) => setData("observacao", e.target.value),
                      placeholder: "Observação da baixa",
                      className: "mt-1.5"
                    }
                  )
                ] })
              ] })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card shadow-sm", children: [
          /* @__PURE__ */ jsx("div", { className: "px-4 py-3 border-b bg-muted/30", children: /* @__PURE__ */ jsx("h2", { className: "text-sm font-semibold", children: "Adicionar Produto" }) }),
          /* @__PURE__ */ jsxs("div", { className: "p-4 space-y-3", children: [
            /* @__PURE__ */ jsx("div", { className: "flex gap-3", children: /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "codAuxiliar", className: "text-xs text-muted-foreground", children: "Código do Produto" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  ref: codAuxiliarInputRef,
                  id: "codAuxiliar",
                  type: "text",
                  value: codAuxiliar,
                  onChange: (e) => setCodAuxiliar(e.target.value),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      buscarProduto();
                    }
                  },
                  onBlur: buscarProduto,
                  placeholder: "Digite o código",
                  disabled: buscandoProduto || !data.codFilial,
                  className: "mt-1"
                }
              )
            ] }) }),
            produtoEncontrado && /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-primary/20 bg-primary/5 p-3 animate-in fade-in slide-in-from-top-2 duration-300", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsx("div", { className: "flex-1 min-w-0", children: /* @__PURE__ */ jsxs("div", { className: "flex items-baseline gap-2", children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-sm truncate", children: produtoEncontrado.DESCRICAO }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
                  "Cód: ",
                  produtoEncontrado.CODPROD
                ] }),
                /* @__PURE__ */ jsx("span", { className: "text-xs text-muted-foreground shrink-0", children: "•" }),
                /* @__PURE__ */ jsxs("span", { className: "text-xs text-muted-foreground shrink-0", children: [
                  produtoEncontrado.EMBALAGEM,
                  " / ",
                  produtoEncontrado.UNIDADE
                ] })
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "text-right shrink-0", children: /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-primary", children: [
                "R$ ",
                Number(produtoEncontrado.PRECO || 0).toFixed(2)
              ] }) }),
              /* @__PURE__ */ jsx("div", { className: "shrink-0 w-24", children: /* @__PURE__ */ jsx(
                Input,
                {
                  ref: quantidadeInputRef,
                  id: "quantidade",
                  type: "number",
                  value: quantidade,
                  onChange: (e) => setQuantidade(
                    Number(e.target.value)
                  ),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      adicionarProduto();
                    }
                  },
                  min: "1",
                  placeholder: "Qtd",
                  className: "h-9"
                }
              ) }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: adicionarProduto,
                  disabled: quantidade <= 0,
                  size: "default",
                  className: "shrink-0",
                  children: "Adicionar"
                }
              )
            ] }) }),
            buscandoProduto && /* @__PURE__ */ jsx("div", { className: "text-center py-4 text-sm text-muted-foreground", children: "Buscando produto..." })
          ] })
        ] }),
        produtos.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card shadow-sm", children: [
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-b flex items-center justify-between bg-muted/30", children: [
            /* @__PURE__ */ jsxs("h2", { className: "text-sm font-semibold", children: [
              "Produtos Adicionados (",
              produtos.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-sm text-muted-foreground", children: [
              "Total: ",
              /* @__PURE__ */ jsxs("span", { className: "font-bold text-lg text-foreground", children: [
                "R$ ",
                totalGeral.toFixed(2)
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "border-b bg-muted/50", children: /* @__PURE__ */ jsxs("tr", { className: "text-xs", children: [
              /* @__PURE__ */ jsx("th", { className: "p-3 text-left font-semibold", children: "Cód. Aux" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-left font-semibold", children: "Cód. Prod" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-left font-semibold", children: "Descrição" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-left font-semibold", children: "Emb" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-left font-semibold", children: "Uni" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-right font-semibold", children: "Preço" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-right font-semibold", children: "Qtd" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-right font-semibold", children: "Subtotal" }),
              /* @__PURE__ */ jsx("th", { className: "p-3 text-center font-semibold", children: "Ações" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { className: "divide-y", children: produtos.map((produto, index) => {
              const preco = Number(produto.PRECO || 0);
              const subtotal = preco * produto.quantidade;
              return /* @__PURE__ */ jsxs(
                "tr",
                {
                  className: "hover:bg-muted/30 transition-colors",
                  children: [
                    /* @__PURE__ */ jsx("td", { className: "p-3 font-medium", children: produto.CODAUXILIAR }),
                    /* @__PURE__ */ jsx("td", { className: "p-3", children: produto.CODPROD }),
                    /* @__PURE__ */ jsx("td", { className: "p-3 max-w-xs", children: /* @__PURE__ */ jsx("div", { className: "font-medium truncate", children: produto.DESCRICAO }) }),
                    /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground", children: produto.EMBALAGEM }),
                    /* @__PURE__ */ jsx("td", { className: "p-3 text-muted-foreground", children: produto.UNIDADE }),
                    /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-medium", children: [
                      "R$ ",
                      preco.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsx("span", { className: "px-2 py-1 bg-muted rounded text-sm font-medium", children: produto.quantidade }) }),
                    /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-bold text-primary", children: [
                      "R$ ",
                      subtotal.toFixed(2)
                    ] }),
                    /* @__PURE__ */ jsx("td", { className: "p-3 text-center", children: /* @__PURE__ */ jsx(
                      Button,
                      {
                        variant: "ghost",
                        size: "sm",
                        onClick: () => removerProduto(
                          index
                        ),
                        className: "h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive",
                        title: "Excluir produto",
                        children: /* @__PURE__ */ jsx(Trash2, { className: "h-4 w-4" })
                      }
                    ) })
                  ]
                },
                index
              );
            }) }),
            /* @__PURE__ */ jsx("tfoot", { className: "border-t-2 bg-muted/30", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("td", { colSpan: 7, className: "p-3 text-right font-semibold", children: "Total Geral:" }),
              /* @__PURE__ */ jsxs("td", { className: "p-3 text-right font-bold text-xl text-primary", children: [
                "R$ ",
                totalGeral.toFixed(2)
              ] }),
              /* @__PURE__ */ jsx("td", {})
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "px-4 py-3 border-t flex justify-end gap-3 bg-muted/20", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                variant: "outline",
                onClick: limparLista,
                size: "lg",
                children: "Limpar Lista"
              }
            ),
            /* @__PURE__ */ jsx(Button, { size: "lg", onClick: finalizarBaixa, className: "min-w-40", children: "Finalizar Baixa" })
          ] })
        ] }),
        produtos.length === 0 && filtroCompleto && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border-2 border-dashed bg-card p-8 text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "ℹ️ Nenhum produto adicionado ainda" }),
          /* @__PURE__ */ jsx("div", { className: "text-xs text-muted-foreground mt-1", children: "Digite o código do produto no campo acima para começar" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      CustomAlert,
      {
        open: alert.open,
        onClose: closeAlert,
        message: alert.message,
        variant: alert.variant
      }
    )
  ] });
}
BaixaProduto.layout = (page) => /* @__PURE__ */ jsx(
  AppSidebarLayout,
  {
    breadcrumbs: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Baixa Produto", href: "/baixa-produto" }
    ],
    children: page
  }
);
export {
  BaixaProduto as default
};
