import { cn } from "@/lib/utils";

/**
 * Organic section divider used across the site. The fill color must match the
 * section this wave belongs to; the transparent area above the curve lets the
 * previous section show through for a seamless transition.
 *
 * The band is positioned flush against the section edge (translateY(-100%)
 * from the top, +100% from the bottom) so it never floats off the edge at
 * any breakpoint.
 */
export function Wave({
  fill,
  flip = false,
  className,
}: {
  fill: string;
  /** Render the wave for the bottom of a section (curve points down). */
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "wave-band",
        flip && "wave-band--flip",
        className,
      )}
    >
      <svg viewBox="0 0 1440 96" preserveAspectRatio="none">
        {/* Three smooth full waves across the width (alternating rounded
            crests and troughs) so the divider reads as a real wave rather
            than one gentle hill. */}
        <path
          d="M0,54 C80,54 160,86 240,86 C320,86 400,54 480,54 C560,54 640,86 720,86 C800,86 880,54 960,54 C1040,54 1120,86 1200,86 C1280,86 1360,54 1440,54 L1440,96 L0,96 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}