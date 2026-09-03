import Link from "next/link";
import { FileQuestion } from "lucide-react";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

export default function NotFound() {
  return (
    <>
      <AnimatedNav />
      <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <FileQuestion className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          We couldn&apos;t find the page you&apos;re looking for. It may have
          moved, or the link might be incorrect.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link
            href="/"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95"
          >
            Go home
          </Link>
          <Link
            href="/search"
            className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-6 text-sm font-semibold transition hover:border-primary/50 hover:text-primary"
          >
            Browse opportunities
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
