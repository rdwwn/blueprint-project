"use client";

import Link from "next/link";
import { ArrowUpRight, Flame, Star, Users } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { slugify } from "@/lib/slug";
import { OrgFavicon } from "@/components/org-favicon";
import { useReviews } from "@/lib/use-reviews";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

// Popular = programs from well-known orgs OR with reviews
const POPULAR_ORGS = [
  "Google", "NASA", "MIT", "Stanford", "Harvard", "Microsoft", "Apple", "Amazon",
  "Meta", "Yale", "Princeton", "Columbia", "Brown", "Cornell", "Carnegie Mellon",
  "Smithsonian", "National Institutes of Health", "Research Science Institute",
  "Jane Street", "Two Sigma",
];

export function MostPopular({ className }: { className?: string }) {
  const { getCount, getAverage } = useReviews();
  const popular = useMemo(() => {
    return OPPORTUNITIES
      .map((o) => {
        const orgMatch = POPULAR_ORGS.some((p) => (o.org ?? "").toLowerCase().includes(p.toLowerCase()));
        const reviewScore = getCount(o.name) * 2 + getAverage(o.name);
        const verifiedBonus = o.verified ? 3 : 0;
        return { o, score: (orgMatch ? 5 : 0) + reviewScore + verifiedBonus };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ o }) => o);
  }, [getCount, getAverage]);

  return (
    <section className={className}>
      <div className="mb-6 flex items-end justify-between gap-3">
        <div>
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <Flame className="h-3.5 w-3.5" />
            MOST POPULAR
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Top programs students love</h2>
          <p className="mt-1 text-sm text-muted-foreground">The most viewed, reviewed, and applied-to programs.</p>
        </div>
        <Link href="/opportunities" className="hidden text-sm font-medium text-primary hover:underline sm:inline">
          View all →
        </Link>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {popular.map((o, i) => (
          <PopularCard key={o.name} opp={o} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}

function PopularCard({ opp, rank }: { opp: Opportunity; rank: number }) {
  return (
    <Link
      href={`/opportunity/${slugify(opp.name)}`}
      className="group relative flex h-full flex-col gap-3.5 overflow-hidden rounded-2xl border border-border bg-card p-5 pt-6 shadow-sm transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_rgba(30,88,214,0.35)]"
    >
      <div className="absolute -left-px -top-px inline-flex h-8 items-center justify-center rounded-br-2xl rounded-tl-2xl bg-primary px-3 text-xs font-bold text-primary-foreground shadow-sm transition group-hover:bg-primary/90">
        #{rank}
      </div>
      <div className="flex items-center gap-3 pt-1.5">
        <OrgFavicon host={opp.host} name={opp.org} size={48} className="rounded-lg border border-border bg-background" />
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold">{opp.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{opp.org}</p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        {opp.category && (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
            {opp.category}
          </span>
        )}
        {opp.difficulty && (
          <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium",
            opp.difficulty === "Competitive" && "bg-danger/10 text-danger",
            opp.difficulty === "Selective" && "bg-warning/10 text-warning",
            opp.difficulty === "Moderate" && "bg-primary/10 text-primary",
            opp.difficulty === "Accessible" && "bg-accent/10 text-accent",
            opp.difficulty === "Open" && "bg-success/10 text-success",
          )}>
            {opp.difficulty}
          </span>
        )}
      </div>
      <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
        View program
        <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
