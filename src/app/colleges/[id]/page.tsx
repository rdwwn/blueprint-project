import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, GraduationCap, MapPin, Star, Users, Wallet } from "lucide-react";
import { COLLEGES } from "@/data/colleges";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

type Params = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  return COLLEGES.map((c) => ({ id: c.id }));
}

export default async function CollegeDetailPage({ params }: Params) {
  const { id } = await params;
  const c = COLLEGES.find((x) => x.id === id);
  if (!c) notFound();
  const totalCost = c.tuition + c.roomBoard;

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <div className="relative overflow-hidden border-b border-border bg-card/40">
          <div
            aria-hidden
            className="absolute inset-0 opacity-10"
            style={{ background: `radial-gradient(circle at 30% 0%, ${c.color}40, transparent 60%)` }}
          />
          <div className="relative mx-auto max-w-5xl px-6 py-12">
            <Link href="/colleges" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
              <ArrowLeft className="h-4 w-4" /> Back to colleges
            </Link>
            <div className="mt-6 flex flex-wrap items-start gap-5">
              <span
                className="inline-flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl font-bold text-white shadow-lg"
                style={{ background: c.color }}
              >
                {c.shortName.slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0 flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {c.type}
                </span>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">{c.name}</h1>
                <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" /> {c.location}
                </p>
              </div>
              <a
                href={c.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
              >
                Apply on official site <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <p className="mt-6 max-w-3xl text-lg text-foreground/80">{c.description}</p>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-6 py-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat icon={Users} label="Acceptance" value={`${c.acceptanceRate}%`} />
            <Stat icon={Star} label="Avg SAT" value={c.satScore} />
            <Stat icon={Wallet} label="Total / year" value={`$${totalCost.toLocaleString()}`} />
            <Stat icon={GraduationCap} label="Enrollment" value={c.enrollment.toLocaleString()} />
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <section>
                <h2 className="text-2xl font-semibold">The vibe</h2>
                <p className="mt-3 text-lg italic text-foreground/80">&ldquo;{c.vibe}&rdquo;</p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">Strengths</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {c.strengths.map((s) => (
                    <li key={s} className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm">
                      <span className="mt-0.5 text-success">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">Things to consider</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {c.weaknesses.map((w) => (
                    <li key={w} className="flex items-start gap-2 rounded-lg border border-warning/30 bg-warning/5 p-3 text-sm">
                      <span className="mt-0.5 text-warning">!</span> {w}
                    </li>
                  ))}
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold">Notable programs</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {c.notablePrograms.map((p) => (
                    <span key={p} className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-sm font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">At a glance</h3>
                <dl className="mt-4 space-y-2.5 text-sm">
                  <Row k="Founded" v={c.founded.toString()} />
                  <Row k="Setting" v={c.setting} />
                  <Row k="Size" v={c.size} />
                  <Row k="Athletics" v={c.athletics} />
                  <Row k="Avg GPA" v={c.avgGpa.toFixed(1)} />
                  <Row k="Endowment" v={`$${(c.endowment / 1e9).toFixed(1)}B`} />
                </dl>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">Top majors</h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {c.topMajors.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {m}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={`/colleges/compare?ids=${c.id}`}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:border-primary/40"
              >
                Add to comparison <ArrowUpRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-border/50 pb-1.5 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{k}</dt>
      <dd className="font-medium text-right">{v}</dd>
    </div>
  );
}
