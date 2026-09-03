"use client";

import { useState } from "react";
import Link from "next/link";
import { TEMPLATES } from "@/data/templates";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  Lightbulb,
  Microscope,
  PenLine,
  Users,
  GraduationCap,
  Briefcase,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

type Guide = {
  title: string;
  desc: string;
  icon: LucideIcon;
  href: string;
  topics: number;
  minutes: number;
  category: string;
  color: string;
};

const GUIDES: Guide[] = [
  {
    title: "Essay Writing",
    desc: "How to write a personal statement admissions officers remember. From brainstorming to final polish.",
    icon: PenLine,
    href: "/resources/essay-writing",
    topics: 12,
    minutes: 45,
    category: "Applications",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Interview Prep",
    desc: "Common questions, what to ask back, and how to handle the nerves. Includes practice prompts.",
    icon: Users,
    href: "/resources/interview-prep",
    topics: 9,
    minutes: 30,
    category: "Applications",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Resume Building",
    desc: "What goes on a high school resume, what doesn't, and how to format it so it actually gets read.",
    icon: FileText,
    href: "/resources/resume-building",
    topics: 7,
    minutes: 25,
    category: "Applications",
    color: "bg-warning/10 text-warning",
  },
  {
    title: "Research Skills",
    desc: "How to find a research opportunity, write a cold email, and actually contribute in a lab.",
    icon: Microscope,
    href: "/resources/research-skills",
    topics: 10,
    minutes: 35,
    category: "Skill Building",
    color: "bg-success/10 text-success",
  },
  {
    title: "Finding Mentors",
    desc: "How to identify, approach, and build relationships with adults who will advocate for you.",
    icon: GraduationCap,
    href: "/resources/finding-mentors",
    topics: 6,
    minutes: 20,
    category: "Networking",
    color: "bg-danger/10 text-danger",
  },
  {
    title: "Cold Emailing",
    desc: "Templates and examples for reaching out to professors, alumni, and professionals.",
    icon: Briefcase,
    href: "/resources/cold-emailing",
    topics: 8,
    minutes: 20,
    category: "Networking",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Time Management",
    desc: "Calendars, systems, and habits that work for busy students. Real examples from real students.",
    icon: CalendarDays,
    href: "/resources/time-management",
    topics: 9,
    minutes: 25,
    category: "Skill Building",
    color: "bg-accent/10 text-accent",
  },
  {
    title: "Standing Out",
    desc: "How to develop a narrative admissions officers remember. Spikes, themes, and authenticity.",
    icon: Lightbulb,
    href: "/resources/standing-out",
    topics: 7,
    minutes: 30,
    category: "Strategy",
    color: "bg-warning/10 text-warning",
  },
];

const CATEGORIES = ["All", "Applications", "Skill Building", "Networking", "Strategy"];

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const visibleGuides =
    activeCategory === "All"
      ? GUIDES
      : GUIDES.filter((g) => g.category === activeCategory);
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Resource Library</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Guides, templates, and tools
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Everything we&apos;ve learned from helping thousands of students navigate applications, interviews, and building a high school career.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {CATEGORIES.map((c) => {
                const isActive = c === activeCategory;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setActiveCategory(c);
                    }}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleGuides.map((g) => (
              <Link
                key={g.title}
                href={g.href}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_rgba(30,88,214,0.3)]"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${g.color}`}>
                  <g.icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{g.category}</p>
                  <h3 className="mt-1 text-lg font-semibold leading-snug">{g.title}</h3>
                  <p className="mt-1.5 line-clamp-3 text-sm text-muted-foreground">{g.desc}</p>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span>{g.topics} topics · {g.minutes} min</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Featured templates */}
        <section className="mx-auto max-w-[90rem] px-6 pb-20 lg:px-12">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-card p-8 sm:p-12">
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <p className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Free Templates
                </p>
                <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                  Copy, edit, send.
                </h2>
                <p className="mt-3 text-muted-foreground">
                  Tested templates for cold emails to professors, scholarship applications, activity descriptions, and more. All editable, all yours.
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href="/resources/templates" className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95">
                    Browse templates <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  <Link href="/blog" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold transition hover:border-primary/40">
                    Read the blog
                  </Link>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {TEMPLATES.slice(0, 9).map((t) => (
                  <Link
                    key={t.title}
                    href={t.href}
                    className="group rounded-xl border border-border bg-card/80 p-4 transition hover:border-primary/40 hover:shadow-sm"
                  >
                    <p className="flex items-center justify-between gap-2 text-sm font-semibold">
                      {t.title}
                      <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:text-primary" />
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{t.count} variations</p>
                  </Link>
                ))}
                {TEMPLATES.length > 9 && (
                  <Link
                    href="/resources/templates"
                    className="flex min-h-20 items-center justify-center rounded-xl border border-dashed border-border text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-primary"
                  >
                    Browse all {TEMPLATES.length} templates
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
