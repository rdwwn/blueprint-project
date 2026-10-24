"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Calendar, Clock, Link2 } from "lucide-react";
import { useState } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";
import { POSTS, RELATED_LINKS } from "./post-data";

export function BlogPostContent({ slug }: { slug: string }) {
  const post = POSTS[slug];
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <article className="relative mx-auto max-w-3xl px-6 pb-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime} min read
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <img src={post.cover} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="mt-10 max-w-none space-y-5 text-base leading-relaxed text-foreground/85">
            {post.content.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg font-medium text-foreground" : ""}>{p}</p>
            ))}
          </div>
          {RELATED_LINKS[slug as keyof typeof RELATED_LINKS] && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <p className="text-sm font-semibold text-foreground">Find these on Blueprint</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RELATED_LINKS[slug as keyof typeof RELATED_LINKS].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    {link.label} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success" /> Copied
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" /> Copy link
                </>
              )}
            </button>
            <Link href="/blog" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              More articles <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
