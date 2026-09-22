"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useRef,
  useState,
} from "react";
import type { ReactNode } from "react";

interface TabItem {
  key: string;
  label: string;
  advanced: boolean;
  content: ReactNode;
}

export function ProductTabContent({
  children,
}: {
  label: string;
  advanced?: boolean;
  children: ReactNode;
}) {
  return <>{children}</>;
}

function collectTabs(children: ReactNode): TabItem[] {
  return Children.toArray(children)
    .filter(isValidElement)
    .map((child, index) => {
      const props = (child as React.ReactElement<{
        label?: string;
        advanced?: boolean;
      }>).props;
      return {
        key: String(index),
        label: props.label ?? `Onglet ${index + 1}`,
        advanced: Boolean(props.advanced),
        content: child,
      };
    });
}

export function ProductTabs({ children }: { children: ReactNode }) {
  const tabs = collectTabs(children);
  const primary = tabs.filter((tab) => !tab.advanced);
  const advanced = tabs.filter((tab) => tab.advanced);
  const [activeKey, setActiveKey] = useState<string>(primary[0]?.key ?? "");
  const [plusOpen, setPlusOpen] = useState(false);
  const plusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!plusOpen) return;
    function onPointerDown(event: MouseEvent | TouchEvent) {
      if (!plusRef.current?.contains(event.target as Node)) {
        setPlusOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [plusOpen]);

  useEffect(() => {
    if (plusOpen) {
      const onKey = (event: KeyboardEvent) => {
        if (event.key === "Escape") {
          setPlusOpen(false);
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }
  }, [plusOpen]);

  const active = tabs.find((tab) => tab.key === activeKey) ?? primary[0];
  const tabList = [...primary, ...(active.advanced ? [active] : [])];

  function onTabKeyDown(event: React.KeyboardEvent, index: number) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = (index + delta + tabList.length) % tabList.length;
    setActiveKey(tabList[next].key);
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Informations du produit"
        className="flex flex-wrap items-center gap-1.5"
      >
        {tabList.map((tab, index) => {
          const selected = tab.key === active.key;
          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={selected}
              aria-controls={`panel-${tab.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveKey(tab.key)}
              onKeyDown={(event) => onTabKeyDown(event, index)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selected
                  ? "border-accent-soft bg-accent/15 text-accent-soft"
                  : "border-line-soft text-slate-300 hover:border-accent-soft hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          );
        })}

        {advanced.length > 0 ? (
          <div ref={plusRef} className="relative">
            <button
              type="button"
              role="tab"
              aria-selected={active.advanced}
              aria-controls={`panel-${active.key}`}
              aria-haspopup="menu"
              aria-expanded={plusOpen}
              onClick={() => setPlusOpen((open) => !open)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                active.advanced
                  ? "border-accent-soft bg-accent/15 text-accent-soft"
                  : "border-line-soft text-slate-300 hover:border-accent-soft hover:text-white"
              }`}
            >
              {active.advanced ? active.label : "Plus"}
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className={`h-3.5 w-3.5 transition-transform ${
                  plusOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {plusOpen ? (
              <div
                role="menu"
                aria-label="Informations avancées"
                className="absolute left-0 top-full z-20 mt-2 w-56 rounded-xl border border-line bg-surface p-2 shadow-2xl shadow-black/40"
              >
                {advanced.map((tab) => {
                  const selected = tab.key === active.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="menuitem"
                      aria-current={selected ? "true" : undefined}
                      onClick={() => {
                        setActiveKey(tab.key);
                        setPlusOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-slate-200 transition-colors hover:bg-surface-2 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral/50"
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <div
        role="tabpanel"
        id={`panel-${active.key}`}
        aria-labelledby={`tab-${active.key}`}
        className="mt-6"
      >
        {active.content}
      </div>
    </div>
  );
}