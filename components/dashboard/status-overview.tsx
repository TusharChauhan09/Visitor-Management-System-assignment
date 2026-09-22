"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { visitStatusLabel } from "@/lib/visits/status";

export function StatusOverview({ statusCounts }: { statusCounts: Record<string, number> }) {
  const entries = Object.entries(statusCounts).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No visit activity recorded yet.</p>
    );
  }

  return (
    <Card className="bg-card/80 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Status breakdown</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {entries.map(([status, count]) => (
          <Badge key={status} variant="secondary" className="gap-1.5 px-3 py-1 text-sm font-normal">
            <span>{visitStatusLabel(status)}</span>
            <span className="font-semibold tabular-nums text-foreground">{count}</span>
          </Badge>
        ))}
      </CardContent>
    </Card>
  );
}
