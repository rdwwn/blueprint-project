import Link from "next/link";
import { Compass, Mail } from "lucide-react";
import { SiInstagram, SiTiktok } from "react-icons/si";
import { Logo } from "@/components/logo";
import type { ComponentType } from "react";

const EXPLORE = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#showcase" },
  { label: "Opportunities", href: "/#featured" },
  { label: "About", href: "/mission" },
];

const RESOURCES = [
  { label: "Opportunity database", href: "/search" },
  { label: "Reviews", href: "/reviews" },
  { label: "Blog", href: "/blog" },
  { label: "Resources", href: "/resources" },
];

type SocialLink = {
  label: string;
  href: string;
  Icon: ComponentType<{ className?: string; size?: number | string }>;
  external: boolean;
};

const SOCIAL: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/blueprintproject.app", Icon: SiInstagram, external: true },
  { label: "TikTok", href: "https://tiktok.com/@blueprintproject.app", Icon: SiTiktok, external: true },
  { label: "Email", href: "mailto:contact@blueprintproject.app", Icon: Mail as unknown as ComponentType<{ className?: string; size?: number | string }>, external: false },
];

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[90rem] px-6 pt-16 lg:px-12">
        <div className="grid gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-5">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <Logo theme="dark" />
            <p className="max-w-xs text-sm leading-relaxed text-white/70">
              Free opportunities for high school students, researched by hand, tracked by deadline, built for anyone applying.
            </p>
            <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-white/50">
              <Compass className="h-3 w-3 text-accent" />
              Made for students
            </p>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50">
              Explore
            </p>
            <nav className="grid gap-2.5 text-sm">
              {EXPLORE.map((l) => (
                <Link key={l.label} href={l.href} className="text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50">
              Resources
            </p>
            <nav className="grid gap-2.5 text-sm">
              {RESOURCES.map((l) => (
                <Link key={l.label} href={l.href} className="text-white/70 transition hover:text-white">
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-white/50">
              Connect
            </p>
            <div className="grid grid-cols-4 gap-2">
              {SOCIAL.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noreferrer" : undefined}
                  aria-label={l.label}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
                >
                  <l.Icon size={18} />
                </a>
              ))}
            </div>
            <p className="mt-3 text-xs text-white/50">@blueprintproject.app</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} The Blueprint Project
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/terms" className="transition hover:text-white">Terms</Link>
            <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
            <Link href="/cookies" className="transition hover:text-white">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
