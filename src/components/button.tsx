import Link from "next/link";
import { cn } from "@/lib/utils";

type ButtonProps = {
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
};

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

const base =
  "group/btn relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-primary active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60";

const variants = {
  primary: cn(
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(18,39,74,0.2)] hover:bg-primary/95 hover:shadow-[0_8px_24px_-8px_color-mix(in_srgb,var(--primary)_55%,transparent)]",
  ),
  outline: cn(
    "border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary",
  ),
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
};

export function Button({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  onClick,
}: ButtonProps) {
  const classes = cn(base, sizes[size], variants[variant], className);

  if (href) {
    return (
      <Link href={href} onClick={onClick} className={classes}>
        {variant === "primary" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover/btn:left-full group-hover/btn:opacity-100"
          />
        )}
        {variant === "outline" && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] [background-size:14px_14px]"
          />
        )}
        <span className="relative">{children}</span>
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes}>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/25 opacity-0 transition-all duration-500 group-hover/btn:left-full group-hover/btn:opacity-100"
        />
      )}
      {variant === "outline" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/btn:opacity-100 [background-image:linear-gradient(to_right,color-mix(in_srgb,var(--primary)_8%,transparent)_1px,transparent_1px)] [background-size:14px_14px]"
        />
      )}
      <span className="relative">{children}</span>
    </button>
  );
}