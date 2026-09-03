"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function InteractiveGrid({
  className,
  width = 56,
  height = 56,
  cellClassName,
}: {
  className?: string;
  width?: number;
  height?: number;
  cellClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ row: number; col: number } | null>(
    null,
  );
  const rows = 14;
  const cols = 24;

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        setHovered(null);
        return;
      }
      setHovered({
        row: Math.max(0, Math.min(rows - 1, Math.floor(y / height))),
        col: Math.max(0, Math.min(cols - 1, Math.floor(x / width))),
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [height, width]);

  return (
    <div
      ref={wrapRef}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden
    >
      <svg className="h-full w-full">
        {Array.from({ length: rows }).map((_, row) =>
          Array.from({ length: cols }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={col * width}
              y={row * height}
              width={width}
              height={height}
              fill={
                hovered?.row === row && hovered?.col === col
                  ? "currentColor"
                  : "transparent"
              }
              fillOpacity={hovered?.row === row && hovered?.col === col ? 0.08 : 0}
              className={cn("stroke-current stroke-[0.5]", cellClassName)}
            />
          )),
        )}
      </svg>
    </div>
  );
}