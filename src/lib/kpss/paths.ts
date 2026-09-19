import type { Question } from "./types";
import { questionSlug } from "./slug";

/**
 * URL yapısının tek kaynağı. Adresler yayına girdikten sonra değiştirmek
 * pahalı olduğu için bütün bağlantılar buradan üretilir.
 */
export const LEVEL_BASE = "/kpss/ortaogretim";

export const START_PATH = `${LEVEL_BASE}/basla`;

export const subjectPath = (subject: Question["subject"]) =>
  `${LEVEL_BASE}/${subject}`;

export const topicPath = (subject: Question["subject"], topic: string) =>
  `${LEVEL_BASE}/${subject}/${topic}`;

/**
 * Soru sayfaları konu yolunun altında değil: bir sorunun konusu sonradan
 * düzeltildiğinde adresi kırılmasın diye.
 */
export const questionPath = (slug: string) => `${LEVEL_BASE}/soru/${slug}`;

export function questionPathFor(q: Question): string {
  return questionPath(questionSlug(q));
}

/** SRS sırasına göre ilk soruya yönlendiren geçici sayfa. */
export const startPath = () => START_PATH;
