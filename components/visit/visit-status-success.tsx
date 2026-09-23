import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type VisitStatusSuccessProps = {
  badge: string;
  title: string;
  description: string;
  className?: string;
};

export function VisitStatusSuccess({
  badge,
  title,
  description,
  className,
}: VisitStatusSuccessProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center border-b border-border px-2 pb-6 pt-2 text-center sm:pb-8",
        className
      )}
    >
      <div
        className="flex size-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        aria-hidden
      >
        <CheckCircle2 className="size-9" strokeWidth={2} />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
        {badge}
      </p>
      <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
