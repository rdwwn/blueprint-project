"use client";

import { useState } from "react";
import { Mail, MessageSquare, Star, ThumbsUp, ThumbsDown, Lightbulb, Bug, Heart, Send, Check, Copy, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

type FeedbackKind = "general" | "feature" | "bug" | "press" | "partnership";

const FEEDBACK_KINDS: { value: FeedbackKind; label: string; icon: typeof Star; color: string }[] = [
  { value: "general", label: "General feedback", icon: MessageSquare, color: "bg-primary/10 text-primary" },
  { value: "feature", label: "Feature request", icon: Lightbulb, color: "bg-warning/10 text-warning" },
  { value: "bug", label: "Bug report", icon: Bug, color: "bg-danger/10 text-danger" },
  { value: "press", label: "Press inquiry", icon: Mail, color: "bg-accent/10 text-accent" },
  { value: "partnership", label: "Partnership", icon: Heart, color: "bg-success/10 text-success" },
];

export default function FeedbackPage() {
  const [open, setOpen] = useState<FeedbackKind | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const body = `Hi Blueprint team,

[Your message here]

---
From: ${name || "(your name)"} <${email || "(your email)"}>
Sent from: The Blueprint Project feedback form`;

  const openMail = () => {
    const subject = FEEDBACK_KINDS.find((k) => k.value === open)?.label || "Feedback";
    const href = `mailto:contact@blueprintproject.app?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body + (message ? "\n\n" + message : ""))}`;
    window.location.href = href;
  };

  const copyToClipboard = async () => {
    const text = `To: contact@blueprintproject.app\nSubject: ${FEEDBACK_KINDS.find((k) => k.value === open)?.label || "Feedback"}\n\n${body + (message ? "\n\n" + message : "")}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  const close = () => {
    setOpen(null);
    setSubmitted(false);
    setMessage("");
  };

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="mx-auto max-w-3xl flex-1 px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-accent" />
            CONTRIBUTE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Share Feedback</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Your experience helps us improve. Tell us what works, what doesn&apos;t, and what you&apos;d like to see.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Quick reaction</h2>
            <p className="mt-2 text-sm text-muted-foreground">How&apos;s your experience so far?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: ThumbsUp, label: "Love it", color: "bg-success/10 text-success" },
                { icon: Heart, label: "Useful", color: "bg-accent/10 text-accent" },
                { icon: Lightbulb, label: "Has potential", color: "bg-primary/10 text-primary" },
                { icon: ThumbsDown, label: "Needs work", color: "bg-warning/10 text-warning" },
                { icon: Bug, label: "Found a bug", color: "bg-danger/10 text-danger" },
              ].map((r) => (
                <button
                  key={r.label}
                  type="button"
                  onClick={() => setOpen("general")}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:shadow-sm",
                    r.color,
                  )}
                >
                  <r.icon className="h-3.5 w-3.5" />
                  {r.label}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">What kind of feedback?</h2>
            <p className="mt-2 text-sm text-muted-foreground">Pick a category to send us a message. Opens an in-app form.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {FEEDBACK_KINDS.map((k) => (
                <button
                  key={k.value}
                  type="button"
                  onClick={() => setOpen(k.value)}
                  className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-4 text-left transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <span className={cn("inline-flex h-10 w-10 items-center justify-center rounded-xl transition group-hover:scale-110", k.color)}>
                    <k.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{k.label}</p>
                    <p className="text-xs text-muted-foreground">Opens form</p>
                  </div>
                  <Send className="h-3.5 w-3.5 text-muted-foreground transition group-hover:text-primary" />
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">What we&apos;re working on</h2>
            <ul className="mt-4 space-y-3">
              {[
                "Better recommendation engine based on your saved programs",
                "Email deadline reminders (opt-in)",
                "More granular filters for every program type",
                "Student reviews and ratings for each opportunity",
                "College admissions timeline integration",
                "Parent/educator dashboard view",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 rounded-lg bg-muted/50 p-3">
                  <span className="flex-shrink-0 mt-0.5 h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-foreground/50 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <div
            className="relative w-full max-w-lg rounded-2xl border border-border bg-background p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="py-6 text-center">
                <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="h-6 w-6" />
                </div>
                <h3 className="mt-3 text-lg font-semibold">Thanks — your message is ready</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We&apos;ve prepared an email to contact@blueprintproject.app. Choose how to send it:
                </p>
                <div className="mt-5 flex justify-center gap-2">
                  <button
                    type="button"
                    onClick={openMail}
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
                  >
                    <Mail className="h-4 w-4" /> Open email
                  </button>
                  <button
                    type="button"
                    onClick={copyToClipboard}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40"
                  >
                    {copied ? <><Check className="h-4 w-4 text-success" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className="mt-4 text-sm text-muted-foreground transition hover:text-foreground"
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold">
                    {FEEDBACK_KINDS.find((k) => k.value === open)?.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tell us what&apos;s on your mind. We&apos;ll prepare an email for you to send.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Your name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Your email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Message</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us more..."
                    rows={6}
                    required
                    className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={close} className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground">
                    Cancel
                  </button>
                  <button type="submit" disabled={!message.trim()} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-50">
                    <Send className="h-4 w-4" /> Prepare email
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
