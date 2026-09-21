import { createContext, useContext, useReducer } from "react";
import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type AccordionValue = string;

interface AccordionState {
  active: AccordionValue[];
}

type AccordionAction =
  | { type: "toggle"; value: AccordionValue }
  | { type: "set"; value: AccordionValue[] };

function accordionReducer(state: AccordionState, action: AccordionAction): AccordionState {
  switch (action.type) {
    case "toggle":
      return {
        active: state.active.includes(action.value)
          ? state.active.filter((v) => v !== action.value)
          : [...state.active, action.value],
      };
    case "set":
      return { active: action.value };
  }
}

interface AccordionContextValue {
  active: AccordionValue[];
  toggle: (value: AccordionValue) => void;
  direction: "ltr" | "rtl";
}

const AccordionContextImpl = createContext<AccordionContextValue | undefined>(undefined);

interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  values?: AccordionValue[];
  onValueChange?: (values: AccordionValue[]) => void;
  single?: boolean;
  collapsible?: boolean;
  defaultValue?: AccordionValue[];
  direction?: "ltr" | "rtl";
  children: ReactNode;
}

export function Accordion({
  values,
  onValueChange,
  single = false,
  collapsible = false,
  defaultValue = [],
  direction = "ltr",
  className = "",
  children,
  ...rest
}: AccordionProps) {
  const [state, dispatch] = useReducer(accordionReducer, { active: defaultValue });
  const active = values ?? state.active;
  const toggle = (value: AccordionValue) => {
    const next = active.includes(value)
      ? active.filter((v) => v !== value)
      : single
        ? collapsible && active.includes(value)
          ? []
          : [value]
        : [...active, value];
    dispatch({ type: "toggle", value });
    onValueChange?.(next);
  };
  return (
    <AccordionContextImpl.Provider
      value={{ active, toggle, direction }}
    >
      <div className={`divide-y divide-line-soft ${className}`} {...rest}>
        {children}
      </div>
    </AccordionContextImpl.Provider>
  );
}

function useAccordion() {
  const ctx = useContext(AccordionContextImpl);
  if (!ctx) throw new Error("useAccordion must be used within an Accordion");
  return ctx;
}

interface AccordionItemProps extends HTMLAttributes<HTMLDivElement> {
  value: AccordionValue;
  children: ReactNode;
}

export function AccordionItem({
  value,
  className = "",
  children,
  ...rest
}: AccordionItemProps) {
  const { active } = useAccordion();
  const open = active.includes(value);
  return (
    <div className={className} data-state={open ? "open" : "closed"} {...rest}>
      {children}
    </div>
  );
}

interface AccordionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function AccordionHeader({
  className = "",
  children,
  ...rest
}: AccordionHeaderProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`} {...rest}>
      {children}
    </div>
  );
}

interface AccordionTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  value: AccordionValue;
  children: ReactNode;
}

export function AccordionTrigger({
  value,
  className = "",
  children,
  ...rest
}: AccordionTriggerProps) {
  const { active, toggle, direction } = useAccordion();
  const open = active.includes(value);
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={`accordion-panel-${value}`}
      id={`accordion-trigger-${value}`}
      onClick={() => toggle(value)}
      className={`group flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm font-medium text-foreground transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 ${className}`}
      {...rest}
    >
      {children}
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${direction === "rtl" ? "rotate-180" : ""} group-aria-expanded:rotate-180`}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
}

interface AccordionContentProps extends HTMLAttributes<HTMLDivElement> {
  value: AccordionValue;
  children: ReactNode;
}

export function AccordionContent({
  value,
  className = "",
  children,
  ...rest
}: AccordionContentProps) {
  const { active } = useAccordion();
  const open = active.includes(value);
  return (
    <div
      id={`accordion-panel-${value}`}
      role="region"
      aria-labelledby={`accordion-trigger-${value}`}
      className={`${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"} grid transition-[grid-template-rows] duration-200 ${className}`}
      {...rest}
    >
      <div className="overflow-hidden">
        <div className="pb-4 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </div>
  );
}
