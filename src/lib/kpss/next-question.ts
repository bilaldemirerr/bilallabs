import type { Question, QuestionProgress } from "./types";
import {
  createProgress,
  isDue,
  pickNextQuestion,
  type PendingWrong,
} from "./srs";

export type NextQuestionResult = {
  question: Question;
  hint: string;
};

export function nextQuestionHint(
  question: Question,
  progress: QuestionProgress,
  pendingWrongIds: Set<string>,
): string {
  if (pendingWrongIds.has(question.id)) {
    return "Yanlış yaptığın soru — tekrar";
  }
  if (progress.timesSeen === 0) {
    return "Henüz çözmediğin soru";
  }
  if (progress.speedFlag) {
    return "Bildiğin ama yavaş kaldığın soru";
  }
  if (isDue(progress)) {
    return "Tekrar zamanı geldi";
  }
  return "Sıradaki önerilen soru";
}

export function resolveNextQuestion(
  questions: Question[],
  progressMap: Record<string, QuestionProgress>,
  pendingWrong: PendingWrong[],
  answerCount: number,
  excludeIds: string[] = [],
  now = Date.now(),
): NextQuestionResult | null {
  const next = pickNextQuestion(
    questions,
    progressMap,
    pendingWrong,
    answerCount,
    now,
    excludeIds,
  );
  if (!next) return null;

  const progress = progressMap[next.id] ?? createProgress(next.id);
  const pendingIds = new Set(
    pendingWrong
      .filter((item) => item.readyAtAnswer <= answerCount)
      .map((item) => item.questionId),
  );

  return {
    question: next,
    hint: nextQuestionHint(next, progress, pendingIds),
  };
}
