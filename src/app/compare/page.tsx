"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BadgeCheck, CalendarClock, Check, Copy, MapPin, Plus, Printer, Sparkles, Wallet, X } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { slugify } from "@/lib/slug";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { OrgFavicon } from "@/components/org-favicon";
import { cn } from "@/lib/utils";
import { useCompare } from "@/lib/use-compare";
import { daysUntil, parseDeadline } from "@/lib/deadline";

const MAX = 4;
const POPULAR = ["Regeneron International Science and Engineering Fair", "Congressional App Challenge", "National Merit Scholarship Program", "NASA High School Aerospace Scholars"];

function isFree(o: Opportunity) {
  return (o.cost_detail ?? o.cost ?? "").toLowerCase().includes("free");
}

function deadlineScore(o: Opportunity) {
  const days = daysUntil(parseDeadline(o.deadline ?? ""));
  if (!Number.isFinite(days)) return 1;
  if (days < 0) return 1;
  if (days <= 14) return 5;
  if (days <= 30) return 4;
  if (days <= 90) return 3;
  return 2;
}

function deadlineLabel(o: Opportunity) {
  if (!o.deadline || o.deadline === "Varies") return "Varies";
  const days = daysUntil(parseDeadline(o.deadline));
  if (!Number.isFinite(days)) return o.deadline;
  if (days < 0) return "Past deadline";
  return `${o.deadline} · ${days}d away`;
}

function categoryClass(category: string | null) {
  if (category === "Internship") return "bg-primary/10 text-primary";
  if (category === "Scholarship") return "bg-success/10 text-success";
  if (category === "Competition") return "bg-accent/10 text-accent";
  if (category === "Fellowship") return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
}

function DifficultyBadge({ difficulty }: { difficulty: string | null | undefined }) {
  if (!difficulty) return null;
  const colors: Record<string, string> = {
    Competitive: "bg-danger/10 text-danger",
    Selective: "bg-warning/10 text-warning",
    Moderate: "bg-primary/10 text-primary",
    Accessible: "bg-accent/10 text-accent",
    Open: "bg-success/10 text-success",
  };
  return (
    <span className={cn("mt-2 inline-flex w-fit rounded-full px-2 py-0.5 text-[10px] font-medium", colors[difficulty] ?? "bg-muted text-muted-foreground")}>
      {difficulty}
    </span>
  );
}

