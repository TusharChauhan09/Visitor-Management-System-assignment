import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EntryOptionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
};

export function EntryOptionCard({
  href,
  title,
  description,
  icon: Icon,
  className,
}: EntryOptionCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-5 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-[border-color,box-shadow] hover:border-foreground/15 hover:shadow-md focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center sm:p-6",
        className
      )}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border/80 bg-muted/50 text-foreground transition-colors group-hover:border-foreground/10 group-hover:bg-muted"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 space-y-1 pr-2">
        <h2 className="text-lg font-semibold tracking-tight text-card-foreground">
          {title}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
          {description}
        </p>
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground"
        aria-hidden
      />
    </Link>
  );
}
