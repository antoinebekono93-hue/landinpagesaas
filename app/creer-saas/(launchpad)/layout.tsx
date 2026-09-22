import type { ReactNode } from "react";

import { LaunchpadShell } from "@/components/launchpad/shell/LaunchpadShell";

export default function LaunchpadLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <LaunchpadShell>{children}</LaunchpadShell>;
}