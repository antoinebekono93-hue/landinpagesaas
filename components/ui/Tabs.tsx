import { createContext, useContext, useState } from "react";
import type { HTMLAttributes, ReactNode } from "react";

interface TabsContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
  baseId: string;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  defaultValue: string;
  onChange?: (id: string) => void;
  children: ReactNode;
}

export function Tabs({ defaultValue, onChange, className = "", children, ...rest }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  const baseId = useId();
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab, baseId }}>
      <div className={className} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

function useId() {
  const ref = useRef(0);
  ref.current += 1;
  const prefix = "tabs";
  return `${prefix}-${ref.current}`;
}

import { useRef } from "react";

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsList({ className = "", children, ...rest }: TabsListProps) {
  return (
    <div
      role="tablist"
      aria-orientation="horizontal"
      className={`inline-flex items-center gap-1 rounded-full border border-line-soft bg-surface-2 p-1 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  children: ReactNode;
}

export function TabsTrigger({ value, className = "", children, ...rest }: TabsTriggerProps) {
  const { activeTab, setActiveTab, baseId } = useTabs();
  const id = `${baseId}-tab-${value}`;
  const selected = activeTab === value;
  return (
    <button
      id={id}
      type="button"
      role="tab"
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      data-state={selected ? "active" : "inactive"}
      onClick={() => setActiveTab(value)}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 disabled:cursor-not-allowed disabled:opacity-50 ${

        selected ? "bg-surface-3 text-white shadow-sm" : "text-muted hover:text-white"

      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, className = "", children, ...rest }: TabsContentProps) {
  const { activeTab, baseId } = useTabs();
  if (activeTab !== value) return null;
  return (
    <div id={`${baseId}-panel-${value}`} role="tabpanel" aria-labelledby={`${baseId}-tab-${value}`} className={className} {...rest}>
      {children}
    </div>
  );
}
