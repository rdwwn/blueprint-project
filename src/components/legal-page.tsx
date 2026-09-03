import type { ReactNode } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

export function LegalPage({
  title,
  subtitle,
  lastUpdated,
  children,
}: {
  title: string;
  subtitle?: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-28">
        <article className="mx-auto max-w-3xl px-6 pb-20">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            LEGAL
          </p>
          <h1 className="text-4xl font-semibold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-lg text-muted-foreground">{subtitle}</p>
          )}
          {lastUpdated && (
            <p className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Last updated:</span> {lastUpdated}
            </p>
          )}
          <div className="prose prose-blue mt-8 max-w-none">{children}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="mb-3 text-xl font-semibold tracking-tight">{title}</h2>
      <div className="space-y-3 text-base leading-relaxed text-foreground/85 [&_a]:text-primary [&_a]:underline [&_strong]:font-semibold [&_strong]:text-foreground">
        {children}
      </div>
    </section>
  );
}

export function LegalCallout({ children }: { children: ReactNode }) {
  return (
    <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5 text-sm text-foreground/85">
      {children}
    </div>
  );
}
