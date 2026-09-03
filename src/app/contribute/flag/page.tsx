import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { ArrowRight, Flag, Link2, AlertCircle, CheckCircle, Clock, Mail, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FlagPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="mx-auto max-w-3xl flex-1 px-6 pb-20 pt-24">
        <div className="mb-12 text-center">
          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Flag className="h-3.5 w-3.5 text-accent" />
            CONTRIBUTE
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Flag Incorrect Information</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Spot a dead link, outdated deadline, or wrong details? Help us keep the
            database accurate for everyone.
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Quick report</h2>
            <p className="mt-2 text-sm text-muted-foreground">What kind of issue did you find?</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {[
                { icon: Link2, label: "Dead link", color: "bg-danger/10 text-danger" },
                { icon: AlertCircle, label: "Wrong deadline", color: "bg-warning/10 text-warning" },
                { icon: Clock, label: "Program cancelled", color: "bg-accent/10 text-accent" },
                { icon: CheckCircle, label: "Other error", color: "bg-primary/10 text-primary" },
              ].map((issue) => (
                <a
                  key={issue.label}
                  href={`mailto:contact@blueprintproject.app?subject=Flagged%20Program%20-%20${encodeURIComponent(issue.label)}&body=Hi%20Blueprint%20team%2C%0A%0AI%20found%20an%20issue%3A%20${encodeURIComponent(issue.label)}%0A%0AProgram%20name%3A%20%0AURL%3A%20%0ADetails%3A%20%0A%0AThanks%2C%0A`}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition hover:shadow-sm",
                    issue.color,
                  )}
                >
                  <issue.icon className="h-3.5 w-3.5" />
                  {issue.label}
                </a>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">Detailed report</h2>
            <p className="mt-2 text-sm text-muted-foreground">Include as much detail as possible so we can fix it quickly.</p>
            <a
              href="mailto:contact@blueprintproject.app?subject=Flagged%20Program%20-%20Detailed%20Report&body=Hi%20Blueprint%20team%2C%0A%0AI%20want%20to%20report%20an%20issue%20with%20a%20program%3A%0A%0AProgram%20name%3A%20%0AProgram%20URL%3A%20%0AIssue%20type%3A%20%0ADetails%3A%20%0A%0AMy%20email%20(optional)%3A%20%0A%0AThanks%2C%0A"
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <Mail className="h-4 w-4" />
              Send detailed report
            </a>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <h2 className="text-lg font-semibold">What happens next</h2>
            <div className="mt-4 space-y-3">
              {[
                { step: "1", title: "We receive your report", desc: "Every flagged item goes into our review queue." },
                { step: "2", title: "We verify", desc: "Our team checks the program&apos;s official website and documentation." },
                { step: "3", title: "We update", desc: "If confirmed, we fix the deadline, link, or details within 48 hours." },
                { step: "4", title: "You get credit", desc: "Contributors who help improve accuracy get recognized on our Hall of Fame (coming soon)." },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <span className="flex-shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">{item.step}</span>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}