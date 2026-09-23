"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { formInputClassName, formListClassName, formListItemClassName, formTriggerClassName } from "@/components/visit/form-styles";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { PURPOSE_OPTIONS } from "@/lib/visits";
import { cn } from "@/lib/utils";

export function PurposeSelect({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState("");
  const [other, setOther] = useState("");
  const value = choice === "Other" ? other.trim() : choice;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Purpose</Label>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          type="button"
          className={cn(formTriggerClassName, !choice && "text-muted-foreground")}
        >
          <span className="truncate">{choice || "Select a purpose"}</span>
          <ChevronsUpDown className="size-4 shrink-0 opacity-60" aria-hidden />
        </PopoverTrigger>
        <PopoverContent className="w-[var(--anchor-width)] min-w-[16rem] p-1" align="start">
          <ul className={cn(formListClassName, "max-h-60 border-0 bg-transparent p-0 shadow-none")}>
            {PURPOSE_OPTIONS.map((option) => {
              const active = choice === option;
              return (
                <li key={option}>
                  <button
                    type="button"
                    className={cn(
                      formListItemClassName,
                      "flex-row items-center justify-between",
                      active && "bg-muted"
                    )}
                    onClick={() => {
                      setChoice(option);
                      setOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {active ? (
                      <Check className="size-4 text-foreground" aria-hidden />
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>
        </PopoverContent>
      </Popover>

      {choice === "Other" ? (
        <Input
          name="purpose"
          required
          value={other}
          onChange={(event) => setOther(event.target.value)}
          placeholder="Describe your visit"
          className={formInputClassName}
        />
      ) : (
        <input type="hidden" name="purpose" value={value} required />
      )}
    </div>
  );
}
