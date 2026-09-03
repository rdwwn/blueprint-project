"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  CalendarClock,
  Check,
  ChevronDown,
  GraduationCap,
  Layers,
  ListFilter,
  LocateFixed,
  Map as MapIcon,
  MapPin,
  RotateCcw,
  Scale,
  Search,
  SlidersHorizontal,
  Timer,
  Wallet,
  X,
} from "lucide-react";
import { OPPORTUNITIES, type Opportunity } from "@/data/opportunities";
import { HeroSearch } from "@/components/hero-search";
import { SaveCardButton } from "@/components/save-button";
import { OrgFavicon } from "@/components/org-favicon";
import {
  geocodeLocation,
  isOnlineLocation,
  GEOCODED_LOCATIONS,
  stateAbbr,
  STATE_NAME_TO_ABBR,
} from "@/lib/geocoded-locations";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { useCompare } from "@/lib/use-compare";

const SearchMap = dynamic(
  () => import("@/components/us-map").then((m) => m.USMap),
  {
    ssr: false,
    loading: () => <div className="h-[24rem] animate-pulse rounded-2xl bg-muted" />,
  },
);
type MapBounds = { north: number; south: number; east: number; west: number };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function matches(q: string, o: Opportunity) {
  const hay = [
    o.name,
    o.org,
    o.field,
    o.cat_norm,
    o.category,
    o.location,
    o.eligibility,
    o.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  return terms.every((term) =>
    new RegExp(`(?:^|[^a-z0-9])${escapeRegExp(term)}`).test(hay),
  );
}

const isFreeToEnter = (o: Opportunity) =>
  (o.cost_detail ?? "").toLowerCase().startsWith("free");

const isPaid = (o: Opportunity) => {
  const cd = (o.cost_detail ?? "").toLowerCase();
  if (cd === "stipend") return true;
  if (cd !== "paid") return false;
  const c = (o.cost ?? "").toLowerCase();
  return !/(tuition|application fee|entry fees?|membership|all-inclusive|per entry|per-student|program fee|registration fee|low-cost)/.test(
    c,
  );
};

// Prefer the structured "Remote Option" data when present, fall back to the
// location heuristics for older rows.
const isOnline = (o: Opportunity) => {
  if (o.remote === "Virtual" || o.remote === "Both") return true;
  if (o.remote === "In-Person") return false;
  return isOnlineLocation(o.location);
};

function deadlineDate(o: Opportunity): number {
  const d = o.deadline ?? "";
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

type LocationFilter = "all" | "online" | "in-person";
type CostFilter = "all" | "free" | "paid";
type Sort = "relevance" | "deadline" | "name";
type TabId = "programs" | "internships" | "scholarships";
type EssayFilter = "any" | "required" | "no";
type EffortFilter = "any" | "Low" | "Medium" | "High";
type SelectivityFilter = "any" | "Open" | "Moderate" | "Selective";
type AwardTier = "any" | "full" | "micro" | "medium" | "large";
type DeadlineTypeFilter = "any" | "Rolling" | "Fixed";
type PrestigeFilter = "any" | "Niche" | "Regional" | "National";
type ResumeFilter = "any" | "Low" | "Medium" | "High";
type RecFilter = "any" | "Yes" | "No";
type CompFilter = "any" | "unpaid" | "paid";
type ScheduleFilter = "any" | "summer" | "schoolyear";
type ProgramLength = "any" | "1wk" | "2to4wk" | "6to8wk" | "10pluswk" | "year";

// Categories that are removed from the Program-type checklist. They still
// appear in the Programs tab results, they just can't be sub-selected alone.
const HIDDEN_PROGRAM_CATS = new Set([
  "Program",
  "Other",
  "Award",
  "Club",
  "Grant",
  "Conference",
  "College Course",
]);

const SORT_LABELS: Record<Sort, string> = {
  relevance: "Best match",
  deadline: "Deadline soon",
  name: "A–Z",
};

const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const PAGE_SIZE = 50;

const TAG_OPTIONS: { value: string; label: string }[] = [
  { value: "International", label: "International" },
  { value: "College Credit", label: "College credit" },
  { value: "Under-represented Minorities", label: "Under-represented minorities" },
  { value: "Girls", label: "Girls" },
  { value: "Low-Income", label: "Low-income" },
  { value: "1st-Generation", label: "1st-generation" },
  { value: "1-on-1", label: "1-on-1 mentoring" },
  { value: "LGBTQ+", label: "LGBTQ+" },
  { value: "Rural", label: "Rural & small-town" },
  { value: "Boys", label: "Boys" },
  { value: "Disabilities", label: "Disabilities" },
  { value: "Military Family", label: "Military family" },
  { value: "Immigrants & DACA", label: "Immigrants & DACA" },
  { value: "Homeschool", label: "Homeschool-friendly" },
];

const TAB_DEFS: { id: TabId; label: string; blurb: string }[] = [
  { id: "programs", label: "Programs", blurb: "Summer, school year, research, competitions, and more" },
  { id: "internships", label: "Internships", blurb: "Hands-on work experience, many paid" },
  { id: "scholarships", label: "Scholarships", blurb: "Money for college, no application fee" },
];

const FIELD_ALIASES: Record<string, string> = {
  "Law, Politics & Public": "Law",
  "Arts, Design & Music": "Arts",
  "Space, Earth & Environment": "Space",
};
const resolveField = (f: string) => FIELD_ALIASES[f] ?? f;

const POPULAR_SEARCHES = ["Summer", "Paid", "Free", "Online", "Research"];

const POPULAR_FIELDS: { label: string; field: string }[] = [
  { label: "Engineering", field: "CS & Engineering" },
  { label: "Medicine", field: "Medicine & Health" },
  { label: "Space", field: "Space" },
  { label: "Business", field: "Business & Finance" },
  { label: "Law", field: "Law" },
  { label: "Arts", field: "Arts" },
  { label: "Math", field: "Math" },
];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
  "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
  "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine",
  "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
  "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
  "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
  "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina",
  "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia",
  "Washington", "West Virginia", "Wisconsin", "Wyoming", "Washington DC",
];

// Turn "City, NY" or "City, New York" forms into a matchable token string.
const ABBR_PATTERN = new RegExp(
  `\\b(${Object.values(STATE_NAME_TO_ABBR).join("|")})\\b`,
  "gi",
);
const ABBR_TO_NAME = Object.fromEntries(
  Object.entries(STATE_NAME_TO_ABBR).map(([name, abbr]) => [abbr.toUpperCase(), name]),
);

// Normalize a location string so "New York, NY", "New York, New York", and
// "new york" all match each other.
function normLoc(s: string): string {
  return s
    .toLowerCase()
    .replace(ABBR_PATTERN, (m) => ` ${ABBR_TO_NAME[m.toUpperCase()].toLowerCase()} `)
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Parse the raw grades column ("9-12", "11-12", "8") into grade numbers.
function gradeNums(o: Opportunity): number[] {
  const raw = o.grades ?? "";
  const nums = raw.match(/\d+/g);
  if (!nums) return [];
  return [...new Set(nums.map((n) => Number(n)).filter((n) => n >= 4 && n <= 14))];
}

const GRADE_OPTIONS = ["9", "10", "11", "12"];
const GRADE_LABELS: Record<string, string> = {
  "9": "9th",
  "10": "10th",
  "11": "11th",
  "12": "12th",
};

const PROGRAM_LENGTH_OPTIONS: { value: ProgramLength; label: string }[] = [
  { value: "1wk", label: "1 week or less" },
  { value: "2to4wk", label: "2–4 weeks" },
  { value: "6to8wk", label: "6–8 weeks" },
  { value: "10pluswk", label: "10+ weeks" },
  { value: "year", label: "School year / ongoing" },
];

// Bucket the numeric weeks column (and duration text) into a program-length.
function programLengthOf(o: Opportunity): ProgramLength | null {
  const w = o.duration_weeks;
  if (w != null) {
    if (w <= 1) return "1wk";
    if (w <= 4) return "2to4wk";
    if (w <= 8) return "6to8wk";
    if (w < 52) return "10pluswk";
    return "year";
  }
  const d = (o.duration ?? "").toLowerCase();
  if (/academic year|school year|semester|year[- ]round|ongoing|full year/.test(d))
    return "year";
  if (/\d+\s*weeks?/.test(d)) {
    const n = Number(d.match(/(\d+)\s*weeks?/)?.[1]);
    if (n <= 1) return "1wk";
    if (n <= 4) return "2to4wk";
    if (n <= 8) return "6to8wk";
    return "10pluswk";
  }
  if (/weekend|overnight|day program/.test(d)) return "1wk";
  return null;
}

function scheduleOf(o: Opportunity): ScheduleFilter | null {
  const w = o.duration_weeks;
  const d = (o.duration ?? "").toLowerCase();
  if (/summer/.test(d)) return "summer";
  if (/academic year|school year|semester|year[- ]round|fall|spring/.test(d))
    return "schoolyear";
  if (w != null) {
    if (w >= 16 || w === 52) return "schoolyear";
    if (w >= 4 && w <= 14) return "summer";
  }
  return null;
}

function compensationOf(o: Opportunity): CompFilter {
  if (o.stipend != null || isPaid(o)) return "paid";
  return "unpaid";
}

type FilterContext = {
  q: string;
  field: string;
  cats: string[];
  baseCats: string[];
  tab: TabId;
  cost: CostFilter;
  format: LocationFilter;
  windowMonths: number;
  tags: string[];
  loc: string;
  essay: EssayFilter;
  amountMax: number;
  effort: EffortFilter;
  selectivity: SelectivityFilter;
  grades: string[];
  awardTier: AwardTier;
  deadlineType: DeadlineTypeFilter;
  prestige: PrestigeFilter;
  resume: ResumeFilter;
  rec: RecFilter;
  comp: CompFilter;
  schedule: ScheduleFilter;
  length: ProgramLength;
};

type Filters = Pick<
  FilterContext,
  "q" | "field" | "cats" | "tab" | "cost" | "format" | "windowMonths" | "tags" | "loc" | "essay" | "amountMax" | "effort" | "selectivity" | "grades" | "awardTier" | "deadlineType" | "prestige" | "resume" | "rec" | "comp" | "schedule" | "length"
> & { sort: Sort };

function inMapBounds(o: Opportunity, bounds: MapBounds | null): boolean {
  if (!bounds) return true;
  if (isOnline(o)) return true;
  const pos = geocodeLocation(o.location);
  const fallback = GEOCODED_LOCATIONS.Nationwide;
  if (pos.lat === fallback.lat && pos.lng === fallback.lng) return true;
  return (
    pos.lat <= bounds.north &&
    pos.lat >= bounds.south &&
    pos.lng <= bounds.east &&
    pos.lng >= bounds.west
  );
}

function filterList(
  list: Opportunity[],
  f: FilterContext,
  bounds: MapBounds | null,
  now = Date.now(),
): Opportunity[] {
  let l = f.q ? list.filter((o) => matches(f.q, o)) : list;
  const allowed = f.baseCats;
  if (allowed.length) l = l.filter((o) => allowed.includes(o.category ?? ""));
  if (f.field !== "All fields")
    l = l.filter((o) => o.field === resolveField(f.field));
  if (f.cats.length && f.tab === "programs")
    l = l.filter((o) => f.cats.includes(o.category ?? ""));
  if (f.cost === "free") l = l.filter(isFreeToEnter);
  if (f.cost === "paid") l = l.filter(isPaid);
  if (f.format === "online") l = l.filter(isOnline);
  if (f.format === "in-person") l = l.filter((o) => !isOnline(o));
  if (f.windowMonths > 0) {
    const ms = f.windowMonths * MONTH_MS;
    l = l.filter((o) => {
      const d = deadlineDate(o);
      return Number.isFinite(d) && d <= now + ms;
    });
  }
  if (f.tags.length)
    l = l.filter((o) => f.tags.some((t) => o.tags.includes(t)));
  if (f.essay === "required") l = l.filter((o) => o.essay === "Required");
  if (f.essay === "no") l = l.filter((o) => o.essay === "Not required");
  if (f.amountMax > 0)
    l = l.filter(
      (o) => o.stipend_min != null && o.stipend_min <= f.amountMax,
    );
  if (f.effort !== "any")
    l = l.filter((o) => (o.effort ?? null) === f.effort);
  if (f.selectivity !== "any")
    l = l.filter((o) => o.acceptance === f.selectivity);
  if (f.grades.length) {
    const wanted = new Set(f.grades.map(Number));
    l = l.filter((o) => {
      const nums = gradeNums(o);
      return nums.some((n) => wanted.has(n));
    });
  }
  if (f.awardTier === "full") l = l.filter((o) => o.stipend === "Full tuition");
  if (f.awardTier === "micro")
    l = l.filter(
      (o) => o.stipend_min != null && o.stipend_min >= 500 && o.stipend_min < 2500,
    );
  if (f.awardTier === "medium")
    l = l.filter(
      (o) => o.stipend_min != null && o.stipend_min >= 2500 && o.stipend_min < 10000,
    );
  if (f.awardTier === "large")
    l = l.filter((o) => o.stipend_min != null && o.stipend_min >= 10000);
  if (f.deadlineType !== "any")
    l = l.filter((o) => o.deadline_type === f.deadlineType);
  if (f.prestige !== "any")
    l = l.filter((o) => o.prestige === f.prestige);
  if (f.resume !== "any")
    l = l.filter((o) => o.resume === f.resume);
  if (f.rec !== "any")
    l = l.filter((o) => o.rec === f.rec);
  if (f.comp !== "any")
    l = l.filter((o) => compensationOf(o) === f.comp);
  if (f.schedule !== "any")
    l = l.filter((o) => scheduleOf(o) === f.schedule);
  if (f.length !== "any")
    l = l.filter((o) => programLengthOf(o) === f.length);
  if (f.loc) {
    const loc = f.loc.toLowerCase();
    const nq = normLoc(f.loc);
    l = l.filter((o) => {
      if (loc === "online") return isOnline(o);
      if (!nq) return false;
      return normLoc(o.location ?? "").includes(nq);
    });
  }
  if (bounds) l = l.filter((o) => inMapBounds(o, bounds));
  return l;
}

function initialFilters(params: URLSearchParams, prefilter?: Record<string, string>): Filters {
  const prefCats = (prefilter?.category ?? "")
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  const prefTab: TabId = prefCats.includes("Internship")
    ? "internships"
    : prefCats.includes("Scholarship")
      ? "scholarships"
      : "programs";
  const tabParam = params.get("tab");
  const tab: TabId =
    tabParam === "programs" || tabParam === "internships" || tabParam === "scholarships"
      ? tabParam
      : prefTab;

  const cost = (params.get("cost") ?? "all") as CostFilter;
  const format = (params.get("format") ?? "all") as LocationFilter;
  const essay = (params.get("essay") ?? "any") as EssayFilter;
  const effort = (params.get("effort") ?? "any") as EffortFilter;
  const selectivity = (params.get("selectivity") ?? "any") as SelectivityFilter;
  const awardTier = (params.get("awardTier") ?? "any") as AwardTier;
  const deadlineType = (params.get("dtype") ?? "any") as DeadlineTypeFilter;
  const prestige = (params.get("prestige") ?? "any") as PrestigeFilter;
  const resume = (params.get("resume") ?? "any") as ResumeFilter;
  const rec = (params.get("rec") ?? "any") as RecFilter;
  const comp = (params.get("comp") ?? "any") as CompFilter;
  const schedule = (params.get("schedule") ?? "any") as ScheduleFilter;
  const length = (params.get("length") ?? "any") as ProgramLength;
  const sort = (params.get("sort") ?? "relevance") as Sort;

  return {
    q: params.get("q") ?? "",
    field: params.get("field") ?? "All fields",
    cats: (params.get("cat") ?? "")
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean),
    tab,
    cost: cost === "free" || cost === "paid" ? cost : "all",
    format: format === "online" || format === "in-person" ? format : "all",
    windowMonths: Number(params.get("window") ?? "0") || 0,
    tags: (params.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    loc: params.get("loc") ?? "",
    essay: essay === "required" || essay === "no" ? essay : "any",
    amountMax: Math.max(0, Number(params.get("amount") ?? "0")) || 0,
    effort: effort === "Low" || effort === "Medium" || effort === "High" ? effort : "any",
    selectivity:
      selectivity === "Open" || selectivity === "Moderate" || selectivity === "Selective"
        ? selectivity
        : "any",
    grades: GRADE_OPTIONS.filter((g) => params.get("grade")?.split(",").includes(g)),
    awardTier:
      awardTier === "full" || awardTier === "micro" || awardTier === "medium" || awardTier === "large"
        ? awardTier
        : "any",
    deadlineType:
      deadlineType === "Rolling" || deadlineType === "Fixed" ? deadlineType : "any",
    prestige:
      prestige === "Niche" || prestige === "Regional" || prestige === "National"
        ? prestige
        : "any",
    resume: resume === "Low" || resume === "Medium" || resume === "High" ? resume : "any",
    rec: rec === "Yes" || rec === "No" ? rec : "any",
    comp: comp === "unpaid" || comp === "paid" ? comp : "any",
    schedule: schedule === "summer" || schedule === "schoolyear" ? schedule : "any",
    length: PROGRAM_LENGTH_OPTIONS.some((p) => p.value === length) ? length : "any",
    sort: sort === "deadline" || sort === "name" ? sort : "relevance",
  };
}

/** Collapsible filter group — keeps a dense sidebar manageable. */
function FilterSection({
  icon: Icon,
  title,
  defaultOpen = false,
  forceOpen = false,
  badge,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  defaultOpen?: boolean;
  /** Primary filters stay visible — no collapse toggle. */
  forceOpen?: boolean;
  /** Little count chip next to the title (e.g. active advanced filters). */
  badge?: number;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  const titleEl = (
    <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
      <Icon className="h-3.5 w-3.5" />
      {title}
      {badge != null && badge > 0 && (
        <span className="rounded-full bg-primary px-1.5 py-px text-[9px] font-semibold tabular-nums text-primary-foreground">
          {badge}
        </span>
      )}
    </span>
  );

  return (
    <div className="rounded-2xl border border-border bg-card/60 p-3.5">
      {forceOpen ? (
        <p className="flex items-center gap-1.5">{titleEl}</p>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-2 text-left"
        >
          {titleEl}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      )}
      {forceOpen ? (
        <div className="pt-3">{children}</div>
      ) : (
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.18, ease: [0.21, 0.47, 0.32, 0.98] }}
              className="overflow-hidden"
            >
              <div className="pt-3">{children}</div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

/** Labeled group used inside the collapsed "Advanced options" section. */
function AdvancedGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <p className="mb-2 text-xs font-semibold text-foreground">{label}</p>
      {children}
    </div>
  );
}

/* ---------- Modern filter controls ---------- */

function ToggleSwitch({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition",
        checked
          ? "border-primary/50 bg-primary/10 font-medium text-primary"
          : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
      )}
    >
      <span className="flex items-center gap-2">
        {label}
        {count != null && (
          <span className="text-xs tabular-nums text-muted-foreground/70">{count}</span>
        )}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition-colors",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            checked ? "left-[18px]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 12,
  step = 1,
  label,
  formatLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  formatLabel: (v: number) => string;
}) {
  const pct = max === min ? 0 : ((value - min) / (max - min)) * 100;
  return (
    <div className="rounded-xl border border-border bg-card p-3.5">
      <div className="mb-2 flex items-center justify-between text-xs">
        <span className="font-medium text-foreground">{label}</span>
        <span className="rounded-md bg-primary/10 px-2 py-0.5 font-semibold tabular-nums text-primary">
          {formatLabel(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label={label}
        className="bp-range w-full"
        style={{
          background: `linear-gradient(to right, var(--primary) 0%, var(--primary) ${pct}%, var(--border) ${pct}%, var(--border) 100%)`,
        }}
      />
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>Any</span>
        <span>{formatLabel(max)}</span>
      </div>
    </div>
  );
}

function PillChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
      )}
    >
      {label}
      {count != null && (
        <span
          className={cn(
            "text-[10px] tabular-nums",
            active ? "text-primary-foreground/80" : "text-muted-foreground/60",
          )}
        >
          {count}
        </span>
      )}
    </motion.button>
  );
}

