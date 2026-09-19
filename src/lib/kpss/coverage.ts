import type { Question } from "./types.ts";
import { SUBJECT_META } from "./types.ts";

type Section = "gy" | "gk";

/** GK'de 61 = 1. soru; diğer GK soruları kitapçıktaki yerel numara. */
export function coverageKey(section: Section, no: number): string {
  return `${section}:${no}`;
}

export function questionCoverageKey(q: Question): string | null {
  if (q.sourceExamNo === undefined || q.sourceYear === undefined) return null;
  const section = SUBJECT_META[q.subject].section as Section;
  let no = q.sourceExamNo;
  if (section === "gk" && no >= 61) no -= 60;
  return coverageKey(section, no);
}
