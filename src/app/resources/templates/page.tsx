import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";
import { TEMPLATES } from "@/data/templates";

export default function TemplatesPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <section className="relative overflow-hidden border-b border-border bg-card/40">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-[90rem] px-6 py-16 lg:px-12">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <FileText className="h-3.5 w-3.5 text-accent" />
              TEMPLATES
            </p>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Free Templates</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              Copy, edit, send. Tested templates for cold emails, scholarship applications, and more. All editable, all yours.
            </p>
          </div>
        </section>
        <section className="mx-auto max-w-[90rem] px-6 py-12 lg:px-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATES.map((t) => (
              <Link
                key={t.title}
                href={t.href}
                className="group flex items-center justify-between rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t.count} variations</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}