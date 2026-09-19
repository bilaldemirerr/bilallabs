import type { Question } from "./types";
import { OSYM_QUESTIONS_2010 } from "./osym-questions-2010.ts";
import { OSYM_QUESTIONS_2012 } from "./osym-questions-2012.ts";
import { OSYM_QUESTIONS_2014 } from "./osym-questions-2014.ts";
import { OSYM_QUESTIONS_2016 } from "./osym-questions-2016.ts";
import { OSYM_QUESTIONS_2018 } from "./osym-questions-2018.ts";
import { OSYM_QUESTIONS_2020 } from "./osym-questions-2020.ts";
import { OSYM_QUESTIONS_2022 } from "./osym-questions-2022.ts";
import { OSYM_QUESTIONS_2024 } from "./osym-questions-2024.ts";

/** Resmi kaynaktan alınmış soru havuzu. */
export const ALL_QUESTIONS: Question[] = [
  ...OSYM_QUESTIONS_2010,
  ...OSYM_QUESTIONS_2012,
  ...OSYM_QUESTIONS_2014,
  ...OSYM_QUESTIONS_2016,
  ...OSYM_QUESTIONS_2018,
  ...OSYM_QUESTIONS_2020,
  ...OSYM_QUESTIONS_2022,
  ...OSYM_QUESTIONS_2024,
];

export function isPublishable(question: Question): boolean {
  return (
    question.reviewStatus === "approved" &&
    question.copyrightStatus === "cleared"
  );
}

/** Uygulamanın ve statik sayfaların gördüğü havuz. */
export const QUESTIONS: Question[] = ALL_QUESTIONS.filter(isPublishable);

export function getQuestionById(id: string): Question | undefined {
  return QUESTIONS.find((q) => q.id === id);
}
