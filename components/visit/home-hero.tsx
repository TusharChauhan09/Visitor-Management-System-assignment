"use client";

import { FadeIn } from "@/components/motion/primitives";

export function HomeHero() {
  return (
    <FadeIn className="mb-10 space-y-3">
      <p className="text-sm font-medium text-primary">Front desk</p>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        Check in for your visit
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
        Register as a walk-in guest or scan the QR code from your host&apos;s approval email.
      </p>
    </FadeIn>
  );
}
