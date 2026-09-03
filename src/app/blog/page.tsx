"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Calendar, Clock, Tag } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "College Admissions", "Summer Planning", "Application Strategy", "Student Life", "Scholarships"];

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  date: string;
  cover: string;
  featured?: boolean;
};

const POSTS: Post[] = [
  {
    slug: "when-to-start-college-apps",
    title: "When should you actually start your college applications?",
    excerpt:
      "A realistic timeline for 9th–12th graders. Spoiler: it's earlier than you think, and most of the work happens before senior year.",
    category: "College Admissions",
    readTime: 7,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1200&q=70",
    featured: true,
  },
  {
    slug: "summer-programs-worth-it",
    title: "Are summer programs actually worth it? An honest breakdown",
    excerpt:
      "Selective programs, free programs, online programs, and which ones admissions officers actually care about.",
    category: "Summer Planning",
    readTime: 9,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "essay-tips-that-work",
    title: "College essay tips that actually worked for accepted students",
    excerpt:
      "Patterns from real essays that got students into top schools. Plus the common mistakes to avoid.",
    category: "Application Strategy",
    readTime: 11,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "scholarship-hunting-strategy",
    title: "The scholarship hunting strategy nobody talks about",
    excerpt:
      "How to find and win scholarships that aren't on the big databases. Local, niche, and weird ones.",
    category: "Scholarships",
    readTime: 8,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "balancing-school-year-opportunities",
    title: "Balancing school-year opportunities without burning out",
    excerpt:
      "Research, internships, clubs, and homework. How to pick the right mix and still sleep.",
    category: "Student Life",
    readTime: 6,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "research-vs-internship",
    title: "Research vs internship: which is right for you?",
    excerpt:
      "Both look great on an application, but they build very different skills. Here's how to choose.",
    category: "Application Strategy",
    readTime: 7,
    date: "Jun 2026",
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "how-to-cold-email-a-professor",
    title: "How to cold-email a professor (with 4 real templates that work)",
    excerpt:
      "The exact emails that get responses. What to write, what not to write, and how to follow up without being annoying.",
    category: "Application Strategy",
    readTime: 8,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "what-admissions-officers-look-for",
    title: "What admissions officers actually look for in your application",
    excerpt:
      "Beyond grades and test scores. The five things admissions officers say matter most, and how to demonstrate them authentically.",
    category: "College Admissions",
    readTime: 10,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "building-a-spike",
    title: "Building a spike: the one thing that makes your application memorable",
    excerpt:
      "Forget well-rounded. The students who get into top schools are spiky. Here's how to find and develop your spike.",
    category: "Application Strategy",
    readTime: 9,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
  },
  {
    slug: "first-gen-student-guide",
    title: "First-generation student guide to selective programs",
    excerpt:
      "You don't have family who went to college. Here's how to navigate selective programs, imposter syndrome, and finding your advocates.",
    category: "Student Life",
    readTime: 12,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=70",
  },
];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const pool = POSTS.filter(
    (p) => activeCategory === "All" || p.category === activeCategory,
  );
  // The featured slot always shows a post from the active category, so
  // filtering the page never leaves the featured card showing stale content.
  const featured =
    pool.find((p) => p.featured) ?? pool[0] ?? POSTS[0];
  const rest = pool.filter((p) => p.slug !== featured.slug);

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-4">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <BookOpen className="h-4 w-4 text-accent" />
              <span>Insights & Guides</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              The Blueprint Blog
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Honest, practical writing on college admissions, summer planning, and building a high school career you&apos;re proud of.
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

        {/* Featured post */}
        <section className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12">
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-6 overflow-hidden rounded-3xl border border-border bg-card transition hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_rgba(30,88,214,0.25)] lg:grid-cols-2"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-muted">
              <img
                src={featured.cover}
                alt=""
                loading="eager"
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground shadow-md">
                Featured
              </div>
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-10">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> {featured.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {featured.readTime} min read
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-semibold leading-snug sm:text-3xl">{featured.title}</h2>
              <p className="mt-3 text-base text-muted-foreground">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Read article <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </section>

        {/* Recent posts grid */}
        <section className="mx-auto max-w-[90rem] px-6 pb-20 lg:px-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Recent articles</h2>
              <p className="mt-1 text-sm text-muted-foreground">Practical guides from real students and educators.</p>
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-20px_rgba(30,88,214,0.3)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={p.cover}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
                      <Tag className="h-3 w-3" /> {p.category}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {p.readTime} min
                    </span>
                  </div>
                  <h3 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Read more <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

