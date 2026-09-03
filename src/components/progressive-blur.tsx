"use client";

import { cn } from "@/lib/utils";

export function ProgressiveBlur({
  className,
  intensity = 8,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none", className)}
      style={{
        backdropFilter: `blur(${intensity}px)`,
        WebkitBackdropFilter: `blur(${intensity}px)`,
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 30%, black 100%)",
      }}
    />
  );
}