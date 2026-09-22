import Link from "next/link";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteHeaderProps = {
  trailing?: React.ReactNode;
  className?: string;
};

export function SiteHeader({ trailing, className }: SiteHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-10 border-b border-border/70 bg-background/90 backdrop-blur-md",
        className
      )}
    >
      <div className="flex h-16 items-center justify-between gap-6 px-6 lg:h-[4.25rem] lg:px-12">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <span
            className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm"
            aria-hidden
          >
            <Shield className="size-4" strokeWidth={2.25} />
          </span>
          <span className="min-w-0 truncate text-base font-semibold tracking-tight lg:text-[1.05rem]">
            Visitor Management
          </span>
        </Link>
        {trailing}
      </div>
    </header>
  );
}
