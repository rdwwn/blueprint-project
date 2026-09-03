"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useInView } from "motion/react";
import { cn } from "@/lib/utils";

type Action =
  | "highlight"
  | "marker"
  | "underline"
  | "bracket"
  | "box"
  | "circle";

const SVG_NS = "http://www.w3.org/2000/svg";

type DrawOptions = {
  action: Action;
  color?: string;
  strokeWidth: number;
  animationDuration: number;
  iterations: number;
  padding: number;
};

function drawAnnotation(el: HTMLElement, o: DrawOptions) {
  const { width, height } = el.getBoundingClientRect();
  if (!width || !height) return;

  const stroke = o.color ?? "var(--accent)";
  const fill =
    o.color ?? "color-mix(in srgb, var(--accent) 24%, transparent)";

  const { padding, strokeWidth, animationDuration, iterations } = o;
  const x = padding;
  const y = padding;
  const w = width;
  const h = height;
  const r = Math.min(0.4 * h, 12);

  let d = "";
  let useFill = false;
  switch (o.action) {
    case "highlight":
    case "marker":
      useFill = true;
      d = `M ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} H ${x + w - r} Q ${x + w} ${y} ${x + w} ${y + r} V ${y + h - r} Q ${x + w} ${y + h} ${x + w - r} ${y + h} H ${x + r} Q ${x} ${y + h} ${x} ${y + h - r} Z`;
      break;
    case "underline":
      d = `M ${x} ${y + h + 2} Q ${x + w / 2} ${y + h + 6} ${x + w} ${y + h + 2}`;
      break;
    case "bracket":
      d = `M ${x} ${y - 2} V ${y + h + 2} H ${x + w}`;
      break;
    case "box":
      d = `M ${x} ${y} H ${x + w} V ${y + h} H ${x} Z`;
      break;
    case "circle":
      d = `M ${x + w / 2} ${y - 2} A ${w / 2} ${h / 2 + 4} 0 1 1 ${x + w / 2} ${y + h + 6} A ${w / 2} ${h / 2 + 4} 0 1 1 ${x + w / 2} ${y - 2}`;
      break;
  }

  const svg = document.createElementNS(SVG_NS, "svg");
  svg.setAttribute("width", String(w + padding * 2));
  svg.setAttribute("height", String(h + padding * 2));
  svg.style.position = "absolute";
  svg.style.left = `${-padding}px`;
  svg.style.top = `${-padding}px`;
  svg.style.pointerEvents = "none";
  svg.style.overflow = "visible";

  const make = (fillColor: string | null, draw: boolean) => {
    const p = document.createElementNS(SVG_NS, "path");
    p.setAttribute("d", d);
    p.setAttribute("fill", fillColor ?? "none");
    p.setAttribute("stroke", stroke);
    p.setAttribute("stroke-width", String(strokeWidth));
    p.setAttribute("stroke-linecap", "round");
    p.setAttribute("stroke-linejoin", "round");
    if (draw) {
      const total = p.getTotalLength();
      p.style.strokeDasharray = String(total);
      p.style.strokeDashoffset = String(total);
    }
    return p;
  };

  if (useFill) {
    // Soft tint fades in first…
    const fillPath = make(fill, false);
    fillPath.style.transition = "opacity 0.35s ease 0.1s";
    fillPath.style.opacity = "0";
    svg.appendChild(fillPath);
    requestAnimationFrame(() => {
      fillPath.style.opacity = "1";
    });
    // …then the marker outline draws twice for a sketchy feel.
    const strokePath = make(null, true);
    svg.appendChild(strokePath);
    requestAnimationFrame(() => {
      strokePath.animate(
        [
          { strokeDashoffset: strokePath.getTotalLength() },
          { strokeDashoffset: 0 },
        ],
        {
          duration: animationDuration,
          iterations,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );
    });
  } else {
    const p = make(null, true);
    svg.appendChild(p);
    requestAnimationFrame(() => {
      p.animate(
        [
          { strokeDashoffset: p.getTotalLength() },
          { strokeDashoffset: 0 },
        ],
        {
          duration: animationDuration,
          iterations,
          easing: "ease-in-out",
          fill: "forwards",
        },
      );
    });
  }

  el.appendChild(svg);
}

export function Highlighter({
  children,
  action = "highlight",
  color,
  strokeWidth = 2,
  animationDuration = 520,
  iterations = 2,
  padding = 4,
  className,
}: {
  children: ReactNode;
  action?: Action;
  color?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const el = ref.current;
    drawAnnotation(el, {
      action,
      color,
      strokeWidth,
      animationDuration,
      iterations,
      padding,
    });
    return () => {
      el.querySelectorAll("svg").forEach((s) => s.remove());
    };
  }, [inView, action, color, strokeWidth, animationDuration, iterations, padding]);

  return (
    <span ref={ref} className={cn("relative inline-block", className)}>
      {children}
    </span>
  );
}