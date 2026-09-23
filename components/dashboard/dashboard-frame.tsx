"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type DashboardTab = {
  value: string;
  label: string;
  badge?: number;
  content: React.ReactNode;
};

type DashboardFrameProps = {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  leading?: React.ReactNode;
  tabs: DashboardTab[];
  defaultTab?: string;
  className?: string;
};

export function DashboardFrame({
  title,
  description,
  actions,
  leading,
  tabs,
  defaultTab,
  className,
}: DashboardFrameProps) {
  const initial = defaultTab ?? tabs[0]?.value ?? "overview";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-3", className)}>
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          {leading}
          <div className="min-w-0">
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="truncate text-sm text-muted-foreground">{description}</p>
          ) : null}
          </div>
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>

      <Tabs defaultValue={initial} className="flex min-h-0 flex-1 flex-col gap-3">
        <TabsList className="h-auto w-full max-w-full flex-wrap justify-start sm:w-fit">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2 px-3">
              {tab.label}
              {tab.badge != null && tab.badge > 0 ? (
                <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground tabular-nums">
                  {tab.badge}
                </span>
              ) : null}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="mt-0 flex min-h-0 flex-1 flex-col overflow-auto"
          >
            {tab.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
