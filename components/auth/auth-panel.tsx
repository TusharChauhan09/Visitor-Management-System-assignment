import Link from "next/link";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const authInputClassName =
  "h-12 rounded-xl border-border/70 bg-muted/80 px-4 text-sm shadow-none placeholder:text-muted-foreground/80 focus-visible:border-ring focus-visible:bg-background";

export function AuthPanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "relative w-full max-w-[26rem] rounded-[1.75rem] border border-border bg-card px-5 py-5 shadow-xl shadow-black/10 sm:px-6 sm:py-6",
        className
      )}
    >
      <Link
        href="/"
        aria-label="Close and return to the desk"
        className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full border border-border bg-muted/70 text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <X className="size-4" />
      </Link>
      {children}
    </section>
  );
}
