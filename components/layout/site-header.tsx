import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  trailing?: React.ReactNode;
  className?: string;
};

export function SiteHeader({ trailing, className }: SiteHeaderProps) {
  return (
    <header className={cn("sticky top-0 z-20 px-4 pt-4 sm:px-6", className)}>
      <div className="flex min-h-14 flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-background/90 px-4 py-2 shadow-sm backdrop-blur-md sm:px-5">
        <Link
          href="/"
          className="min-w-0 truncate rounded-lg text-base font-semibold tracking-tight outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          Visitor Management
        </Link>
        <div className="flex items-center gap-2">
          {trailing}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
