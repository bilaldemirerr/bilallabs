"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/kpss/AuthProvider";
import { loadPracticeQueue } from "@/lib/kpss/practice-queue";
import { loadProgress } from "@/lib/kpss/progress-store";
import { resolveNextQuestion } from "@/lib/kpss/next-question";
import { questionPathFor } from "@/lib/kpss/paths";
import { QUESTIONS } from "@/lib/kpss/questions";
import styles from "@/components/kpss/content.module.css";

type Props = {
  currentQuestionId: string;
  /** Cevap kaydedildikten sonra yeniden hesaplamak için artır. */
  refreshKey?: number;
};

export function NextQuestionNav({
  currentQuestionId,
  refreshKey = 0,
}: Props) {
  const { uid, loading: authLoading } = useAuth();
  const [next, setNext] = useState<{
    href: string;
    hint: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    loadProgress(uid).then((map) => {
      if (cancelled) return;
      const queue = loadPracticeQueue();
      const resolved = resolveNextQuestion(
        QUESTIONS,
        map,
        queue.pendingWrong,
        queue.answerCount,
        [currentQuestionId],
      );
      if (!resolved) {
        setNext(null);
        return;
      }
      const href = questionPathFor(resolved.question);
      setNext({
        href,
        hint: resolved.hint,
        title: resolved.question.question.replace(/\s+/g, " ").trim().slice(0, 72),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [authLoading, currentQuestionId, refreshKey, uid]);

  if (!next) return null;

  return (
    <nav className={styles.nextNav} aria-label="Sıradaki soru">
      <Link href={next.href} className={styles.nextNavLink}>
        <span className={styles.nextNavLabel}>Sıradaki soru →</span>
        <span className={styles.nextNavHint}>{next.hint}</span>
        <span className={styles.nextNavPreview}>{next.title}…</span>
      </Link>
    </nav>
  );
}
