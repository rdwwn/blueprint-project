"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { isOnlineLocation } from "@/lib/geocoded-locations";

const USMap = dynamic(() => import("@/components/us-map").then((m) => m.USMap), {
  ssr: false,
  loading: () => <div className="h-[28rem] animate-pulse rounded-2xl bg-muted" />,
});

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

export function HomepageMap({ className }: { className?: string }) {
  // Only show programs that have a real geographic location
  const geoPrograms = OPPORTUNITIES.filter((o) => !isOnlineLocation(o.location));

  return (
    <section className={className}>
      <div className="mx-auto max-w-[90rem] px-6 lg:px-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
          <div className="lg:py-12">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <MapPin className="h-3.5 w-3.5" />
              COVERAGE
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Programs across the US
            </h2>
            <p className="mt-4 text-base text-foreground/80">
              From big-city labs to nationwide virtual programs, every listing is checked by hand, and the hubs below are where the most opportunities live.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              {[
                { value: DISPLAY_COUNT, label: "Hand-checked listings" },
                { value: "18", label: "Fields covered" },
                { value: "100+", label: "Cities + remote" },
                { value: "100%", label: "No pay-to-apply" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-border bg-card p-3 shadow-sm"
                >
                  <p className="text-xl font-bold tabular-nums text-foreground">{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
            <Link
              href="/opportunities"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/95"
            >
              Browse all {geoPrograms.length} locations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
            <USMap
              programs={OPPORTUNITIES}
              className="aspect-[5/4] w-full"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
