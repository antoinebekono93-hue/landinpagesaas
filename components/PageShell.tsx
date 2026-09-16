import { Header } from "./Header";
import { Footer } from "./Footer";
import { Breadcrumbs, type CrumbItem } from "./Breadcrumbs";

interface PageShellProps {
  children: React.ReactNode;
  crumbs: CrumbItem[];
  location: string;
}

export function PageShell({ children, crumbs, location }: PageShellProps) {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Breadcrumbs items={crumbs} location={location} />
        {children}
      </main>
      <Footer />
    </div>
  );
}