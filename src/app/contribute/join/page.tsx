"use client";

import { useState } from "react";
import Link from "next/link";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import {
  ArrowRight,
  HandHeart,
  AlertCircle,
  CheckCircle,
  Code2,
  Palette,
  Megaphone,
  GraduationCap,
  Microscope,
  Loader2,
} from "lucide-react";
import { anonHeaders } from "@/lib/anon-id";
import { cn } from "@/lib/utils";

const ROLES = [
  { value: "coding", label: "Coding", icon: Code2 },
  { value: "design", label: "Design", icon: Palette },
  { value: "outreach", label: "Outreach", icon: Megaphone },
  { value: "ambassadors", label: "School ambassadors", icon: GraduationCap },
  { value: "research", label: "Program research", icon: Microscope },
  { value: "other", label: "Something else", icon: HandHeart },
];

export default function JoinPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [grade, setGrade] = useState("");
  const [helpWith, setHelpWith] = useState("");
  const [message, setMessage] = useState("");
  const [link, setLink] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
  const canSubmit =
    name.trim().length > 0 &&
    emailOk &&
    Boolean(helpWith) &&
    message.trim().length >= 20 &&
    !sending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/contributions", {
        method: "POST",
        headers: { "content-type": "application/json", ...anonHeaders() },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          grade: grade.trim(),
          helpWith,
          message: message.trim(),
          link: link.trim(),
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setError(data.error ?? "Could not send your note. Please email us instead.");
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
            <HandHeart className="h-3.5 w-3.5 text-accent" />
            CONTRIBUTE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Help build Blueprint</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
            Students, teachers, and parents: if you believe education should be
            more open, there&apos;s a place for you here. Tell us what you&apos;d
            like to work on and we&apos;ll get back to you.
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border border-accent/30 bg-accent/5 p-10 text-center">
            <div className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <CheckCircle className="h-7 w-7" />
            </div>
            <h2 className="mt-4 text-2xl font-semibold">Thanks — we got it</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Your note is in our queue. A founder reads every one, and
              we&apos;ll reply to the email you gave us.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/opportunities"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
              >
                Browse opportunities <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/mission"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold transition hover:border-primary/40"
              >
                Back to about
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">About you</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Name <span className="text-danger">*</span>
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and last name"
                    maxLength={80}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@school.edu"
                    maxLength={160}
                    required
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>
              <div className="sm:max-w-[220px]">
                <label className="mb-1.5 block text-sm font-medium">Grade or role</label>
                <input
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  placeholder="e.g. 11th grade, teacher"
                  maxLength={40}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold">What would you like to help with?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Pick the closest match.</p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setHelpWith(role.value)}
                    aria-pressed={helpWith === role.value}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                      helpWith === role.value
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    <role.icon className="h-3.5 w-3.5" />
                    {role.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-4 rounded-2xl border border-border bg-card p-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Tell us about yourself <span className="text-danger">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 1500))}
                  placeholder="What have you built or done before, and why do you want to help? A few sentences is plenty."
                  rows={6}
                  required
                  minLength={20}
                  className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <p className="mt-1 text-xs text-muted-foreground">{message.length}/1500</p>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Link to your work</label>
                <input
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  placeholder="Portfolio, GitHub, LinkedIn — optional"
                  maxLength={300}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </section>

            {error && (
              <p className="flex items-start gap-2 rounded-xl border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
              </p>
            )}

            <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
              <a
                href="mailto:contact@blueprintproject.app?subject=I%20want%20to%20help%20build%20Blueprint"
                className="text-sm text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
              >
                Prefer email? Write us instead
              </a>
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4" />}
                {sending ? "Sending…" : "Send it"}
              </button>
            </div>
          </form>
        )}

        <section className="mt-8 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold">What happens next</h2>
          <div className="mt-4 space-y-3">
            {[
              { step: "1", title: "Your note reaches the founders", desc: "Every submission lands in a queue we read ourselves." },
              { step: "2", title: "We reply", desc: "If there's a fit, we email you within a few days to talk." },
              { step: "3", title: "You start small", desc: "Usually a few listings to verify or one design task, then more if you want it." },
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
