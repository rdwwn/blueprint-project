import { Suspense } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { SearchView } from "@/app/search/search-view";

export default function CompetitionsPage() {
  return <><ScrollProgress /><AnimatedNav /><Suspense fallback={<main className="flex-1 px-6 py-16"><p className="text-muted-foreground">Loading competitions…</p></main>}><SearchView prefilter={{ category: "Competition" }} /></Suspense><Footer /></>;
}
