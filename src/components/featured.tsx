"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, animate } from "motion/react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  MapPin,
} from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { OrgFavicon } from "@/components/org-favicon";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

const FEATURED_NAMES = [
  "NASA OSTEM High School Internship",
  "FIRST Robotics Competition (FRC)",
  "Wharton Global High School Investment Competition",
  "NIH Summer Internship Program (HS-SIP)",
  "U.S. Senate Youth Program (USSYP)",
  "Dow Jones News Fund Summer High School Journalism Workshops",
];

const SLIDE_IMAGES = [
  "photo-1451187580459-43490279c0fa",
  "photo-1485827404703-89b55fcc595e",
  "photo-1563986768609-322da13575f3",
  "photo-1579154204601-01588f351e67",
  "photo-1541872703-74c5e44368f9",
  "photo-1504711434969-e33886168f5c",
];

// Curated, on-topic Unsplash photos keyed by PROGRAM (not field)
// featured programs share a field (e.g. two are CS & Engineering), so keying
// by field produced duplicate imagery. Each program gets its own photo.
const PROGRAM_IMAGES: Record<string, string> = {
  "NASA OSTEM High School Internship": "photo-1451187580459-43490279c0fa",
  "FIRST Robotics Competition (FRC)": "photo-1485827404703-89b55fcc595e",
  "Wharton Global High School Investment Competition":
    "photo-1563986768609-322da13575f3",
  "NIH Summer Internship Program (HS-SIP)": "photo-1579154204601-01588f351e67",
  "U.S. Senate Youth Program (USSYP)": "photo-1541872703-74c5e44368f9",
  "Dow Jones News Fund Summer High School Journalism Workshops":
    "photo-1504711434969-e33886168f5c",
};

// Field-matched fallback used only if a program isn't in the map above.
const FIELD_IMAGES: Record<string, string> = {
  "Space, Earth & Environment": "photo-1451187580459-43490279c0fa",
  "CS & Engineering": "photo-1485827404703-89b55fcc595e",
  "Business & Finance": "photo-1563986768609-322da13575f3",
  "Medicine & Health": "photo-1579154204601-01588f351e67",
  "Law, Politics & Public": "photo-1541872703-74c5e44368f9",
  "Journalism & Media": "photo-1504711434969-e33886168f5c",
};

