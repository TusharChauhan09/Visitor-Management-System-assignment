import { cn } from "@/lib/utils";

type AppCanvasProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "lobby";
};

export function AppCanvas({ children, className, variant = "default" }: AppCanvasProps) {
  return (
    <div
      className={cn(
        "relative flex min-h-full flex-1 flex-col",
        variant === "lobby" && "app-mesh-bg",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full bg-[var(--vms-glow-a)] opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[var(--vms-glow-b)] opacity-50 blur-3xl" />
      </div>
      <div className="relative flex min-h-full flex-1 flex-col">{children}</div>
    </div>
  );
}
