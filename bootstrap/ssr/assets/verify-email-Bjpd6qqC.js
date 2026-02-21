import { jsxs, jsx, Fragment } from "react/jsx-runtime";
import { Head, Form } from "@inertiajs/react";
import { T as TextLink } from "./text-link-BOsrYWr_.js";
import { B as Button } from "./button-DyLM49PM.js";
import { S as Spinner } from "./spinner-DrKJR6Zl.js";
import { A as AuthLayout } from "./auth-layout-BDKA2-wq.js";
import { q as queryParams, a as applyUrlDefaults, b as logout } from "./index-DF_fN02X.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "lucide-react";
import "./app-logo-icon-kpljnLMz.js";
const notice = (options) => ({
  url: notice.url(options),
  method: "get"
});
notice.definition = {
  methods: ["get", "head"],
  url: "/email/verify"
};
notice.url = (options) => {
  return notice.definition.url + queryParams(options);
};
notice.get = (options) => ({
  url: notice.url(options),
  method: "get"
});
notice.head = (options) => ({
  url: notice.url(options),
  method: "head"
});
const noticeForm = (options) => ({
  action: notice.url(options),
  method: "get"
});
noticeForm.get = (options) => ({
  action: notice.url(options),
  method: "get"
});
noticeForm.head = (options) => ({
  action: notice.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
notice.form = noticeForm;
const verify = (args, options) => ({
  url: verify.url(args, options),
  method: "get"
});
verify.definition = {
  methods: ["get", "head"],
  url: "/email/verify/{id}/{hash}"
};
verify.url = (args, options) => {
  if (Array.isArray(args)) {
    args = {
      id: args[0],
      hash: args[1]
    };
  }
  args = applyUrlDefaults(args);
  const parsedArgs = {
    id: args.id,
    hash: args.hash
  };
  return verify.definition.url.replace("{id}", parsedArgs.id.toString()).replace("{hash}", parsedArgs.hash.toString()).replace(/\/+$/, "") + queryParams(options);
};
verify.get = (args, options) => ({
  url: verify.url(args, options),
  method: "get"
});
verify.head = (args, options) => ({
  url: verify.url(args, options),
  method: "head"
});
const verifyForm = (args, options) => ({
  action: verify.url(args, options),
  method: "get"
});
verifyForm.get = (args, options) => ({
  action: verify.url(args, options),
  method: "get"
});
verifyForm.head = (args, options) => ({
  action: verify.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
verify.form = verifyForm;
const send = (options) => ({
  url: send.url(options),
  method: "post"
});
send.definition = {
  methods: ["post"],
  url: "/email/verification-notification"
};
send.url = (options) => {
  return send.definition.url + queryParams(options);
};
send.post = (options) => ({
  url: send.url(options),
  method: "post"
});
const sendForm = (options) => ({
  action: send.url(options),
  method: "post"
});
sendForm.post = (options) => ({
  action: send.url(options),
  method: "post"
});
send.form = sendForm;
({
  notice: Object.assign(notice, notice),
  verify: Object.assign(verify, verify),
  send: Object.assign(send, send)
});
function VerifyEmail({ status }) {
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: "Verify email",
      description: "Please verify your email address by clicking on the link we just emailed to you.",
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Email verification" }),
        status === "verification-link-sent" && /* @__PURE__ */ jsx("div", { className: "mb-4 text-center text-sm font-medium text-green-600", children: "A new verification link has been sent to the email address you provided during registration." }),
        /* @__PURE__ */ jsx(Form, { ...send.form(), className: "space-y-6 text-center", children: ({ processing }) => /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs(Button, { disabled: processing, variant: "secondary", children: [
            processing && /* @__PURE__ */ jsx(Spinner, {}),
            "Resend verification email"
          ] }),
          /* @__PURE__ */ jsx(
            TextLink,
            {
              href: logout(),
              className: "mx-auto block text-sm",
              children: "Log out"
            }
          )
        ] }) })
      ]
    }
  );
}
export {
  VerifyEmail as default
};
