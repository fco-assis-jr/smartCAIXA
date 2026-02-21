import { jsx, jsxs } from "react/jsx-runtime";
import { useState, useRef } from "react";
import { Combobox as Combobox$1 } from "@base-ui/react";
import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import { c as cn, B as Button } from "./button-DyLM49PM.js";
import { cva } from "class-variance-authority";
import { I as Input } from "./input-GB1MmPmu.js";
import { L as Label } from "./label-BeKFlcTZ.js";
function InputGroup({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "input-group",
      role: "group",
      className: cn(
        "group/input-group border-input dark:bg-input/30 relative flex w-full items-center rounded-md border shadow-xs transition-[color,box-shadow] outline-none",
        "h-9 min-w-0 has-[>textarea]:h-auto",
        // Variants based on alignment.
        "has-[>[data-align=inline-start]]:[&>input]:pl-2",
        "has-[>[data-align=inline-end]]:[&>input]:pr-2",
        "has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3",
        "has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3",
        // Focus state.
        "has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-ring/50 has-[[data-slot=input-group-control]:focus-visible]:ring-[3px]",
        // Error state.
        "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
        className
      ),
      ...props
    }
  );
}
const inputGroupAddonVariants = cva(
  "text-muted-foreground flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium select-none [&>svg:not([class*='size-'])]:size-4 [&>kbd]:rounded-[calc(var(--radius)-5px)] group-data-[disabled=true]/input-group:opacity-50",
  {
    variants: {
      align: {
        "inline-start": "order-first pl-3 has-[>button]:ml-[-0.45rem] has-[>kbd]:ml-[-0.35rem]",
        "inline-end": "order-last pr-3 has-[>button]:mr-[-0.45rem] has-[>kbd]:mr-[-0.35rem]",
        "block-start": "order-first w-full justify-start px-3 pt-3 [.border-b]:pb-3 group-has-[>input]/input-group:pt-2.5",
        "block-end": "order-last w-full justify-start px-3 pb-3 [.border-t]:pt-3 group-has-[>input]/input-group:pb-2.5"
      }
    },
    defaultVariants: {
      align: "inline-start"
    }
  }
);
function InputGroupAddon({
  className,
  align = "inline-start",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "group",
      "data-slot": "input-group-addon",
      "data-align": align,
      className: cn(inputGroupAddonVariants({ align }), className),
      onClick: (e) => {
        if (e.target.closest("button")) {
          return;
        }
        e.currentTarget.parentElement?.querySelector("input")?.focus();
      },
      ...props
    }
  );
}
const inputGroupButtonVariants = cva(
  "text-sm shadow-none flex gap-2 items-center",
  {
    variants: {
      size: {
        xs: "h-6 gap-1 px-2 rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-3.5 has-[>svg]:px-2",
        sm: "h-8 px-2.5 gap-1.5 rounded-md has-[>svg]:px-2.5",
        "icon-xs": "size-6 rounded-[calc(var(--radius)-5px)] p-0 has-[>svg]:p-0",
        "icon-sm": "size-8 p-0 has-[>svg]:p-0"
      }
    },
    defaultVariants: {
      size: "xs"
    }
  }
);
function InputGroupButton({
  className,
  type = "button",
  variant = "ghost",
  size = "xs",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Button,
    {
      type,
      "data-size": size,
      variant,
      className: cn(inputGroupButtonVariants({ size }), className),
      ...props
    }
  );
}
function InputGroupInput({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    Input,
    {
      "data-slot": "input-group-control",
      className: cn(
        "flex-1 rounded-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent",
        className
      ),
      ...props
    }
  );
}
const Combobox = Combobox$1.Root;
function ComboboxTrigger({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Combobox$1.Trigger,
    {
      "data-slot": "combobox-trigger",
      className: cn("[&_svg:not([class*='size-'])]:size-4", className),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(
          ChevronDownIcon,
          {
            "data-slot": "combobox-trigger-icon",
            className: "text-muted-foreground pointer-events-none size-4"
          }
        )
      ]
    }
  );
}
function ComboboxClear({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.Clear,
    {
      "data-slot": "combobox-clear",
      render: /* @__PURE__ */ jsx(InputGroupButton, { variant: "ghost", size: "icon-xs" }),
      className: cn(className),
      ...props,
      children: /* @__PURE__ */ jsx(XIcon, { className: "pointer-events-none" })
    }
  );
}
function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  ...props
}) {
  return /* @__PURE__ */ jsxs(InputGroup, { className: cn("w-auto", className), children: [
    /* @__PURE__ */ jsx(
      Combobox$1.Input,
      {
        render: /* @__PURE__ */ jsx(InputGroupInput, { disabled }),
        ...props
      }
    ),
    /* @__PURE__ */ jsxs(InputGroupAddon, { align: "inline-end", children: [
      showTrigger && /* @__PURE__ */ jsx(
        InputGroupButton,
        {
          size: "icon-xs",
          variant: "ghost",
          asChild: true,
          "data-slot": "input-group-button",
          className: "group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent",
          disabled,
          children: /* @__PURE__ */ jsx(ComboboxTrigger, {})
        }
      ),
      showClear && /* @__PURE__ */ jsx(ComboboxClear, { disabled })
    ] }),
    children
  ] });
}
function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  ...props
}) {
  return /* @__PURE__ */ jsx(Combobox$1.Portal, { children: /* @__PURE__ */ jsx(
    Combobox$1.Positioner,
    {
      side,
      sideOffset,
      align,
      alignOffset,
      anchor,
      className: "isolate z-50",
      children: /* @__PURE__ */ jsx(
        Combobox$1.Popup,
        {
          "data-slot": "combobox-content",
          "data-chips": !!anchor,
          className: cn(
            "bg-popover text-popover-foreground data-open:animate-in data-closed:animate-out data-closed:fade-out-0 data-open:fade-in-0 data-closed:zoom-out-95 data-open:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ring-foreground/10 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:border-input/30 group/combobox-content relative max-h-96 w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-md shadow-md ring-1 duration-100 data-[chips=true]:min-w-(--anchor-width) *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:shadow-none",
            className
          ),
          ...props
        }
      )
    }
  ) });
}
function ComboboxList({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.List,
    {
      "data-slot": "combobox-list",
      className: cn(
        "max-h-[min(calc(--spacing(96)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto p-1 data-empty:p-0",
        className
      ),
      ...props
    }
  );
}
function ComboboxItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    Combobox$1.Item,
    {
      "data-slot": "combobox-item",
      className: cn(
        "data-highlighted:bg-accent data-highlighted:text-accent-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(
          Combobox$1.ItemIndicator,
          {
            "data-slot": "combobox-item-indicator",
            render: /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-4 items-center justify-center" }),
            children: /* @__PURE__ */ jsx(CheckIcon, { className: "pointer-events-none size-4 pointer-coarse:size-5" })
          }
        )
      ]
    }
  );
}
function ComboboxEmpty({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    Combobox$1.Empty,
    {
      "data-slot": "combobox-empty",
      className: cn(
        "text-muted-foreground hidden w-full justify-center py-2 text-center text-sm group-data-empty/combobox-content:flex",
        className
      ),
      ...props
    }
  );
}
function GenericCombobox({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = "Selecione...",
  emptyMessage = "Nenhum item encontrado.",
  disabled = false
}) {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const validOptions = options.filter(
    (o) => o.value && o.label && o.value !== "null" && o.value !== ""
  );
  const filteredOptions = validOptions.filter(
    (option) => option.label.toLowerCase().includes(searchValue.toLowerCase()) || option.value.toLowerCase().includes(searchValue.toLowerCase())
  );
  const selectedOption = validOptions.find((o) => o.value === value);
  return /* @__PURE__ */ jsxs("div", { className: "space-y-2", children: [
    /* @__PURE__ */ jsx(Label, { htmlFor: id, children: label }),
    /* @__PURE__ */ jsxs(
      Combobox,
      {
        value,
        onValueChange: (values) => {
          const nextValue = Array.isArray(values) ? values[0] || "" : values || "";
          onChange(nextValue);
          setOpen(false);
          setSearchValue("");
          if (inputRef.current) {
            inputRef.current.blur();
          }
        },
        disabled,
        open,
        onOpenChange: setOpen,
        children: [
          /* @__PURE__ */ jsx(
            ComboboxInput,
            {
              id,
              ref: inputRef,
              placeholder: selectedOption ? selectedOption.label : placeholder,
              value: searchValue,
              onChange: (e) => setSearchValue(e.target.value),
              showClear: !!value,
              showTrigger: true,
              disabled
            }
          ),
          /* @__PURE__ */ jsx(ComboboxContent, { children: /* @__PURE__ */ jsxs(ComboboxList, { children: [
            filteredOptions.length === 0 && /* @__PURE__ */ jsx(ComboboxEmpty, { children: emptyMessage }),
            filteredOptions.map((option) => /* @__PURE__ */ jsx(ComboboxItem, { value: option.value, children: option.label }, option.value))
          ] }) })
        ]
      }
    )
  ] });
}
function FilialCombobox({
  filiais,
  value,
  onChange,
  disabled = false
}) {
  return /* @__PURE__ */ jsx(
    GenericCombobox,
    {
      id: "filial-combobox",
      label: "Filial",
      options: filiais,
      value,
      onChange,
      placeholder: "Selecione uma filial...",
      emptyMessage: "Nenhuma filial encontrada.",
      disabled
    }
  );
}
export {
  FilialCombobox as F,
  GenericCombobox as G
};
