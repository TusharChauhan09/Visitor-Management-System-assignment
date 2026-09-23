import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PageShell({
  title,
  description,
  backHref = "/",
  backLabel = "Back",
  children,
  wide,
  center,
  hideBack,
}: {
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
  wide?: boolean;
  center?: boolean;
  hideBack?: boolean;
}) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col bg-background">
      <SiteHeader
        trailing={
          hideBack ? undefined : (
            <Link
              href={backHref}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-2")}
            >
              <ArrowLeft className="size-4" aria-hidden />
              {backLabel}
            </Link>
          )
        }
      />
      <main
        className={cn(
          "mx-auto w-full flex-1 px-4 py-6 sm:px-6 sm:py-8",
          wide ? "max-w-6xl" : "max-w-3xl",
          center && "flex items-center justify-center"
        )}
      >
        {title ? (
          <header className="mb-4">
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
            ) : null}
          </header>
        ) : null}
        {children}
      </main>
    </div>
  );
}
