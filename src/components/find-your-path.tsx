"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Laptop,
  LocateFixed,
  MapPin,
  Palette,
  PenLine,
  Scale,
  Sparkles,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { stateAbbr } from "@/lib/geocoded-locations";

type FieldKey =
  | "cs"
  | "premed"
  | "business"
  | "policy"
  | "arts"
  | "environment"
  | "journalism"
  | "education"
  | "humanities";

type FieldOption = { value: FieldKey; label: string; icon: LucideIcon };

const FIELDS: FieldOption[] = [
  { value: "cs", label: "CS & Engineering", icon: Laptop },
  { value: "premed", label: "Medicine & Health", icon: FlaskConical },
  { value: "business", label: "Business & Finance", icon: Sparkles },
  { value: "policy", label: "Law, Politics & Public", icon: Scale },
  { value: "arts", label: "Arts, Design & Music", icon: Palette },
  { value: "environment", label: "Space, Earth & Environment", icon: Globe },
  { value: "journalism", label: "Journalism & Media", icon: PenLine },
  { value: "education", label: "Education & Teaching", icon: GraduationCap },
  { value: "humanities", label: "Humanities & Social Science", icon: PenLine },
];

const SUB_FIELDS: Record<FieldKey, string[]> = {
  cs: ["AI and data", "Apps and software", "Robotics and hardware", "Math and theory"],
  premed: ["Lab research", "Patient care", "Public health", "Brain and behavior"],
  business: ["Startups", "Finance", "Marketing", "Social enterprise"],
  policy: ["Government", "Advocacy", "International relations", "Constitutional law"],
  arts: ["Visual art", "Graphic design", "Film & media", "Music"],
  environment: ["Climate science", "Conservation", "Sustainability", "Marine biology"],
  journalism: ["News reporting", "Podcast / audio", "Video production", "Data journalism"],
  education: ["Teaching", "Curriculum design", "Tutoring", "Education policy"],
  humanities: ["History", "Philosophy", "Languages", "Cultural studies"],
};

