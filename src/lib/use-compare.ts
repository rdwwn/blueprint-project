"use client";

import { useSyncExternalStore } from "react";

const KEY = "blueprint_compare";
const MAX = 4;

let cache: string[] = [];
let emit = () => {};
let initialized = false;

const SERVER_SNAPSHOT: string[] = [];

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "[]") as string[];
  } catch {
    cache = [];
  }
}

function readCompare(): string[] {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  ensureInit();
  return cache;
}

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

function writeCompare(next: string[]) {
  cache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  emit();
}

export function useCompare() {
  const compare = useSyncExternalStore(subscribe, readCompare, getServerSnapshot);

  const isComparing = (slug: string) => compare.includes(slug);

  const toggle = (slug: string) => {
    if (compare.includes(slug)) {
      writeCompare(compare.filter((s) => s !== slug));
    } else if (compare.length < MAX) {
      writeCompare([...compare, slug]);
    }
  };

  const add = (slug: string) => {
    if (compare.includes(slug) || compare.length >= MAX) return;
    writeCompare([...compare, slug]);
  };

  const remove = (slug: string) => {
    writeCompare(compare.filter((s) => s !== slug));
  };

  const clear = () => writeCompare([]);

  return { compare, isComparing, toggle, add, remove, clear };
}
