"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { getAnonId, anonHeaders } from "@/lib/anon-id";
import { slugify } from "@/lib/slug";

// Server-backed reviews. Reviews are moderated: students submit, the founder
// approves on /admin, and only approved reviews are public. The author can
// still see their own pending/rejected rows on the program page.

export type Review = {
  id: string;
  programName: string;
  author: string;
  grade: string;
  rating: number;
  text: string;
  date: string;
  status: "approved" | "pending" | "rejected";
};

type ApiReview = {
  id: string;
  opportunitySlug: string;
  opportunityName: string;
  author: string;
  grade: string | null;
  rating: number;
  text: string;
  status: "approved" | "pending" | "rejected";
  createdAt: string;
};

function toReview(r: ApiReview): Review {
  return {
    id: r.id,
    programName: r.opportunityName,
    author: r.author,
    grade: r.grade ?? "",
    rating: r.rating,
    text: r.text,
    date: (r.createdAt || "").slice(0, 10),
    status: r.status,
  };
}

// Module-level cache of approved reviews, keyed by program name — same shape
// the UI has always consumed (reviews page, most-popular, home stats).
let snapshot: Record<string, Review[]> = {};
let loadStarted = false;

function ensureLoaded() {
  if (loadStarted || typeof window === "undefined") return;
  loadStarted = true;
  fetch("/api/reviews")
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((data: { reviews?: ApiReview[] }) => {
      const next: Record<string, Review[]> = {};
      for (const raw of data.reviews ?? []) {
        const r = toReview(raw);
        if (r.status !== "approved") continue;
        (next[r.programName] ??= []).push(r);
      }
      snapshot = next;
      subscribers.forEach((cb) => cb());
    })
    .catch(() => {});
}

const subscribers = new Set<() => void>();

function read() {
  ensureLoaded();
  return snapshot;
}

const SERVER_SNAPSHOT: Record<string, Review[]> = {};

function getServerSnapshot(): Record<string, Review[]> {
  return SERVER_SNAPSHOT;
}

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

export function useReviews() {
  const reviews = useSyncExternalStore(subscribe, read, getServerSnapshot);

  useEffect(() => {
    ensureLoaded();
  }, []);

  const getReviews = useCallback((programName: string) => reviews[programName] ?? [], [reviews]);
  const getAverage = useCallback((programName: string) => {
    const r = reviews[programName];
    if (!r || r.length === 0) return 0;
    return r.reduce((sum, x) => sum + x.rating, 0) / r.length;
  }, [reviews]);
  const getCount = useCallback((programName: string) => reviews[programName]?.length ?? 0, [reviews]);

  return { reviews, getReviews, getAverage, getCount };
}

export type SubmitResult = { ok: boolean; error?: string };

/** Submit a review. Goes to the moderation queue (pending) until approved. */
export async function submitReview(
  programName: string,
  review: { author: string; grade: string; rating: number; text: string },
  slug?: string,
): Promise<SubmitResult> {
  const id = getAnonId();
  if (!id) return { ok: false, error: "Reviews need browser storage, which is unavailable here." };
  try {
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "content-type": "application/json", ...anonHeaders() },
      body: JSON.stringify({
        opportunitySlug: slug || slugify(programName),
        opportunityName: programName,
        ...review,
      }),
    });
    const data = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) return { ok: false, error: data.error ?? "Could not submit review" };
    return { ok: true };
  } catch {
    return { ok: false, error: "Network error. Please try again." };
  }
}

/**
 * Per-program reviews including the visitor's own pending/rejected rows so they
 * can see their submission is in the queue. Used by the program detail page.
 */
export async function fetchProgramReviews(
  programName: string,
  slug: string,
): Promise<{ reviews: Review[]; average: number; count: number; ownPending: boolean }> {
  try {
    const params = new URLSearchParams({ program: slug || slugify(programName) });
    const res = await fetch(`/api/reviews?${params.toString()}`, { headers: anonHeaders() });
    if (!res.ok) throw new Error("load failed");
    const data = (await res.json()) as { reviews?: ApiReview[]; average?: number; count?: number };
    const reviews = (data.reviews ?? []).map(toReview);
    return {
      reviews,
      average: data.average ?? 0,
      count: data.count ?? 0,
      ownPending: reviews.some((r) => r.status === "pending"),
    };
  } catch {
    return { reviews: [], average: 0, count: 0, ownPending: false };
  }
}
