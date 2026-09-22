"use client";

import { FadeIn } from "@/components/motion/primitives";

export function PageShellHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <FadeIn className="mb-4 shrink-0">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description ? (
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">{description}</p>
        ) : null}
      </header>
    </FadeIn>
  );
}