const WORK_TYPES = ["Build something", "Compete / Olympiads", "Research / Papers", "Lead and advocate", "Teach and serve"];
const GRADES = ["Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SOURCE_OPTIONS = ["Instagram", "TikTok", "Friends", "Google", "ChatGPT or AI", "Somewhere else"];
const STEP_LABELS = ["Your interests", "Focus area", "Work style", "Grade level", "Location", "Your match"];

const QUIZ_COMPLETED_KEY = "bp_quiz_completed";

export function FindYourPath() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [fields, setFields] = useState<FieldKey[]>([]);
  const [subFields, setSubFields] = useState<string[]>([]);
  const [workTypes, setWorkTypes] = useState<string[]>([]);
  const [grade, setGrade] = useState("");
  const [location, setLocation] = useState("");
  const [source, setSource] = useState("");
  const [locating, setLocating] = useState(false);

  const reset = useCallback(() => {
    setStep(0);
    setFields([]);
    setSubFields([]);
    setWorkTypes([]);
    setGrade("");
    setLocation("");
    setSource("");
  }, []);

  // Always open the quiz (for "Find Your Path" button)
  const requestOpen = useCallback(() => {
    reset();
    setOpen(true);
    return true;
  }, [reset]);

  // Check if quiz has been completed this session
  const isQuizCompleted = useCallback(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(QUIZ_COMPLETED_KEY) === "true";
  }, []);

  // Mark quiz as completed
  const markQuizCompleted = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(QUIZ_COMPLETED_KEY, "true");
    }
  }, []);

  useEffect(() => {
    const w = window as unknown as {
      __openFindYourPath?: () => boolean;
      __isQuizCompleted?: () => boolean;
    };
    w.__openFindYourPath = requestOpen;
    w.__isQuizCompleted = isQuizCompleted;
    return () => {
      delete w.__openFindYourPath;
      delete w.__isQuizCompleted;
    };
  }, [requestOpen, isQuizCompleted]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);
  const canAdvance =
    step === 0 ? fields.length > 0 :
    step === 1 ? subFields.length > 0 :
    step === 2 ? workTypes.length > 0 :
    step === 3 ? grade !== "" :
    step === 4 ? true :
    source !== "";

  const buildSearchUrl = useCallback(() => {
    const params = new URLSearchParams();
    const fieldLabels = fields
      .map((v) => FIELDS.find((item) => item.value === v)?.label)
      .filter(Boolean) as string[];
    if (fieldLabels.length > 0) params.set("field", fieldLabels.join(","));
    if (subFields.length > 0) params.set("subFields", subFields.join(","));
    if (grade) params.set("grade", grade.replace("Grade ", ""));
    if (location) params.set("loc", location);
    return `/opportunities?${params.toString()}`;
  }, [fields, subFields, grade, location]);

  // Geocode the browser location to a "City, State" string so the search
  // results can center on the student's area.
  const useMyLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) return;
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
        const st = a.state ? stateAbbr(a.state) : "";
        label = place && st ? `${place}, ${st}` : st;
      } catch {
        // Reverse geocode failed; leave the label empty.
      }
      setLocation(label);
    } catch {
      // Permission denied or unavailable.
    } finally {
      setLocating(false);
    }
  }, []);

  const finish = () => {
    markQuizCompleted();
    setOpen(false);
    router.push(buildSearchUrl());
  };

  const toggle = (value: string, setter: (next: string[]) => void, selected: string[]) => {
    setter(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 28 }}
          transition={{ type: "spring", damping: 26, stiffness: 260 }}
          className="fixed inset-0 z-[100] overflow-y-auto bg-background"
        >
          <div className="relative mx-auto min-h-full max-w-4xl px-4 py-5 sm:px-8 sm:py-10">
            <div aria-hidden className="blueprint-grid pointer-events-none absolute inset-0 opacity-[0.1] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />
            <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-[0_24px_80px_-36px_rgba(27,42,74,0.45)]">
              <div className="pointer-events-none absolute -left-40 top-1/2 hidden -translate-y-1/2 opacity-[0.06] lg:block">
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-64 w-64">
                  <circle cx="100" cy="100" r="96" stroke="#1e58d6" strokeWidth="1.5" />
                  <circle cx="100" cy="100" r="88" stroke="#1e58d6" strokeWidth="0.75" />
                  <polygon points="100,8 106,80 100,72 94,80" fill="#1e58d6" />
                  <polygon points="100,192 106,120 100,128 94,120" fill="#1e58d6" fillOpacity="0.4" />
                  <polygon points="8,100 80,94 72,100 80,106" fill="#1e58d6" fillOpacity="0.4" />
                  <polygon points="192,100 120,94 128,100 120,106" fill="#1e58d6" fillOpacity="0.4" />
                  <polygon points="32,32 84,84 78,78" fill="#1e58d6" fillOpacity="0.3" />
                  <polygon points="168,32 116,84 122,78" fill="#1e58d6" fillOpacity="0.3" />
                  <polygon points="32,168 84,116 78,122" fill="#1e58d6" fillOpacity="0.3" />
                  <polygon points="168,168 116,116 122,122" fill="#1e58d6" fillOpacity="0.3" />
                  <circle cx="100" cy="100" r="4" fill="#1e58d6" />
                  <circle cx="100" cy="100" r="2" fill="white" />
                  <text x="100" y="30" textAnchor="middle" fill="#1e58d6" fontSize="12" fontWeight="700" fontFamily="sans-serif">N</text>
                  <text x="100" y="180" textAnchor="middle" fill="#1e58d6" fontSize="12" fontWeight="700" fontFamily="sans-serif" opacity="0.4">S</text>
                  <text x="178" y="105" textAnchor="middle" fill="#1e58d6" fontSize="12" fontWeight="700" fontFamily="sans-serif" opacity="0.4">E</text>
                  <text x="22" y="105" textAnchor="middle" fill="#1e58d6" fontSize="12" fontWeight="700" fontFamily="sans-serif" opacity="0.4">W</text>
                </svg>
              </div>
              <div className="h-2 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="p-5 sm:p-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Compass className="h-5 w-5" />
                    </span>
                    <div>
                      <h1 className="text-lg font-semibold">Find Your Path</h1>
                      <p className="text-xs text-muted-foreground">{STEP_LABELS[step]} · Step {step + 1} of 6</p>
                    </div>
                  </div>
                  <button type="button" onClick={close} aria-label="Close quiz" className="rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mt-6 flex gap-1.5" aria-label={`Step ${step + 1} of 6`}>
                  {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} className={cn("h-1.5 flex-1 rounded-full transition-colors duration-300", index <= step ? "bg-primary" : "bg-muted")} />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -24 }}
                    transition={{ duration: 0.24, ease: "easeOut" }}
                    className="relative mt-8"
                  >
                    {step === 0 && <Step0 selected={fields} onToggle={(value) => toggle(value, (next) => setFields(next as FieldKey[]), fields)} />}
                    {step === 1 && <Step1 fields={fields} selected={subFields} onToggle={(value) => toggle(value, setSubFields, subFields)} />}
                    {step === 2 && <Step2 selected={workTypes} onToggle={(value) => toggle(value, setWorkTypes, workTypes)} />}
                    {step === 3 && <Step3 grade={grade} onSelect={setGrade} />}
                    {step === 4 && (
                      <Step4
                        location={location}
                        onChange={setLocation}
                        locating={locating}
                        onLocate={useMyLocation}
                      />
                    )}
                    {step === 5 && <StepMatch grade={grade} fields={fields} source={source} onSelect={setSource} />}
                  </motion.div>
                </AnimatePresence>

                <div className="mt-9 flex items-center justify-between border-t border-border pt-5">
                  {step > 0 ? (
                    <button type="button" onClick={() => setStep((value) => value - 1)} className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : (
                    <button type="button" onClick={() => { close(); router.push("/opportunities"); }} className="rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground">Skip for now</button>
                  )}
                  {step < 5 ? (
                    <button type="button" onClick={() => setStep((value) => value + 1)} disabled={!canAdvance} className={cn("inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition", canAdvance ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-not-allowed bg-muted text-muted-foreground")}>
                      Next <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button type="button" onClick={finish} disabled={!canAdvance} className={cn("inline-flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold transition", canAdvance ? "bg-primary text-primary-foreground hover:bg-primary/90" : "cursor-not-allowed bg-muted text-muted-foreground")}>
                      See my matches <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OptionButton({ active, children, onClick, className }: { active: boolean; children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={cn("rounded-2xl border p-5 text-left text-sm font-medium transition-all sm:p-6", active ? "border-primary bg-primary/10 text-primary shadow-sm" : "border-border bg-card hover:border-primary/40 hover:bg-muted", className)}>
      {children}
    </button>
  );
}

function Step0({ selected, onToggle }: { selected: FieldKey[]; onToggle: (value: FieldKey) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What fields spark your interest?</h2>
      <p className="mt-3 text-muted-foreground">Pick your main direction, then add up to two more.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {FIELDS.map((field) => {
          const active = selected.includes(field.value);
          return <OptionButton key={field.value} active={active} onClick={() => onToggle(field.value)} className="flex min-h-28 flex-col items-center justify-center gap-3 text-center"><field.icon className="h-7 w-7" />{field.label}</OptionButton>;
        })}
      </div>
    </div>
  );
}

function Step1({ fields, selected, onToggle }: { fields: FieldKey[]; selected: string[]; onToggle: (value: string) => void }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What part of those fields pulls you in?</h2>
      <p className="mt-3 text-muted-foreground">Pick every focus that fits across your selected fields.</p>
      <div className="mt-6 space-y-6">
        {fields.map((field) => {
          const label = FIELDS.find((item) => item.value === field)?.label ?? field;
          return <div key={field}><h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</h3><div className="grid grid-cols-2 gap-3">{SUB_FIELDS[field].map((option) => <OptionButton key={option} active={selected.includes(option)} onClick={() => onToggle(option)}>{option}</OptionButton>)}</div></div>;
        })}
      </div>
    </div>
  );
}

function Step2({ selected, onToggle }: { selected: string[]; onToggle: (value: string) => void }) {
  return <div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What kind of work sounds exciting?</h2><p className="mt-3 text-muted-foreground">Pick every kind of work you would enjoy.</p><div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">{WORK_TYPES.map((option) => <OptionButton key={option} active={selected.includes(option)} onClick={() => onToggle(option)}>{option}</OptionButton>)}</div></div>;
}

function Step3({ grade, onSelect }: { grade: string; onSelect: (value: string) => void }) {
  return <div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">What grade are you in?</h2><p className="mt-3 text-muted-foreground">Your grade helps prioritize opportunities that fit your timeline.</p><div className="mt-6 grid gap-3 sm:grid-cols-2">{GRADES.map((option) => <OptionButton key={option} active={grade === option} onClick={() => onSelect(option)} className="flex items-center gap-3"><GraduationCap className="h-5 w-5 shrink-0" />{option}</OptionButton>)}</div></div>;
}

function Step4({ location, onChange, locating, onLocate }: { location: string; onChange: (value: string) => void; locating: boolean; onLocate: () => void }) {
  return <div><h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Where are you based?</h2><p className="mt-3 text-muted-foreground">Tell us where you are so nearby and virtual options both stay in the mix.</p><div className="mt-6 relative"><MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" /><input type="text" value={location} onChange={(event) => onChange(event.target.value)} placeholder="e.g. Austin, TX or Online" className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-4 text-sm outline-none transition focus:border-primary/60 focus:ring-4 focus:ring-primary/10" /></div><button type="button" onClick={onLocate} disabled={locating} className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-wait disabled:opacity-60"><LocateFixed className={cn("h-4 w-4", locating && "animate-spin")} />{locating ? "Finding you…" : "Use my location"}</button><div className="mt-4 flex flex-wrap gap-2">{["Online", "Nationwide", "Skip for now"].map((option) => <button key={option} type="button" onClick={() => onChange(option === "Skip for now" ? "" : option)} className={cn("rounded-xl border px-4 py-2.5 text-xs font-medium transition", location === option || (option === "Skip for now" && !location) ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary")}>{option}</button>)}</div></div>;
}

