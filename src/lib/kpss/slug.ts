import { QUESTIONS } from "./questions.ts";
import type { Question } from "./types.ts";

const TR_CHARS: Record<string, string> = {
  ç: "c",
  ğ: "g",
  ı: "i",
  ö: "o",
  ş: "s",
  ü: "u",
  â: "a",
  î: "i",
  û: "u",
};

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[çğıöşüâîû]/g, (c) => TR_CHARS[c] ?? c)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Soru id'si slug'ın sonuna eklenir: metin düzeltilse bile URL sabit kalır ve
 * iki soru aynı metinle çakışmaz.
 */
export function questionSlug(q: Question): string {
  const base = slugify(q.question);
  const short =
    base.length > 70 ? base.slice(0, 70).replace(/-[^-]*$/, "") : base;
  return short ? `${short}-${q.id}` : q.id;
}

const BY_SLUG = new Map(QUESTIONS.map((q) => [questionSlug(q), q]));

export function getQuestionBySlug(slug: string): Question | undefined {
  return BY_SLUG.get(slug);
}

export const ALL_SLUGS = [...BY_SLUG.keys()];
