import type { HTMLAttributes, ReactNode } from "react";

import { MercoHeader } from "./MercoHeader";

interface ShellProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function LaunchpadShell({
  className = "",
  children,
  ...rest
}: ShellProps) {
  return (
    <div
      className={`flex min-h-screen flex-col bg-surface text-white ${className}`}
      {...rest}
    >
      <MercoHeader />
      <main className="flex-1 grow">
        <div className="container-page py-6 sm:py-8 lg:py-10">{children}</div>
      </main>
    </div>
  );
}