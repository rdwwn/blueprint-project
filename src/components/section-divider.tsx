import { cn } from "@/lib/utils";

export function SectionDivider({
  label,
  index,
  className,
}: {
  label: string;
  index?: string;
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("relative", className)}>
      {/* Label row: drafting style with fades to the gradient seam */}
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-6">
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-primary/40" />
        <span className="whitespace-nowrap font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          {index ? `⌐ ${index} · ` : "⌐ "}
          {label}
        </span>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-primary/40" />
      </div>
      {/* Color-break seam: teal → primary gradient band */}
      <div className="mx-auto mt-2 h-[2px] w-[calc(100%-3rem)] max-w-[calc(72rem-3rem)] rounded-full bg-gradient-to-r from-primary/35 via-accent to-primary/35" />
    </div>
  );
}