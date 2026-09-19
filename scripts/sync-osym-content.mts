import fs from "node:fs";
import path from "node:path";
import type { Question } from "../src/lib/kpss/types.ts";
import { questionCoverageKey } from "../src/lib/kpss/coverage.ts";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/osym");
const OUT_DIR = path.join(ROOT, "src/lib/kpss");

function normalize(text: string): string {
  return text.toLowerCase().replace(/\s+/g, " ").trim();
}

function loadAll(): Question[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith("questions-") && f.endsWith(".json"))
    .sort();

  const all: Question[] = [];
  for (const file of files) {
    const year = file.match(/questions-(\d{4})\.json/)?.[1];
    const items = JSON.parse(
      fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"),
    ) as Question[];
    for (const q of items) {
      all.push(q);
    }
    if (year) {
      const outFile = path.join(OUT_DIR, `osym-questions-${year}.ts`);
      const body = `import type { Question } from "@/lib/kpss/types";

export const OSYM_QUESTIONS_${year}: Question[] = ${JSON.stringify(items, null, 2)} as Question[];
`;
      fs.writeFileSync(outFile, body);
      console.log(`yazıldı: ${path.relative(ROOT, outFile)} (${items.length} soru)`);
    }
  }
  return all;
}

const all = loadAll();
const errors: string[] = [];
const seenIds = new Set<string>();
const seenKeys = new Set<string>();
const seenText = new Map<string, string>();

for (const q of all) {
  if (seenIds.has(q.id)) errors.push(`${q.id}: id tekrar ediyor`);
  seenIds.add(q.id);

  const cov = questionCoverageKey(q);
  if (cov && q.sourceYear) {
    const key = `${q.sourceYear}:${cov}`;
    if (seenKeys.has(key)) errors.push(`${q.id}: ${key} kaynak numarası çakışıyor`);
    seenKeys.add(key);
  }

  const fp = normalize(q.question);
  const dup = seenText.get(fp);
  if (dup) errors.push(`${q.id}: soru metni ${dup} ile aynı`);
  seenText.set(fp, q.id);
}

if (errors.length) {
  for (const e of errors) console.error(`HATA — ${e}`);
  process.exit(1);
}

console.log(`\nok — ${all.length} soru, duplicate yok`);
