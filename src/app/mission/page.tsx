"use client";

import Link from "next/link";
import { ArrowRight, GraduationCap, HandHeart, Search, ShieldCheck } from "lucide-react";
import { AnimatedNav } from "@/components/animated-nav";
import { ScrollProgress } from "@/components/scroll-progress";
import { Reveal } from "@/components/reveal";
import { BlueprintGrid } from "@/components/blueprint-grid";
import { Footer } from "@/components/footer";
import { Wave } from "@/components/wave";
import { cn } from "@/lib/utils";
import { OPPORTUNITIES } from "@/data/opportunities";

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

const PROMISES = [
  {
    icon: HandHeart,
    title: "Free, forever",
    desc: "No paywalls, no premium tier, no access fee. Every program listed is free to apply to and free to browse.",
    points: [
      "No premium tier, no paywall",
      "Free to browse, free to apply",
      "Student-built, not VC-funded",
    ],
    accent: true,
  },
  {
    icon: Search,
    title: "Unbiased algorithms",
    desc: "No paid placements, no sponsor bias, no boosted listings. Programs rank on fit and deadline, nothing else.",
    points: [
      "No sponsored or boosted listings",
      "Results ranked by fit, not revenue",
      "Every listing treated the same",
    ],
  },
  {
    icon: ShieldCheck,
    title: "100% data privacy",
    desc: "No account required to browse, and nothing is sold or shared. When tracking arrives, it stays yours.",
    points: [
      "No account needed to search",
      "Nothing sold or shared, ever",
      "Your data stays yours",
    ],
  },
];

const STATS = [
  { value: DISPLAY_COUNT, label: "Verified programs" },
  { value: "18", label: "Fields covered" },
  { value: "100+", label: "Cities + remote" },
  { value: "100%", label: "No pay-to-apply" },
];


export default function MissionPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1">
        <section className="relative overflow-hidden">
          <BlueprintGrid className="absolute inset-0 h-full w-full text-primary/20 opacity-80" />
          <div aria-hidden className="absolute left-1/2 top-1/2 hidden h-72 w-[44rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl sm:block" />
          <div className="relative mx-auto max-w-4xl px-6 pb-20 pt-32 text-center sm:pt-40">
            <Reveal>
              <p className="mb-6 inline-flex items-center gap-2 rounded-full border-2 border-primary/30 bg-card px-4 py-1.5 text-sm font-semibold text-foreground">
                <GraduationCap className="h-4 w-4 text-accent" />
                ABOUT · MISSION
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                The education sector should be open, and easy to find your way around.
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-foreground/80">
                The Blueprint Project started as one student&apos;s search for
                things worth applying to. It&apos;s now a free, hand-researched
                map of internships, competitions, scholarships, and research
                programs for high schoolers, verified by hand, tracked by
                deadline, and free to everyone.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {STATS.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-border bg-card p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                  >
                    <p className="text-2xl font-bold tracking-tight text-foreground">{s.value}</p>
                    <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <Link
                href="/search"
                className="group mt-14 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-base font-semibold text-primary-foreground shadow-lg transition hover:bg-primary/95 hover:shadow-xl"
              >
                Browse {DISPLAY_COUNT} programs
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

<section className="relative overflow-x-clip bg-[#0c4f49]">
          <Wave fill="#0c4f49" className="z-10" />
          <Wave fill="#0c4f49" flip className="z-10" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 lg:px-12">
            <Reveal className="mx-auto mb-14 max-w-2xl text-center">
              <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-blue-100/90">
                <ShieldCheck className="h-3.5 w-3.5" />
                THE BLUEPRINT PROMISE
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-blue-50 sm:text-4xl">
                No hidden agenda
              </h2>
              <p className="mt-4 text-base text-blue-100/70">
                Three promises we make to every student who uses Blueprint.
              </p>
            </Reveal>

            <div className="grid gap-6 sm:grid-cols-3">
              {PROMISES.map((p, i) => (
                <Reveal key={p.title} delay={i * 0.08}>
                  <div className="flex h-full flex-col rounded-2xl border border-white/15 bg-white p-6 shadow-lg shadow-black/20 transition hover:-translate-y-1 hover:border-white/30 hover:shadow-xl">
                  <div
                    className={cn(
                      "mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl",
                      p.accent
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary",
                    )}
                  >
                    <p.icon className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold">{p.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {p.desc}
                  </p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-4">
                    {p.points.map((point) => (
                      <li key={point} className="flex items-start gap-2 text-sm text-foreground/80">
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
          </div>
        </section>

        <div className="bg-primary/[0.03]">
          <section className="mx-auto max-w-6xl px-6 py-16">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Our community
              </h2>
              <p className="mt-3 text-muted-foreground">
                The idea came up while the three of us were sitting together
                complaining about program hunting. We each run a part of it.
              </p>
            </Reveal>

          <div className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-primary/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-primary">
                  Founder
                </span>
                <h3 className="text-lg font-semibold">Ridwan Ahmed</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · New York, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Got tired of digging through a bunch of tabs just to find one
                  program, so he started building Blueprint. Then he brought in
                  two friends. Checks the links, keeps the listings honest, and
                  writes the code.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Co-Founder
                </span>
                <h3 className="text-lg font-semibold">Ethan Troche</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · New York, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Thought of the idea alongside Ridwan and helped get it
                  running. Handles the pipeline: partners, corrections, and the
                  accuracy checks on every listing.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Co-Founder
                </span>
                <h3 className="text-lg font-semibold">Shadman Rahman</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · New York, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Also thought of the idea, back when all three of us kept
                  coming up empty searching for programs. Runs social media
                  and outreach: makes the posts, connects with counselors and
                  orgs, and grows the page.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-accent/10 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-accent">
                  Partnerships Lead · Design Lead
                </span>
                <h3 className="text-lg font-semibold">Brandon Villa</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · New York, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Works with Ethan on partner outreach and owns the visual
                  identity: social graphics, one-pagers, and brand assets.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  School Ambassador Director
                </span>
                <h3 className="text-lg font-semibold">Robert O&apos;Sullivan</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · New York, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Leads the school ambassador program and keeps the
                  coordinators working together.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-6">
                <span className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  Ambassador Recruitment
                </span>
                <h3 className="text-lg font-semibold">Almuhimin Chowdhury</h3>
                <p className="text-xs text-muted-foreground">
                  12th grade · Buffalo, NY
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Founded a Blueprint chapter at Cheektowaga Central High
                  School in Buffalo and recruits and onboards new student
                  ambassadors.
                </p>
              </div>
            </Reveal>

          </div>

          <Reveal delay={0.15}>
            <div className="mt-12 flex flex-col items-center justify-between gap-6 rounded-2xl border border-border bg-card p-8 text-center sm:flex-row sm:text-left">
              <div>
                <h3 className="text-xl font-semibold">Want to help build it?</h3>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  If you&apos;re a student, teacher, or parent who believes
                  education should be more open, there&apos;s a place for you
                  here.
                </p>
              </div>
              <span className="inline-flex w-fit items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Get involved · coming soon
              </span>
            </div>
          </Reveal>
        </section>
        </div>
      </main>
      <Footer />
    </>
  );
}