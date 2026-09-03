import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Star, Trophy } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

const STORIES = [
  {
    name: "Maya R.",
    grade: "Class of 2025",
    location: "San Jose, CA",
    field: "Computer Science",
    photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=70",
    quote: "Blueprint helped me find RSI when I didn't even know it existed. The deadline radar saved me from missing the MITES application.",
    programs: ["RSI", "MITES", "Google CSSI"],
    outcome: "Now at MIT for CS",
    rating: 5,
  },
  {
    name: "James T.",
    grade: "Class of 2024",
    location: "Houston, TX",
    field: "Medicine",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=70",
    quote: "I never would have found a paid clinical research opportunity without Blueprint. The filters made it so easy to find what fit my schedule.",
    programs: ["MD Anderson Summer", "NIH HSRP", "HOSA"],
    outcome: "Now pre-med at Rice",
    rating: 5,
  },
  {
    name: "Aisha K.",
    grade: "Class of 2025",
    location: "London, UK",
    field: "Environmental Science",
    photo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=70",
    quote: "The world view on the map helped me find programs in my area. Most databases only show US stuff, but Blueprint had options globally.",
    programs: ["UCL Earth Sciences", "RSI", "Pioneer Research"],
    outcome: "Now at Oxford for PPE",
    rating: 5,
  },
  {
    name: "Diego M.",
    grade: "Class of 2024",
    location: "Phoenix, AZ",
    field: "Engineering",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=70",
    quote: "First in my family to go to college. Blueprint showed me what was possible and where to look for scholarships.",
    programs: ["ASU Fulton Engineering", "QuestBridge", "Coca-Cola Scholars"],
    outcome: "Now at Stanford",
    rating: 5,
  },
  {
    name: "Priya S.",
    grade: "Class of 2025",
    location: "Boston, MA",
    field: "Arts & Writing",
    photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=800&q=70",
    quote: "As a writer, I never thought I'd find 'opportunities' in my field. Blueprint showed me writing programs, journalism internships, and even paid fellowships.",
    programs: ["Iowa Young Writers", "Scholastic Art & Writing", "Princeton Summer Journalism"],
    outcome: "Now at Columbia for English",
    rating: 4,
  },
  {
    name: "Marcus W.",
    grade: "Class of 2024",
    location: "Detroit, MI",
    field: "Business",
    photo: "https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=800&q=70",
    quote: "The scholarship database saved me $30k in college. I matched with 7 local scholarships I never would have found otherwise.",
    programs: ["Launch Summer", "Wharton LBW", "DECA ICDC"],
    outcome: "Now at Wharton",
    rating: 5,
  },
];

export default function StoriesPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="h-4 w-4 text-accent" />
              <span>Success Stories</span>
            </div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Where Blueprint students end up
            </h1>
            <p className="mt-3 max-w-2xl text-lg text-muted-foreground">
              Real students, real programs, real outcomes. Here&apos;s what happened when they used Blueprint to find their path.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: "Stories", value: "200+" },
                { label: "Top-10 admits", value: "73" },
                { label: "Scholarships", value: "$1.2M" },
                { label: "Avg. rating", value: "4.8★" },
              ].map((s) => (
                <div key={s.label} className="rounded-xl border border-border bg-card p-3">
                  <p className="text-xl font-semibold tabular-nums">{s.value}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {STORIES.map((s) => (
              <article
                key={s.name}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_24px_60px_-24px_rgba(30,88,214,0.3)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={s.photo}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-card/95 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm">
                    <GraduationCap className="h-3 w-3 text-primary" />
                    {s.outcome}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.grade} · {s.location}</p>
                    </div>
                    <div className="flex items-center gap-0.5 text-warning">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-3.5 w-3.5",
                            i < s.rating ? "fill-current" : "opacity-30",
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm italic text-muted-foreground">&ldquo;{s.quote}&rdquo;</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border pt-3">
                    {s.programs.map((p) => (
                      <span key={p} className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[90rem] px-6 pb-20 lg:px-12">
          <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/5 via-accent/5 to-card p-8 sm:p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-primary" />
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Want to share your story?
            </h2>
            <p className="mt-3 max-w-xl mx-auto text-muted-foreground">
              If you used Blueprint to find programs and want to help inspire future students, we&apos;d love to hear from you.
            </p>
            <Link
              href="/contribute/feedback"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
            >
              Submit your story <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function cn(...args: (string | false | null | undefined)[]) {
  return args.filter(Boolean).join(" ");
}
