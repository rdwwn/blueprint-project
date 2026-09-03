import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Check,
  Clock,
  FileCheck2,
  Flag,
  MapPin,
  Tag,
  Wallet,
} from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { SaveButton } from "@/components/save-button";
import { CompareButton } from "@/components/compare-button";
import { OrgFavicon } from "@/components/org-favicon";
import { SimilarCarousel } from "@/components/similar-carousel";
import { OpportunityBanner } from "@/components/opportunity-banner";
import { OpportunityReviews } from "@/components/opportunity-reviews";

export function generateStaticParams() {
  return OPPORTUNITIES.map((o) => ({ slug: slugify(o.name) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => slugify(o.name) === slug);
  if (!opp) return { title: "Opportunity · The Blueprint Project" };
  return {
    title: `${opp.name} · The Blueprint Project`,
    description: opp.description ?? `${opp.name}, verified opportunity for high schoolers.`,
  };
}

export default async function OpportunityPage({ params }: Props) {
  const { slug } = await params;
  const opp = OPPORTUNITIES.find((o) => slugify(o.name) === slug);
  if (!opp) notFound();

  const similar = OPPORTUNITIES.filter(
    (o) => o.name !== opp.name && o.field === opp.field,
  ).slice(0, 6);
  const field = opp.field || opp.cat_norm || "";
  const summary = buildSummary(opp);

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1">
        <OpportunityBanner url={opp.url} field={opp.field} category={opp.category} org={opp.org} name={opp.name} />

        <div className="mx-auto max-w-3xl px-6 pt-16">
          <div className="flex flex-wrap items-center gap-2">
            {opp.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <Clock className="h-3 w-3" />
                {opp.duration}
              </span>
            )}
            {opp.difficulty && (
              <span className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
                opp.difficulty === "Competitive" && "bg-danger/10 text-danger",
                opp.difficulty === "Selective" && "bg-warning/10 text-warning",
                opp.difficulty === "Moderate" && "bg-primary/10 text-primary",
                opp.difficulty === "Accessible" && "bg-accent/10 text-accent",
                opp.difficulty === "Open" && "bg-success/10 text-success",
              )}>
                {opp.difficulty}
              </span>
            )}
            {opp.location && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" />
                {opp.location}
              </span>
            )}
            {opp.deadline && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                <CalendarClock className="h-3 w-3" />
                {opp.deadline}
                {opp.category === "Competition" && (
                  <span className="ml-1 text-[10px] text-muted-foreground/70">(registration)</span>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="relative overflow-hidden border-b border-border bg-card/60">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08] [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)]" />
          <div aria-hidden className="opportunity-blueprint absolute inset-0" />
          <div aria-hidden className="paper-grain absolute inset-0 opacity-60" />
          <span aria-hidden className="draft-corner draft-corner--tl hidden sm:block" />
          <span aria-hidden className="draft-corner draft-corner--tr hidden sm:block" />

          <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-10">
            <Link href="/opportunities" className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to opportunities
            </Link>

            <div className="flex flex-wrap items-center gap-2">
              {field && <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">{field}</span>}
              {opp.verified && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  <BadgeCheck className="h-3.5 w-3.5" /> Verified program
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{opp.name}</h1>
            {opp.org && (
              <p className="mt-3 flex items-center gap-2.5 text-lg text-muted-foreground">
                <OrgFavicon host={opp.host} name={opp.org} size={28} />
                {opp.org}
              </p>
            )}
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-foreground/75">{summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-primary/5 px-3.5 py-2 font-medium text-primary">
                <CalendarClock className="h-4 w-4" />
                {opp.deadline && opp.deadline !== "Varies" ? `Deadline: ${opp.deadline}` : "Deadline varies"}
              </span>
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                <BadgeCheck className="h-4 w-4 text-accent" />
                Official program link
              </span>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-6 pb-16 pt-8">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="grid gap-6 sm:grid-cols-2">
                <FactCard icon={<MapPin className="h-4 w-4" />} label="Location" value={opp.location || "Online"} />
                <FactCard icon={<Wallet className="h-4 w-4" />} label="Cost" value={opp.cost || "Not listed"} />
                <FactCard icon={<CalendarClock className="h-4 w-4" />} label="Deadline" value={opp.deadline || "Varies"} note={opp.category === "Competition" ? "Registration deadline" : undefined} />
                {opp.duration && <FactCard icon={<Clock className="h-4 w-4" />} label="Duration" value={opp.duration} />}
                {opp.eligibility && <FactCard icon={<BadgeCheck className="h-4 w-4" />} label="Eligibility" value={opp.eligibility} wide />}
              </div>

              {opp.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                  {opp.tags.map((tag) => <span key={tag} className="inline-flex rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">{tag}</span>)}
                </div>
              )}

              {opp.description && (
                <section className="mt-10">
                  <h2 className="mb-3 text-xl font-semibold">What to expect</h2>
                  <p className="leading-relaxed text-muted-foreground">{opp.description}</p>
                </section>
              )}

              <section className="mt-10">
                <h2 className="mb-3 text-xl font-semibold">How to apply</h2>
                <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-card p-5">
                  <a href={opp.url} target="_blank" rel="noreferrer" className="group/apply inline-flex h-14 flex-1 items-center justify-center gap-2.5 rounded-xl bg-primary px-7 text-base font-semibold text-primary-foreground shadow-[0_12px_32px_-8px_rgba(30,88,214,0.5)] transition hover:bg-primary/95 hover:shadow-[0_16px_40px_-8px_rgba(30,88,214,0.6)] active:scale-[0.98]">
                    Apply on official site
                    <ArrowUpRight className="h-5 w-5 transition-transform group-hover/apply:-translate-y-0.5 group-hover/apply:translate-x-0.5" />
                  </a>
                  <CompareButton name={opp.name} />
                  <SaveButton slug={slug} />
                </div>
                <p className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>Applications happen on the program&apos;s official website. Details are verified, but double-check the official page before you apply.</span>
                </p>
                <Link
                  href={`/contribute/flag?program=${encodeURIComponent(slug)}&name=${encodeURIComponent(opp.name)}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground underline-offset-4 transition hover:text-primary hover:underline"
                >
                  <Flag className="h-3.5 w-3.5" />
                  Spot a mistake? Flag this listing
                </Link>
              </section>

              <section className="mt-10 rounded-2xl border border-border bg-card p-6">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"><FileCheck2 className="h-5 w-5" /></span>
                  <div>
                    <h2 className="font-semibold">Before you apply</h2>
                    <p className="mt-1 text-sm text-muted-foreground">A quick check before you leave Blueprint.</p>
                  </div>
                </div>
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    "Confirm that you meet the eligibility requirements",
                    "Review the required materials on the official site",
                    "Check the official deadline and time zone",
                    "Save the program if you want to track it later",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"><Check className="h-3 w-3" /></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <SimilarCarousel programs={similar} />
              <OpportunityReviews programName={opp.name} slug={slug} />
            </div>

            <div className="hidden self-start lg:block">
              <div className="sticky top-24 max-h-[calc(100vh-7rem)] space-y-4 overflow-y-auto pr-1">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <h3 className="font-semibold">Quick facts</h3>
                  <dl className="mt-4 divide-y divide-border/60">
                    <div className="flex justify-between py-2.5 text-sm first:pt-0">
                      <dt className="text-muted-foreground">Category</dt>
                      <dd className="font-medium">{opp.category || "Program"}</dd>
                    </div>
                    {opp.field && (
                      <div className="flex justify-between py-2.5 text-sm">
                        <dt className="text-muted-foreground">Field</dt>
                        <dd className="font-medium">{opp.field}</dd>
                      </div>
                    )}
                    {opp.season && (
                      <div className="flex justify-between py-2.5 text-sm">
                        <dt className="text-muted-foreground">Season</dt>
                        <dd className="font-medium">{opp.season}</dd>
                      </div>
                    )}
                    {opp.difficulty && (
                      <div className="flex justify-between py-2.5 text-sm">
                        <dt className="text-muted-foreground">Acceptance</dt>
                        <dd className="font-medium">{opp.difficulty}</dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function buildSummary(opp: (typeof OPPORTUNITIES)[number]): string {
  const field = opp.field || opp.category || "an area you care about";
  const format = opp.location?.toLowerCase().includes("online") || !opp.location ? "online or nationwide" : "hands-on";
  return `A ${format} opportunity for high school students interested in ${field.toLowerCase()}.`;
}

function FactCard({ icon, label, value, wide, note }: { icon: ReactNode; label: string; value: string; wide?: boolean; note?: string }) {
  return (
    <div className={`flex gap-3.5 rounded-2xl border border-border bg-card p-4 ${wide ? "sm:col-span-2" : ""}`}>
      <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">{icon}</span>
      <div className="min-w-0">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
        <p className="mt-0.5 text-sm font-medium leading-snug text-foreground">{value}</p>
        {note && <p className="mt-0.5 text-[11px] text-muted-foreground">{note}</p>}
      </div>
    </div>
  );
}
