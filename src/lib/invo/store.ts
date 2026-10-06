import { readFileSync } from "node:fs";
import path from "node:path";

export type StoreCopy = {
  name: string;
  subtitle: string;
  promo: string;
  opening: string[];
  featuresHeading: string;
  bullets: string[];
  scope: string;
  freeLine: string;
  plans: string[];
  privacyLabel: string;
  termsLabel: string;
};

const cache = new Map<string, StoreCopy>();

function readTrimmed(dir: string, name: string): string {
  return readFileSync(path.join(dir, name), "utf8").trim();
}

/** Parse one aso/metadata description.md. Throws if the shape drifts. */
export function parseDescription(raw: string): Omit<StoreCopy, "name" | "subtitle" | "promo"> {
  const content = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
  const bulletStart = content.findIndex((line) => line.startsWith("•"));
  if (bulletStart < 1) throw new Error("description.md has no feature bullets");

  const opening = content.slice(0, bulletStart - 1);
  const featuresHeading = content[bulletStart - 1];
  let index = bulletStart;
  const bullets: string[] = [];
  while (index < content.length && content[index].startsWith("•")) {
    bullets.push(content[index].replace(/^•\s*/, ""));
    index += 1;
  }
  const scope = content[index];
  const freeLine = content[index + 1];
  const privacyAt = content.findIndex((line) => /:\s*https?:\/\//.test(line));
  const termsAt = content.findIndex((line, i) => i > privacyAt && /:\s*https?:\/\//.test(line));
  if (!scope || !freeLine || privacyAt < 0 || termsAt < 0) {
    throw new Error("description.md is missing scope, plans, or legal lines");
  }
  const plans = content.slice(index + 2, privacyAt - 1);
  const privacyLabel = content[privacyAt].replace(/:\s*https?:\/\/\S+\s*$/, "").trim();
  const termsLabel = content[termsAt].replace(/:\s*https?:\/\/\S+\s*$/, "").trim();
  if (opening.length === 0 || bullets.length < 8 || plans.length !== 4) {
    throw new Error(
      `description.md shape: opening ${opening.length}, bullets ${bullets.length}, plans ${plans.length}`,
    );
  }
  return { opening, featuresHeading, bullets, scope, freeLine, plans, privacyLabel, termsLabel };
}

export function readStore(storeDir: string): StoreCopy {
  const hit = cache.get(storeDir);
  if (hit) return hit;
  const dir = path.join(process.cwd(), "content", "invo", "store", storeDir);
  const copy: StoreCopy = {
    name: readTrimmed(dir, "name.md"),
    subtitle: readTrimmed(dir, "subtitle.md"),
    promo: readTrimmed(dir, "promotional_text.md"),
    ...parseDescription(readFileSync(path.join(dir, "description.md"), "utf8")),
  };
  cache.set(storeDir, copy);
  return copy;
}