export default function ComparePage() {
  const { compare: selected, add, remove, clear } = useCompare();
  const [search, setSearch] = useState("");
  const [shared, setShared] = useState(false);
  const programs = useMemo(() => selected.map((slug) => OPPORTUNITIES.find((o) => slugify(o.name) === slug)).filter((o): o is Opportunity => Boolean(o)), [selected]);
  const suggestions = useMemo(() => { const query = search.toLowerCase().trim(); if (!query) return []; return OPPORTUNITIES.filter((o) => !selected.includes(slugify(o.name)) && `${o.name} ${o.org ?? ""}`.toLowerCase().includes(query)).slice(0, 8); }, [search, selected]);
  const quickAdds = useMemo(() => POPULAR.map((name) => OPPORTUNITIES.find((o) => o.name === name)).filter((o): o is Opportunity => Boolean(o)), []);
  const differences = (key: keyof Opportunity) => new Set(programs.map((program) => String(program[key] ?? "Not listed"))).size > 1;
  const share = async () => { const url = `${window.location.origin}/compare?programs=${selected.join(",")}`; try { await navigator.clipboard.writeText(url); setShared(true); setTimeout(() => setShared(false), 1800); } catch { window.prompt("Copy this comparison URL", url); } };

  return <><div className="print:hidden"><AnimatedNav /></div><main className="flex-1 print:bg-white"><div className="mx-auto max-w-6xl px-6 py-10"><div className="print:hidden"><Link href="/opportunities" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> Back to opportunities</Link></div><div className="flex flex-wrap items-end justify-between gap-4 print:hidden"><div><h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Compare programs</h1><p className="mt-3 text-muted-foreground">See the details that matter before you apply.</p></div><div className="flex items-center gap-2 print:hidden"><button type="button" onClick={() => window.print()} className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium hover:border-primary/40"><Printer className="h-4 w-4" /> Export as PDF</button>{programs.length > 0 && <button type="button" onClick={share} className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground">{shared ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{shared ? "Copied" : "Share"}</button>}</div></div>

      <div className="relative mt-6 print:hidden"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search programs to add…" className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm outline-none focus:border-primary/60 focus:ring-4 focus:ring-primary/10" />{suggestions.length > 0 && <div className="absolute left-0 right-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl">{suggestions.map((program) => <button key={program.name} type="button" onClick={() => { add(slugify(program.name)); setSearch(""); }} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted"><OrgFavicon host={program.host} name={program.org} size={24} /><span className="min-w-0 flex-1 truncate text-sm font-medium">{program.name}</span><Plus className="h-4 w-4 text-primary" /></button>)}</div>}</div>

      {programs.length === 0 ? <div className="mt-10 rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center print:hidden"><span className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-6 w-6" /></span><p className="text-lg font-semibold">No programs selected</p><p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">Add programs from opportunities or start with a popular pick below.</p><div className="mx-auto mt-6 flex max-w-xl flex-wrap justify-center gap-2">{quickAdds.map((program) => <button key={program.name} type="button" onClick={() => add(slugify(program.name))} className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/50 hover:text-primary"><OrgFavicon host={program.host} name={program.org} size={16} />{program.name}<Plus className="h-3.5 w-3.5" /></button>)}</div></div> : <><div className="mt-8 grid gap-4 print:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">{programs.map((program) => <article key={program.name} className="relative flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm print:shadow-none print:border"><button type="button" onClick={() => remove(slugify(program.name))} aria-label={`Remove ${program.name}`} className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground print:hidden"><X className="h-4 w-4" /></button><div className="flex items-start gap-3 pr-6"><OrgFavicon host={program.host} name={program.org} size={36} /><div className="min-w-0"><Link href={`/opportunity/${slugify(program.name)}`} className="line-clamp-3 text-sm font-semibold hover:text-primary">{program.name}</Link>{program.org && <p className="mt-1 truncate text-xs text-muted-foreground">{program.org}</p>}</div></div><span className={cn("mt-4 inline-flex w-fit rounded-md px-2 py-1 text-[11px] font-medium", categoryClass(program.category))}>{program.category ?? "Program"}</span><div className="mt-4 space-y-2 text-xs text-muted-foreground"><p className="flex items-start gap-2"><MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />{program.location || "Online"}</p><p className="flex items-start gap-2"><CalendarClock className="mt-0.5 h-3.5 w-3.5 shrink-0" />{deadlineLabel(program)}</p><p className="flex items-start gap-2"><Wallet className="mt-0.5 h-3.5 w-3.5 shrink-0" />{program.cost || "Not listed"}</p></div><div className="mt-4 border-t border-border pt-3"><DifficultyBadge difficulty={program.difficulty} /></div></article>)}</div>

        <section className="mt-8 rounded-2xl border border-border bg-card p-5 sm:p-6 print:shadow-none print:border"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-semibold">At a glance</h2><p className="mt-1 text-sm text-muted-foreground">Differences are highlighted so you can scan quickly.</p></div><ArrowUpRight className="h-5 w-5 text-primary" /></div><div className="grid gap-3 sm:grid-cols-2">{([ ["Category", (o: Opportunity) => o.category ?? "Not listed", "category"], ["Field", (o: Opportunity) => o.field ?? "Not listed", "field"], ["Cost", (o: Opportunity) => o.cost ?? "Not listed", "cost"], ["Deadline", deadlineLabel, "deadline"], ["Duration", (o: Opportunity) => o.duration ?? "Not listed", "duration"], ["Eligibility", (o: Opportunity) => o.eligibility ?? "Not listed", "eligibility"]] as const).map(([label, render, key]) => <div key={label} className={cn("rounded-xl border p-4", differences(key) ? "border-warning/40 bg-warning/5" : "border-border bg-background/50")}><div className="flex items-center justify-between gap-2"><p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>{differences(key) && <span className="rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">Different</span>}</div><div className="mt-3 grid gap-2">{programs.map((program) => <div key={program.name} className="grid grid-cols-[minmax(0,7rem)_minmax(0,1fr)] gap-3 text-sm"><span className="truncate font-medium text-muted-foreground">{program.org || program.name}</span><span className="line-clamp-2 text-foreground">{render(program)}</span></div>)}</div></div>)}</div></section></>}
      </div></main><div className="print:hidden"><Footer /></div></>;
}
