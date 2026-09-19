import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionFlow } from "@/components/kpss/QuestionFlow";
import { QuestionViewTracker } from "@/components/analytics/QuestionViewTracker";
import { QUESTIONS } from "@/lib/kpss/questions";
import { ALL_SLUGS, getQuestionBySlug, questionSlug } from "@/lib/kpss/slug";
import {
  LEVEL_BASE,
  questionPath,
  subjectPath,
  topicPath,
} from "@/lib/kpss/paths";
import { breadcrumbJsonLd, jsonLdHtml } from "@/lib/kpss/seo";
import {
  SECTION_LABELS,
  SUBJECT_META,
  topicLabel,
  type OptionIndex,
} from "@/lib/kpss/types";
import { QuestionPrompt } from "@/components/kpss/QuestionPrompt";
import { QuestionSource } from "@/components/kpss/QuestionSource";
import styles from "@/components/kpss/content.module.css";

export const dynamicParams = false;

const OPTION_KEYS = ["A", "B", "C", "D", "E"] as const;

export function generateStaticParams() {
  return ALL_SLUGS.map((slug) => ({ slug }));
}

function summarize(text: string, max = 60): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length > max ? `${flat.slice(0, max).trimEnd()}…` : flat;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) return {};

  const subject = SUBJECT_META[question.subject];
  const topic = topicLabel(question.subject, question.topic);
  const title = `${summarize(question.question)} — KPSS ${subject.label}`;

  return {
    title,
    description: `${summarize(question.question, 100)} Doğru cevabı, çözümü ve diğer şıkların neden yanlış olduğu. KPSS Ortaöğretim ${subject.label}${topic ? ` / ${topic}` : ""}.`,
    alternates: { canonical: questionPath(slug) },
    openGraph: {
      type: "article",
      title,
      description: `KPSS Ortaöğretim ${subject.label} sorusu: doğru cevap, çözüm ve konu özeti.`,
      url: questionPath(slug),
    },
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const question = getQuestionBySlug(slug);
  if (!question) notFound();

  const subject = SUBJECT_META[question.subject];
  const topic = topicLabel(question.subject, question.topic);

  const sameTopic = QUESTIONS.filter(
    (q) => q.topic === question.topic && q.id !== question.id,
  );
  const sameSubject = QUESTIONS.filter(
    (q) =>
      q.subject === question.subject &&
      q.topic !== question.topic &&
      q.id !== question.id,
  );
  const related = [...sameTopic, ...sameSubject].slice(0, 5);

  const wrongOptions = question.options
    .map((text, index) => ({ text, index: index as OptionIndex }))
    .filter(({ index }) => index !== question.correct)
    .map((option) => ({
      ...option,
      reason: question.distractors?.[option.index],
    }))
    .filter((option) => option.reason);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    about: {
      "@type": "Thing",
      name: topic
        ? `KPSS Ortaöğretim ${subject.label} — ${topic}`
        : `KPSS Ortaöğretim ${subject.label}`,
    },
    hasPart: {
      "@type": "Question",
      eduQuestionType: "Multiple choice",
      learningResourceType: "Practice problem",
      name: summarize(question.question, 110),
      text: question.question,
      suggestedAnswer: question.options
        .map((text, index) => ({ text, index }))
        .filter(({ index }) => index !== question.correct)
        .map(({ text, index }) => ({
          "@type": "Answer",
          position: index,
          text,
        })),
      acceptedAnswer: {
        "@type": "Answer",
        position: question.correct,
        text: question.options[question.correct],
        answerExplanation: {
          "@type": "Comment",
          text: question.explanation,
        },
      },
    },
  };

  const crumbs = [
    { name: "KPSS Ortaöğretim", path: LEVEL_BASE },
    { name: subject.label, path: subjectPath(question.subject) },
    ...(topic
      ? [{ name: topic, path: topicPath(question.subject, question.topic) }]
      : []),
    { name: summarize(question.question, 70), path: questionPath(slug) },
  ];

  return (
    <main className={styles.main}>
      <QuestionViewTracker
        questionId={question.id}
        subject={question.subject}
        slug={slug}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdHtml(jsonLd)} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLdHtml(breadcrumbJsonLd(crumbs))}
      />

      <nav className={styles.crumbs} aria-label="Breadcrumb">
        <Link href={LEVEL_BASE}>KPSS Ortaöğretim</Link>
        <span aria-hidden="true">/</span>
        <Link href={subjectPath(question.subject)}>{subject.label}</Link>
        {topic && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={topicPath(question.subject, question.topic)}>
              {topic}
            </Link>
          </>
        )}
      </nav>

      <QuestionPrompt question={question} />
      <QuestionSource question={question} />
      <p className={styles.lead}>
        KPSS Ortaöğretim {SECTION_LABELS[subject.section]} · {subject.label}
        {topic ? ` · ${topic}` : ""}
      </p>

      <QuestionFlow question={question} solutionId="question-solution">
      <div id="question-solution" className={styles.solutionBlock}>
        <ul className={styles.answers}>
          {question.options.map((text, index) => {
            const isCorrect = index === question.correct;
            return (
              <li
                key={index}
                className={`${styles.answer} ${isCorrect ? styles.answerCorrect : ""}`}
              >
                <span className={styles.answerKey}>{OPTION_KEYS[index]}</span>
                <span>{text}</span>
                {isCorrect && <span className={styles.badge}>Doğru cevap</span>}
              </li>
            );
          })}
        </ul>

        <section className={styles.section}>
          <h2>Neden {OPTION_KEYS[question.correct]}?</h2>
          <p>{question.explanation}</p>
        </section>

        {wrongOptions.length > 0 && (
          <section className={styles.section}>
            <h2>Diğer şıklar neden yanlış?</h2>
            <ul className={styles.reasons}>
              {wrongOptions.map((option) => (
                <li key={option.index}>
                  <span className={styles.answerKey}>
                    {OPTION_KEYS[option.index]}
                  </span>
                  <span>{option.reason}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {question.keyFact && (
          <section className={styles.section}>
            <h2>Bilmen gereken bilgi</h2>
            <p>{question.keyFact}</p>
          </section>
        )}
      </div>
      </QuestionFlow>

      {related.length > 0 && (
        <section className={styles.section}>
          <h2>
            {topic ? `${topic} konusundaki diğer sorular` : "Benzer sorular"}
          </h2>
          <ul className={styles.links}>
            {related.map((q) => {
              const label = topicLabel(q.subject, q.topic);
              return (
                <li key={q.id}>
                  <Link href={questionPath(questionSlug(q))}>
                    {summarize(q.question, 90)}
                    {label && <span className={styles.linkMeta}>{label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {topic && (
        <p className={styles.backLink}>
          <Link href={topicPath(question.subject, question.topic)}>
            ← {topic} konusundaki tüm sorular
          </Link>
        </p>
      )}
    </main>
  );
}
