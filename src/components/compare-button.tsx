"use client";

import { Scale } from "lucide-react";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { useCompare } from "@/lib/use-compare";

export function CompareButton({ name }: { name: string }) {
  const { isComparing, toggle } = useCompare();
  const active = isComparing(slugify(name));
  return (
    <button
      type="button"
      onClick={() => toggle(slugify(name))}
      aria-pressed={active}
      className={cn(
        "inline-flex h-14 items-center justify-center gap-2 rounded-xl border px-5 text-sm font-semibold transition sm:px-6",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      <Scale className="h-4 w-4" />
      {active ? "Comparing" : "Compare"}
    </button>
  );
}