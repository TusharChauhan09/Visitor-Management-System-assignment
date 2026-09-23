"use client";

import { useMemo, useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseLocal(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
}

function timeValue(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function combine(date: Date, time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  const next = new Date(date);
  next.setHours(hours || 0, minutes || 0, 0, 0);
  return toValue(next);
}

export function defaultVisitFrom() {
  const d = new Date();
  d.setMinutes(0, 0, 0);
  return toValue(d);
}

export function defaultVisitTo() {
  const d = new Date();
  d.setHours(d.getHours() + 2, 0, 0, 0);
  return toValue(d);
}

export function DateTimeField({
  id,
  name,
  label,
  defaultValue,
}: {
  id: string;
  name: string;
  label: string;
  defaultValue: string;
}) {
  const initial = parseLocal(defaultValue);
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(initial);
  const [time, setTime] = useState(timeValue(initial));
  const value = useMemo(() => combine(date, time), [date, time]);

  const labelText = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parseLocal(value));

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input type="hidden" name={name} value={value} />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          className={cn(
            "flex h-10 w-full items-center justify-start gap-2 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          )}
        >
          <CalendarIcon className="size-4 text-muted-foreground" />
          {labelText}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-3" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(next) => {
              if (next) setDate(next);
            }}
          />
          <label className="mt-2 flex items-center justify-between gap-3 border-t border-border px-1 pt-3 text-sm">
            Time
            <input
              type="time"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              className="h-9 rounded-lg border border-input bg-background px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <Button type="button" className="mt-3 w-full" onClick={() => setOpen(false)}>
            Use this time
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export function DatePicker({
  value,
  onChange,
  label = "Date",
}: {
  value: Date;
  onChange: (date: Date) => void;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const labelText = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        aria-label={label}
        className="inline-flex h-8 items-center gap-2 rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <CalendarIcon className="size-3.5 text-muted-foreground" />
        {labelText}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-2" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(next) => {
            if (!next) return;
            onChange(next);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
