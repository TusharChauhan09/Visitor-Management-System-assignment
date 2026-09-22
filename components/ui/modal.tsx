"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  wide?: boolean;
};

export function Modal({ open, title, onClose, children, wide }: ModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          onClose();
        }
      }}
    >
      <DialogContent
        showCloseButton
        className={cn(
          "max-h-[min(90vh,720px)] gap-0 overflow-hidden p-0 sm:max-w-lg",
          wide && "sm:max-w-2xl"
        )}
      >
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle className="text-lg font-semibold tracking-tight">{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto px-5 py-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
