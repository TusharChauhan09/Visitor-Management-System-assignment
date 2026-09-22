"use client";

import { ClipboardList, QrCode } from "lucide-react";
import { EntryOptionCard } from "@/components/visit/entry-option-card";

export function HomeEntryOptions() {
  return (
    <div className="flex flex-col gap-3">
      <EntryOptionCard
        href="/entry/new"
        title="New visitor entry"
        description="Register at the desk. Your host approves before you get a pass."
        icon={ClipboardList}
        index={0}
      />
      <EntryOptionCard
        href="/entry/scan"
        title="I have a pass"
        description="Scan your QR or enter your pass code."
        icon={QrCode}
        index={1}
      />
    </div>
  );
}
