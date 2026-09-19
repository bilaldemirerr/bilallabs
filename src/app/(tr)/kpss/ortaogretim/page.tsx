import type { Metadata } from "next";
import Link from "next/link";
import { ResumeCard } from "@/components/kpss/ResumeCard";
import { QUESTIONS } from "@/lib/kpss/questions";
import { LEVEL_BASE, startPath, subjectPath } from "@/lib/kpss/paths";
import { jsonLdHtml } from "@/lib/kpss/seo";
import { SUBJECTS, SUBJECT_META } from "@/lib/kpss/types";
import { SITE_URL } from "@/lib/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "KPSS Ortaöğretim Soru Bankası — Çıkmış Sorular ve Çözümleri",
  description:
    "Ücretsiz KPSS Ortaöğretim soru bankası. Türkçe, matematik, tarih, coğrafya, vatandaşlık ve güncel bilgiler soruları; her soruda çözüm, çeldirici açıklaması ve konu özeti.",
  keywords: [
    "KPSS ortaöğretim",
    "KPSS soru bankası",
    "KPSS çıkmış sorular",
    "KPSS ortaöğretim konuları",
    "KPSSP94",
    "2026 KPSS",
  ],
  alternates: { canonical: LEVEL_BASE },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    title: "KPSS Ortaöğretim Soru Bankası",
    description:
      "Çözümlü sorular ve aralıklı tekrar. Bilemediklerin daha sık karşına çıkar.",
    url: LEVEL_BASE,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "KPSS Ortaöğretim Soru Bankası",
  url: `${SITE_URL}${LEVEL_BASE}`,
  inLanguage: "tr-TR",
  description:
    "KPSS Ortaöğretim çıkmış soruları, çözümleri ve aralıklı tekrar sistemi.",
};

export default function OrtaogretimHubPage() {
  return (
    <main className={styles.main}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />

      <p className={styles.eyebrow}>
        <Link href="/">Bilal Labs</Link>
      </p>
      <h1>KPSS Ortaöğretim Soru Bankası</h1>
      <p className={styles.lead}>
        Çözümlü sorularla çalış. Şıkkı işaretlersin, sistem hem doğruluğuna hem
        ne kadar sürdüğüne bakıp sorunun ne zaman geri geleceğine karar verir.
      </p>

      <ResumeCard totalQuestions={QUESTIONS.length} />

      <section className={styles.block}>
        <h2>Derslere göre sorular</h2>
        <ul className={styles.subjects}>
          {SUBJECTS.map((subject) => {
            const meta = SUBJECT_META[subject];
            const count = QUESTIONS.filter((q) => q.subject === subject).length;
            return (
              <li key={subject}>
                <Link href={subjectPath(subject)}>
                  <strong>{meta.label}</strong>
                  <span>
                    Sınavda {meta.examQuestions} soru · {count} soru hazır
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.block}>
        <h2>Nasıl çalışır?</h2>
        <p className={styles.text}>
          Kendini değerlendirmen gerekmez. Bilgi seviyeni yalnızca doğru cevap
          belirler; süre ise sorunun sınavda sana zaman kaybettirip
          kaybettirmediğini gösterir. Hedef süre derse göre değişir: bir
          vatandaşlık sorusu 30 saniye, matematik problemi 100 saniye.
        </p>
        <ul className={styles.features}>
          <li>
            <strong>Hedef sürede doğru</strong> — aralık her doğruda uzar: 1, 3,
            7, 14 gün
          </li>
          <li>
            <strong>Doğru ama yavaş</strong> — bildiğin kabul edilir, ama daha
            erken tekrar gelir ve &quot;yavaş&quot; olarak işaretlenir
          </li>
          <li>
            <strong>Yanlış</strong> — aynı oturumda, araya birkaç soru girdikten
            sonra yeniden karşına çıkar
          </li>
        </ul>
      </section>

      <section className={styles.block}>
        <h2>2026 KPSS Ortaöğretim sınavı</h2>
        <p className={styles.text}>
          Sınav 25 Ekim 2026 Pazar günü tek oturumda yapılıyor. 130 dakikada 120
          soru var: 60 soru Genel Yetenek (30 Türkçe, 30 matematik), 60 soru
          Genel Kültür (27 tarih, 18 coğrafya, 9 vatandaşlık, 6 güncel
          bilgiler). Hesaplanan puan türü KPSSP94&apos;tür ve iki yıl
          geçerlidir. Dört yanlış bir doğruyu götürdüğü için emin olmadığın
          sorularda eleme yapmadan işaretlemek zarar yazar.
        </p>
        <Link href={startPath()} className={styles.inlineCta}>
          Soru çözmeye başla
        </Link>
      </section>
    </main>
  );
}
