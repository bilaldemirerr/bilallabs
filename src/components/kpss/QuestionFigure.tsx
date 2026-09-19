import type { QuestionFigure as Figure } from "@/lib/kpss/types";
import styles from "@/components/kpss/content.module.css";

type Props = {
  figure: Figure;
};

export function QuestionFigure({ figure }: Props) {
  return (
    <figure className={styles.questionFigure}>
      {/* eslint-disable-next-line @next/next/no-img-element -- yerel, sabit ÖSYM kırpımları */}
      <img src={figure.src} alt={figure.alt} loading="lazy" decoding="async" />
    </figure>
  );
}
