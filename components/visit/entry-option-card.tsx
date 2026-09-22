"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EntryOptionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index?: number;
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
        "group flex items-start gap-5 rounded-xl border border-border bg-card p-5 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center",
        className
      )}
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/50"
        aria-hidden
      >
        <Icon className="size-5" strokeWidth={1.75} />
      </span>
      <div className="min-w-0 flex-1 space-y-1 pr-2">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
      </div>
      <ChevronRight
        className="size-5 shrink-0 text-muted-foreground/60 group-hover:text-foreground"
        aria-hidden
      />
    </Link>
  );
}
