import type { Pace, Question, QuestionProgress, Subject } from "./types.ts";
import { PROGRESS_SCHEMA_VERSION, SUBJECT_META } from "./types.ts";

const DAY_MS = 24 * 60 * 60 * 1000;

/** Leitner kutusu → tekrar aralığı (gün). Kutu yalnızca doğruluktan beslenir. */
const BOX_INTERVALS: Record<number, number> = {
  1: 0,
  2: 1,
  3: 3,
  4: 7,
  5: 14,
};

/**
 * Sınavın soru başına ortalaması: 130 dakika / 120 soru ≈ 65 saniye. Bu yalnızca
 * bir ortalama; hedef süreler ders bazında tutulur çünkü bir vatandaşlık sorusu
 * ile bir matematik problemi aynı süreyi hak etmiyor. Ders hedeflerinin soru
 * sayılarıyla ağırlıklı toplamı sınavın 130 dakikasını verir — doğrulaması
 * `npm run check` içinde.
 */
export const EXAM_AVERAGE_SEC = 65;

/** Hedef sürenin bu katının altı "hızlı" sayılır. */
const FAST_RATIO = 0.6;

/** Yanlış cevaplanan soru, araya bu kadar soru girmeden geri gelmez. */
export const WRONG_REINSERT_GAP = 5;

export function targetTimeSec(question: Question): number {
  return question.targetTimeSec ?? SUBJECT_META[question.subject].targetTimeSec;
}

export function subjectTargetSec(subject: Subject): number {
  return SUBJECT_META[subject].targetTimeSec;
}

export function classifyPace(elapsedMs: number, targetSec: number): Pace {
  const ratio = elapsedMs / (targetSec * 1000);
  if (ratio <= FAST_RATIO) return "fast";
  if (ratio <= 1) return "normal";
  return "slow";
}

export function createProgress(questionId: string): QuestionProgress {
  return {
    questionId,
    version: PROGRESS_SCHEMA_VERSION,
    box: 1,
    lastReviewed: 0,
    nextReview: 0,
    timesSeen: 0,
    slowCount: 0,
    speedFlag: false,
  };
}

/**
 * Doğruluk kutuyu belirler, hız yalnızca aralığı kısaltır ve hız bayrağı koyar.
 * ponytail: "fast" ile "normal" aynı aralığı alıyor; ayrım şimdilik raporlama
 * için tutuluyor. Gerçek kullanım verisi geldiğinde hızlıya bonus verilebilir.
 */
export function updateProgress(
  current: QuestionProgress,
  correct: boolean,
  pace: Pace,
  now = Date.now(),
): QuestionProgress {
  const box = correct ? Math.min(5, current.box + 1) : 1;
  const slow = correct && pace === "slow";

  const baseDays = BOX_INTERVALS[box] ?? 1;
  const days = slow ? Math.max(1, Math.floor(baseDays / 2)) : baseDays;

  return {
    questionId: current.questionId,
    version: PROGRESS_SCHEMA_VERSION,
    box,
    lastReviewed: now,
    nextReview: now + days * DAY_MS,
    timesSeen: current.timesSeen + 1,
    slowCount: current.slowCount + (slow ? 1 : 0),
    speedFlag: correct ? slow : current.speedFlag,
    lastCorrect: correct,
    lastPace: pace,
  };
}

export function isDue(progress: QuestionProgress, now = Date.now()): boolean {
  return progress.timesSeen === 0 || progress.nextReview <= now;
}

/** Yanlış cevaplanıp geri gelmeyi bekleyen soru. */
export type PendingWrong = {
  questionId: string;
  readyAtAnswer: number;
};

export function queueWrong(
  pending: PendingWrong[],
  questionId: string,
  answerCount: number,
  gap = WRONG_REINSERT_GAP,
): PendingWrong[] {
  return [
    ...pending.filter((item) => item.questionId !== questionId),
    { questionId, readyAtAnswer: answerCount + gap },
  ];
}

export function dequeueWrong(
  pending: PendingWrong[],
  questionId: string,
): PendingWrong[] {
  return pending.filter((item) => item.questionId !== questionId);
}

/**
 * Sıra: (1) bekleme süresi dolmuş yanlışlar, (2) tekrar zamanı gelmiş sorular
 * düşük kutudan yükseğe, (3) başka seçenek yoksa henüz beklemede olan yanlış,
 * (4) hepsi güncelse en uzun süre görülmeyen.
 */
export function pickNextQuestion(
  questions: Question[],
  progressMap: Record<string, QuestionProgress>,
  pendingWrong: PendingWrong[] = [],
  answerCount = 0,
  now = Date.now(),
): Question | null {
  const byId = new Map(questions.map((q) => [q.id, q]));

  const ready = pendingWrong
    .filter((item) => item.readyAtAnswer <= answerCount)
    .map((item) => byId.get(item.questionId))
    .filter((q): q is Question => q !== undefined);
  if (ready.length > 0) return ready[0];

  const blocked = new Set(
    pendingWrong
      .filter((item) => item.readyAtAnswer > answerCount)
      .map((item) => item.questionId),
  );

  const candidates = questions
    .filter((q) => !blocked.has(q.id))
    .map((q) => ({
      question: q,
      progress: progressMap[q.id] ?? createProgress(q.id),
    }));

  const due = candidates
    .filter(({ progress }) => isDue(progress, now))
    .sort((a, b) => {
      if (a.progress.box !== b.progress.box) {
        return a.progress.box - b.progress.box;
      }
      return a.progress.nextReview - b.progress.nextReview;
    });
  if (due.length > 0) return due[0].question;

  // Havuz tükendiyse beklemedeki yanlışı erken getirmek, aynı soruyu
  // üst üste göstermekten iyidir.
  const earliestBlocked = [...pendingWrong]
    .sort((a, b) => a.readyAtAnswer - b.readyAtAnswer)
    .map((item) => byId.get(item.questionId))
    .find((q): q is Question => q !== undefined);
  if (candidates.length === 0 && earliestBlocked) return earliestBlocked;

  const fallback = [...candidates].sort(
    (a, b) => a.progress.lastReviewed - b.progress.lastReviewed,
  );
  return fallback[0]?.question ?? earliestBlocked ?? null;
}

export function computeStats(
  questions: Question[],
  progressMap: Record<string, QuestionProgress>,
  now = Date.now(),
) {
  let seen = 0;
  let due = 0;
  let mastered = 0;
  let slow = 0;

  for (const q of questions) {
    const p = progressMap[q.id];
    if (!p || p.timesSeen === 0) continue;
    seen++;
    if (isDue(p, now)) due++;
    if (p.box >= 4) mastered++;
    if (p.speedFlag) slow++;
  }

  return {
    total: questions.length,
    seen,
    unseen: questions.length - seen,
    due,
    mastered,
    /** Biliyor ama sınav temposunda değil — sınavda zaman kaybettiren sorular. */
    slow,
  };
}
