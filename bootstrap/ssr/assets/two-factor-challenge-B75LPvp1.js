import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { Head, Form } from "@inertiajs/react";
import { OTPInput, OTPInputContext, REGEXP_ONLY_DIGITS } from "input-otp";
import * as React from "react";
import { useState, useMemo } from "react";
import { I as InputError } from "./input-error-D205dVHU.js";
import { c as cn, B as Button } from "./button-DyLM49PM.js";
import { I as Input } from "./input-GB1MmPmu.js";
import { Minus } from "lucide-react";
import { q as queryParams } from "./index-DF_fN02X.js";
import { A as AuthLayout } from "./auth-layout-BDKA2-wq.js";
import "class-variance-authority";
import "radix-ui";
import "clsx";
import "tailwind-merge";
import "./app-logo-icon-kpljnLMz.js";
const InputOTP = React.forwardRef(({ className, containerClassName, ...props }, ref) => /* @__PURE__ */ jsx(
  OTPInput,
  {
    ref,
    containerClassName: cn(
      "flex items-center gap-2 has-[:disabled]:opacity-50",
      containerClassName
    ),
    className: cn("disabled:cursor-not-allowed", className),
    ...props
  }
));
InputOTP.displayName = "InputOTP";
const InputOTPGroup = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex items-center", className), ...props }));
InputOTPGroup.displayName = "InputOTPGroup";
const InputOTPSlot = React.forwardRef(({ index, className, ...props }, ref) => {
  const inputOTPContext = React.useContext(OTPInputContext);
  const { char, hasFakeCaret, isActive } = inputOTPContext.slots[index];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: cn(
        "relative flex h-9 w-9 items-center justify-center border-y border-r border-input text-sm shadow-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md",
        isActive && "z-10 ring-1 ring-ring",
        className
      ),
      ...props,
      children: [
        char,
        hasFakeCaret && /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsx("div", { className: "h-4 w-px animate-caret-blink bg-foreground duration-1000" }) })
      ]
    }
  );
});
InputOTPSlot.displayName = "InputOTPSlot";
const InputOTPSeparator = React.forwardRef(({ ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, role: "separator", ...props, children: /* @__PURE__ */ jsx(Minus, {}) }));
InputOTPSeparator.displayName = "InputOTPSeparator";
const store = (options) => ({
  url: store.url(options),
  method: "post"
});
store.definition = {
  methods: ["post"],
  url: "/two-factor-challenge"
};
store.url = (options) => {
  return store.definition.url + queryParams(options);
};
store.post = (options) => ({
  url: store.url(options),
  method: "post"
});
const storeForm = (options) => ({
  action: store.url(options),
  method: "post"
});
storeForm.post = (options) => ({
  action: store.url(options),
  method: "post"
});
store.form = storeForm;
const login$1 = {
  store: Object.assign(store, store)
};
const login = (options) => ({
  url: login.url(options),
  method: "get"
});
login.definition = {
  methods: ["get", "head"],
  url: "/two-factor-challenge"
};
login.url = (options) => {
  return login.definition.url + queryParams(options);
};
login.get = (options) => ({
  url: login.url(options),
  method: "get"
});
login.head = (options) => ({
  url: login.url(options),
  method: "head"
});
const loginForm = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.get = (options) => ({
  action: login.url(options),
  method: "get"
});
loginForm.head = (options) => ({
  action: login.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
login.form = loginForm;
const enable = (options) => ({
  url: enable.url(options),
  method: "post"
});
enable.definition = {
  methods: ["post"],
  url: "/user/two-factor-authentication"
};
enable.url = (options) => {
  return enable.definition.url + queryParams(options);
};
enable.post = (options) => ({
  url: enable.url(options),
  method: "post"
});
const enableForm = (options) => ({
  action: enable.url(options),
  method: "post"
});
enableForm.post = (options) => ({
  action: enable.url(options),
  method: "post"
});
enable.form = enableForm;
const confirm = (options) => ({
  url: confirm.url(options),
  method: "post"
});
confirm.definition = {
  methods: ["post"],
  url: "/user/confirmed-two-factor-authentication"
};
confirm.url = (options) => {
  return confirm.definition.url + queryParams(options);
};
confirm.post = (options) => ({
  url: confirm.url(options),
  method: "post"
});
const confirmForm = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirmForm.post = (options) => ({
  action: confirm.url(options),
  method: "post"
});
confirm.form = confirmForm;
const disable = (options) => ({
  url: disable.url(options),
  method: "delete"
});
disable.definition = {
  methods: ["delete"],
  url: "/user/two-factor-authentication"
};
disable.url = (options) => {
  return disable.definition.url + queryParams(options);
};
disable.delete = (options) => ({
  url: disable.url(options),
  method: "delete"
});
const disableForm = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disableForm.delete = (options) => ({
  action: disable.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "DELETE",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "post"
});
disable.form = disableForm;
const qrCode = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-qr-code"
};
qrCode.url = (options) => {
  return qrCode.definition.url + queryParams(options);
};
qrCode.get = (options) => ({
  url: qrCode.url(options),
  method: "get"
});
qrCode.head = (options) => ({
  url: qrCode.url(options),
  method: "head"
});
const qrCodeForm = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.get = (options) => ({
  action: qrCode.url(options),
  method: "get"
});
qrCodeForm.head = (options) => ({
  action: qrCode.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
qrCode.form = qrCodeForm;
const secretKey = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-secret-key"
};
secretKey.url = (options) => {
  return secretKey.definition.url + queryParams(options);
};
secretKey.get = (options) => ({
  url: secretKey.url(options),
  method: "get"
});
secretKey.head = (options) => ({
  url: secretKey.url(options),
  method: "head"
});
const secretKeyForm = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.get = (options) => ({
  action: secretKey.url(options),
  method: "get"
});
secretKeyForm.head = (options) => ({
  action: secretKey.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
secretKey.form = secretKeyForm;
const recoveryCodes = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.definition = {
  methods: ["get", "head"],
  url: "/user/two-factor-recovery-codes"
};
recoveryCodes.url = (options) => {
  return recoveryCodes.definition.url + queryParams(options);
};
recoveryCodes.get = (options) => ({
  url: recoveryCodes.url(options),
  method: "get"
});
recoveryCodes.head = (options) => ({
  url: recoveryCodes.url(options),
  method: "head"
});
const recoveryCodesForm = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.get = (options) => ({
  action: recoveryCodes.url(options),
  method: "get"
});
recoveryCodesForm.head = (options) => ({
  action: recoveryCodes.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
recoveryCodes.form = recoveryCodesForm;
const regenerateRecoveryCodes = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.definition = {
  methods: ["post"],
  url: "/user/two-factor-recovery-codes"
};
regenerateRecoveryCodes.url = (options) => {
  return regenerateRecoveryCodes.definition.url + queryParams(options);
};
regenerateRecoveryCodes.post = (options) => ({
  url: regenerateRecoveryCodes.url(options),
  method: "post"
});
const regenerateRecoveryCodesForm = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodesForm.post = (options) => ({
  action: regenerateRecoveryCodes.url(options),
  method: "post"
});
regenerateRecoveryCodes.form = regenerateRecoveryCodesForm;
({
  login: Object.assign(login, login$1),
  enable: Object.assign(enable, enable),
  confirm: Object.assign(confirm, confirm),
  disable: Object.assign(disable, disable),
  qrCode: Object.assign(qrCode, qrCode),
  secretKey: Object.assign(secretKey, secretKey),
  recoveryCodes: Object.assign(recoveryCodes, recoveryCodes),
  regenerateRecoveryCodes: Object.assign(regenerateRecoveryCodes, regenerateRecoveryCodes)
});
const OTP_MAX_LENGTH = 6;
function TwoFactorChallenge() {
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [code, setCode] = useState("");
  const authConfigContent = useMemo(() => {
    if (showRecoveryInput) {
      return {
        title: "Recovery Code",
        description: "Please confirm access to your account by entering one of your emergency recovery codes.",
        toggleText: "login using an authentication code"
      };
    }
    return {
      title: "Authentication Code",
      description: "Enter the authentication code provided by your authenticator application.",
      toggleText: "login using a recovery code"
    };
  }, [showRecoveryInput]);
  const toggleRecoveryMode = (clearErrors) => {
    setShowRecoveryInput(!showRecoveryInput);
    clearErrors();
    setCode("");
  };
  return /* @__PURE__ */ jsxs(
    AuthLayout,
    {
      title: authConfigContent.title,
      description: authConfigContent.description,
      children: [
        /* @__PURE__ */ jsx(Head, { title: "Two-Factor Authentication" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-6", children: /* @__PURE__ */ jsx(
          Form,
          {
            ...store.form(),
            className: "space-y-4",
            resetOnError: true,
            resetOnSuccess: !showRecoveryInput,
            children: ({ errors, processing, clearErrors }) => /* @__PURE__ */ jsxs(Fragment, { children: [
              showRecoveryInput ? /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  Input,
                  {
                    name: "recovery_code",
                    type: "text",
                    placeholder: "Enter recovery code",
                    autoFocus: showRecoveryInput,
                    required: true
                  }
                ),
                /* @__PURE__ */ jsx(
                  InputError,
                  {
                    message: errors.recovery_code
                  }
                )
              ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center space-y-3 text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "flex w-full items-center justify-center", children: /* @__PURE__ */ jsx(
                  InputOTP,
                  {
                    name: "code",
                    maxLength: OTP_MAX_LENGTH,
                    value: code,
                    onChange: (value) => setCode(value),
                    disabled: processing,
                    pattern: REGEXP_ONLY_DIGITS,
                    children: /* @__PURE__ */ jsx(InputOTPGroup, { children: Array.from(
                      { length: OTP_MAX_LENGTH },
                      (_, index) => /* @__PURE__ */ jsx(
                        InputOTPSlot,
                        {
                          index
                        },
                        index
                      )
                    ) })
                  }
                ) }),
                /* @__PURE__ */ jsx(InputError, { message: errors.code })
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  type: "submit",
                  className: "w-full",
                  disabled: processing,
                  children: "Continue"
                }
              ),
              /* @__PURE__ */ jsxs("div", { className: "text-center text-sm text-muted-foreground", children: [
                /* @__PURE__ */ jsx("span", { children: "or you can " }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "cursor-pointer text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
                    onClick: () => toggleRecoveryMode(clearErrors),
                    children: authConfigContent.toggleText
                  }
                )
              ] })
            ] })
          }
        ) })
      ]
    }
  );
}
export {
  TwoFactorChallenge as default
};
