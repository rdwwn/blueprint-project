"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function OrgFavicon({
  host,
  name,
  size = 20,
  className,
}: {
  host?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const letter = (name ?? "").trim().charAt(0).toUpperCase() || "";

  if (host && !failed) {
    const src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=256`;
    return (
      <img
        src={src}
        alt=""
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        className={cn("inline-block shrink-0 rounded-md bg-background object-contain", className)}
        style={{ imageRendering: "auto" }}
        onError={() => setFailed(true)}
      />
    );
  }

  if (!letter) return null;

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md bg-primary/10 font-semibold text-primary",
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.45) }}
    >
      {letter}
    </span>
  );
}
