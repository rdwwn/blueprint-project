import type { Metadata } from "next";
import { Suspense } from "react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { SearchView } from "@/app/search/search-view";

const DISPLAY_COUNT = `${Math.floor(OPPORTUNITIES.length / 100) * 100}+`;

export const metadata: Metadata = {
  title: "Opportunities · The Blueprint Project",
  description: `Search ${DISPLAY_COUNT} verified opportunities for high school students.`,
};

export default function OpportunitiesPage() {
  return <><ScrollProgress /><AnimatedNav /><Suspense fallback={<main className="mx-auto max-w-6xl flex-1 px-6 pt-14 py-16"><p className="text-muted-foreground">Loading opportunities…</p></main>}><SearchView /></Suspense><Footer /></>;
}