const IMG_URL = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`;

const FIELD_STYLES: Record<string, string> = {
  "Space, Earth & Environment": "bg-primary/10 text-primary",
  "CS & Engineering": "bg-primary/10 text-primary",
  "Business & Finance": "bg-success/10 text-success",
  "Medicine & Health": "bg-danger/10 text-danger",
  "Law, Politics & Public": "bg-warning/10 text-warning",
  "Journalism & Media": "bg-accent/10 text-accent",
};

export function Featured() {
  const featured = FEATURED_NAMES.map(
    (name) => OPPORTUNITIES.find((o) => o.name === name) ?? null,
  ).filter(Boolean);

  const viewportRef = useRef<HTMLDivElement>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [index, setIndex] = useState(0);
  const [total, setTotal] = useState(featured.length);

  const x = useMotionValue(0);
  const dragOffset = useRef(0);
  const indexRef = useRef(0);

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    setSlideWidth(el.clientWidth);
    setTotal(featured.length);
  }, [featured.length]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Re-target on index/size change
  useEffect(() => {
    if (slideWidth > 0) {
      x.set(-index * slideWidth);
    }
  }, [index, slideWidth, x]);

  const goTo = useCallback(
    (i: number) => {
      const next = Math.max(0, Math.min(total - 1, i));
      animate(x, -next * slideWidth, {
        type: "spring",
        stiffness: 240,
        damping: 32,
      });
      setIndex(next);
    },
    [total, slideWidth, x],
  );

  const onDragStart = () => {
    dragOffset.current = x.get();
  };

  const onDragEnd = () => {
    const delta = x.get() - dragOffset.current;
    if (Math.abs(delta) > slideWidth * 0.2) {
      goTo(indexRef.current + (delta < 0 ? 1 : -1));
    } else {
      goTo(indexRef.current);
    }
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(indexRef.current - 1);
      if (e.key === "ArrowRight") goTo(indexRef.current + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <section id="featured" className="bg-muted">
      <div className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-10 flex items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeCheck className="h-3.5 w-3.5 text-accent" />
            FEATURED
          </p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Start with the classics
          </h2>
          <p className="mt-3 text-muted-foreground">
            Well-known, well-regarded programs worth having on your radar,
            hand-picked from the database.
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-2 md:flex">
          <button
            type="button"
            aria-label="Previous"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={() => goTo(index + 1)}
            disabled={index === total - 1}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-primary/50 hover:text-primary disabled:opacity-40"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={viewportRef}
        className="relative overflow-hidden rounded-2xl border border-border bg-background"
      >
        {/* Slide window chrome */}
        <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-2">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Curated starting points
          </span>
          <span className="font-mono text-[11px] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>

        {/* Edge fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-background to-transparent" />

        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -slideWidth * (total - 1), right: 0 }}
          dragElastic={0}
          dragMomentum={false}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
        >
          {featured.map(
            (o, i) =>
              o && (
                <div
                  key={o.name}
                  style={{ width: slideWidth || "100%" }}
                  className="shrink-0"
                >
                  <div
                    className={cn(
                      "flex min-h-[240px] flex-col gap-6 p-6 sm:flex-row sm:items-center sm:p-8",
                      "border-b border-border last:border-0",
                    )}
                  >
                    {/* Graphic zone */}
                    <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl border border-border bg-muted sm:h-40 sm:w-64">
                      <img
                        src={IMG_URL(
                          PROGRAM_IMAGES[o.name] ??
                            FIELD_IMAGES[o.field ?? ""] ??
                            SLIDE_IMAGES[i % SLIDE_IMAGES.length],
                        )}
                        alt={`${o.name}, ${o.field ?? "featured program"}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />
                      <div className="blueprint-grid absolute inset-0 opacity-25 mix-blend-overlay" />
                      <span className="absolute left-3 top-3 font-mono text-[10px] uppercase tracking-wider text-white/90">
                        Field 0{i + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="relative min-w-0 flex-1">
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-1 -top-7 select-none font-bold leading-none text-foreground/[0.045] sm:-top-9 sm:text-8xl"
                      >
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="relative mb-2 flex flex-wrap gap-1.5">
                        {(o.field || o.cat_norm) && (
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                              FIELD_STYLES[o.field ?? ""] ??
                                "bg-muted text-muted-foreground",
                            )}
                          >
                            {o.field || o.cat_norm}
                          </span>
                        )}
                        {o.eligibility && (
                          <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {o.eligibility.length > 40
                              ? `${o.eligibility.slice(0, 38)}…`
                              : o.eligibility}
                          </span>
                        )}
                      </div>
                      <Link
                        href={`/opportunity/${slugify(o.name)}`}
                        className="text-xl font-semibold leading-snug text-foreground transition hover:text-primary sm:text-2xl"
                      >
                        {o.name}
                      </Link>
                      {o.org && (
                        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                          <OrgFavicon host={o.host} name={o.org} size={16} />
                          <span className="truncate">{o.org}</span>
                        </p>
                      )}
                      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {o.location || "Online"}
                        </span>
                        {o.deadline && o.deadline !== "Varies" && (
                          <span className="inline-flex items-center gap-1">
                            <CalendarClock className="h-3 w-3" />
                            {o.deadline}
                          </span>
                        )}
                      </p>
                      <p className="mt-3 line-clamp-2 max-w-xl text-sm text-muted-foreground">
                        {o.description || o.eligibility}
                      </p>
                      <div className="mt-4 flex items-center gap-4 border-t border-border pt-3">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <BadgeCheck className="h-3.5 w-3.5 text-success" />
                          Verified listing
                        </span>
                        {o.url && (
                          <a
                            href={o.url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                          >
                            Explore
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ),
          )}
        </motion.div>
      </div>

      {/* Dots */}
      <div className="mt-5 flex items-center justify-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === index ? "w-6 bg-primary" : "w-2 bg-border hover:bg-muted-foreground/40",
            )}
          />
        ))}
      </div>
      </div>
    </section>
  );
}