"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { isQuizCompleted } from "@/lib/quiz-trigger";

const PLACEHOLDERS = [
  "Try 'MITES Summer'",
  "Search paid internships",
  "Find scholarships for seniors",
  "AI summer programs",
  "Free research opportunities",
  "Competitions for engineers",
  "Programs for 11th graders",
];

type Props = {
  className?: string;
  onSearch?: (q: string) => void;
  vanish?: boolean;
  showPopular?: boolean;
};

export function HeroSearch({ className, onSearch, showPopular = true }: Props) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (focused) return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 3000);
    return () => clearInterval(id);
  }, [focused]);

  const handleSubmit = () => {
    const q = query.trim();
    if (!q) return;
    if (isQuizCompleted()) {
      onSearch?.(q);
      return;
    }
    const open = window.__openFindYourPath;
    if (typeof open === "function" && open()) return;
    onSearch?.(q);
  };

  return (
    <div className={cn("relative w-full", className)}>
      <div
        className={cn(
          "flex items-center rounded-2xl border bg-card px-4 py-3.5 transition-all",
          focused
            ? "border-primary/60 ring-4 ring-primary/10 shadow-xl"
            : "border-border shadow-md",
        )}
      >
        <Search className="mr-3 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="relative min-w-0 flex-1">
          {/* Cycling placeholder rendered as an animated overlay pinned to the
              input's exact position — crossfades between phrases instead of
              hard-cutting, and disappears while typing or focused. */}
          <AnimatePresence initial={false}>
            {!focused && query === "" && (
              <motion.span
                key={PLACEHOLDERS[placeholderIndex]}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
                className="pointer-events-none absolute inset-y-0 left-0 flex items-center whitespace-nowrap text-base text-muted-foreground"
              >
                {PLACEHOLDERS[placeholderIndex]}
              </motion.span>
            )}
          </AnimatePresence>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Search opportunities"
            className="relative w-full bg-transparent pr-4 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="ml-3 inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 active:scale-95"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>

      {/* Quick filter chips */}
      {showPopular && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          <span className="text-xs text-muted-foreground">Popular:</span>
          {["Summer", "Paid", "Free", "Online", "For 11th", "Research"].map((tag) => (
            <button
              key={tag}
              onClick={() => onSearch?.(tag)}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-primary"
            >
              {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
