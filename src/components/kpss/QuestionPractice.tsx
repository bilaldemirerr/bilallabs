"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/components/kpss/AuthProvider";
import { track } from "@/lib/analytics";
import { loadProgress, saveProgress } from "@/lib/kpss/progress-store";
import {
  loadPracticeQueue,
  savePracticeQueue,
} from "@/lib/kpss/practice-queue";
import {
  classifyPace,
  computeStats,
  createProgress,
  dequeueWrong,
  queueWrong,
  targetTimeSec,
  updateProgress,
} from "@/lib/kpss/srs";
import { QUESTIONS } from "@/lib/kpss/questions";
import { recordAnswer, useSession } from "@/lib/kpss/session";
import type { Question } from "@/lib/kpss/types";
import styles from "@/components/kpss/content.module.css";

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

type Answer = {
  index: number;
  correct: boolean;
  pace: "fast" | "normal" | "slow";
  elapsedMs: number;
  targetSec: number;
  nextReview: number;
};

function elapsedSince(startedAt: number): number {
  return Date.now() - startedAt;
}

function reviewLabel(nextReview: number): string {
  const days = Math.round((nextReview - Date.now()) / 86_400_000);
  if (days <= 0) return "biraz sonra yeniden gelecek";
  if (days === 1) return "yarın yeniden gelecek";
  return `${days} gün sonra yeniden gelecek`;
}

function verdict(answer: Answer): string {
  const seconds = Math.round(answer.elapsedMs / 1000);
  const review = reviewLabel(answer.nextReview);

  if (!answer.correct) {
    return `Yanlış — ${review}.`;
  }
  if (answer.pace === "slow") {
    return `Doğru, ama ${seconds} saniye sürdü (hedef ${answer.targetSec} sn) — bildiğin bir soru, sınavda zaman kaybettiriyor. ${review.charAt(0).toUpperCase()}${review.slice(1)}.`;
  }
  return `Doğru, ${seconds} saniyede (hedef ${answer.targetSec} sn) — ${review}.`;
}

type Props = {
  question: Question;
  solutionId: string;
  onAnswered?: () => void;
};

export function QuestionPractice({ question, solutionId, onAnswered }: Props) {
  const { uid, loading: authLoading } = useAuth();
  const session = useSession();
  const [ready, setReady] = useState(false);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const shownAt = useRef(0);

  useEffect(() => {
    shownAt.current = Date.now();
    setAnswer(null);
  }, [question.id]);

  useEffect(() => {
    const solution = document.getElementById(solutionId);
    if (!solution) return;
    solution.classList.toggle(styles.solutionRevealed, answer !== null);
  }, [answer, solutionId, styles.solutionRevealed]);

  useEffect(() => {
    if (!authLoading) setReady(true);
  }, [authLoading]);

  async function handleSelect(index: number) {
    if (answer) return;

    const elapsedMs = elapsedSince(shownAt.current);
    const targetSec = targetTimeSec(question);
    const correct = index === question.correct;
    const pace = classifyPace(elapsedMs, targetSec);

    const map = await loadProgress(uid);
    const queue = loadPracticeQueue();
    const updated = updateProgress(
      map[question.id] ?? createProgress(question.id),
      correct,
      pace,
    );
    const newMap = { ...map, [question.id]: updated };
    const nextCount = queue.answerCount + 1;
    const newQueue = {
      pendingWrong: correct
        ? dequeueWrong(queue.pendingWrong, question.id)
        : queueWrong(queue.pendingWrong, question.id, queue.answerCount),
      answerCount: nextCount,
    };

    setAnswer({
      index,
      correct,
      pace,
      elapsedMs,
      targetSec,
      nextReview: updated.nextReview,
    });

    savePracticeQueue(newQueue);
    await saveProgress(uid, question.id, updated);
    recordAnswer(question.id, computeStats(QUESTIONS, newMap).due);
    onAnswered?.();

    track("practice_answer", {
      question_id: question.id,
      subject: question.subject,
      correct,
      pace,
      elapsed_ms: elapsedMs,
      box: updated.box,
    });
  }

  const feedbackClass = useMemo(() => {
    if (!answer) return "";
    if (!answer.correct) return styles.feedbackWrong;
    if (answer.pace === "slow") return styles.feedbackSlow;
    return styles.feedbackKnown;
  }, [answer]);

  if (!ready) {
    return <p className={styles.practiceHint}>Hazırlanıyor…</p>;
  }

  return (
    <div className={styles.practice}>
      <div className={styles.practiceStats}>
        <span>Bugün {session.todayCount}</span>
        <span>Seri {session.streak} gün</span>
      </div>

      <ul className={styles.optionButtons}>
        {question.options.map((text, i) => {
          let stateClass = "";
          if (answer) {
            if (i === question.correct) stateClass = styles.optionCorrect;
            else if (i === answer.index) stateClass = styles.optionIncorrect;
          }
          return (
            <li key={i}>
              <button
                type="button"
                className={`${styles.optionButton} ${stateClass}`}
                onClick={() => handleSelect(i)}
                disabled={answer !== null}
              >
                <span className={styles.answerKey}>{OPTION_LABELS[i]}</span>
                <span>{text}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {answer ? (
        <p className={`${styles.feedback} ${feedbackClass}`} role="status">
          {verdict(answer)}
        </p>
      ) : (
        <p className={styles.practiceHint}>
          Şıkkı işaretle — gerisi otomatik değerlendirilir. Bu soruyu atlayıp
          algoritmanın önerdiği soruya yukarıdan geçebilirsin.
        </p>
      )}

    </div>
  );
}
