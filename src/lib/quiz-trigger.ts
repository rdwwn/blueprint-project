"use client";

const QUIZ_KEY = "bp_quiz_completed";

declare global {
  interface Window {
    __openFindYourPath?: () => boolean;
    __isQuizCompleted?: () => boolean;
  }
}

export function isQuizCompleted(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(QUIZ_KEY) === "true";
}

export function markQuizCompleted(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(QUIZ_KEY, "true");
}

/**
 * Trigger the Find Your Path quiz the FIRST time, but allow navigation on subsequent clicks.
 * If quiz is already completed, does nothing (link navigates normally).
 * If quiz is not yet completed, prevents default and opens the quiz.
 */
export function maybeOpenQuiz(e: { preventDefault: () => void }): void {
  if (isQuizCompleted()) return;
  const open = window.__openFindYourPath;
  if (typeof open === "function" && open()) e.preventDefault();
}

/**
 * Always open the quiz (used for the dedicated "Find Your Path" button).
 */
export function alwaysOpenQuiz(e: { preventDefault: () => void }): void {
  const open = window.__openFindYourPath;
  if (typeof open === "function" && open()) e.preventDefault();
}
