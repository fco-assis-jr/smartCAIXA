import { jsx, jsxs } from "react/jsx-runtime";
import { Link, Head } from "@inertiajs/react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useSyncExternalStore, useMemo, useCallback } from "react";
import { c as cn, B as Button, t as toUrl } from "./button-DyLM49PM.js";
import { H as Heading } from "./heading-DgovwZou.js";
import { A as AppLayout } from "./app-layout-ap7OHHL_.js";
import { S as Separator } from "./separator-Fi-6UxR6.js";
import { u as useCurrentUrl } from "./app-sidebar-layout-DdSWXqY8.js";
import { q as queryParams } from "./index-DF_fN02X.js";
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
import "./app-logo-icon-kpljnLMz.js";
const listeners = /* @__PURE__ */ new Set();
let currentAppearance = "system";
const prefersDark = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
};
const setCookie = (name, value, days = 365) => {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value};path=/;max-age=${maxAge};SameSite=Lax`;
};
const isDarkMode = (appearance) => {
  return appearance === "dark" || appearance === "system" && prefersDark();
};
const applyTheme = (appearance) => {
  if (typeof document === "undefined") return;
  const isDark = isDarkMode(appearance);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.style.colorScheme = isDark ? "dark" : "light";
};
const subscribe = (callback) => {
  listeners.add(callback);
  return () => listeners.delete(callback);
};
const notify = () => listeners.forEach((listener) => listener());
function useAppearance() {
  const appearance = useSyncExternalStore(
    subscribe,
    () => currentAppearance,
    () => "system"
  );
  const resolvedAppearance = useMemo(
    () => isDarkMode(appearance) ? "dark" : "light",
    [appearance]
  );
  const updateAppearance = useCallback((mode) => {
    currentAppearance = mode;
    localStorage.setItem("appearance", mode);
    setCookie("appearance", mode);
    applyTheme(mode);
    notify();
  }, []);
  return { appearance, resolvedAppearance, updateAppearance };
}
function AppearanceToggleTab({
  className = "",
  ...props
}) {
  const { appearance, updateAppearance } = useAppearance();
  const tabs = [
    { value: "light", icon: Sun, label: "Light" },
    { value: "dark", icon: Moon, label: "Dark" },
    { value: "system", icon: Monitor, label: "System" }
  ];
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: cn(
        "inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800",
        className
      ),
      ...props,
      children: tabs.map(({ value, icon: Icon, label }) => /* @__PURE__ */ jsxs(
        "button",
        {
          onClick: () => updateAppearance(value),
          className: cn(
            "flex items-center rounded-md px-3.5 py-1.5 transition-colors",
            appearance === value ? "bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100" : "text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60"
          ),
          children: [
            /* @__PURE__ */ jsx(Icon, { className: "-ml-1 h-4 w-4" }),
            /* @__PURE__ */ jsx("span", { className: "ml-1.5 text-sm", children: label })
          ]
        },
        value
      ))
    }
  );
}
const sidebarNavItems = [
  {
    title: "Appearance",
    href: "/smartcaixa/settings/appearance",
    icon: null
  }
];
function SettingsLayout({ children }) {
  const { isCurrentUrl } = useCurrentUrl();
  if (typeof window === "undefined") {
    return null;
  }
  return /* @__PURE__ */ jsxs("div", { className: "px-4 py-6", children: [
    /* @__PURE__ */ jsx(
      Heading,
      {
        title: "Settings",
        description: "Manage your profile and account settings"
      }
    ),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col lg:flex-row lg:space-x-12", children: [
      /* @__PURE__ */ jsx("aside", { className: "w-full max-w-xl lg:w-48", children: /* @__PURE__ */ jsx(
        "nav",
        {
          className: "flex flex-col space-y-1 space-x-0",
          "aria-label": "Settings",
          children: sidebarNavItems.map((item, index) => {
            const href = item.href || "/smartcaixa/settings/appearance";
            return /* @__PURE__ */ jsx(
              Button,
              {
                size: "sm",
                variant: "ghost",
                asChild: true,
                className: cn("w-full justify-start", {
                  "bg-muted": isCurrentUrl(href)
                }),
                children: /* @__PURE__ */ jsxs(Link, { href, children: [
                  item.icon && /* @__PURE__ */ jsx(item.icon, { className: "h-4 w-4" }),
                  item.title
                ] })
              },
              `${toUrl(href)}-${index}`
            );
          })
        }
      ) }),
      /* @__PURE__ */ jsx(Separator, { className: "my-6 lg:hidden" }),
      /* @__PURE__ */ jsx("div", { className: "flex-1 md:max-w-2xl", children: /* @__PURE__ */ jsx("section", { className: "max-w-xl space-y-12", children }) })
    ] })
  ] });
}
const edit = (options) => ({
  url: edit.url(options),
  method: "get"
});
edit.definition = {
  methods: ["get", "head"],
  url: "/smartcaixa/settings/appearance"
};
edit.url = (options) => {
  return edit.definition.url + queryParams(options);
};
edit.get = (options) => ({
  url: edit.url(options),
  method: "get"
});
edit.head = (options) => ({
  url: edit.url(options),
  method: "head"
});
const editForm = (options) => ({
  action: edit.url(options),
  method: "get"
});
editForm.get = (options) => ({
  action: edit.url(options),
  method: "get"
});
editForm.head = (options) => ({
  action: edit.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...options?.query ?? options?.mergeQuery ?? {}
    }
  }),
  method: "get"
});
edit.form = editForm;
({
  edit: Object.assign(edit, edit)
});
const breadcrumbs = [
  {
    title: "Appearance settings",
    href: edit().url
  }
];
function Appearance() {
  return /* @__PURE__ */ jsxs(AppLayout, { breadcrumbs, children: [
    /* @__PURE__ */ jsx(Head, { title: "Appearance settings" }),
    /* @__PURE__ */ jsx("h1", { className: "sr-only", children: "Appearance Settings" }),
    /* @__PURE__ */ jsx(SettingsLayout, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsx(
        Heading,
        {
          variant: "small",
          title: "Appearance settings",
          description: "Update your account's appearance settings"
        }
      ),
      /* @__PURE__ */ jsx(AppearanceToggleTab, {})
    ] }) })
  ] });
}
export {
  Appearance as default
};
