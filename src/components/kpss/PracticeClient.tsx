"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "./AuthProvider";
import { QUESTIONS } from "@/lib/kpss/questions";
import { loadProgress, saveProgress } from "@/lib/kpss/progress-store";
import { LEVEL_BASE } from "@/lib/kpss/paths";
import {
  classifyPace,
  computeStats,
  createProgress,
  dequeueWrong,
  pickNextQuestion,
  queueWrong,
  targetTimeSec,
  updateProgress,
  type PendingWrong,
} from "@/lib/kpss/srs";
import { track } from "@/lib/analytics";
import { recordAnswer, useSession } from "@/lib/kpss/session";
import type { Pace, Question, QuestionProgress } from "@/lib/kpss/types";
import { SUBJECT_LABELS } from "@/lib/kpss/types";
import styles from "./PracticeClient.module.css";

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

type Answer = {
  index: number;
  correct: boolean;
  pace: Pace;
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

export function PracticeClient() {
  const { uid, loading: authLoading, mode } = useAuth();
  const [progressMap, setProgressMap] = useState<
    Record<string, QuestionProgress>
  >({});
  const [ready, setReady] = useState(false);
  const [current, setCurrent] = useState<Question | null>(null);
  const [answer, setAnswer] = useState<Answer | null>(null);
  const [pendingWrong, setPendingWrong] = useState<PendingWrong[]>([]);
  const [answerCount, setAnswerCount] = useState(0);
  const session = useSession();
  const shownAt = useRef(0);
  const sessionTracked = useRef(false);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    loadProgress(uid).then((map) => {
      if (cancelled) return;
      // Soru sayfasındaki "uygulamada çöz" bağlantısı: /kpss/calis?soru=<id>
      const requested = new URLSearchParams(window.location.search).get("soru");
      const direct = requested
        ? QUESTIONS.find((q) => q.id === requested)
        : undefined;

      setProgressMap(map);
      setCurrent(direct ?? pickNextQuestion(QUESTIONS, map));
      setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, [uid, authLoading]);

  useEffect(() => {
    shownAt.current = Date.now();
  }, [current]);

  useEffect(() => {
    if (!ready || sessionTracked.current) return;
    sessionTracked.current = true;
    const params = new URLSearchParams(window.location.search);
    track("practice_start", {
      question_id: params.get("soru") ?? undefined,
      source: params.get("from") ?? "direct",
    });
  }, [ready]);

  const stats = useMemo(
    () => computeStats(QUESTIONS, progressMap),
    [progressMap],
  );

  const loadNext = useCallback(
    (
      map: Record<string, QuestionProgress>,
      queue: PendingWrong[],
      count: number,
    ) => {
      setCurrent(pickNextQuestion(QUESTIONS, map, queue, count));
      setAnswer(null);
    },
    [],
  );

  async function handleSelect(index: number) {
    if (!current || answer) return;

    const elapsedMs = elapsedSince(shownAt.current);
    const targetSec = targetTimeSec(current);
    const correct = index === current.correct;
    const pace = classifyPace(elapsedMs, targetSec);

    const updated = updateProgress(
      progressMap[current.id] ?? createProgress(current.id),
      correct,
      pace,
    );
    const newMap = { ...progressMap, [current.id]: updated };
    const nextCount = answerCount + 1;

    setAnswer({
      index,
      correct,
      pace,
      elapsedMs,
      targetSec,
      nextReview: updated.nextReview,
    });
    setProgressMap(newMap);
    setAnswerCount(nextCount);
    setPendingWrong((queue) =>
      correct
        ? dequeueWrong(queue, current.id)
        : queueWrong(queue, current.id, nextCount),
    );

    await saveProgress(uid, current.id, updated);
    recordAnswer(current.id, computeStats(QUESTIONS, newMap).due);

    track("practice_answer", {
      question_id: current.id,
      subject: current.subject,
      correct,
      pace,
      elapsed_ms: elapsedMs,
      box: updated.box,
    });
  }

  if (authLoading || !ready) {
    return <p className={styles.loading}>Hazırlanıyor…</p>;
  }

  if (!current) {
    return (
      <div className={styles.empty}>
        <p>Yayına alınmış soru bulunamadı.</p>
        <Link href={LEVEL_BASE}>Ana sayfaya dön</Link>
      </div>
    );
  }

  const progress = progressMap[current.id] ?? createProgress(current.id);
  const feedbackClass = !answer
    ? ""
    : answer.correct
      ? answer.pace === "slow"
        ? styles.slow
        : styles.known
      : styles.wrong;

  return (
    <div className={styles.wrap}>
      <header className={styles.header}>
        <Link href={LEVEL_BASE} className={styles.back}>
          ← KPSS
        </Link>
        <div className={styles.meta}>
          <span>{SUBJECT_LABELS[current.subject]}</span>
          <span>Kutu {progress.box}</span>
          <span>{mode === "firebase" ? "☁️" : "📱"}</span>
        </div>
      </header>

      <div className={styles.stats}>
        <span>{stats.due} tekrar</span>
        <span>{stats.unseen} yeni</span>
        <span>{stats.mastered} oturdu</span>
        <span>{stats.slow} yavaş</span>
        <span>Bugün {session.todayCount}</span>
        <span>Seri {session.streak} gün</span>
      </div>

      <article className={styles.card}>
        <p className={styles.question}>{current.question}</p>
        <ul className={styles.options}>
          {current.options.map((text, i) => {
            let stateClass = "";
            if (answer) {
              if (i === current.correct) stateClass = styles.correct;
              else if (i === answer.index) stateClass = styles.incorrect;
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  className={`${styles.option} ${stateClass}`}
                  onClick={() => handleSelect(i)}
                  disabled={answer !== null}
                >
                  <span className={styles.optionLabel}>{OPTION_LABELS[i]}</span>
                  {text}
                </button>
              </li>
            );
          })}
        </ul>

        {answer && (
          <>
            <p className={`${styles.feedback} ${feedbackClass}`} role="status">
              {verdict(answer)}
            </p>
            <p className={styles.explanation}>{current.explanation}</p>
          </>
        )}
      </article>

      {answer ? (
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => loadNext(progressMap, pendingWrong, answerCount)}
        >
          Sıradaki soru
        </button>
      ) : (
        <p className={styles.hint}>
          Şıkkı işaretle — gerisi otomatik değerlendirilir.
        </p>
      )}
    </div>
  );
}
