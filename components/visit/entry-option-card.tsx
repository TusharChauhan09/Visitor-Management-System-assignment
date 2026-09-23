"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EntryOptionCardProps = {
  href: string;
  title: string;
  description: string;
  icon?: LucideIcon;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
};

export function EntryOptionCard({
  href,
  title,
  description,
  icon: Icon,
  imageSrc,
  imageAlt = "",
  className,
}: EntryOptionCardProps) {
  const mediaClassName =
    "flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border";

  return (
    <Link
      href={href}
      className={cn(
        "group flex items-start gap-5 rounded-xl border border-border bg-card p-5 text-left outline-none transition-colors hover:bg-muted/40 focus-visible:ring-3 focus-visible:ring-ring/50 sm:items-center",
        className
      )}
    >
      {imageSrc ? (
        <span className={cn(mediaClassName, "bg-white p-1")}>
          {/* Cloudinary SVG; Next image optimization does not process SVG. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={imageAlt} className="size-full object-contain" />
        </span>
      ) : Icon ? (
        <span className={cn(mediaClassName, "bg-muted/50")} aria-hidden>
          <Icon className="size-5" strokeWidth={1.75} />
        </span>
      ) : null}
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
