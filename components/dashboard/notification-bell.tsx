"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

type NotificationBellProps = {
  count: number;
  onClick: () => void;
  label: string;
};

export function NotificationBell({ count, onClick, label }: NotificationBellProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="relative"
      onClick={onClick}
      aria-label={label}
    >
      <Bell className="size-4" />
      {count > 0 ? (
        <span
          className="absolute -right-0.5 -top-0.5 flex size-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold leading-none text-white"
          aria-hidden
        >
          {count > 9 ? "9+" : count}
        </span>
      ) : null}
    </Button>
  );
}
