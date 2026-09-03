"use client";

import { Bookmark } from "lucide-react";
import { useSaved } from "@/lib/use-saved";
import { cn } from "@/lib/utils";

export function SaveButton({ slug }: { slug: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={saved}
      className={cn(
        "inline-flex h-11 items-center gap-2 rounded-full border px-5 text-sm font-semibold transition",
        saved
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-foreground hover:border-accent/50 hover:text-accent",
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
      {saved ? "Saved" : "Save"}
    </button>
  );
}

export function SaveCardButton({ slug }: { slug: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(slug);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      aria-pressed={saved}
      aria-label={saved ? "Remove from saved" : "Save program"}
      className={cn(
        "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border shadow-sm transition active:scale-95",
        saved
          ? "border-accent bg-accent text-accent-foreground"
          : "border-border bg-card text-muted-foreground hover:border-accent/50 hover:text-accent",
      )}
    >
      <Bookmark className={cn("h-4 w-4", saved && "fill-current")} />
    </button>
  );
}
