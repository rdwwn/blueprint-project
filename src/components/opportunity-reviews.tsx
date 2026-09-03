"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, ShieldCheck } from "lucide-react";
import { useReviews } from "@/lib/use-reviews";
import { cn } from "@/lib/utils";

export function OpportunityReviews({ programName }: { programName: string }) {
  const { addReview } = useReviews();
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [grade, setGrade] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !author.trim()) return;
    addReview(programName, { author, grade, rating, text });
    setText("");
    setAuthor("");
    setGrade("");
    setRating(5);
    setSubmitted(true);
  };

  return (
    <section className="mt-10 rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Share your experience</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Did you do this program? Tell other students what it was actually like.
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

      {submitted ? (
        <div className="mt-5 rounded-2xl border border-accent/30 bg-accent/5 p-6 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h3 className="mt-3 text-lg font-semibold">Thanks — your review is in our queue</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            We review every submission before it goes live. The best ones get published as Success Stories on our site (with your permission) so other students can learn from your experience.
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
          {/* Rating */}
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

          {/* Name + Grade */}
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

          {/* Review body */}
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
              We review every submission before publishing. The best reviews may be featured in our Success Stories.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95">
              <Send className="h-3.5 w-3.5" /> Submit for review
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 rounded-xl border border-dashed border-border bg-background/50 p-5 text-center text-sm text-muted-foreground">
          <ShieldCheck className="mx-auto mb-2 h-5 w-5 text-accent" />
          Your review will be reviewed by our team before being published. The best submissions get featured in our Success Stories.
        </div>
      )}
    </section>
  );
}
