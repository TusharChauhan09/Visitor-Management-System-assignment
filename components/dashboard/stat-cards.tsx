"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FadeInStagger, FadeInItem } from "@/components/motion/primitives";

type StatCard = {
  label: string;
  value: number;
  hint?: string;
};

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <FadeInStagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <FadeInItem key={stat.label}>
          <Card size="sm" className="bg-card/80 shadow-none backdrop-blur-sm">
            <CardContent className="pt-0">
              <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                {stat.value}
              </p>
              {stat.hint ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
              ) : null}
            </CardContent>
          </Card>
        </FadeInItem>
      ))}
    </FadeInStagger>
  );
}
