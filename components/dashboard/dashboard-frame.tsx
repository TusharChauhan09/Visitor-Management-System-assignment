"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MotionTabPanel } from "@/components/motion/primitives";
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
  tabs: DashboardTab[];
  defaultTab?: string;
  className?: string;
};

export function DashboardFrame({
  title,
  description,
  actions,
  tabs,
  defaultTab,
  className,
}: DashboardFrameProps) {
  const initial = defaultTab ?? tabs[0]?.value ?? "overview";

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col gap-5", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>

      <Tabs defaultValue={initial} className="flex min-h-0 flex-1 flex-col gap-4">
        <TabsList className="w-full justify-start overflow-x-auto sm:w-auto">
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
            className="mt-0 flex min-h-0 flex-1 flex-col data-[orientation=horizontal]:flex-1"
          >
            <MotionTabPanel className="flex min-h-0 flex-1 flex-col">
              <ScrollArea className="max-h-[calc(100vh-14rem)] min-h-[320px] pr-3">
                {tab.content}
              </ScrollArea>
            </MotionTabPanel>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
