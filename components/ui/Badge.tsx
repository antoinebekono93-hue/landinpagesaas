import type { HTMLAttributes, ReactNode } from "react";

export type BadgeVariant = "neutral" | "success" | "warning" | "danger" | "info" | "coral" | "saas";
type BadgeSize = "sm" | "md";

const variants: Record<BadgeVariant, string> = {
  neutral: "border-line-soft bg-surface-2 text-muted",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  info: "border-info/30 bg-info/10 text-info",
  coral: "border-coral/30 bg-coral/10 text-coral",
  saas: "border-saas/30 bg-saas/10 text-saas",
};

const sizes: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

const dots: Record<BadgeVariant, string> = {
  neutral: "bg-muted",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  info: "bg-info",
  coral: "bg-coral",
  saas: "bg-saas",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  children: ReactNode;
}

export function Badge({
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {dot ? (<span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${dots[variant]}`} />) : null}
      {children}
    </span>
  );
}
