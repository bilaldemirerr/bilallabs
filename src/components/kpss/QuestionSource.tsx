import {
  formatQuestionSource,
  getQuestionSourceUrl,
} from "@/lib/kpss/source";
import type { Question } from "@/lib/kpss/types";
import styles from "./content.module.css";

type Props = {
  question: Pick<
    Question,
    "source" | "sourceYear" | "sourceExamNo"
  >;
  className?: string;
};

export function QuestionSource({ question, className }: Props) {
  const label = formatQuestionSource(question);
  if (!label) return null;

  const url = getQuestionSourceUrl(question);
  const classNames = [styles.source, className].filter(Boolean).join(" ");

  if (url) {
    return (
      <p className={classNames}>
        Kaynak:{" "}
        <a href={url} target="_blank" rel="noopener noreferrer">
          {label}
        </a>
      </p>
    );
  }

  return <p className={classNames}>Kaynak: {label}</p>;
}
