"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, GraduationCap, Star, Users, Wallet, X } from "lucide-react";
import { COLLEGES } from "@/data/colleges";
import { useCompare } from "@/lib/use-compare-colleges";
import { cn } from "@/lib/utils";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

function CompareContent() {
  const params = useSearchParams();
  const { compared, toggle, clear } = useCompare();

  const idsFromUrl = params.get("ids")?.split(",").filter(Boolean) ?? [];
  const active = (idsFromUrl.length > 0 ? idsFromUrl : compared)
    .map((id) => COLLEGES.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold">Nothing to compare yet</h1>
        <p className="mt-2 text-muted-foreground">Pick up to 4 colleges from the list and they&apos;ll show up here side by side.</p>
        <Link
          href="/colleges"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Browse colleges <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[90rem] px-6 py-10 lg:px-12">
      <Link href="/colleges" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to colleges
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Side-by-side comparison</h1>
          <p className="mt-1 text-muted-foreground">Comparing {active.length} {active.length === 1 ? "school" : "schools"}</p>
        </div>
        <button onClick={clear} className="text-sm font-medium text-primary hover:underline">
          Clear all
        </button>
      </div>

      <div className="mt-8 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="w-44 p-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">School</th>
              {active.map((c) => (
                <th key={c.id} className="p-4 text-left align-top">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span
                        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-sm font-bold text-white"
                        style={{ background: c.color }}
                      >
                        {c.shortName.slice(0, 2).toUpperCase()}
                      </span>
                      <p className="mt-2 text-base font-semibold">{c.shortName}</p>
                      <p className="text-xs text-muted-foreground">{c.location}</p>
                    </div>
                    <button onClick={() => toggle(c.id)} className="rounded p-1 text-muted-foreground hover:bg-muted">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row k="Type" values={active.map((c) => c.type)} />
            <Row k="Setting" values={active.map((c) => c.setting)} />
            <Row k="Size" values={active.map((c) => c.size)} />
            <Row k="Founded" values={active.map((c) => c.founded.toString())} />
            <Row k="Enrollment" values={active.map((c) => c.enrollment.toLocaleString())} />
            <Row k="Acceptance rate" values={active.map((c) => `${c.acceptanceRate}%`)} highlight="low" />
            <Row k="Avg GPA" values={active.map((c) => c.avgGpa.toFixed(1))} highlight="high" />
            <Row k="SAT range" values={active.map((c) => c.satScore)} />
            <Row k="Tuition" values={active.map((c) => `$${c.tuition.toLocaleString()}`)} highlight="low" />
            <Row k="Room & board" values={active.map((c) => `$${c.roomBoard.toLocaleString()}`)} highlight="low" />
            <Row k="Total / year" values={active.map((c) => `$${(c.tuition + c.roomBoard).toLocaleString()}`)} highlight="low" />
            <Row k="Athletics" values={active.map((c) => c.athletics)} />
            <Row k="Endowment" values={active.map((c) => `$${(c.endowment / 1e9).toFixed(1)}B`)} highlight="high" />
            <Row k="Top majors" values={active.map((c) => c.topMajors.slice(0, 4).join(", "))} />
            <Row k="Notable programs" values={active.map((c) => c.notablePrograms.slice(0, 3).join(", "))} />
            <Row k="Vibe" values={active.map((c) => c.vibe)} wide />
            <tr className="border-t border-border">
              <td className="p-4"></td>
              {active.map((c) => (
                <td key={c.id} className="p-4">
                  <Link
                    href={`/colleges/${c.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-semibold transition hover:border-primary/40"
                  >
                    View details <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ k, values, highlight, wide }: { k: string; values: string[]; highlight?: "high" | "low"; wide?: boolean }) {
  const bestIdx = highlight === "low" ? values.findIndex((v) => v === values.slice().sort((a, b) => parseFloat(a.replace(/[^0-9.-]/g, "") || "0") - parseFloat(b.replace(/[^0-9.-]/g, "") || "0"))[0]) : highlight === "high" ? values.findIndex((v) => v === values.slice().sort((a, b) => parseFloat(b.replace(/[^0-9.-]/g, "") || "0") - parseFloat(a.replace(/[^0-9.-]/g, "") || "0"))[0]) : -1;

  return (
    <tr className="border-b border-border/60 last:border-0">
      <td className="p-4 align-top text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</td>
      {values.map((v, i) => (
        <td
          key={i}
          className={cn("p-4 align-top text-sm", i === bestIdx && "bg-success/5 font-semibold text-success", wide && "text-foreground/85")}
        >
          {v}
        </td>
      ))}
    </tr>
  );
}

export default function CompareCollegesPage() {
  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading…</div>}>
          <CompareContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
