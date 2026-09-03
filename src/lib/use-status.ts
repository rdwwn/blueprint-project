"use client";

import { useSyncExternalStore } from "react";

const KEY = "blueprint_status";

export type Status = "saved" | "applied" | "accepted";

let cache: Record<string, Status> = {};
let emit = () => {};
let initialized = false;

const SERVER_SNAPSHOT: Record<string, Status> = {};

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? "{}") as Record<string, Status>;
  } catch {
    cache = {};
  }
}

function readStatus(): Record<string, Status> {
  if (typeof window === "undefined") return SERVER_SNAPSHOT;
  ensureInit();
  return cache;
}

function getServerSnapshot(): Record<string, Status> {
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

function writeStatus(next: Record<string, Status>) {
  cache = next;
  if (typeof window !== "undefined") {
    localStorage.setItem(KEY, JSON.stringify(next));
  }
  emit();
}

export function useStatus() {
  const status = useSyncExternalStore(subscribe, readStatus, getServerSnapshot);

  const setStatus = (slug: string, s: Status) => {
    const next = { ...status };
    if (s === "saved") delete next[slug];
    else next[slug] = s;
    writeStatus(next);
  };

  return { status, setStatus };
}
