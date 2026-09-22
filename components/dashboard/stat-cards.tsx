type StatCard = {
  label: string;
  value: number;
  hint?: string;
};

export function StatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid shrink-0 grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-lg border border-border bg-card sm:grid-cols-4 sm:divide-y-0 xl:grid-cols-5">
      {stats.map((stat) => (
        <div key={stat.label} className="px-3 py-2.5">
          <p className="text-[11px] text-muted-foreground">{stat.label}</p>
          <p className="text-xl font-semibold tabular-nums leading-tight text-foreground">
            {stat.value}
          </p>
          {stat.hint ? (
            <p className="text-[11px] text-muted-foreground">{stat.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
