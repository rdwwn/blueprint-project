import { Suspense } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { SearchView } from "@/app/search/search-view";

const PROGRAM_CATEGORIES = ["Summer Program", "School Year Program", "Fellowship", "Certificate", "Dual Enrollment"].join(",");

export default function ProgramsPage() {
  return <><ScrollProgress /><AnimatedNav /><Suspense fallback={<main className="flex-1 px-6 py-16"><p className="text-muted-foreground">Loading programs…</p></main>}><SearchView prefilter={{ category: PROGRAM_CATEGORIES }} /></Suspense><Footer /></>;
}
