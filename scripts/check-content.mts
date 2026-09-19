import fs from "node:fs";
import path from "node:path";
import { ALL_QUESTIONS, isPublishable } from "../src/lib/kpss/questions.ts";
import { SUBJECT_META, TOPICS } from "../src/lib/kpss/types.ts";
import { questionSlug } from "../src/lib/kpss/slug.ts";
import { questionCoverageKey } from "../src/lib/kpss/coverage.ts";

const PUBLIC_DIR = path.resolve(import.meta.dirname, "..", "public");

/**
 * İçerik kapısı. Soru girişi büyüdükçe darboğaz kod değil "bu soru gerçekten
 * yayınlanabilir ve doğru mu?" olacak; bu script o soruyu otomatik sorar.
 * Hata varsa çıkış kodu 1 döner, yani CI/build öncesi durdurur.
 */
const errors: string[] = [];
const warnings: string[] = [];

const seenIds = new Set<string>();
const seenSlugs = new Set<string>();
const seenQuestionText = new Map<string, string>();
const seenSourceKeys = new Set<string>();

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

for (const q of ALL_QUESTIONS) {
  const where = `${q.id}`;

  if (seenIds.has(q.id)) errors.push(`${where}: id tekrar ediyor`);
  seenIds.add(q.id);

  if (q.sourceYear) {
    const sourceKey = questionCoverageKey(q);
    if (sourceKey) {
      const yearKey = `${q.sourceYear}:${sourceKey}`;
      if (seenSourceKeys.has(yearKey)) {
        errors.push(`${where}: ${yearKey} kaynak numarası başka soruda var`);
      }
      seenSourceKeys.add(yearKey);
    }
  }

  const slug = questionSlug(q);
  if (seenSlugs.has(slug)) errors.push(`${where}: slug çakışıyor (${slug})`);
  seenSlugs.add(slug);

  const fingerprint = normalize(q.question);
  const duplicate = seenQuestionText.get(fingerprint);
  if (duplicate) {
    errors.push(`${where}: soru metni ${duplicate} ile birebir aynı`);
  }
  seenQuestionText.set(fingerprint, q.id);

  if (!TOPICS[q.subject][q.topic]) {
    errors.push(
      `${where}: "${q.topic}" konusu ${q.subject} sözlüğünde yok. Geçerli: ${Object.keys(TOPICS[q.subject]).join(", ")}`,
    );
  }

  if (q.section !== SUBJECT_META[q.subject].section) {
    errors.push(`${where}: bölüm (${q.section}) ders ile uyuşmuyor`);
  }

  if (new Set(q.options).size !== q.options.length) {
    errors.push(`${where}: şıklarda tekrar var`);
  }
  if (q.options.some((option) => option.trim() === "")) {
    errors.push(`${where}: boş şık var`);
  }

  if (q.figure) {
    if (!q.figure.src.startsWith("/")) {
      errors.push(`${where}: figure.src / ile başlamalı (${q.figure.src})`);
    } else if (!fs.existsSync(path.join(PUBLIC_DIR, q.figure.src))) {
      errors.push(`${where}: figure dosyası yok (${q.figure.src})`);
    }
    if (q.figure.alt.trim().length < 8) {
      errors.push(`${where}: figure alt metni çok kısa`);
    }
  }

  if (q.explanation.trim().length < 40) {
    errors.push(
      `${where}: çözüm çok kısa (${q.explanation.trim().length} karakter). Çözümsüz soru ne öğretir ne aramada karşılık bulur.`,
    );
  }

  if (q.copyrightStatus === "unknown" && q.reviewStatus === "approved") {
    errors.push(`${where}: telif durumu belirsizken onaylanmış`);
  }

  if (q.distractors) {
    for (const key of Object.keys(q.distractors)) {
      const index = Number(key);
      if (index === q.correct) {
        errors.push(`${where}: doğru şık için çeldirici açıklaması yazılmış`);
      }
      if (!Number.isInteger(index) || index < 0 || index > 4) {
        errors.push(`${where}: geçersiz çeldirici indeksi (${key})`);
      }
    }
  }

  if (q.sourceYear && (q.sourceYear < 1999 || q.sourceYear > 2026)) {
    warnings.push(`${where}: sourceYear şüpheli (${q.sourceYear})`);
  }

  if (isPublishable(q)) {
    if (!q.keyFact) {
      warnings.push(
        `${where}: keyFact yok — sayfa "cevap B" seviyesinde kalıyor, arama değeri düşük`,
      );
    }
    const distractorCount = q.distractors
      ? Object.keys(q.distractors).length
      : 0;
    if (distractorCount === 0) {
      warnings.push(`${where}: çeldiricilerin neden yanlış olduğu yazılmamış`);
    }
  }
}

const publishable = ALL_QUESTIONS.filter(isPublishable);
const blocked = ALL_QUESTIONS.length - publishable.length;

const bySubject = Object.entries(
  publishable.reduce<Record<string, number>>((acc, q) => {
    acc[q.subject] = (acc[q.subject] ?? 0) + 1;
    return acc;
  }, {}),
)
  .map(([subject, count]) => `${subject}:${count}`)
  .join("  ");

console.log(
  `içerik: ${ALL_QUESTIONS.length} soru, ${publishable.length} yayına uygun${blocked ? `, ${blocked} beklemede` : ""}`,
);
console.log(`ders dağılımı: ${bySubject}`);

for (const warning of warnings) console.log(`uyarı  — ${warning}`);
for (const error of errors) console.error(`HATA   — ${error}`);

if (errors.length > 0) {
  console.error(`\n${errors.length} hata bulundu.`);
  process.exit(1);
}
console.log(`\nok — içerik doğrulandı${warnings.length ? `, ${warnings.length} uyarı` : ""}`);
