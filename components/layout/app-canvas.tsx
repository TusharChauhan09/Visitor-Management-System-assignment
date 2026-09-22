import { cn } from "@/lib/utils";

type AppCanvasProps = {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "lobby";
};

export function AppCanvas({ children, className }: AppCanvasProps) {
  return (
    <div className={cn("relative flex min-h-full flex-1 flex-col bg-background", className)}>
      {children}
    </div>
  );
}
