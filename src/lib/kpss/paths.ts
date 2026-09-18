import type { Subject } from "./types";

/**
 * URL yapısının tek kaynağı. Adresler yayına girdikten sonra değiştirmek
 * pahalı olduğu için bütün bağlantılar buradan üretilir.
 */
export const LEVEL_BASE = "/kpss/ortaogretim";

export const subjectPath = (subject: Subject) => `${LEVEL_BASE}/${subject}`;

export const topicPath = (subject: Subject, topic: string) =>
  `${LEVEL_BASE}/${subject}/${topic}`;

/**
 * Soru sayfaları konu yolunun altında değil: bir sorunun konusu sonradan
 * düzeltildiğinde adresi kırılmasın diye.
 */
export const questionPath = (slug: string) => `${LEVEL_BASE}/soru/${slug}`;

export type PracticeSource = "question" | "landing" | "subject" | "topic";

export const practicePath = (
  questionId?: string,
  opts?: { from?: PracticeSource },
) => {
  const params = new URLSearchParams();
  if (questionId) params.set("soru", questionId);
  if (opts?.from) params.set("from", opts.from);
  const query = params.toString();
  return query ? `/kpss/calis?${query}` : "/kpss/calis";
};
