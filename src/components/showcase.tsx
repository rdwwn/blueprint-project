"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import {
  ArrowUpRight,
  Bell,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Compass,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { cn } from "@/lib/utils";
import { Wave } from "@/components/wave";

const FEATURED_NAMES = [
  "Google Computer Science Summer Institute (CSSI)",
  "NASA OSTEM High School Internship",
  "Research Science Institute (RSI)",
  "MITES Summer",
  "FIRST Robotics Competition (FRC)",
  "Girls Who Code Summer Immersion Program (SIP)",
];

const PREVIEW_STATS = [
  { label: "Saved", value: 14 },
  { label: "Deadlines this month", value: 6 },
  { label: "In progress", value: 3 },
];

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function MiniCalendar() {
  const today = new Date();
  const [view, setView] = useState({
    y: today.getFullYear(),
    m: today.getMonth(),
  });
  const { y, m } = view;

  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const firstWeekday = new Date(y, m, 1).getDay();
  const monthLabel = new Date(y, m, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // Deterministic pseudo-deadline dots that shift month to month.
  const offset = (y - today.getFullYear()) * 12 + (m - today.getMonth());
  const dots = useMemo(() => {
    const base = [5, 9, 14, 22, 27];
    return base.map((d) => ((((d + offset * 4 - 1) % 28) + 28) % 28) + 1);
  }, [offset]);

  const go = (dir: number) => {
    setView(({ y, m }) => {
      const d = new Date(y, m + dir, 1);
      return { y: d.getFullYear(), m: d.getMonth() };
    });
  };

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-2.5 py-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => go(-1)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          {monthLabel}
        </p>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => go(1)}
          className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/50 hover:text-primary"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d) => (
          <div
            key={d}
            className="flex h-5 items-center justify-center border-b border-border bg-muted/30 text-[9px] font-semibold uppercase text-muted-foreground"
          >
            {d}
          </div>
        ))}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday =
            y === today.getFullYear() &&
            m === today.getMonth() &&
            day === today.getDate();
          const hasDot = dots.includes(day) && !isToday;
          return (
            <div
              key={day}
              className={cn(
                "relative flex h-7 items-center justify-center border-r border-b border-border/70 text-[10px] last:border-r-0",
                isToday
                  ? "bg-primary font-semibold text-primary-foreground"
                  : "text-foreground",
              )}
            >
              {day}
              {hasDot && (
                <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  pct,
  days,
}: {
  label: string;
  pct: number;
  days: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">{days}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function DashboardPreview() {
  const rows = FEATURED_NAMES.map(
    (name) => OPPORTUNITIES.find((o) => o.name === name) ?? null,
  ).filter(Boolean);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-24px_rgba(27,42,74,0.25)]">
      {/* Window chrome */}
      <div className="flex items-center gap-3 border-b border-border bg-muted/60 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-danger/70" />
          <span className="h-3 w-3 rounded-full bg-warning/70" />
          <span className="h-3 w-3 rounded-full bg-success/70" />
        </div>
        <div className="ml-2 hidden h-6 w-full max-w-xs items-center gap-1.5 rounded-md border border-border bg-card px-2.5 text-[11px] text-muted-foreground sm:flex">
          <Search className="h-3 w-3" />
          blueprintproject.app/dashboard
        </div>
        <div className="ml-auto flex items-center gap-1">
          {["Explore", "Roadmap", "Settings"].map((t, i) => (
            <span
              key={t}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px]",
                i === 0
                  ? "bg-primary font-medium text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-[200px_1fr]">
        {/* Sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-border bg-muted/40 p-4 lg:flex">
          <div className="mb-4 flex items-center gap-2 px-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Compass className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold">Roadmap</span>
          </div>
          {[
            { label: "Dashboard", active: true },
            { label: "My deadlines" },
            { label: "Saved" },
            { label: "Explore" },
            { label: "Settings" },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm",
                item.active
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground",
              )}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {item.label}
            </div>
          ))}
          <div className="mt-auto pt-4">
            <div className="rounded-xl border border-border bg-card p-3">
              <p className="text-[11px] font-medium">Next deadline</p>
              <p className="mt-1 text-xs font-semibold">NASA OSTEM</p>
              <p className="mt-0.5 flex items-center gap-1 text-[10px] text-danger">
                <Bell className="h-3 w-3" />
                in 12 days
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-col">
          <div className="grid grid-cols-3 gap-3 border-b border-border p-4">
            {PREVIEW_STATS.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card px-3 py-2.5">
                <p className="text-lg font-semibold tracking-tight">{s.value}</p>
                <p className="text-[11px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 p-4 lg:grid-cols-[1fr_220px]">
            <div className="flex min-w-0 flex-col gap-2">
              {rows.slice(0, 4).map(
                (o) =>
                  o && (
                    <div
                      key={o.name}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-3.5 py-2.5"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{o.name}</p>
                          <p className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {o.location || "Online"}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarClock className="h-3 w-3" />
                              {o.deadline || "Rolling"}
                            </span>
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border text-muted-foreground">
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  ),
              )}
            </div>

            <div className="flex flex-col gap-4">
              <MiniCalendar />
              <div className="rounded-xl border border-border bg-card p-3">
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Applications
                </p>
                <div className="space-y-3">
                  <ProgressRow label="NASA OSTEM" pct={65} days="65% · 12d left" />
                  <ProgressRow label="RSI" pct={30} days="30% · 21d left" />
                  <ProgressRow label="MITES" pct={85} days="85% · 4d left" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Showcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollYProgress = useMotionValue(0);
  const gridY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    const update = () => {
      const section = sectionRef.current;
      if (!section) return;
      const range = window.innerHeight + section.offsetHeight;
      const distance = window.innerHeight - section.getBoundingClientRect().top;
      scrollYProgress.set(Math.max(0, Math.min(1, distance / range)));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      id="showcase"
      className="relative overflow-x-clip bg-[#16263f] py-24"
    >
      {/* Clean wave transition into and out of the showcase */}
      <Wave fill="#16263f" className="z-20" />
      <Wave fill="#16263f" flip className="z-20" />
      {/* Faint parallax blueprint-grid backdrop — very subtle, masked at the edges */}
      <motion.div
        style={{ y: gridY }}
        aria-hidden
        className="blueprint-grid pointer-events-none absolute inset-0 z-0 opacity-[0.05] [mask-image:linear-gradient(to_bottom,transparent,black_14%,black_86%,transparent)]"
      />
      {/* Soft accent glow for the color break */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-72 w-[44rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-200">
            <Compass className="h-3.5 w-3.5 text-accent" />
            HOW IT WORKS
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-blue-50 sm:text-4xl">
            Save it, track it, finish it
          </h2>
          <p className="mt-3 text-blue-100/60">
            Build your personal roadmap: save opportunities, watch deadlines,
            tick down, and keep every application on schedule. No spreadsheets
            required.
          </p>
        </div>

        <div className="relative">
          <div className="relative">
            <DashboardPreview />
          </div>
          <div className="registration-cross pointer-events-none absolute -left-4 -top-4 h-14 w-14 rounded-lg border border-accent/40 bg-background" />
        </div>
      </div>
    </section>
  );
}