function CheckRow({
  label,
  count,
  active,
  onToggle,
}: {
  label: string;
  count: number;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="group flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition hover:bg-muted"
    >
      <span className="flex items-center gap-2.5">
        <span
          className={cn(
            "flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border transition-colors",
            active
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card group-hover:border-primary/50",
          )}
        >
          <Check
            className={cn(
              "h-3 w-3 transition-all duration-150",
              active ? "scale-100 opacity-100" : "scale-50 opacity-0",
            )}
          />
        </span>
        <span className={cn(active ? "font-medium text-foreground" : "text-muted-foreground")}>
          {label}
        </span>
      </span>
      <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
        {count}
      </span>
    </button>
  );
}

function FieldSelect({
  value,
  onChange,
  fields,
  counts,
  total,
}: {
  value: string;
  onChange: (v: string) => void;
  fields: [string, number][];
  counts: Map<string, number>;
  total: number;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const q = query.trim().toLowerCase();
  const list = q
    ? fields.filter(([f]) => f.toLowerCase().includes(q))
    : fields;

  const pick = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          "flex w-full items-center gap-2 rounded-xl border bg-card py-2.5 pl-3 pr-2.5 text-sm outline-none transition",
          open || value !== "All fields"
            ? "border-primary/50 bg-primary/[0.03] font-medium text-foreground focus:ring-2 focus:ring-primary/10"
            : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        <span
          className={cn(
            "min-w-0 flex-1 truncate text-left",
            value !== "All fields" && "font-medium text-foreground",
          )}
        >
          {value === "All fields" ? "All fields" : value}
        </span>
        {value !== "All fields" && (
          <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums">
            {counts.get(value) ?? 0}
          </span>
        )}
        {value === "All fields" && (
          <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-muted-foreground">
            {total.toLocaleString()}
          </span>
        )}
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <div className="border-b border-border p-2">
              <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-1.5">
                <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search fields…"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            </div>
            <ul role="listbox" aria-label="Field" className="max-h-56 overflow-y-auto p-1">
              <li role="option" aria-selected={value === "All fields"}>
                <button
                  type="button"
                  onClick={() => pick("All fields")}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-muted",
                    value === "All fields" ? "font-semibold text-primary" : "text-foreground",
                  )}
                >
                  <span>All fields</span>
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {total.toLocaleString()}
                  </span>
                </button>
              </li>
              {list.map(([f]) => (
                <li key={f} role="option" aria-selected={value === f}>
                  <button
                    type="button"
                    onClick={() => pick(f)}
                    className={cn(
                      "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition hover:bg-muted",
                      value === f ? "font-semibold text-primary" : "text-foreground",
                    )}
                  >
                    <span className="truncate">{f}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                      {counts.get(f) ?? 0}
                    </span>
                  </button>
                </li>
              ))}
              {list.length === 0 && (
                <li className="px-2.5 py-3 text-center text-xs text-muted-foreground">
                  No fields match &quot;{query}&quot;
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------- Main view ---------- */

type SearchViewProps = {
  prefilter?: Record<string, string>;
  vanish?: boolean;
};

export function SearchView({ prefilter, vanish: _vanish = false }: SearchViewProps) {
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => initialFilters(params, prefilter));
  const [now, setNow] = useState(() => Date.now());
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [limitToMap, setLimitToMap] = useState(false);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);
  const [page, setPage] = useState(1);
  const [locating, setLocating] = useState(false);
  const { compare, isComparing, toggle: toggleCompare, clear: clearCompare } = useCompare();

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const update = useCallback((patch: Partial<Filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  }, []);

  // Debounced URL sync — filters stay instant in-page, the URL quietly catches
  // up so links and the back button keep working without a page reload.
  useEffect(() => {
    const id = setTimeout(() => {
      const sp = new URLSearchParams();
      if (filters.q) sp.set("q", filters.q);
      if (filters.field !== "All fields") sp.set("field", filters.field);
      if (filters.cats.length) sp.set("cat", filters.cats.join(","));
      if (filters.tab !== (prefilter ? initialTabFor(prefilter) : "programs"))
        sp.set("tab", filters.tab);
      if (filters.cost !== "all") sp.set("cost", filters.cost);
      if (filters.format !== "all") sp.set("format", filters.format);
      if (filters.windowMonths > 0) sp.set("window", String(filters.windowMonths));
      if (filters.tags.length) sp.set("tags", filters.tags.join(","));
      if (filters.loc) sp.set("loc", filters.loc);
      if (filters.essay !== "any") sp.set("essay", filters.essay);
      if (filters.amountMax > 0) sp.set("amount", String(filters.amountMax));
      if (filters.effort !== "any") sp.set("effort", filters.effort);
      if (filters.selectivity !== "any")
        sp.set("selectivity", filters.selectivity);
      if (filters.grades.length) sp.set("grade", filters.grades.join(","));
      if (filters.awardTier !== "any") sp.set("awardTier", filters.awardTier);
      if (filters.deadlineType !== "any") sp.set("dtype", filters.deadlineType);
      if (filters.prestige !== "any") sp.set("prestige", filters.prestige);
      if (filters.resume !== "any") sp.set("resume", filters.resume);
      if (filters.rec !== "any") sp.set("rec", filters.rec);
      if (filters.comp !== "any") sp.set("comp", filters.comp);
      if (filters.schedule !== "any") sp.set("schedule", filters.schedule);
      if (filters.length !== "any") sp.set("length", filters.length);
      if (filters.sort !== "relevance") sp.set("sort", filters.sort);
      const qs = sp.toString();
      const path = window.location.pathname;
      window.history.replaceState(null, "", qs ? `${path}?${qs}` : path);
    }, 300);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const { q, field, cats, tab, cost, format, windowMonths, tags, loc, essay, amountMax, effort, selectivity, grades, awardTier, deadlineType, prestige, resume, rec, comp, schedule, length, sort } = filters;

  // Granular criteria tucked under "Advanced options" — count how many are live
  // so the section can surface a badge and open itself when needed.
  const advancedActive =
    (length !== "any" ? 1 : 0) +
    (schedule !== "any" ? 1 : 0) +
    (resume !== "any" ? 1 : 0) +
    (prestige !== "any" ? 1 : 0) +
    (essay !== "any" ? 1 : 0) +
    (rec !== "any" ? 1 : 0) +
    (deadlineType !== "any" ? 1 : 0) +
    (selectivity !== "any" ? 1 : 0) +
    (effort !== "any" ? 1 : 0) +
    tags.length +
    (loc !== "" ? 1 : 0) +
    (sort !== "relevance" ? 1 : 0);

  const masterCats = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of OPPORTUNITIES) {
      const c = o.category ?? "";
      map.set(c, (map.get(c) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, []);

  const catCounts = useMemo(() => new Map(masterCats), [masterCats]);

  const tabCounts = useMemo(() => {
    const internships = catCounts.get("Internship") ?? 0;
    const scholarships = catCounts.get("Scholarship") ?? 0;
    return {
      internships,
      scholarships,
      programs: Math.max(0, OPPORTUNITIES.length - internships - scholarships),
    } satisfies Record<TabId, number>;
  }, [catCounts]);

  const baseCats = useMemo(() => {
    if (tab === "internships") return ["Internship"];
    if (tab === "scholarships") return ["Scholarship"];
    return [...masterCats.filter(([c]) => c !== "Internship" && c !== "Scholarship").map(([c]) => c), ""];
  }, [tab, masterCats]);

  const programCats = useMemo(
    () =>
      masterCats.filter(
        ([c]) =>
          c !== "Internship" &&
          c !== "Scholarship" &&
          c !== "" &&
          !HIDDEN_PROGRAM_CATS.has(c),
      ),
    [masterCats],
  );

  const fields = useMemo(() => {
    const map = new Map<string, number>();
    for (const o of OPPORTUNITIES) {
      if (o.field) map.set(o.field, (map.get(o.field) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, []);

  const ctx = useCallback(
    (extra: Partial<FilterContext> = {}): FilterContext => ({
      q,
      field,
      cats,
      baseCats,
      tab,
      cost,
      format,
      windowMonths,
      tags,
      loc,
      essay,
      amountMax,
      effort,
      selectivity,
      grades,
      awardTier,
      deadlineType,
      prestige,
      resume,
      rec,
      comp,
      schedule,
      length,
      ...extra,
    }),
    [q, field, cats, baseCats, tab, cost, format, windowMonths, tags, loc, essay, amountMax, effort, selectivity, grades, awardTier, deadlineType, prestige, resume, rec, comp, schedule, length],
  );

  const counts = useMemo(() => {
    const tabCtx = (extra: Partial<FilterContext> = {}): FilterContext =>
      ctx({ field: "All fields", cats: [], cost: "all", format: "all", windowMonths: 0, tags: [], loc: "", essay: "any", amountMax: 0, effort: "any", selectivity: "any", grades: [], awardTier: "any", deadlineType: "any", prestige: "any", resume: "any", rec: "any", comp: "any", schedule: "any", length: "any", ...extra });

    const fieldPool = filterList(OPPORTUNITIES, tabCtx(), null);
    const fieldCounts = new Map<string, number>();
    for (const o of fieldPool) {
      if (o.field) fieldCounts.set(o.field, (fieldCounts.get(o.field) ?? 0) + 1);
    }

    const catPool = filterList(OPPORTUNITIES, tabCtx({ field }), null);
    const catCounts = new Map<string, number>();
    for (const o of catPool) {
      if (o.category) catCounts.set(o.category, (catCounts.get(o.category) ?? 0) + 1);
    }

    const costPool = filterList(OPPORTUNITIES, tabCtx({ field, cats }), null);
    const freeCount = costPool.filter(isFreeToEnter).length;
    const paidCount = costPool.filter(isPaid).length;

    const formatPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost }), null);
    const onlineCount = formatPool.filter(isOnline).length;
    const inPersonCount = formatPool.length - onlineCount;

    const windowPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null, now);
    const window1m = windowPool.filter((o) => Number.isFinite(deadlineDate(o)) && deadlineDate(o) <= now + MONTH_MS).length;
    const window3m = windowPool.filter((o) => Number.isFinite(deadlineDate(o)) && deadlineDate(o) <= now + 3 * MONTH_MS).length;
    const window6m = windowPool.filter((o) => Number.isFinite(deadlineDate(o)) && deadlineDate(o) <= now + 6 * MONTH_MS).length;

    const tagPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const tagCounts = new Map<string, number>();
    for (const o of tagPool) {
      for (const t of o.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
    }

    const essayPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const essayRequired = essayPool.filter((o) => o.essay === "Required").length;
    const essayNone = essayPool.filter((o) => o.essay === "Not required").length;

    const effortPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const effortLow = effortPool.filter((o) => o.effort === "Low").length;
    const effortMedium = effortPool.filter((o) => o.effort === "Medium").length;
    const effortHigh = effortPool.filter((o) => o.effort === "High").length;

    const selPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const selOpen = selPool.filter((o) => o.acceptance === "Open").length;
    const selModerate = selPool.filter((o) => o.acceptance === "Moderate").length;
    const selSelective = selPool.filter((o) => o.acceptance === "Selective").length;

    const gradePool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const gradeCounts = new Map<string, number>();
    for (const o of gradePool) {
      for (const g of gradeNums(o)) gradeCounts.set(String(g), (gradeCounts.get(String(g)) ?? 0) + 1);
    }

    const awardPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const tierFull = awardPool.filter((o) => o.stipend === "Full tuition").length;
    const tierMicro = awardPool.filter((o) => o.stipend_min != null && o.stipend_min >= 500 && o.stipend_min < 2500).length;
    const tierMedium = awardPool.filter((o) => o.stipend_min != null && o.stipend_min >= 2500 && o.stipend_min < 10000).length;
    const tierLarge = awardPool.filter((o) => o.stipend_min != null && o.stipend_min >= 10000).length;

    const locPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const onlineLocCount = locPool.filter(isOnline).length;

    const metaPool = filterList(OPPORTUNITIES, tabCtx({ field, cats, cost, format }), null);
    const rollingCount = metaPool.filter((o) => o.deadline_type === "Rolling").length;
    const fixedCount = metaPool.filter((o) => o.deadline_type === "Fixed").length;
    const nicheCount = metaPool.filter((o) => o.prestige === "Niche").length;
    const regionalCount = metaPool.filter((o) => o.prestige === "Regional").length;
    const nationalCount = metaPool.filter((o) => o.prestige === "National").length;
    const resumeLow = metaPool.filter((o) => o.resume === "Low").length;
    const resumeMedium = metaPool.filter((o) => o.resume === "Medium").length;
    const resumeHigh = metaPool.filter((o) => o.resume === "High").length;
    const recYes = metaPool.filter((o) => o.rec === "Yes").length;
    const recNo = metaPool.filter((o) => o.rec === "No").length;
    const compPaid = metaPool.filter((o) => compensationOf(o) === "paid").length;
    const compUnpaid = metaPool.length - compPaid;
    const summerCount = metaPool.filter((o) => scheduleOf(o) === "summer").length;
    const schoolYearCount = metaPool.filter((o) => scheduleOf(o) === "schoolyear").length;
    const lengthCounts = new Map<ProgramLength, number>();
    for (const o of metaPool) {
      const p = programLengthOf(o);
      if (p) lengthCounts.set(p, (lengthCounts.get(p) ?? 0) + 1);
    }

    return {
      fieldCounts,
      catCounts,
      fieldPool: fieldPool.length,
      freeCount,
      paidCount,
      onlineCount,
      inPersonCount,
      window1m,
      window3m,
      window6m,
      tagCounts,
      essayRequired,
      essayNone,
      effortLow,
      effortMedium,
      effortHigh,
      selOpen,
      selModerate,
      selSelective,
      gradeCounts,
      tierFull,
      tierMicro,
      tierMedium,
      tierLarge,
      onlineLocCount,
      rollingCount,
      fixedCount,
      nicheCount,
      regionalCount,
      nationalCount,
      resumeLow,
      resumeMedium,
      resumeHigh,
      recYes,
      recNo,
      compPaid,
      compUnpaid,
      summerCount,
      schoolYearCount,
      lengthCounts,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, field, cats, cost, format, tab, now]);

  const results = useMemo(() => {
    const bounds = limitToMap ? mapBounds : null;
    let list = filterList(OPPORTUNITIES, ctx(), bounds, now);
    if (sort === "deadline")
      list = [...list].sort((a, b) => deadlineDate(a) - deadlineDate(b));
    if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [ctx, sort, limitToMap, mapBounds, now]);

  // Map markers come from the full (filtered) set so the map stays complete
  // even while the list is paginated. Caps at 400 for smooth panning.
  const mapPrograms = useMemo(() => results.slice(0, 400), [results]);

  const visibleResults = useMemo(() => results.slice(0, page * PAGE_SIZE), [results, page]);
  const remaining = Math.max(0, results.length - page * PAGE_SIZE);

  const toggleCat = useCallback(
    (c: string) => {
      const next = cats.includes(c) ? cats.filter((x) => x !== c) : [...cats, c];
      update({ cats: next });
    },
    [cats, update],
  );

  const toggleTag = useCallback(
    (t: string) => {
      const next = tags.includes(t) ? tags.filter((x) => x !== t) : [...tags, t];
      update({ tags: next });
    },
    [tags, update],
  );

  const selectTab = useCallback(
    (id: TabId) => {
      setFilters((prev) => ({
        ...prev,
        tab: id,
        cats: id === "programs" ? prev.cats : [],
        essay: "any",
        amountMax: 0,
        awardTier: "any",
        deadlineType: "any",
        prestige: "any",
        resume: "any",
        rec: "any",
        comp: "any",
        schedule: "any",
        length: "any",
      }));
      setPage(1);
    },
    [],
  );

  const clearAll = useCallback(() => {
    // Start from a blank slate (not the URL, which mirrors the current filters).
    setFilters((prev) => ({
      ...initialFilters(new URLSearchParams(), prefilter),
      tab: prev.tab,
    }));
    setLimitToMap(false);
    setMapBounds(null);
    setPage(1);
  }, [prefilter]);

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (q) chips.push({ key: "q", label: `"${q}"`, clear: () => update({ q: "" }) });
    if (field !== "All fields")
      chips.push({ key: "field", label: field, clear: () => update({ field: "All fields" }) });
    for (const c of cats)
      chips.push({ key: `cat-${c}`, label: c, clear: () => toggleCat(c) });
    if (cost !== "all")
      chips.push({
        key: "cost",
        label: cost === "free" ? "Free to enter" : "Pays students",
        clear: () => update({ cost: "all" }),
      });
    if (format !== "all")
      chips.push({
        key: "format",
        label: format === "online" ? "Online" : "In-person",
        clear: () => update({ format: "all" }),
      });
    if (windowMonths > 0)
      chips.push({
        key: "window",
        label: `Deadline within ${windowMonths} mo`,
        clear: () => update({ windowMonths: 0 }),
      });

    for (const t of tags)
      chips.push({ key: `tag-${t}`, label: t, clear: () => toggleTag(t) });
    if (essay !== "any")
      chips.push({
        key: "essay",
        label: essay === "required" ? "Essay required" : "No essay",
        clear: () => update({ essay: "any" }),
      });
    if (amountMax > 0)
      chips.push({
        key: "amount",
        label: `Stipend up to $${amountMax.toLocaleString()}`,
        clear: () => update({ amountMax: 0 }),
      });
    if (effort !== "any")
      chips.push({
        key: "effort",
        label: `Effort: ${effort}`,
        clear: () => update({ effort: "any" }),
      });
    if (selectivity !== "any")
      chips.push({
        key: "selectivity",
        label: `Selectivity: ${selectivity}`,
        clear: () => update({ selectivity: "any" }),
      });
    if (grades.length)
      chips.push({
        key: `grade-${grades.join("-")}`,
        label: `Grade: ${grades.map((g) => GRADE_LABELS[g] ?? g).join(", ")}`,
        clear: () => update({ grades: [] }),
      });
    if (awardTier !== "any")
      chips.push({
        key: "awardTier",
        label:
          awardTier === "full"
            ? "Award: Full tuition"
            : awardTier === "micro"
              ? "Award: $500–$2,500"
              : awardTier === "medium"
                ? "Award: $2,500–$10,000"
                : "Award: $10,000+",
        clear: () => update({ awardTier: "any" }),
      });
    if (loc)
      chips.push({ key: "loc", label: `Location: ${loc}`, clear: () => update({ loc: "" }) });
    if (deadlineType !== "any")
      chips.push({
        key: "dtype",
        label: `Deadline: ${deadlineType}`,
        clear: () => update({ deadlineType: "any" }),
      });
    if (prestige !== "any")
      chips.push({
        key: "prestige",
        label: `Prestige: ${prestige}`,
        clear: () => update({ prestige: "any" }),
      });
    if (resume !== "any")
      chips.push({
        key: "resume",
        label: `Resume value: ${resume}`,
        clear: () => update({ resume: "any" }),
      });
    if (rec !== "any")
      chips.push({
        key: "rec",
        label: `Rec letter: ${rec}`,
        clear: () => update({ rec: "any" }),
      });
    if (comp !== "any")
      chips.push({
        key: "comp",
        label: comp === "paid" ? "Paid" : "Unpaid",
        clear: () => update({ comp: "any" }),
      });
    if (schedule !== "any")
      chips.push({
        key: "schedule",
        label: schedule === "summer" ? "Summer schedule" : "School year schedule",
        clear: () => update({ schedule: "any" }),
      });
    if (length !== "any")
      chips.push({
        key: "length",
        label: `Length: ${PROGRAM_LENGTH_OPTIONS.find((p) => p.value === length)?.label ?? length}`,
        clear: () => update({ length: "any" }),
      });
    if (limitToMap)
      chips.push({ key: "map", label: "Map area only", clear: () => setLimitToMap(false) });
    if (sort !== "relevance")
      chips.push({
        key: "sort",
        label: `Sort: ${SORT_LABELS[sort]}`,
        clear: () => update({ sort: "relevance" }),
      });
    return chips;
  }, [q, field, cats, cost, format, windowMonths, tags, essay, amountMax, effort, selectivity, grades, awardTier, deadlineType, prestige, resume, rec, comp, schedule, length, loc, limitToMap, sort, update, toggleCat, toggleTag]);

  const hasFilters = activeChips.length > 0;

  const useMyLocation = useCallback(async () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          timeout: 10_000,
          maximumAge: 60_000,
        }),
      );
      const { latitude, longitude } = pos.coords;
      let label = "";
      try {
        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
        );
        const data = (await resp.json()) as {
          address?: { city?: string; town?: string; county?: string; state?: string };
        };
        const a = data.address ?? {};
        const place = a.city || a.town || a.county || "";
        // Use the same "City, NY" form the dataset locations use.
        const st = a.state ? stateAbbr(a.state) : "";
        label = place && st ? `${place}, ${st}` : st;
      } catch {
        // Reverse geocode failed; fall through with empty label.
      }
      if (!label) {
        const closest = US_STATES.find((s) => {
          const p = GEOCODED_LOCATIONS[s as keyof typeof GEOCODED_LOCATIONS] as
            | { lat: number; lng: number }
            | undefined;
          if (!p) return false;
          const dLat = p.lat - latitude;
          const dLng = p.lng - longitude;
          return dLat * dLat + dLng * dLng < 16;
        });
        label = closest ? stateAbbr(closest) : "";
      }
      update({ loc: label });
      setShowMap(true);
      setLimitToMap(true);
      setMapBounds({
        north: latitude + 2.2,
        south: latitude - 2.2,
        east: longitude + 3.2,
        west: longitude - 3.2,
      });
    } catch {
      // Permission denied or error — leave filters untouched.
    } finally {
      setLocating(false);
    }
  }, [update]);

  const categoryList = (
    <div className="space-y-0.5">
      {programCats.map(([c]) => (
        <CheckRow
          key={c}
          label={c}
          count={counts.catCounts.get(c) ?? 0}
          active={cats.includes(c)}
          onToggle={() => toggleCat(c)}
        />
      ))}
    </div>
  );

  const fieldSelect = (
    <FieldSelect
      value={field}
      onChange={(v) => update({ field: v })}
      fields={fields}
      counts={counts.fieldCounts}
      total={counts.fieldPool}
    />
  );

  const tagPills = (
    <div className="flex flex-wrap gap-1.5">
      {[...TAG_OPTIONS]
        .sort(
          (a, b) =>
            (counts.tagCounts.get(b.value) ?? 0) -
            (counts.tagCounts.get(a.value) ?? 0),
        )
        .map((t) => {
          const count = counts.tagCounts.get(t.value) ?? 0;
          const active = tags.includes(t.value);
          // Hide dead options unless one is currently selected.
          if (!active && count === 0) return null;
          return (
            <PillChip
              key={t.value}
              label={t.label}
              count={count}
              active={active}
              onClick={() => toggleTag(t.value)}
            />
          );
        })}
    </div>
  );

  const costControls = (
    <div className="space-y-2">
      <ToggleSwitch
        label="Free to enter"
        count={counts.freeCount}
        checked={cost === "free"}
        onChange={(v) => update({ cost: v ? "free" : "all" })}
      />
      <ToggleSwitch
        label="Pays students"
        count={counts.paidCount}
        checked={cost === "paid"}
        onChange={(v) => update({ cost: v ? "paid" : "all" })}
      />
    </div>
  );

  const formatControls = (
    <div className="space-y-2">
      <ToggleSwitch
        label="Online"
        count={counts.onlineCount}
        checked={format === "online"}
        onChange={(v) => update({ format: v ? "online" : "all" })}
      />
      <ToggleSwitch
        label="In-person"
        count={counts.inPersonCount}
        checked={format === "in-person"}
        onChange={(v) => update({ format: v ? "in-person" : "all" })}
      />
    </div>
  );

  const deadlineControl = (
    <div className="space-y-2">
      <RangeSlider
        value={windowMonths}
        onChange={(v) => update({ windowMonths: v })}
        min={0}
        max={12}
        label="Deadline window"
        formatLabel={(v) => (v === 0 ? "Any time" : `≤ ${v} mo`)}
      />
      <div className="flex gap-1.5">
        {[1, 3, 6, 12].map((m) => (
          <PillChip
            key={m}
            label={`${m} mo`}
            active={windowMonths === m}
            onClick={() => update({ windowMonths: windowMonths === m ? 0 : m })}
          />
        ))}
      </div>
    </div>
  );

  const effortControls = (
    <div className="flex flex-wrap gap-1.5">
      {(["Low", "Medium", "High"] as const).map((e) => (
        <PillChip
          key={e}
          label={e}
          count={
            e === "Low" ? counts.effortLow : e === "Medium" ? counts.effortMedium : counts.effortHigh
          }
          active={effort === e}
          onClick={() => update({ effort: effort === e ? "any" : e })}
        />
      ))}
    </div>
  );

  const gradeControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={grades.length === 0}
        onClick={() => update({ grades: [] })}
      />
      {GRADE_OPTIONS.map((g) => (
        <PillChip
          key={g}
          label={GRADE_LABELS[g] ?? g}
          count={counts.gradeCounts.get(g) ?? 0}
          active={grades.includes(g)}
          onClick={() =>
            update({
              grades: grades.includes(g)
                ? grades.filter((x) => x !== g)
                : [...grades, g],
            })
          }
        />
      ))}
    </div>
  );

  const selectivityControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={selectivity === "any"}
        onClick={() => update({ selectivity: "any" })}
      />
      <PillChip
        label="Open"
        count={counts.selOpen}
        active={selectivity === "Open"}
        onClick={() => update({ selectivity: selectivity === "Open" ? "any" : "Open" })}
      />
      <PillChip
        label="Moderate"
        count={counts.selModerate}
        active={selectivity === "Moderate"}
        onClick={() => update({ selectivity: selectivity === "Moderate" ? "any" : "Moderate" })}
      />
      <PillChip
        label="Selective"
        count={counts.selSelective}
        active={selectivity === "Selective"}
        onClick={() => update({ selectivity: selectivity === "Selective" ? "any" : "Selective" })}
      />
    </div>
  );

  const awardTierControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={awardTier === "any"}
        onClick={() => update({ awardTier: "any" })}
      />
      <PillChip
        label="Full tuition"
        count={counts.tierFull}
        active={awardTier === "full"}
        onClick={() => update({ awardTier: awardTier === "full" ? "any" : "full" })}
      />
      <PillChip
        label="$500–$2.5k"
        count={counts.tierMicro}
        active={awardTier === "micro"}
        onClick={() => update({ awardTier: awardTier === "micro" ? "any" : "micro" })}
      />
      <PillChip
        label="$2.5k–$10k"
        count={counts.tierMedium}
        active={awardTier === "medium"}
        onClick={() => update({ awardTier: awardTier === "medium" ? "any" : "medium" })}
      />
      <PillChip
        label="$10k+"
        count={counts.tierLarge}
        active={awardTier === "large"}
        onClick={() => update({ awardTier: awardTier === "large" ? "any" : "large" })}
      />
    </div>
  );

  const essayControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={essay === "any"}
        onClick={() => update({ essay: "any" })}
      />
      <PillChip
        label="Essay required"
        count={counts.essayRequired}
        active={essay === "required"}
        onClick={() => update({ essay: "required" })}
      />
      <PillChip
        label="No essay"
        count={counts.essayNone}
        active={essay === "no"}
        onClick={() => update({ essay: "no" })}
      />
    </div>
  );

  const deadlineTypeControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={deadlineType === "any"}
        onClick={() => update({ deadlineType: "any" })}
      />
      <PillChip
        label="Rolling"
        count={counts.rollingCount}
        active={deadlineType === "Rolling"}
        onClick={() => update({ deadlineType: deadlineType === "Rolling" ? "any" : "Rolling" })}
      />
      <PillChip
        label="Fixed date"
        count={counts.fixedCount}
        active={deadlineType === "Fixed"}
        onClick={() => update({ deadlineType: deadlineType === "Fixed" ? "any" : "Fixed" })}
      />
    </div>
  );

  const prestigeControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={prestige === "any"}
        onClick={() => update({ prestige: "any" })}
      />
      <PillChip
        label="Niche"
        count={counts.nicheCount}
        active={prestige === "Niche"}
        onClick={() => update({ prestige: prestige === "Niche" ? "any" : "Niche" })}
      />
      <PillChip
        label="Regional"
        count={counts.regionalCount}
        active={prestige === "Regional"}
        onClick={() => update({ prestige: prestige === "Regional" ? "any" : "Regional" })}
      />
      <PillChip
        label="National"
        count={counts.nationalCount}
        active={prestige === "National"}
        onClick={() => update({ prestige: prestige === "National" ? "any" : "National" })}
      />
    </div>
  );

  const resumeControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={resume === "any"}
        onClick={() => update({ resume: "any" })}
      />
      <PillChip
        label="Low"
        count={counts.resumeLow}
        active={resume === "Low"}
        onClick={() => update({ resume: resume === "Low" ? "any" : "Low" })}
      />
      <PillChip
        label="Medium"
        count={counts.resumeMedium}
        active={resume === "Medium"}
        onClick={() => update({ resume: resume === "Medium" ? "any" : "Medium" })}
      />
      <PillChip
        label="High"
        count={counts.resumeHigh}
        active={resume === "High"}
        onClick={() => update({ resume: resume === "High" ? "any" : "High" })}
      />
    </div>
  );

  const recControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={rec === "any"}
        onClick={() => update({ rec: "any" })}
      />
      <PillChip
        label="Rec required"
        count={counts.recYes}
        active={rec === "Yes"}
        onClick={() => update({ rec: rec === "Yes" ? "any" : "Yes" })}
      />
      <PillChip
        label="No rec"
        count={counts.recNo}
        active={rec === "No"}
        onClick={() => update({ rec: rec === "No" ? "any" : "No" })}
      />
    </div>
  );

  const compControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={comp === "any"}
        onClick={() => update({ comp: "any" })}
      />
      <PillChip
        label="Unpaid"
        count={counts.compUnpaid}
        active={comp === "unpaid"}
        onClick={() => update({ comp: comp === "unpaid" ? "any" : "unpaid" })}
      />
      <PillChip
        label="Paid"
        count={counts.compPaid}
        active={comp === "paid"}
        onClick={() => update({ comp: comp === "paid" ? "any" : "paid" })}
      />
    </div>
  );

  const scheduleControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={schedule === "any"}
        onClick={() => update({ schedule: "any" })}
      />
      <PillChip
        label="Summer"
        count={counts.summerCount}
        active={schedule === "summer"}
        onClick={() => update({ schedule: schedule === "summer" ? "any" : "summer" })}
      />
      <PillChip
        label="School year"
        count={counts.schoolYearCount}
        active={schedule === "schoolyear"}
        onClick={() => update({ schedule: schedule === "schoolyear" ? "any" : "schoolyear" })}
      />
    </div>
  );

  const lengthControl = (
    <div className="flex flex-wrap gap-1.5">
      <PillChip
        label="Any"
        active={length === "any"}
        onClick={() => update({ length: "any" })}
      />
      {PROGRAM_LENGTH_OPTIONS.map((p) => (
        <PillChip
          key={p.value}
          label={p.label}
          count={counts.lengthCounts.get(p.value) ?? 0}
          active={length === p.value}
          onClick={() => update({ length: length === p.value ? "any" : p.value })}
        />
      ))}
    </div>
  );

  const locationControl = (
    <div className="space-y-2">
      <input
        type="text"
        value={loc}
        onChange={(e) => update({ loc: e.target.value })}
        placeholder="City or state"
        className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
      />
      <button
        type="button"
        onClick={useMyLocation}
        disabled={locating}
        className={cn(
          "inline-flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition",
          "border-primary/40 bg-primary/5 text-primary hover:bg-primary/10",
          locating && "cursor-wait opacity-70",
        )}
      >
        <LocateFixed className={cn("h-4 w-4", locating && "animate-spin")} />
        {locating ? "Finding you…" : "Use my location"}
      </button>
      <button
        type="button"
        onClick={() => update({ loc: loc === "online" ? "" : "online" })}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border px-3 py-2.5 text-sm transition",
          loc === "online"
            ? "border-accent/50 bg-accent/10 font-medium text-accent"
            : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
        )}
      >
        Online / Nationwide
        <span className="text-xs tabular-nums text-muted-foreground">
          {counts.onlineLocCount}
        </span>
      </button>
    </div>
  );

  const sortControl = (
    <div className="flex flex-wrap gap-1.5">
      {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
        <PillChip
          key={s}
          label={SORT_LABELS[s]}
          active={sort === s}
          onClick={() => update({ sort: s })}
        />
      ))}
    </div>
  );

  const filterPanel = (
    <div className="flex flex-col gap-3">
      {/* Primary filters — the ones people reach for first, always visible. */}
      {tab === "programs" && (
        <FilterSection icon={ListFilter} title="Program type" forceOpen>
          {categoryList}
        </FilterSection>
      )}
      <FilterSection icon={Layers} title="Field" forceOpen>
        {fieldSelect}
      </FilterSection>
      {tab === "internships" && (
        <FilterSection icon={Wallet} title="Compensation" forceOpen>
          {compControl}
        </FilterSection>
      )}
      {tab === "scholarships" && (
        <FilterSection icon={Wallet} title="Award amount" forceOpen>
          {awardTierControl}
        </FilterSection>
      )}
      {tab !== "scholarships" && (
        <FilterSection icon={Wallet} title="Cost" forceOpen>
          {costControls}
        </FilterSection>
      )}
      <FilterSection icon={MapPin} title="Format" forceOpen>
        {formatControls}
      </FilterSection>
      <FilterSection icon={Timer} title="Deadline window" forceOpen>
        {deadlineControl}
      </FilterSection>
      <FilterSection icon={GraduationCap} title="Grade" forceOpen>
        {gradeControl}
      </FilterSection>

      {/* Everything granular lives here until it's needed. */}
      <FilterSection
        // Remount when the active count crosses zero so the section opens
        // itself the moment an advanced filter gets used (and closes after
        // they're all cleared). Manual toggles still win in between.
        key={advancedActive > 0 ? "open" : "closed"}
        icon={SlidersHorizontal}
        title="Advanced options"
        defaultOpen={advancedActive > 0}
        badge={advancedActive > 0 ? advancedActive : undefined}
      >
        {tab === "programs" && (
          <AdvancedGroup label="Program length">{lengthControl}</AdvancedGroup>
        )}
        {tab === "internships" && (
          <AdvancedGroup label="Schedule">{scheduleControl}</AdvancedGroup>
        )}
        {tab === "internships" && (
          <AdvancedGroup label="Resume value">{resumeControl}</AdvancedGroup>
        )}
        {tab === "programs" && (
          <AdvancedGroup label="Prestige">{prestigeControl}</AdvancedGroup>
        )}
        {tab !== "internships" && (
          <AdvancedGroup label="Application">{essayControl}</AdvancedGroup>
        )}
        {tab === "scholarships" && (
          <AdvancedGroup label="Recommendation">{recControl}</AdvancedGroup>
        )}
        <AdvancedGroup label="Deadline type">{deadlineTypeControl}</AdvancedGroup>
        <AdvancedGroup label="Selectivity">{selectivityControl}</AdvancedGroup>
        <AdvancedGroup label="Effort">{effortControls}</AdvancedGroup>
        <AdvancedGroup label="Open to">
          {tagPills}
          <p className="mt-2 text-[10px] text-muted-foreground">
            Opportunities specifically open to these groups.
          </p>
        </AdvancedGroup>
        <AdvancedGroup label="Location">{locationControl}</AdvancedGroup>
        <AdvancedGroup label="Sort">{sortControl}</AdvancedGroup>
      </FilterSection>

      {hasFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2.5 text-sm font-medium text-primary transition hover:border-primary/40"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <main className="mx-auto flex-1 px-4 py-10 sm:px-6 lg:max-w-[90rem] lg:px-12">
      {/* Styled search header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card/60 px-6 py-10 text-center sm:px-10">
        <div aria-hidden className="paper-grain absolute inset-0 opacity-70" />
        <div
          aria-hidden
          className="blueprint-grid absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]"
        />
        <span aria-hidden className="draft-corner draft-corner--tl hidden sm:block" />
        <span aria-hidden className="draft-corner draft-corner--tr hidden sm:block" />
        <div className="relative mx-auto max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Search {OPPORTUNITIES.length.toLocaleString()} verified programs
          </p>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Find your next opportunity
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Free, hand-checked internships, scholarships, competitions, and
            research programs for high school students.
          </p>
          <HeroSearch className="mt-7 w-full" onSearch={(q) => update({ q })} showPopular={false} />

          <div className="mt-6 flex flex-wrap items-center justify-center gap-1.5">
            <span className="mr-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Popular
            </span>
            {POPULAR_SEARCHES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => update({ q: q === t ? "" : t })}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  q === t
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
                )}
              >
                {t}
              </button>
            ))}
            <span className="mx-1 hidden h-4 w-px bg-border sm:inline-block" />
            {POPULAR_FIELDS.map((f) => (
              <button
                key={f.field}
                type="button"
                onClick={() => update({ field: field === f.field ? "All fields" : f.field })}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition",
                  field === f.field
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="flex rounded-2xl border border-border bg-card p-1 shadow-sm">
          {TAB_DEFS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => selectTab(t.id)}
                className={cn(
                  "relative rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:px-5",
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {t.label}
                <span
                  className={cn(
                    "ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums",
                    active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {tabCounts[t.id].toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        <p className="hidden text-sm text-muted-foreground md:inline">
          {TAB_DEFS.find((t) => t.id === tab)?.blurb}
        </p>

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowMap((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition",
              showMap
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            <MapIcon className="h-3.5 w-3.5" />
            {showMap ? "Hide map" : "Show map"}
          </button>
          <button
            type="button"
            onClick={() => setShowMobileFilters(true)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-medium transition lg:hidden",
              showMobileFilters || hasFilters
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeChips.length > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-primary-foreground">
                {activeChips.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-6 gap-8 lg:grid lg:grid-cols-[280px_1fr]">
        {/* Fixed left sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-6 max-h-[calc(100vh-3rem)] overflow-y-auto rounded-2xl border border-border bg-card/60 p-5 pb-8">
            <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
              <p className="flex items-center gap-1.5 text-sm font-semibold">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                {tab === "internships"
                  ? "Internship filters"
                  : tab === "scholarships"
                    ? "Scholarship filters"
                    : "Program filters"}
              </p>
              {hasFilters && (
                <button
                  onClick={clearAll}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset
                </button>
              )}
            </div>
            {filterPanel}
          </div>
        </aside>

        {/* Results column */}
        <div className="mt-6 min-w-0 lg:mt-0">
          {/* Map */}
          <AnimatePresence>
            {showMap && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="overflow-hidden"
              >
                <div className="mb-4">
                  <SearchMap
                    programs={mapPrograms}
                    onBoundsChange={setMapBounds}
                    className="h-[24rem]"
                  />
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setLimitToMap((v) => !v);
                        setPage(1);
                      }}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition",
                        limitToMap
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
                      )}
                    >
                      <Check className={cn("h-3.5 w-3.5", limitToMap ? "opacity-100" : "opacity-0")} />
                      Only show results in map area
                    </button>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/5 px-3.5 py-2 text-xs font-medium text-primary transition hover:bg-primary/10"
                    >
                      <LocateFixed className={cn("h-3.5 w-3.5", locating && "animate-spin")} />
                      {locating ? "Locating…" : "Set your location"}
                    </button>
                    <span className="text-xs text-muted-foreground">
                      Zoom to your region, then toggle &ldquo;map area only&rdquo;.
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results header */}
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <p className="mr-auto text-sm text-muted-foreground">
              {q ? (
                <>
                  <span className="font-semibold text-foreground">{results.length.toLocaleString()}</span>{" "}
                  result{results.length === 1 ? "" : "s"} for &quot;{q}&quot;
                </>
              ) : (
                <>
                  <span className="font-semibold text-foreground">{results.length.toLocaleString()}</span>{" "}
                  of {OPPORTUNITIES.length.toLocaleString()} verified programs
                </>
              )}
            </p>
            <AnimatePresence>
              {activeChips.map((chip) => (
                <motion.button
                  key={chip.key}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.15 }}
                  onClick={chip.clear}
                  className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                >
                  {chip.label}
                  <X className="h-3 w-3" />
                </motion.button>
              ))}
            </AnimatePresence>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card/50 p-12 text-center">
              <p className="text-lg font-semibold">No matches</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Try a broader term, or clear a filter above.
              </p>
              <button
                onClick={clearAll}
                className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <RotateCcw className="h-4 w-4" />
                Clear everything
              </button>
            </div>
          ) : (
            <>
              <div className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                {visibleResults.map((o) => (
                  <ResultRow
                    key={o.name}
                    o={o}
                    comparing={isComparing(slugify(o.name))}
                    onToggleCompare={() => toggleCompare(slugify(o.name))}
                  />
                ))}
              </div>
              {remaining > 0 && (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => setPage((p) => p + 1)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-primary transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    Show {Math.min(remaining, PAGE_SIZE).toLocaleString()} more
                    <span className="text-muted-foreground">
                      ({remaining.toLocaleString()} left)
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Compare tray */}
      <AnimatePresence>
        {compare.length > 0 && !showMobileFilters && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
          >
            <div className="flex items-center gap-3 rounded-full border border-border bg-card py-2 pl-4 pr-2 text-foreground shadow-2xl">
              <span className="inline-flex items-center gap-2 text-sm">
                <Scale className="h-4 w-4 text-primary" />
                <span className="font-semibold tabular-nums">{compare.length}/4</span>
                <span className="hidden text-muted-foreground sm:inline">selected</span>
              </span>
              <Link
                href="/compare"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Compare now
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <button
                type="button"
                onClick={clearCompare}
                aria-label="Clear compare list"
                className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile filter sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              key="sheet"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-3xl border-t border-border bg-background shadow-2xl lg:hidden"
            >
              <div className="px-5 pb-2 pt-3">
                <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-border" />
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">Filters</p>
                  {hasFilters && (
                    <button
                      onClick={clearAll}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset
                    </button>
                  )}
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
                {filterPanel}
              </div>
              <div className="border-t border-border bg-background p-4">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
                >
                  Show {results.length.toLocaleString()} result{results.length === 1 ? "" : "s"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------- Result row ---------- */

const ResultRow = memo(function ResultRow({
  o,
  comparing,
  onToggleCompare,
}: {
  o: Opportunity;
  comparing: boolean;
  onToggleCompare: () => void;
}) {
  return (
    <div className="group relative flex gap-3 p-4 transition hover:bg-muted/40 sm:gap-4 sm:p-5">
      <OrgFavicon
        host={o.host}
        name={o.org}
        size={44}
        className="mt-1 hidden min-w-[2.75rem] rounded-xl sm:inline-flex"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {o.field && (
            <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
              {o.field}
            </span>
          )}
          {o.category && o.category !== "Other" && (
            <span className="inline-flex rounded-md bg-accent/10 px-2 py-0.5 text-[11px] font-medium text-accent">
              {o.category}
            </span>
          )}
          {o.difficulty && (
            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              {o.difficulty}
            </span>
          )}
          {o.effort && (
            <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              Effort: {o.effort}
            </span>
          )}
          {o.stipend && (
            <span className="inline-flex rounded-md bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
              {o.stipend}
            </span>
          )}
        </div>
        <Link
          href={`/opportunity/${slugify(o.name)}`}
          className="text-lg font-semibold leading-snug transition hover:text-primary"
        >
          {o.name}
        </Link>
        {o.org && (
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span className="truncate">{o.org}</span>
          </p>
        )}
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {o.description || o.eligibility}
        </p>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
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
        </div>
        {o.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {o.tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleCompare}
            aria-pressed={comparing}
            aria-label={comparing ? `Remove ${o.name} from compare` : `Add ${o.name} to compare`}
            title={comparing ? "Remove from compare" : "Compare"}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border transition",
              comparing
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            <Scale className="h-4 w-4" />
          </button>
          <SaveCardButton slug={slugify(o.name)} />
        </div>
        <Link
          href={`/opportunity/${slugify(o.name)}`}
          className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground"
        >
          View
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
});

function initialTabFor(prefilter?: Record<string, string>): TabId {
  const cats = (prefilter?.category ?? "").split(",").map((c) => c.trim());
  if (cats.includes("Internship")) return "internships";
  if (cats.includes("Scholarship")) return "scholarships";
  return "programs";
}