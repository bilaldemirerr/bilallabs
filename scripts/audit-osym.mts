import fs from "node:fs";
import path from "node:path";
import type { Question } from "../src/lib/kpss/types.ts";
import { coverageKey, questionCoverageKey } from "../src/lib/kpss/coverage.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/osym");

type Section = "gy" | "gk";

type CoverageSlot = {
  section: Section;
  no: number;
};

type CoverageFile = {
  year: number;
  label: string;
  complete?: boolean;
  expected: CoverageSlot[];
  pending?: Array<CoverageSlot & { reason: string }>;
  note?: string;
};

function loadQuestions(year: string): Question[] {
  const file = path.join(CONTENT_DIR, `questions-${year}.json`);
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, "utf8")) as Question[];
}

const coverages = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => f.startsWith("coverage-") && f.endsWith(".json"))
  .sort();

let exitCode = 0;

for (const file of coverages) {
  const cov = JSON.parse(
    fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"),
  ) as CoverageFile;
  const questions = loadQuestions(String(cov.year));
  const imported = new Map<string, string>();
  for (const q of questions) {
    const key = questionCoverageKey(q);
    if (key) imported.set(key, q.id);
  }

  const expectedKeys = cov.expected.map((s) => coverageKey(s.section, s.no));
  const pendingKeys = new Set(
    (cov.pending ?? []).map((s) => coverageKey(s.section, s.no)),
  );

  const missing = expectedKeys.filter(
    (key) => !imported.has(key) && !pendingKeys.has(key),
  );
  const extra = [...imported.keys()].filter((key) => !expectedKeys.includes(key));
  const done = expectedKeys.filter((key) => imported.has(key)).length;
  const pending = (cov.pending ?? []).length;

  console.log(
    `\n${cov.year} — ${done}/${cov.expected.length} tam${pending ? `, ${pending} bilinçli bekliyor` : ""}${cov.complete ? " ✓" : ""}`,
  );
  if (cov.note) console.log(`  not: ${cov.note}`);

  for (const key of missing) {
    console.log(`  EKSİK — ${key}`);
    if (cov.complete) exitCode = 1;
  }
  for (const key of extra) {
    console.log(`  FAZLA  — ${key} (${imported.get(key)})`);
  }
  for (const slot of cov.pending ?? []) {
    const key = coverageKey(slot.section, slot.no);
    const status = imported.has(key) ? "eklendi" : `bekliyor (${slot.reason})`;
    console.log(`  pending — ${key}: ${status}`);
  }
}

if (exitCode) {
  console.error("\naudit: eksik soru var");
  process.exit(exitCode);
}
console.log("\nok — tamamlanması gereken yıllarda eksik yok");
