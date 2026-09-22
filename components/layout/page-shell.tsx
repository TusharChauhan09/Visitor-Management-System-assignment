import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AppCanvas } from "@/components/layout/app-canvas";
import { SiteHeader } from "@/components/layout/site-header";
import { PageShellHeader } from "@/components/layout/page-shell-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageShellProps = {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  className?: string;
  wide?: boolean;
};

export function PageShell({
  title,
  description,
  backHref = "/",
  backLabel = "Back",
  children,
  className,
  wide,
}: PageShellProps) {
  return (
    <AppCanvas variant="lobby" className={className}>
      <SiteHeader
        trailing={
          <Link
            href={backHref}
            className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
          >
            <ArrowLeft className="size-4" aria-hidden />
            {backLabel}
          </Link>
        }
      />

      <main
        className={cn(
          "mx-auto w-full flex-1 px-6 py-8 lg:py-10",
          wide ? "max-w-4xl" : "max-w-3xl"
        )}
      >
        {title ? (
          <PageShellHeader title={title} description={description} />
        ) : null}
        {children}
      </main>
    </AppCanvas>
  );
}
