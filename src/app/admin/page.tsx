"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  KeyRound,
  LogOut,
  RefreshCw,
  ShieldCheck,
  Star,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Clock3,
  CheckCircle2,
  MessageSquare,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";

type AdminReview = {
  id: string;
  anonId: string;
  opportunitySlug: string;
  opportunityName: string;
  author: string;
  grade: string | null;
  rating: number;
  text: string;
  status: string;
  createdAt: string;
};

type AdminReport = {
  id: string;
  opportunityName: string | null;
  issueType: string;
  details: string;
  status: string;
  createdAt: string;
};

type ReviewsData = {
  pending: AdminReview[];
  recent: AdminReview[];
  counts: { pending: number; approved: number; rejected: number };
};

type ReportsData = {
  open: AdminReport[];
  resolved: AdminReport[];
  counts: { open: number; resolved: number };
};

const STORAGE_KEY = "bp.admin_key";
const issueTypeLabel = (t: string) =>
  ({ "dead-link": "Dead link", "wrong-deadline": "Wrong deadline", cancelled: "Program cancelled", "wrong-eligibility": "Wrong eligibility", other: "Something else" })[t] ?? t;

export default function AdminPage() {
  const [key, setKey] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [checking, setChecking] = useState(false);
  const [tab, setTab] = useState<"reviews" | "reports">("reviews");
  const [reviews, setReviews] = useState<ReviewsData | null>(null);
  const [reports, setReports] = useState<ReportsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [flash, setFlash] = useState("");

  const headers = useCallback(
    (k: string | null) => ({
      "content-type": "application/json",
      ...(k ? { "x-admin-key": k } : {}),
    }),
    [],
  );

  const unauth = useCallback(() => {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* ignore */ }
    setKey(null);
    setReviews(null);
    setReports(null);
  }, []);

  const load = useCallback(
    async (k: string, silent = false) => {
      if (!silent) setLoading(true);
      setAuthError("");
      try {
        const [rRes, pRes] = await Promise.all([
          fetch("/api/admin/reviews", { headers: headers(k) }),
          fetch("/api/admin/reports", { headers: headers(k) }),
        ]);
        if (rRes.status === 401 || pRes.status === 401) {
          unauth();
          setAuthError("That passcode isn't right.");
          return false;
        }
        if (!rRes.ok || !pRes.ok) throw new Error("load failed");
        setReviews((await rRes.json()) as ReviewsData);
        setReports((await pRes.json()) as ReportsData);
        return true;
      } catch {
        setAuthError("Could not reach the moderation service.");
        return false;
      } finally {
        setLoading(false);
      }
    },
    [headers, unauth],
  );

  // Auto-login if a passcode was already stored this session. Deferred a tick
  // so hydration finishes first (avoids SSR state mismatch).
  useEffect(() => {
    let active = true;
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        void Promise.resolve().then(() => {
          if (!active) return;
          setKey(stored);
          void load(stored, true);
        });
      }
    } catch { /* ignore */ }
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setChecking(true);
    const ok = await load(input.trim());
    setChecking(false);
    if (ok) {
      try {
        sessionStorage.setItem(STORAGE_KEY, input.trim());
      } catch { /* ignore */ }
      setKey(input.trim());
      setInput("");
    }
  };

  const patchReview = async (id: string, action: "approve" | "reject") => {
    if (!key) return;
    setBusyId(id);
    const res = await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: headers(key),
      body: JSON.stringify({ id, action }),
    });
    setBusyId(null);
    if (res.status === 401) return unauth();
    if (res.ok) {
      setFlash(action === "approve" ? "Review approved and published." : "Review rejected.");
      await load(key, true);
      setTimeout(() => setFlash(""), 2500);
    }
  };

  const patchReport = async (id: string, action: "resolve" | "reopen") => {
    if (!key) return;
    setBusyId(id);
    const res = await fetch("/api/admin/reports", {
      method: "PATCH",
      headers: headers(key),
      body: JSON.stringify({ id, action }),
    });
    setBusyId(null);
    if (res.status === 401) return unauth();
    if (res.ok) {
      setFlash(action === "resolve" ? "Report marked resolved." : "Report reopened.");
      await load(key, true);
      setTimeout(() => setFlash(""), 2500);
    }
  };

  if (!key) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight">Moderation</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Private area for The Blueprint Project. Enter your passcode to review submissions.
            </p>
          </div>
          <form onSubmit={login} className="space-y-3 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium">Passcode</label>
            <input
              type="password"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="••••••••••••"
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary"
            />
            {authError && <p className="text-sm text-danger">{authError}</p>}
            <button
              type="submit"
              disabled={checking || !input.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 disabled:opacity-50"
            >
              {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Unlock
            </button>
            <p className="pt-1 text-center text-[11px] text-muted-foreground">
              Founder access only. Not linked anywhere on the public site.
            </p>
          </form>
        </div>
      </main>
    );
  }

  const pendingCount = reviews?.counts.pending ?? 0;
  const openCount = reports?.counts.open ?? 0;

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-base font-semibold leading-tight">Moderation</h1>
              <p className="text-[11px] text-muted-foreground">Reviews + reports queue</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(key, true)}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition hover:border-primary/40"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
            </button>
            <button
              onClick={unauth}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-danger/40 hover:text-danger"
            >
              <LogOut className="h-3.5 w-3.5" /> Lock
            </button>
          </div>
        </div>
      </header>

      {flash && (
        <div className="fixed bottom-5 right-5 z-30 rounded-xl border border-success/30 bg-card px-4 py-3 text-sm font-medium text-success shadow-lg">
          {flash}
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-2">
          <TabButton active={tab === "reviews"} onClick={() => setTab("reviews")} icon={<MessageSquare className="h-4 w-4" />} label="Reviews" badge={pendingCount} />
          <TabButton active={tab === "reports"} onClick={() => setTab("reports")} icon={<Flag className="h-4 w-4" />} label="Reports" badge={openCount} />
        </div>

        {tab === "reviews" ? (
          reviews ? (
            <div className="mt-6 space-y-8">
              <QueueSection
                title={pendingCount ? `${pendingCount} review${pendingCount === 1 ? "" : "s"} waiting on you` : "All caught up"}
                empty={pendingCount === 0}
                emptyText="No pending reviews. New submissions appear here."
              >
                {reviews.pending.map((r) => (
                  <ReviewCard key={r.id} r={r} busy={busyId === r.id} onAction={(a) => patchReview(r.id, a)} />
                ))}
              </QueueSection>

              {reviews.recent.length > 0 && (
                <section>
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recent activity</h2>
                  <ul className="mt-3 space-y-2">
                    {reviews.recent.slice(0, 20).map((r) => (
                      <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm">
                        <div className="min-w-0">
                          <span className={cn("mr-2 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                            r.status === "approved" ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
                            {r.status}
                          </span>
                          <span className="text-muted-foreground">{r.author} on </span>
                          <span className="font-medium">{r.opportunityName}</span>
                        </div>
                        <span className="shrink-0 text-xs text-muted-foreground">{shortDate(r.createdAt)}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          ) : (
            <LoadingNote />
          )
        ) : reports ? (
          <div className="mt-6 space-y-8">
            <QueueSection
              title={openCount ? `${openCount} open report${openCount === 1 ? "" : "s"}` : "No open reports"}
              empty={openCount === 0}
              emptyText="Nothing flagged right now. Reports land here from the Flag page."
            >
              {reports.open.map((r) => (
                <ReportCard key={r.id} r={r} busy={busyId === r.id} onAction={() => patchReport(r.id, "resolve")} />
              ))}
            </QueueSection>

            {reports.resolved.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Recently resolved</h2>
                <ul className="mt-3 space-y-2">
                  {reports.resolved.slice(0, 20).map((r) => (
                    <li key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <span className="mr-2 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase text-success">
                          <CheckCircle2 className="h-3 w-3" /> resolved
                        </span>
                        <span className="text-muted-foreground">{issueTypeLabel(r.issueType)}</span>
                        {r.opportunityName && <span className="ml-1 font-medium">· {r.opportunityName}</span>}
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">{shortDate(r.createdAt)}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <LoadingNote />
        )}
      </div>
    </main>
  );
}

function TabButton({ active, onClick, icon, label, badge }: { active: boolean; onClick: () => void; icon: ReactNode; label: string; badge: number }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/40",
      )}
    >
      {icon} {label}
      {badge > 0 && (
        <span className={cn("inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
          active ? "bg-white/20 text-white" : "bg-primary/10 text-primary")}>
          {badge}
        </span>
      )}
    </button>
  );
}

function QueueSection({ title, children, empty, emptyText }: { title: string; children: ReactNode; empty: boolean; emptyText: string }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{title}</h2>
      {empty ? (
        <div className="mt-3 rounded-2xl border border-dashed border-border bg-card/50 p-10 text-center text-sm text-muted-foreground">
          <CheckCircle2 className="mx-auto mb-2 h-6 w-6 text-success/70" />
          {emptyText}
        </div>
      ) : (
        <div className="mt-3 space-y-3">{children}</div>
      )}
    </section>
  );
}

function ReviewCard({ r, busy, onAction }: { r: AdminReview; busy: boolean; onAction: (a: "approve" | "reject") => void }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <Link href={`/opportunity/${r.opportunitySlug}`} className="font-semibold text-primary hover:underline">
            {r.opportunityName}
          </Link>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{r.author}</span>
            {r.grade && <span className="rounded-full bg-muted px-2 py-0.5">{r.grade}</span>}
            <span>· {shortDate(r.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-0.5 text-warning">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", i < r.rating ? "fill-current" : "opacity-25")} />
          ))}
          <span className="ml-1 text-xs font-medium text-muted-foreground">{r.rating}/5</span>
        </div>
      </div>
      <p className="mt-3 rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground/85">{r.text}</p>
      <div className="mt-3 flex justify-end gap-2">
        <button
          onClick={() => onAction("reject")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 px-4 py-1.5 text-sm font-medium text-danger transition hover:bg-danger/10 disabled:opacity-50"
        >
          <ThumbsDown className="h-3.5 w-3.5" /> Reject
        </button>
        <button
          onClick={() => onAction("approve")}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ThumbsUp className="h-3.5 w-3.5" />}
          Approve & publish
        </button>
      </div>
    </article>
  );
}

function ReportCard({ r, busy, onAction }: { r: AdminReport; busy: boolean; onAction: () => void }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-semibold text-warning">
            <AlertTriangle className="h-3 w-3" /> {issueTypeLabel(r.issueType)}
          </span>
          {r.opportunityName && (
            <Link href={`/opportunity/${slugify(r.opportunityName)}`} className="text-sm font-semibold text-primary hover:underline">
              {r.opportunityName}
            </Link>
          )}
          <span className="text-xs text-muted-foreground">· {shortDate(r.createdAt)}</span>
        </div>
        <button
          onClick={onAction}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-success px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-success/90 disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
          Mark fixed
        </button>
      </div>
      <p className="mt-3 rounded-xl border border-border/60 bg-background/50 px-4 py-3 text-sm leading-relaxed text-foreground/85">{r.details}</p>
    </article>
  );
}

function LoadingNote() {
  return (
    <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-border bg-card py-16 text-sm text-muted-foreground">
      <Clock3 className="h-4 w-4 animate-pulse" /> Loading…
    </div>
  );
}

function shortDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return iso;
  }
}
