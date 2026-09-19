"use client";

import Link from "next/link";
import { ResetProgressButton } from "@/components/kpss/ResetProgressButton";
import { startPath } from "@/lib/kpss/paths";
import { useSession } from "@/lib/kpss/session";
import styles from "./ResumeCard.module.css";

export function ResumeCard({ totalQuestions }: { totalQuestions: number }) {
  const session = useSession();
  const started = session.totalAnswered > 0;

  return (
    <div className={styles.wrap}>
      <Link href={startPath()} className={styles.cta}>
        {started ? "Kaldığın yerden devam et" : "Soru çözmeye başla"}
      </Link>

      {started ? (
        <dl className={styles.stats}>
          <div>
            <dt>Bugün</dt>
            <dd>{session.todayCount} soru</dd>
          </div>
          <div>
            <dt>Seri</dt>
            <dd>{session.streak} gün</dd>
          </div>
          <div>
            <dt>Tekrar</dt>
            <dd>{session.dueCount} soru</dd>
          </div>
          <div>
            <dt>Toplam</dt>
            <dd>{session.totalAnswered} cevap</dd>
          </div>
        </dl>
      ) : (
        <p className={styles.note}>
          {totalQuestions} soru · Kayıt gerekmez · İlerlemen kaydedilir
        </p>
      )}

      <ResetProgressButton />
    </div>
  );
}
