"use client";

import { useCallback, useEffect, useState } from "react";
import { Star, MessageSquare, Send, ShieldCheck, AlertCircle, Loader2, Clock3 } from "lucide-react";
import { fetchProgramReviews, submitReview, type Review } from "@/lib/use-reviews";
import { cn } from "@/lib/utils";

type LoadedData = {
  reviews: Review[];
  average: number;
  count: number;
};

export function OpportunityReviews({ programName, slug }: { programName: string; slug: string }) {
  const [data, setData] = useState<LoadedData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [grade, setGrade] = useState("");

  const reload = useCallback(() => {
    fetchProgramReviews(programName, slug).then((r) =>
      setData({ reviews: r.reviews, average: r.average, count: r.count }),
    );
  }, [programName, slug]);

  useEffect(() => {
    reload();
  }, [reload]);

  const approved = data?.reviews.filter((r) => r.status === "approved") ?? [];
  const ownPending = data?.reviews.filter((r) => r.status === "pending") ?? [];
  const average = data?.average ?? 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;
    setSending(true);
    setError("");
    const result = await submitReview(programName, { author, grade, rating, text }, slug);
    setSending(false);
    if (!result.ok) {
      setError(result.error ?? "Could not submit your review.");
      return;
    }
    setText("");
    setAuthor("");
    setGrade("");
    setRating(5);
    setSubmitted(true);
    reload();
  };

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Student reviews</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            What students who did this program actually thought.
          </p>
        </div>
        {!submitted && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
          >
            <MessageSquare className="h-4 w-4" /> Write a review
          </button>
        )}
      </div>

      {/* Summary */}
      {data && (
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl border border-border/70 bg-background/50 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold tabular-nums">{average ? average.toFixed(1) : "—"}</span>
            <div>
              <div className="flex items-center gap-0.5 text-warning">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={cn("h-4 w-4", i < Math.round(average) ? "fill-current" : "opacity-25")} />
                ))}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {data.count} {data.count === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {data.count === 0 && ownPending.length === 0
              ? "No reviews yet. Be the first to share your experience."
              : data.count === 0
                ? "Reviews are moderated before they go live."
                : "Reviews are checked by a person before publishing."}
          </p>
        </div>
      )}

      {/* Approved reviews */}
      {approved.length > 0 && (
        <ul className="mt-5 space-y-4">
          {approved.map((r) => (
            <li key={r.id} className="rounded-xl border border-border/70 bg-background/40 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{r.author}</span>
                  {r.grade && <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{r.grade}</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={cn("h-3.5 w-3.5", i < r.rating ? "fill-current" : "opacity-25")} />
                    ))}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{r.date}</span>
                </div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-foreground/80">{r.text}</p>
            </li>
          ))}
        </ul>
      )}

      {/* Author's own queued reviews */}
      {ownPending.length > 0 && (
        <div className="mt-5 space-y-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Clock3 className="h-3.5 w-3.5 text-warning" /> Your submissions
          </p>
          {ownPending.map((r) => (
            <div key={r.id} className="rounded-xl border border-warning/25 bg-warning/5 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-0.5 text-[11px] font-semibold text-warning">
                  <Clock3 className="h-3 w-3" /> Awaiting approval
                </span>
                <span className="text-xs text-muted-foreground">{r.date}</span>
              </div>
              <p className="mt-2 text-sm italic text-foreground/75">{r.text}</p>
            </div>
          ))}
        </div>
      )}

      {submitted ? (
        <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">Thanks — your review is in the queue</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            We check every review by hand before it goes live. You can see its status above while you wait.
          </p>
          <button
            onClick={() => { setSubmitted(false); setShowForm(false); }}
            className="mt-4 text-sm font-medium text-primary hover:underline"
          >
            Submit another
          </button>
        </div>
      ) : showForm ? (
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">
              How would you rate this program? <span className="text-danger">*</span>
            </label>
            <div className="flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRating(i + 1)}
                  aria-label={`${i + 1} star${i ? "s" : ""}`}
                  className="text-warning transition hover:scale-110"
                >
                  <Star className={cn("h-7 w-7", i < rating ? "fill-current" : "opacity-30")} />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {rating === 5 ? "Loved it" : rating === 4 ? "Really good" : rating === 3 ? "It was okay" : rating === 2 ? "Mixed feelings" : "Didn&apos;t love it"}
              </span>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                First name or alias <span className="text-danger">*</span>
              </label>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Jamie or Alex"
                required
                maxLength={60}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">
                What grade were you in? <span className="text-danger">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5">
                {["9th", "10th", "11th", "12th", "College", "Other"].map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGrade(g)}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition",
                      grade === g
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">
                Your review <span className="text-danger">*</span>
              </label>
              <span className="text-xs text-muted-foreground">{text.length}/800</span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 800))}
              placeholder="What was the program actually like? What did you learn? What should others know going in?"
              rows={5}
              required
              minLength={20}
              className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <p className="mt-1.5 text-xs text-muted-foreground">
              We review every submission before publishing so nothing fake or harmful goes up.
            </p>
          </div>

          {error && (
            <p className="flex items-start gap-2 rounded-lg border border-danger/25 bg-danger/5 px-3 py-2 text-sm text-danger">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
              {sending ? "Submitting…" : "Submit for review"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-background/50 p-5 text-center text-sm text-muted-foreground">
          <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-accent" />
          Every review is checked by a person before it goes live, so the feedback here is real.
        </div>
      )}
    </section>
  );
}
