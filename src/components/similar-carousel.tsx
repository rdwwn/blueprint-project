"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate, type PanInfo } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarClock,
  MapPin,
  MoveHorizontal,
} from "lucide-react";
import type { Opportunity } from "@/data/opportunities";
import { OrgFavicon } from "@/components/org-favicon";
import { slugify } from "@/lib/slug";

export function SimilarCarousel({
  programs,
  title = "Similar programs",
}: {
  programs: Opportunity[];
  title?: string;
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const [viewportW, setViewportW] = useState(0);
  const [index, setIndex] = useState(0);
  const x = useMotionValue(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const compute = () => setViewportW(el.clientWidth);
    compute();
    const observer = new ResizeObserver(compute);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const gap = 16;
  const maxIndex = Math.max(0, programs.length - 1);
  const offset = viewportW + gap;

  useEffect(() => {
    if (viewportW > 0) x.set(-index * offset);
  }, [index, offset, viewportW, x]);

  const goTo = useCallback(
    (nextIndex: number) => {
      const next = Math.max(0, Math.min(maxIndex, nextIndex));
      if (viewportW > 0) {
        animate(x, -next * offset, {
          type: "spring",
          stiffness: 260,
          damping: 30,
        });
      }
      setIndex(next);
    },
    [maxIndex, offset, viewportW, x],
  );

  const onDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) < 40 && Math.abs(info.velocity.x) < 250) {
      goTo(indexRef.current);
      return;
    }
    goTo(indexRef.current + (info.offset.x < 0 || info.velocity.x < -250 ? 1 : -1));
  };

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const target = event.target as HTMLElement;
      if (target.closest("input, textarea, select, a, button")) return;
      goTo(indexRef.current + (event.key === "ArrowRight" ? 1 : -1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  if (programs.length === 0) return null;

  return (
    <section className="mt-14 border-t border-border pt-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MoveHorizontal className="h-3.5 w-3.5 text-primary" />
            Drag or use the arrows to explore
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-1 font-mono text-[10px] tabular-nums text-muted-foreground">
            {index + 1} / {programs.length}
          </span>
          <button
            type="button"
            aria-label={`Previous ${title.toLowerCase()}`}
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            aria-label={`Next ${title.toLowerCase()}`}
            onClick={() => goTo(index + 1)}
            disabled={index >= maxIndex}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div ref={viewportRef} className="relative overflow-hidden">
        <motion.div
          className="flex cursor-grab items-stretch active:cursor-grabbing"
          style={{ x, gap, touchAction: "pan-y" }}
          drag="x"
          dragConstraints={{ left: -maxIndex * offset, right: 0 }}
          dragDirectionLock
          dragElastic={0.08}
          dragMomentum={false}
          onDragEnd={onDragEnd}
          role="region"
          aria-label={`${title} carousel`}
        >
          {programs.map((o) => (
            <div key={o.name} style={{ width: viewportW || "100%" }} className="shrink-0">
              <Link
                href={`/opportunity/${slugify(o.name)}`}
                draggable={false}
                className="group flex min-h-[270px] h-full flex-col rounded-2xl border border-border bg-card p-6 transition hover:border-primary/40 hover:shadow-[0_14px_30px_-20px_rgba(30,88,214,0.35)]"
              >
                <div className="mb-5 flex items-start gap-4">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/60">
                    <OrgFavicon host={o.host} name={o.org} size={32} />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold leading-snug">{o.name}</h3>
                    {o.org && <p className="mt-1 truncate text-sm text-muted-foreground">{o.org}</p>}
                  </div>
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  {(o.field || o.cat_norm) && (
                    <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                      {o.field || o.cat_norm}
                    </span>
                  )}
                  {o.category && o.category !== "Other" && (
                    <span className="text-[11px] font-medium text-muted-foreground">{o.category}</span>
                  )}
                </div>
                <p className="line-clamp-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {o.description || o.eligibility}
                </p>
                <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border pt-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{o.location || "Online"}</span>
                  {o.deadline && o.deadline !== "Varies" && <span className="inline-flex items-center gap-1"><CalendarClock className="h-3 w-3" />{o.deadline}</span>}
                  <span className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">View details <ArrowUpRight className="h-3.5 w-3.5" /></span>
                </div>
              </Link>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
