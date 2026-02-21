import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { useState } from "react";
import { G as GenericCombobox, F as FilialCombobox } from "./filial-combobox-C5SX_zdY.js";
import { C as CustomAlert } from "./custom-alert-BjQgcEif.js";
import { H as Heading } from "./heading-DgovwZou.js";
import { c as cn, B as Button } from "./button-DyLM49PM.js";
import { A as AppSidebarLayout, f as ferramentas } from "./app-sidebar-layout-DdSWXqY8.js";
import { d as dashboard } from "./index-DF_fN02X.js";
import "@base-ui/react";
import "lucide-react";
import "class-variance-authority";
import "./input-GB1MmPmu.js";
import "./label-BeKFlcTZ.js";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-slot";
import "@radix-ui/react-dialog";
import "@radix-ui/react-tooltip";
import "@radix-ui/react-collapsible";
import "@radix-ui/react-dropdown-menu";
import "@radix-ui/react-avatar";
import "./app-logo-icon-kpljnLMz.js";
function CaixaCombobox({
  caixas,
  value,
  onChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsx(
    GenericCombobox,
    {
      id: "caixa-combobox",
      label: "Número do Caixa",
      options: caixas,
      value,
      onChange,
      placeholder: "Selecione o número do caixa...",
      emptyMessage: "Nenhum caixa encontrado.",
      disabled
    }
  );
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn("flex flex-col gap-1.5 px-6", className),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function Dblink({ filiais, caixas }) {
  const [processando, setProcessando] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    variant: "default"
  });
  const { data, setData } = useForm({
    codFilial: "",
    numeroCaixa: ""
  });
  const showAlert = (message, variant = "default") => {
    setAlert({ open: true, message, variant });
  };
  const closeAlert = () => {
    setAlert({ ...alert, open: false });
  };
  const recriarDblink = async () => {
    if (!data.codFilial || !data.numeroCaixa) {
      showAlert("Selecione a filial e o número do caixa", "warning");
      return;
    }
    setProcessando(true);
    try {
      const response = await fetch("/ferramentas/dblink/recriar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") || ""
        },
        body: JSON.stringify({
          codFilial: data.codFilial,
          numeroCaixa: parseInt(data.numeroCaixa)
        })
      });
      const result = await response.json();
      if (response.ok) {
        if (result.warning) {
          showAlert(result.message, "warning");
        } else {
          showAlert(result.message, "success");
        }
      } else {
        showAlert(result.message || "Erro ao recriar DBLink", "error");
      }
    } catch (error) {
      console.error("Erro ao recriar DBLink:", error);
      showAlert("Erro ao recriar DBLink. Verifique o console.", "error");
    } finally {
      setProcessando(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "DBLink - Ferramentas" }),
    /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
      /* @__PURE__ */ jsx(
        Heading,
        {
          title: "Recriar Conexão do Caixa",
          description: "Recrie a conexão do caixa com o servidor central"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "mt-8 space-y-6 max-w-2xl mx-auto", children: /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-base", children: "Selecione o Caixa" }),
          /* @__PURE__ */ jsx(CardDescription, { children: "Escolha a filial e o número do caixa que precisa reconectar ao servidor" })
        ] }),
        /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
            /* @__PURE__ */ jsx(
              FilialCombobox,
              {
                filiais,
                value: data.codFilial,
                onChange: (value) => setData("codFilial", value),
                disabled: processando
              }
            ),
            /* @__PURE__ */ jsx(
              CaixaCombobox,
              {
                caixas,
                value: data.numeroCaixa,
                onChange: (value) => setData("numeroCaixa", value),
                disabled: processando
              }
            )
          ] }),
          data.codFilial && data.numeroCaixa && /* @__PURE__ */ jsxs("div", { className: "rounded-md bg-blue-50 border border-blue-200 p-4", children: [
            /* @__PURE__ */ jsx("p", { className: "text-sm font-medium text-blue-900", children: "Caixa selecionado:" }),
            /* @__PURE__ */ jsxs("p", { className: "text-lg font-bold text-blue-900 mt-1", children: [
              "Filial ",
              data.codFilial,
              " - Caixa ",
              data.numeroCaixa
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            Button,
            {
              onClick: recriarDblink,
              disabled: processando || !data.codFilial || !data.numeroCaixa,
              className: "w-full",
              size: "lg",
              children: processando ? "Reconectando..." : "Reconectar ao Servidor"
            }
          )
        ] }) })
      ] }) })
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
Dblink.layout = (page) => /* @__PURE__ */ jsx(
  AppSidebarLayout,
  {
    breadcrumbs: [
      { title: "Dashboard", href: dashboard() },
      { title: "Ferramentas", href: "#" },
      { title: "DBLink", href: ferramentas.dblink.index() }
    ],
    children: page
  }
);
export {
  Dblink as default
};
