import { jsx, jsxs } from "react/jsx-runtime";
import { Info, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { AlertDialog as AlertDialog$1 } from "radix-ui";
import { c as cn, B as Button } from "./button-DyLM49PM.js";
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialog$1.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialog$1.Content,
      {
        "data-slot": "alert-dialog-content",
        "data-size": size,
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 group/alert-dialog-content fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-6 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className
      ),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn(
        "text-lg font-semibold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2",
        className
      ),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialog$1.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  variant = "default",
  size = "default",
  ...props
}) {
  return /* @__PURE__ */ jsx(Button, { variant, size, asChild: true, children: /* @__PURE__ */ jsx(
    AlertDialog$1.Action,
    {
      "data-slot": "alert-dialog-action",
      className: cn(className),
      ...props
    }
  ) });
}
function CustomAlert({
  open,
  onClose,
  title,
  message,
  variant = "default"
}) {
  const getTitle = () => {
    if (title) return title;
    switch (variant) {
      case "error":
        return "Erro";
      case "warning":
        return "Atenção";
      case "success":
        return "Sucesso";
      default:
        return "Aviso";
    }
  };
  const getIcon = () => {
    switch (variant) {
      case "error":
        return /* @__PURE__ */ jsx(XCircle, { className: "h-6 w-6 text-red-600" });
      case "warning":
        return /* @__PURE__ */ jsx(AlertCircle, { className: "h-6 w-6 text-yellow-600" });
      case "success":
        return /* @__PURE__ */ jsx(CheckCircle2, { className: "h-6 w-6 text-green-600" });
      default:
        return /* @__PURE__ */ jsx(Info, { className: "h-6 w-6 text-blue-600" });
    }
  };
  const getIconBackgroundColor = () => {
    switch (variant) {
      case "error":
        return "bg-red-100";
      case "warning":
        return "bg-yellow-100";
      case "success":
        return "bg-green-100";
      default:
        return "bg-blue-100";
    }
  };
  return /* @__PURE__ */ jsx(AlertDialog, { open, onOpenChange: onClose, children: /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
    /* @__PURE__ */ jsx(AlertDialogHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsx("div", { className: `shrink-0 rounded-full p-2 ${getIconBackgroundColor()}`, children: getIcon() }),
      /* @__PURE__ */ jsxs("div", { className: "flex-1 pt-1", children: [
        /* @__PURE__ */ jsx(AlertDialogTitle, { className: "text-left", children: getTitle() }),
        /* @__PURE__ */ jsx(AlertDialogDescription, { className: "text-left mt-2", children: message })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(AlertDialogFooter, { children: /* @__PURE__ */ jsx(AlertDialogAction, { onClick: onClose, children: "OK" }) })
  ] }) });
}
export {
  CustomAlert as C
};
