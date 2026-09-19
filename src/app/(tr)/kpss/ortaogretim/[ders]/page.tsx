import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QUESTIONS } from "@/lib/kpss/questions";
import {
  LEVEL_BASE,
  startPath,
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
} from "@/lib/kpss/types";
import styles from "@/components/kpss/content.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return SUBJECTS.map((ders) => ({ ders }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ ders: string }>;
}): Promise<Metadata> {
  const { ders } = await params;
  if (!isSubject(ders)) return {};
  const subject = SUBJECT_META[ders];

  return {
    title: `KPSS ${subject.label} Soruları ve Konuları`,
    description: `KPSS Ortaöğretim ${subject.label} konuları ve çözümlü soruları. Sınavda ${subject.examQuestions} soru ${subject.label} dersinden çıkıyor.`,
    alternates: { canonical: subjectPath(ders) },
    openGraph: {
      title: `KPSS ${subject.label} Soruları`,
      description: `KPSS Ortaöğretim ${subject.label} konuları ve çözümlü soruları.`,
      url: subjectPath(ders),
    },
  };
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  const { ders } = await params;
  if (!isSubject(ders)) notFound();

  const subject = SUBJECT_META[ders];
  const questions = QUESTIONS.filter((q) => q.subject === ders);
  const topics = Object.entries(TOPICS[ders]).map(([slug, label]) => ({
    slug,
    label,
    count: questions.filter((q) => q.topic === slug).length,
  }));
  const others = SUBJECTS.filter((s) => s !== ders);

  const crumbs = [
    { name: "KPSS Ortaöğretim", path: LEVEL_BASE },
    { name: subject.label, path: subjectPath(ders) },
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
        <span>{subject.label}</span>
      </nav>

      <h1>KPSS {subject.label} Soruları</h1>
      <p className={styles.lead}>
        2026 KPSS Ortaöğretim sınavında {SECTION_LABELS[subject.section]}{" "}
        bölümünden toplam {subject.examQuestions} soru {subject.label} dersinden
        geliyor. {subject.topics}
      </p>

      <Link href={startPath()} className={styles.cta}>
        Sıradaki önerilen soruya git
      </Link>

      <section className={styles.section}>
        <h2>{subject.label} konuları</h2>
        <ul className={styles.links}>
          {topics.map((topic) => (
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

      <section className={styles.section}>
        <h2>Diğer dersler</h2>
        <ul className={styles.subjectGrid}>
          {others.map((s) => (
            <li key={s}>
              <Link href={subjectPath(s)}>
                {SUBJECT_META[s].label}
                <span className={styles.subjectCount}>
                  Sınavda {SUBJECT_META[s].examQuestions} soru
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
