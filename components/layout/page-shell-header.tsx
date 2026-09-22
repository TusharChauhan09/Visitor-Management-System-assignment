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
    <FadeIn className="mb-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
      </header>
    </FadeIn>
  );
}
