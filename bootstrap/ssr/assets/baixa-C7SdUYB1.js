import { jsxs, Fragment, jsx } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { F as FilialCombobox } from "./filial-combobox-C5SX_zdY.js";
import { H as Heading } from "./heading-DgovwZou.js";
import { B as Button } from "./button-DyLM49PM.js";
import { I as Input } from "./input-GB1MmPmu.js";
import { L as Label } from "./label-BeKFlcTZ.js";
import { A as AppSidebarLayout } from "./app-sidebar-layout-DdSWXqY8.js";
import "@base-ui/react";
import "lucide-react";
import "class-variance-authority";
import "radix-ui";
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
function RelatorioBaixa({ filiais, tiposBaixa }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoAtual, setProdutoAtual] = useState(null);
  const [buscandoProduto, setBuscandoProduto] = useState(false);
  const { data, setData } = useForm({
    codFilial: "",
    tipoBaixa: "",
    data: "",
    codAuxiliar: "",
    observacao: ""
  });
  const buscarProduto = async () => {
    if (!data.codAuxiliar || !data.codFilial) {
      alert("Por favor, selecione a filial antes de buscar produtos");
      return;
    }
    setBuscandoProduto(true);
    try {
      const response = await fetch(
        "/baixa-produto/buscar-por-codigo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
          },
          body: JSON.stringify({
            codAuxiliar: data.codAuxiliar,
            codFilial: data.codFilial
          })
        }
      );
      if (response.ok) {
        const result = await response.json();
        setProdutoAtual({
          ...result.produto,
          quantidade: 1,
          preco: result.produto.PRECO || 0,
          observacao: data.observacao
        });
      } else {
        const error = await response.json();
        console.error("Erro ao buscar produto:", error);
        alert(error.message || "Produto não encontrado");
        setProdutoAtual(null);
      }
    } catch (error) {
      console.error("Erro ao buscar produto:", error);
      alert("Erro ao buscar produto. Verifique o console para mais detalhes.");
    } finally {
      setBuscandoProduto(false);
    }
  };
  const adicionarProduto = () => {
    if (!produtoAtual) return;
    setProdutos([...produtos, produtoAtual]);
    setProdutoAtual(null);
    setData("codAuxiliar", "");
  };
  const removerProduto = (index) => {
    setProdutos(produtos.filter((_, i) => i !== index));
  };
  const calcularTotal = () => {
    return produtos.reduce(
      (total, p) => total + (p.quantidade || 0) * (p.preco || 0),
      0
    ).toFixed(2);
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
      /* @__PURE__ */ jsxs("div", { className: "mt-8 space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold", children: "Filtros" }),
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
            /* @__PURE__ */ jsx(
              FilialCombobox,
              {
                filiais,
                value: data.codFilial,
                onChange: (value) => setData("codFilial", value)
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "tipoBaixa", children: "Tipo de Baixa" }),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  id: "tipoBaixa",
                  value: data.tipoBaixa,
                  onChange: (e) => setData("tipoBaixa", e.target.value),
                  className: "w-full rounded-md border border-input bg-background px-3 py-2",
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "", children: "Selecione..." }),
                    tiposBaixa.map((tipo) => /* @__PURE__ */ jsx(
                      "option",
                      {
                        value: tipo.value,
                        children: tipo.label
                      },
                      tipo.value
                    ))
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "data", children: "Data" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "data",
                  type: "date",
                  value: data.data,
                  onChange: (e) => setData("data", e.target.value)
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "observacao", children: "Observação Geral" }),
            /* @__PURE__ */ jsx(
              Input,
              {
                id: "observacao",
                type: "text",
                value: data.observacao,
                onChange: (e) => setData("observacao", e.target.value),
                placeholder: "Observação do relatório"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold", children: "Adicionar Produto" }),
          /* @__PURE__ */ jsx("div", { className: "grid gap-4 md:grid-cols-4", children: /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
            /* @__PURE__ */ jsx(Label, { htmlFor: "codAuxiliar", children: "Código Auxiliar" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "codAuxiliar",
                  type: "text",
                  value: data.codAuxiliar,
                  onChange: (e) => setData(
                    "codAuxiliar",
                    e.target.value
                  ),
                  onKeyDown: (e) => {
                    if (e.key === "Enter") {
                      buscarProduto();
                    }
                  },
                  placeholder: "Digite o código e pressione Enter",
                  disabled: buscandoProduto
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  onClick: buscarProduto,
                  disabled: buscandoProduto || !data.codAuxiliar,
                  children: "Buscar"
                }
              )
            ] })
          ] }) }),
          produtoAtual && /* @__PURE__ */ jsx("div", { className: "mt-4 rounded-md border bg-muted p-4", children: /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-5", children: [
            /* @__PURE__ */ jsxs("div", { className: "md:col-span-2", children: [
              /* @__PURE__ */ jsx(Label, { children: "Descrição" }),
              /* @__PURE__ */ jsx("div", { className: "text-sm font-medium", children: produtoAtual.DESCRICAO }),
              /* @__PURE__ */ jsxs("div", { className: "text-xs text-muted-foreground", children: [
                "Cód: ",
                produtoAtual.CODPROD,
                " | EMB:",
                " ",
                produtoAtual.EMBALAGEM
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "quantidade", children: "QT" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "quantidade",
                  type: "number",
                  value: produtoAtual.quantidade || 1,
                  onChange: (e) => setProdutoAtual({
                    ...produtoAtual,
                    quantidade: Number(
                      e.target.value
                    )
                  }),
                  min: "1"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "preco", children: "Preço" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "preco",
                  type: "number",
                  step: "0.01",
                  value: produtoAtual.preco || 0,
                  onChange: (e) => setProdutoAtual({
                    ...produtoAtual,
                    preco: Number(
                      e.target.value
                    )
                  }),
                  min: "0"
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { className: "flex items-end", children: /* @__PURE__ */ jsx(
              Button,
              {
                onClick: adicionarProduto,
                className: "w-full",
                children: "Adicionar"
              }
            ) })
          ] }) })
        ] }),
        produtos.length > 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold", children: "Produtos" }),
          /* @__PURE__ */ jsx("div", { className: "overflow-x-auto", children: /* @__PURE__ */ jsxs("table", { className: "w-full text-sm", children: [
            /* @__PURE__ */ jsx("thead", { className: "border-b", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx("th", { className: "p-2 text-left", children: "Código" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-left", children: "Cód. Produto" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-left", children: "Descrição" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-left", children: "EMB" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-right", children: "QT" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-right", children: "Preço" }),
              /* @__PURE__ */ jsx("th", { className: "p-2 text-right", children: "Total" }),
              /* @__PURE__ */ jsx("th", { className: "p-2" })
            ] }) }),
            /* @__PURE__ */ jsx("tbody", { children: produtos.map((produto, index) => /* @__PURE__ */ jsxs(
              "tr",
              {
                className: "border-b",
                children: [
                  /* @__PURE__ */ jsx("td", { className: "p-2", children: produto.CODAUXILIAR }),
                  /* @__PURE__ */ jsx("td", { className: "p-2", children: produto.CODPROD }),
                  /* @__PURE__ */ jsx("td", { className: "p-2", children: produto.DESCRICAO }),
                  /* @__PURE__ */ jsx("td", { className: "p-2", children: produto.EMBALAGEM }),
                  /* @__PURE__ */ jsx("td", { className: "p-2 text-right", children: produto.quantidade }),
                  /* @__PURE__ */ jsx("td", { className: "p-2 text-right", children: produto.preco?.toFixed(2) }),
                  /* @__PURE__ */ jsx("td", { className: "p-2 text-right", children: ((produto.quantidade || 0) * (produto.preco || 0)).toFixed(2) }),
                  /* @__PURE__ */ jsx("td", { className: "p-2", children: /* @__PURE__ */ jsx(
                    Button,
                    {
                      variant: "ghost",
                      size: "sm",
                      onClick: () => removerProduto(
                        index
                      ),
                      children: "Excluir"
                    }
                  ) })
                ]
              },
              index
            )) }),
            /* @__PURE__ */ jsx("tfoot", { className: "border-t font-semibold", children: /* @__PURE__ */ jsxs("tr", { children: [
              /* @__PURE__ */ jsx(
                "td",
                {
                  colSpan: 6,
                  className: "p-2 text-right",
                  children: "Total Geral:"
                }
              ),
              /* @__PURE__ */ jsx("td", { className: "p-2 text-right", children: calcularTotal() }),
              /* @__PURE__ */ jsx("td", {})
            ] }) })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "mt-4 flex justify-end", children: /* @__PURE__ */ jsx(Button, { size: "lg", children: "Imprimir" }) })
        ] }),
        produtos.length === 0 && /* @__PURE__ */ jsxs("div", { className: "rounded-lg border bg-card p-6", children: [
          /* @__PURE__ */ jsx("h2", { className: "mb-4 text-lg font-semibold", children: "Produtos" }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-muted-foreground", children: "Nenhum produto adicionado. Use o campo acima para buscar e adicionar produtos." })
        ] })
      ] })
    ] })
  ] });
}
RelatorioBaixa.layout = (page) => /* @__PURE__ */ jsx(
  AppSidebarLayout,
  {
    breadcrumbs: [
      { title: "Dashboard", href: "/dashboard" },
      { title: "Baixa Produto", href: "/relatorios/baixa" }
    ],
    children: page
  }
);
export {
  RelatorioBaixa as default
};
