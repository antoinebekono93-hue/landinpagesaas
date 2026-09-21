import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";

interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, "title" | "prefix"> {
  prefix?: ReactNode;
  status?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  footer?: ReactNode;
  className?: string;
  children?: ReactNode;
}

export function Card({
  prefix,
  status,
  title,
  description,
  footer,
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-line-soft bg-surface-2 p-5 transition-colors hover:border-line",
        className,
      ].join(" ")}
      {...rest}
    >
      {prefix || status ? (
        <div className="mb-3 flex items-center justify-between gap-3">
          {prefix ? <div className="flex items-center gap-2">{prefix}</div> : null}
          {status ? <div className="ml-auto">{status}</div> : null}
        </div>
      ) : null}
      {title ? <h3 className="mb-1 font-semibold tracking-tight text-foreground">{title}</h3> : null}
      {description ? <p className="text-sm leading-relaxed text-muted">{description}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
      {footer ? <div className="mt-4 border-t border-line-soft pt-3">{footer}</div> : null}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  className = "",
  ...rest
}: {
  href?: string;
  children: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return href ? (
    <a href={href} className={className} {...(rest as ButtonHTMLAttributes<HTMLAnchorElement>)}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} {...rest}>
      {children}
    </button>
  );
}