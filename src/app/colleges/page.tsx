"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, GraduationCap, Scale, Search, X } from "lucide-react";
import { COLLEGES, type College } from "@/data/colleges";
import { useCompare } from "@/lib/use-compare-colleges";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

const TYPE_FILTERS = ["All", "Ivy League", "Research", "Public", "Private", "Liberal Arts"] as const;
const SIZE_FILTERS = ["Any size", "Small (<5k)", "Medium (5-15k)", "Large (15-30k)", "Very Large (30k+)"] as const;
const SETTING_FILTERS = ["Any setting", "Urban", "Suburban", "Rural", "College Town"] as const;

export default function CollegesPage() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState<(typeof TYPE_FILTERS)[number]>("All");
  const [size, setSize] = useState<(typeof SIZE_FILTERS)[number]>("Any size");
  const [setting, setSetting] = useState<(typeof SETTING_FILTERS)[number]>("Any setting");
  const { compared, isComparing, toggle, clear } = useCompare();
  const [showCompareBar, setShowCompareBar] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return COLLEGES.filter((c) => {
      if (q && !c.name.toLowerCase().includes(q) && !c.shortName.toLowerCase().includes(q) && !c.location.toLowerCase().includes(q)) return false;
      if (type !== "All" && c.type !== type) return false;
      if (size !== "Any size" && c.size !== size) return false;
      if (setting !== "Any setting" && c.setting !== setting) return false;
      return true;
    });
  }, [search, type, size, setting]);

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <GraduationCap className="h-4 w-4 text-accent" />
              <span>Compare Colleges</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Find and compare colleges
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Real acceptance rates, costs, and student vibes for {COLLEGES.length} top schools. Add up to 4 to compare side by side.
            </p>

            <div className="mt-6 rounded-2xl border border-border bg-card p-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or location..."
                  className="w-full rounded-lg border border-border bg-background py-2 pl-10 pr-4 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <FilterPills options={TYPE_FILTERS} value={type} onChange={setType} />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <FilterPills options={SIZE_FILTERS} value={size} onChange={setSize} />
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <FilterPills options={SETTING_FILTERS} value={setting} onChange={setSetting} />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{filtered.length}</span> of {COLLEGES.length} schools
            </p>
            {compared.length > 0 && (
              <button onClick={clear} className="text-sm font-medium text-primary hover:underline">
                Clear comparison
              </button>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => (
              <CollegeCard
                key={c.id}
                college={c}
                compared={isComparing(c.id)}
                onToggleCompare={() => toggle(c.id)}
              />
            ))}
          </div>
        </section>
      </main>

      {compared.length > 0 && (
        <div className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
          <div className="flex w-full max-w-2xl items-center gap-3 rounded-2xl border border-border bg-background/95 px-4 py-3 shadow-[0_18px_50px_-18px_rgba(27,42,74,0.5)] backdrop-blur-md">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Compare {compared.length}/4
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {compared.map((id) => {
                  const c = COLLEGES.find((x) => x.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium">
                      <span className="truncate max-w-[120px]">{c?.shortName ?? id}</span>
                      <button onClick={() => toggle(id)} className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-muted-foreground hover:bg-muted">
                        <X className="h-2.5 w-2.5" />
                      </button>
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <button onClick={clear} className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                Clear
              </button>
              <Link
                href={`/colleges/compare?ids=${compared.join(",")}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/95"
              >
                <Scale className="h-4 w-4" />
                Compare now
              </Link>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

function FilterPills<T extends string>({ options, value, onChange }: { options: readonly T[]; value: T; onChange: (v: T) => void }) {
  return (
    <>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          className={cn(
            "rounded-full border px-3 py-1 text-xs font-medium transition",
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40",
          )}
        >
          {o}
        </button>
      ))}
    </>
  );
}

function CollegeCard({ college, compared, onToggleCompare }: { college: College; compared: boolean; onToggleCompare: () => void }) {
  return (
    <div className={cn("group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition", compared ? "border-primary/60 shadow-[0_8px_24px_-12px_rgba(30,88,214,0.4)]" : "border-border hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_rgba(30,88,214,0.3)]")}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold leading-snug">{college.shortName}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{college.location}</p>
        </div>
        <span
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white"
          style={{ background: college.color }}
        >
          {college.shortName.slice(0, 2).toUpperCase()}
        </span>
      </div>
      <p className="line-clamp-2 text-sm text-muted-foreground">{college.vibe}</p>
      <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-xs">
        <div>
          <p className="text-muted-foreground">Acceptance</p>
          <p className="font-semibold tabular-nums">{college.acceptanceRate}%</p>
        </div>
        <div>
          <p className="text-muted-foreground">SAT</p>
          <p className="font-semibold tabular-nums">{college.satScore.split("–")[0]}+</p>
        </div>
        <div>
          <p className="text-muted-foreground">Tuition</p>
          <p className="font-semibold tabular-nums">${(college.tuition / 1000).toFixed(0)}k</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          href={`/colleges/${college.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:border-primary/40 hover:text-primary"
        >
          View details <ArrowUpRight className="h-3 w-3" />
        </Link>
        <button
          onClick={onToggleCompare}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition",
            compared ? "bg-primary text-primary-foreground" : "border border-border bg-card text-muted-foreground hover:border-primary/40",
          )}
        >
          {compared ? "Comparing" : "Compare"}
        </button>
      </div>
    </div>
  );
}
