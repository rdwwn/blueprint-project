"use client";

import { useSyncExternalStore } from "react";

const KEY = "bp_college_compare";

const subscribers = new Set<() => void>();
let snapshot: string[] = [];
let initialized = false;

const SERVER_SNAPSHOT: string[] = [];

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) snapshot = parsed.slice(0, 4);
    }
  } catch {
    // ignore
  }
}

function read(): string[] {
  ensureInit();
  return snapshot;
}

function write(ids: string[]) {
  snapshot = ids.slice(0, 4);
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot));
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

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

export function useCompare() {
  const compared = useSyncExternalStore(subscribe, read, getServerSnapshot);
  const toggle = (id: string) => {
    const current = read();
    if (current.includes(id)) {
      write(current.filter((x) => x !== id));
    } else if (current.length < 4) {
      write([...current, id]);
    } else {
      write([...current.slice(1), id]);
    }
  };
  const clear = () => write([]);
  const isComparing = (id: string) => compared.includes(id);
  return { compared, toggle, clear, isComparing };
}
