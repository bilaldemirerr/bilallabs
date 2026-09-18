import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QUESTIONS } from "@/lib/kpss/questions";
import { questionSlug } from "@/lib/kpss/slug";
import {
  LEVEL_BASE,
  practicePath,
  questionPath,
  subjectPath,
  topicPath,
} from "@/lib/kpss/paths";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import {
  isSubject,
  SECTION_LABELS,
  SUBJECTS,
  SUBJECT_META,
  TOPICS,
  topicLabel,
} from "@/lib/kpss/types";
import styles from "@/components/kpss/content.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.flatMap((ders) =>
    Object.keys(TOPICS[ders]).map((konu) => ({ ders, konu })),
  );
}

function summarize(text: string, max = 90): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ders: string; konu: string }>;
}): Promise<Metadata> {
  const { ders, konu } = await params;
  if (!isSubject(ders)) return {};
  const label = topicLabel(ders, konu);
  if (!label) return {};

  const subject = SUBJECT_META[ders];
  const count = QUESTIONS.filter(
    (q) => q.subject === ders && q.topic === konu,
  ).length;

  return {
    title: `${label} — KPSS ${subject.label} Soruları`,
    description: `KPSS Ortaöğretim ${subject.label} dersinin ${label} konusu: çözümlü sorular, doğru cevaplar ve konu özetleri.${count ? ` Şu an ${count} çözümlü soru.` : ""}`,
    alternates: { canonical: topicPath(ders, konu) },
    openGraph: {
      title: `${label} — KPSS ${subject.label}`,
      description: `KPSS Ortaöğretim ${label} konusunda çözümlü sorular.`,
      url: topicPath(ders, konu),
    },
    // Sorusu olmayan konu sayfası ince içeriktir; havuz dolunca indekse açılır.
    robots: count === 0 ? { index: false, follow: true } : undefined,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ ders: string; konu: string }>;
}) {
  const { ders, konu } = await params;
  if (!isSubject(ders)) notFound();
  const label = topicLabel(ders, konu);
  if (!label) notFound();

  const subject = SUBJECT_META[ders];
  const questions = QUESTIONS.filter(
    (q) => q.subject === ders && q.topic === konu,
  );
  const siblings = Object.entries(TOPICS[ders])
    .filter(([slug]) => slug !== konu)
    .map(([slug, topicName]) => ({
      slug,
      label: topicName,
      count: QUESTIONS.filter((q) => q.subject === ders && q.topic === slug)
        .length,
    }));

  const crumbs = [
    { name: "KPSS Ortaöğretim", path: LEVEL_BASE },
    { name: subject.label, path: subjectPath(ders) },
    { name: label, path: topicPath(ders, konu) },
  ];

  return (
    <main className={styles.main}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(crumbs))}
      />

      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href={LEVEL_BASE}>KPSS Ortaöğretim</Link>
        <span aria-hidden="true">/</span>
        <Link href={subjectPath(ders)}>{subject.label}</Link>
        <span aria-hidden="true">/</span>
        <span>{label}</span>
      </nav>

      <h1>
        KPSS {subject.label} — {label} Soruları
      </h1>
      <p className={styles.lead}>
        {label} konusu, KPSS Ortaöğretim{" "}
        {SECTION_LABELS[subject.section]} bölümündeki {subject.label} dersinin
        alt başlıklarından biri. Sınavda bu dersten toplam{" "}
        {subject.examQuestions} soru çıkıyor.
      </p>

      {questions.length > 0 ? (
        <>
          <Link href={practicePath(undefined, { from: "topic" })} className={styles.cta}>
            {label} sorusu çöz
          </Link>

          <section className={styles.section}>
            <h2>Çözümlü sorular ({questions.length})</h2>
            <ul className={styles.links}>
              {questions.map((q) => (
                <li key={q.id}>
                  <Link href={questionPath(questionSlug(q))}>
                    {summarize(q.question)}
                    <span className={styles.linkMeta}>
                      Doğru cevap, çözüm ve konu özeti
                      {q.sourceYear ? ` · ${q.sourceYear}` : ""}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      ) : (
        <p className={styles.lead}>
          Bu konuda henüz yayımlanmış soru yok. {subject.label} dersinin diğer
          konularına aşağıdan ulaşabilirsin.
        </p>
      )}

      <section className={styles.section}>
        <h2>{subject.label} dersinin diğer konuları</h2>
        <ul className={styles.links}>
          {siblings.map((topic) => (
            <li key={topic.slug}>
              {topic.count > 0 ? (
                <Link href={topicPath(ders, topic.slug)}>
                  {topic.label}
                  <span className={styles.linkMeta}>
                    {topic.count} çözümlü soru
                  </span>
                </Link>
              ) : (
                <span className={styles.linkMuted}>
                  {topic.label}
                  <span className={styles.linkMeta}>soru hazırlanıyor</span>
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
