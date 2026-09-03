"use client";

import { useSyncExternalStore } from "react";

const KEY = "bp_custom_dates";

export type CustomDate = {
  id: string;
  title: string;
  date: string;
  category: "Application" | "Exam" | "Deadline" | "Event" | "Other";
  notes?: string;
  link?: string;
  color?: string;
};

const subscribers = new Set<() => void>();
let snapshot: CustomDate[] = [];
let initialized = false;

const SERVER_SNAPSHOT: CustomDate[] = [];

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) snapshot = parsed;
    }
  } catch {
    // ignore
  }
}

function read(): CustomDate[] {
  ensureInit();
  return snapshot;
}

function write(dates: CustomDate[]) {
  snapshot = dates;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(dates));
    } catch {
      // ignore
    }
  }
  subscribers.forEach((cb) => cb());
}

function subscribe(cb: () => void) {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
}

function getServerSnapshot(): CustomDate[] {
  return SERVER_SNAPSHOT;
}

export function useCustomDates() {
  const dates = useSyncExternalStore(subscribe, read, getServerSnapshot);

  const addDate = (date: Omit<CustomDate, "id">) => {
    const all = read();
    const newDate: CustomDate = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      ...date,
    };
    write([...all, newDate]);
  };

  const updateDate = (id: string, patch: Partial<Omit<CustomDate, "id">>) => {
    const all = read();
    write(all.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  };

  const removeDate = (id: string) => {
    const all = read();
    write(all.filter((d) => d.id !== id));
  };

  return { dates, addDate, updateDate, removeDate };
}
