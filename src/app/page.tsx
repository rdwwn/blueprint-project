"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Timer,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Reveal } from "@/components/reveal";
import { BlueprintGrid } from "@/components/blueprint-grid";
import { AnimatedHero } from "@/components/ui/animated-hero";
import { HeroSearch } from "@/components/hero-search";
import { TopSearches } from "@/components/top-searches";
import { TrustStrip } from "@/components/trust-strip";
import { Featured } from "@/components/featured";
import { Showcase } from "@/components/showcase";
import { Contribute } from "@/components/contribute";
import { FAQ } from "@/components/faq";
import { Footer } from "@/components/footer";
import { FindYourPath } from "@/components/find-your-path";
import { Wave } from "@/components/wave";
import { MostPopular } from "@/components/most-popular";
import { HomepageMap } from "@/components/homepage-map";
import { slugify } from "@/lib/slug";
import { OPPORTUNITIES } from "@/data/opportunities";
import { cn } from "@/lib/utils";

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <FindYourPath />
      <main className="flex-1">
        <Hero />
        <DeadlineCountdown />
        <MostPopular className="mx-auto max-w-[90rem] px-6 py-16 lg:px-12" />
        <HomepageMap className="bg-muted/30 py-20" />
        <Showcase />
        <Featured />
        <FAQ />
        <TrustStrip />
        <Contribute />
      </main>
      <Footer />
    </>
  );
}

function Hero() {
  const router = useRouter();
  return (
    <section className="relative overflow-hidden pt-20">
      <BlueprintGrid className="absolute inset-0 h-full w-full text-primary/25 opacity-80" />
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-70" />
      <div aria-hidden className="pointer-events-none absolute right-1/4 top-1/3 hidden h-80 w-80 rounded-full bg-warning/10 blur-3xl sm:block" />
      <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/2 hidden h-72 w-72 rounded-full bg-accent/10 blur-3xl sm:block" />
      <div aria-hidden className="hero-crosshair pointer-events-none absolute left-1/2 top-28 hidden h-72 w-72 -translate-x-1/2 rounded-full border border-primary/10 sm:block" />
      <span aria-hidden className="geo-accent geo-accent--dot absolute left-[15%] top-[20%] hidden sm:block" />
      <span aria-hidden className="geo-accent geo-accent--dot absolute right-[20%] top-[30%] hidden sm:block" />
      <span aria-hidden className="geo-accent geo-accent--ring absolute left-[10%] top-[40%] hidden lg:block" />
      <span aria-hidden className="geo-accent geo-accent--ring absolute right-[8%] top-[25%] hidden lg:block" />
      <span aria-hidden className="geo-accent geo-accent--line absolute left-[20%] top-[50%] hidden lg:block" />
      <span aria-hidden className="draft-corner draft-corner--tl hidden sm:block" />
      <span aria-hidden className="draft-corner draft-corner--tr hidden sm:block" />
      <span aria-hidden className="draft-corner draft-corner--bl hidden sm:block" />
      <span aria-hidden className="draft-corner draft-corner--br hidden sm:block" />
      <span aria-hidden className="draft-ruler draft-ruler--left hidden md:block" />
      <span aria-hidden className="draft-ruler draft-ruler--right hidden md:block" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-12 text-center sm:pt-16 lg:pt-20">
        <Reveal>
          <AnimatedHero />
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="font-semibold tabular-nums text-foreground">{DISPLAY_COUNT}</span>
              <span className="text-muted-foreground">verified programs</span>
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">50+</span>
              <span className="text-muted-foreground">fields</span>
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">100%</span>
              <span className="text-muted-foreground">free</span>
            </span>
            <span className="hidden h-3 w-px bg-border sm:inline-block" />
            <span className="flex items-center gap-1.5">
              <span className="font-semibold text-foreground">~2 min</span>
              <span className="text-muted-foreground">to find your match</span>
            </span>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <HeroSearch
            className="mt-8 w-full max-w-2xl"
            onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
          />
        </Reveal>
        <Reveal delay={0.38}>
          <TopSearches className="mt-12 w-full" />
        </Reveal>
      </div>
    </section>
  );
}

function parseDeadline(d: string): number {
  const m = d.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s*\d{1,2},?\s*(\d{4})?/i);
  if (!m) return Infinity;
  const months: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
  };
  const month = months[m[1].slice(0, 3).toLowerCase()];
  const day = parseInt(m[0].match(/\d{1,2}/)![0], 10);
  const year = m[2] ? parseInt(m[2], 10) : new Date().getFullYear();
  return new Date(year, month, day).getTime();
}

function useNow(intervalMs = 60_000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

function DeadlineCountdown() {
  const now = useNow();
  const deadlines = useMemo(() => {
    const day = 86_400_000;
    return OPPORTUNITIES
      .map((o) => ({ ...o, ms: parseDeadline(o.deadline ?? "") }))
      .filter((x) => Number.isFinite(x.ms) && x.ms >= now)
      .sort((a, b) => a.ms - b.ms)
      .slice(0, 6)
      .map((x) => ({
        name: x.name,
        slug: slugify(x.name),
        date: new Date(x.ms),
        days: Math.max(0, Math.round((x.ms - now) / day)),
        urgent: x.ms - now <= 7 * day,
        soon: x.ms - now <= 14 * day,
        field: x.field,
      }));
  }, [now]);

  if (deadlines.length === 0) return null;

  const chipTone = (d: { urgent: boolean; soon: boolean }) =>
    d.urgent
      ? "bg-danger/10 text-danger border-danger/25"
      : d.soon
        ? "bg-warning/10 text-warning border-warning/25"
        : "bg-primary/10 text-primary border-primary/25";

  // Normalize the raw spreadsheet text ("September 7th 2026", "Sept 16, 2026"
  // …) to one consistent, readable format.
  const dateLabel = (d: Date) =>
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <section className="relative overflow-x-clip bg-[#0c4f49] py-16">
      {/* Wave transitions into and out of the band */}
      <Wave fill="#0c4f49" />
      <Wave fill="#0c4f49" flip />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal className="mb-10 text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-blue-100/80">
            <Timer className="h-3.5 w-3.5 text-warning" />
            DEADLINE RADAR
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-blue-50 sm:text-4xl">Don&apos;t miss these</h2>
          <p className="mt-3 text-blue-100/60">
            Programs with deadlines coming up. Act fast on the ones that interest you.
          </p>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {deadlines.map((d) => {
            const tone = chipTone(d);
            return (
              <Link
                key={d.name}
                href={`/opportunity/${d.slug}`}
                className="group relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-muted p-5 shadow-xl shadow-black/25 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-2xl hover:ring-primary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="line-clamp-2 min-w-0 flex-1 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
                    {d.name}
                  </p>
                  <span
                    className={cn(
                      "inline-flex shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider tabular-nums",
                      tone,
                    )}
                  >
                    {d.days === 1 ? "1 day left" : `${d.days} days left`}
                  </span>
                </div>
                <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 tabular-nums">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {dateLabel(d.date)}
                  </span>
                  {d.field && (
                    <span className="inline-flex items-center rounded-md bg-background/70 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                      {d.field}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/opportunities"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/90"
          >
            View all opportunities
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
