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
      <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
        {/* One big asymmetric crest, peak left of center, with a subtle
            second rise near the right edge so it reads as drawn rather
            than generated. */}
        <path
          d="M0,108 C280,108 460,12 780,12 C1010,12 1090,64 1210,64 C1300,64 1370,42 1440,44 L1440,120 L0,120 Z"
          fill={fill}
        />
      </svg>
    </div>
  );
}