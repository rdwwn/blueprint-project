import { cn } from "@/lib/utils";

export function BlueprintGrid({
  className,
  width = 56,
  height = 56,
  squares = [
    [5, 3],
    [8, 6],
    [12, 9],
    [15, 4],
    [10, 12],
  ],
}: {
  className?: string;
  width?: number;
  height?: number;
  squares?: number[][];
}) {
  return (
    <svg
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-none stroke-current text-border",
        className,
      )}
    >
      <defs>
        <pattern
          id="blueprint-grid"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M ${height} 0 L 0 0 0 ${width}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
          />
        </pattern>
        <pattern
          id="blueprint-grid-dots"
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <circle cx={width / 2} cy={height / 2} r="1" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#blueprint-grid)" />
      <rect width="100%" height="100%" fill="url(#blueprint-grid-dots)" />
      {squares.map(([x, y], i) => (
        <rect
          key={i}
          x={x * width - width}
          y={y * height - height}
          width={width}
          height={height}
          fill="currentColor"
          fillOpacity="0.05"
          stroke="currentColor"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}