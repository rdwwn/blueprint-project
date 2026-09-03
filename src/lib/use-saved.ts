"use client";

import { useEffect, useSyncExternalStore } from "react";
import { getAnonId } from "@/lib/anon-id";

// Local-first saved list that syncs to the database in the background.
// Reads are instant (localStorage); writes go local immediately, then the
// server catches up. On first load per page session we hydrate from the server
// and merge, so saves survive browser-storage wipes and follow the visitor
// across sessions on the same browser. No accounts involved.

const KEY = "blueprint.saved";

let cache: string[] = [];
let emit = () => {};
let initialized = false;
let hydrationStarted = false;

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    cache = [];
  }
}

function readSaved(): string[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  ensureInit();
  return cache;
}

const SERVER_SNAPSHOT: string[] = [];

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT;
}

function subscribe(onChange: () => void) {
  emit = onChange;
  window.addEventListener("storage", onChange);
  return () => {
    emit = () => {};
    window.removeEventListener("storage", onChange);
  };
}

function writeSaved(next: string[]) {
  cache = next;
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // storage full or blocked — still update in-memory state
    }
  }
  emit();
}

async function apiCall(path: string, init?: RequestInit) {
  const id = getAnonId();
  if (!id) return null;
  try {
    const res = await fetch(`/api/${path}`, {
      ...init,
      headers: { "content-type": "application/json", "x-anon-id": id, ...(init?.headers ?? {}) },
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

/** One-time hydration per page session: merge server saves with local ones. */
function hydrate() {
  if (hydrationStarted || typeof window === "undefined") return;
  hydrationStarted = true;
  const id = getAnonId();
  if (!id) return;
  apiCall("saves")
    .then((data: { slugs?: string[] } | null) => {
      if (!data || !Array.isArray(data.slugs)) return;
      ensureInit();
      const server = data.slugs.filter((s: unknown): s is string => typeof s === "string");
      const merged = Array.from(new Set([...cache, ...server]));
      if (merged.length !== cache.length) writeSaved(merged);
      // Push anything that only existed locally up to the server (e.g. saves
      // made before the database existed, or while offline).
      const localOnly = cache.filter((s) => !server.includes(s));
      for (const slug of localOnly) {
        void apiCall("saves", { method: "POST", body: JSON.stringify({ slug }) });
      }
    })
    .catch(() => {});
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, readSaved, getServerSnapshot);

  const isSaved = (slug: string) => saved.includes(slug);

  const toggle = (slug: string) => {
    const next = saved.includes(slug) ? saved.filter((s) => s !== slug) : [...saved, slug];
    writeSaved(next);
    // Fire and forget; hydrate() on the next visit heals any drift.
    void apiCall("saves", {
      method: saved.includes(slug) ? "DELETE" : "POST",
      body: JSON.stringify({ slug }),
    });
  };

  const clear = () => {
    const removed = [...saved];
    writeSaved([]);
    for (const slug of removed) {
      void apiCall("saves", { method: "DELETE", body: JSON.stringify({ slug }) });
    }
  };

  // Trigger a server hydrate once whenever a component using saved state mounts.
  useEffect(() => {
    hydrate();
  }, []);

  return { saved, isSaved, toggle, clear };
}
