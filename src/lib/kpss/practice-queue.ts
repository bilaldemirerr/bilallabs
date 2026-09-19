"use client";

import type { PendingWrong } from "./srs";

const KEY = "kpss-practice-queue";

type QueueState = {
  pendingWrong: PendingWrong[];
  answerCount: number;
};

export const EMPTY_QUEUE: QueueState = {
  pendingWrong: [],
  answerCount: 0,
};

export function loadPracticeQueue(): QueueState {
  if (typeof window === "undefined") return EMPTY_QUEUE;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return EMPTY_QUEUE;
    const parsed = JSON.parse(raw) as Partial<QueueState>;
    return {
      pendingWrong: parsed.pendingWrong ?? [],
      answerCount: parsed.answerCount ?? 0,
    };
  } catch {
    return EMPTY_QUEUE;
  }
}

export function savePracticeQueue(state: QueueState): void {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function resetPracticeQueue(): void {
  localStorage.removeItem(KEY);
}
