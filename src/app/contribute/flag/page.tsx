"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import {
  ArrowRight,
  Flag,
  Link2,
  AlertCircle,
  CheckCircle,
  Clock,
  Mail,
  CalendarX,
  UserX,
  Loader2,
  ShieldCheck,
} from "lucide-react";
import { anonHeaders } from "@/lib/anon-id";
import { cn } from "@/lib/utils";

const ISSUE_TYPES = [
  { value: "dead-link", label: "Dead link", icon: Link2 },
  { value: "wrong-deadline", label: "Wrong deadline", icon: CalendarX },
  { value: "cancelled", label: "Program cancelled", icon: Clock },
  { value: "wrong-eligibility", label: "Wrong eligibility", icon: UserX },
  { value: "other", label: "Something else", icon: CheckCircle },
];

export default function FlagPage() {
  const [issueType, setIssueType] = useState<string>("");
  const [programName, setProgramName] = useState("");
  const [programUrl, setProgramUrl] = useState("");
  const [details, setDetails] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  // Prefill when arriving from a program page: /contribute/flag?program=<slug>&name=<name>
  useEffect(() => {
    try {
      const q = new URLSearchParams(window.location.search);
      const name = q.get("name");
      const slug = q.get("program");
      if (name || slug) {
        void Promise.resolve().then(() => {
          if (name) setProgramName(name);
          if (slug) setProgramUrl(`https://blueprintproject.app/opportunity/${slug}`);
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const canSubmit = issueType && details.trim().length >= 10 && !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "content-type": "application/json", ...anonHeaders() },
        body: JSON.stringify({
          issueType,
          details: details.trim(),
          opportunityName: programName.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not submit your report. Please email us instead.");
        setSending(false);
        return;
      }
      setDone(true);
    } catch {
      setError("Network error. Please try again or email us instead.");
      setSending(false);
    }
  };

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="mx-auto max-w-3xl flex-1 px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Flag className="h-3.5 w-3.5 text-accent" />
            CONTRIBUTE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Flag Incorrect Information</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Spot a dead link, outdated deadline, or wrong details? Tell us and we&apos;ll fix it. Reports land in a queue we check daily.
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-10 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Thanks — it&apos;s in our queue</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your report was filed. We verify each one against the program&apos;s official site and update listings that check out.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => { setDone(false); setIssueType(""); setProgramName(""); setProgramUrl(""); setDetails(""); }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
              >
                Flag another
              </button>
              <Link href="/opportunities" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40">
                Browse opportunities <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">What&apos;s wrong?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick the closest match.</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {ISSUE_TYPES.map((issue) => (
                  <button
                    key={issue.value}
                    type="button"
                    onClick={() => setIssueType(issue.value)}
                    aria-pressed={issueType === issue.value}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                      issueType === issue.value
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <issue.icon className="h-3.5 w-3.5" />
                    {issue.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">Which program?</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Program name</label>
                  <input
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    placeholder="e.g. NASA OSTEM High School Internship"
                    maxLength={200}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">Program page URL</label>
                  <input
                    value={programUrl}
                    onChange={(e) => setProgramUrl(e.target.value)}
                    placeholder="https://blueprintproject.app/opportunity/..."
                    maxLength={500}
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  What&apos;s incorrect? <span className="text-danger">*</span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value.slice(0, 2000))}
                  placeholder="Tell us what you found. Include the correct info if you know it — e.g. the real deadline, the working link, or why the program is no longer running."
                  rows={5}
                  required
                  minLength={10}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">{details.length}/2000</p>
              </div>
            </section>

            {error && (
              <p className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <a
                href="mailto:contact@blueprintproject.app?subject=Flagged%20Program"
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
              >
                <Mail className="h-3.5 w-3.5" /> Prefer email? Write us instead
              </a>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flag className="h-4 w-4" />}
                {sending ? "Submitting…" : "Submit report"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">What happens next</h2>
          <div className="mt-4 space-y-3">
            {[
              { step: "1", title: "It lands in our queue", desc: "Your report is logged with everything you wrote, ready for review." },
              { step: "2", title: "We verify it", desc: "We check the program's official website and documentation." },
              { step: "3", title: "We fix the listing", desc: "Confirmed issues get corrected — usually within 48 hours." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <span className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">{item.step}</span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
