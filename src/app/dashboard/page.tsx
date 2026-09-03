"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bookmark, CalendarClock, ChevronDown, ChevronLeft, ChevronRight, CircleDashed, Code2, Compass, Download, FlaskConical, Globe, MapPin, Palette, PenLine, Plus, Scale, Settings, Target, Trash2, Wallet, type LucideIcon } from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { useSaved } from "@/lib/use-saved";
import { useStatus, type Status } from "@/lib/use-status";
import { useCustomDates, type CustomDate } from "@/lib/use-custom-dates";
import { parseDeadline, daysUntil } from "@/lib/deadline";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { OrgFavicon } from "@/components/org-favicon";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const TABS = [{ id: "saved", label: "Saved" }, { id: "roadmap", label: "Roadmap" }, { id: "settings", label: "Settings" }] as const;
type Tab = (typeof TABS)[number]["id"];

const FIELD_ICONS: Record<string, LucideIcon> = {
  "CS & Engineering": Code2,
  "Medicine & Health": FlaskConical,
  "Business & Finance": Wallet,
  "Law, Politics & Public": Scale,
  "Arts, Design & Music": Palette,
  "Space, Earth & Environment": Globe,
  "Journalism & Media": PenLine,
};

function categoryClass(category: string | null) {
  if (category === "Internship") return "bg-primary/10 text-primary";
  if (category === "Scholarship") return "bg-success/10 text-success";
  if (category === "Competition") return "bg-accent/10 text-accent";
  if (category === "Fellowship") return "bg-warning/10 text-warning";
  return "bg-muted text-muted-foreground";
}

