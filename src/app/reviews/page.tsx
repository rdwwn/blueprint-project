"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowUpRight, MessageSquare, Star, ThumbsUp, Sparkles, X } from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { slugify } from "@/lib/slug";
import { useReviews } from "@/lib/use-reviews";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

const CATEGORIES = ["All", "Internship", "Competition", "Scholarship", "Research", "Summer Program"];

export default function ReviewsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const { reviews, getAverage, getCount } = useReviews();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return OPPORTUNITIES.filter((o) => {
      if (q && !o.name.toLowerCase().includes(q) && !(o.org ?? "").toLowerCase().includes(q)) return false;
      if (category !== "All" && o.category !== category) return false;
      return true;
    }).slice(0, 50);
  }, [search, category]);

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 text-accent" />
              <span>Student Reviews</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Reviews from real students
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Honest reviews from students who actually did the program. Filter by category and share your own experience.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-6 py-10 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search programs..."
              className="flex-1 min-w-[200px] rounded-full border border-border bg-card px-4 py-2 text-sm outline-none focus:border-primary"
            />
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    category === c ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40",
                  )}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((o) => {
              const avg = getAverage(o.name);
              const count = getCount(o.name);
              return (
                <div key={o.name} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:border-primary/40">
                  <div className="flex items-start gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="line-clamp-2 font-semibold">{o.name}</h3>
                      {o.org && <p className="mt-0.5 text-xs text-muted-foreground">{o.org}</p>}
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-0.5 text-warning">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={cn("h-3.5 w-3.5", i < Math.round(avg) ? "fill-current" : "opacity-30")} />
                        ))}
                      </div>
                      <span className="text-[10px] text-muted-foreground">{count} {count === 1 ? "review" : "reviews"}</span>
                    </div>
                  </div>
                  {reviews[o.name]?.slice(0, 1).map((r: { id: string; text: string; author: string; grade: string }) => (
                    <div key={r.id} className="rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
                      <p className="line-clamp-3 italic text-foreground/80">&ldquo;{r.text}&rdquo;</p>
                      <p className="mt-1 text-xs text-muted-foreground">— {r.author}, {r.grade}</p>
                    </div>
                  ))}
                  <Link
                    href={`/opportunity/${slugify(o.name)}`}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-semibold transition hover:border-primary/40"
                  >
                    Read & review <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
