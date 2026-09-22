type StatCard = {
  label: string;
  value: number;
  hint?: string;
};

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-border bg-muted/20 px-4 py-3"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
            {stat.value}
          </p>
          {stat.hint ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{stat.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