function StepMatch({ grade, fields, source, onSelect }: { grade: string; fields: FieldKey[]; source: string; onSelect: (value: string) => void }) {
  const labels = fields.map((field) => FIELDS.find((item) => item.value === field)?.label).filter(Boolean).join(", ");
  return <div><div className="rounded-2xl border border-border bg-card p-5 sm:p-6"><div className="flex items-start gap-3"><span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground"><Sparkles className="h-5 w-5" /></span><div><p className="text-xs font-semibold uppercase tracking-wider text-primary">Your preview</p><p className="mt-1 text-lg font-semibold">We&apos;ll find programs matching {labels || "your interests"} for {grade}.</p><p className="mt-2 text-sm text-muted-foreground">Every match is free to apply or offers funding. You can refine the results next.</p></div></div></div><h2 className="mt-8 text-2xl font-semibold tracking-tight sm:text-3xl">One last question</h2><p className="mt-3 text-muted-foreground">How did you find Blueprint Project?</p><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{SOURCE_OPTIONS.map((option) => <OptionButton key={option} active={source === option} onClick={() => onSelect(option)} className="p-4 text-xs sm:p-5 sm:text-sm">{source === option && <Check className="mr-2 inline h-4 w-4" />}{option}</OptionButton>)}</div></div>;
}
