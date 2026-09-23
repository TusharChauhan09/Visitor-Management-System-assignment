"use client";

import { useActionState, useState } from "react";
import { updateEmployeePhoto } from "@/app/actions/employee";
import { Button } from "@/components/ui/button";

export function ProfilePhoto({
  name,
  photoUrl,
}: {
  name: string;
  photoUrl: string | null;
}) {
  const [preview, setPreview] = useState("");
  const [state, formAction, pending] = useActionState(updateEmployeePhoto, {});
  const src = preview || photoUrl || "/default-avatar.svg";

  return (
    <form action={formAction} className="flex items-center gap-3">
      {/* eslint-disable-next-line @next/next/no-img-element -- preview data URLs and optional remote avatars */}
      <img
        src={src}
        alt={`${name} profile`}
        className="size-12 shrink-0 rounded-full border border-border object-cover"
      />
      <div className="min-w-0">
        <label className="inline-flex cursor-pointer text-xs font-medium text-muted-foreground underline-offset-4 hover:underline">
          {photoUrl ? "Change photo" : "Add photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                if (typeof reader.result === "string") setPreview(reader.result);
              };
              reader.readAsDataURL(file);
            }}
          />
        </label>
        {preview ? <input type="hidden" name="photoData" value={preview} /> : null}
        {state.error ? <p className="text-xs text-destructive">{state.error}</p> : null}
      </div>
      {preview ? (
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save"}
        </Button>
      ) : null}
    </form>
  );
}
