"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { LogoMark } from "@/components/logo-mark";
import { alwaysOpenQuiz, maybeOpenQuiz } from "@/lib/quiz-trigger";

const NAV_ITEMS = [
  { name: "Search", href: "/opportunities" },
  { name: "About", href: "/mission" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Blog", href: "/blog" },
  { name: "Resources", href: "/resources" },
];

export function AnimatedNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    const id = setTimeout(() => setMobileOpen(false), 0);
    return () => clearTimeout(id);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Find Your Path - always opens quiz (it's the dedicated quiz button)
  const openQuiz = (event: MouseEvent<HTMLAnchorElement>) => {
    alwaysOpenQuiz(event);
    setMobileOpen(false);
  };

  // Search nav - first time triggers quiz, subsequent navigates normally
  const handleSearchClick = (event: MouseEvent<HTMLAnchorElement>) => {
    maybeOpenQuiz(event);
    setMobileOpen(false);
  };

  return (
    <>
      <header className="relative z-50 border-b border-border bg-background/95 backdrop-blur-md shadow-[0_1px_3px_rgba(15,23,42,0.06)]">
        <div className="mx-auto flex h-16 max-w-[90rem] items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo (left) - clean, solid */}
          <Link href="/" className="group flex items-center gap-2.5" aria-label="Blueprint home">
            <LogoMark className="h-9 w-9 transition group-hover:scale-105" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">
              Blueprint<span className="text-primary">Project</span>
            </span>
          </Link>

          {/* Center nav */}
          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={item.name === "Search" ? handleSearchClick : undefined}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side - Find Your Path CTA */}
          <div className="flex items-center gap-2">
            <Link
              href="/opportunities"
              onClick={openQuiz}
              className="hidden items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/95 hover:shadow-md md:inline-flex"
            >
              <Compass className="h-4 w-4" />
              Find Your Path
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileOpen}
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation overlay"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm md:hidden"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed bottom-0 right-0 top-16 z-50 w-[min(22rem,88vw)] overflow-y-auto border-l border-border bg-background p-5 shadow-2xl md:hidden"
            >
              <nav className="grid gap-1" aria-label="Mobile navigation">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={item.name === "Search" ? handleSearchClick : () => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
              <Link
                href="/opportunities"
                onClick={openQuiz}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm"
              >
                <Compass className="h-4 w-4" />
                Find Your Path
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
