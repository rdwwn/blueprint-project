"use client";

import { useSyncExternalStore } from "react";

const KEY = "bp_program_reviews";

export type Review = {
  id: string;
  programName: string;
  author: string;
  grade: string;
  rating: number;
  text: string;
  date: string;
};

const subscribers = new Set<() => void>();
let snapshot: Record<string, Review[]> = {};
let initialized = false;

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) {
        snapshot = parsed as Record<string, Review[]>;
        subscribers.forEach((cb) => cb());
        return;
      }
    }
  } catch {
    // ignore
  }
  seedReviews();
}

function read(): Record<string, Review[]> {
  ensureInit();
  return snapshot;
}

function write(data: Record<string, Review[]>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
    snapshot = data;
    subscribers.forEach((cb) => cb());
  } catch {
    // ignore
  }
}

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

const SERVER_SNAPSHOT: Record<string, Review[]> = {};

function getServerSnapshot(): Record<string, Review[]> {
  return SERVER_SNAPSHOT;
}

// Seed with a few sample reviews so the page isn't empty on first visit
function seedReviews(): Record<string, Review[]> {
  const sample: Record<string, Review[]> = {
    "Google Computer Science Summer Institute (CSSI)": [
      {
        id: "seed-1",
        programName: "Google Computer Science Summer Institute (CSSI)",
        author: "Maya R.",
        grade: "Junior",
        rating: 5,
        text: "Life-changing. The project I built there became my college essay. Met my best friends and got mentorship from real Google engineers. Hard work but worth every minute.",
        date: "2025-08-15",
      },
    ],
    "NASA OSTEM High School Internship": [
      {
        id: "seed-2",
        programName: "NASA OSTEM High School Internship",
        author: "James T.",
        grade: "Senior",
        rating: 5,
        text: "Worked on a real research project with NASA scientists. Got to present at a symposium. The application is competitive but they read every essay.",
        date: "2025-07-22",
      },
    ],
    "Research Science Institute (RSI)": [
      {
        id: "seed-3",
        programName: "Research Science Institute (RSI)",
        author: "Aisha K.",
        grade: "Senior",
        rating: 5,
        text: "Brutal and incredible. Five weeks of real research, then you write a paper and present it. The community of other nerdy students was the best part.",
        date: "2025-08-01",
      },
    ],
  };
  write(sample);
  return sample;
}

export function useReviews() {
  const reviews = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const addReview = (programName: string, review: Omit<Review, "id" | "date" | "programName">) => {
    const all = read();
    const newReview: Review = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      programName,
      date: new Date().toISOString().split("T")[0],
      ...review,
    };
    const existing = all[programName] ?? [];
    write({ ...all, [programName]: [newReview, ...existing] });
  };

  const getReviews = (programName: string) => reviews[programName] ?? [];
  const getAverage = (programName: string) => {
    const r = reviews[programName];
    if (!r || r.length === 0) return 0;
    return r.reduce((sum, x) => sum + x.rating, 0) / r.length;
  };
  const getCount = (programName: string) => reviews[programName]?.length ?? 0;

  return { reviews, addReview, getReviews, getAverage, getCount };
}
