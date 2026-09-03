"use client";

import { useSyncExternalStore } from "react";

const KEY = "blueprint.saved";

let cache: string[] = [];
let emit = () => {};
let initialized = false;

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
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  emit();
}

export function useSaved() {
  const saved = useSyncExternalStore(subscribe, readSaved, getServerSnapshot);

  const isSaved = (slug: string) => saved.includes(slug);

  const toggle = (slug: string) => {
    writeSaved(
      saved.includes(slug)
        ? saved.filter((s) => s !== slug)
        : [...saved, slug],
    );
  };

  const clear = () => writeSaved([]);

  return { saved, isSaved, toggle, clear };
}
