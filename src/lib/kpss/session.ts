"use client";

import { useSyncExternalStore } from "react";

export type Session = {
  lastQuestionId: string | null;
  lastActiveDate: string;
  todayCount: number;
  streak: number;
  totalAnswered: number;
  dueCount: number;
};

const KEY = "kpss-session";

export const EMPTY_SESSION: Session = {
  lastQuestionId: null,
  lastActiveDate: "",
  todayCount: 0,
  streak: 0,
  totalAnswered: 0,
  dueCount: 0,
};

export function todayKey(now = new Date()): string {
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function daysBetween(from: string, to: string): number {
  const diff = Date.parse(to) - Date.parse(from);
  return Number.isNaN(diff) ? NaN : Math.round(diff / 86_400_000);
}

export function nextSession(
  previous: Session,
  questionId: string,
  dueCount: number,
  today: string,
): Session {
  const sameDay = previous.lastActiveDate === today;
  const continued = daysBetween(previous.lastActiveDate, today) === 1;

  return {
    lastQuestionId: questionId,
    lastActiveDate: today,
    todayCount: sameDay ? previous.todayCount + 1 : 1,
    streak: sameDay
      ? Math.max(previous.streak, 1)
      : continued
        ? previous.streak + 1
        : 1,
    totalAnswered: previous.totalAnswered + 1,
    dueCount,
  };
}

const listeners = new Set<() => void>();

let cachedRaw: string | null = null;
let cachedSession: Session = EMPTY_SESSION;

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", notify);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", notify);
  };
}

/** Referansı sabit tutar; useSyncExternalStore aksi hâlde sonsuz döngüye girer. */
function getSnapshot(): Session {
  const raw = localStorage.getItem(KEY);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedSession = raw
        ? { ...EMPTY_SESSION, ...(JSON.parse(raw) as Partial<Session>) }
        : EMPTY_SESSION;
    } catch {
      cachedSession = EMPTY_SESSION;
    }
  }
  return cachedSession;
}

function getServerSnapshot(): Session {
  return EMPTY_SESSION;
}

/**
 * ponytail: ilerleme göstergesi cihaza bağlı (localStorage), hesaba değil.
 * Çapraz cihaz desteği için anonim hesabı Google ile eşleyip (linkWithPopup)
 * bu alanları Firestore'daki kullanıcı dokümanına taşımak gerekir.
 */
export function useSession(): Session {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function recordAnswer(questionId: string, dueCount: number): void {
  const updated = nextSession(
    getSnapshot(),
    questionId,
    dueCount,
    todayKey(),
  );
  localStorage.setItem(KEY, JSON.stringify(updated));
  notify();
}

export function resetSession(): void {
  localStorage.removeItem(KEY);
  cachedRaw = null;
  cachedSession = EMPTY_SESSION;
  notify();
}
