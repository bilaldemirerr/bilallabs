import type { Pace, Subject } from "@/lib/kpss/types";

export const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

export function isAnalyticsEnabled(): boolean {
  return GA_MEASUREMENT_ID.length > 0;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

type EventMap = {
  question_view: {
    question_id: string;
    subject: Subject;
    slug: string;
  };
  cta_practice: {
    question_id: string;
    slug: string;
  };
  practice_start: {
    question_id?: string;
    source: string;
  };
  practice_answer: {
    question_id: string;
    subject: Subject;
    correct: boolean;
    pace: Pace;
    elapsed_ms: number;
    box: number;
  };
};

export function track<E extends keyof EventMap>(
  name: E,
  params: EventMap[E],
): void {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  window.gtag?.("event", name, params);
}

export function trackPageView(path: string): void {
  if (typeof window === "undefined" || !isAnalyticsEnabled()) return;
  window.gtag?.("config", GA_MEASUREMENT_ID, { page_path: path });
}
