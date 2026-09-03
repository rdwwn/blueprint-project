import { cn } from "@/lib/utils";

export function Logo({ className, theme = "light" }: { className?: string; theme?: "light" | "dark" }) {
  const isDark = theme === "dark";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src="/logo-icon.png"
        alt="Blueprint Project logo"
        className={cn(
          "h-8 w-8 shrink-0 rounded-lg object-contain",
          isDark && "brightness-0 invert",
        )}
      />
      <span className="flex flex-col leading-none">
        <span className={cn("text-[15px] font-semibold tracking-tight", isDark && "text-white")}>
          Blueprint<span className={cn("text-primary", isDark && "text-accent")}>Project</span>
        </span>
        <span className={cn(
          "text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground",
          isDark && "text-white/60",
        )}>
          Find your path
        </span>
      </span>
    </span>
  );
}
