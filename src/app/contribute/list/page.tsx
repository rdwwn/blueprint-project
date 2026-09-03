import Link from "next/link";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { ArrowRight, ClipboardList, Plus, Search, Share2, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CreateListPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="mx-auto max-w-3xl flex-1 px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <ClipboardList className="h-3.5 w-3.5 text-accent" />
            CONTRIBUTE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Create a List</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Curate your own collection of programs and share it with the community.
            Build reading lists for specific interests, grade levels, or geographic areas.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">How it works</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Search, title: "Find programs", desc: "Search and filter opportunities" },
                { icon: Plus, title: "Add to list", desc: "Click the bookmark on any program" },
                { icon: Share2, title: "Share your list", desc: "Generate a unique link to share" },
              ].map((step, i) => (
                <div key={step.title} className="text-center">
                  <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mx-auto">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Example list ideas</h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                "Summer STEM programs for 9th graders",
                "Paid internships in NYC",
                "No-essay scholarships for seniors",
                "Virtual research opportunities",
                "Medicine & health summer camps",
                "AI & CS competitions 2026",
              ].map((idea) => (
                <Link
                  key={idea}
                  href={`/opportunities?q=${encodeURIComponent(idea)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition hover:border-primary/50 hover:text-primary hover:bg-muted"
                >
                  <UserCheck className="h-3.5 w-3.5" />
                  {idea}
                </Link>
              ))}
            </div>
          </section>

          <div className="text-center">
            <Link
              href="/opportunities"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Search className="h-4 w-4" /> Start exploring programs
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              Bookmark programs as you browse &mdash; they&apos;ll appear in your
              <Link href="/dashboard" className="text-primary hover:underline font-medium">
                Dashboard
              </Link>
              <span className="text-muted-foreground">.</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}