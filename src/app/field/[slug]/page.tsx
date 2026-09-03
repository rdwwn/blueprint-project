import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, MapPin, CalendarClock, BadgeCheck } from "lucide-react";
import { OPPORTUNITIES } from "@/data/opportunities";
import { slugify } from "@/lib/slug";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { SaveCardButton } from "@/components/save-button";
import { OrgFavicon } from "@/components/org-favicon";

const FIELDS = [
  "CS & Engineering",
  "Medicine & Health",
  "Business & Finance",
  "Law, Politics & Public",
  "Arts, Design & Music",
  "Space, Earth & Environment",
  "Journalism & Media",
  "Education & Teaching",
  "Humanities & Social Science",
  "Math, Physics & Materials",
  "Psychology & Neuroscience",
  "Agriculture & Food",
  "Sports & Athletics",
  "Gaming & Esports",
  "Foreign Languages & Linguistics",
  "Theater, Film & Writing",
  "International",
];

function fieldToSlug(field: string): string {
  return field
    .toLowerCase()
    .replace(/[,&]/g, "")
    .replace(/\s+/g, "-")
    .replace(/--+/g, "-");
}

function slugToField(slug: string): string | undefined {
  return FIELDS.find((f) => fieldToSlug(f) === slug);
}

export function generateStaticParams() {
  return FIELDS.map((f) => ({ slug: fieldToSlug(f) }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const field = slugToField(slug);
  if (!field) return { title: "Field · The Blueprint Project" };
  const count = OPPORTUNITIES.filter((o) => o.field === field).length;
  return {
    title: `${field} Programs · The Blueprint Project`,
    description: `Browse ${count} verified ${field.toLowerCase()} programs, internships, competitions, and scholarships for high school students.`,
  };
}

export default async function FieldPage({ params }: Props) {
  const { slug } = await params;
  const field = slugToField(slug);
  if (!field) notFound();

  const programs = OPPORTUNITIES.filter((o) => o.field === field);
  const categories = [...new Set(programs.map((o) => o.category).filter(Boolean))];

  return (
    <>
      <AnimatedNav />
      <main className="flex-1">
        <div className="relative overflow-hidden border-b border-border bg-card/60">
          <div aria-hidden className="blueprint-grid absolute inset-0 opacity-[0.08]" />
          <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-10">
            <Link href="/search" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to search
            </Link>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{field}</h1>
            <p className="mt-3 text-muted-foreground">
              {programs.length} verified programs for high school students interested in {field.toLowerCase()}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {categories.map((cat) => (
                <span key={cat} className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  {cat} ({programs.filter((o) => o.category === cat).length})
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-3xl px-6 py-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {programs.slice(0, 50).map((o) => (
              <Link
                key={o.name}
                href={`/opportunity/${slugify(o.name)}`}
                className="group relative flex h-full flex-col rounded-2xl border border-border bg-card/95 p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_18px_36px_-20px_rgba(30,88,214,0.38)]"
              >
                <div className="absolute right-4 top-4">
                  <SaveCardButton slug={slugify(o.name)} />
                </div>
                <div className="mb-4 flex items-start gap-3 pr-10">
                  <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-border bg-muted/60">
                    <OrgFavicon host={o.host} name={o.org} size={32} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="text-lg font-semibold leading-snug">{o.name}</h2>
                    {o.org && <p className="mt-1 truncate text-sm text-muted-foreground">{o.org}</p>}
                  </div>
                </div>
                {o.category && (
                  <span className="mb-2 inline-flex w-fit rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    {o.category}
                  </span>
                )}
                <p className="line-clamp-2 text-sm text-muted-foreground">{o.description || o.eligibility}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {o.location || "Online"}
                  </span>
                  {o.deadline && o.deadline !== "Varies" && (
                    <span className="inline-flex items-center gap-1">
                      <CalendarClock className="h-3 w-3" />
                      {o.deadline}
                    </span>
                  )}
                  {o.verified && (
                    <span className="inline-flex items-center gap-1 text-accent">
                      <BadgeCheck className="h-3 w-3" />
                      Verified
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
          {programs.length > 50 && (
            <div className="mt-10 text-center">
              <Link href={`/search?field=${encodeURIComponent(field)}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:shadow-md">
                View all {programs.length} {field} programs
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
