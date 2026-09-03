"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Code,
  Wallet,
  FlaskConical,
  Map,
  Microscope,
  PenLine,
  Sun,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SEARCHES: {
  label: string;
  detail: string;
  icon: LucideIcon;
  href: string;
}[] = [
  { label: "Summer programs", detail: "Make the most of your break", icon: Sun, href: "/search?cat=Summer%20Program" },
  { label: "Pays students", detail: "Find paid opportunities", icon: Wallet, href: "/search?cost=paid" },
  { label: "Engineering", detail: "Build, code, and design", icon: Code, href: "/search?field=CS%20%26%20Engineering" },
  { label: "Research", detail: "Ask better questions", icon: Microscope, href: "/search?q=research" },
  { label: "Competitions", detail: "Put your ideas to work", icon: Trophy, href: "/search?cat=Competition" },
  { label: "Medicine & health", detail: "Explore care and science", icon: FlaskConical, href: "/search?field=Medicine%20%26%20Health" },
  { label: "Writing & media", detail: "Find your voice", icon: PenLine, href: "/search?q=writing" },
  { label: "School-year options", detail: "Keep building during class", icon: CalendarDays, href: "/search?season=school" },
];

export function TopSearches({ className }: { className?: string }) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex items-end justify-between gap-4 text-left">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
            Start somewhere
          </p>
          <p className="mt-1 text-sm font-medium text-foreground/75">
            Explore by what you want to do next.
          </p>
        </div>
        <div className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:flex">
          <Map className="h-3.5 w-3.5 text-primary" />
          Popular paths
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {SEARCHES.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group relative flex min-h-[84px] flex-col justify-between overflow-hidden rounded-2xl border border-border/90 bg-card/85 p-3.5 text-left transition hover:-translate-y-0.5 hover:border-primary/45 hover:bg-card hover:shadow-[0_14px_30px_-18px_rgba(30,88,214,0.45)]"
          >
            <span className="flex items-start justify-between gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary/8 text-primary transition group-hover:bg-primary/12">
                <s.icon className="h-4 w-4" />
              </span>
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/50 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
            </span>
            <span className="mt-3 min-w-0">
              <span className="block truncate text-sm font-semibold text-foreground">{s.label}</span>
              <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">{s.detail}</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
