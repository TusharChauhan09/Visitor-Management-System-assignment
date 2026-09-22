import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

type PageShellProps = {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageShell({
  title,
  description,
  backHref = "/",
  backLabel = "Back",
  children,
  className,
}: PageShellProps) {
  return (
    <div className={cn("flex min-h-full flex-1 flex-col bg-background", className)}>
      <SiteHeader
        trailing={
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>
        }
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <aside
          className="border-b border-border px-6 py-8 lg:w-80 lg:shrink-0 lg:border-b-0 lg:border-r lg:px-12 lg:py-14 xl:w-96"
        >
          <h1 className="text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground lg:text-base">
              {description}
            </p>
          ) : null}
        </aside>

        <main className="flex-1 px-6 py-8 lg:px-12 lg:py-14">
          {children}
        </main>
      </div>
    </div>
  );
}
