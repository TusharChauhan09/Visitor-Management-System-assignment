"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PURPOSE_OPTIONS } from "@/lib/visits";

export function PurposeSelect({ id }: { id: string }) {
  const [choice, setChoice] = useState("");
  const [other, setOther] = useState("");
  const value = choice === "Other" ? other : choice;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>Purpose</Label>
      <select
        id={id}
        required
        value={choice}
        onChange={(event) => setChoice(event.target.value)}
        className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <option value="" disabled>
          Select a purpose
        </option>
        {PURPOSE_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {choice === "Other" ? (
        <Input
          name="purpose"
          required
          value={other}
          onChange={(event) => setOther(event.target.value)}
          placeholder="Type the purpose"
        />
      ) : (
        <input type="hidden" name="purpose" value={value} />
      )}
    </div>
  );
}
