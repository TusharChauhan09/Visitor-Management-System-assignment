"use client";

import { useMemo, useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { formInputClassName, formListClassName, formListItemClassName } from "@/components/visit/form-styles";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type HostOption = {
  id: string;
  fullName: string;
  department: string;
};

export function HostSearchField({
  employees,
  id = "v-host",
}: {
  employees: HostOption[];
  id?: string;
}) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");
  const [open, setOpen] = useState(false);

  const selected = employees.find((e) => e.id === selectedId) ?? null;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employees;
    return employees.filter(
      (e) =>
        e.fullName.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q)
    );
  }, [employees, query]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={`${id}-search`}>Host</Label>
      <input type="hidden" name="hostId" value={selectedId} required />

      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          id={`${id}-search`}
          type="search"
          autoComplete="off"
          placeholder={selected ? `${selected.fullName} — ${selected.department}` : "Search host name or department"}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 150);
          }}
          className={cn(formInputClassName, "pl-9")}
        />
      </div>

      {selected ? (
        <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Check className="size-3.5 text-emerald-600 dark:text-emerald-400" aria-hidden />
          Hosting you: <span className="font-medium text-foreground">{selected.fullName}</span> (
          {selected.department})
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">Pick someone from the list below.</p>
      )}

      {open ? (
        <ul className={formListClassName} role="listbox" aria-label="Hosts">
          {filtered.length === 0 ? (
            <li className="px-3 py-4 text-center text-sm text-muted-foreground">No hosts match your search.</li>
          ) : (
            filtered.map((employee) => {
              const active = employee.id === selectedId;
              return (
                <li key={employee.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={cn(
                      formListItemClassName,
                      active && "bg-muted font-medium"
                    )}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setSelectedId(employee.id);
                      setQuery("");
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium text-foreground">{employee.fullName}</span>
                    <span className="text-xs text-muted-foreground">{employee.department}</span>
                  </button>
                </li>
              );
            })
          )}
        </ul>
      ) : null}

      {!open && !selectedId ? (
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-lg border border-dashed border-border bg-muted/20 px-3 text-sm text-muted-foreground"
          onClick={() => setOpen(true)}
        >
          Browse all hosts
          <ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden />
        </button>
      ) : null}
    </div>
  );
}
