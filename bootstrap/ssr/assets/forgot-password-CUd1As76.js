import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Form } from "@inertiajs/react";
import { LoaderCircle } from "lucide-react";
import { I as InputError } from "./input-error-D205dVHU.js";
import { T as TextLink } from "./text-link-BOsrYWr_.js";
import { B as Button } from "./button-DyLM49PM.js";
import { I as Input } from "./input-GB1MmPmu.js";
import { L as Label } from "./label-BeKFlcTZ.js";
import { A as AuthLayout } from "./auth-layout-BDKA2-wq.js";
import { l as login } from "./index-DF_fN02X.js";
import { e as email } from "./index-CNHlfVMH.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "./app-logo-icon-kpljnLMz.js";
import "./index-KiexPW6g.js";
function ForgotPassword({ status }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Forgot password",
      description: "Enter your email to receive a password reset link",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Forgot password" }),
        status && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: status }),
        /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
          /* @__PURE__ */ jsx(Form, { ...email.form(), children: ({ processing, errors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid gap-2", children: [
              /* @__PURE__ */ jsx(Label, { htmlFor: "email", children: "Email address" }),
              /* @__PURE__ */ jsx(
                Input,
                {
                  id: "email",
                  type: "email",
                  name: "email",
                  autoComplete: "off",
                  autoFocus: true,
                  placeholder: "email@example.com"
                }
              ),
              /* @__PURE__ */ jsx(InputError, { message: errors.email })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "my-6 flex items-center justify-start", children: /* @__PURE__ */ jsxs(
              Button,
              {
                className: "w-full",
                disabled: processing,
                "data-test": "email-password-reset-link-button",
                children: [
                  processing && /* @__PURE__ */ jsx(LoaderCircle, { className: "h-4 w-4 animate-spin" }),
                  "Email password reset link"
                ]
              }
            ) })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "space-x-1 text-center text-sm text-muted-foreground", children: [
            /* @__PURE__ */ jsx("span", { children: "Or, return to" }),
            /* @__PURE__ */ jsx(TextLink, { href: login(), children: "log in" })
          ] })
        ] })
      ]
    }
  );
}
export {
  ForgotPassword as default
};