function StatusControl({ slug }: { slug: string }) {
  const { status, setStatus } = useStatus();
  const current = status[slug] ?? "saved";
  const options: { value: Status; label: string }[] = [{ value: "saved", label: "Saved" }, { value: "applied", label: "Applied" }, { value: "accepted", label: "Accepted" }];
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-border bg-muted/60 p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setStatus(slug, option.value)}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-medium transition",
            current === option.value
              ? option.value === "accepted"
                ? "bg-success text-white"
                : option.value === "applied"
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function SavedRow({ opportunity }: { opportunity: Opportunity }) {
  const { toggle } = useSaved();
  const slug = slugify(opportunity.name);
  const days = daysUntil(parseDeadline(opportunity.deadline ?? ""));
  const label = !Number.isFinite(days) ? "Rolling" : days < 0 ? "Past due" : days === 0 ? "Due today" : `${days}d left`;
  const FieldIcon = opportunity.field ? FIELD_ICONS[opportunity.field] : undefined;
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/40">
      <div className="flex min-w-0 flex-1 items-center gap-3.5">
        <OrgFavicon host={opportunity.host} name={opportunity.org} size={36} />
        <div className="min-w-0">
          <Link href={`/opportunity/${slug}`} className="truncate text-sm font-semibold hover:text-primary">{opportunity.name}</Link>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            {opportunity.org && <span className="truncate">{opportunity.org}</span>}
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" />{opportunity.location || "Online"}</span>
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {opportunity.field && <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary">{FieldIcon && <FieldIcon className="h-3 w-3" />}{opportunity.field}</span>}
            {opportunity.category && <span className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-medium", categoryClass(opportunity.category))}>{opportunity.category}</span>}
          </div>
        </div>
      </div>
      <span className={cn("inline-flex items-center gap-1 text-xs font-semibold", days < 0 ? "text-danger" : days <= 14 ? "text-warning" : "text-muted-foreground")}>
        <CalendarClock className="h-3.5 w-3.5" />{label}
      </span>
      <StatusControl slug={slug} />
      <button type="button" onClick={() => toggle(slug)} aria-label={`Remove ${opportunity.name}`} className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-danger/40 hover:text-danger">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

function DeadlineCalendar({ savedOpps }: { savedOpps: Opportunity[] }) {
  const today = new Date();
  const [view, setView] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selected, setSelected] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { dates, addDate, removeDate } = useCustomDates();
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formCategory, setFormCategory] = useState<"Application" | "Exam" | "Deadline" | "Event" | "Other">("Application");

  const deadlineMap = useMemo(() => {
    const map = new Map<string, { type: "opportunity"; op: Opportunity }[]>();
    savedOpps.forEach((opportunity) => {
      const ms = parseDeadline(opportunity.deadline ?? "");
      if (!Number.isFinite(ms)) return;
      const date = new Date(ms);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map.set(key, [...(map.get(key) ?? []), { type: "opportunity", op: opportunity }]);
    });
    return map;
  }, [savedOpps]);

  const customDateMap = useMemo(() => {
    const map = new Map<string, CustomDate[]>();
    dates.forEach((d) => {
      const date = new Date(d.date + "T00:00:00");
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      map.set(key, [...(map.get(key) ?? []), d]);
    });
    return map;
  }, [dates]);

  const days = new Date(view.year, view.month + 1, 0).getDate();
  const first = new Date(view.year, view.month, 1).getDay();
  const monthLabel = new Date(view.year, view.month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const go = (delta: number) => setView((current) => {
    const date = new Date(current.year, current.month + delta, 1);
    return { year: date.getFullYear(), month: date.getMonth() };
  });
  const selectedKey = selected;
  const selectedOpps = selected ? deadlineMap.get(selected) ?? [] : [];
  const selectedCustoms = selected ? customDateMap.get(selected) ?? [] : [];

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;
    addDate({ title: formTitle, date: formDate, category: formCategory });
    setFormTitle("");
    setFormDate("");
    setShowForm(false);
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-card to-accent/5 shadow-[0_12px_32px_-16px_rgba(30,88,214,0.3)]">
      <div className="flex items-center justify-between border-b border-primary/20 bg-card/50 px-4 py-3">
        <div>
          <p className="text-base font-bold text-foreground">Deadline calendar</p>
          <p className="mt-0.5 text-xs text-muted-foreground">Click any highlighted day. Add your own dates below.</p>
        </div>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => go(-1)} aria-label="Previous month" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"><ChevronLeft className="h-4 w-4" /></button>
          <span className="min-w-[8rem] px-2 text-center text-sm font-bold uppercase tracking-wide text-foreground">{monthLabel}</span>
          <button type="button" onClick={() => go(1)} aria-label="Next month" className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition hover:border-primary/40 hover:bg-primary/5 hover:text-primary"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((day) => <span key={day} className="py-2 text-center text-[10px] font-semibold uppercase text-muted-foreground">{day}</span>)}
      </div>
      <div className="grid grid-cols-7">
        {Array.from({ length: first }).map((_, index) => <span key={`blank-${index}`} className="h-11 border-b border-r border-border/60" />)}
        {Array.from({ length: days }).map((_, index) => {
          const day = index + 1;
          const key = `${view.year}-${view.month}-${day}`;
          const due = deadlineMap.get(key) ?? [];
          const custom = customDateMap.get(key) ?? [];
          const isToday = day === today.getDate() && view.month === today.getMonth() && view.year === today.getFullYear();
          const hasEvents = due.length > 0 || custom.length > 0;
          return (
            <button
              key={day}
              type="button"
              onClick={() => hasEvents && setSelected(selectedKey === key ? null : key)}
              className={cn(
                "relative h-11 border-b border-r border-border/60 text-xs transition",
                isToday && "bg-primary font-semibold text-primary-foreground",
                hasEvents && !isToday && "hover:bg-muted",
                selectedKey === key && "ring-2 ring-inset ring-accent",
                !hasEvents && "text-muted-foreground/60",
              )}
            >
              {day}
              {due.length > 0 && !isToday && <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
              {custom.length > 0 && !isToday && <span className="absolute bottom-1 right-1 h-1 w-1 rounded-full bg-primary" />}
            </button>
          );
        })}
      </div>
      <div className="border-t border-border p-4">
        {showForm ? (
          <form onSubmit={handleAdd} className="space-y-2">
            <input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="What is the date for?"
              required
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as typeof formCategory)}
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
              >
                <option>Application</option>
                <option>Exam</option>
                <option>Deadline</option>
                <option>Event</option>
                <option>Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowForm(false)} className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground">
                Cancel
              </button>
              <button type="submit" className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95">
                Add date
              </button>
            </div>
          </form>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {selectedKey ? `Selected: ${new Date(view.year, view.month, Number(selectedKey.split("-")[2] || "1")).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}` : "No day selected"}
            </p>
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold transition hover:border-primary/40"
            >
              <Plus className="h-3 w-3" /> Add date
            </button>
          </div>
        )}
        {selectedOpps.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Saved programs</p>
            {selectedOpps.map(({ op }) => (
              <Link key={op.name} href={`/opportunity/${slugify(op.name)}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="truncate font-medium">{op.name}</span>
                <ArrowUpRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
              </Link>
            ))}
          </div>
        )}
        {selectedCustoms.length > 0 && (
          <div className="mt-3 space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground">Your dates</p>
            {selectedCustoms.map((d) => (
              <div key={d.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="truncate font-medium">{d.title}</span>
                <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">{d.category}</span>
                <button
                  type="button"
                  onClick={() => removeDate(d.id)}
                  className="ml-auto rounded p-1 text-muted-foreground hover:bg-muted hover:text-danger"
                  aria-label={`Remove ${d.title}`}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Roadmap({ savedOpps }: { savedOpps: Opportunity[] }) {
  const groups = useMemo(() => {
    const sorted = savedOpps
      .map((opportunity) => ({ opportunity, time: parseDeadline(opportunity.deadline ?? "") }))
      .sort((a, b) => a.time - b.time);
    const result = new Map<string, Opportunity[]>();
    sorted.forEach(({ opportunity, time }) => {
      const key = Number.isFinite(time)
        ? new Date(time).toLocaleDateString("en-US", { month: "long", year: "numeric" })
        : "Rolling deadlines";
      result.set(key, [...(result.get(key) ?? []), opportunity]);
    });
    return result;
  }, [savedOpps]);
  return (
    <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Application roadmap</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your saved programs grouped by deadline month.</p>
      <div className="mt-6 space-y-6">
        {groups.size === 0 ? (
          <p className="text-sm text-muted-foreground">Save a program to begin your roadmap.</p>
        ) : (
          [...groups].map(([month, opportunities]) => (
            <div key={month} className="relative border-l border-primary/25 pl-5">
              <span className="absolute -left-1.5 top-1 h-3 w-3 rounded-full border-2 border-background bg-primary" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-primary">{month}</p>
              <div className="mt-3 space-y-2">
                {opportunities.map((opportunity) => {
                  const slug = slugify(opportunity.name);
                  const days = daysUntil(parseDeadline(opportunity.deadline ?? ""));
                  const daysLabel = !Number.isFinite(days) ? "Rolling" : days < 0 ? "Past due" : days === 0 ? "Due today" : `${days}d left`;
                  return (
                    <Link key={opportunity.name} href={`/opportunity/${slug}`} className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background/60 p-3 hover:border-primary/40">
                      <div className="flex items-center gap-3 min-w-0">
                        <OrgFavicon host={opportunity.host} name={opportunity.org} size={24} />
                        <div className="min-w-0">
                          <span className="block truncate text-sm font-medium">{opportunity.name}</span>
                          {opportunity.org && <span className="block truncate text-xs text-muted-foreground">{opportunity.org}</span>}
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className={cn("text-xs font-semibold", !Number.isFinite(days) ? "text-muted-foreground" : days < 0 ? "text-danger" : days <= 14 ? "text-warning" : "text-muted-foreground")}>
                          {daysLabel}
                        </span>
                        <span className="hidden sm:inline text-xs text-muted-foreground">{opportunity.deadline || "Rolling"}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function SettingsPanel({ saved, clear }: { saved: string[]; clear: () => void }) {
  const exportData = () => {
    const blob = new Blob([JSON.stringify({ saved, exportedAt: new Date().toISOString() }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "blueprint-saved-programs.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  return (
    <section className="mt-8 max-w-2xl space-y-4">
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Settings className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold">Settings</h2>
            <p className="mt-1 text-sm text-muted-foreground">Manage this device&apos;s Blueprint preferences.</p>
          </div>
        </div>
        <div className="mt-6 divide-y divide-border">
          <button type="button" onClick={exportData} className="flex w-full items-center justify-between py-4 text-left text-sm">
            <span>
              <span className="block font-medium">Export saved data</span>
              <span className="mt-1 block text-xs text-muted-foreground">Download your saved program slugs as JSON.</span>
            </span>
            <Download className="h-4 w-4 text-primary" />
          </button>
          <button type="button" onClick={() => { if (window.confirm("Clear all saved programs?")) clear(); }} className="flex w-full items-center justify-between py-4 text-left text-sm text-danger">
            <span>
              <span className="block font-medium">Clear all saved programs</span>
              <span className="mt-1 block text-xs text-danger/70">This cannot be undone.</span>
            </span>
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
);
}

function DeadlineSummary({ savedOpps, upcomingThisWeek, upcomingThisMonth }: { savedOpps: Opportunity[]; upcomingThisWeek: number; upcomingThisMonth: number }) {
  const datedCount = savedOpps.filter((opportunity) => Boolean(opportunity.deadline && opportunity.deadline !== "Varies")).length;
  const rollingCount = savedOpps.filter((opportunity) => !opportunity.deadline || opportunity.deadline === "Varies").length;
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Deadline overview</h2>
      <p className="mt-1 text-sm text-muted-foreground">Quick summary of your saved programs&apos; deadlines.</p>
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-xl border border-border bg-background/60 p-4 text-center">
          <p className="text-2xl font-semibold text-danger">{upcomingThisWeek}</p>
          <p className="mt-1 text-xs text-muted-foreground">Due this week</p>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4 text-center">
          <p className="text-2xl font-semibold text-warning">{upcomingThisMonth}</p>
          <p className="mt-1 text-xs text-muted-foreground">Due this month</p>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4 text-center">
          <p className="text-2xl font-semibold text-primary">{datedCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">With deadlines</p>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-4 text-center">
          <p className="text-2xl font-semibold text-muted-foreground">{rollingCount}</p>
          <p className="mt-1 text-xs text-muted-foreground">Rolling / Varies</p>
        </div>
      </div>
    </section>
  );
}

function FieldDistributionChart({ data }: { data: [string, number][] }) {
  if (data.length === 0) return null;
  const total = data.reduce((sum, [, count]) => sum + count, 0);
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Fields breakdown</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your saved programs by field of study.</p>
      <div className="mt-6 space-y-3">
        {data.slice(0, 6).map(([field, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          const FieldIcon = FIELD_ICONS[field];
          return (
            <div key={field} className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {FieldIcon && <FieldIcon className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{field}</span>
                  <span className="text-muted-foreground">{count} ({pct}%)</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
        {data.length > 6 && (
          <p className="text-sm text-muted-foreground text-center">+{data.length - 6} more fields</p>
        )}
      </div>
    </section>
  );
}

function CategoryDistributionChart({ data }: { data: [string, number][] }) {
  if (data.length === 0) return null;
  const total = data.reduce((sum, [, count]) => sum + count, 0);
  const categoryColors: Record<string, string> = {
    Internship: "bg-primary/10 text-primary",
    Scholarship: "bg-success/10 text-success",
    Competition: "bg-accent/10 text-accent",
    Fellowship: "bg-warning/10 text-warning",
  };
  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold">Categories breakdown</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your saved programs by type.</p>
      <div className="mt-6 space-y-3">
        {data.map(([category, count]) => {
          const pct = total > 0 ? Math.round((count / total) * 100) : 0;
          return (
            <div key={category} className="flex items-center gap-3">
              <span className={cn("inline-flex h-8 w-8 items-center justify-center rounded-lg", categoryColors[category] ?? "bg-muted text-muted-foreground")}>
                {category.charAt(0)}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate font-medium">{category}</span>
                  <span className="text-muted-foreground">{count} ({pct}%)</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { saved, clear } = useSaved();
  const { status } = useStatus();
  const [activeTab, setActiveTab] = useState<Tab>("saved");
  const savedOpps = useMemo(() => saved.map((slug) => OPPORTUNITIES.find((opportunity) => slugify(opportunity.name) === slug)).filter((opportunity): opportunity is Opportunity => Boolean(opportunity)), [saved]);
  const inProgress = savedOpps.filter((opportunity) => status[slugify(opportunity.name)] === "applied").length;
  const counts: Record<Tab, number> = { saved: savedOpps.length, roadmap: savedOpps.length, settings: 0 };

  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const upcomingThisWeek = useMemo(() => {
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    return savedOpps.filter((opportunity) => {
      const ms = parseDeadline(opportunity.deadline ?? "");
      return Number.isFinite(ms) && ms >= now && ms <= now + weekMs;
    });
  }, [savedOpps, now]);

  const upcomingThisMonth = useMemo(() => {
    const monthMs = 30 * 24 * 60 * 60 * 1000;
    return savedOpps.filter((opportunity) => {
      const ms = parseDeadline(opportunity.deadline ?? "");
      return Number.isFinite(ms) && ms >= now && ms <= now + monthMs;
    });
  }, [savedOpps, now]);

  const fieldDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    savedOpps.forEach((opportunity) => {
      if (opportunity.field) {
        dist[opportunity.field] = (dist[opportunity.field] || 0) + 1;
      }
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [savedOpps]);

  const categoryDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    savedOpps.forEach((opportunity) => {
      if (opportunity.category) {
        dist[opportunity.category] = (dist[opportunity.category] || 0) + 1;
      }
    });
    return Object.entries(dist).sort((a, b) => b[1] - a[1]);
  }, [savedOpps]);

  const stats = [
    { icon: Bookmark, label: "Saved", value: savedOpps.length, tint: "bg-primary/10 text-primary" },
    { icon: CalendarClock, label: "Dated", value: savedOpps.filter((opportunity) => Boolean(opportunity.deadline && opportunity.deadline !== "Varies")).length, tint: "bg-warning/10 text-warning" },
    { icon: CircleDashed, label: "In progress", value: inProgress, tint: "bg-accent/10 text-accent" },
    { icon: Target, label: "Due this week", value: upcomingThisWeek.length, tint: "bg-danger/10 text-danger" },
  ];

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="mx-auto max-w-[90rem] flex-1 px-6 pb-20 pt-24">
        <div className="mb-8">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Compass className="h-3.5 w-3.5 text-accent" /> DASHBOARD
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Your roadmap</h1>
          <p className="mt-2 text-muted-foreground">Saved opportunities, deadlines, and application progress stored on this device.</p>
        </div>
        <div className="grid gap-8 lg:grid-cols-[22rem_minmax(0,1fr)]">
          <aside className="space-y-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:self-start lg:pr-1">
            <nav className="rounded-2xl border border-border bg-card p-2">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-medium transition",
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="flex-1">{tab.label}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] tabular-nums", activeTab === tab.id ? "bg-primary/20 text-primary" : "bg-muted")}>{counts[tab.id]}</span>
                </button>
              ))}
            </nav>
            {savedOpps.length > 0 && (
              <>
                <div className="mt-6 rounded-2xl border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold">Quick actions</h3>
                  <div className="mt-3 space-y-2">
                    <Link href="/opportunities?season=summer" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                      Summer programs
                    </Link>
                    <Link href="/opportunities?cat=scholarship" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                      Scholarships
                    </Link>
                    <Link href="/opportunities?cat=internship" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                      Internships
                    </Link>
                    <Link href="/opportunities?cat=research" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                      Research programs
                    </Link>
                    <Link href="/compare" className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
                      Compare programs
                    </Link>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-border bg-card p-4">
                  <h3 className="text-sm font-semibold">Upcoming this week</h3>
                  <div className="mt-3 space-y-2 max-h-48 overflow-y-auto">
                    {upcomingThisWeek.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No deadlines this week</p>
                    ) : (
                      upcomingThisWeek.slice(0, 5).map((opportunity) => (
                        <Link key={opportunity.name} href={`/opportunity/${slugify(opportunity.name)}`} className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition">
                          <span className="truncate font-medium">{opportunity.name}</span>
                          <CalendarClock className="ml-auto h-3.5 w-3.5 text-warning" />
                          <span className="text-xs text-warning">{daysUntil(parseDeadline(opportunity.deadline ?? ""))}d</span>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </aside>
          <div className="min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {stats.map((stat) => (
                <div key={stat.label} className="rounded-2xl border border-border bg-card p-4">
                  <span className={cn("mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl", stat.tint)}>
                    <stat.icon className="h-4 w-4" />
                  </span>
                  <p className="text-2xl font-semibold">{stat.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            {activeTab === "saved" && (
              <section className="mt-8">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-semibold">Saved programs <span className="text-muted-foreground">({savedOpps.length})</span></h2>
                    <p className="mt-1 text-sm text-muted-foreground">Keep the programs you want to come back to.</p>
                  </div>
<details className="relative group">
                    <summary className="inline-flex cursor-pointer list-none items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 [&::-webkit-details-marker]:hidden">
                      <Compass className="h-4 w-4" /> Find New Programs
                      <ChevronDown className="h-3.5 w-3.5 transition group-open:rotate-180" />
                    </summary>
                    <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-xl">
                      <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">By category</p>
                      {[
                        { label: "Summer programs", href: "/opportunities?cat=Summer%20Program" },
                        { label: "Scholarships", href: "/opportunities?cat=Scholarship" },
                        { label: "Internships (paid)", href: "/opportunities?cat=Internship&cost=paid" },
                        { label: "Research programs", href: "/opportunities?cat=Research" },
                        { label: "Competitions", href: "/opportunities?cat=Competition" },
                        { label: "Dual enrollment", href: "/opportunities?subCategory=Dual%20Enrollment" },
                        { label: "Community service", href: "/opportunities?subCategory=Community%20Service" },
                      ].map((l) => (
                        <Link key={l.href} href={l.href} className="block rounded-lg px-3 py-1.5 text-sm transition hover:bg-muted">
                          {l.label}
                        </Link>
                      ))}
                      <div className="my-1 border-t border-border" />
                      <Link href="/opportunities" className="block rounded-lg px-3 py-1.5 text-sm font-medium text-primary transition hover:bg-muted">
                        Browse all →
                      </Link>
                    </div>
                  </details>
                </div>
                {savedOpps.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
                    <Bookmark className="mx-auto mb-4 h-8 w-8 text-primary" />
                    <p className="font-semibold">Nothing saved yet</p>
                    <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">Save programs from opportunities and they&apos;ll appear here with deadline countdowns.</p>
                    <Link href="/opportunities" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
                      Browse programs <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedOpps.map((opportunity) => <SavedRow key={opportunity.name} opportunity={opportunity} />)}
                  </div>
                )}
              </section>
            )}
{activeTab === "roadmap" && (
              <>
                <DeadlineSummary savedOpps={savedOpps} upcomingThisWeek={upcomingThisWeek.length} upcomingThisMonth={upcomingThisMonth.length} />
                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <FieldDistributionChart data={fieldDistribution} />
                  <CategoryDistributionChart data={categoryDistribution} />
                </div>
                <div className="mt-6">
                  <Roadmap savedOpps={savedOpps} />
                </div>
                <div className="mt-6">
                  <DeadlineCalendar savedOpps={savedOpps} />
                </div>
              </>
            )}
            {activeTab === "settings" && <SettingsPanel saved={saved} clear={clear} />}
            <div className="mt-10 flex justify-center">
              <Link href="/opportunities" className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                Find more opportunities <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
