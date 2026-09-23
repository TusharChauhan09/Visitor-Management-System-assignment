"use client";

import { ClipboardList } from "lucide-react";
import { EntryOptionCard } from "@/components/visit/entry-option-card";

const PASS_QR_IMAGE =
  "https://res.cloudinary.com/du8ekvenq/image/upload/v1790132620/QR_Code_Example_aqxcmk.svg";

export function HomeEntryOptions() {
  return (
    <div className="flex flex-col gap-3">
      <EntryOptionCard
        href="/entry/new"
        title="New visitor entry"
        description="Register at the desk. Your host approves before you get a pass."
        icon={ClipboardList}
      />
      <EntryOptionCard
        href="/entry/scan"
        title="I have a pass"
        description="Scan your QR or enter your pass code."
        imageSrc={PASS_QR_IMAGE}
        imageAlt="Example visitor pass QR code"
      />
    </div>
  );
}
