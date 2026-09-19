import { QuestionFigure } from "@/components/kpss/QuestionFigure";
import type { Question } from "@/lib/kpss/types";
import styles from "@/components/kpss/content.module.css";

type Props = {
  question: Question;
  as?: "h1" | "div";
};

export function QuestionPrompt({ question, as: Tag = "h1" }: Props) {
  return (
    <Tag className={styles.questionPrompt}>
      {question.figure && <QuestionFigure figure={question.figure} />}
      <span className={styles.questionText}>{question.question}</span>
    </Tag>
  );
}
