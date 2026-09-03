import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-icon.png"
      alt="Blueprint Project logo"
      className={cn("h-8 w-8 shrink-0 object-contain", className)}
    />
  );
}
