"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/kpss/AuthProvider";
import { LEVEL_BASE, questionPath } from "@/lib/kpss/paths";
import { loadPracticeQueue } from "@/lib/kpss/practice-queue";
import { loadProgress } from "@/lib/kpss/progress-store";
import { QUESTIONS } from "@/lib/kpss/questions";
import { questionSlug } from "@/lib/kpss/slug";
import { resolveNextQuestion } from "@/lib/kpss/next-question";
import styles from "@/components/kpss/content.module.css";

export function StartPracticeRedirect() {
  const router = useRouter();
  const { uid, loading } = useAuth();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (loading) return;
    let cancelled = false;

    (async () => {
      const map = await loadProgress(uid);
      const queue = loadPracticeQueue();
      const resolved = resolveNextQuestion(
        QUESTIONS,
        map,
        queue.pendingWrong,
        queue.answerCount,
      );
      if (cancelled) return;
      if (resolved) {
        router.replace(questionPath(questionSlug(resolved.question)));
      } else {
        setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [loading, router, uid]);

  if (failed) {
    return (
      <main className={styles.main}>
        <p className={styles.lead}>Yayına alınmış soru bulunamadı.</p>
        <Link href={LEVEL_BASE}>Ana sayfaya dön</Link>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <p className={styles.lead}>Sıradaki soruya yönlendiriliyorsun…</p>
    </main>
  );
}
