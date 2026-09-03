import Link from "next/link";
import { ClipboardList, Flag, MessageSquare, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { Wave } from "@/components/wave";

const ACTIONS = [
  {
    icon: ClipboardList,
    title: "Create a List",
    desc: "Curate your own collection of programs and share it with the community.",
    href: "/contribute/list",
    cta: "Start a list",
  },
  {
    icon: MessageSquare,
    title: "Share Feedback",
    desc: "Help us improve by sharing your experience and suggestions.",
    href: "/contribute/feedback",
    cta: "Send feedback",
  },
  {
    icon: Flag,
    title: "Flag Incorrect Info",
    desc: "Spot a dead link or outdated deadline? Tell us and we'll fix it fast.",
    href: "/contribute/flag",
    cta: "Report issue",
  },
];

export function Contribute() {
  return (
    <section className="relative overflow-x-clip bg-[#0c4f49]">
      <Wave fill="#0c4f49" />
      <div className="relative z-10 mx-auto max-w-[90rem] px-6 py-20 lg:px-12">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
            <ClipboardList className="h-3.5 w-3.5" />
            CONTRIBUTE
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Help us make this better for everyone.
          </h2>
          <p className="mt-3 text-white/70">
            Students, parents, and educators: share what you know. The more people contribute, the better this resource gets.
          </p>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-3">
          {ACTIONS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <Link
                href={a.href}
                className="group relative flex h-full flex-col rounded-2xl bg-muted p-6 shadow-lg shadow-black/10 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-primary/40"
              >
                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:scale-110 group-hover:bg-primary/15">
                  <a.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {a.desc}
                </p>
                <span className="mt-5 inline-flex w-fit items-center justify-center gap-1.5 self-center rounded-full bg-[#0c4f49] px-4 py-2 text-sm font-semibold text-white shadow-sm transition group-hover:gap-2">
                  {a.cta} <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
      <Wave fill="#0c4f49" flip />
    </section>
  );
}
