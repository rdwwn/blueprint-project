"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

const PAGES = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/mission", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    let previousY = window.scrollY;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const movingDown = currentY > previousY;
        setCompact(currentY > 72);
        setCollapsed(currentY > 180 && movingDown && !menuOpen);
        previousY = currentY;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-transform duration-300 sm:px-6 sm:pt-4">
      <div
        className={cn(
          "mx-auto flex max-w-6xl items-center justify-between rounded-2xl border border-border/90 bg-background/90 px-3 shadow-[0_12px_32px_-18px_rgba(18,39,74,0.35)] backdrop-blur-md transition-[height,padding] duration-200 sm:px-4",
          compact ? "h-11 px-2.5 sm:px-3" : "h-14",
        )}
      >
        <Link
          href="/"
          aria-label="The Blueprint Project, home"
          className="rounded-xl p-1 transition hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        >
          <Logo className={cn("transition-transform duration-200", compact && "scale-[0.86]")} />
        </Link>

        <nav
          aria-label="Primary navigation"
          className={cn(
            "hidden items-center gap-1 transition-all duration-200 md:flex",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          {PAGES.map((page) => {
            const active = isActive(pathname, page.href);
            return (
              <Link
                key={page.href}
                href={page.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40",
                  compact ? "py-1.5" : "py-2",
                  active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {page.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/search"
          className={cn(
            "hidden rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:bg-primary/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:inline-flex",
            compact && "px-3 py-1.5 text-xs",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          Browse programs
        </Link>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 md:hidden",
            collapsed ? "pointer-events-none opacity-0" : "opacity-100",
          )}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-background p-2 shadow-xl md:hidden">
          <nav aria-label="Mobile navigation" className="grid gap-1">
            {PAGES.map((page) => {
              const active = isActive(pathname, page.href);
              return (
                <Link
                  key={page.href}
                  href={page.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "rounded-xl px-4 py-3 text-sm font-medium transition",
                    active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {page.label}
                </Link>
              );
            })}
            <Link href="/search" onClick={() => setMenuOpen(false)} className="mt-1 rounded-xl bg-primary px-4 py-3 text-center text-sm font-semibold text-primary-foreground">
              Browse programs
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
