import Link from "next/link";
import { BadgeCheck, HandHeart, ShieldCheck } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

const PROMISES = [
  {
    icon: HandHeart,
    title: "Free, forever",
    desc: "No paywall, no premium tier. Every listing is free to browse and free to apply.",
    accent: "text-accent",
  },
  {
    icon: BadgeCheck,
    title: "Verified, by hand",
    desc: "Every link, deadline, and eligibility check is done by a person, not an algorithm.",
    accent: "text-primary",
  },
  {
    icon: ShieldCheck,
    title: "Private, always",
    desc: "No account required to search, and nothing you look at is ever sold.",
    accent: "text-primary",
  },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-x-clip bg-muted">
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-3.5 w-3.5" />
            THE BLUEPRINT PROMISE
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Good for students, full stop.
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Three commitments that drive every decision we make.
          </p>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_-24px_rgba(30,88,214,0.35)]">
                <div className={cn("mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10")}>
                  <p.icon className={`h-6 w-6 ${p.accent}`} />
                </div>
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-foreground/80">
                  {p.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="relative mt-12 overflow-hidden rounded-3xl bg-primary px-6 py-10 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:gap-8 sm:px-10">
            <div aria-hidden className="absolute inset-0 blueprint-grid opacity-15" />
            <div className="relative">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.18em] text-white/70">
                The promise
              </p>
              <p className="mt-2 max-w-xl text-lg font-bold leading-snug sm:text-xl">
                Free to explore. Verified by people. Built around students.
              </p>
              <p className="mt-2 max-w-xl text-sm text-white/80">
                No paywalls, no paid placements, and no selling student data.
              </p>
            </div>
            <Link
              href="/mission"
              className="relative mt-6 inline-flex shrink-0 items-center justify-center rounded-xl bg-card px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-background"
            >
              Read the Blueprint mission
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
