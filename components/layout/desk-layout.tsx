import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { cn } from "@/lib/utils";

type DeskLayoutProps = {
  children: React.ReactNode;
  trailing?: React.ReactNode;
  className?: string;
};

export function DeskLayout({ children, trailing, className }: DeskLayoutProps) {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <SiteHeader trailing={trailing} />
      <main
        className={cn(
          "mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-6 py-5",
          className
        )}
      >
        {children}
      </main>
    </div>
  );
}

export function DeskHomeLink() {
  return (
    <Link
      href="/"
      className="text-sm font-medium text-muted-foreground hover:text-foreground"
    >
      Desk
    </Link>
  );
}
