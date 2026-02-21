import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { useForm, Head } from "@inertiajs/react";
import { A as AppLogoIcon } from "./app-logo-icon-kpljnLMz.js";
import { B as Button, c as cn } from "./button-DyLM49PM.js";
import { F as FieldGroup, a as Field, b as FieldLabel, c as FieldDescription } from "./field-Bs1VKANc.js";
import { I as Input } from "./input-GB1MmPmu.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "react";
import "./label-BeKFlcTZ.js";
import "./separator-Fi-6UxR6.js";
function CustomLoginForm({
  className,
  ...props
}) {
  const { data, setData, post, processing, errors } = useForm({
    usuario: "",
    senha: "",
    remember: false
  });
  const submit = (e) => {
    e.preventDefault();
    post("/login");
  };
  return /* @__PURE__ */ jsx(
    "form",
    {
      className: cn("flex flex-col gap-6", className),
      onSubmit: submit,
      ...props,
      children: /* @__PURE__ */ jsxs(FieldGroup, { children: [
        /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center gap-1 text-center", children: [
          /* @__PURE__ */ jsx("h1", { className: "text-2xl font-bold", children: "Bem-vindo" }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-balance text-muted-foreground", children: "Entre com seu usuário e senha para acessar o sistema" })
        ] }),
        errors.usuario && /* @__PURE__ */ jsx("div", { className: "rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive", children: errors.usuario }),
        /* @__PURE__ */ jsxs(Field, { children: [
          /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "usuario", children: "Usuário" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "usuario",
              type: "text",
              value: data.usuario,
              onChange: (e) => setData("usuario", e.target.value),
              placeholder: "Digite seu usuário",
              required: true,
              autoFocus: true,
              autoComplete: "username",
              className: errors.usuario ? "border-destructive" : ""
            }
          )
        ] }),
        /* @__PURE__ */ jsxs(Field, { children: [
          /* @__PURE__ */ jsx(FieldLabel, { htmlFor: "senha", children: "Senha" }),
          /* @__PURE__ */ jsx(
            Input,
            {
              id: "senha",
              type: "password",
              value: data.senha,
              onChange: (e) => setData("senha", e.target.value),
              placeholder: "Digite sua senha",
              required: true,
              autoComplete: "current-password",
              className: errors.usuario ? "border-destructive" : ""
            }
          )
        ] }),
        /* @__PURE__ */ jsx(Field, { children: /* @__PURE__ */ jsxs("label", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: data.remember,
              onChange: (e) => setData("remember", e.target.checked),
              className: "size-4 rounded border-gray-300"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: "text-sm text-muted-foreground", children: "Lembrar de mim" })
        ] }) }),
        /* @__PURE__ */ jsx(Field, { children: /* @__PURE__ */ jsx(Button, { type: "submit", disabled: processing, className: "w-full", children: processing ? "Entrando..." : "Entrar" }) }),
        /* @__PURE__ */ jsx(FieldDescription, { className: "text-center text-xs", children: "Sistema SmartCAIXA - Acesso restrito a usuários autorizados" })
      ] })
    }
  );
}
function CustomLoginPage() {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Head, { title: "Login" }),
    /* @__PURE__ */ jsxs("div", { className: "grid min-h-svh lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex flex-col gap-4 p-6 md:p-10", children: [
        /* @__PURE__ */ jsx("div", { className: "flex justify-center gap-2 md:justify-start", children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/",
            className: "flex items-center gap-2 font-medium",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground", children: /* @__PURE__ */ jsx(AppLogoIcon, { className: "size-5" }) }),
              /* @__PURE__ */ jsx("span", { className: "text-lg", children: "SmartCAIXA" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "flex flex-1 items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "w-full max-w-xs", children: /* @__PURE__ */ jsx(CustomLoginForm, {}) }) })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "relative hidden bg-muted lg:block", children: /* @__PURE__ */ jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5", children: /* @__PURE__ */ jsxs("div", { className: "max-w-md space-y-4 p-8 text-center", children: [
        /* @__PURE__ */ jsx("div", { className: "mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-primary/10", children: /* @__PURE__ */ jsx(AppLogoIcon, { className: "size-12 text-primary" }) }),
        /* @__PURE__ */ jsx("h2", { className: "text-3xl font-bold", children: "Sistema de Gestão" }),
        /* @__PURE__ */ jsx("p", { className: "text-lg text-muted-foreground", children: "Controle total das operações do seu caixa com segurança e eficiência" }),
        /* @__PURE__ */ jsxs("div", { className: "mt-8 grid gap-4 text-left", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-4 text-primary",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Gestão de Baixas" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Controle eficiente de avarias e perdas" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-4 text-primary",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Ferramentas de Gestão" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Recursos avançados para administração" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-3", children: [
            /* @__PURE__ */ jsx("div", { className: "mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/20", children: /* @__PURE__ */ jsx(
              "svg",
              {
                className: "size-4 text-primary",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: /* @__PURE__ */ jsx(
                  "path",
                  {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeWidth: 2,
                    d: "M5 13l4 4L19 7"
                  }
                )
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: "Integração Oracle" }),
              /* @__PURE__ */ jsx("p", { className: "text-sm text-muted-foreground", children: "Conexão direta com banco de dados corporativo" })
            ] })
          ] })
        ] })
      ] }) }) })
    ] })
  ] });
}
export {
  CustomLoginPage as default
};
