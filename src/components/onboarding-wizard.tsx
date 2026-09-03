"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Code,
  FlaskConical,
  Globe,
  Laptop,
  MapPin,
  Microscope,
  PenLine,
  Rocket,
  Sun,
  Trophy,
  X,
  GraduationCap,
  Building2,
  Scale,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "blueprint_onboarded";

const STEPS = [
  {
    question: "What interests you?",
    subtitle: "Pick one or more subjects you want to explore.",
    multiple: true,
    options: [
      { value: "CS & Engineering", label: "Engineering", icon: Code, field: "CS & Engineering" },
      { value: "Medicine & Health", label: "Medicine", icon: FlaskConical, field: "Medicine & Health" },
      { value: "Space, Earth & Environment", label: "Space", icon: Rocket, field: "Space, Earth & Environment" },
      { value: "Business & Finance", label: "Business", icon: Building2, field: "Business & Finance" },
      { value: "Law, Politics & Public", label: "Law", icon: Scale, field: "Law, Politics & Public" },
      { value: "Arts, Design & Music", label: "Arts", icon: Palette, field: "Arts, Design & Music" },
      { value: "Journalism & Media", label: "Writing", icon: PenLine, field: "Journalism & Media" },
    ],
  },
  {
    question: "When are you free?",
    subtitle: "This helps us find programs that fit your schedule.",
    multiple: false,
    options: [
      { value: "summer", label: "Summer", icon: Sun, season: "summer" },
      { value: "school", label: "School year", icon: GraduationCap, season: "school" },
      { value: "all", label: "Both", icon: Trophy, season: "all" },
    ],
  },
  {
    question: "How do you want to participate?",
    subtitle: "Pick your preferred format.",
    multiple: false,
    options: [
      { value: "online", label: "Online", icon: Laptop, format: "online" },
      { value: "in-person", label: "In person", icon: MapPin, format: "in-person" },
      { value: "all", label: "No preference", icon: Globe, format: "all" },
    ],
  },
  {
    question: "You're all set!",
    subtitle: "We'll find programs that match your interests.",
    multiple: false,
    options: [],
  },
];

export function OnboardingWizard() {
  const router = useRouter();
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !localStorage.getItem(STORAGE_KEY);
    } catch {
      return false;
    }
  });
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<Record<number, string[]>>({
    0: [],
    1: [],
    2: [],
  });

  const close = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  }, []);

  const toggle = useCallback(
    (value: string) => {
      const s = STEPS[step];
      if (s.multiple) {
        setSelected((prev) => {
          const list = prev[step] ?? [];
          const next = list.includes(value)
            ? list.filter((v) => v !== value)
            : [...list, value];
          return { ...prev, [step]: next };
        });
      } else {
        setSelected((prev) => ({ ...prev, [step]: [value] }));
      }
    },
    [step],
  );

  const goNext = useCallback(() => {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      const fields = selected[0] ?? [];
      const seasons = selected[1] ?? [];
      const formats = selected[2] ?? [];

      const params = new URLSearchParams();
      if (fields.length === 1) params.set("field", fields[0]);
      if (seasons[0] && seasons[0] !== "all") params.set("season", seasons[0]);
      if (formats[0] && formats[0] !== "all") params.set("format", formats[0]);

      close();
      router.push(`/search?${params.toString()}`);
    }
  }, [step, selected, close, router]);

  const skip = useCallback(() => {
    close();
  }, [close]);

  if (!show) return null;

  const current = STEPS[step];
  const hasSelection = current.options.length === 0 || (selected[step]?.length ?? 0) > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative mx-4 w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-2xl"
          >
            <button
              type="button"
              onClick={skip}
              className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-2 flex items-center gap-2">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    i <= step ? "bg-primary" : "bg-muted",
                  )}
                />
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h2 className="mt-6 text-2xl font-semibold tracking-tight">
                  {current.question}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {current.subtitle}
                </p>

                {current.options.length > 0 && (
                  <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {current.options.map((opt) => {
                      const active = selected[step]?.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => toggle(opt.value)}
                          className={cn(
                            "flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm font-medium transition-all",
                            active
                              ? "border-primary bg-primary/10 text-primary shadow-sm"
                              : "border-border bg-background hover:border-primary/40 hover:bg-muted",
                          )}
                        >
                          <opt.icon className="h-5 w-5" />
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

                {current.options.length === 0 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                      <Rocket className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={skip}
                className="text-sm text-muted-foreground transition hover:text-foreground"
              >
                Skip
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={!hasSelection && current.options.length > 0}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition",
                  hasSelection || current.options.length === 0
                    ? "bg-primary text-primary-foreground hover:bg-primary/95"
                    : "cursor-not-allowed bg-muted text-muted-foreground",
                )}
              >
                {step === STEPS.length - 1 ? "Explore programs" : "Next"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
