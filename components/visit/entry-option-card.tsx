"use client";

import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

type EntryOptionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index?: number;
};

export function EntryOptionCard({
  href,
  title,
  description,
  icon: Icon,
  className,
  index = 0,
}: EntryOptionCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 + index * 0.07, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -2 }}
      className={className}
    >
      <Link href={href} className="block outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-xl">
        <Card className="group overflow-hidden bg-card/90 shadow-none transition-[box-shadow,ring-color] hover:ring-primary/25">
          <CardContent className="flex items-start gap-5 sm:items-center">
            <span
              className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              aria-hidden
            >
              <Icon className="size-5" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1 space-y-1 pr-2">
              <h2 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            </div>
            <ChevronRight
              className="size-5 shrink-0 text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
              aria-hidden
            />
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
